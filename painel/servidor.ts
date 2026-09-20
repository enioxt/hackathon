// Centro de controle — serve o painel do gestor e liga o chat a um processo do Claude Code (um PID por pergunta, mesma sessão).
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFileSync, existsSync, appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { criarManipuladorApi } from "./api.ts";
import { criarAcesso } from "./acesso.ts";
import { criarRotasTelemetria } from "./telemetria-rotas.ts";
import { hashCurto, saltoDoDia } from "./telemetria.ts";

const RAIZ = import.meta.dir, DADOS = RAIZ + "/dados", PAINEL = RAIZ + "/gestor.html";
const MODELO = process.env.CCO_MODELO ?? "claude-opus-5", PORTA = Number(process.env.CCO_PORTA ?? 8787);
// tetos do chat sem login (visitante da internet) — todos configuráveis por env para o dia da banca.
const TETO_HORA_VISITANTE = Number(process.env.CCO_TETO_HORA ?? 12);
const TETO_DIA_GLOBAL = Number(process.env.CCO_TETO_DIA ?? 400);
const PARALELO_MAX = Number(process.env.CCO_PARALELO ?? 2);
const TAMANHO_MAX_PERGUNTA = 600;
mkdirSync(RAIZ + "/dados-vivos", { recursive: true });
const manipularApi = criarManipuladorApi(process.env.CCO_LEITURAS_DB ?? RAIZ + "/dados-vivos/leituras.sqlite", (e) => telemetriaRotas.telemetria.registrar(e));
const telemetriaRotas = criarRotasTelemetria(process.env.CCO_TELEMETRIA_DB ?? RAIZ + "/dados-vivos/telemetria.sqlite");
const tel = telemetriaRotas.telemetria.registrar;
// CCO_TETO_DIA_LOGADO é o teto por pessoa LOGADA (link individual); CCO_TETO_DIA (abaixo) é o teto GLOBAL sem login — nomes diferentes de propósito.
const acesso = criarAcesso(RAIZ + "/acessos.json", { exigeLogin: process.env.CCO_EXIGE_LOGIN === "1", tetoDia: Number(process.env.CCO_TETO_DIA_LOGADO ?? 30) });
let sessao: string | null = null;
let emAndamento = 0;
let diaGlobalAtual = saltoDoDia();
let perguntasHojeGlobal = 0;
const perguntasPorVisitanteHora = new Map<string, number>(); // `${hashVisitante}|${AAAA-MM-DDTHH}` -> contagem
const registro = (o: object) => appendFileSync(RAIZ + "/atividade.jsonl", JSON.stringify({ t: new Date().toISOString(), ...o }) + "\n");

function chaveHoraAtual(): string { return new Date().toISOString().slice(0, 13); }

function visitanteHash(req: Request, server: { requestIP(req: Request): { address: string } | null } | undefined): string {
  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? server?.requestIP(req)?.address ?? "desconhecido";
  return hashCurto(ip, saltoDoDia());
}

// serve tudo de casa: biblioteca de mapa e imagens do mapa saem desta máquina (o painel abre sem internet)
const local = (h: string) => h
  .replace(/https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/leaflet\/1\.9\.4\//g, "/vendor/")
  .replace(/https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/leaflet\.heat\/0\.2\.0\//g, "/vendor/")
  .replace(/https:\/\/\{s\}\.basemaps\.cartocdn\.com\/dark_all\/\{z\}\/\{x\}\/\{y\}\{r\}\.png/g, "/tiles/{z}/{x}/{y}.png")
  .replace(/https:\/\/\{s\}\.tile\.openstreetmap\.org\/\{z\}\/\{x\}\/\{y\}\.png/g, "/tiles/{z}/{x}/{y}.png");

function perguntar(msg: string, envia: (ev: object) => void): Promise<void> {
  return new Promise((fim) => {
    const inicio = performance.now();
    const ferramentasUsadas = new Set<string>();
    tel({ agente: "assistente", acao: "pergunta-inicio", origem: "real", ok: true, resumo: `pergunta iniciada (${msg.length} letras)`, detalhe: { primeiras_letras: msg.slice(0, 60), tamanho: msg.length } });
    const args = ["-p", msg, "--model", MODELO, "--output-format", "stream-json", "--verbose",
      "--allowedTools", "Read", "Grep", "Glob", "--disallowedTools", "Bash", "Write", "Edit", "WebFetch", "WebSearch", "Agent", "NotebookEdit"];
    if (sessao) args.push("--resume", sessao); else { sessao = randomUUID(); args.push("--session-id", sessao); }
    const p = spawn("claude", args, { cwd: DADOS, env: { ...process.env, EGOS_PROSA_GATE_OFF: "1" } });
    envia({ tipo: "inicio", pid: p.pid, modelo: MODELO, sessao }); registro({ ev: "inicio", pid: p.pid, msg });
    let resto = "", respondeu = false;
    p.stdout.on("data", (b) => {
      resto += b.toString(); const linhas = resto.split("\n"); resto = linhas.pop() ?? "";
      for (const l of linhas) { if (!l.trim()) continue; let j: any; try { j = JSON.parse(l); } catch { continue; }
        if (j.type === "assistant") for (const c of j.message?.content ?? []) {
          if (c.type === "tool_use") { ferramentasUsadas.add(String(c.name)); envia({ tipo: "acao", ferramenta: c.name, alvo: String(c.input?.file_path ?? c.input?.pattern ?? "").replace(DADOS + "/", "") }); }
        }
        if (j.type === "result") {
          respondeu = true; envia({ tipo: "resposta", texto: j.result ?? "", erro: !!j.is_error, ms: j.duration_ms }); registro({ ev: "resposta", ms: j.duration_ms, erro: !!j.is_error });
          tel({ agente: "assistente", acao: "pergunta-fim", origem: "real", ok: !j.is_error, duracao_ms: j.duration_ms ?? Math.round(performance.now() - inicio), custo_tokens: j.usage?.output_tokens ?? j.usage?.total_tokens ?? undefined, resumo: `resposta em ${j.duration_ms ?? "?"}ms · ferramentas: ${[...ferramentasUsadas].join(",") || "nenhuma"}`, detalhe: { ferramentas: [...ferramentasUsadas] } });
        }
      }
    });
    let err = ""; p.stderr.on("data", (b) => (err += b.toString()));
    p.on("close", (c) => {
      if (!respondeu) {
        envia({ tipo: "resposta", erro: true, texto: "Não consegui responder (saída " + c + "). " + err.slice(-300) }); registro({ ev: "falha", c, err: err.slice(-300) });
        tel({ agente: "assistente", acao: "pergunta-falha", origem: "real", ok: false, duracao_ms: Math.round(performance.now() - inicio), resumo: `sem resposta (saída ${c})` });
      }
      envia({ tipo: "fim" }); fim();
    });
  });
}

async function roteador(req: Request, server?: { requestIP(req: Request): { address: string } | null }): Promise<Response> {
  const u = new URL(req.url);
  { const e = acesso.entrar(u); if (e) { registro({ ev: "entrada", ok: e.status === 302 }); return e; } }
  if (u.pathname === "/quem") { const p = acesso.quem(req); return Response.json(p ? { nome: p.nome } : { nome: null }, { status: p ? 200 : 401 }); }
  if (u.pathname.startsWith("/api/telemetria/")) { const r = await telemetriaRotas.manipular(req, u); if (r) return r; }
  if (u.pathname.startsWith("/api/")) { const r = await manipularApi(req, u); if (r) return r; }
  if (u.pathname === "/entrada") {
    const fontesRaw = existsSync(RAIZ + "/fontes.json") ? JSON.parse(readFileSync(RAIZ + "/fontes.json", "utf8")) : { fontes: {} };
    const chaveDemo = Object.keys(fontesRaw.fontes ?? {})[0] ?? "";
    return new Response(readFileSync(RAIZ + "/entrada.html", "utf8").replace("__CHAVE_DEMO__", chaveDemo), { headers: { "content-type": "text/html; charset=utf-8" } });
  }
  if (u.pathname === "/cliente-dados.js") return new Response(readFileSync(RAIZ + "/cliente-dados.js"), { headers: { "content-type": "text/javascript; charset=utf-8" } });
  if (u.pathname === "/chat" && req.method === "POST") {
    const pode = acesso.podePerguntar(req); if (!pode.ok) return new Response(pode.motivo, { status: pode.status, headers: { "content-type": "text/plain; charset=utf-8" } });
    const visitante = visitanteHash(req, server);
    const chaveVisHora = visitante + "|" + chaveHoraAtual();
    const nHora = perguntasPorVisitanteHora.get(chaveVisHora) ?? 0;
    if (nHora >= TETO_HORA_VISITANTE) {
      tel({ agente: "assistente", acao: "recusa-teto-visitante", origem: "real", ok: false, resumo: `teto de ${TETO_HORA_VISITANTE}/hora por visitante atingido` });
      return new Response(`Limite de ${TETO_HORA_VISITANTE} perguntas por hora atingido. Tente novamente daqui a pouco.`, { status: 429, headers: { "content-type": "text/plain; charset=utf-8" } });
    }
    const diaAgora = saltoDoDia();
    if (diaAgora !== diaGlobalAtual) { diaGlobalAtual = diaAgora; perguntasHojeGlobal = 0; }
    if (perguntasHojeGlobal >= TETO_DIA_GLOBAL) {
      tel({ agente: "assistente", acao: "recusa-teto-dia", origem: "real", ok: false, resumo: `teto diário global de ${TETO_DIA_GLOBAL} perguntas atingido` });
      return new Response("Limite de perguntas de hoje atingido. Volte amanhã.", { status: 429, headers: { "content-type": "text/plain; charset=utf-8" } });
    }
    if (emAndamento >= PARALELO_MAX) {
      tel({ agente: "assistente", acao: "recusa-ocupado", origem: "real", ok: false, resumo: `${PARALELO_MAX} perguntas já em execução` });
      return new Response("o agente está ocupado, tente em alguns segundos", { status: 429, headers: { "content-type": "text/plain; charset=utf-8" } });
    }
    const { msg } = await req.json().catch(() => ({ msg: "" }));
    if (!msg || String(msg).length > TAMANHO_MAX_PERGUNTA) return new Response(`mensagem vazia ou longa demais (máximo ${TAMANHO_MAX_PERGUNTA} letras)`, { status: 400 });
    registro({ ev: "pergunta-de", quem: pode.pessoa?.nome ?? "local" });
    perguntasPorVisitanteHora.set(chaveVisHora, nHora + 1);
    perguntasHojeGlobal++;
    emAndamento++;
    const enc = new TextEncoder();
    return new Response(new ReadableStream({ async start(ctl) {
      const envia = (ev: object) => { try { ctl.enqueue(enc.encode("data: " + JSON.stringify(ev) + "\n\n")); } catch { /* cliente já fechou */ } };
      try { await perguntar(String(msg), envia); } finally { emAndamento--; try { ctl.close(); } catch { /* já fechado */ } }
    } }), { headers: { "content-type": "text/event-stream", "cache-control": "no-cache" } });
  }
  if (u.pathname.startsWith("/vendor/")) { const f = RAIZ + u.pathname.replace(/\.\./g, ""); if (!existsSync(f)) return new Response("", { status: 404 });
    const tipo = f.endsWith(".css") ? "text/css" : f.endsWith(".js") ? "text/javascript" : "image/png"; return new Response(readFileSync(f), { headers: { "content-type": tipo, "cache-control": "max-age=86400" } }); }
  const mt = u.pathname.match(/^\/tiles\/(\d+)\/(\d+)\/(\d+)\.png$/);
  if (mt) { const [, z, x, y] = mt, f = `${RAIZ}/tiles/${z}/${x}/${y}.png`;
    if (existsSync(f)) return new Response(readFileSync(f), { headers: { "content-type": "image/png", "cache-control": "max-age=86400" } });
    try { const r = await fetch(`https://tile.openstreetmap.org/${z}/${x}/${y}.png`, { headers: { "User-Agent": "VisaoDeRota-hackathon/1.0 (demonstracao local)" }, signal: AbortSignal.timeout(8000) });
      if (!r.ok) return new Response("", { status: 404 }); const b = Buffer.from(await r.arrayBuffer()); mkdirSync(`${RAIZ}/tiles/${z}/${x}`, { recursive: true }); writeFileSync(f, b);
      return new Response(b, { headers: { "content-type": "image/png" } }); } catch { return new Response("", { status: 404 }); } }
  if (u.pathname === "/tour.js") return new Response(readFileSync(RAIZ + "/tour.js"), { headers: { "content-type": "text/javascript; charset=utf-8" } });
  if (u.pathname === "/participacao") return new Response(readFileSync(RAIZ + "/participacao.html", "utf8"), { headers: { "content-type": "text/html; charset=utf-8" } });
  if (u.pathname === "/entrar") { try { return new Response(readFileSync(RAIZ + "/entrar.html", "utf8"), { headers: { "content-type": "text/html; charset=utf-8" } }); } catch { return new Response("página em construção", { status: 503 }); } }
  if (u.pathname === "/inicio") { try { return new Response(readFileSync(RAIZ + "/inicio.html", "utf8"), { headers: { "content-type": "text/html; charset=utf-8" } }); } catch { return new Response("página em construção", { status: 503 }); } }
  if (u.pathname === "/claro/" || /^\/claro\/(index\.html|app\.js|config\.js|styles\.css|ajustes\.js)$/.test(u.pathname)) {
    const nome = u.pathname === "/claro/" ? "index.html" : u.pathname.slice(7);
    const tipo = nome.endsWith(".js") ? "text/javascript" : nome.endsWith(".css") ? "text/css" : "text/html";
    return new Response(readFileSync(RAIZ + "/claro/" + nome, "utf8"), { headers: { "content-type": tipo + "; charset=utf-8", "cache-control": "no-store" } });
  }
  if (u.pathname === "/claro") { try { return new Response(readFileSync(RAIZ + "/painel-claro.html", "utf8"), { headers: { "content-type": "text/html; charset=utf-8" } }); } catch { return new Response("página em construção", { status: 503 }); } }
  if (u.pathname === "/app-cidadao") return new Response(readFileSync(RAIZ + "/app-cidadao.html", "utf8"), { headers: { "content-type": "text/html; charset=utf-8" } });
  if (u.pathname === "/melhorias.js") return new Response(readFileSync(RAIZ + "/melhorias.js"), { headers: { "content-type": "text/javascript; charset=utf-8" } });
  if (u.pathname === "/sintetizador") return new Response(readFileSync(RAIZ + "/sintetizador.html", "utf8"), { headers: { "content-type": "text/html; charset=utf-8" } });
  if (u.pathname === "/chat.js") return new Response(readFileSync(RAIZ + "/chat.js"), { headers: { "content-type": "text/javascript; charset=utf-8" } });
  if (u.pathname === "/parede") return new Response(readFileSync(RAIZ + "/parede.html", "utf8"), { headers: { "content-type": "text/html; charset=utf-8" } });
  if (u.pathname === "/simulador") return new Response(readFileSync(RAIZ + "/simulador.html", "utf8"), { headers: { "content-type": "text/html; charset=utf-8" } });
  if (u.pathname === "/arquitetura") return new Response(readFileSync(RAIZ + "/arquitetura.html", "utf8"), { headers: { "content-type": "text/html; charset=utf-8" } });
  if (u.pathname === "/observabilidade") {
    const fontesRaw = existsSync(RAIZ + "/fontes.json") ? JSON.parse(readFileSync(RAIZ + "/fontes.json", "utf8")) : { fontes: {} };
    const chaveDemo = Object.keys(fontesRaw.fontes ?? {})[0] ?? "";
    const html = readFileSync(RAIZ + "/observabilidade.html", "utf8").replace("</head>", `<script>window.__VR_CHAVE_DEMO__=${JSON.stringify(chaveDemo)}</script></head>`);
    return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
  }
  if (u.pathname === "/custos") return new Response(readFileSync(RAIZ + "/custos.html", "utf8").replace("</body>", "<script src=/chat.js></script></body>"), { headers: { "content-type": "text/html; charset=utf-8" } });
  if (u.pathname === "/") {
    if (!existsSync(PAINEL)) return new Response("<meta charset=utf-8><body style='font:16px system-ui;background:#0B1B2B;color:#F6F8FA;padding:40px'>⚪ O painel do gestor ainda está sendo gerado. O chat já funciona:<script src=/chat.js></script>", { headers: { "content-type": "text/html; charset=utf-8" } });
    return new Response(local(readFileSync(PAINEL, "utf8")).replace("</body>", "<script src=/chat.js></script></body>"), { headers: { "content-type": "text/html; charset=utf-8" } });
  }
  return new Response("não encontrado", { status: 404 });
}

/** Cabeçalhos de segurança em toda resposta HTML — o chat vai receber gente de fora amanhã. */
async function fetchComCabecalhos(req: Request, server?: { requestIP(req: Request): { address: string } | null }): Promise<Response> {
  const r = await roteador(req, server);
  if ((r.headers.get("content-type") ?? "").includes("text/html")) {
    r.headers.set("x-content-type-options", "nosniff");
    r.headers.set("referrer-policy", "no-referrer");
  }
  return r;
}

// exportado para teste (bun test importa isto direto, sem abrir porta de rede)
export { fetchComCabecalhos as fetch, telemetriaRotas };

if (import.meta.main) {
  Bun.serve({ port: PORTA, hostname: "127.0.0.1", idleTimeout: 255, fetch: fetchComCabecalhos });
  console.log("centro de controle em http://127.0.0.1:" + PORTA + " · modelo " + MODELO);
}

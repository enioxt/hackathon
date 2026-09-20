// Centro de controle — serve o painel do gestor e liga o chat a um processo do Claude Code (um PID por pergunta, mesma sessão).
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFileSync, existsSync, appendFileSync, mkdirSync, writeFileSync } from "node:fs";
const RAIZ = import.meta.dir, DADOS = RAIZ + "/dados", PAINEL = RAIZ + "/../gestor.html";
const MODELO = process.env.CCO_MODELO ?? "claude-opus-5", PORTA = Number(process.env.CCO_PORTA ?? 8787);
let sessao: string | null = null, ocupado = false;
const registro = (o: object) => appendFileSync(RAIZ + "/atividade.jsonl", JSON.stringify({ t: new Date().toISOString(), ...o }) + "\n");

// serve tudo de casa: biblioteca de mapa e imagens do mapa saem desta máquina (o painel abre sem internet)
const local = (h: string) => h
  .replace(/https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/leaflet\/1\.9\.4\//g, "/vendor/")
  .replace(/https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/leaflet\.heat\/0\.2\.0\//g, "/vendor/")
  .replace(/https:\/\/\{s\}\.basemaps\.cartocdn\.com\/dark_all\/\{z\}\/\{x\}\/\{y\}\{r\}\.png/g, "/tiles/{z}/{x}/{y}.png")
  .replace(/https:\/\/\{s\}\.tile\.openstreetmap\.org\/\{z\}\/\{x\}\/\{y\}\.png/g, "/tiles/{z}/{x}/{y}.png");

function perguntar(msg: string, envia: (ev: object) => void): Promise<void> {
  return new Promise((fim) => {
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
          if (c.type === "tool_use") envia({ tipo: "acao", ferramenta: c.name, alvo: String(c.input?.file_path ?? c.input?.pattern ?? "").replace(DADOS + "/", "") });
        }
        if (j.type === "result") { respondeu = true; envia({ tipo: "resposta", texto: j.result ?? "", erro: !!j.is_error, ms: j.duration_ms }); registro({ ev: "resposta", ms: j.duration_ms, erro: !!j.is_error }); }
      }
    });
    let err = ""; p.stderr.on("data", (b) => (err += b.toString()));
    p.on("close", (c) => { if (!respondeu) { envia({ tipo: "resposta", erro: true, texto: "Não consegui responder (saída " + c + "). " + err.slice(-300) }); registro({ ev: "falha", c, err: err.slice(-300) }); } envia({ tipo: "fim" }); fim(); });
  });
}

Bun.serve({ port: PORTA, hostname: "127.0.0.1", idleTimeout: 255, async fetch(req) {
  const u = new URL(req.url);
  if (u.pathname === "/chat" && req.method === "POST") {
    const { msg } = await req.json().catch(() => ({ msg: "" }));
    if (!msg || String(msg).length > 2000) return new Response("mensagem vazia ou longa demais", { status: 400 });
    if (ocupado) return new Response("ainda respondendo a pergunta anterior", { status: 429 });
    ocupado = true; const enc = new TextEncoder();
    return new Response(new ReadableStream({ async start(ctl) {
      const envia = (ev: object) => { try { ctl.enqueue(enc.encode("data: " + JSON.stringify(ev) + "\n\n")); } catch {} };
      try { await perguntar(String(msg), envia); } finally { ocupado = false; try { ctl.close(); } catch {} }
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
  if (u.pathname === "/chat.js") return new Response(readFileSync(RAIZ + "/chat.js"), { headers: { "content-type": "text/javascript; charset=utf-8" } });
  if (u.pathname === "/parede") return new Response(readFileSync(RAIZ + "/parede.html", "utf8"), { headers: { "content-type": "text/html; charset=utf-8" } });
  if (u.pathname === "/custos") return new Response(readFileSync(RAIZ + "/custos.html", "utf8").replace("</body>", "<script src=/chat.js></script></body>"), { headers: { "content-type": "text/html; charset=utf-8" } });
  if (u.pathname === "/") {
    if (!existsSync(PAINEL)) return new Response("<meta charset=utf-8><body style='font:16px system-ui;background:#0B1B2B;color:#F6F8FA;padding:40px'>⚪ O painel do gestor ainda está sendo gerado. O chat já funciona:<script src=/chat.js></script>", { headers: { "content-type": "text/html; charset=utf-8" } });
    return new Response(local(readFileSync(PAINEL, "utf8")).replace("</body>", "<script src=/chat.js></script></body>"), { headers: { "content-type": "text/html; charset=utf-8" } });
  }
  return new Response("não encontrado", { status: 404 });
} });
console.log("centro de controle em http://127.0.0.1:" + PORTA + " · modelo " + MODELO);

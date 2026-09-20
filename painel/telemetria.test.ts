// cco/telemetria.test.ts — testa o barramento de eventos e as rotas que expõem estado sem vazar dado.
// Usa sempre banco TEMPORÁRIO (nunca cco/dados-vivos/telemetria.sqlite).
import { test, expect } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { Database } from "bun:sqlite";
import { criarTelemetria, hashCurto, saltoDoDia, type EventoEntrada } from "./telemetria.ts";
import { criarManipuladorApi } from "./api.ts";

function novoBanco(): { dir: string; caminho: string } {
  const dir = mkdtempSync(`${tmpdir()}/vr-tel-`);
  return { dir, caminho: `${dir}/telemetria.sqlite` };
}

const evtBase = (over: Partial<EventoEntrada> = {}): EventoEntrada => ({
  agente: "assistente", acao: "teste", origem: "real", ok: true, resumo: "evento de teste", ...over,
});

test("evento sem origem válida é recusado", () => {
  const { dir, caminho } = novoBanco();
  const tel = criarTelemetria(caminho);
  // @ts-expect-error — testando exatamente a entrada inválida que a régua deve barrar
  expect(() => tel.registrar(evtBase({ origem: "quase-real" }))).toThrow(/origem/i);
  rmSync(dir, { recursive: true, force: true });
});

test("agente desconhecido é recusado", () => {
  const { dir, caminho } = novoBanco();
  const tel = criarTelemetria(caminho);
  // @ts-expect-error — agente fora da lista fixa
  expect(() => tel.registrar(evtBase({ agente: "agente-inventado" }))).toThrow(/agente/i);
  rmSync(dir, { recursive: true, force: true });
});

test("resumo longo é truncado — telemetria nunca guarda texto enorme por inteiro", () => {
  const { dir, caminho } = novoBanco();
  const tel = criarTelemetria(caminho);
  const textoEnorme = "x".repeat(5000);
  const gravado = tel.registrar(evtBase({ resumo: textoEnorme }));
  expect(gravado.resumo.length).toBeLessThanOrEqual(200);
  expect(gravado.resumo.length).toBeLessThan(textoEnorme.length);
  rmSync(dir, { recursive: true, force: true });
});

test("detalhe grande demais é substituído por um marcador (nunca estoura 2KB)", () => {
  const { dir, caminho } = novoBanco();
  const tel = criarTelemetria(caminho);
  const gravado = tel.registrar(evtBase({ detalhe: { blob: "y".repeat(10000) } }));
  expect(JSON.stringify(gravado.detalhe).length).toBeLessThan(200);
  expect(gravado.detalhe).toHaveProperty("truncado", true);
  rmSync(dir, { recursive: true, force: true });
});

test("hashCurto nunca contém o valor original e é estável para o mesmo sal", () => {
  const ip = "203.0.113.77";
  const sal = saltoDoDia(new Date("2026-09-20T12:00:00Z"));
  const h1 = hashCurto(ip, sal), h2 = hashCurto(ip, sal);
  expect(h1).toBe(h2); // mesmo dia, mesmo visitante → mesmo hash (é o que sustenta o teto por hora)
  expect(h1).not.toContain("203");
  expect(h1).not.toContain(ip);
  expect(h1.length).toBe(12);
  const outroSal = saltoDoDia(new Date("2026-09-21T12:00:00Z"));
  expect(hashCurto(ip, outroSal)).not.toBe(h1); // sal de outro dia → hash diferente, não dá pra juntar os dois dias
});

test("pergunta de visitante nunca é gravada inteira — só tamanho e 60 primeiras letras cabem no detalhe", () => {
  const { dir, caminho } = novoBanco();
  const tel = criarTelemetria(caminho);
  const perguntaReal = "Quantas câmeras cobrem a avenida principal e qual o custo mensal disso? ".repeat(5); // >200 letras
  const gravado = tel.registrar(evtBase({
    acao: "pergunta-inicio",
    resumo: `pergunta iniciada (${perguntaReal.length} letras)`,
    detalhe: { primeiras_letras: perguntaReal.slice(0, 60), tamanho: perguntaReal.length },
  }));
  expect(gravado.detalhe?.primeiras_letras).toBe(perguntaReal.slice(0, 60));
  expect(String(gravado.detalhe?.primeiras_letras).length).toBeLessThanOrEqual(60);
  expect(JSON.stringify(gravado)).not.toContain(perguntaReal.slice(100)); // o meio/fim da pergunta não sobrevive em lugar nenhum
  rmSync(dir, { recursive: true, force: true });
});

test("agente sem evento recente aparece calado", () => {
  const { dir, caminho } = novoBanco();
  const tel = criarTelemetria(caminho);
  const r = tel.resumo();
  const leitor = r.agentes.find((a) => a.agente === "leitor-de-video")!;
  expect(leitor.estado).toBe("calado");
  expect(leitor.ultimo).toBeNull();
  rmSync(dir, { recursive: true, force: true });
});

test("agente com evento recente e ok aparece ativo; com falha aparece com-erro", () => {
  const { dir, caminho } = novoBanco();
  const tel = criarTelemetria(caminho);
  tel.registrar(evtBase({ agente: "agregador", ok: true }));
  expect(tel.resumo().agentes.find((a) => a.agente === "agregador")!.estado).toBe("ativo");
  tel.registrar(evtBase({ agente: "agregador", ok: false }));
  expect(tel.resumo().agentes.find((a) => a.agente === "agregador")!.estado).toBe("com-erro");
  rmSync(dir, { recursive: true, force: true });
});

test("evento antigo (>3min) vira calado mesmo tendo ocorrido antes", () => {
  const { dir, caminho } = novoBanco();
  const tel = criarTelemetria(caminho);
  const gravado = tel.registrar(evtBase({ agente: "leitor-de-video" }));
  // empurra o ts do evento para 10min atrás direto no banco — só um teste faria isso
  const db2 = new Database(caminho);
  const antigo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  db2.query(`UPDATE eventos SET ts = $ts WHERE id = $id`).run({ $ts: antigo, $id: gravado.id });
  db2.close();
  expect(tel.resumo().agentes.find((a) => a.agente === "leitor-de-video")!.estado).toBe("calado");
  rmSync(dir, { recursive: true, force: true });
});

test("resumo separa eventos reais de simulados", () => {
  const { dir, caminho } = novoBanco();
  const tel = criarTelemetria(caminho);
  tel.registrar(evtBase({ agente: "gerador-de-fluxo", origem: "simulado" }));
  tel.registrar(evtBase({ agente: "gerador-de-fluxo", origem: "simulado" }));
  tel.registrar(evtBase({ agente: "gerador-de-fluxo", origem: "real" }));
  const a = tel.resumo().agentes.find((x) => x.agente === "gerador-de-fluxo")!;
  expect(a.eventos_1h).toBe(3);
  expect(a.simulados_1h).toBe(2);
  expect(a.reais_1h).toBe(1);
  rmSync(dir, { recursive: true, force: true });
});

test("assinar entrega evento novo (é o motor por trás do SSE)", () => {
  const { dir, caminho } = novoBanco();
  const tel = criarTelemetria(caminho);
  const recebidas: string[] = [];
  const parar = tel.assinar((linha) => recebidas.push(linha));
  expect(tel.contarAssinantes()).toBe(1);
  const gravado = tel.registrar(evtBase({ resumo: "evento ao vivo" }));
  expect(recebidas.length).toBe(1);
  expect(recebidas[0]).toContain("evento ao vivo");
  expect(JSON.parse(recebidas[0].replace(/^data: /, "").trim())).toMatchObject({ id: gravado.id, resumo: "evento ao vivo" });
  parar();
  expect(tel.contarAssinantes()).toBe(0);
  tel.registrar(evtBase());
  expect(recebidas.length).toBe(1); // depois de cancelar, não recebe mais nada
  rmSync(dir, { recursive: true, force: true });
});

test("porta-de-entrada e verificador-de-privacidade acendem juntos numa recusa por dado pessoal", async () => {
  const { dir, caminho } = novoBanco();
  const tel = criarTelemetria(caminho);
  const dirLeituras = mkdtempSync(`${tmpdir()}/vr-leituras-`);
  const manipular = criarManipuladorApi(`${dirLeituras}/leituras.sqlite`, tel.registrar);
  const fontes = (await import("./fontes.json")) as { fontes: Record<string, { fonte_id: string }> };
  const [chave] = Object.entries(fontes.fontes).find(([, f]) => f.fonte_id === "prefeitura-demo")!;
  const corpo = { fonte_id: "prefeitura-demo", camera_id: "ABC1D23", ts: "2026-09-19T20:00:00Z", janela_s: 60, contagens: { automovel: 1 }, origem: "sintetico" };
  await manipular(new Request("http://local/api/leituras", { method: "POST", headers: { "content-type": "application/json", "x-fonte-chave": chave }, body: JSON.stringify(corpo) }), new URL("http://local/api/leituras"));
  expect(tel.ultimos(10, "porta-de-entrada").length).toBe(1);
  expect(tel.ultimos(10, "verificador-de-privacidade").length).toBe(1);
  expect(tel.ultimos(10, "verificador-de-privacidade")[0].resumo).toMatch(/placa/i);
  rmSync(dir, { recursive: true, force: true });
  rmSync(dirLeituras, { recursive: true, force: true });
});

test("agregador acende numa consulta real a /api/estado", async () => {
  const { dir, caminho } = novoBanco();
  const tel = criarTelemetria(caminho);
  const dirLeituras = mkdtempSync(`${tmpdir()}/vr-leituras-`);
  const manipular = criarManipuladorApi(`${dirLeituras}/leituras.sqlite`, tel.registrar);
  await manipular(new Request("http://local/api/estado"), new URL("http://local/api/estado"));
  const eventos = tel.ultimos(10, "agregador");
  expect(eventos.length).toBe(1);
  expect(eventos[0].origem).toBe("real");
  rmSync(dir, { recursive: true, force: true });
  rmSync(dirLeituras, { recursive: true, force: true });
});

// --- integração com o servidor: rotas de teto e caminhos que nunca podem servir arquivo sensível ---
// cada import usa CCO_TELEMETRIA_DB/CCO_LEITURAS_DB próprios (bancos temporários) e um teto zerado
// para provar o 429 SEM nunca chegar a chamar o `claude` de verdade (o teto barra antes do spawn).

async function importarServidorComEnv(env: Record<string, string>, marca: string): Promise<{ fetch: (req: Request) => Promise<Response> }> {
  const antes = { ...process.env };
  Object.assign(process.env, env);
  try {
    const mod = (await import(`./servidor.ts?${marca}`)) as { fetch: (req: Request) => Promise<Response> };
    return mod;
  } finally {
    process.env = antes;
  }
}

test("teto por visitante (CCO_TETO_HORA) devolve 429 sem nunca chamar o assistente", async () => {
  const dirTel = mkdtempSync(`${tmpdir()}/vr-srv-tel-`), dirLei = mkdtempSync(`${tmpdir()}/vr-srv-lei-`);
  const app = await importarServidorComEnv({ CCO_TETO_HORA: "0", CCO_TETO_DIA: "999", CCO_PARALELO: "1", CCO_TELEMETRIA_DB: `${dirTel}/t.sqlite`, CCO_LEITURAS_DB: `${dirLei}/l.sqlite`, CCO_PORTA: "0" }, "tetoHora");
  const r = await app.fetch(new Request("http://local/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ msg: "oi" }) }));
  expect(r.status).toBe(429);
  expect(await r.text()).toMatch(/hora/i);
  rmSync(dirTel, { recursive: true, force: true }); rmSync(dirLei, { recursive: true, force: true });
});

test("teto diário global (CCO_TETO_DIA) devolve 429 sem nunca chamar o assistente", async () => {
  const dirTel = mkdtempSync(`${tmpdir()}/vr-srv-tel-`), dirLei = mkdtempSync(`${tmpdir()}/vr-srv-lei-`);
  const app = await importarServidorComEnv({ CCO_TETO_HORA: "999", CCO_TETO_DIA: "0", CCO_PARALELO: "1", CCO_TELEMETRIA_DB: `${dirTel}/t.sqlite`, CCO_LEITURAS_DB: `${dirLei}/l.sqlite`, CCO_PORTA: "0" }, "tetoDia");
  const r = await app.fetch(new Request("http://local/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ msg: "oi" }) }));
  expect(r.status).toBe(429);
  expect(await r.text()).toMatch(/hoje|dia/i);
  rmSync(dirTel, { recursive: true, force: true }); rmSync(dirLei, { recursive: true, force: true });
});

test("arquivos sensíveis (chave de fonte, cookies, banco) nunca são servidos por caminho direto", async () => {
  const dirTel = mkdtempSync(`${tmpdir()}/vr-srv-tel-`), dirLei = mkdtempSync(`${tmpdir()}/vr-srv-lei-`);
  const app = await importarServidorComEnv({ CCO_TELEMETRIA_DB: `${dirTel}/t.sqlite`, CCO_LEITURAS_DB: `${dirLei}/l.sqlite`, CCO_PORTA: "0" }, "arquivos");
  for (const caminho of ["/fontes.json", "/acessos.json", "/dados-vivos/telemetria.sqlite", "/../fontes.json", "/../../etc/passwd"]) {
    const r = await app.fetch(new Request("http://local" + caminho));
    expect([404, 400]).toContain(r.status);
  }
  rmSync(dirTel, { recursive: true, force: true }); rmSync(dirLei, { recursive: true, force: true });
});

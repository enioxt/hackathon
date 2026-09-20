// cco/api.ts — a porta de entrada de dados. Extraído do servidor.ts para ele não inchar.
// Rotas: POST /api/leituras · POST /api/eventos · PUT /api/cameras (escrita, com chave)
//        GET /api/estado · GET /api/serie · GET /api/antes-depois · GET /api/saude (leitura, local)
import { readFileSync, existsSync } from "node:fs";
import type { Database } from "bun:sqlite";
import { abrirBanco, inserirLeitura, inserirEvento, upsertCamera, registrarRecusa, estadoCameras, serieCamera, antesDepois, saudeFontes } from "./db.ts";
import type { LeituraEntrada, EventoEntrada, CameraEntrada } from "./db.ts";
import { validarLeitura, validarEvento, validarCamera, USANDO_DETECTOR_LOCAL } from "./validar.ts";
import type { EventoEntrada as EventoTelemetria } from "./telemetria.ts";
import { hashCurto, saltoDoDia } from "./telemetria.ts";

// motivo de recusa que indica dado pessoal (privacidade) — usado só para decidir se acende o agente
// verificador-de-privacidade também; o próprio motivo já é seguro de logar (é um rótulo, nunca o valor achado).
const MOTIVO_PRIVACIDADE = /placa|cpf|telefone|e-mail|imagem|rosto|nome de pessoa/i;

// teto de POST /api/leituras por visitante da internet (60/min) — só se aplica quando dá para saber que
// veio de fora (cabeçalho de túnel/proxy presente). Chamada local (nosso próprio gerador de fluxo, testes,
// curl na própria máquina) não carrega esse cabeçalho e por isso não tem teto aqui — ela já é confiável
// por rodar na mesma máquina com a mesma chave; o risco que este teto cobre é abuso vindo da internet.
const TETO_LEITURAS_POR_MINUTO = 60;
const leiturasPorVisitanteMinuto = new Map<string, number>();
function chaveMinutoAtual(): string { return new Date().toISOString().slice(0, 16); }
function visitanteDaRequisicao(req: Request): string | null {
  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return ip ? hashCurto(ip, saltoDoDia()) : null;
}

const RAIZ = import.meta.dir;

type Fonte = { fonte_id: string; nome: string; so_sintetico?: boolean };
type ArquivoFontes = { fontes?: Record<string, Fonte> };
function carregarFontes(): Record<string, Fonte> {
  const caminho = RAIZ + "/fontes.json";
  if (!existsSync(caminho)) return {};
  const j = JSON.parse(readFileSync(caminho, "utf8")) as ArquivoFontes;
  return j.fontes ?? {};
}

function extrairLista(corpo: unknown, chaveLote: string): { lista: unknown[]; ehLote: boolean } {
  if (Array.isArray(corpo)) return { lista: corpo, ehLote: true };
  if (corpo && typeof corpo === "object" && Array.isArray((corpo as Record<string, unknown>)[chaveLote])) return { lista: (corpo as Record<string, unknown>)[chaveLote] as unknown[], ehLote: true };
  return { lista: [corpo], ehLote: false };
}

function extrairFonteId(item: unknown): string | undefined {
  if (item && typeof item === "object" && typeof (item as Record<string, unknown>).fonte_id === "string") return (item as Record<string, unknown>).fonte_id as string;
  return undefined;
}

function json(corpo: unknown, status = 200): Response {
  return new Response(JSON.stringify(corpo), { status, headers: { "content-type": "application/json; charset=utf-8" } });
}

function autenticar(req: Request, fontes: Record<string, Fonte>): { ok: true; fonte: Fonte } | { ok: false; resposta: Response } {
  const chave = req.headers.get("x-fonte-chave");
  if (!chave) return { ok: false, resposta: json({ erro: "cabeçalho x-fonte-chave ausente" }, 401) };
  const fonte = fontes[chave];
  if (!fonte) return { ok: false, resposta: json({ erro: "chave de fonte inválida" }, 401) };
  return { ok: true, fonte };
}

/** Trata uma requisição de API. Devolve null se a rota não é da API (o chamador segue o roteamento normal). */
export function criarManipuladorApi(caminhoBanco: string, registrarTelemetria?: (e: EventoTelemetria) => void) {
  const db: Database = abrirBanco(caminhoBanco);
  // telemetria nunca derruba a porta de entrada: se ela falhar, a leitura/consulta segue normal.
  const tel = (e: EventoTelemetria) => { try { registrarTelemetria?.(e); } catch { /* não propaga */ } };

  return async function manipularApi(req: Request, u: URL): Promise<Response | null> {
    if (!u.pathname.startsWith("/api/")) return null;
    const fontes = carregarFontes();

    if (u.pathname === "/api/leituras" && req.method === "POST") {
      const inicio = performance.now();
      const visitante = visitanteDaRequisicao(req);
      if (visitante) {
        const chaveMin = visitante + "|" + chaveMinutoAtual();
        const n = leiturasPorVisitanteMinuto.get(chaveMin) ?? 0;
        if (n >= TETO_LEITURAS_POR_MINUTO) {
          tel({ agente: "porta-de-entrada", acao: "post-leituras", origem: "real", ok: false, resumo: `teto de ${TETO_LEITURAS_POR_MINUTO} req/min por visitante atingido` });
          return json({ erro: `limite de ${TETO_LEITURAS_POR_MINUTO} requisições por minuto atingido` }, 429);
        }
        leiturasPorVisitanteMinuto.set(chaveMin, n + 1);
      }
      const auth = autenticar(req, fontes);
      if (!auth.ok) return auth.resposta;
      const corpo = await req.json().catch(() => null);
      if (corpo === null) return json({ erro: "corpo não é JSON válido" }, 400);
      const { lista, ehLote } = extrairLista(corpo, "leituras");
      let aceitas = 0; const recusadas: Array<{ indice: number; motivo: string }> = [];
      for (let i = 0; i < lista.length; i++) {
        const item = lista[i];
        const v = validarLeitura(item);
        if (!v.ok) { recusadas.push({ indice: i, motivo: v.motivo }); registrarRecusa(db, auth.fonte.fonte_id, "leitura", v.motivo); continue; }
        const fonteDoItem = extrairFonteId(item);
        if (fonteDoItem !== auth.fonte.fonte_id) { const motivo = `fonte_id ("${fonteDoItem}") não corresponde à chave enviada`; recusadas.push({ indice: i, motivo }); registrarRecusa(db, auth.fonte.fonte_id, "leitura", motivo); continue; }
        if (auth.fonte.so_sintetico && (item as Record<string, unknown>).origem !== "sintetico") {
          const motivo = `fonte de demonstração só aceita origem "sintetico" (recebeu "${String((item as Record<string, unknown>).origem)}") — evita leitura fictícia rotulada como medição real`;
          recusadas.push({ indice: i, motivo }); registrarRecusa(db, auth.fonte.fonte_id, "leitura", motivo); continue;
        }
        inserirLeitura(db, item as LeituraEntrada); aceitas++;
      }
      const duracao_ms = Math.round(performance.now() - inicio);
      tel({ agente: "porta-de-entrada", acao: "post-leituras", origem: "real", ok: recusadas.length === 0, duracao_ms, resumo: `leituras: ${aceitas}/${lista.length} aceitas` + (recusadas[0] ? ` · recusa: ${recusadas[0].motivo}` : "") });
      for (const r of recusadas) if (MOTIVO_PRIVACIDADE.test(r.motivo)) tel({ agente: "verificador-de-privacidade", acao: "recusa-dado-pessoal", origem: "real", ok: false, resumo: r.motivo });
      if (!ehLote && recusadas.length === 1) return json({ erro: recusadas[0].motivo }, 422);
      return json({ aceitas, total: lista.length, recusadas });
    }

    if (u.pathname === "/api/eventos" && req.method === "POST") {
      const auth = autenticar(req, fontes);
      if (!auth.ok) return auth.resposta;
      const corpo = await req.json().catch(() => null);
      if (corpo === null) return json({ erro: "corpo não é JSON válido" }, 400);
      const { lista, ehLote } = extrairLista(corpo, "eventos");
      let aceitas = 0; const recusadas: Array<{ indice: number; motivo: string }> = [];
      for (let i = 0; i < lista.length; i++) {
        const item = lista[i];
        const v = validarEvento(item);
        if (!v.ok) { recusadas.push({ indice: i, motivo: v.motivo }); registrarRecusa(db, auth.fonte.fonte_id, "evento", v.motivo); continue; }
        const fonteDoItem = extrairFonteId(item);
        if (fonteDoItem !== auth.fonte.fonte_id) { const motivo = `fonte_id ("${fonteDoItem}") não corresponde à chave enviada`; recusadas.push({ indice: i, motivo }); registrarRecusa(db, auth.fonte.fonte_id, "evento", motivo); continue; }
        inserirEvento(db, item as EventoEntrada); aceitas++;
      }
      if (!ehLote && recusadas.length === 1) return json({ erro: recusadas[0].motivo }, 422);
      return json({ aceitas, total: lista.length, recusadas });
    }

    if (u.pathname === "/api/cameras" && req.method === "PUT") {
      const auth = autenticar(req, fontes);
      if (!auth.ok) return auth.resposta;
      const corpo = await req.json().catch(() => null);
      if (corpo === null) return json({ erro: "corpo não é JSON válido" }, 400);
      const { lista, ehLote } = extrairLista(corpo, "cameras");
      let aceitas = 0; const recusadas: Array<{ indice: number; motivo: string }> = [];
      for (let i = 0; i < lista.length; i++) {
        const item = lista[i];
        const v = validarCamera(item);
        if (!v.ok) { recusadas.push({ indice: i, motivo: v.motivo }); registrarRecusa(db, auth.fonte.fonte_id, "camera", v.motivo); continue; }
        const fonteDoItem = extrairFonteId(item);
        if (fonteDoItem !== auth.fonte.fonte_id) { const motivo = `fonte_id ("${fonteDoItem}") não corresponde à chave enviada`; recusadas.push({ indice: i, motivo }); registrarRecusa(db, auth.fonte.fonte_id, "camera", motivo); continue; }
        upsertCamera(db, item as CameraEntrada); aceitas++;
      }
      if (!ehLote && recusadas.length === 1) return json({ erro: recusadas[0].motivo }, 422);
      return json({ aceitas, total: lista.length, recusadas });
    }

    if (u.pathname === "/api/estado" && req.method === "GET") {
      const inicio = performance.now();
      const cameras = estadoCameras(db);
      tel({ agente: "agregador", acao: "get-estado", origem: "real", ok: true, duracao_ms: Math.round(performance.now() - inicio), resumo: `estado: ${cameras.length} câmeras` });
      return json({ detector_pii_local: USANDO_DETECTOR_LOCAL, cameras });
    }

    if (u.pathname === "/api/serie" && req.method === "GET") {
      const camera_id = u.searchParams.get("camera_id");
      if (!camera_id) return json({ erro: "camera_id obrigatório" }, 400);
      const horas = Number(u.searchParams.get("horas") ?? "24");
      return json({ camera_id, horas, leituras: serieCamera(db, camera_id, horas) });
    }

    if (u.pathname === "/api/antes-depois" && req.method === "GET") {
      const camera_id = u.searchParams.get("camera_id");
      const corte = u.searchParams.get("corte");
      if (!camera_id || !corte) return json({ erro: "camera_id e corte são obrigatórios" }, 400);
      const dias = Number(u.searchParams.get("dias") ?? "14");
      const inicio = performance.now();
      const resultado = antesDepois(db, camera_id, corte, dias);
      tel({ agente: "agregador", acao: "get-antes-depois", origem: "real", ok: true, duracao_ms: Math.round(performance.now() - inicio), resumo: `antes-depois camera_id=${camera_id} dias=${dias}` });
      return json({ camera_id, corte, dias, ...resultado });
    }

    if (u.pathname === "/api/saude" && req.method === "GET") return json({ fontes: saudeFontes(db, Object.values(fontes).map((f) => f.fonte_id)), detector_pii_local: USANDO_DETECTOR_LOCAL });

    return json({ erro: "rota de API desconhecida" }, 404);
  };
}

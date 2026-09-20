// cco/telemetria.ts — barramento de eventos da telemetria (o que cada agente fez, agora).
// bun:sqlite, sem dependência nova. Nunca grava pergunta de visitante inteira, IP, chave ou caminho de máquina —
// isso é regra do produto, não detalhe: ver acharDadoPessoal() em validar.ts para o mesmo espírito aplicado aqui.
//
// Contrato de evento e de resumo combinado com quem consome (cco/observabilidade.html) — não mude os nomes de
// campo abaixo sem checar aquele arquivo primeiro: evento = {id,ts,agente,acao,origem,ok,duracao_ms?,tokens?,resumo,detalhe?};
// resumo = {agentes:[{agente,estado,ultimo:{ts,resumo}|null,eventos_1h,reais_1h,simulados_1h,duracao_mediana_ms,tokens_dia}],
//           totais:{eventos_dia,reais_dia,simulados_dia,recusas_privacidade_dia,perguntas_dia,tokens_dia}}.
import { Database } from "bun:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { createHash } from "node:crypto";

export const AGENTES = [
  "leitor-de-video",
  "porta-de-entrada",
  "verificador-de-privacidade",
  "agregador",
  "detector-de-evento",
  "decisao-tipada",
  "assistente",
  "triagem-de-melhorias",
  "gerador-de-fluxo",
] as const;
export type Agente = (typeof AGENTES)[number];
export type Origem = "real" | "simulado";

/** Entrada de quem chama registrar() — custo_tokens é o nome do parâmetro; no evento gravado/servido vira `tokens` (contrato do consumidor). */
export type EventoEntrada = {
  agente: Agente;
  acao: string;
  origem: Origem;
  ok: boolean;
  duracao_ms?: number;
  custo_tokens?: number;
  resumo: string;
  detalhe?: Record<string, unknown>;
};

export type EventoGravado = {
  id: number; ts: string; agente: Agente; acao: string; origem: Origem; ok: boolean;
  duracao_ms?: number; tokens?: number; resumo: string; detalhe?: Record<string, unknown>;
};

const LIMITE_RESUMO = 200;
const LIMITE_DETALHE_BYTES = 2048;

function truncar(s: string, n: number): string {
  return s.length > n ? s.slice(0, n) : s;
}

/** Hash curto e não-reversível de um valor (IP, por exemplo) — nunca guarda o valor original. */
export function hashCurto(valor: string, sal: string): string {
  return createHash("sha256").update(sal + "|" + valor).digest("hex").slice(0, 12);
}

/** Sal do dia — muda toda meia-noite UTC, então o mesmo hash de hoje não bate com o de amanhã. */
export function saltoDoDia(base?: Date): string {
  return (base ?? new Date()).toISOString().slice(0, 10);
}

type LinhaBanco = {
  id: number; ts: string; agente: string; acao: string; origem: string; ok: number;
  duracao_ms: number | null; tokens: number | null; resumo: string; detalhe: string | null;
};

function linhaParaEvento(l: LinhaBanco): EventoGravado {
  return {
    id: l.id, ts: l.ts, agente: l.agente as Agente, acao: l.acao, origem: l.origem as Origem, ok: l.ok === 1,
    duracao_ms: l.duracao_ms ?? undefined, tokens: l.tokens ?? undefined, resumo: l.resumo,
    detalhe: l.detalhe ? (JSON.parse(l.detalhe) as Record<string, unknown>) : undefined,
  };
}

export type ResumoAgente = {
  agente: Agente;
  estado: "ativo" | "calado" | "com-erro";
  ultimo: { ts: string; resumo: string } | null;
  eventos_1h: number;
  reais_1h: number;
  simulados_1h: number;
  duracao_mediana_ms: number | null;
  tokens_dia: number;
};
export type ResumoGeral = {
  agentes: ResumoAgente[];
  totais: {
    eventos_dia: number; reais_dia: number; simulados_dia: number;
    recusas_privacidade_dia: number; perguntas_dia: number; tokens_dia: number;
  };
};

const LIMIAR_CALADO_S = 180; // 3 min sem evento = calado

export function criarTelemetria(caminhoBanco: string) {
  mkdirSync(dirname(caminhoBanco), { recursive: true });
  const db = new Database(caminhoBanco, { create: true });
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec(`
    CREATE TABLE IF NOT EXISTS eventos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts TEXT NOT NULL,
      agente TEXT NOT NULL,
      acao TEXT NOT NULL,
      origem TEXT NOT NULL,
      ok INTEGER NOT NULL,
      duracao_ms INTEGER,
      tokens INTEGER,
      resumo TEXT NOT NULL,
      detalhe TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_eventos_agente_ts ON eventos(agente, ts);
  `);

  type Assinante = (linhaSSE: string) => void;
  const assinantes = new Set<Assinante>();

  function registrar(e: EventoEntrada): EventoGravado {
    if (e.origem !== "real" && e.origem !== "simulado") throw new Error(`telemetria: origem obrigatória e deve ser "real" ou "simulado" (recebeu ${JSON.stringify((e as EventoEntrada).origem)})`);
    if (!AGENTES.includes(e.agente)) throw new Error(`telemetria: agente desconhecido "${String(e.agente)}"`);
    if (!e.resumo) throw new Error("telemetria: resumo obrigatório");
    const resumo = truncar(e.resumo, LIMITE_RESUMO);
    let detalhe = e.detalhe;
    let detalheStr: string | null = null;
    if (detalhe) {
      detalheStr = JSON.stringify(detalhe);
      if (Buffer.byteLength(detalheStr, "utf8") > LIMITE_DETALHE_BYTES) { detalhe = { truncado: true, motivo: "detalhe excedeu 2KB" }; detalheStr = JSON.stringify(detalhe); }
    }
    const ts = new Date().toISOString();
    db.query(`
      INSERT INTO eventos (ts, agente, acao, origem, ok, duracao_ms, tokens, resumo, detalhe)
      VALUES ($ts, $agente, $acao, $origem, $ok, $duracao_ms, $tokens, $resumo, $detalhe)
    `).run({
      $ts: ts, $agente: e.agente, $acao: e.acao, $origem: e.origem, $ok: e.ok ? 1 : 0,
      $duracao_ms: e.duracao_ms ?? null, $tokens: e.custo_tokens ?? null, $resumo: resumo, $detalhe: detalheStr,
    });
    const id = (db.query(`SELECT last_insert_rowid() as id`).get() as { id: number }).id;
    const gravado: EventoGravado = {
      id, ts, agente: e.agente, acao: e.acao, origem: e.origem, ok: e.ok,
      duracao_ms: e.duracao_ms, tokens: e.custo_tokens, resumo, detalhe,
    };
    const linhaSSE = "data: " + JSON.stringify(gravado) + "\n\n";
    for (const a of assinantes) { try { a(linhaSSE); } catch { /* assinante quebrado não derruba quem gravou */ } }
    return gravado;
  }

  function ultimos(limite: number, agente?: string): EventoGravado[] {
    const linhas = (agente
      ? db.query(`SELECT * FROM eventos WHERE agente = $a ORDER BY id DESC LIMIT $n`).all({ $a: agente, $n: limite })
      : db.query(`SELECT * FROM eventos ORDER BY id DESC LIMIT $n`).all({ $n: limite })) as LinhaBanco[];
    return linhas.map(linhaParaEvento).reverse();
  }

  function resumo(): ResumoGeral {
    const agora = Date.now();
    const agentes: ResumoAgente[] = AGENTES.map((agente) => {
      const ultimaLinha = db.query(`SELECT * FROM eventos WHERE agente = $a ORDER BY id DESC LIMIT 1`).get({ $a: agente }) as LinhaBanco | null;
      const ultimoEvento = ultimaLinha ? linhaParaEvento(ultimaLinha) : null;
      const linhasHora = db.query(`SELECT * FROM eventos WHERE agente = $a AND ts >= datetime('now','-1 hour')`).all({ $a: agente }) as LinhaBanco[];
      const reais_1h = linhasHora.filter((l) => l.origem === "real").length;
      const simulados_1h = linhasHora.length - reais_1h;
      const duracoes = linhasHora.map((l) => l.duracao_ms).filter((d): d is number => d != null).sort((a, b) => a - b);
      const duracao_mediana_ms = duracoes.length > 0 ? duracoes[Math.floor(duracoes.length / 2)] : null;
      const tokens_dia = (db.query(`SELECT COALESCE(SUM(tokens),0) as s FROM eventos WHERE agente = $a AND ts >= datetime('now','-1 day')`).get({ $a: agente }) as { s: number }).s;
      let estado: ResumoAgente["estado"] = "calado";
      if (ultimoEvento) {
        const idadeS = (agora - new Date(ultimoEvento.ts).getTime()) / 1000;
        if (idadeS <= LIMIAR_CALADO_S) estado = ultimoEvento.ok ? "ativo" : "com-erro";
      }
      return {
        agente, estado, ultimo: ultimoEvento ? { ts: ultimoEvento.ts, resumo: ultimoEvento.resumo } : null,
        eventos_1h: linhasHora.length, reais_1h, simulados_1h, duracao_mediana_ms, tokens_dia,
      };
    });
    const porOrigemDia = db.query(`SELECT origem, COUNT(*) as n FROM eventos WHERE ts >= datetime('now','-1 day') GROUP BY origem`).all() as Array<{ origem: string; n: number }>;
    const reais_dia = porOrigemDia.find((r) => r.origem === "real")?.n ?? 0;
    const simulados_dia = porOrigemDia.find((r) => r.origem === "simulado")?.n ?? 0;
    const recusas_privacidade_dia = (db.query(`SELECT COUNT(*) as n FROM eventos WHERE agente='verificador-de-privacidade' AND ok=0 AND ts >= datetime('now','-1 day')`).get() as { n: number }).n;
    const perguntas_dia = (db.query(`SELECT COUNT(*) as n FROM eventos WHERE agente='assistente' AND acao='pergunta-inicio' AND ts >= datetime('now','-1 day')`).get() as { n: number }).n;
    const tokens_dia_assistente = (db.query(`SELECT COALESCE(SUM(tokens),0) as s FROM eventos WHERE agente='assistente' AND ts >= datetime('now','-1 day')`).get() as { s: number }).s;
    return { agentes, totais: { eventos_dia: reais_dia + simulados_dia, reais_dia, simulados_dia, recusas_privacidade_dia, perguntas_dia, tokens_dia: tokens_dia_assistente } };
  }

  function assinar(cb: (linhaSSE: string) => void): () => void {
    assinantes.add(cb);
    return () => assinantes.delete(cb);
  }

  function contarAssinantes(): number {
    return assinantes.size;
  }

  return { registrar, ultimos, resumo, assinar, contarAssinantes };
}

export type Telemetria = ReturnType<typeof criarTelemetria>;

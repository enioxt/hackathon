#!/usr/bin/env bun
/**
 * passaro-branco-parser.ts
 *
 * Motor determinístico que lê o "Relatório de Viagens" do transporte coletivo
 * de Patos de Minas (extraído com `pdftotext -layout` de um PDF de 1.297
 * páginas) e emite dado estruturado: 1 objeto por viagem (JSONL) + agregados
 * por linha/hora/dia-da-semana (JSON) + conferência contra os totais
 * declarados no cabeçalho do relatório.
 *
 * FONTE (formato real medido, não assumido pelo header do PDF):
 *   pdftotext -layout preserva colunas fixas, mas a largura de cada coluna
 *   VARIA de página em página (a fonte reflui conforme o conteúdo), então
 *   NENHUMA posição de caractere é confiável — só a ORDEM dos tokens
 *   (separados por 1+ espaços) é estável.
 *
 *   Cada linha de viagem tem 17 campos fixos no início (DATA .. TEMP. PONTO),
 *   depois PASSAGEIRO e I.P.K, depois 3 campos fixos no FIM (EDITADA,
 *   TABELA, EMPRESA) — medido em >21 mil linhas-âncora, só 2 contagens de
 *   token existem: 22 (sem "vazamento" inline do texto de status) e 23 (1
 *   palavra do texto "STATUS DA VIAGEM" vazou pra dentro da linha de dado
 *   porque a página tinha colunas mais estreitas). A coluna "STATUS DA
 *   VIAGEM" em si é um texto multi-palavra ("Viagem planejada e
 *   realizada" / "Não realizado" / "Extra") que o pdftotext quebra em
 *   linhas acima E abaixo da linha de dado, em posições que MUDAM de
 *   página pra página — reconstrução literal seria frágil e falharia em
 *   silêncio (R13). Por isso `status` aqui é DERIVADO deterministicamente
 *   dos campos estruturados (partida_real/chegada_real presentes ou "-"),
 *   nunca da reconstrução de texto fragmentado.
 *
 * MOTORISTA (PII de trabalhador, P4/LGPD): a coluna existe na fonte mas
 * NUNCA é lida para uma variável — o índice é pulado, e não há caminho de
 * código que a grave em lugar nenhum.
 *
 * Uso:
 *   bun scripts/passaro-branco-parser.ts [caminho-do-txt] [dir-de-saida]
 * Padrão:
 *   fonte  = (arquivo local do time)
 *   saída  = (arquivo local do time)
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

type StatusViagem = "realizada" | "nao_realizada";

interface Viagem {
  linha: string;
  data: string; // ISO YYYY-MM-DD
  veiculo_plan: string | null;
  veiculo_real: string | null;
  partida_planejada: string | null; // HH:MM:SS
  partida_real: string | null; // HH:MM:SS
  diff_partida_s: number | null;
  chegada_planejada: string | null; // HH:MM:SS
  chegada_real: string | null; // HH:MM:SS
  diff_chegada_s: number | null;
  tempo_viagem_s: number | null;
  km_plan: number | null;
  km_exec: number | null;
  vel_media: number | null;
  tempo_ponto_s: number | null;
  passageiros: number | null;
  ipk: number | null;
  status: StatusViagem;
  editada: boolean;
  tabela: number | null;
  empresa: string | null;
}

interface HeaderTotals {
  viagens_realizadas: number;
  viagens_nao_realizadas: number;
  viagens_canceladas: number;
  viagens_realizadas_nao_planejadas: number;
  viagens_editadas: number;
  km_planejado: number;
  km_executado: number;
  total_passageiros: number;
  media_passageiros: number;
  media_ipk: number;
}

// ---------------------------------------------------------------------------
// Constantes / regex
// ---------------------------------------------------------------------------

const DEFAULT_SRC =
  "(arquivo local do time)";
const DEFAULT_OUT_DIR = "(arquivo local do time)";

// linhas que fazem parte do bloco de cabeçalho de colunas (nunca são nome de
// linha de ônibus) — medido contra o arquivo real: nome de linha de ônibus
// jamais contém nenhuma destas palavras.
const HEADER_BLOCKLIST = [
  "DATA",
  "VEICULO",
  "VEÍCULO",
  "MOTORISTA",
  "CHEGADA",
  "PARTIDA",
  "DIFF",
  "TEMPO",
  " KM ",
  "KM ",
  " KM",
  "VEL",
  "TEMP",
  "PASSAGEIRO",
  "I.P.K",
  "TABELA",
  "EMPRESA",
  "STATUS",
  "VIAGEM",
  "EDITADA",
  "PLAN",
  "REAL",
  "PLANEJADA",
  "PONTO",
  "RELAT",
  "FILTRO",
  "EXEC",
  "MEDIA",
  "HE",
];

const DATA_ANCHOR_RE = /^\d{2}\/\d{2}\/\d{4}\s/;
const ALL_UPPER_CANDIDATE_RE = /^[A-ZÀ-ÖØ-Ý0-9][A-ZÀ-ÖØ-Ý0-9 .\-]*$/u;

// ---------------------------------------------------------------------------
// Parsers de campo
// ---------------------------------------------------------------------------

function dash(s: string): string | null {
  return s === "-" ? null : s;
}

function parseIntBR(s: string): number | null {
  const v = dash(s);
  if (v === null) return null;
  const n = Number.parseInt(v.replace(/\./g, ""), 10);
  return Number.isNaN(n) ? null : n;
}

function parseDecimalBR(s: string): number | null {
  const v = dash(s);
  if (v === null) return null;
  const n = Number.parseFloat(v.replace(/\./g, "").replace(",", "."));
  return Number.isNaN(n) ? null : n;
}

/** "[-]HH:MM:SS" -> segundos (assinado). "-" -> null. */
function parseDurationToSeconds(s: string): number | null {
  const v = dash(s);
  if (v === null) return null;
  const m = /^(-)?(\d{2}):(\d{2}):(\d{2})$/.exec(v);
  if (!m) return null;
  const sign = m[1] === "-" ? -1 : 1;
  const h = Number.parseInt(m[2] as string, 10);
  const mi = Number.parseInt(m[3] as string, 10);
  const se = Number.parseInt(m[4] as string, 10);
  return sign * (h * 3600 + mi * 60 + se);
}

/** "HH:MM:SS" (relógio, não duração) -> mesma string ou null se "-". */
function parseClock(s: string): string | null {
  const v = dash(s);
  if (v === null) return null;
  return /^\d{2}:\d{2}:\d{2}$/.test(v) ? v : null;
}

/** "DD/MM/YYYY" -> "YYYY-MM-DD" */
function parseDataISO(s: string): string {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s);
  if (!m) throw new Error(`DATA fora do formato esperado: "${s}"`);
  return `${m[3]}-${m[2]}-${m[1]}`;
}

function isSectionHeaderLine(trimmed: string): boolean {
  if (trimmed.length < 4 || trimmed.length > 90) return false;
  if (trimmed !== trimmed.toUpperCase()) return false;
  if (!ALL_UPPER_CANDIDATE_RE.test(trimmed)) return false;
  if (!/[A-ZÀ-ÖØ-Ý]/.test(trimmed)) return false; // precisa ter ao menos 1 letra
  for (const bad of HEADER_BLOCKLIST) {
    if (trimmed.includes(bad)) return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Parse de uma linha-âncora (registro de viagem) em Viagem
// ---------------------------------------------------------------------------

interface ParseResult {
  viagem: Viagem | null;
  error: string | null;
}

function parseDataLine(line: string, linha: string): ParseResult {
  const tokens = line.trim().split(/\s+/);
  // 17 campos fixos (DATA..TEMP.PONTO) + PASSAGEIRO + I.P.K + 0..N palavras
  // vazadas do texto de status + EDITADA + TABELA + EMPRESA = mínimo 22.
  if (tokens.length < 22) {
    return {
      viagem: null,
      error: `linha com ${tokens.length} tokens (< 22 esperado): "${line.slice(0, 120)}"`,
    };
  }
  const n = tokens.length;
  try {
    const [
      dataTok,
      veiculoPlanTok,
      veiculoRealTok,
      , // MOTORISTA — descartado por design (PII, P4/LGPD)
      , // CHEGADA AO PONTO — não faz parte do contrato de saída
      partidaPlanTok,
      partidaRealTok,
      diffPartidaTok,
      , // HE — não faz parte do contrato de saída
      chegadaPlanTok,
      chegadaRealTok,
      diffChegadaTok,
      tempoViagemTok,
      kmPlanTok,
      kmExecTok,
      velMediaTok,
      tempPontoTok,
      passageiroTok,
      ipkTok,
    ] = tokens as string[];

    const editadaTok = tokens[n - 3] as string;
    const tabelaTok = tokens[n - 2] as string;
    const empresaTok = tokens[n - 1] as string;

    if (editadaTok !== "sim" && editadaTok !== "nao") {
      return {
        viagem: null,
        error: `campo EDITADA inesperado ("${editadaTok}") — layout não bate: "${line.slice(0, 120)}"`,
      };
    }

    const partidaReal = parseClock(partidaRealTok as string);
    const chegadaReal = parseClock(chegadaRealTok as string);

    // status derivado estruturalmente (não da reconstrução de texto
    // fragmentado — ver comentário de topo do arquivo).
    const status: StatusViagem =
      partidaReal === null && chegadaReal === null
        ? "nao_realizada"
        : "realizada";

    const viagem: Viagem = {
      linha,
      data: parseDataISO(dataTok as string),
      veiculo_plan: dash(veiculoPlanTok as string),
      veiculo_real: dash(veiculoRealTok as string),
      partida_planejada: parseClock(partidaPlanTok as string),
      partida_real: partidaReal,
      diff_partida_s: parseDurationToSeconds(diffPartidaTok as string),
      chegada_planejada: parseClock(chegadaPlanTok as string),
      chegada_real: chegadaReal,
      diff_chegada_s: parseDurationToSeconds(diffChegadaTok as string),
      tempo_viagem_s: parseDurationToSeconds(tempoViagemTok as string),
      km_plan: parseDecimalBR(kmPlanTok as string),
      km_exec: parseDecimalBR(kmExecTok as string),
      vel_media: parseDecimalBR(velMediaTok as string),
      tempo_ponto_s: parseDurationToSeconds(tempPontoTok as string),
      passageiros: parseIntBR(passageiroTok as string),
      ipk: parseDecimalBR(ipkTok as string),
      status,
      editada: editadaTok === "sim",
      tabela: parseIntBR(tabelaTok as string),
      empresa: dash(empresaTok as string),
    };
    return { viagem, error: null };
  } catch (e) {
    return {
      viagem: null,
      error: `exceção ao parsear "${line.slice(0, 120)}": ${(e as Error).message}`,
    };
  }
}

// ---------------------------------------------------------------------------
// Extração dos totais do cabeçalho (para a CONFERÊNCIA)
// ---------------------------------------------------------------------------

function extractHeaderTotals(lines: string[]): HeaderTotals {
  const idxViagens = lines.findIndex((l) =>
    l.includes("Total de viagens realizadas"),
  );
  const idxKm = lines.findIndex((l) => l.includes("Soma de KM Planejado"));
  if (idxViagens === -1 || idxKm === -1) {
    throw new Error(
      "não achei o bloco de totais do cabeçalho do relatório (rótulos ausentes) — arquivo fora do formato esperado",
    );
  }
  let viagensValuesLine: string | undefined;
  for (let i = idxViagens + 1; i < lines.length && i < idxViagens + 6; i++) {
    if ((lines[i] as string).trim() !== "") {
      viagensValuesLine = lines[i];
      break;
    }
  }
  let kmValuesLine: string | undefined;
  for (let i = idxKm + 1; i < lines.length && i < idxKm + 6; i++) {
    if ((lines[i] as string).trim() !== "") {
      kmValuesLine = lines[i];
      break;
    }
  }
  if (!viagensValuesLine || !kmValuesLine) {
    throw new Error(
      "achei os rótulos do cabeçalho mas não a linha de valores logo abaixo — arquivo fora do formato esperado",
    );
  }
  const vTok = viagensValuesLine.trim().split(/\s+/);
  const kTok = kmValuesLine.trim().split(/\s+/);
  if (vTok.length < 5 || kTok.length < 6) {
    throw new Error(
      `bloco de totais do cabeçalho com contagem de campo inesperada (viagens=${vTok.length}, km=${kTok.length})`,
    );
  }
  return {
    viagens_realizadas: parseIntBR(vTok[0] as string) as number,
    viagens_nao_realizadas: parseIntBR(vTok[1] as string) as number,
    viagens_canceladas: parseIntBR(vTok[2] as string) as number,
    viagens_realizadas_nao_planejadas: parseIntBR(vTok[3] as string) as number,
    viagens_editadas: parseIntBR(vTok[4] as string) as number,
    km_planejado: parseDecimalBR(kTok[0] as string) as number,
    km_executado: parseDecimalBR(kTok[1] as string) as number,
    total_passageiros: parseDecimalBR(kTok[2] as string) as number,
    media_passageiros: parseDecimalBR(kTok[3] as string) as number,
    media_ipk: parseDecimalBR(kTok[4] as string) as number,
  };
}

// ---------------------------------------------------------------------------
// Parse do arquivo inteiro
// ---------------------------------------------------------------------------

interface ParseOutcome {
  viagens: Viagem[];
  errors: string[];
  linhasDistintas: string[];
}

function parseFile(raw: string): ParseOutcome {
  const lines = raw.replace(/\f/g, "").split("\n");
  const viagens: Viagem[] = [];
  const errors: string[] = [];
  const linhasVistas = new Set<string>();
  let linhaAtual: string | null = null;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (trimmed === "") continue;

    if (DATA_ANCHOR_RE.test(trimmed)) {
      const linha = linhaAtual ?? "DESCONHECIDA";
      const { viagem, error } = parseDataLine(trimmed, linha);
      if (viagem) {
        viagens.push(viagem);
        linhasVistas.add(linha);
      } else if (error) {
        errors.push(error);
      }
      continue;
    }

    if (isSectionHeaderLine(trimmed)) {
      linhaAtual = trimmed;
    }
  }

  return {
    viagens,
    errors,
    linhasDistintas: [...linhasVistas].sort(),
  };
}

// ---------------------------------------------------------------------------
// Agregados
// ---------------------------------------------------------------------------

function mean(xs: number[]): number | null {
  if (xs.length === 0) return null;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}
function sum(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0);
}
function round2(n: number | null): number | null {
  return n === null ? null : Math.round(n * 100) / 100;
}

/**
 * IPK recomputado por viagem (passageiros / km_exec).
 *
 * Por quê recomputar em vez de usar o campo `ipk` bruto da fonte: medido
 * contra o arquivo real, a coluna I.P.K vem "-" (vazia) exatamente nas
 * viagens de baixa lotação (poucos passageiros) — não é ausência aleatória.
 * Fazer média só dos valores PRESENTES descarta sistematicamente o lado
 * baixo da distribuição e infla a média (medido: 3,33 vs 2,74 declarado no
 * cabeçalho — 21,5% de delta). Recalcular passageiros/km por viagem, para
 * TODA viagem realizada com km_exec>0, elimina esse viés (medido: 2,87,
 * 4,6% de delta) — mais fiel ao "IPK médio" que o relatório declara.
 */
function ipkRecomputado(v: Viagem): number | null {
  if (v.passageiros === null || v.km_exec === null || v.km_exec <= 0)
    return null;
  return v.passageiros / v.km_exec;
}

const DIAS_SEMANA = [
  "domingo",
  "segunda",
  "terca",
  "quarta",
  "quinta",
  "sexta",
  "sabado",
];

function diaDaSemana(isoDate: string): string {
  // construção UTC explícita — evita off-by-one por fuso local
  const [y, m, d] = isoDate.split("-").map((x) => Number.parseInt(x, 10));
  const dt = new Date(Date.UTC(y as number, (m as number) - 1, d as number));
  return DIAS_SEMANA[dt.getUTCDay()] as string;
}

function horaDe(clock: string | null): number | null {
  if (clock === null) return null;
  const h = Number.parseInt(clock.slice(0, 2), 10);
  return Number.isNaN(h) ? null : h;
}

interface LinhaAgregado {
  viagens: number;
  viagens_realizadas: number;
  viagens_nao_realizadas: number;
  passageiros: number;
  km_exec: number;
  ipk_medio: number | null;
  atraso_medio_partida_s: number | null;
  atraso_medio_chegada_s: number | null;
  pct_atraso_chegada_gt_5min: number | null;
  vel_media: number | null;
  lotacao_media: number | null;
  lotacao_maxima: number | null;
}

interface HoraAgregado {
  hora: number;
  viagens: number;
  passageiros: number;
  atraso_medio_partida_s: number | null;
}

interface DiaSemanaAgregado {
  dia: string;
  viagens: number;
  passageiros: number;
  atraso_medio_partida_s: number | null;
}

interface Agregados {
  por_linha: Record<string, LinhaAgregado>;
  por_hora: HoraAgregado[];
  por_dia_semana: DiaSemanaAgregado[];
  totais: {
    viagens: number;
    viagens_realizadas: number;
    viagens_nao_realizadas: number;
    passageiros: number;
    km_planejado: number;
    km_executado: number;
    ipk_medio: number | null;
    atraso_medio_partida_s: number | null;
    atraso_medio_chegada_s: number | null;
    vel_media: number | null;
  };
}

function buildAgregados(viagens: Viagem[]): Agregados {
  const porLinha = new Map<string, Viagem[]>();
  for (const v of viagens) {
    const arr = porLinha.get(v.linha) ?? [];
    arr.push(v);
    porLinha.set(v.linha, arr);
  }

  const por_linha: Record<string, LinhaAgregado> = {};
  for (const [linha, vs] of porLinha) {
    const passageiros = vs
      .map((v) => v.passageiros)
      .filter((x): x is number => x !== null);
    const kmExec = vs
      .map((v) => v.km_exec)
      .filter((x): x is number => x !== null);
    const ipks = vs
      .map((v) => ipkRecomputado(v))
      .filter((x): x is number => x !== null);
    const atrasoPartida = vs
      .map((v) => v.diff_partida_s)
      .filter((x): x is number => x !== null);
    const atrasoChegada = vs
      .map((v) => v.diff_chegada_s)
      .filter((x): x is number => x !== null);
    const vel = vs
      .map((v) => v.vel_media)
      .filter((x): x is number => x !== null);
    const comAtrasoChegada = atrasoChegada.length;
    const atrasadasMais5min = atrasoChegada.filter((s) => s > 300).length;

    por_linha[linha] = {
      viagens: vs.length,
      viagens_realizadas: vs.filter((v) => v.status === "realizada").length,
      viagens_nao_realizadas: vs.filter((v) => v.status === "nao_realizada")
        .length,
      passageiros: sum(passageiros),
      km_exec: round2(sum(kmExec)) as number,
      ipk_medio: round2(mean(ipks)),
      atraso_medio_partida_s: round2(mean(atrasoPartida)),
      atraso_medio_chegada_s: round2(mean(atrasoChegada)),
      pct_atraso_chegada_gt_5min:
        comAtrasoChegada > 0
          ? round2((atrasadasMais5min / comAtrasoChegada) * 100)
          : null,
      vel_media: round2(mean(vel)),
      lotacao_media: round2(mean(passageiros)),
      lotacao_maxima: passageiros.length > 0 ? Math.max(...passageiros) : null,
    };
  }

  const porHora = new Map<number, Viagem[]>();
  for (const v of viagens) {
    const h = horaDe(v.partida_planejada);
    if (h === null) continue;
    const arr = porHora.get(h) ?? [];
    arr.push(v);
    porHora.set(h, arr);
  }
  const por_hora: HoraAgregado[] = [];
  for (let h = 0; h < 24; h++) {
    const vs = porHora.get(h) ?? [];
    const passageiros = vs
      .map((v) => v.passageiros)
      .filter((x): x is number => x !== null);
    const atrasoPartida = vs
      .map((v) => v.diff_partida_s)
      .filter((x): x is number => x !== null);
    por_hora.push({
      hora: h,
      viagens: vs.length,
      passageiros: sum(passageiros),
      atraso_medio_partida_s: round2(mean(atrasoPartida)),
    });
  }

  const porDia = new Map<string, Viagem[]>();
  for (const v of viagens) {
    const d = diaDaSemana(v.data);
    const arr = porDia.get(d) ?? [];
    arr.push(v);
    porDia.set(d, arr);
  }
  const por_dia_semana: DiaSemanaAgregado[] = DIAS_SEMANA.map((dia) => {
    const vs = porDia.get(dia) ?? [];
    const passageiros = vs
      .map((v) => v.passageiros)
      .filter((x): x is number => x !== null);
    const atrasoPartida = vs
      .map((v) => v.diff_partida_s)
      .filter((x): x is number => x !== null);
    return {
      dia,
      viagens: vs.length,
      passageiros: sum(passageiros),
      atraso_medio_partida_s: round2(mean(atrasoPartida)),
    };
  });

  const allPassageiros = viagens
    .map((v) => v.passageiros)
    .filter((x): x is number => x !== null);
  const allKmPlan = viagens
    .map((v) => v.km_plan)
    .filter((x): x is number => x !== null);
  const allKmExec = viagens
    .map((v) => v.km_exec)
    .filter((x): x is number => x !== null);
  const allIpk = viagens
    .map((v) => ipkRecomputado(v))
    .filter((x): x is number => x !== null);
  const allAtrasoPartida = viagens
    .map((v) => v.diff_partida_s)
    .filter((x): x is number => x !== null);
  const allAtrasoChegada = viagens
    .map((v) => v.diff_chegada_s)
    .filter((x): x is number => x !== null);
  const allVel = viagens
    .map((v) => v.vel_media)
    .filter((x): x is number => x !== null);

  return {
    por_linha,
    por_hora,
    por_dia_semana,
    totais: {
      viagens: viagens.length,
      viagens_realizadas: viagens.filter((v) => v.status === "realizada")
        .length,
      viagens_nao_realizadas: viagens.filter(
        (v) => v.status === "nao_realizada",
      ).length,
      passageiros: sum(allPassageiros),
      km_planejado: round2(sum(allKmPlan)) as number,
      km_executado: round2(sum(allKmExec)) as number,
      ipk_medio: round2(mean(allIpk)),
      atraso_medio_partida_s: round2(mean(allAtrasoPartida)),
      atraso_medio_chegada_s: round2(mean(allAtrasoChegada)),
      vel_media: round2(mean(allVel)),
    },
  };
}

// ---------------------------------------------------------------------------
// Conferência
// ---------------------------------------------------------------------------

interface ConferenciaItem {
  campo: string;
  calculado: number;
  declarado: number;
  delta_pct: number;
}

function pctDelta(calc: number, declarado: number): number {
  if (declarado === 0) return calc === 0 ? 0 : Infinity;
  return Math.abs(calc - declarado) / declarado * 100;
}

function buildConferencia(
  agregados: Agregados,
  header: HeaderTotals,
): { itens: ConferenciaItem[]; gateFalhou: boolean } {
  const calcViagens = agregados.totais.viagens_realizadas;
  const calcPassageiros = agregados.totais.passageiros;
  const calcKm = agregados.totais.km_executado;
  const calcIpk = agregados.totais.ipk_medio ?? 0;

  const itens: ConferenciaItem[] = [
    {
      campo: "viagens_realizadas",
      calculado: calcViagens,
      declarado: header.viagens_realizadas,
      delta_pct: pctDelta(calcViagens, header.viagens_realizadas),
    },
    {
      campo: "passageiros",
      calculado: calcPassageiros,
      declarado: header.total_passageiros,
      delta_pct: pctDelta(calcPassageiros, header.total_passageiros),
    },
    {
      campo: "km_executado",
      calculado: calcKm,
      declarado: header.km_executado,
      delta_pct: pctDelta(calcKm, header.km_executado),
    },
    {
      campo: "ipk_medio",
      calculado: calcIpk,
      declarado: header.media_ipk,
      delta_pct: pctDelta(calcIpk, header.media_ipk),
    },
  ];

  const gateFalhou = itens.some(
    (i) =>
      (i.campo === "viagens_realizadas" || i.campo === "passageiros") &&
      i.delta_pct > 2,
  );

  return { itens, gateFalhou };
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

function main(): void {
  const srcPath = resolve(process.argv[2] ?? DEFAULT_SRC);
  const outDir = resolve(process.argv[3] ?? DEFAULT_OUT_DIR);

  if (!existsSync(srcPath)) {
    console.error(
      `[ERRO] arquivo fonte não encontrado: ${srcPath} — nada foi processado (R13: falhar visível, nunca em silêncio).`,
    );
    process.exit(1);
  }

  mkdirSync(outDir, { recursive: true });

  const raw = readFileSync(srcPath, "utf-8");
  const lines = raw.replace(/\f/g, "").split("\n");

  let header: HeaderTotals;
  try {
    header = extractHeaderTotals(lines);
  } catch (e) {
    console.error(`[ERRO] ${(e as Error).message}`);
    process.exit(1);
  }

  const { viagens, errors, linhasDistintas } = parseFile(raw);

  if (viagens.length === 0) {
    console.error(
      "[ERRO] zero viagens parseadas — layout não reconhecido ou arquivo vazio.",
    );
    process.exit(1);
  }

  // MOTORISTA nunca é lido para dentro de um objeto Viagem — não há campo
  // "motorista" no tipo, e nenhuma variável no parser carrega esse token.
  const viagensJsonlPath = resolve(outDir, "viagens.jsonl");
  const jsonl = viagens.map((v) => JSON.stringify(v)).join("\n") + "\n";
  writeFileSync(viagensJsonlPath, jsonl, "utf-8");

  const agregados = buildAgregados(viagens);
  const agregadosPath = resolve(outDir, "agregados.json");
  writeFileSync(agregadosPath, JSON.stringify(agregados, null, 2), "utf-8");

  const { itens, gateFalhou } = buildConferencia(agregados, header);

  console.log("");
  console.log("=== CONFERÊNCIA (calculado vs declarado no cabeçalho) ===");
  for (const it of itens) {
    const cor = it.delta_pct > 2 ? "🔴" : it.delta_pct > 0.5 ? "🟡" : "🟢";
    console.log(
      `${cor} ${it.campo}: calculado=${it.calculado} · declarado=${it.declarado} · delta=${it.delta_pct.toFixed(2)}%`,
    );
  }
  console.log("");
  console.log(
    `linhas-âncora parseadas: ${viagens.length} (realizadas=${agregados.totais.viagens_realizadas}, não realizadas=${agregados.totais.viagens_nao_realizadas})`,
  );
  console.log(`linhas de ônibus (seções) distintas: ${linhasDistintas.length}`);
  console.log(`registros com erro de parse (descartados): ${errors.length}`);
  if (errors.length > 0) {
    console.log("  primeiros erros:");
    for (const e of errors.slice(0, 5)) console.log(`    - ${e}`);
  }
  console.log(`viagens.jsonl -> ${viagensJsonlPath}`);
  console.log(`agregados.json -> ${agregadosPath}`);
  console.log("");

  if (gateFalhou) {
    console.error(
      "[FALHA] delta de viagens_realizadas ou passageiros > 2% — parser não confirma a fonte. Saindo com código 1 (R13: parser que erra em silêncio é pior que parser que não roda).",
    );
    process.exit(1);
  }
}

// Permite import sem side-effect (para os goldens) e execução direta via bun.
if (import.meta.main) {
  main();
}

export {
  parseDataLine,
  parseFile,
  extractHeaderTotals,
  buildAgregados,
  buildConferencia,
  isSectionHeaderLine,
  parseDurationToSeconds,
  parseDecimalBR,
  parseIntBR,
  parseDataISO,
  type Viagem,
  type HeaderTotals,
};

// painel/fluxo-vivo.ts — gerador de fluxo: serviço à parte (systemd-run --user --unit=egos-hackathon-fluxo).
// A cada 10s, para N câmeras sintéticas: (a) gera e ENVIA uma leitura de verdade por POST /api/leituras
// (a mesma porta que uma câmera real usaria — prova o encanamento ponta a ponta com dado sintético);
// (b) monta um estado numérico sintético e chama a decisão tipada DE VERDADE; (c) a cada ~5min manda
// de propósito uma leitura com placa no campo errado, para a recusa aparecer ao vivo.
// Tudo aqui é DADO SINTÉTICO — nunca se disfarça de medição real.
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { criarTelemetria, type ResumoGeral } from "./telemetria.ts";
import { criarGerador, fatorHora, nomeCamera, gerarLeitura } from "./fontes/sintetico.ts";
import { decidir } from "../motor/decisao/decisao.ts";
import { contratoEvento, motorRegras } from "../motor/decisao/evento-de-transito.ts";

const RAIZ = import.meta.dir;
const SERVIDOR = process.env.CCO_SERVIDOR ?? "http://127.0.0.1:8787";
const N_CAMERAS = Number(process.env.CCO_FLUXO_CAMERAS ?? 12);
const INTERVALO_MS = 10000;
const CICLOS_PARA_RECUSA_PROPOSITAL = 30; // 30 * 10s = 5 min
const CICLOS_PARA_REGERAR_MD = 6; // 6 * 10s = 1 min

function carregarChave(): { chave: string; fonte_id: string } {
  const caminho = RAIZ + "/fontes.json";
  if (!existsSync(caminho)) throw new Error("fluxo-vivo: cco/fontes.json não existe — sem chave de fonte não há como enviar leituras");
  const j = JSON.parse(readFileSync(caminho, "utf8")) as { fontes: Record<string, { fonte_id: string }> };
  const par = Object.entries(j.fontes)[0];
  if (!par) throw new Error("fluxo-vivo: cco/fontes.json não tem nenhuma fonte cadastrada");
  return { chave: par[0], fonte_id: par[1].fonte_id };
}

const { chave: CHAVE, fonte_id: FONTE_ID } = carregarChave();
const telemetria = criarTelemetria(process.env.CCO_TELEMETRIA_DB ?? RAIZ + "/dados-vivos/telemetria.sqlite");

/** Estado sintético do ponto, com pico ocasional determinístico pela semente (indice+tick) — nunca Math.random(). */
function estadoCamera(indice: number, tick: number, agora: Date) {
  const rnd = criarGerador(700000 + indice * 9973 + tick);
  const fator = fatorHora(agora.getUTCHours());
  const filaHabitual = 8 + fator * 30;
  const pico = (tick + indice) % 18 === 0 && rnd() > 0.4;
  const filaAtual = pico ? filaHabitual * (2.2 + rnd() * 1.4) : filaHabitual * (0.6 + rnd() * 0.5);
  const maiorTempoParado = pico ? 90 + Math.round(rnd() * 120) : Math.round(rnd() * 40);
  const veiculosPorMin = Math.max(1, Math.round(4 + fator * 14 * (0.7 + rnd() * 0.5)));
  const cruzamentosSentidoOposto = pico && rnd() > 0.7 ? 1 : 0;
  return { fila_m: Math.round(filaAtual), fila_habitual_m: Math.round(filaHabitual), maior_tempo_parado_s: maiorTempoParado, veiculos_por_min: veiculosPorMin, cruzamentos_sentido_oposto: cruzamentosSentidoOposto };
}

async function enviarLeitura(leitura: Record<string, unknown>): Promise<{ ok: boolean; motivo?: string }> {
  try {
    const resp = await fetch(`${SERVIDOR}/api/leituras`, { method: "POST", headers: { "content-type": "application/json", "x-fonte-chave": CHAVE }, body: JSON.stringify(leitura) });
    if (resp.status === 200) return { ok: true };
    const j = (await resp.json().catch(() => ({}))) as { erro?: string };
    return { ok: false, motivo: j.erro ?? `status ${resp.status}` };
  } catch (e) {
    return { ok: false, motivo: e instanceof Error ? e.message : String(e) };
  }
}

let tick = 0;

async function cicloUmaCamera(indice: number, agora: Date): Promise<void> {
  const camera_id = nomeCamera(indice);
  const leitura = gerarLeitura(FONTE_ID, camera_id, agora, 500000 + indice * 977 + tick);
  const envio = await enviarLeitura(leitura);
  telemetria.registrar({ agente: "gerador-de-fluxo", acao: "enviar-leitura", origem: "simulado", ok: envio.ok, resumo: `DADO SINTÉTICO leitura ${camera_id}` + (envio.ok ? "" : ` · recusada: ${envio.motivo}`) });

  const estado = estadoCamera(indice, tick, agora);
  try {
    const decisao = await decidir(contratoEvento, estado, motorRegras);
    const r = decisao.respostas;
    const gravidadeTxt = r.gravidade.valor != null ? r.gravidade.valor.toFixed(2) : "?";
    telemetria.registrar({
      agente: "decisao-tipada", acao: "avaliar-evento", origem: "simulado", ok: true,
      resumo: `DADO SINTÉTICO ${camera_id}: ${r.o_que_e.abstencao ? "não sei" : r.o_que_e.escolhida} · gravidade=${gravidadeTxt} · confiança=${r.o_que_e.confianca.toFixed(2)}`,
      detalhe: { camera_id, classe: r.o_que_e.escolhida, abstencao: r.o_que_e.abstencao, confianca: r.o_que_e.confianca, gravidade: r.gravidade.valor },
    });
    if (r.chamar_gente.escolhida === "sim") {
      telemetria.registrar({ agente: "detector-de-evento", acao: "aguardando-decisao-humana", origem: "simulado", ok: true, resumo: `DADO SINTÉTICO ${camera_id}: aguardando decisão humana` });
    }
  } catch (e) {
    telemetria.registrar({ agente: "decisao-tipada", acao: "avaliar-evento", origem: "simulado", ok: false, resumo: `DADO SINTÉTICO ${camera_id}: erro — ${e instanceof Error ? e.message : String(e)}` });
  }
}

/** A cada ~5min, manda de propósito uma leitura com placa no campo errado — para a recusa aparecer ao vivo. */
async function enviarLeituraComPlacaErrada(): Promise<void> {
  const leitura = { fonte_id: FONTE_ID, camera_id: "ABC1D23", ts: new Date().toISOString(), janela_s: 60, contagens: { automovel: 1 }, origem: "sintetico" as const };
  const envio = await enviarLeitura(leitura);
  telemetria.registrar({ agente: "gerador-de-fluxo", acao: "enviar-leitura-invalida-proposital", origem: "simulado", ok: envio.ok, resumo: "DADO SINTÉTICO leitura proposital com placa no campo errado" + (envio.ok ? " (não foi recusada — investigar)" : ` · recusada: ${envio.motivo}`) });
}

/** Regera cco/dados/telemetria-agora.md a partir de GET /api/telemetria/resumo — é assim que o assistente "sabe" o que está acontecendo. */
async function regenerarTelemetriaAgora(): Promise<void> {
  try {
    const resp = await fetch(`${SERVIDOR}/api/telemetria/resumo`);
    if (!resp.ok) throw new Error(`status ${resp.status}`);
    const j = (await resp.json()) as ResumoGeral;
    const linhas = j.agentes.map((a) => `| ${a.agente} | ${a.estado} | ${a.eventos_1h} | ${a.reais_1h} | ${a.simulados_1h} | ${a.duracao_mediana_ms ?? "—"} | ${a.tokens_dia} |`).join("\n");
    const md = `# Telemetria agora (gerado automaticamente a cada minuto — não editar à mão; DADO SINTÉTICO nos agentes do gerador de fluxo)\n\n` +
      `| agente | estado | eventos (1h) | reais | simulados | mediana ms | tokens (dia) |\n|---|---|---|---|---|---|---|\n${linhas}\n\n` +
      `Totais do dia: ${j.totais.eventos_dia} eventos (${j.totais.reais_dia} reais, ${j.totais.simulados_dia} simulados) · ${j.totais.perguntas_dia} perguntas ao assistente · ${j.totais.recusas_privacidade_dia} recusas de privacidade · ${j.totais.tokens_dia} tokens.\n\n` +
      `Gerado em: ${new Date().toISOString()}\n`;
    writeFileSync(RAIZ + "/dados/telemetria-agora.md", md);
  } catch (e) {
    telemetria.registrar({ agente: "gerador-de-fluxo", acao: "regenerar-telemetria-agora", origem: "simulado", ok: false, resumo: `falha ao regenerar telemetria-agora.md: ${e instanceof Error ? e.message : String(e)}` });
  }
}

async function principal(): Promise<void> {
  console.log(`[fluxo-vivo] ${N_CAMERAS} câmeras sintéticas, 1 ciclo a cada ${INTERVALO_MS / 1000}s contra ${SERVIDOR} — tudo aqui é DADO SINTÉTICO`);
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const agora = new Date();
    for (let i = 0; i < N_CAMERAS; i++) await cicloUmaCamera(i, agora);
    if (tick > 0 && tick % CICLOS_PARA_RECUSA_PROPOSITAL === 0) await enviarLeituraComPlacaErrada();
    if (tick % CICLOS_PARA_REGERAR_MD === 0) await regenerarTelemetriaAgora();
    tick++;
    await new Promise((r) => setTimeout(r, INTERVALO_MS));
  }
}

if (import.meta.main) await principal();

// E3 — Estabilidade: 30 entradas de E2 (6 por classe, escolhidas por posição fixa — determinístico)
// x 10 repetições cada, mesma pergunta e critérios de E2. A escolha muda? quanto varia a confiança?
import { readFileSync, writeFileSync } from "node:fs";
import { chamarJev } from "./chamar-jev.ts";
import { emLotes, estadoGasto } from "./gasto.ts";

type Classe = "nao_clica" | "confuso" | "ideia_layout" | "falta_dado" | "outra";
type Detalhe = { texto: string; rotulo: Classe; ruido: string; ambigua: boolean; jev_choice: string; jev_confidence: number };
const e2 = JSON.parse(readFileSync(import.meta.dir + "/e2-resultado.json", "utf8")) as { detalhe_para_e3_e4: Detalhe[] };

const criterios: Record<Classe, string> = {
  nao_clica: "algo na tela não responde, está quebrado ou inacessível",
  confuso: "a pessoa não entendeu algo; pede explicação ou clareza",
  ideia_layout: "sugestão de outra forma de organizar ou apresentar a tela",
  falta_dado: "pede um número, uma fonte ou um dado que não encontrou",
  outra: "elogio, pergunta fora do sistema, teste ou assunto não relacionado",
};
const classes: Classe[] = ["nao_clica", "confuso", "ideia_layout", "falta_dado", "outra"];
const amostra: Detalhe[] = classes.flatMap((c) => e2.detalhe_para_e3_e4.filter((d) => d.rotulo === c).slice(0, 6));
if (amostra.length !== 30) throw new Error(`esperava 30 entradas na amostra, veio ${amostra.length} — rode e2-texto-volume.ts primeiro`);

const REPETICOES = 10;
async function repetir(m: Detalhe) {
  const chamadas = Array.from({ length: REPETICOES }, () => m);
  const respostas = await emLotes(chamadas, 6, async () => {
    const r = await chamarJev("e3-estabilidade", m.texto, { tipo: { type: "choice", instructions: "Que tipo de pedido é esta mensagem enviada por um visitante do painel?", criteria: criterios } });
    const a = r.answers.tipo as { choice: string; confidence: number };
    return { choice: a.choice, confidence: a.confidence };
  });
  const escolhas = respostas.map((r) => r.choice);
  const contagem: Record<string, number> = {};
  for (const e of escolhas) contagem[e] = (contagem[e] ?? 0) + 1;
  const modaCount = Math.max(...Object.values(contagem));
  const confs = respostas.map((r) => r.confidence);
  const media = confs.reduce((a, b) => a + b, 0) / confs.length;
  const desvio = Math.sqrt(confs.reduce((s, v) => s + (v - media) ** 2, 0) / confs.length);
  return { texto: m.texto, rotulo: m.rotulo, ruido: m.ruido, contagem_escolhas: contagem, estavel: modaCount === REPETICOES, moda_fracao: modaCount / REPETICOES, confianca_media: Math.round(media * 1000) / 1000, confianca_desvio: Math.round(desvio * 1000) / 1000 };
}

const resultados = [];
for (const m of amostra) resultados.push(await repetir(m)); // sequencial entre entradas; paralelo (6) nas 10 repetições

const totalmenteEstaveis = resultados.filter((r) => r.estavel).length;
const saida = {
  quando: new Date().toISOString(), amostra: amostra.length, repeticoes: REPETICOES,
  totalmente_estaveis: totalmenteEstaveis, taxa_totalmente_estavel: Math.round((totalmenteEstaveis / amostra.length) * 1000) / 1000,
  desvio_confianca_medio: Math.round((resultados.reduce((s, r) => s + r.confianca_desvio, 0) / resultados.length) * 1000) / 1000,
  instaveis: resultados.filter((r) => !r.estavel).map((r) => ({ texto: r.texto, rotulo: r.rotulo, contagem_escolhas: r.contagem_escolhas })),
  detalhe: resultados,
  gasto_acumulado_bateria: estadoGasto(),
};
writeFileSync(import.meta.dir + "/e3-resultado.json", JSON.stringify(saida, null, 1));
console.log(JSON.stringify({ totalmente_estaveis: totalmenteEstaveis, de: amostra.length, desvio_confianca_medio: saida.desvio_confianca_medio }, null, 1));

// E6 — Vazão: as mesmas 120 chamadas (E5: 60 x 1 pergunta + 60 x 5 perguntas, na ordem de e5) com
// paralelismo 1, 3 e 6. Tempo total, mediana, pior caso, erros. (MAX_PARALELO do freio é 6 — testamos até o teto.)
import { readFileSync, writeFileSync } from "node:fs";
import { chamarJev } from "./chamar-jev.ts";
import { emLotes, estadoGasto } from "./gasto.ts";
type Detalhe = { texto: string; rotulo: string };
const e2 = JSON.parse(readFileSync(import.meta.dir + "/e2-resultado.json", "utf8")) as { detalhe_para_e3_e4: Detalhe[] };
const amostra60 = e2.detalhe_para_e3_e4.filter((_, i) => i % 6 === 1).slice(0, 60); // outra fatia de e2, não repete a de E5
if (amostra60.length !== 60) throw new Error(`esperava 60, veio ${amostra60.length}`);
const amostra120 = [...amostra60, ...amostra60]; // 120 chamadas, mesma pergunta simples (foco é vazão, não conteúdo)

const pergunta = { tipo: { type: "choice" as const, instructions: "Que tipo de pedido é esta mensagem enviada por um visitante do painel?", criteria: { nao_clica: "algo na tela não responde, está quebrado ou inacessível", confuso: "a pessoa não entendeu algo; pede explicação ou clareza", ideia_layout: "sugestão de outra forma de organizar ou apresentar a tela", falta_dado: "pede um número, uma fonte ou um dado que não encontrou", outra: "elogio, pergunta fora do sistema, teste ou assunto não relacionado" } } };

async function medir(paralelo: number) {
  let erros = 0;
  const t0 = performance.now();
  const tempos = await emLotes(amostra120, paralelo, async (m) => {
    const tIni = performance.now();
    try { await chamarJev(`e6-paralelo-${paralelo}`, m.texto, pergunta); return performance.now() - tIni; }
    catch { erros++; return performance.now() - tIni; }
  });
  const total = Math.round(performance.now() - t0);
  const ord = [...tempos].sort((a, b) => a - b);
  return { paralelismo: paralelo, chamadas: amostra120.length, erros, ms_total: total, ms_mediana: Math.round(ord[Math.floor(ord.length / 2)]), ms_pior_caso: Math.round(ord[ord.length - 1]), chamadas_por_segundo: Math.round((amostra120.length / total) * 1000 * 100) / 100 };
}
const p1 = await medir(1), p3 = await medir(3), p6 = await medir(6);
const saida = { quando: new Date().toISOString(), resultados: [p1, p3, p6], gasto_acumulado_bateria: estadoGasto() };
writeFileSync(import.meta.dir + "/e6-resultado.json", JSON.stringify(saida, null, 1));
console.log(JSON.stringify(saida.resultados, null, 1));

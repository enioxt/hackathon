// E4 — A confiança presta? Análise em cima das respostas de E2 (ZERO chamadas novas — já responderam).
import { readFileSync, writeFileSync } from "node:fs";
type Detalhe = { texto: string; rotulo: string; ruido: string; ambigua: boolean; jev_choice: string; jev_confidence: number };
const e2 = JSON.parse(readFileSync(import.meta.dir + "/e2-resultado.json", "utf8")) as { detalhe_para_e3_e4: Detalhe[] };
const d = e2.detalhe_para_e3_e4;

const faixas: [number, number][] = [[0, 0.5], [0.5, 0.7], [0.7, 0.85], [0.85, 0.95], [0.95, 1.0001]];
const porFaixa = faixas.map(([a, b]) => {
  const itens = d.filter((x) => x.jev_confidence >= a && x.jev_confidence < b);
  const ok = itens.filter((x) => x.jev_choice === x.rotulo).length;
  return { faixa: `${a}-${b === 1.0001 ? 1 : b}`, n: itens.length, certos: ok, taxa_acerto: itens.length ? Math.round((ok / itens.length) * 1000) / 1000 : null };
});

// curva: se mandar pra pessoa tudo abaixo do limiar L, quanto erro sobra e quanta coisa vai pra gente?
const limiares = [0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95];
const curva = limiares.map((L) => {
  const automatico = d.filter((x) => x.jev_confidence >= L);
  const paraPessoa = d.length - automatico.length;
  const errosAutomatico = automatico.filter((x) => x.jev_choice !== x.rotulo).length;
  return { limiar: L, vai_para_pessoa: paraPessoa, fracao_para_pessoa: Math.round((paraPessoa / d.length) * 1000) / 1000, automatizado: automatico.length, erros_no_automatizado: errosAutomatico, taxa_erro_no_automatizado: automatico.length ? Math.round((errosAutomatico / automatico.length) * 1000) / 1000 : 0 };
});

// recomendação: menor limiar cuja taxa de erro no automatizado fica <= 5% (0.05), com o menor "vai pra pessoa" possível
const aceitavel = curva.filter((c) => c.taxa_erro_no_automatizado <= 0.05);
const recomendado = aceitavel.length ? aceitavel.reduce((a, b) => (b.limiar < a.limiar ? b : a)) : curva[curva.length - 1];

const pct = (x: number) => Math.round(x * 1000) / 10; // fração -> % com 1 casa
const saida = { quando: new Date().toISOString(), total: d.length, por_faixa_confianca: porFaixa, curva_limiar: curva, limiar_recomendado: recomendado.limiar, nenhum_limiar_atinge_5pct_erro: aceitavel.length === 0, motivo: `no limiar ${recomendado.limiar}, ${pct(recomendado.fracao_para_pessoa)}% das mensagens vai para uma pessoa e o erro que sobra no automatizado é ${pct(recomendado.taxa_erro_no_automatizado)}% (${recomendado.erros_no_automatizado} de ${recomendado.automatizado})${aceitavel.length === 0 ? " — NENHUM limiar testado chega a <=5% de erro; 0,95 é o menor erro alcançável na amostra" : ""}` };
writeFileSync(import.meta.dir + "/e4-resultado.json", JSON.stringify(saida, null, 1));
console.log(JSON.stringify({ limiar_recomendado: saida.limiar_recomendado, motivo: saida.motivo }, null, 1));

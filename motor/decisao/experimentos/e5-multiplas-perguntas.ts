// E5 — Várias perguntas na mesma chamada: 60 entradas x (1 pergunta) x (5 perguntas). Tempo e tokens por chamada.
import { readFileSync, writeFileSync } from "node:fs";
import { chamarJev } from "./chamar-jev.ts";
import { emLotes, estadoGasto } from "./gasto.ts";
type Detalhe = { texto: string; rotulo: string };
const e2 = JSON.parse(readFileSync(import.meta.dir + "/e2-resultado.json", "utf8")) as { detalhe_para_e3_e4: Detalhe[] };
const amostra = e2.detalhe_para_e3_e4.filter((_, i) => i % 6 === 0).slice(0, 60); // determinístico: 1 a cada 6, primeiras 60
if (amostra.length !== 60) throw new Error(`esperava 60, veio ${amostra.length}`);

const perguntaUnica = { tipo: { type: "choice" as const, instructions: "Que tipo de pedido é esta mensagem enviada por um visitante do painel?", criteria: { nao_clica: "algo na tela não responde, está quebrado ou inacessível", confuso: "a pessoa não entendeu algo; pede explicação ou clareza", ideia_layout: "sugestão de outra forma de organizar ou apresentar a tela", falta_dado: "pede um número, uma fonte ou um dado que não encontrou", outra: "elogio, pergunta fora do sistema, teste ou assunto não relacionado" } } };
const perguntaQuintupla = {
  ...perguntaUnica,
  urgencia: { type: "score" as const, instructions: "Quão urgente é esta mensagem?", criteria: ["baixa", "média", "alta"] },
  precisa_pessoa: { type: "noul" as const, instructions: "Esta mensagem precisa ser respondida por uma pessoa (não por resposta automática)?" },
  cita_dado_pessoal: { type: "noul" as const, instructions: "A mensagem cita algum dado pessoal (nome, telefone, endereço)?" },
  e_sobre_mapa: { type: "noul" as const, instructions: "A mensagem é sobre o mapa/visualização geográfica do painel?" },
};

async function medir(nome: string, perguntas: Record<string, any>) {
  const t0 = performance.now();
  const respostas = await emLotes(amostra, 6, async (m) => {
    const tIni = performance.now();
    const r = await chamarJev(nome, m.texto, perguntas);
    return { ms: performance.now() - tIni, tokens: r.usage.input_tokens };
  });
  const ms = respostas.map((r) => r.ms).sort((a, b) => a - b);
  const tokens = respostas.map((r) => r.tokens);
  return {
    variante: nome, n_perguntas: Object.keys(perguntas).length, chamadas: respostas.length,
    ms_total: Math.round(performance.now() - t0), ms_mediana: Math.round(ms[Math.floor(ms.length / 2)]), ms_min: Math.round(ms[0]), ms_max: Math.round(ms[ms.length - 1]),
    tokens_por_chamada_media: Math.round(tokens.reduce((a, b) => a + b, 0) / tokens.length), tokens_total: tokens.reduce((a, b) => a + b, 0),
  };
}
const umaPergunta = await medir("e5-1pergunta", perguntaUnica);
const cincoPerguntas = await medir("e5-5perguntas", perguntaQuintupla);
const saida = { quando: new Date().toISOString(), amostra: amostra.length, uma_pergunta: umaPergunta, cinco_perguntas: cincoPerguntas, leitura: `${cincoPerguntas.n_perguntas} perguntas na mesma chamada custaram ${cincoPerguntas.tokens_por_chamada_media} tokens/chamada contra ${umaPergunta.tokens_por_chamada_media} de 1 pergunta (${Math.round((cincoPerguntas.tokens_por_chamada_media / umaPergunta.tokens_por_chamada_media) * 100) / 100}x) — mas são ${cincoPerguntas.n_perguntas}x menos chamadas para o mesmo total de respostas.`, gasto_acumulado_bateria: estadoGasto() };
writeFileSync(import.meta.dir + "/e5-resultado.json", JSON.stringify(saida, null, 1));
console.log(JSON.stringify({ uma: umaPergunta, cinco: cincoPerguntas }, null, 1));

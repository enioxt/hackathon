// E2 — Texto livre em volume: 400 mensagens sintéticas, 5 classes, geradas por combinação determinística
// (semente) de modelos de frase x vocabulário x ruído. Compara a regra de palavras-chave de
// comparar-texto.ts (copiada literal — o arquivo é congelado e não exporta a função) x Jev.
import { writeFileSync } from "node:fs";
import { chamarJev } from "./chamar-jev.ts";
import { emLotes, estadoGasto } from "./gasto.ts";
import { criarRng, escolher } from "./aleatorio.ts";

type Classe = "nao_clica" | "confuso" | "ideia_layout" | "falta_dado" | "outra";
type Msg = { texto: string; rotulo: Classe; ambigua: boolean; ruido: string };

// cópia literal da regra congelada de comparar-texto.ts:12 (arquivo não exporta a função)
const chaveDePalavra = (t: string): Classe =>
  /clic|toque|apert|trava|não respond|nao respond|some|não rola/i.test(t) ? "nao_clica"
  : /entend|signific|claro|por que|confus/i.test(t) ? "confuso"
  : /seria melhor|queria|podia|modo|versão/i.test(t) ? "ideia_layout"
  : /cadê|falta|têm a|de onde|percentual|número de/i.test(t) ? "falta_dado"
  : "outra";
// cópia literal dos critérios de comparar-texto.ts:11
const criterios: Record<Classe, string> = {
  nao_clica: "algo na tela não responde, está quebrado ou inacessível",
  confuso: "a pessoa não entendeu algo; pede explicação ou clareza",
  ideia_layout: "sugestão de outra forma de organizar ou apresentar a tela",
  falta_dado: "pede um número, uma fonte ou um dado que não encontrou",
  outra: "elogio, pergunta fora do sistema, teste ou assunto não relacionado",
};

const vocab = ["o painel", "o mapa", "a ficha da zona", "o cartão do ponto", "a central", "o gráfico", "a tabela de câmeras", "o botão de exportar", "a barra de filtro", "o número de acidentes"];
const modelos: Record<Classe, ((x: string) => string)[]> = {
  nao_clica: [(x) => `cliquei em ${x} e não aconteceu nada`, (x) => `o botão de ${x} não responde ao toque`, (x) => `a tela trava quando abro ${x}`, (x) => `não consigo abrir ${x}, fica travado`, (x) => `no celular ${x} não funciona`, (x) => `${x} some quando a tela é pequena`],
  confuso: [(x) => `não entendi o que ${x} significa`, (x) => `fiquei confuso com ${x}, dá pra explicar?`, (x) => `não ficou claro se ${x} é real ou só exemplo`, (x) => `por que ${x} tem esse nome?`, (x) => `não sei por onde começar em ${x}`],
  ideia_layout: [(x) => `seria melhor se ${x} ficasse maior na tela`, (x) => `queria uma versão de ${x} mais simples`, (x) => `podia ter um modo lista pra ${x}`, (x) => `sugiro reorganizar ${x} pra cima`, (x) => `${x} devia ficar fixo no topo`],
  falta_dado: [(x) => `cadê o número por trás de ${x}?`, (x) => `falta mostrar a fonte de ${x}`, (x) => `vocês têm o dado real de ${x}? não achei`, (x) => `de onde vem o valor mostrado em ${x}?`, (x) => `${x} tá com dois números diferentes`],
  outra: [() => `parabéns pelo trabalho, ficou muito bom`, () => `oi, teste`, () => `qual o horário da apresentação amanhã?`, () => `só passando pra avisar que chego às 10`, () => `bom dia, tudo certo por aí?`],
};
const classes: Classe[] = ["nao_clica", "confuso", "ideia_layout", "falta_dado", "outra"];

function semAcento(s: string) { return s.normalize("NFD").replace(/[̀-ͯ]/g, ""); }
function comGiria(s: string) { return s.replace(/\bnão\b/gi, "n").replace(/\bestá\b/gi, "tá").replace(/\bvocê\b/gi, "vc") + " mano"; }
function comErroDigitacao(s: string, rng: () => number) {
  const chars = s.split("");
  const i = Math.floor(rng() * (chars.length - 1)) + 1;
  if (rng() < 0.5) [chars[i - 1], chars[i]] = [chars[i], chars[i - 1]]; else chars.splice(i, 1);
  return chars.join("");
}

const rng = criarRng(20260920);
const mensagens: Msg[] = [];
let i = 0;
while (mensagens.length < 400) {
  const classe = classes[i % classes.length];
  const modelo = escolher(rng, modelos[classe]);
  const x = escolher(rng, vocab);
  let texto = modelo(x);
  let ruido = "nenhum", ambigua = false, rotulo = classe;
  const r = rng();
  if (r < 0.15) { texto = semAcento(texto); ruido = "sem_acento"; }
  else if (r < 0.3) { texto = comGiria(texto); ruido = "giria"; }
  else if (r < 0.45) { texto = comErroDigitacao(texto, rng); ruido = "erro_digitacao"; }
  else if (r < 0.55) { texto = x; ruido = "curta"; } // mensagem curtíssima, só o assunto
  else if (r < 0.65) {
    // longa com dois assuntos: o principal (rótulo) + um segundo de outra classe
    const outraClasse = classes[(classes.indexOf(classe) + 1 + Math.floor(rng() * 3)) % classes.length];
    const x2 = escolher(rng, vocab);
    const modelo2 = escolher(rng, modelos[outraClasse]);
    texto = `${texto}. e também, ${modelo2(x2)}`;
    ruido = "longa_dois_assuntos"; ambigua = true;
  }
  mensagens.push({ texto, rotulo, ambigua, ruido });
  i++;
}

async function rodar() {
  let okRegra = 0; const errosRegra: string[] = [];
  for (const m of mensagens) if (chaveDePalavra(m.texto) === m.rotulo) okRegra++; else errosRegra.push(`[${m.ruido}] "${m.texto}" — esperado ${m.rotulo}, regra deu ${chaveDePalavra(m.texto)}`);

  const respostasJev = await emLotes(mensagens, 6, async (m) => {
    const r = await chamarJev("e2-texto-volume", m.texto, { tipo: { type: "choice", instructions: "Que tipo de pedido é esta mensagem enviada por um visitante do painel?", criteria: criterios } });
    const a = r.answers.tipo as { choice: string; confidence: number };
    return { m, choice: a.choice as Classe, confidence: a.confidence };
  });
  let okJev = 0; const errosJev: string[] = [];
  const porClasse: Record<Classe, { total: number; ok_regra: number; ok_jev: number }> = Object.fromEntries(classes.map((c) => [c, { total: 0, ok_regra: 0, ok_jev: 0 }])) as any;
  let ambiguasTotal = 0, ambiguasOkRegra = 0, ambiguasOkJev = 0;
  for (const { m, choice, confidence } of respostasJev) {
    porClasse[m.rotulo].total++;
    if (chaveDePalavra(m.texto) === m.rotulo) porClasse[m.rotulo].ok_regra++;
    if (choice === m.rotulo) { okJev++; porClasse[m.rotulo].ok_jev++; } else errosJev.push(`[${m.ruido}] "${m.texto}" — esperado ${m.rotulo}, jev deu ${choice} (${confidence})`);
    if (m.ambigua) { ambiguasTotal++; if (chaveDePalavra(m.texto) === m.rotulo) ambiguasOkRegra++; if (choice === m.rotulo) ambiguasOkJev++; }
  }
  return {
    quando: new Date().toISOString(), total: mensagens.length,
    regra: { certos: okRegra, taxa: Math.round((okRegra / mensagens.length) * 1000) / 1000, primeiros_erros: errosRegra.slice(0, 15) },
    jev: { certos: okJev, taxa: Math.round((okJev / mensagens.length) * 1000) / 1000, primeiros_erros: errosJev.slice(0, 15) },
    por_classe: porClasse,
    ambiguas: { total: ambiguasTotal, ok_regra: ambiguasOkRegra, ok_jev: ambiguasOkJev },
    detalhe_para_e3_e4: respostasJev.map(({ m, choice, confidence }) => ({ texto: m.texto, rotulo: m.rotulo, ruido: m.ruido, ambigua: m.ambigua, jev_choice: choice, jev_confidence: confidence })),
    gasto_acumulado_bateria: estadoGasto(),
  };
}
const saida = await rodar();
writeFileSync(import.meta.dir + "/e2-resultado.json", JSON.stringify(saida, null, 1));
console.log(JSON.stringify({ regra: saida.regra.taxa, jev: saida.jev.taxa, ambiguas: saida.ambiguas }, null, 1));

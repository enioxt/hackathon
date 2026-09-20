// E1 — Números: dá para o Jev alcançar as regras? 24 cenários de comparar.ts (arquivo congelado, sem
// export da lista — por isso os valores estão copiados aqui, não reimportados) + 96 novos gerados por
// semente. 4 variantes da MESMA pergunta contra o MESMO Jev. Reaproveita contratoEvento/motorRegras.
import { writeFileSync } from "node:fs";
import { contratoEvento } from "../evento-de-transito.ts";
import { chamarJev, type PerguntaAPI } from "./chamar-jev.ts";
import { emLotes, estadoGasto } from "./gasto.ts";
import { criarRng, entre, inteiroEntre } from "./aleatorio.ts";

type Rotulo = "fila_anormal" | "veiculo_parado" | "contramao" | "nada" | "duvidoso";
type Caso = { origem: "comparar.ts" | "gerado"; rotulo: Rotulo; e: { fila_m: number; fila_habitual_m: number; maior_tempo_parado_s: number; veiculos_por_min: number; cruzamentos_sentido_oposto: number } };

// --- 1) os 24 cenários de comparar.ts, mesmos valores e mesmos rótulos (cópia de dado, não de lógica) ---
const c = (rotulo: Rotulo, fila: number, hab: number, parado: number, fluxo: number, oposto: number): Caso => ({
  origem: "comparar.ts",
  rotulo,
  e: { fila_m: fila, fila_habitual_m: hab, maior_tempo_parado_s: parado, veiculos_por_min: fluxo, cruzamentos_sentido_oposto: oposto },
});
const casosOriginais: Caso[] = [
  c("nada", 12, 14, 8, 11, 0), c("nada", 20, 18, 15, 9, 0), c("nada", 5, 6, 4, 14, 0), c("nada", 30, 28, 22, 8, 0), c("nada", 16, 15, 30, 10, 0), c("nada", 9, 10, 12, 6, 0),
  c("fila_anormal", 64, 15, 20, 9, 0), c("fila_anormal", 90, 20, 35, 7, 0), c("fila_anormal", 48, 12, 18, 10, 0), c("fila_anormal", 120, 30, 40, 5, 0), c("fila_anormal", 55, 14, 25, 8, 0), c("fila_anormal", 70, 18, 28, 6, 0),
  c("veiculo_parado", 16, 15, 170, 10, 0), c("veiculo_parado", 14, 14, 240, 12, 0), c("veiculo_parado", 22, 18, 300, 9, 0), c("veiculo_parado", 10, 12, 150, 11, 0), c("veiculo_parado", 18, 16, 420, 8, 0),
  c("contramao", 12, 14, 8, 11, 1), c("contramao", 20, 18, 10, 9, 2), c("contramao", 15, 15, 12, 7, 1), c("contramao", 25, 20, 18, 10, 3),
  c("duvidoso", 25, 15, 50, 6, 0), c("duvidoso", 28, 18, 65, 5, 0), c("duvidoso", 24, 14, 58, 7, 0),
];

// --- 2) 96 novos, gerados por semente, rotulados pela DEFINIÇÃO escrita no pedido:
//     fila >= 2.5x habitual = fila anormal · parado >= 120s com fluxo >= 5/min = veículo parado ·
//     >= 1 cruzamento oposto = contramão · senão nada · a <15% de um limiar (fila ou parado) = duvidoso.
function rotular(e: Caso["e"]): Rotulo {
  if (e.cruzamentos_sentido_oposto >= 1) return "contramao";
  const ratio = e.fila_m / e.fila_habitual_m;
  const distFila = Math.abs(ratio - 2.5) / 2.5;
  const paradoAtivo = e.veiculos_por_min >= 5;
  const distParado = Math.abs(e.maior_tempo_parado_s - 120) / 120;
  if (distFila <= 0.15 || (paradoAtivo && distParado <= 0.15)) return "duvidoso";
  if (ratio >= 2.5) return "fila_anormal";
  if (e.maior_tempo_parado_s >= 120 && paradoAtivo) return "veiculo_parado";
  return "nada";
}
const rng = criarRng(20260920);
function gerarAte(alvo: Rotulo, n: number, fabricar: () => Caso["e"]): Caso[] {
  const out: Caso[] = [];
  let tentativas = 0;
  while (out.length < n && tentativas < n * 200) {
    tentativas++;
    const e = fabricar();
    if (rotular(e) === alvo) out.push({ origem: "gerado", rotulo: alvo, e });
  }
  if (out.length < n) throw new Error(`não consegui gerar ${n} casos de "${alvo}" (só ${out.length} em ${tentativas} tentativas)`);
  return out;
}
const gerados: Caso[] = [
  ...gerarAte("nada", 19, () => ({ fila_m: entre(rng, 5, 30), fila_habitual_m: entre(rng, 10, 30), maior_tempo_parado_s: entre(rng, 5, 90), veiculos_por_min: entre(rng, 3, 15), cruzamentos_sentido_oposto: 0 })),
  ...gerarAte("fila_anormal", 20, () => ({ fila_m: entre(rng, 40, 150), fila_habitual_m: entre(rng, 10, 25), maior_tempo_parado_s: entre(rng, 10, 50), veiculos_por_min: entre(rng, 4, 12), cruzamentos_sentido_oposto: 0 })),
  ...gerarAte("veiculo_parado", 19, () => ({ fila_m: entre(rng, 8, 22), fila_habitual_m: entre(rng, 10, 22), maior_tempo_parado_s: entre(rng, 140, 500), veiculos_por_min: entre(rng, 5, 16), cruzamentos_sentido_oposto: 0 })),
  ...gerarAte("contramao", 19, () => ({ fila_m: entre(rng, 8, 30), fila_habitual_m: entre(rng, 10, 25), maior_tempo_parado_s: entre(rng, 5, 40), veiculos_por_min: entre(rng, 4, 14), cruzamentos_sentido_oposto: inteiroEntre(rng, 1, 4) })),
  ...gerarAte("duvidoso", 19, () => {
    // metade perto do limiar de fila (ratio~2.5, fluxo baixo p/ não ativar parado), metade perto do limiar de parado (~120s, fluxo alto)
    if (rng() < 0.5) return { fila_m: entre(rng, 21, 29) * entre(rng, 0.98, 1.0) /* aprox 2.5x */, fila_habitual_m: 10, maior_tempo_parado_s: entre(rng, 5, 60), veiculos_por_min: entre(rng, 1, 4.5), cruzamentos_sentido_oposto: 0 };
    return { fila_m: entre(rng, 5, 15), fila_habitual_m: 15, maior_tempo_parado_s: entre(rng, 104, 138), veiculos_por_min: entre(rng, 5, 14), cruzamentos_sentido_oposto: 0 };
  }),
];
const casos: Caso[] = [...casosOriginais, ...gerados];

// --- 3) as 4 variantes de pergunta ---
const opcoesBasicas = contratoEvento.perguntas.o_que_e.tipo === "escolha" ? contratoEvento.perguntas.o_que_e.opcoes : [];
const opcoesComLimiar: Record<string, string> = {
  fila_anormal: "fila igual ou acima de 2,5 vezes o tamanho habitual para o horário",
  veiculo_parado: "veículo imóvel por 120 segundos ou mais, com fluxo de 5 ou mais veículos/min ao redor",
  contramao: "1 ou mais veículos cruzando a linha no sentido oposto ao da via",
  nada: "nenhuma das condições acima",
};
type Variante = "a_texto_atual" | "b_com_razoes" | "c_com_limiares" | "d_razoes_e_limiares";
function estadoBasico(e: Caso["e"]): string {
  return `Leitura de uma câmera de trânsito. Fila atual: ${e.fila_m} metros; fila habitual para este horário: ${e.fila_habitual_m} metros. Veículo imóvel há mais tempo: ${e.maior_tempo_parado_s} segundos. Fluxo: ${e.veiculos_por_min} veículos por minuto. Veículos que cruzaram no sentido oposto ao da via: ${e.cruzamentos_sentido_oposto}.`;
}
function estadoComRazoes(e: Caso["e"]): string {
  const ratio = Math.round((e.fila_m / e.fila_habitual_m) * 100) / 100;
  return `${estadoBasico(e)} Cálculo já feito: a fila está ${ratio} vezes a fila habitual. O veículo parado ficou imóvel ${e.maior_tempo_parado_s} segundos com fluxo de ${e.veiculos_por_min} veículos/min ao redor. Houve ${e.cruzamentos_sentido_oposto} cruzamento(s) no sentido oposto.`;
}
function perguntaPara(v: Variante): PerguntaAPI {
  const criteria = v === "c_com_limiares" || v === "d_razoes_e_limiares" ? opcoesComLimiar : Object.fromEntries(opcoesBasicas.map((o) => [o.id, o.descricao]));
  return { type: "choice", instructions: "O que está acontecendo neste ponto?", criteria };
}
function estadoPara(v: Variante, e: Caso["e"]): string {
  return v === "b_com_razoes" || v === "d_razoes_e_limiares" ? estadoComRazoes(e) : estadoBasico(e);
}

const LIMIAR_ABSTENCAO = 0.6;
const variantes: Variante[] = ["a_texto_atual", "b_com_razoes", "c_com_limiares", "d_razoes_e_limiares"];

async function rodarVariante(v: Variante) {
  const matriz: Record<string, Record<string, number>> = {};
  let certos = 0, errados = 0, abstencoes = 0;
  const erros: string[] = [];
  const respostas = await emLotes(casos, 6, async (caso) => {
    const r = await chamarJev(`e1-${v}`, estadoPara(v, caso.e), { o_que_e: perguntaPara(v) });
    const a = r.answers.o_que_e as { choice: string; confidence: number };
    const abstem = a.confidence < LIMIAR_ABSTENCAO;
    return { caso, escolha: abstem ? "nao_sei" : a.choice, confianca: a.confidence };
  });
  for (const { caso, escolha, confianca } of respostas) {
    matriz[caso.rotulo] ??= {};
    matriz[caso.rotulo][escolha] = (matriz[caso.rotulo][escolha] ?? 0) + 1;
    if (caso.rotulo === "duvidoso") {
      if (escolha === "nao_sei") { certos++; abstencoes++; } else { errados++; erros.push(`duvidoso→${escolha} (${confianca})`); }
    } else if (escolha === "nao_sei") { abstencoes++; erros.push(`${caso.rotulo}→não sei`); }
    else if (escolha === caso.rotulo) certos++;
    else { errados++; erros.push(`${caso.rotulo}→${escolha}`); }
  }
  return { variante: v, casos: casos.length, certos, errados, abstencoes, matriz_confusao: matriz, primeiros_erros: erros.slice(0, 15) };
}

const resultados = [];
for (const v of variantes) resultados.push(await rodarVariante(v)); // sequencial entre variantes; paralelo (6) dentro de cada uma

const saida = { quando: new Date().toISOString(), total_casos: casos.length, casos_originais: casosOriginais.length, casos_gerados: gerados.length, limiar_abstencao: LIMIAR_ABSTENCAO, resultados, gasto_acumulado_bateria: estadoGasto() };
writeFileSync(import.meta.dir + "/e1-resultado.json", JSON.stringify(saida, null, 1));
console.log(JSON.stringify({ resumo: resultados.map((r) => ({ variante: r.variante, certos: r.certos, errados: r.errados, abstencoes: r.abstencoes })) }, null, 1));

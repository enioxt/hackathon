// E8 — Relato de cidadão sobre trânsito (uso de produto mais provável): 150 relatos sintéticos,
// gerados por semente, SEM nome de pessoa/placa/telefone/rua real. 5 classes + nota de urgência (3
// níveis) + "precisa de pessoa agora?" — as 3 perguntas na MESMA chamada (reaproveita o achado de E5).
import { writeFileSync } from "node:fs";
import { chamarJev } from "./chamar-jev.ts";
import { emLotes, estadoGasto } from "./gasto.ts";
import { criarRng, escolher } from "./aleatorio.ts";

type Classe = "risco_imediato" | "obstrucao" | "sinalizacao" | "via_pavimento" | "sem_ocorrencia";
type Caso = { texto: string; rotulo: Classe; urgencia_esperada: 0 | 1 | 2 }; // 0 baixa · 1 média · 2 alta

const locais = ["perto da escola", "na rotatória", "no cruzamento", "na avenida principal", "perto do posto de saúde", "na entrada do bairro", "perto do mercado", "na ponte"];
const modelos: { rotulo: Classe; urgencia: 0 | 1 | 2; frases: ((l: string) => string)[] }[] = [
  { rotulo: "risco_imediato", urgencia: 2, frases: [
    (l) => `moto na contramão ${l}, quase bateu de frente`, (l) => `carro em alta velocidade ${l}, várias pessoas atravessando`,
    (l) => `criança quase atropelada ${l} agora mesmo`, (l) => `dois carros quase colidiram ${l}, motorista não parou`,
    (l) => `pessoa atravessando fora da faixa ${l} com carros não parando`,
  ]},
  { rotulo: "obstrucao", urgencia: 1, frases: [
    (l) => `carro parado em fila dupla ${l}, atrapalhando o trânsito`, (l) => `caminhão bloqueando a faixa ${l} há uns 20 minutos`,
    (l) => `carreta parada na esquina ${l}, ninguém consegue passar`, (l) => `obra sem sinalização ocupando a pista ${l}`,
    (l) => `ônibus parado no meio da via ${l}, fila enorme atrás`,
  ]},
  { rotulo: "sinalizacao", urgencia: 1, frases: [
    (l) => `semáforo apagado desde cedo ${l}`, (l) => `placa de pare caída ${l}`,
    (l) => `sinalização de faixa de pedestre apagada ${l}`, (l) => `semáforo piscando amarelo o dia todo ${l}`,
    (l) => `falta placa indicando sentido proibido ${l}`,
  ]},
  { rotulo: "via_pavimento", urgencia: 0, frases: [
    (l) => `buraco grande na faixa da direita ${l}`, (l) => `asfalto afundado ${l}, carros desviando`,
    (l) => `bueiro sem tampa ${l}`, (l) => `pista com poça grande que não seca ${l}`,
    (l) => `remendo mal feito no asfalto ${l}, causando solavanco`,
  ]},
  { rotulo: "sem_ocorrencia", urgencia: 0, frases: [
    (l) => `tudo normal ${l}, só passando pra avisar que está tranquilo`, (l) => `trânsito fluindo bem ${l} hoje de manhã`,
    (l) => `sem problema nenhum ${l} no momento`, (l) => `só queria elogiar a sinalização nova ${l}`,
    (l) => `hoje o dia foi corrido, cansei de andar por aqui, mas nada de errado ${l}`, // desabafo sem fato
  ]},
];

const rng = criarRng(20260920);
const classes: Classe[] = ["risco_imediato", "obstrucao", "sinalizacao", "via_pavimento", "sem_ocorrencia"];
const casos: Caso[] = [];
let i = 0;
while (casos.length < 150) {
  const grupo = modelos[i % modelos.length];
  const frase = escolher(rng, grupo.frases);
  const local = escolher(rng, locais);
  casos.push({ texto: frase(local), rotulo: grupo.rotulo, urgencia_esperada: grupo.urgencia });
  i++;
}
// checagem de fronteira: nenhum relato sintético cita nome próprio, placa (padrão AAA0A00/AAA0000) ou telefone
const violacoes = casos.filter((c) => /\b[A-Z]{3}[- ]?\d[A-Z0-9]\d{2,3}\b/.test(c.texto) || /\b\d{4,5}-?\d{4}\b/.test(c.texto));
if (violacoes.length) throw new Error(`ache PII-like em relato sintético (não deveria existir): ${JSON.stringify(violacoes[0])}`);

const criterios: Record<Classe, string> = {
  risco_imediato: "quase acidente, veículo em alta velocidade, pessoa em risco imediato de atropelamento",
  obstrucao: "veículo ou obra bloqueando a via, sem risco imediato à vida",
  sinalizacao: "semáforo, placa ou sinalização de trânsito ausente, apagada ou quebrada",
  via_pavimento: "problema físico na pista: buraco, bueiro, afundamento, poça",
  sem_ocorrencia: "elogio, aviso de normalidade, desabafo sem fato de trânsito, ou nada a relatar",
};
const perguntas = {
  tipo: { type: "choice" as const, instructions: "Que tipo de relato de trânsito é esta mensagem de um cidadão?", criteria: criterios },
  urgencia: { type: "score" as const, instructions: "Quão urgente é este relato para a prefeitura agir?", criteria: ["baixa", "média", "alta"] },
  precisa_pessoa_agora: { type: "noul" as const, instructions: "Este relato precisa de uma pessoa olhando AGORA (não pode esperar a triagem automática)?" },
};

async function rodar() {
  const respostas = await emLotes(casos, 6, async (c) => {
    const r = await chamarJev("e8-relato-cidadao", c.texto, perguntas);
    const tipo = r.answers.tipo as { choice: string; confidence: number };
    const urg = r.answers.urgencia as { score: number; confidence: number };
    const pessoa = r.answers.precisa_pessoa_agora as { noul: number };
    return { c, tipo_choice: tipo.choice, tipo_confidence: tipo.confidence, urgencia_score: urg.score, precisa_pessoa: pessoa.noul };
  });
  let okTipo = 0; const errosTipo: string[] = [];
  const porClasse: Record<Classe, { total: number; ok: number }> = Object.fromEntries(classes.map((c) => [c, { total: 0, ok: 0 }])) as any;
  let somaDiffUrgencia = 0;
  let riscoImediatoPedePessoa = 0, riscoImediatoTotal = 0;
  for (const r of respostas) {
    porClasse[r.c.rotulo].total++;
    if (r.tipo_choice === r.c.rotulo) { okTipo++; porClasse[r.c.rotulo].ok++; } else errosTipo.push(`"${r.c.texto}" — esperado ${r.c.rotulo}, jev deu ${r.tipo_choice} (${r.tipo_confidence})`);
    somaDiffUrgencia += Math.abs(r.urgencia_score - r.c.urgencia_esperada);
    if (r.c.rotulo === "risco_imediato") { riscoImediatoTotal++; if (r.precisa_pessoa >= 0.5) riscoImediatoPedePessoa++; }
  }
  return {
    quando: new Date().toISOString(), total: casos.length,
    tipo: { certos: okTipo, taxa: Math.round((okTipo / casos.length) * 1000) / 1000, primeiros_erros: errosTipo.slice(0, 15) },
    por_classe: porClasse,
    urgencia_erro_medio: Math.round((somaDiffUrgencia / casos.length) * 1000) / 1000, // 0 = nota bateu exato; escala 0-2
    risco_imediato_pede_pessoa_agora: { total: riscoImediatoTotal, sim: riscoImediatoPedePessoa, taxa: riscoImediatoTotal ? Math.round((riscoImediatoPedePessoa / riscoImediatoTotal) * 1000) / 1000 : null },
    gasto_acumulado_bateria: estadoGasto(),
  };
}
const saida = await rodar();
writeFileSync(import.meta.dir + "/e8-resultado.json", JSON.stringify(saida, null, 1));
console.log(JSON.stringify({ tipo_taxa: saida.tipo.taxa, urgencia_erro_medio: saida.urgencia_erro_medio, risco_imediato_pede_pessoa: saida.risco_imediato_pede_pessoa_agora }, null, 1));

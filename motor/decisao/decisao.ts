// Decisão tipada — a camada que fica ENTRE o código fixo e o modelo que redige.
// Três tipos de pergunta, no padrão "System One": escolha (uma opção de uma lista, com a distribuição),
// nota (posição numa escala descrita em palavras) e sim_nao (probabilidade de "sim").
// Regras da casa: confiança NÃO é prova · abaixo do limiar a resposta é "não sei" e vai para uma pessoa ·
// a saída carrega a versão do contrato e o motor que respondeu · mesma entrada, mesma saída.
export type Opcao = { id: string; descricao: string };
export type Pergunta =
  | { tipo: "escolha"; texto: string; opcoes: Opcao[]; limiar: number }
  | { tipo: "nota"; texto: string; niveis: string[]; limiar: number }
  | { tipo: "sim_nao"; texto: string; limiar: number };
export type Contrato = { id: string; versao: number; perguntas: Record<string, Pergunta> };
export type Estado = Record<string, number | string | boolean | null>;
export type Resposta = {
  pergunta: string; tipo: Pergunta["tipo"];
  escolhida: string | null;            // escolha: id da opção · nota: índice arredondado como texto · sim_nao: "sim" | "nao"
  valor: number | null;                // nota: posição fracionária na escala · sim_nao: P(sim)
  distribuicao: Record<string, number>;
  confianca: number;                   // maior probabilidade da distribuição (não é acerto medido)
  abstencao: boolean;                  // true = "não sei": precisa de gente
};
export type Decisao = { contrato: string; versao: number; motor: string; respostas: Record<string, Resposta> };
// Um motor devolve, para cada pergunta, pesos não normalizados por alternativa. O resto é igual para todo motor.
export type Motor = { nome: string; pesos(p: Pergunta, idPergunta: string, estado: Estado): Promise<Record<string, number>> | Record<string, number> };

const normalizar = (pesos: Record<string, number>) => {
  const ks = Object.keys(pesos).sort(), m = Math.max(...ks.map((k) => pesos[k]));
  const e = ks.map((k) => Math.exp(pesos[k] - m)), s = e.reduce((a, b) => a + b, 0);
  return Object.fromEntries(ks.map((k, i) => [k, Math.round((e[i] / s) * 1e6) / 1e6]));
};
const alternativas = (p: Pergunta) => p.tipo === "escolha" ? p.opcoes.map((o) => o.id) : p.tipo === "nota" ? p.niveis.map((_, i) => String(i)) : ["sim", "nao"];

export async function decidir(contrato: Contrato, estado: Estado, motor: Motor): Promise<Decisao> {
  const respostas: Record<string, Resposta> = {};
  for (const id of Object.keys(contrato.perguntas).sort()) {          // ordem fixa: a ordem de entrada não muda o resultado
    const p = contrato.perguntas[id], alts = alternativas(p), bruto = await motor.pesos(p, id, estado);
    for (const a of alts) if (typeof bruto[a] !== "number" || Number.isNaN(bruto[a])) throw new Error(`motor ${motor.nome} não respondeu a alternativa "${a}" da pergunta "${id}"`);
    const dist = normalizar(Object.fromEntries(alts.map((a) => [a, bruto[a]])));
    const topo = alts.reduce((a, b) => (dist[b] > dist[a] ? b : a)), confianca = dist[topo], abstencao = confianca < p.limiar;
    const valor = p.tipo === "nota" ? Math.round(alts.reduce((s, a) => s + Number(a) * dist[a], 0) * 1e4) / 1e4 : p.tipo === "sim_nao" ? dist["sim"] : null;
    respostas[id] = { pergunta: p.texto, tipo: p.tipo, escolhida: abstencao ? null : topo, valor, distribuicao: dist, confianca, abstencao };
  }
  return { contrato: contrato.id, versao: contrato.versao, motor: motor.nome, respostas };
}

// Motor remoto (TypeSafe/Jev). NÃO está ligado: falta chave e nunca foi chamado por nós. Falha em voz alta, de propósito.
export const motorJev: Motor = { nome: "jev-remoto", pesos() { throw new Error("motor Jev NÃO CONFIGURADO: defina TYPESAFE_API_KEY e implemente a chamada — até lá use o motor de regras"); } };

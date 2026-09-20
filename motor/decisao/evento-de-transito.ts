// Contrato e motor de regras para a triagem de evento numa câmera. Entradas = só números que o leitor já produz.
import type { Contrato, Motor, Estado } from "./decisao.ts";
export const contratoEvento: Contrato = { id: "evento-de-transito", versao: 1, perguntas: {
  o_que_e: { tipo: "escolha", limiar: 0.6, texto: "O que está acontecendo neste ponto?", opcoes: [
    { id: "fila_anormal", descricao: "fila bem acima do habitual para o horário" },
    { id: "veiculo_parado", descricao: "um veículo imóvel na faixa enquanto os outros andam" },
    { id: "contramao", descricao: "veículo cruzando a linha no sentido oposto ao da via" },
    { id: "nada", descricao: "dentro do esperado" } ] },
  gravidade: { tipo: "nota", limiar: 0.5, texto: "Quão grave é para a circulação?", niveis: ["sem efeito", "atrapalha", "bloqueia a via"] },
  chamar_gente: { tipo: "sim_nao", limiar: 0.7, texto: "Isto precisa ser visto por uma pessoa agora?" } } };
const n = (e: Estado, k: string) => (typeof e[k] === "number" ? (e[k] as number) : 0);
export const motorRegras: Motor = { nome: "regras-v1", pesos(p, id, e) {
  const fila = n(e, "fila_m") / Math.max(1, n(e, "fila_habitual_m")), parado = n(e, "maior_tempo_parado_s"), fluxo = n(e, "veiculos_por_min"), oposto = n(e, "cruzamentos_sentido_oposto");
  if (id === "o_que_e") return { fila_anormal: 3 * (fila - 1.5), veiculo_parado: (parado - 60) / 15 + (fluxo > 4 ? 1 : -2), contramao: 4 * oposto - 2, nada: 1.2 - Math.max(0, fila - 1) - parado / 60 - 2 * oposto };
  if (id === "gravidade") { const g = Math.max(fila - 1, parado / 90, oposto); return { "0": 2 - 3 * g, "1": 1.5 - 3 * Math.abs(g - 0.8), "2": 3 * g - 3 }; }
  if (id === "chamar_gente") { const g = Math.max(fila - 1.6, (parado - 60) / 60, oposto - 0.5); return { sim: 4 * g, nao: -4 * g }; }
  throw new Error("pergunta desconhecida: " + id);
} };

// Motor Jev (TypeSafe, modelo de decisão). Mesma interface dos outros motores. A chave vem de JEV_KEY no ambiente; nunca fica em arquivo do repositório.
import type { Motor, Pergunta, Estado } from "./decisao.ts";
export const usoJev = { chamadas: 0, tokens_entrada: 0, ms: [] as number[] };
const cache = new Map<string, Promise<Record<string, Record<string, number>>>>();
const descrever = (e: Estado) => `Leitura de uma câmera de trânsito. Fila atual: ${e.fila_m} metros; fila habitual para este horário: ${e.fila_habitual_m} metros. Veículo imóvel há mais tempo: ${e.maior_tempo_parado_s} segundos. Fluxo: ${e.veiculos_por_min} veículos por minuto. Veículos que cruzaram no sentido oposto ao da via: ${e.cruzamentos_sentido_oposto}.`;
export function criarMotorJev(perguntas: Record<string, Pergunta>): Motor {
  const chave = process.env.JEV_KEY; if (!chave) throw new Error("motor Jev NÃO CONFIGURADO: defina JEV_KEY no ambiente");
  const corpoPerguntas = Object.fromEntries(Object.entries(perguntas).map(([id, p]) => [id, p.tipo === "escolha" ? { type: "choice", instructions: p.texto, criteria: Object.fromEntries(p.opcoes.map((o) => [o.id, o.descricao])) } : p.tipo === "nota" ? { type: "score", instructions: p.texto, criteria: p.niveis } : { type: "noul", instructions: p.texto }]));
  async function chamar(e: Estado) {
    const t0 = performance.now(), r = await fetch("https://api.typesafe.ai/v1/systemone", { method: "POST", headers: { authorization: `Bearer ${chave}`, "content-type": "application/json" }, body: JSON.stringify({ state: descrever(e), model: "jev-latest", questions: corpoPerguntas }) });
    if (!r.ok) throw new Error(`Jev respondeu HTTP ${r.status}: ${(await r.text()).slice(0, 160)}`);
    const j = (await r.json()) as { answers: Record<string, { type: string; probabilities?: Record<string, number>; noul?: number }>; usage?: { input_tokens?: number } };
    usoJev.chamadas++; usoJev.tokens_entrada += j.usage?.input_tokens ?? 0; usoJev.ms.push(performance.now() - t0);
    const lg = (x: number) => Math.log(Math.max(x, 1e-6));   // a camada de cima normaliza com softmax: log(p) devolve p
    return Object.fromEntries(Object.entries(j.answers).map(([id, a]) => [id, a.type === "noul" ? { sim: lg(a.noul ?? 0.5), nao: lg(1 - (a.noul ?? 0.5)) } : Object.fromEntries(Object.entries(a.probabilities ?? {}).map(([k, v]) => [k, lg(v)]))]));
  }
  return { nome: "jev-latest", async pesos(_p, id, e) { const k = JSON.stringify(Object.entries(e).sort()); if (!cache.has(k)) cache.set(k, chamar(e)); const tudo = await cache.get(k)!; if (!tudo[id]) throw new Error(`Jev não respondeu a pergunta "${id}"`); return tudo[id]; } };
}

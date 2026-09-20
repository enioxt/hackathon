// Ponte entre o painel do Rafael (MOBILIDADE V2.2) e o nosso motor.
// O painel dele já espera duas integrações, configuráveis na engrenagem da tela:
//   · "API de pontos para zona de calor"  → GET  /heat       → [{lat,lng,weight}]
//   · "WebSocket de analytics da câmera"  → WS   /analytics  → {counts,flow,occupancy,metrics,origem}
// Esta ponte entrega as duas a partir do que já temos, sem mexer no código dele:
//   /heat       = as 1.100 ocorrências com coordenada do dado aberto SEJUSP-MG (MEDIDO)
//   /analytics  = a última leitura recebida pela nossa porta de entrada (/api/estado)
// Só escuta em 127.0.0.1. Não guarda nada. Não envia caixas: caixa sem o vídeo por baixo engana.
import { readFileSync } from "node:fs";

const PORTA = Number(process.env.PONTE_PORTA ?? 8790);
const CCO = process.env.CCO_URL ?? "http://127.0.0.1:8787";
const ARQ = process.env.PONTE_PONTOS ?? "/home/enio/.egos/hackathon/repo/dados/publicos/acidentes-pontos.json";
const PESO: Record<string, number> = { FATAL: 1, GRAVE: 0.8, LEVE: 0.4 };

const cors = { "access-control-allow-origin": "*", "cache-control": "no-store" };

function pontosDeCalor() {
  const d = JSON.parse(readFileSync(ARQ, "utf8")) as { ocorrencias: { lat: number; lon: number; pior?: string }[] };
  return d.ocorrencias
    .filter((o) => Number.isFinite(o.lat) && Number.isFinite(o.lon))
    .map((o) => ({ lat: o.lat, lng: o.lon, weight: PESO[o.pior ?? ""] ?? 0.3 }));
}

type Leitura = { ts: string; janela_s: number; automovel: number; moto: number; onibus: number; caminhao: number; fila_m: number | null; origem: string };

async function ultimaLeitura(): Promise<{ camera_id: string; l: Leitura } | null> {
  const r = await fetch(`${CCO}/api/estado`);
  if (!r.ok) throw new Error(`estado HTTP ${r.status}`);
  const e = (await r.json()) as { cameras: { camera_id: string; ultima_leitura?: Leitura }[] };
  const com = e.cameras.filter((c) => c.ultima_leitura).sort((a, b) => (a.ultima_leitura!.ts < b.ultima_leitura!.ts ? 1 : -1));
  return com[0] ? { camera_id: com[0].camera_id, l: com[0].ultima_leitura! } : null;
}

function mensagem(u: { camera_id: string; l: Leitura }) {
  const { l } = u;
  const total = l.automovel + l.moto + l.onibus + l.caminhao;
  const porHora = Math.round((total * 3600) / Math.max(1, l.janela_s));
  return {
    counts: { cars: l.automovel, motos: l.moto, buses: l.onibus, trucks: l.caminhao },
    metrics: { flow: porHora, ...(l.fila_m != null ? { queue: Math.round(l.fila_m / 6) } : {}) },
    boxes: [],
    origem: l.origem, camera_id: u.camera_id, ts: l.ts,
  };
}

const clientes = new Set<{ send(s: string): unknown }>();

Bun.serve({
  port: PORTA,
  hostname: "127.0.0.1",
  fetch(req, srv) {
    const u = new URL(req.url);
    if (u.pathname === "/analytics") return srv.upgrade(req) ? undefined : new Response("precisa de WebSocket", { status: 426 });
    if (u.pathname === "/heat") {
      try { return Response.json(pontosDeCalor(), { headers: cors }); }
      catch (e) { console.error("[ERROR] ponte /heat:", e); return Response.json({ erro: "arquivo de pontos ilegível" }, { status: 500, headers: cors }); }
    }
    if (u.pathname === "/saude") return Response.json({ ok: true, clientes: clientes.size }, { headers: cors });
    return new Response("ponte do painel claro: /heat · /analytics (ws) · /saude", { headers: cors });
  },
  websocket: {
    open(ws) { clientes.add(ws); },
    close(ws) { clientes.delete(ws); },
    message() {},
  },
});

setInterval(async () => {
  if (!clientes.size) return;
  try {
    const u = await ultimaLeitura();
    if (!u) return;
    const s = JSON.stringify(mensagem(u));
    for (const c of clientes) c.send(s);
  } catch (e) { console.error("[ERROR] ponte /analytics:", e); }
}, 3000);

console.log(`ponte do painel claro em http://127.0.0.1:${PORTA}`);

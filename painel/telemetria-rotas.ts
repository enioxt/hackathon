// cco/telemetria-rotas.ts — rotas HTTP da telemetria. Importado pelo servidor.ts (mexer o mínimo lá).
import { criarTelemetria, type Telemetria } from "./telemetria.ts";

const LIMITE_ASSINANTES_SSE = 40;
const HEARTBEAT_MS = 20000;

function json(corpo: unknown, status = 200): Response {
  return new Response(JSON.stringify(corpo), { status, headers: { "content-type": "application/json; charset=utf-8" } });
}

export function criarRotasTelemetria(caminhoBanco: string) {
  const telemetria: Telemetria = criarTelemetria(caminhoBanco);
  let assinantesAtivos = 0;

  async function manipular(req: Request, u: URL): Promise<Response | null> {
    if (!u.pathname.startsWith("/api/telemetria/")) return null;

    if (u.pathname === "/api/telemetria/stream" && req.method === "GET") {
      if (assinantesAtivos >= LIMITE_ASSINANTES_SSE) return new Response("muitas conexões de telemetria abertas — tente de novo em instantes", { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } });
      assinantesAtivos++;
      const enc = new TextEncoder();
      let heartbeat: ReturnType<typeof setInterval> | null = null;
      let cancelarAssinatura: (() => void) | null = null;
      const stream = new ReadableStream({
        start(ctl) {
          for (const ev of telemetria.ultimos(30)) { try { ctl.enqueue(enc.encode("data: " + JSON.stringify(ev) + "\n\n")); } catch { /* cliente já fechou */ } }
          cancelarAssinatura = telemetria.assinar((linhaSSE) => { try { ctl.enqueue(enc.encode(linhaSSE)); } catch { /* cliente já fechou */ } });
          heartbeat = setInterval(() => { try { ctl.enqueue(enc.encode(": ping\n\n")); } catch { /* cliente já fechou */ } }, HEARTBEAT_MS);
        },
        cancel() {
          cancelarAssinatura?.();
          if (heartbeat) clearInterval(heartbeat);
          assinantesAtivos--;
        },
      });
      return new Response(stream, { headers: { "content-type": "text/event-stream", "cache-control": "no-cache" } });
    }

    if (u.pathname === "/api/telemetria/resumo" && req.method === "GET") return json(telemetria.resumo());

    if (u.pathname === "/api/telemetria/eventos" && req.method === "GET") {
      const agente = u.searchParams.get("agente") ?? undefined;
      const limite = Math.min(1000, Math.max(1, Number(u.searchParams.get("limite") ?? "100") || 100));
      return json({ eventos: telemetria.ultimos(limite, agente) });
    }

    return json({ erro: "rota de telemetria desconhecida" }, 404);
  }

  return { manipular, telemetria, contarAssinantes: () => assinantesAtivos };
}

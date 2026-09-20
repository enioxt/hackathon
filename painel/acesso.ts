// Entrada por link individual: cada pessoa do grupo recebe UM link só dela, no WhatsApp que ela já usa.
// Quem abre o link entra. Não há senha guardada em lugar nenhum. O arquivo de acessos fica só nesta máquina.
import { readFileSync, existsSync } from "node:fs";
export type Pessoa = { nome: string; jid: string };
type Arquivo = { tokens: Record<string, Pessoa> };
const usoDoDia = new Map<string, number>(); // "AAAA-MM-DD|jid" -> perguntas feitas

export function criarAcesso(caminho: string, opcoes: { exigeLogin: boolean; tetoDia: number }) {
  const ler = (): Arquivo => existsSync(caminho) ? JSON.parse(readFileSync(caminho, "utf8")) : { tokens: {} };
  const tokenDoCookie = (req: Request) => /(?:^|;\s*)vr_s=([A-Za-z0-9_-]{20,64})/.exec(req.headers.get("cookie") ?? "")?.[1] ?? null;
  const quem = (req: Request): Pessoa | null => { const t = tokenDoCookie(req); return t ? ler().tokens[t] ?? null : null; };
  return {
    quem,
    // GET /entrar/<token>  → grava o cookie e manda para o painel; token errado não diz nada além de "link inválido"
    entrar(u: URL): Response | null {
      const m = /^\/entrar\/([A-Za-z0-9_-]{20,64})$/.exec(u.pathname); if (!m) return null;
      const p = ler().tokens[m[1]];
      if (!p) return new Response("Link inválido ou vencido. Peça um novo no grupo.", { status: 403, headers: { "content-type": "text/plain; charset=utf-8" } });
      const seguro = u.protocol === "https:" ? "; Secure" : "";
      return new Response(null, { status: 302, headers: { location: "/?layout=central", "set-cookie": `vr_s=${m[1]}; Path=/; HttpOnly; SameSite=Lax; Max-Age=259200${seguro}` } });
    },
    // pode perguntar ao agente? devolve {ok} ou {ok:false, status, motivo}
    podePerguntar(req: Request): { ok: true; pessoa: Pessoa | null } | { ok: false; status: number; motivo: string } {
      const p = quem(req);
      if (!opcoes.exigeLogin) return { ok: true, pessoa: p };
      if (!p) return { ok: false, status: 401, motivo: "Entre pelo seu link individual para falar com o agente." };
      const k = new Date().toISOString().slice(0, 10) + "|" + p.jid, n = usoDoDia.get(k) ?? 0;
      if (n >= opcoes.tetoDia) return { ok: false, status: 429, motivo: `Limite de ${opcoes.tetoDia} perguntas por dia atingido.` };
      usoDoDia.set(k, n + 1); return { ok: true, pessoa: p };
    },
  };
}

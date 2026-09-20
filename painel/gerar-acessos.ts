// Gera UM link individual por pessoa e grava em acessos.json (só nesta máquina). NÃO envia nada: só imprime.
// Uso:  bun gerar-acessos.ts https://endereco-publico  "Nome A=jidA" "Nome B=jidB" ...
import { randomBytes } from "node:crypto"; import { writeFileSync, existsSync, readFileSync } from "node:fs";
const [base, ...pares] = process.argv.slice(2);
if (!base || !pares.length) { console.error("uso: bun gerar-acessos.ts <endereço-base> \"Nome=jid\" ..."); process.exit(1); }
const arq = import.meta.dir + "/acessos.json", atual = existsSync(arq) ? JSON.parse(readFileSync(arq, "utf8")) : { tokens: {} };
for (const par of pares) { const [nome, jid] = par.split("="); if (!nome || !jid) { console.error("par inválido: " + par); process.exit(1); }
  const velho = Object.entries(atual.tokens).find(([, p]: any) => p.jid === jid); if (velho) delete atual.tokens[velho[0]]; // link novo invalida o antigo
  const tok = randomBytes(24).toString("base64url"); atual.tokens[tok] = { nome, jid }; console.log(`${nome}\t${base.replace(/\/$/, "")}/entrar/${tok}`); }
writeFileSync(arq, JSON.stringify(atual, null, 1), { mode: 0o600 });

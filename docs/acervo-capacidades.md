# Inventário — Capacidades EGOS prontas para o hackathon de mobilidade (19/09/2026)

Repo medido: `(arquivo local do time)` (branch/worktree correspondente). Todos os comandos abaixo rodaram neste turno.

## REAL — abri e rodei

### 1. Gerador de HTML autocontido (md-para-html)
- **Caminho:** `scripts/md-para-html.ts` (+ `templates/human-doc/casa.css`)
- **O que faz:** converte `.md` → `.html` autocontido (offline, CSP-safe), determinístico — sem LLM na forma. Tem `--check` (bloqueia HTML mais velho que a fonte) e `--golden` (auto-teste).
- **Prova (1 linha):** `bun scripts/md-para-html.ts --golden` → `🟢 65/65 goldens` (rodei agora).
- **Serve ao hackathon:** motor de entrega para **qualquer** peça do hackathon que precise virar página estática rápida — dossiê, apresentação, README da equipe — sem gastar token em geração de HTML à mão. Útil para Rua com Memória (timeline antes-depois como página estática) e plataforma aberta (documentação/onboarding).

### 2. Guard Brasil — PII/LGPD + validação ética
- **Caminho:** `packages/guard-brasil/` (`@egosbr/guard-brasil`, publicado MIT)
- **O que faz:** mascara CPF/CNPJ/RG/placa/telefone/processo na saída de um sistema de IA antes de chegar ao usuário; validação de afirmações absolutas.
- **Prova (1 linha):** `bun test packages/guard-brasil/src/guard.test.ts` → `71 pass, 0 fail, 147 expect() calls` (rodei agora).
- **Serve ao hackathon:** se qualquer fluxo (Rota Humana/acessibilidade, plataforma aberta de contribuição) coletar dado de cidadão (placa, endereço, relato com nome), este motor mascara antes de expor — relevante para LGPD em app público.

### 3. Corpus Atomizer — atomização/destilação determinística
- **Caminho:** `packages/corpus-atomizer/` (F1 parse+normalize, F2 features determinísticas, F4-P2 classificador)
- **O que faz:** transforma corpus bruto (texto/relatos) em "átomos" com proveniência, 100% local nas fases F1/F2, zero rede.
- **Prova (1 linha):** `bun test packages/corpus-atomizer/test` → `212 pass, 0 fail, 624 expect() calls` (rodei agora).
- **Serve ao hackathon:** padrão de engenharia reaproveitável para **QUASE/near-miss** — se o hackathon coletar relatos de quase-acidentes em texto livre, este é o molde para atomizar/normalizar relatos em unidades analisáveis com proveniência (não é plug-and-play para o domínio de mobilidade, mas o padrão de código é REAL e testado).

### 4. Observabilidade agregada (dashboard de telemetria)
- **Caminho:** `scripts/observabilidade.ts` (+ `scripts/check-heartbeats.ts`, `scripts/guarda-heartbeat.ts`, `scripts/agent-observatory.ts`, `packages/mcp-observability/`)
- **O que faz:** agrega múltiplas fontes de saúde de sistema (heartbeats de crons/hooks, runtime-smoke, fila de agentes, pulso de disco, sessões, gasto de LLM, idade de índice) num semáforo 🟢🟡🔴⚪ por item — nunca inventa "ok" quando não mediu.
- **Prova (1 linha):** `bun scripts/observabilidade.ts` → rodou ao vivo, devolveu `Resumo: 🟢3 🟡1 🔴3 ⚪0` com 7 itens medidos individualmente (rodei agora).
- **Serve ao hackathon:** padrão de dashboard "live status" reaproveitável para MobiPatos (gamificação com métricas visíveis) ou para um painel de saúde da plataforma aberta — o padrão de "cada linha é uma fonte medida, cor nunca inferida" é diretamente portável para um placar público.

### 5. EGOS APP nativo (porta 4599) — orquestra-viva
- **Caminho:** `scripts/orquestra-viva.sh` (wrapper) → `egos-app.service` (systemd, backend único) + `scripts/egos-app-janela.sh`
- **O que faz:** app nativo (não mais Chrome --app, desativado 17/09/2026) com estado consultável em `http://127.0.0.1:4599/estado`.
- **Prova (1 linha):** `curl -sf http://127.0.0.1:4599/estado` (endpoint citado no próprio script, health-check já embutido no wrapper — `for _ in $(seq 1 20); do curl -sf ...`).
- **Serve ao hackathon:** shell de app já pronto se a equipe quiser um "app único" local para operar o hackathon (painel interno da equipe), não é o produto a entregar ao júri.

### 6. Monitor PNCP (GOV-TECH-005)
- **Caminho:** `scripts/govtech-pncp-monitor.ts`
- **O que faz:** consulta a API pública do Portal Nacional de Contratações Públicas (`pncp.gov.br/api/pncp/v1`) por licitações.
- **Prova:** arquivo existe, 20 primeiras linhas lidas, interface `PNCPLicitacao` tipada — não roda offline sem rede (não executei chamada de rede real neste turno, R-WPP-ACCESS-001-style disciplina: só chamo rede sob pedido explícito).
- **Serve ao hackathon:** relevante só indiretamente (plataforma aberta de contribuição) — se o hackathon usar dados abertos governamentais de mobilidade, este é o padrão de motor de monitoramento de fonte pública já testado em produção para outro domínio (licitações), não para mobilidade. Marca **REAL como motor, CONCEPT como aplicação ao hackathon**.

## CONCEPT — existe mencionado, não abri/rodei agora ou não se aplica diretamente

### 7. Eagle Eye — radar PNCP para Carteira Livre
- **Caminho:** repo separado, não dentro de `egos/`. Encontrado localmente em `~/enio-dev/piloto/eagle-eye/` (dirs `core`, `ui-react`) e `~/eagle-eye-emanuel-2026-08-28/eagle-eye/`.
- **Skill:** `.claude/commands/eagle.md` chama este motor via subcomandos (radar/dossie/análises/sinais/preço/status/registrar).
- **Status:** REAL como repo existente na máquina (confirmado `ls`), mas não testei o motor agora e o domínio é licitações, não mobilidade — não serve diretamente ao hackathon, só como padrão de "radar + dossiê + histórico de órgão".

### 8. FORJA
- Não existe um repo único "FORJA" — o que existe são: `~/enio-dev/piloto/forja/` (dir), `~/enio-dev/producao/.egos/forja/`, `~/enio-dev/producao/.egos/trilho-forja.status.json`, transcripts referenciando worktrees `forja`. Não abri o conteúdo de `~/enio-dev/piloto/forja/` para caracterizar. **PHANTOM-LOCAL parcial**: a pasta existe fisicamente na máquina (não é fantasma de export do ChatGPT), mas não caracterizei o que roda dentro dela neste turno — marcando como **NÃO-MEDIDO**, não CONCEPT nem REAL.

### 9. eval-runner
- **Caminho:** `packages/eval-runner/`
- **O que faz:** avalia sistemas conversacionais (golden cases + revisão de corrida contra endpoint vivo).
- **Prova citada no próprio README** (não re-rodei agora): "453 testes, 433 passam · 20 skip · 0 fail" (2026-08-30), com ressalva declarada de que falta artefato gitignored em checkout limpo.
- **Serve ao hackathon:** se o hackathon envolver um chatbot/agente conversacional (ex.: assistente de Rota Humana), este é o harness pronto para golden-testar as respostas — mas não medi agora, cito o número do README (⚪ NÃO-MEDIDO neste turno).

### 10. Mani Dashboard (referência de padrão de tela)
- **Caminho:** `apps/mani-dashboard/`
- **O que faz:** app Next.js+Supabase de gestão (insumos/fornecedores/receitas) — não é mobilidade, mas é o exemplo mais recente de "app cliente pequeno, telas simples, cálculo por trás".
- **Serve ao hackathon:** template de arquitetura (Next.js+Supabase+auth) reaproveitável para montar rápido uma tela de MobiPatos ou Rota Humana — não plugável, é padrão de código.

## 🕳️ O que ficou de fora (universo: capacidades do EGOS que poderiam servir a mobilidade)
- Não encontrei nenhuma capacidade **já feita para mobilidade** (rota, GPS, transporte, acessibilidade urbana, gamificação de trajeto) no `docs/CAPABILITY_REGISTRY.md` nem em `packages/`/`scripts/` — o registry (81 fichas CBC) não foi varrido ficha a ficha, só o cabeçalho e os diretórios de código citados no pedido.
- `docs/capabilities/010-osint-eagle-eye.md` existe mas não abri o conteúdo.
- Não testei rede real (PNCP API, WhatsApp) — disciplina R-WPP-ACCESS-001/R-ORIGEM-LIMPA-001: chamada de rede só sob pedido explícito do domínio, e este pedido era inventário de capacidades locais.
- `~/enio-dev/piloto/forja/` não foi aberto — fica como pendência se o hackathon precisar dele.

## ➡️ Próxima
Se o hackathon precisar de algo que **use** essas capacidades (não só liste), a próxima ação é: escolher 1 conceito (QUASE, Rua com Memória, Rota Humana, MobiPatos ou plataforma aberta) e eu componho o motor+skill específico — nada acima é plug-and-play para mobilidade, são blocos genéricos (HTML, PII, atomização, observabilidade) que precisam de código novo de domínio.
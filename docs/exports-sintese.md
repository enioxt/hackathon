# ATUALIZAÇÃO PARA O PRIME — 2026-09-19, dia 2 do Hackathon Patos de Minas

Universo declarado (R-UNIVERSO-DECLARADO-001): 38 fichas de export do ChatGPT recebidas nesta chamada, todas com `lido_integral:true`. O pedido citava 59 — 21 não vieram neste payload, não avaliadas aqui. Mais um bloco de "relatório de produção 16-18/09" (git log/status), tratado como fonte não verificada por mim neste turno (R1.2/R1.3) — Prime confirma com `git log`/`git status` reais antes de agir.

---

## A) HACKATHON — em ordem de relevância

1. **`ChatGPT-HACKATHON OSAIR-20260919-0845.md`** (1257 linhas, gerado hoje 08:45, é o arquivo dedicado). Enio decide participar e pede 3 propostas fora do convencional. Pede pesquisa REAL do repo FORJA (não memória) — achado: README do FORJA de agosto mostra detecção de objetos como "Planejado", não implementado (CONCEPT, não REAL). Osair é o parceiro; cenário citado por ele: fiscalização de calçadas com drone+IA. Decisão registrada do Enio: propor no próprio evento uma "plataforma federada de contribuição remunerada" para não perder ideias que não vencerem (l.890). Sem escolha final entre as 4 propostas (QUASE / Rua com Memória / Rota Humana / fusão) — ChatGPT recomendou QUASE, Enio não confirmou no export.

2. **`ChatGPT-Arquitetura do Egos App-20260919-0842.md`** (4158 linhas, ~1700 delas só de hackathon). Dados de infraestrutura já levantados: piloto semáforo inteligente Av. Paracatu (36 equipamentos, 60 dias), sistema "Olho Vivo" (240 câmeras/140 pontos, leitura de placa+reconhecimento facial), PAITT (audiência pública desde 2023). Malha geográfica JÁ PRONTA no Intelink: OSM Patos 8.554 vias, CNEFE/IBGE 93.989 endereços, snap-to-road (commit 63710467) — reutilizável direto, sem pesquisar de novo. Padrões técnicos definidos: GTFS/GTFS-Realtime, GBFS, MDS/CDS, DATEX II, NGSI-LD; simulador SUMO. Cenários: semáforos, ônibus, acidentes/obras, mobilidade leve, calçadas+drone, vans, auditoria cidadã, redesenho Rua Major Gote. Termina com Enio **já dentro do evento** pedindo consolidação final (governança, gamificação, app da prefeitura) — SEM resposta no export.

3. **`ChatGPT-Arquitetura do Egos App-20260918-1553.md`**. Confirma evento/prêmios (R$5.000/3.500/1.500), parceiro grafado ora "Otair" ora "Osair" (inconsistência do próprio export). Último pedido do Enio (l.4144, já no evento): "análise de ganhos, valor, para convidar empresas e população a participar das obras" — sem resposta.

4. **Produção (git status, não verificado por mim)**: `scripts/whatsapp-sessao/NASCIMENTO-HACKATHON.md` untracked no checkout de produção; canal `"hackathon"` já registrado em `~/.egos/whatsapp-canais.json`. Indício de que já existe fio técnico ligado ao evento em produção — Prime confirma antes de assumir estado.

**Falta**, olhando os 3 arquivos juntos: nenhuma decisão final de proposta registrada pelo Enio; nenhum pitch de 60s fechado; nenhuma resposta aos 3 últimos pedidos feitos de dentro do evento (l.4144, l.4149, l.4154 do arquivo 2).

---

## B) Decisões/cortes do Enio em outros temas (1 linha + arquivo)

- Divisão de papéis: ChatGPT só pesquisa/arquitetura, **Claude Code é quem builda/testa/comita** — `ChatGPT-Definir Frontend EGOS-20260912-1829.md` (l.851).
- Parar de construir features novas, focar em censo/deduplicação/organização — `ChatGPT-Arquitetura do negócio-20260912-1628.md` (l.2403).
- Diagnóstico oficial Anthropic (`claude doctor`/`/status`) roda ANTES do diagnóstico próprio EGOS, sempre — `ChatGPT-Analisar Linus e EGOS-20260915-1239.md` (repetido l.775/801/880).
- Foco de caixa: escritório de advocacia (Daniel/DTAJ) é prioridade — `ChatGPT-Análise do Jev no EGOS-20260918-1041.md` (l.2321).
- Não construir sistema próprio equivalente ao Cowork sem antes testar o Cowork real — `ChatGPT-Pesquisa de algoritmos-20260914-0056.md` (l.6130).
- Provider portátil (Claude/Codex/Antigravity/OpenCode/OpenRouter) autorizado e já commitado — `ChatGPT-Análise do Jev no EGOS-20260918-1335.md` (l.6702, PR #184, NÃO mergeado).
- Comunicação pública muda de "vitrine de capacidade" para "verdade operacional" (o que existe/o que não funciona) — `ChatGPT-Verdade operacional do EGOS-20260910-1629.md` (l.19).
- Regra "Anti-Genérico / Verdade Específica" elevada a regra fixa do sistema, para toda comunicação — `ChatGPT-Roteiro história do Mani-20260910-0326.md` (l.72).
- Acesso remoto a máquina de terceiro: sempre autorizado, com limite, nunca senha permanente — `ChatGPT-Roteiro história do Mani-20260910-0326.md` (l.109).
- Pacote de entrada âncorado em R$1.000, integrações são módulo separado, vendido à parte — `ChatGPT-Reduzir o EGOS-20260916-0008.md` (l.310).
- Kernel EGOS nunca entra em sociedade, é 100% do Enio mesmo ao oferecer capacidade gratuita — `ChatGPT-Hacash BTC Mainnet-20260912-1145.md` (l.12).
- Cinco.ia.br simplifica: login via GitHub, convite automático ao repo, aceite manual do Enio — `ChatGPT-Pesquisa de frontends de portfólio-20260917-1014.md`.
- "Mais recente" não é automaticamente "canônico" — comparar ancestralidade/conteúdo antes de promover — `ChatGPT-Organizar decisões do STF-20260910-0318.md` (l.3884).

---

## C) Pedidos do Enio ainda sem execução

- **Revogar/rotacionar a API key TypeSafe (Jev) colada em texto puro no chat do ChatGPT** — `ChatGPT-Análise do Jev no EGOS-20260918-1335.md` (l.1037) e `-1041.md` (l.1037). Segurança, sem confirmação de que foi feito.
- Escolha final entre as 4 propostas do hackathon — `ChatGPT-HACKATHON OSAIR-20260919-0845.md`.
- Reconciliar PR #184 (15 commits à frente / 13 atrás de main) e rodar gates locais antes de merge — múltiplos arquivos, confirmado ainda DRAFT no relatório de produção.
- Testar o bootstrap portátil do EGOS em sessão fresca na própria máquina "poluída" — `ChatGPT-Análise do Jev no EGOS-20260918-1335.md`.
- Rodar/testar localmente o Rule Context Runtime (issue #186, dogfood) — mesmo arquivo.
- Investigar causa raiz do EGOS App abrindo duplicado ao iniciar sessão Orca — repetido em 4 fichas de auditoria (`20260917-1646`, `-0215`, `20260918-1042`).
- Agenda/Notificações/Documentos Recentes com busca+classificação/dashboard WhatsApp completos — mesmas 4 fichas.
- Auditar o OAuth real de `/entrar/start` no repo `cinco` — scope bate com a promessa de minimização? — `ChatGPT-Pesquisa de algoritmos-20260914-0056.md`, marcado P0 pela própria IA.
- Gerar as 3 imagens/mockups (inicial+expandida) do site cinco.ia.br — `ChatGPT-Pesquisa de frontends de portfólio-20260917-1014.md`.
- Reorganizar repositório GitHub do Cinco para bater com a apresentação do site — mesmo arquivo.
- `data.cnt.org.br` tem API pública? — `ChatGPT-Arquitetura do Egos App-20260919-0842.md` (l.4117), sem resposta no export.

---

## D) Produção 16-18/09 — o que mudou (fonte: relatório embutido na última ficha, NÃO verificado por mim — Prime confirma com `git log`/`git status` reais antes de agir)

**Riscos antes de commitar/pushar:**

1. **`scripts/lib/whatsapp-canais-config.ts` é dependência viva do motor de produção (`orquestra-viva`, `whatsapp-sessao-puro`) mas está UNTRACKED** — nunca foi commitado. `git clean`/`git reset` descuidado quebra o canal de WhatsApp em silêncio.
2. **89 arquivos sujos no `git status`**, staged parcial (`evolution-scoped-messages.sh` em MM) sugerindo sessão anterior interrompida no meio de um commit — risco de perda se outra sessão/cron tocar os mesmos arquivos.
3. **`origin/main` está 29 commits à frente do checkout de produção**, incluindo guardas de segurança/custo (OpenRouter budget guard, balance lock cron, hardening do Google OAuth) — produção local pode estar rodando SEM essas proteções mais recentes até reconciliar.
4. **PR #184 continua DRAFT**, texto do próprio PR exige "merge only after local EGOS gates/pre-commit validate the branch" — não mergear sem rodar os gates locais primeiro. Issues #186/#187 nascidas dele estão abertas, checklists vazios.
5. Motor `opencode-serve` (canal WhatsApp, PID 1457, porta 14096, `egos-opencode-serve.service` ativo) já está em produção e no kernel via commit `79d935ca7` — modelo/cli por canal decidido pelo JSON `~/.egos/whatsapp-canais.json`, não hardcoded mais.
6. Branch `enioxt/jev-context-retention` aparece ativa em algum worktree não localizado (indicado por `+` no `git branch -a`) — path físico não confirmado, checar antes de assumir que está livre.

---

## E) Exports NÃO lidos integralmente

Nenhum — as 38 fichas recebidas têm `lido_integral:true`. Se as 21 fichas faltantes (59 declaradas − 38 recebidas) existem, não chegaram neste payload e não são avaliáveis aqui.
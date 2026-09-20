# Varredura de gamificação de mobilidade — só disco, 2026-09-19

**Nota de coordenação:** existe workflow paralelo já rodando no mesmo hackathon (Codex, `~/.egos/hackathon/COORDENACAO-CODEX.md`), com a frente "gamificacao" marcada 🟡 rodando mas **sem arquivo de saída próprio ainda** — esta varredura preenche essa lacuna com achados de disco, não sobrescreve nada em `~/.egos/hackathon/`.

## Achados, um a um

### 1. MobiPatos+ (a peça central) — REAL, achado 06/05/2025, recapitulado 04/09 e 18-19/09/2026
- **Caminho:** Google Drive (`10Oytvc4mr17fXTTLVFa748KDsozwRKejeGCRzOAJcsM`, doc + .txt) — **não está em disco local hoje**; a cópia de trabalho citada em `~/.egos/relatorios/2026-09-04-mobilidade-urbana-acervo.md:29` (`/tmp/…/scratchpad/mob/gemini_MobiPatos_plano_2025-05-06.md`) **não existe mais** (era scratchpad de outra sessão, varri e não achei). Só o **resumo classificado** sobrevive em disco: `~/.egos/relatorios/2026-09-04-mobilidade-urbana-acervo.md §2.1`.
- **Origem:** Gemini 2.5 Pro Deep Research, 06/05/2025, 61 KB, 9 capítulos.
- **Mecânica concreta (não adjetivo):**
  - **Pontua Patos** — pontos por viagem, por distância, por horário fora de pico, por intermodalidade, por evento.
  - **Desafios do Cerrado** — desafios temáticos/sazonais.
  - **Conquistas Patenses** — emblemas com identidade local.
  - **Vitrine de Recompensas** — resgate em comércio e artistas locais (capa de chuva/mochila "não-clichê", personalizada por artista da cidade).
  - **Comunidade** — rankings.
  - **Guia do Viajante Consciente** — conteúdo educativo.
  - 3 fases: piloto (6-9 meses, 2-3 linhas, 200-500 usuários beta, 5-10 parceiros comerciais) → cidade toda → contínuo.
  - KPIs declarados: downloads = 10% da população urbana em 1 ano · +5% viagens de transporte público · 50 parceiros comerciais · 10.000 resgates.
- **Status:** CONCEPT (documento completo, zero linha de implementação; "nunca entrou no sistema" — relatório de 04/09 confirma zero menção anterior no kernel egos).

### 2. Chat original "Gamificação no Transporte Público" (ChatGPT, 06/05/2025) — PARCIAL
- **Não está no acervo de exports local** (nem em `~/.egos/acervo/chatgpt/originais/`, nem em `~/Downloads/conversas-ia/chatgpt/`, nem em `~/.egos/backups/`). Só existe como **resumo de segunda mão** dentro de `2026-09-04-mobilidade-urbana-acervo.md:34` e como link vivo `chat.openai.com/c/681a7…` (não aberto nesta varredura, sem rede).
- Conteúdo relatado: ideia original em 1 parágrafo do Enio — pontuar por uso e distância, conscientização, parcerias com empresas, integração com vale-transporte, remuneração diferenciada para quem caminha mais até o ponto, brindes personalizados por artista local. Descoberta no mesmo chat de que **Patos já tem app municipal `Patos Premia` (patospremia.com.br)** — decisão registrada foi integrar ali em vez de criar app novo.
- Os 4 canvases gerados (documento técnico, resumo de 1 página, roteiro de vídeo pitch, roteiro de slides) e o ofício ao gabinete **não vieram no export** — ainda PHANTOM em disco, só existem (se existirem) atrás do link do chat.

### 3. ChatGPT "Arquitetura do Egos App" (18-19/09/2026, sessão que terminou dentro do próprio hackathon) — REAL, mais recente
- **Caminho:** `/home/enio/.egos/acervo/chatgpt/originais/ChatGPT-Arquitetura do Egos App-20260919-0842.md` (4158 linhas).
- **L3719-3763:** recuperou explicitamente MobiPatos+ ("gamificação por embarques/deslocamentos"), classificou como **antecedente/histórico, não sistema implementado**, junto com dois conceitos irmãos do mesmo garimpo: **QUASE** (near-miss/TTC via câmera, sem identificação) e **Rota Humana** (calçadas + ônibus + ciclovias + acessibilidade).
- **L4154 — última linha do arquivo, sem resposta registrada (sessão cortada dentro do evento):** *"Convidar as pessoas a instalarem o app, compartilharem a localização, para medirmos mais dados das pessoas no trânsito, permitindo que conclua tarefas, gamificação, dentro do app da prefeitura, além de convidar e aumentar o uso dessa forma."* — é o pedido mais novo do Enio sobre o tema (18/09 21:36) e está **em aberto**, ninguém respondeu ainda no export. Mecânica proposta: opt-in de localização + tarefas completáveis + gamificação, hospedada dentro do app municipal (mesma decisão de integração ao Patos Premia de 2025, agora generalizada para "o app da prefeitura").
- Padrões técnicos que a mesma sessão amarrou ao tema (para o motor de pontos, se vier a existir): GTFS/GTFS-Realtime, GBFS, MDS/CDS, DATEX II, NGSI-LD.

### 4. ChatGPT "HACKATHON OSAIR" (19/09/2026 08:45) — REAL, é o export mais fresco do time
- **Caminho:** `~/.egos/acervo/chatgpt/originais/ChatGPT-HACKATHON OSAIR-20260919-0845.md` (1257 linhas).
- Zero menção nova a mecânica de gamificação por nome — o foco dessa sessão foi câmeras/Olho Vivo (240 câmeras/140 pontos) e o conceito "commons"/plataforma aberta pós-hackathon (já capturado pelo Codex em `commons/`). Confirma que a decisão de produto entre MobiPatos/QUASE/Rota Humana **ainda não foi tomada** pelo Enio.

### 5. `docs/concepts/GAMIFICACAO_SSOT.md` (kernel egos, 27/08-11/09/2026) — REAL, é o motor mecânico mais próximo de produção
- **Caminho:** `docs/concepts/GAMIFICACAO_SSOT.md`.
- Único **motor de pontos/ranks que roda em produção hoje** no ecossistema: `piloto/852/src/lib/gamification.ts` — `POINT_VALUES` + 6 ranks + leaderboard Supabase, 116 linhas, REAL. A própria auditoria interna já marcou: "mecânica reaproveitável, tema policial específico não" — ou seja, é o esqueleto de pontos/rank/leaderboard que o MobiPatos poderia herdar trocando o vocabulário, mas **hoje não fala de ônibus, embarque ou km**.
- Doutrina anti-Goodhart registrada: "atividade não é valor" — pontos por mexer no sistema, sem prova de contribuição real, é o erro a evitar. Aplicado a mobilidade: pontuar "abrir o app" é o mesmo erro que pontuar "commitar"; a régua tem que ser embarque real, não engajamento de app.

### 6. `docs/jobs/2026-09-02-live-school-gamificacao-pesquisa.md` (kernel egos, 02/09/2026) — REAL, pesquisa com fonte e data, não é sobre mobilidade mas é a única pesquisa **com efeitos negativos comprovados** no acervo
- Leaderboard individual público: amplia a lacuna topo/base (Domínguez et al. 2013, ScienceDirect 2022).
- Streak diário: ansiedade + abandono ao quebrar; Duolingo vende "freeze" pago, descrito como "tóxico" (NerdSip 2026).
- Recompensa por atividade já intrinsecamente interessante: overjustification effect, motivação cai abaixo do nível inicial quando a recompensa some (Deci/Koestner/Ryan 1999, meta-análise de 128 experimentos, d=-0,40; Hanus & Fox, arXiv 2203.16175).
- Mitigação citada: leaderboard por TIME (não indivíduo), esconder posição exata, reset frequente.
- **Aplica-se diretamente ao MobiPatos:** a "Vitrine de Recompensas" e o "Comunidade/rankings" do plano de 2025 caem exatamente nos dois padrões que essa pesquisa marca como problemáticos (ranking individual público + recompensa monetária/material por atividade) — é um contraponto que o plano de 2025 não tinha.

### 7. Estudo de caso Duolingo (24/02/2026, `~/.egos/acervo/chatgpt/originais/ChatGPT-Estudo de caso Duolingo.md`) — REAL, caso de referência com números
- Streak: matemática de motivação declarada pelo próprio Duolingo (2→3 dias = +50% de impacto motivacional; 200→201 = +0,5%) — fonte: blog oficial Duolingo, citado no export.
- Ligas: testadas em 2018 ("um pouco de competição funciona para muita gente"), depois ampliadas de 5 para 10 divisões, elevando o valor simbólico do topo (liga Diamante).
- É a única peça do acervo com **número de resultado real** de um sistema de gamificação em produção massiva — útil como benchmark de "o que funciona", em tensão direta com o achado #6 acima (mesma mecânica, riscos e ganhos documentados dos dois lados).

### 8. Dado que o hackathon já resolveu — Relatório de Viagens Pássaro Branco, agosto/2026
- **Caminho:** `~/.egos/hackathon/agregados.json` + `~/.egos/hackathon/viagens.jsonl` (9,2 MB), parser em `producao/egos/scripts/passaro-branco-parser.ts`, fonte `~/.egos/forja/2026-09-19-hackathon-passaro-branco.pdf` (1.297 páginas, 35 linhas de operação).
- **O MobiPatos+ de 2025 assumia como dado necessário "pontos por viagem, por distância" sem ter a fonte** — hoje **temos**: [número do relatório da operadora, fora deste repositório] viagens-âncora (20.743 realizadas, 431 não realizadas — divergência de 352 registros ainda não explicada, ver bloqueio do Codex), **[número do relatório da operadora, fora deste repositório] passageiros**, km executado [número da operadora],69, IPK 2,87 (com bloqueio de validação contra o IPK declarado 2,74 — não publicar sem resolver), atraso médio de partida 78,84s, velocidade média 17,66 km/h, atraso por rota (pior: Jardim Califórnia–Pró-Curar-se–Suinco, 210,43s).
- **O que ainda falta** para uma mecânica de pontos "por embarque" de verdade: os dados são agregados por linha/hora/dia — **não há identificador de passageiro individual** na fonte (é relatório operacional da empresa, não bilhetagem nominal). Ou seja: dá para pontuar **linha/horário/comportamento agregado** (ex.: bonificar quem anda fora do pico, onde já sabemos que os picos são), mas **não dá para creditar pontos a uma pessoa específica** sem integração com a bilhetagem real da Pássaro Branco — que o relatório de 04/09 já tinha marcado como "não temos" e continua não tendo.

---

## (1) Lista consolidada de mecânicas de gamificação já desenhadas para Patos

| # | Mecânica | Fonte | Status |
|---|---|---|---|
| 1 | Pontos por viagem/distância/off-peak/intermodal/evento | MobiPatos+ (Gemini 06/05/2025) | CONCEPT |
| 2 | Desafios temáticos sazonais ("Desafios do Cerrado") | MobiPatos+ | CONCEPT |
| 3 | Emblemas/conquistas com identidade local ("Conquistas Patenses") | MobiPatos+ | CONCEPT |
| 4 | Resgate em comércio/artistas locais, item personalizado não-clichê | MobiPatos+ | CONCEPT |
| 5 | Ranking/comunidade | MobiPatos+ | CONCEPT — em tensão com achado #6 (leaderboard individual desmotiva) |
| 6 | Conteúdo educativo gamificado ("Guia do Viajante Consciente") | MobiPatos+ | CONCEPT |
| 7 | Remuneração diferenciada por caminhar mais até o ponto | chat ChatGPT 06/05/2025 | CONCEPT (nem no plano formal, só na ideia original) |
| 8 | App da prefeitura: opt-in de localização + tarefas completáveis + gamificação genérica | ChatGPT 18/09 21:36 (L4154, sem resposta) | CONCEPT, pedido mais recente e ainda em aberto |
| 9 | Motor de pontos/ranks/leaderboard (código real, tema policial) | `852/src/lib/gamification.ts` | REAL em produção, precisa trocar tema/vocabulário |
| 10 | Integração ao app municipal existente (Patos Premia) em vez de app novo | chat ChatGPT 06/05/2025 | CONCEPT/decisão já tomada em 2025, não implementada |

## (2) Casos de referência citados

| Cidade/programa | Fonte no acervo | Resultado/número |
|---|---|---|
| Ecobonuz (Uberlândia) | MobiPatos+ (citado, não aberto nesta varredura) | sem número no resumo disponível |
| MovItajaí | MobiPatos+ | sem número |
| Clube Giro (JCA) | MobiPatos+ | sem número |
| Catch the Bus (EUA) | MobiPatos+ | sem número |
| MARGe (Portugal, beacons BLE) | MobiPatos+ | sem número |
| Play&Go (Itália) | MobiPatos+ | sem número |
| Transit Go Rewards | MobiPatos+ | sem número |
| Duolingo (streak) | Estudo de caso Duolingo, 24/02/2026 | 2→3 dias = +50% motivação; 200→201 = +0,5% (fonte: blog oficial) |
| Duolingo (ligas) | idem | testadas 2018; expandidas de 5 para 10 divisões |
| Uberlândia Wi-Fi na frota | ChatGPT Arquitetura Egos App 18/09 | contrato informado R$ 60 mil/mês por 24 meses (2025) |

Nenhum dos 7 casos internacionais/nacionais do MobiPatos+ tem número de resultado no que sobreviveu em disco — o documento original (61 KB, "works cited") está só no Drive, fora de alcance desta varredura sem rede.

## (3) Dado que o plano assumia × o que temos hoje

| Dado assumido pelo plano (2025) | Tínhamos em 04/09? | Temos agora (19/09)? |
|---|---|---|
| Embarque/uso por viagem para pontuar | Não (só contexto de tarifa/frota) | **Sim, agregado**: [número do relatório da operadora, fora deste repositório] passageiros, [número do relatório da operadora, fora deste repositório] viagens, por linha/hora/dia (`~/.egos/hackathon/agregados.json`) |
| Distância por viagem | Não | **Sim**: km executado [número da operadora],69 (agregado, não por passageiro) |
| Horário de pico/fora-pico | Não | **Sim**: atraso e velocidade por hora/dia da semana no `agregados.json` |
| Identificação individual do passageiro para creditar pontos pessoais | Não | **Ainda não** — fonte é relatório operacional da empresa, sem bilhetagem nominal |
| Dado de bilhetagem real da Pássaro Branco (mencionado como exigência de 2024 no PAITT) | Não | Parcial — temos o relatório de viagens, não o sistema de bilhetagem em si |

## Diagnóstico
Medido em disco (sem rede): 1 plano formal (MobiPatos+, CONCEPT, cópia local perdida — só resumo sobrevive), 1 chat-origem PARCIAL (fora do acervo local), 1 pedido em aberto do Enio de 18/09 sem resposta, 1 motor de pontos REAL mas fora de tema (852), 1 pesquisa com efeitos negativos comprovados que contradiz metade do plano de 2025, 1 caso de referência com números reais (Duolingo). O gap de dado que travava o plano (embarque/distância) **fechou parcialmente** com o parser Pássaro Branco de hoje — falta granularidade por passageiro.

## O que ficou de fora
Os 4 canvases do ChatGPT de 06/05/2025 e o texto integral do plano MobiPatos+ (61 KB) não foram lidos nesta varredura — vivem só no Google Drive, fora do escopo "só disco" pedido. Casos internacionais (Ecobonuz, MovItajaí etc.) aparecem só como nome no resumo de segunda mão, sem os números do "works cited" original. Obsidian Vault não tinha nada sob os termos buscados. `docs/strategy/REPLAY_ESPORTIVO_PLANO_PRODUTO.md` e os 2 chats "Análise de sistema de replay" apareceram no grep mas são sobre replay esportivo (Arena Replay), não mobilidade — falso positivo do termo "ranking", não abertos.
# Índice da sessão — sábado 19/09/2026, 11h30 → 17h50 (hackathon, Patos de Minas)

Universo: TUDO que o Enio pediu nesta sessão, na ordem em que pediu. Estado medido às 17h50.
Legenda: ✅ feito e conferido · 🟡 feito, com ressalva · ⏳ rodando · ⬜ não feito · 🔴 problema aberto

## A. Repositórios e segurança do dado
| # | Pedido | Estado |
|---|---|---|
| 1 | Recuperar a sessão do hackathon | ✅ |
| 2 | Sanear o repo público (caminhos internos, andaimes de relatório) | ✅ motor `sanear-publico.py`, 0 padrão em 52 arquivos |
| 3 | Tirar agregado de dado policial do público | ✅ fora do conteúdo |
| 4 | Tirar TODO dado da operadora de ônibus do público | ✅ conteúdo limpo (299 números + 119 nomes varridos) |
| 5 | PCA-1: repo do time privado | ✅ privado desde 13h38 |
| 6 | PCA-3: apagar histórico do repo público | 🟡 histórico reescrito para 1 commit; 🔴 commit antigo ainda abre por endereço direto até a coleta de lixo do GitHub — falta `gh auth refresh -h github.com -s delete_repo` para apagar e recriar |
| 7 | PCA-4: acesso do time ao repo privado | ⬜ aguardando os e-mails/usuários; convite sai por `gh api` |
| 8 | Empresa citada pelo nome em doc do time (PCA-2) | ⬜ sem resposta; repo agora é privado, risco menor |
| 9 | Contagem 33→32 fontes corrigida em todas as peças | ✅ |

## B. Peças para apresentar
| # | Pedido | Estado |
|---|---|---|
| 10 | 24 prompts de design para o ChatGPT (painel, hub, marca e pitch) | ✅ `design-prompts/PROMPTS-DESIGN.html` |
| 11 | 14 prompts de imagem e vídeo para a landing | ✅ `design-prompts/04-imagens-e-videos-da-landing.md` — não revisado por mim |
| 12 | Apresentação de 12 slides, offline, com setas visíveis | ✅ `apresentacao.html` + PDF de 12 páginas |
| 13 | PCA-5: preço no slide 8, roteiro e PDF (R$ 49 mil · R$ 290/câmera · teto R$ 65.492) | ✅ |
| 14 | Roteiro do pitch de 3 min + emenda com o que a sala disse | ✅ `pitch-3min.md` |
| 15 | Canvas de proposta de valor (a régua da banca) | 🟡 `canvas.html`: 11 funcionalidades, 17 conexões — relato do agente, print não aberto por mim |
| 16 | Página "Comece aqui" para quem está no 1º hackathon | 🟡 `COMECE-AQUI.html` escrita, ainda não aberta na tela nem conferida |
| 17 | Índice de tudo | ✅ `INDICE.html` |
| 18 | Landing page do projeto como página principal do GitHub Pages | ⏳ agente entregou `publico/index.html` (24 KB) + 3 prints às 17h47; falta eu revisar e publicar |

## C. Protótipo
| # | Pedido | Estado |
|---|---|---|
| 19 | Simulação de 10/50/100/400/600 câmeras | ✅ `simcam.py` determinístico; curva 33→25% · 94→50% · 207→75% · 357→90% |
| 20 | Painel do gestor com fontes conectadas/não conectadas, zonas quentes | ✅ 7 telas |
| 21 | Clique na câmera abre detalhes com histórico | ✅ painel lateral |
| 22 | Tela de vagas (estacionamento parceiro com 50 vagas) | ✅ dado sintético |
| 23 | 9ª fonte (apps de navegação) + fila de decisão humana | ✅ |
| 24 | Painel funcionando sem internet | ✅ provado com rede bloqueada, 212 imagens de mapa em disco |
| 25 | Chat ligado a um processo do Claude Code com Opus | ✅ provado (15,8 s, lê arquivo e responde) |
| 26 | Chat comanda a tela | 🟡 assistente devolve o comando; ponta a ponta no navegador não testada |
| 27 | Chat GERA RELATÓRIO sobre os dados | ⬜ |
| 28 | Central simplificada em 3 telas | ⏳ agente editando (`gestor.html` mudou às 17h49) |
| 29 | App do cidadão, 10 telas, com gamificação honesta | ✅ `app-cidadao.html` |
| 30 | Calculadora de custo + bloco de preço em 3 camadas | ✅ `/custos` |
| 31 | Demonstração pública no ar | ✅ `…/demo/` (painel + app) |
| 32 | Simulação de rua com vídeo (SUMO) | ⬜ tarefa escrita em `ANTIGRAVITY-TAREFA.md`; disparo do agente lá é do Enio |
| 33 | Contagem em vídeo real (prova mínima) | ⬜ mesma tarefa, item 2 |

## D. Pesquisa
| # | Pedido | Estado |
|---|---|---|
| 34 | Garra Traffic e Camerite: capacidades, preços, gap | 🟡 feito; só o contrato nº 235/2025 (R$ 355.172,16) reconferido por mim |
| 35 | Modelos de centro de operações em outras cidades | 🟡 feito, não reconferido |
| 36 | Compras de câmera de Patos com documento | 🟡 ≈ R$ 4,1 mi com link; aditivo de R$ 894.960 NÃO confirmado |
| 37 | Rua central: debate público e projetos de lei | 🟡 feito, não reconferido |
| 38 | Conecta Patos e Patos Premia | 🟡 achado-chave: programa de nota fiscal é só fiscal por lei |
| 39 | Preços de mercado e limites legais | 🟡 teto de dispensa e lei mineira conferidos por mim; resto não |
| 40 | Fluxo completo da informação com Conecta Patos, gamificação e campanhas com empresas | ⬜ pedido às 17h46, não começado |

## E. Sala, WhatsApp e organização
| # | Pedido | Estado |
|---|---|---|
| 41 | Gravar a sala e transcrever | ✅ 18 blocos; 🔴 parou sozinha 2× — religada 17h48, arquivo crescendo |
| 42 | Análise 360 enviada ao grupo | ✅ 13h55 |
| 43 | Perguntas ao diretor (4 + 1) | ✅ entregues no chat |
| 44 | Mensagem do hub no WhatsApp pessoal, para encaminhar | ✅ 3 versões; a última com hub + demo + preço |
| 45 | Ler o grupo do WhatsApp do hackathon | 🔴 4 tentativas, script sai com erro antes de conectar |
| 46 | Ler o WhatsApp "eu comigo" | ⬜ mesmo bloqueio |
| 47 | Atualizar-se com o GitHub (Osair, Rafael, todos) | ✅ medido: 0 issue, 0 PR, 0 fork de terceiros |
| 48 | Agente no Antigravity | 🟡 IDE aberta na pasta com a tarefa; agente não disparado |
| 49 | Integrar com a arquitetura de agentes do EGOS (sem os nomes internos) | ⬜ só levantei os 16 agentes |
| 50 | Zip organizado de tudo | ⬜ interrompido pelo próprio Enio |
| 51 | Memória: gravação sem perda | ✅ gravada e indexada |

## O que nenhuma peça é dona (recomposição)
- Quem apresenta os 3 minutos · formato da entrega das 16h de domingo · critérios oficiais da banca (só temos a fala do facilitador).
- O canvas no papel que o facilitador pediu ao time.
- Divisão de receita e pessoa jurídica que vende.
- Nome do time: proposto, sem registro de decisão.
- Commit de tudo: `publico/index.html` novo e 5 arquivos do repo do time estão modificados e não commitados.

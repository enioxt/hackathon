# Para a IA que vai estudar este repositório (ChatGPT, Claude, Codex, qualquer uma)

> Escrito às 10:55 de sábado 19/09/2026, dia 2 do Hackathon Cidades Inteligentes de Patos de Minas (MG). Este arquivo é o índice de tudo que o time discutiu e produziu até agora, com o caminho de cada coisa. Leia nesta ordem. Tudo aqui é dado público ou entregue ao time; nada de dado policial, nada de dado pessoal.

## 0. Em 5 linhas
Time **Visão de Rota** (nome proposto pelo Rafael). Tema: *Mobilidade Urbana Inteligente e Previsível*. Pergunta central: **quais dados precisamos coletar para descobrir onde as pessoas perdem tempo na mobilidade, e como transformar isso em ação e informação previsível?** Produto fechado na mesa às 10h: **análise das imagens das câmeras que a cidade já tem + consultoria que interpreta**, sem sensor novo, sem app novo. Entrega: domingo 20/09, 16h; banca 17h.

## 1. Onde está cada coisa

| Quero saber… | Abra |
|---|---|
| O objetivo, o nome, a divisão do time, o que coletar hoje, as regras do jogo | `docs/afinar-a-reza.md` (é a 1ª aba do painel; nada ali está decidido, é para o grupo mexer) |
| O que o time já decidiu nas reuniões de hoje (9h e 10h) | `docs/atas/O-QUE-AS-ATAS-MUDAM.md` (resumo) e as duas atas completas na mesma pasta |
| O norte do time escrito pelo Rafael (tema, pergunta central, 5 pesquisas) | `docs/briefing-do-time.md` |
| Como tudo se liga (câmeras, ônibus, semáforo, bases públicas, pessoas → memória da rua → mapa, ação, placar, prêmio → embaixadores) | `docs/desenho-visao-de-rota.md` (tem um diagrama SVG) |
| O painel pronto, com mapa de calor, simulador de horário escalonado e prova de cada número | `(retirado do repositório aberto) painel/index.html` — publicado em https://enioxt.github.io/hackathon/painel/ |
| Os números do transporte coletivo de agosto/2026 ([número do relatório da operadora, fora deste repositório] viagens, [número do relatório da operadora, fora deste repositório] passageiros, pior bloco 06:20, 34.694 h de atraso) | `(retirado do repositório aberto) dados/onibus/agregados-agosto-2026.json` · `perfil-5min-agosto-2026.json` · análise em `(retirado do repositório aberto) docs/analise-dados-agosto.md` · conferência do parser em `(retirado do repositório aberto) dados/onibus/conferencia-do-parser.json` |
| O que faz uma câmera ser "inteligente" e como gamificar com o app que já existe (Conecta Patos) | `docs/cameras-e-gamificacao.md` |
| As 83 fontes públicas verificadas: o que temos hoje, o que falta, quem tem, como pedir, se cabe até 30/09 | `docs/dados-publicos-relatorio.md` (leitura) · `dados/publicos/fontes-verificadas.json` (máquina: cada item com URL, prova, caminho de pedido, rascunho de LAI) · lacunas em `dados/publicos/lacunas-do-critico.json` |
| Acidentes de trânsito em Patos com coordenada (1.100 ocorrências, 2025 + início de 2026, 19 fatais) | `dados/publicos/acidentes-patos-sejusp-mg.json` (fonte: dados abertos SEJUSP-MG) |
| Licitações de mobilidade no Brasil (PNCP 2024–2026) e municípios de referência | `docs/editais-10-anos.md` · `dados/publicos/editais-mobilidade-pncp-2024-2026.json` · `editais-federal-avancar-cidades.json` |
| Como cruzar duas bases sem inventar vínculo (regras que o time segue) | `docs/regras-de-cruzamento-de-dados.md` · `REGRAS.md` |
| Como continuar as ideias de todos os times depois do domingo (contribuição, autoria, política) | `commons/README.md` · `CONTRIBUTING.md` · `POLITICA.md` · `FALA-8-LINHAS.md` |
| O motor que transforma o relatório de viagens em dado (com testes) | `motor/relatorio-viagens-parser.ts` · `motor/relatorio-viagens-parser.test.sh` · `motor/casa.css` |

## 1b. O que entrou na tarde de sábado (atualizado 14h30)

| Quero saber… | Abra |
|---|---|
| Onde estamos: o que já temos, quem já atua na cidade, os 8 gaps em ordem e a decisão proposta (alvo: Prefeitura, piloto de 90 dias em 1 corredor) | `docs/analise-360-gaps.md` (foi enviado ao grupo às 13h55) |
| As 4 perguntas + 1 principal para o diretor de trânsito | estão no grupo do WhatsApp (13h41); a principal: "se tivéssemos 90 dias e um único cruzamento ou corredor, qual o senhor escolheria e o que gostaria de ver medido?" |
| Quem já presta serviço de semáforo e de câmera em Patos e em outras cidades, e onde entramos | `docs/concorrentes-garra-traffic.md` · `docs/concorrentes-camerite.md` — o contrato da Prefeitura de R$ 355.172,16 (nº 235/2025, peças de semáforo) foi reconferido no PNCP; o resto é pesquisa de agente, não reconferida |
| Modelos de centro de operações em outras cidades e o que se sabe do custo da central de Patos | `docs/cco-modelos-outras-cidades.md` — o valor de R$ 320 mil/mês ouvido em reunião NÃO tem registro público; os custos de outras cidades não foram reconferidos |
| Simulação de cobertura por câmeras (10/50/100/400/600) e a curva de concentração: 33 posições → 25% das ocorrências · 94 → 50% · 207 → 75% · 357 → 90% | `motor/simcam.py` (determinístico) → `motor/simcam.json` — é SIMULAÇÃO sobre dado medido; posição é célula de 100 m, não câmera existente |
| Quanto custa a central mínima (calculadora com todas as premissas editáveis) e a comparação com o que a cidade já gastou | `painel/custos.html` — os valores em R$ são ESTIMATIVA do time, sem cotação |
| Os 24 prompts para gerar o design no ChatGPT (painel, hub, marca e slides) | `docs/design-prompts/PROMPTS-DESIGN.html` (com botão de copiar) e os 3 `.md` |
| O hub de ideias público, com entrada pelo GitHub | https://enioxt.github.io/hackathon-dados-publicos/ — repositório `enioxt/hackathon-dados-publicos` (só dado público; os números do transporte coletivo e o parser saíram de lá às 13h38) |

**Mudança importante:** este repositório passou a ser PRIVADO às 13h38 de sábado, porque guarda dado entregue ao time pela operadora. Quem é do time precisa de convite (mande seu usuário do GitHub ao Enio). O painel que estava em `enioxt.github.io/hackathon/painel/` saiu do ar junto.

## 2. As decisões já tomadas (não reabrir sem o grupo)
1. Só dado público ou entregue ao time. Nenhum dado policial.
2. Câmera conta e classifica (carro, moto, ônibus, bicicleta, pessoa, trajetória, velocidade). Não guarda rosto nem placa.
3. Número sempre com origem; universo declarado ("X de Y"); sem absolutos.
4. Usar o que Patos já tem: Olho Vivo (240 câmeras / 140 pontos, mai/2026), piloto de semáforo com IA na Av. Paracatu (36 de 76 equipamentos, desde 18/08/2026), app Conecta Patos (2022: chamado de trânsito, enquete, campanha), relatório de viagens da operadora, bases públicas do Estado e da União.
5. Monetização adiada; primeiro o produto e o discurso único.
6. Publicar (site, repo, imprensa) é decisão do time.

## 3. Hipóteses em validação (pesquisa em andamento, sábado 10:50)
- Parceria para usar câmeras de segurança pública em análise de trânsito: onde já acontece no Brasil e no mundo (set/2026), com que instrumento jurídico, e o que a LGPD/ANPD exigem. Para Patos: quem é o dono do dado do Olho Vivo (prefeitura investe diretamente; Consep/PM operam?) e que caminho o time tem para (a) evento agregado, (b) stream de 1 câmera, (c) vídeo gravado de 1 cruzamento. **Pronto (11:20):** `docs/parcerias-cameras-brasil.md` (12 casos + 3 negados), `docs/parcerias-cameras-mundo.md` (13 casos + 4 limitações), `docs/olho-vivo-quem-manda.md` (edital 002/2024 lido; Termo 19/2024; contradição 49/240/295/700 câmeras; 3 caminhos), `docs/base-legal-cameras.md` (viável condicionado: evento anonimizado na origem, ACT, RIPD; checklist de 10 itens; minuta de cláusula), `docs/modelo-de-negocio-e-operacao.md` (clientes, preço, custos, onboarding, viabilidade; forma de entrada = reunião com quem decide, feita junto).
- Número real de câmeras: a mesa falou "700" e "300"; a prefeitura publicou 240/140. Pedir hoje.

## 4. O que ainda falta (para qualquer IA ajudar)
- Grade dos ônibus fretados da UNIPAM (origem, horário, ponto) — para escalonar chegadas com ≥ 5 min e vaga fixa.
- Horário de entrada, saída e almoço das empresas que dão nome às linhas (Suinco, Gazin, Predilecta, Pró-Curar-Se, Cemil, Rações Patense, IFTM, UNIPAM) — para o simulador de horário escalonado usar dado real em vez de fração.
- Relatórios de maio a julho da operadora (o "antes").
- Contagem por hora do piloto de semáforo da Av. Paracatu (SMTT).
- 11 dos 48 pontos das linhas de ônibus sem coordenada (ver `(retirado do repositório aberto) dados/onibus/pontos-geocodificados.json`, campo `lat: null`).
- Querido Diário (2016–2023) e rankings publicados de mobilidade — a busca caiu por falta de internet; refazer.

## 5. O que NÃO está no repositório, de propósito
- Relatório de viagens bruto (PDF de 1.297 páginas e as [número da operadora] linhas por viagem): dado da operadora entregue ao time, não publicado por ela. Só agregados aqui. A coluna de motorista nunca foi lida.
- Arquivos brutos baixados das fontes públicas (561 MB): listados com sha256 em `dados/publicos/MANIFEST-arquivos-baixados.sha256`; cada fonte tem a URL em `fontes-verificadas.json`.
- Conversas do grupo de WhatsApp e mensagens de áudio.

## 5b. Repositório PÚBLICO separado (para todos os times)
`github.com/enioxt/hackathon-dados-publicos` — só o compartilhável: fontes, dados públicos, técnicas, base legal, parcerias, motor, commons. Sem estratégia do time, sem dado da operadora, sem nomes. Este repositório (`hackathon`) é o do time.

## 6. Como um membro (ou a IA dele) contribui
Abra uma issue com o modelo em `commons/`, ou mande no grupo. Para pedir algo à IA do time no WhatsApp, marque `@egos`. Toda contribuição fica com autoria registrada (`commons/POLITICA.md`).

## 9. O que mudou na noite de 19/09 (leia depois do resto)
| Quero saber… | Abra |
|---|---|
| Onde estamos (protótipo × MVP), regras de negócio e critérios de aceite | `docs/REGRAS-E-ACEITE-MVP.md` |
| A porta que recebe dados de câmera e recusa placa/CPF/imagem | `motor/entrada-de-dados/` (`api.ts`, `validar.ts`, `api.test.ts`, `contrato/`) |
| O leitor de vídeo e como filmar | `motor/leitor-video/` |
| Prazo de implantação de 90 dias | `docs/PRAZO-IMPLANTACAO.md` |
| Sistema convencional × proposta, com fonte de cada preço | `docs/convencional-x-proposta.md` |
| Os agentes, onde rodam e quanto custam | `painel/arquitetura.html` |
| Painel com 5 layouts, mesa de controle, parede | `docs/gestor.html`, `painel/sintetizador.html`, `painel/parede.html` |

Pontos fracos que o próprio time já conhece (comece a crítica por eles): a contagem do leitor de vídeo ainda não foi conferida com vídeo de rua; o número real de câmeras da cidade tem três versões (240, 300, 700); o preço de radar "120 mil" não apareceu em contrato público; o pitch não foi ensaiado com cronômetro.

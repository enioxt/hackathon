# APIs e fontes integráveis — mobilidade Patos de Minas (IBGE 3148004)

> Hackathon 19/09/2026. Documento gravado cedo e acrescido por bloco (risco de rede caiu antes hoje).
> Status: PARTE 1 completa (a,b,c,d) · PARTE 2 completa (A-G). Agregados salvos em `acidentes-motos-patos.json`.

---

## PARTE 1 — Medição local RENAEST (sem rede)

**Fonte:** base nacional aberta de sinistros RENAEST, extração 13/08/2026, `/home/enio/.egos/hackathon/fontes/full.zip` (522 MB, 3 arquivos CSV: `Acidentes` 2,7 GB · `TipoVeiculo` 337 MB · `Vitimas` 1,83 GB). Lido em streaming (Python `zipfile`+`csv`, latin-1, `;`), sem extrair para disco, filtrado por `codigo_ibge=3148004` e cruzado por `num_acidente`.

**Base:** 22.708 sinistros em Patos de Minas (2018–ago/2026), 140 óbitos registrados no campo `qtde_obitos` de Acidentes. Moto/motoneta/ciclomotor presente (confirmado via `TipoVeiculo`, não só o texto do tipo de acidente) em **6.818 sinistros = 30,0%**; automóvel em 63,6% (medição anterior, mantida).

### (a) Sinistros com óbito e com ferido grave — presença de moto

- Sinistros com **óbito registrado** (`qtde_obitos>0` no acidente): **131**.
- Desses, com moto envolvida: **65 = 49,6%** — ou seja, moto está em quase metade dos sinistros fatais, quase o dobro da participação dela no total de sinistros (30,0%).
- Sinistros com **ferido grave/gravíssimo** (via campo `gravidade_lesao` da tabela Vítimas, agregado por `num_acidente`): ver bloco (b) abaixo — pass ainda rodando no momento em que este trecho foi escrito.

### (b) Vítimas por gravidade / tipo de envolvido / idade — moto × sem moto

Join `Vitimas` × `Acidentes`(Patos) × `TipoVeiculo`(moto) por `num_acidente`. 43.904 registros de vítima casados a sinistro de Patos; 12.894 em sinistro-com-moto, 31.010 em sinistro-sem-moto.

- **Ferido grave (agregado por sinistro, campo `gravidade_lesao`):** 744 sinistros de Patos têm ao menos 1 vítima GRAVE/GRAVÍSSIMA; desses, **355 = 47,7% têm moto** — quase o dobro da participação da moto no total de sinistros (30,0%), no mesmo patamar do achado de óbito (49,6%).
- **Gravidade da lesão (nível vítima):** moto — GRAVE 375 (2,9% das vítimas-moto), ÓBITO 32 (0,2%); sem-moto — GRAVE 408 (1,3%), ÓBITO 52 (0,2%). Em termos relativos, vítima em sinistro-com-moto tem **2,2× mais chance de ser classificada GRAVE** que vítima em sinistro sem moto (2,9% vs 1,3%).
- **Tipo de envolvido:** em sinistro-com-moto, 86,4% das vítimas são "MOTORISTA" (o próprio motociclista), 11,1% passageiro, 1,4% pedestre. Em sinistro-sem-moto, 13.779 vítimas (44,4%) caem em "DESCONHECIDO" — qualidade de preenchimento pior nesse grupo, o que dificulta comparação direta.
- **Faixa etária:** vítima-moto concentra fortemente em jovem adulto — 18-24 anos é a faixa isolada mais comum (3.346 = 26,0% das vítimas-moto); nas vítimas sem-moto a distribuição é mais espalhada e o pico é 35-39 anos (3.973 = 12,8%). Moto é claramente um sinistro de gente mais jovem.
- **Gênero:** moto — 68,5% masculino / 31,0% feminino; sem-moto — 68,9% masculino / 29,9% feminino. Praticamente **igual** entre os dois grupos — gênero não diferencia sinistro-com-moto de sinistro-sem-moto nesta base.

### (c) Distribuição por hora do dia e dia da semana — moto × sem moto

Hora extraída de `hora_acidente` (formato HHMMSS), bucket por hora cheia.

| hora | sinistros c/ moto (n, %) | sinistros s/ moto (n, %) |
|---|---|---|
| 00h | 86 (1,3%) | 170 (1,1%) |
| 01h | 61 (0,9%) | 171 (1,1%) |
| 02h | 35 (0,5%) | 116 (0,7%) |
| 03h | 30 (0,4%) | 108 (0,7%) |
| 04h | 34 (0,5%) | 118 (0,7%) |
| 05h | 43 (0,6%) | 169 (1,1%) |
| 06h | 180 (2,6%) | 383 (2,4%) |
| 07h | 459 (6,7%) | 759 (4,8%) |
| 08h | 329 (4,8%) | 752 (4,7%) |
| 09h | 265 (3,9%) | 766 (4,8%) |
| 10h | 291 (4,3%) | 1.024 (6,4%) |
| 11h | 454 (6,7%) | 1.064 (6,7%) |
| 12h | 458 (6,7%) | 1.082 (6,8%) |
| 13h | 488 (7,2%) | 1.142 (7,2%) |
| 14h | 407 (6,0%) | 1.042 (6,6%) |
| 15h | 391 (5,7%) | 1.135 (7,1%) |
| 16h | 448 (6,6%) | 1.136 (7,1%) |
| 17h | 594 (8,7%) | 1.321 (8,3%) |
| 18h | 546 (8,0%) | 1.079 (6,8%) |
| 19h | 398 (5,8%) | 795 (5,0%) |
| 20h | 266 (3,9%) | 575 (3,6%) |
| 21h | 243 (3,6%) | 397 (2,5%) |
| 22h | 201 (2,9%) | 325 (2,0%) |
| 23h | 111 (1,6%) | 261 (1,6%) |

Janelas do enunciado (pico de entrega 11h–14h e 18h–22h), somadas: sinistros com moto no bloco 11h-14h = **26,5%** do total de moto; sem moto = 27,2% do total sem moto (quase igual — **11h-14h não distingue moto de outros veículos**, é o horário de pico geral da cidade). Bloco 18h-22h: com moto = **24,3%**; sem moto = **20,0%** — aqui SIM há diferença: sinistros com moto são proporcionalmente mais concentrados no fim de tarde/noite (18h-22h) do que os demais veículos (+4,3 p.p.).

Por dia da semana: moto — Sexta-feira lidera (1.190, 17,5% do total-moto), seguida por Quarta (1.041) e Terça (1.040); Domingo é o menor (635, 9,3%). Sem moto: também Sexta é o maior (2.753, 17,3%) e Domingo o menor (1.611, 10,1%) — o padrão semanal é parecido entre os dois grupos, sem sinal específico de "delivery".

### (d) Top 10 bairros e endereços com mais sinistros com moto

**Bairros:**
1. CENTRO — 548
2. CRISTO REDENTOR — 149
3. LAGOA GRANDE — 144
4. BRASIL — 113
5. ROSÁRIO — 94
6. PLANALTO — 79
7. CÔNEGO GETÚLIO — 75
8. JARDIM CENTRO — 71
9. ALTO DOS CAIÇARAS — 70
10. JARDIM PANORÂMICO — 64

**Logradouros (nome da via, agregando todos os números):**
1. Rua/Av. MAJOR GOTE — 445
2. Av. PRESIDENTE JUSCELINO KUBITSCHECK — 368
3. Rua FÁTIMA PORTO — 313
4. Rua MARABÁ — 237
5. Rua DOUTOR MARCOLINO — 119
6. Rua VEREADOR JOÃO PACHECO — 108
7. Av. GETÚLIO VARGAS — 107
8. Rua AFONSO QUEIROZ — 104
9. Rua RUI BARBOSA — 103
10. Rua BRASIL — 91

### Limite honesto — "entregador" NÃO é medível nesta base

A base RENAEST **não tem campo de profissão/ocupação da vítima**. Não é possível, com este dado, afirmar quantos sinistros envolveram entregador de aplicativo — isso seria inferência não sustentada pela fonte (violaria P1 — verdade provada). O **melhor proxy honesto** disponível é: **moto + horário de pico de entrega (18h-22h, onde moto tem +4,3 p.p. de concentração relativa a outros veículos)**. Limite desse proxy: motociclista de lazer, de trabalho não-delivery (ex. deslocamento casa-trabalho) e entregador informal (não só apps) todos caem no mesmo balde — o proxy aponta uma correlação plausível, nunca uma contagem de entregadores. Qualquer peça pública deve dizer isso explicitamente, nunca apresentar "moto à noite" como sinônimo de "entregador".

Agregados salvos em `/home/enio/.egos/hackathon/acidentes-motos-patos.json` (ver rodapé deste arquivo para status).

---

## PARTE 2 — Catálogo de APIs e fontes integráveis

> REAL = confirmado com fonte primária · CONCEPT = existe, detalhe não 100% confirmado · PHANTOM = não encontrado/não existe. Toda linha carrega URL + data de verificação (2026-09-19, salvo indicação contrária). Sem nome de pessoa física. Nenhuma cota/preço foi inventado — onde a fonte diverge ou não confirma, isso está dito.

### GRUPO A — Google Cloud / Maps Platform

| API | O que entrega | Cota grátis/mês (2026) | Restrição de termos relevante | Classificação |
|---|---|---|---|---|
| Routes API | rota ponto-a-ponto, traffic-aware | Essentials: 10.000 chamadas/mês grátis (fonte oficial); acima disso US$4,00/1.000 (faixa 100k-500k) | Sem cache de conteúdo salvo place IDs (cláusula 3.2.3 dos ToS) | REAL |
| Roads API (Snap to Roads) | ajusta GPS bruto à malha viária | Divergente entre fontes: "5.000 grátis / US$8,00 por 1.000" numa leitura oficial; outra cita a categoria genérica 10k/5k/1k sem confirmar em qual cai | Máx. 100 pontos/requisição, 30.000 req/min | CONCEPT — cota exata não confirmada sem ambiguidade |
| Places API | busca/detalhes de lugares | Text Search "Essentials (IDs only)" aparece como sem cobrança; Place Details Essentials 10.000 grátis, depois US$4,00/1.000; campos Pro/Enterprise sobem a US$32-40/1.000 (fonte secundária, não confirmado na doc oficial) | Place ID pode ser armazenado indefinidamente (única exceção ao no-cache); demais campos não podem ser cacheados fora do fluxo autorizado | REAL (Place Details/Text Search-IDs) / CONCEPT (preço por campo) |
| Maps JavaScript API + TrafficLayer | mapa interativo com trânsito ao vivo | ~10.000 carregamentos/mês grátis (Essentials, valor exato do SKU não confirmado nesta sessão) | **Proibido cachear/pré-buscar/armazenar conteúdo** (exceto place IDs); TrafficLayer deve ser exibido **sobre mapa Google**, nunca isolado/extraído para outro provedor (ex. Leaflet/OSM) | REAL — restrição de no-caching confirmada por citação textual da política oficial |
| Distance Matrix (legacy) / Route Matrix (novo) | tempo/distância N origens × M destinos | Route Matrix: Basic US$5 CPM (25×25 máx, sem tráfego real), Advanced US$10 CPM (com tráfego), Preferred US$15 CPM (pedágio/2 rodas) — cobrança **por elemento**, não por chamada | Chamada com muitas origens×destinos pode gerar milhares de elementos cobrados numa única requisição | REAL (modelo de cobrança); cota grátis específica não confirmada |
| Air Quality API | AQI, poluentes, previsão por coordenada | Citado como 10.000 grátis + US$4,00/1.000 (100k-500k), mas não confirmado por citação textual direta da doc de billing | Limite de 6.000 req/min por método | CONCEPT |
| Street View Static API | imagem estática 360° de um ponto | Citado como 10.000 grátis + US$5,60/1.000 (100k-500k), outras fontes citam faixa US$0,0056-0,007/panorama (compatível em ordem de grandeza) | Imagem máx. 640×640px; não confundir com Street View Publish API (grátis, é para enviar imagem) | CONCEPT |

**Nota geral:** em 01/03/2025 o Google extinguiu o crédito único de US$200/mês que cobria todas as APIs somadas, substituindo por cota grátis por SKU individual (Essentials/Pro/Enterprise, ~10k/5k/1k eventos) — mas a atribuição exata de cada API a essas faixas variou entre fontes nesta pesquisa. Fonte: `developers.google.com/maps/billing-and-pricing/pricing` + `.../overview` + `.../javascript/policies` + `.../air-quality/usage-and-billing` + `.../streetview/usage-and-billing` (verificado 19/09/2026).

### GRUPO C — Trânsito de terceiros com camada gratuita

| API | O que entrega | Cota grátis 2026 | Termos relevantes | Classificação |
|---|---|---|---|---|
| TomTom Traffic API | Traffic Flow (fluxo) + Traffic Incidents (tempo real) | Incidents: 2.500 req/mês grátis; Flow: 200.000/mês grátis (fonte oficial `docs.tomtom.com/pricing`) — **diverge** de outra leitura ("50K tiles/dia + 2.500 não-tile/dia"), não reconciliado | **Cláusula 11.4 do ToS proíbe cache "para escalar resultados a múltiplos usuários"** — exatamente o padrão de um painel municipal servindo N cidadãos de uma única assinatura; dado não pode ser retido &gt;60-90 dias; proibido banco derivado | REAL (restrição de cache, citação textual) / CONCEPT (cota exata) |
| HERE Traffic API | trânsito tempo real + histórico | Plano gratuito sem cartão (1.000 req/dia) foi **descontinuado em 31/08/2025**; hoje só existe Base Plan (exige cartão, cobra só acima da cota) — valor exato da cota mensal não encontrado (página oficial de preços retornou 404 no fetch direto) | Reajuste ~6% no Base Plan a partir de 01/04/2026 | CONCEPT |
| Mapbox GL JS / Traffic Data | GL JS: mapas vetoriais interativos; Traffic Data: velocidades (produto separado) | GL JS: 50.000 carregamentos/mês grátis, depois US$5,00/1.000 (fonte oficial). Traffic Data **não tem tier grátis publicado** — acesso só via contato comercial | Sem teto de gasto configurável — estouro de cota só gera alerta por e-mail, não bloqueio automático | REAL (GL JS, citação textual oficial) |

**Nota crítica:** nenhuma das APIs de A/C permite, sem revisão jurídica adicional, cachear trânsito ao vivo para servir um painel público a múltiplos cidadãos a partir de uma única chamada — é exatamente o padrão de uso que o TomTom nomeia como fora da cota-cache padrão.

### GRUPO B — Waze for Cities Data

- **O que entrega (REAL):** alertas em tempo real — congestionamento, acidentes, obras, fechamento de via, irregularidades reportadas por usuário. Fonte: `waze.com/wazeforcities/`, `support.google.com/waze/partners`.
- **Formato (REAL):** feed (GeoRSS/JSON) ou, desde a migração para infra Google Cloud, acesso via BigQuery + Data Studio.
- **Quem pode aderir (REAL):** não é exclusivo de governo — formulário aceita "government or private road operator". Sem convite prévio, inscrição aberta. Fonte: `support.google.com/waze/partners/answer/10453062`.
- **Como aderir (REAL, confirmado por fetch):** `waze.com/ccp/` → "Apply now" → credenciais → dados da organização → desenhar o polígono geográfico de atuação (para Patos, delimitar o município) → aceitar termos → aguardar aprovação por e-mail (sem acesso ao Partner Hub até aprovar).
- **Status 2026 (REAL):** programa segue ativo sob o nome "Waze for Cities" (ex-Connected Citizens Program), >1.000 parceiros globais, nenhuma evidência de descontinuação.
- **Precedentes Brasil (REAL):** Rio de Janeiro (primeiro acordo formal no país), Petrópolis/RJ, Vitória/ES, Juiz de Fora/MG, Salvador/BA; estudo acadêmico sobre Joinville/SC. **Nenhum precedente encontrado em Patos de Minas ou região do Alto Paranaíba** — não presumir sem checar direto com a prefeitura.
- **Gap declarado:** custo é dito "gratuito" nas fontes institucionais, mas o texto contratual completo não foi lido — checar antes de assumir zero obrigação.

### GRUPO D — Abertos e sem chave

**🔴 SENATRAN — Frota por Município (prioridade do enunciado):** portal oficial `gov.br/transportes/pt-br/assuntos/transito/conteudo-Senatran/frota-de-veiculos-2026`, referência mais recente jul/2026, download mensal em XLSX. Arquivo mais direto: **"Frota por Município e Tipo"** — mesmo portal tem variantes por Ano de Fabricação, CEP, Combustível, Cor, Potência, Marca/Modelo. Permite isolar Patos de Minas por código IBGE 3148004. Alternativa em CSV mais fácil de automatizar (sem chave): `dados.transportes.gov.br/dataset/registro-nacional-de-veiculos-automotores-renavam` e espelho `dados.infraestrutura.gov.br`. Também via **Base dos Dados** (`basedosdados.org/dataset/61d592ca-5aec-4f66-b8eb-f7b894a29b66`, BigQuery, série mensal desde 2003, cota gratuita não confirmada nesta pesquisa). **Gap:** não há API REST — é planilha mensal, ETL local. REAL.

- **OpenStreetMap/Overpass (REAL):** sem chave, `overpass-api.de`, rate limit por IP não fixo (checar `/api/status`); volume alto → self-host recomendado pela doc.
- **OSRM/Valhalla (REAL):** self-hosted via Docker, grátis, sem chave. OSRM mais leve/rápido, perfis Lua, sem hot-reload. Valhalla mais lento para montar grafo, roteamento multimodal numa query. Ambos precisam de extrato `.osm.pbf` (Geofabrik) — extrato de MG cobre Patos.
- **Open-Meteo (REAL):** sem chave, grátis para uso não-comercial, CC BY 4.0. **INMET/BDMEP (REAL):** histórico desde 1961, precisa cadastro, defasagem de 1-3 meses, sem API REST formal documentada (parsing de ZIP). Cobertura de estação ativa em Patos de Minas não confirmada — checar cadastro antes de assumir.
- **IBGE (REAL):** malha municipal via API `servicodados.ibge.gov.br/api/v3/malhas/municipios/3148004?formato=application/vnd.geo+json` (sem chave); setores censitários via FTP `geoftp.ibge.gov.br`; Censo 2022 pendularidade via SIDRA (`sidra.ibge.gov.br`) — achado nacional: 10,7% da população ocupada trabalha fora do município; número específico de Patos de Minas não verificado nesta pesquisa (precisa consulta SIDRA direta).
- **RENAEST (REAL):** portal `dados.transportes.gov.br/dataset/renaest` + painel `gov.br/.../registro-nacional-de-acidentes-e-estatisticas-de-transito`. Limitação documentada por estudo acadêmico: ~22,3% dos campos comuns não preenchidos, 35,3% das colisões "não especificadas", não cobre rodovia federal (isso é só PRF).
- **DATASUS SIM/SIH (REAL):** TabNet, Estatísticas Vitais → Óbitos por causas externas → CID-10 V01-V89 → por município; SIH para internações. Sem API REST oficial — acesso via lib `pysus` sobre arquivos DBC/FTP.
- **PRF (REAL):** `portal.prf.gov.br/dados-abertos`, cobre só rodovia federal (BR-xxx) — relevante se houver trecho federal cruzando Patos (não confirmado nesta pesquisa).
- **ANTT (REAL):** `dados.antt.gov.br`, cobre transporte interestadual/pedágio de rodovia concedida — relevância a Patos indireta, não confirmada (checar se há pedágio/linha ANTT no município).
- **MG dados abertos (REAL):** portal `dados.mg.gov.br`; **DER-MG** (`der.mg.gov.br/transparencia/dados-abertos`) tem consulta de condição de rodovia estadual, relevante se MG-230 ou outra estadual passa por Patos (não confirmado); SEINFRA e Portal da Transparência MG são mais fiscais/contratuais que trânsito.

### GRUPO E — Apps de entrega/transporte: programa oficial de dados com prefeitura?

- **Uber Movement (REAL histórico):** existiu 2017-?, dados agregados/anônimos de viagem para 13 cidades EUA + 38 outras (fev/2021). **Descontinuado — data exata de encerramento não encontrada nesta pesquisa (PHANTOM quanto à data)**.
- **Uber (REAL, mas é regulatório, não dado aberto):** aderiu ao Programa Municipal de Direção Segura do Rio (Decreto 57.000/15-10-2025, nov/2025) — telemetria/GPS de excesso de velocidade e manobra perigosa, score diário, fiscalização pela CET-Rio. Base legal = decreto municipal, não convênio voluntário de dado aberto.
- **iFood (REAL, caso concreto):** "Direção Segura" lançado 10/06/2026 com a Prefeitura do Rio, mesmo Decreto 57.000/2025; monitora velocidade nas rotas, alimenta score de distribuição de pedidos, dado vai só à CET-Rio (não é publicado). Expansão nacional prevista ao longo de 2026 — não confirmado se chegou a Patos de Minas.
- **99 (REAL, múltiplos casos):** Porto Alegre (GPS de motorista alimenta sincronização de semáforo por IA), Osasco/SP (dado com Secretaria de Tecnologia), Manaus/Fortaleza/BH/Maranhão (parcerias de segurança viária, menos claro se é dado agregado formal), São Paulo (99+Uber compromisso conjunto de dado agregado ao setor público). Instrumento jurídico exato (termo de cooperação técnica formal vs. acordo administrativo simples) **não confirmado** — CONCEPT quanto ao instrumento, REAL quanto à existência do compartilhamento.
- **App regional em Patos de Minas (PHANTOM para dado com prefeitura):** existem apps locais (Corridas Tio Patinhas, Driver88, Drime, ECO POP, Rota Pop, Te Levo/Alto Paranaíba) mas nenhuma evidência de programa de dado com a Prefeitura de Patos de Minas — declarado PHANTOM explicitamente, não é ausência de busca.

### GRUPO F — Consulta de veículo por placa: parecer jurídico-prático

- **Serviços oficiais (REAL):** DETRAN-MG (site + app MGApp, login gov.br, grátis) para situação/débito/CRLV-e; portal de dados abertos federal para agregados (não consulta individual). SNE (Sistema Nacional de Emplacamento) citado nas buscas mas sem detalhamento confirmado (⚪ não-medido).
- **Serviços comerciais/terceiros (REAL, não-oficiais):** Zapay, Gringo, Zignet, DOK, Apify, Credify e similares — revendem consulta paga via API pública ou raspagem, se apresentam como "não vinculados a órgão oficial".
- **Placa como dado pessoal — LGPD (REAL com nuance):** entendimento doutrinário predominante trata placa como dado pessoal indireto (identifica por correlação, como IP/MAC). Detran-DF classifica oficialmente placa como "dado de identificação". Existe Nota Técnica nº 3/2023/CGF/ANPD citada por terceiros — **conteúdo exato não confirmado (PDF retornou erro de acesso nesta pesquisa)**, existência da nota é REAL, teor é ⚪ não-medido.
- **Scraping em massa viola termos (PARCIAL):** não encontrada cláusula "anti-scraping" nomeada explicitamente nas APIs comerciais pesquisadas; mecanismo técnico de barreira é o login gov.br obrigatório em consulta individual, que na prática inviabiliza automação em escala sem violar os termos de acesso — REAL quanto ao mecanismo, CONCEPT quanto ao texto literal da cláusula.
- **Órgão de trânsito × empresa privada (REAL por dedução estrutural, sem jurisprudência nomeada):** órgão com competência legal (DETRAN, SENATRAN, prefeitura com convênio/decreto como o do Rio) pode exigir/receber dado individualizado de condutor, por exercer poder de polícia administrativa de trânsito. Empresa privada sem essa competência não tem base legal para tratar dado individualizado vinculado a placa sem consentimento do titular — situação típica de um hackathon.
- **Recomendação para o hackathon:** usar dado agregado aberto do SENATRAN/RENAVAM (grupo D) — frota por tipo/ano/combustível/marca-modelo por município, sem placa, sem CPF. Resolve simular composição de frota sem tocar em dado pessoal, sem scraping, sem depender de termo de cooperação com terceiro privado, e cobre exatamente o recorte geográfico de Patos de Minas.

### GRUPO G — Visão computacional aberta para câmera de trânsito

| Opção | Licença | Vende fechado a prefeitura | Risco jurídico |
|---|---|---|---|
| Ultralytics YOLOv8/YOLO11 | **AGPL-3.0** (dual: Enterprise paga) | **NÃO sem comprar Enterprise License** — AGPL estende copyleft a "uso em rede" (SaaS já dispara a obrigação de abrir código) | 🔴 ALTO sem licença paga |
| RT-DETR (repo oficial `lyuwenyu/RT-DETR`, não via pacote `ultralytics`) | Apache 2.0 | SIM | 🟢 BAIXO — cuidado: importar via `from ultralytics import RTDETR` herda AGPL, usar sempre o repo oficial |
| YOLOX (Megvii) | Apache 2.0 | SIM | 🟢 BAIXO |
| D-FINE (repo oficial `Peterande/D-FINE`) | Apache 2.0 | SIM | 🟢 BAIXO — checar nota de checkpoints Objects365 |
| ByteTrack | MIT | SIM | 🟢 BAIXO |
| BoT-SORT (repo oficial `NirAharon/BoT-SORT`) | MIT | SIM | 🟢 BAIXO — mesma armadilha do wrapper Ultralytics (`botsort.yaml` interno é AGPL) |
| Frigate (NVR) | MIT | SIM | 🟢 BAIXO — aplicação a câmera de trânsito municipal é hipótese técnica plausível, não caso documentado |
| Supervision (Roboflow) | MIT | SIM | 🟢 BAIXO |
| NVIDIA DeepStream SDK | Proprietária (EULA), NÃO é open source | SIM, sob termos da EULA | 🟡 MÉDIO — trava a hardware NVIDIA, proíbe redistribuição standalone |

**Datasets de tráfego:** UA-DETRAC (REAL — câmera de trânsito FIXA, o mais próximo do caso de uso, 100 sequências/24 locais em Pequim-Tianjin; licença formal não confirmada no site oficial, mirrors dizem CC BY 4.0 — ⚪ não-medido); VisDrone (REAL — mas é DRONE, não câmera de poste; licença oficial CC BY-NC-SA 3.0 — **não-comercial**, bloquearia venda a prefeitura, mirrors dizem CC BY 4.0 mas a licença mais restritiva prevalece até confirmação); MIO-TCD (REAL — câmera de trânsito fixa real, Canadá/EUA, 786.702 imagens, 11 classes; licença formal não encontrada, só exigência de citação — ⚪ não-medido).

**Recomendação de arquitetura:** RT-DETR ou YOLOX ou D-FINE (detecção, repos oficiais, Apache 2.0) + ByteTrack ou BoT-SORT (tracking, MIT) + Supervision (visualização, MIT) evita toda obrigação de copyleft de rede que o YOLO da Ultralytics impõe a quem quer vender serviço fechado sem licença Enterprise.

---

## 🕳️ O que ficou de fora (universo desta pesquisa)

- Não abri nenhum XLSX do SENATRAN para confirmar a linha exata de Patos de Minas — isso é ETL, próximo passo, não pesquisa de fonte.
- Não testei nenhuma chamada real às APIs comerciais (Google/TomTom/HERE/Mapbox) — só documentação.
- Não confirmei cobertura de estação INMET, trecho de rodovia federal (PRF) ou estadual (DER-MG) especificamente dentro do perímetro de Patos de Minas.
- Não confirmei conteúdo exato da Nota Técnica ANPD sobre placa, nem jurisprudência formal sobre placa×LGPD.
- Licença exata (texto oficial, não mirror) de UA-DETRAC e MIO-TCD não confirmada.
- Nenhum precedente de Waze for Cities ou app de entrega com dado formal foi encontrado especificamente em Patos de Minas/Alto Paranaíba — ausência de achado, não prova de ausência do fato.


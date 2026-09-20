## 📊 Diagnóstico

**Fonte:** `/home/enio/enio-dev/piloto/eagle-eye/core/data/mirror.db` (tabela `contratacoes`), medido em 2026-09-19.
**População:** IBGE API `agregados/6579` (estimativa 2026), `servicodados.ibge.gov.br` — 1 fetch com todos os municípios.
**Saída:** `/home/enio/.egos/hackathon/editais-espelho.json` (830 KB) + `.csv` (346 KB, 689 linhas) — script reprodutível em `.../scratchpad/mobilidade_analise.py`.

### Universo (medido primeiro)
233.299 contratações · 27 UFs · publicação de 2024-08-01 a 2026-07-20 (espelho cobre ~23 meses). `anoCompra` tem 5 outliers fora de 2020-2027 (ex: "20266") — erro de digitação na fonte, não corrigido, só sinalizado.

### Classificação de mobilidade urbana (LIKE/substring, accent-fold documentado no JSON em `metodologia.familias_expressoes`)
**689 contratações = 0,295% do universo** (689/233.299), em 9 famílias:

| Família | N |
|---|---|
| ciclovia/calçada/acessibilidade | 201 |
| transporte coletivo/concessão/bilhetagem | 168 |
| semáforo/controle de tráfego | 161 |
| GPS/monitoramento de frota | 54 |
| estacionamento rotativo | 41 |
| iluminação/travessia de pedestre | 28 |
| videomonitoramento de trânsito | 22 |
| radar/fiscalização eletrônica | 13 |
| PlanMob/pesquisa OD | 6 |
| app/dados abertos de transporte | 0 |

**Falso positivo (declarado, não escondido):** amostra de 30 (seed=42, leitura integral do `objetoCompra`, julgamento humano único) na classificação V1 → **6/30 = 20,0% FP**. Causas medidas: 3× acessibilidade de PRÉDIO (CRAS/creche/playground) capturada por "piso tátil"/"rampa de acessibilidade" sem contexto de rua; 3× transporte rural/intermunicipal/uso interno da prefeitura capturado por "transporte coletivo". Corrigi com `exclude`/`exclude_unless` (documentado no JSON) e validei com 2ª amostra pós-correção (seed=7, n=15): **1/15 = 6,7% FP residual** (Felixlândia/MG — transporte para Secretaria de Serviço Social, não corrigido, fica como dívida declarada). Os números acima (689, tabela por família) já são pós-correção.

### (1) Ranking 30 municípios — quantidade e valor
Top por quantidade: São Paulo (9), Vera Cruz/BA (9, 19,83/100k hab — outlier de porte pequeno), Curitiba (8), Recife (8), Rio de Janeiro (7), Brasília (7)... Top por valor: Brasília (R$ 531,6 mi), São Paulo (R$ 507,5 mi), Curitiba (R$ 296,8 mi)... Lista completa das 30 em cada corte: `ranking_30_por_quantidade` e `ranking_30_por_valor` no JSON, com população IBGE 2026 e contratações/100k hab.

### (2) Top 15 diversidade de famílias (proxy "avançado")
Lidera: **Rio de Janeiro e Brasília** (4 de 9 famílias cada). Depois São Paulo, Recife, Cascavel/PR, Santo André/SP (3 famílias). Lista completa em `top_15_diversidade_familias`.

### (3) Patos de Minas — tudo no espelho
83 contratações totais (codigoIbge 3148004, pop. IBGE 2026 = 170.404). **Apenas 1** cai nas 10 famílias de mobilidade: concessão de Estacionamento Rotativo (LICITANET, 2026-01-23, valor estimado simbólico R$10 — típico de concessão remunerada por tarifa, não custo real). **12 tangenciais fora das famílias**: 2× "aquisição de materiais de sinalização viária", 1× ferramentas para a Secretaria de Trânsito/Transporte/Mobilidade, 1× locação de ônibus para evento, 1× seguro de frota (273 veículos), resto é estrutura móvel para feiras/festivais (não é mobilidade urbana, é logística de evento).

### (4) Comparáveis (100-250k hab, ≥3 famílias) — porte de Patos
5 municípios: **Itatiba/SP** (127.729 hab, 3 fam: ciclovia+semáforo+transporte), **Cachoeirinha/RS** (141.506, 3 fam: estacionamento+semáforo+transporte), **Pindamonhangaba/SP** (173.267, 3 fam), **Umuarama/PR** (124.077, 3 fam: estacionamento+radar+transporte), **Sinop/MT** (231.452, 3 fam: semáforo+transporte+videomonitoramento). Patos (170.404 hab, mesma faixa) tem 1 família — os 5 comparáveis mostram o "próximo degrau" real, não hipotético.

### (5) Exemplos simples e baratos (<R$500k) que resolveram algo
262 contratações no total, mas ~104 são concessões com valor simbólico (R$1-R$19 — receita vem da tarifa, não do erário; não é "barato de verdade"). Filtrando valor real (≥R$5.000, fora das famílias de concessão): **Nova Odessa/SP R$5.046** (peças manutenção semafórica), **Cajuru/SP R$8.690** (manutenção semáforos), **São Bento do Sul/SC R$10.301** (telemetria veicular), **Marialva/PR R$11.089** (rastreamento veicular), **Pelotas/RS R$19.368** (rampa de acessibilidade em via), **Feliz/RS R$21.573** (totem de videomonitoramento), **Esteio/RS R$35.996** (piso tátil).

## 🕳️ O que ficou de fora
- Só uma fonte (este espelho local, janela ago/2024-jul/2026); não cobre PNCP anterior nem contratações fora do espelho.
- Achado colateral de qualidade de dado: um registro rotulado `municipioNome=Salvador` cujo `objetoCompra` descreve obra "no município de Planalto" — o campo município parece refletir o órgão contratante, não necessariamente o local físico; não auditei quantos outros casos existem.
- Famílias "app/dados abertos" (0) e "PlanMob" (6) têm contagem baixíssima — não sei distinguir se é sub-representação real do setor público brasileiro ou insuficiência do padrão de busca; não ampliei mais para não "inventar" keyword sem evidência.
- Não houve 2º revisor humano na auditoria de falso-positivo (juízo único, declarado).
- Não varri todos os municípios de 100-250k hab do Brasil (só os que já tinham ≥3 famílias) — não sei quantos desse porte têm 0, 1 ou 2 famílias, que seria o denominador completo da comparação.

## ➡️ Próxima task
Com os 5 comparáveis de porte (Itatiba/Cachoeirinha/Pindamonhangaba/Umuarama/Sinop) e Patos tendo só 1 família, o próximo passo natural é ler os 3-5 objetos completos desses comparáveis (JSON já tem tudo) para extrair o **edital-molde** mais replicável para Patos — recomendo semáforo (é a família mais barata/replicável medida acima, R$5-45k) como primeiro alvo do hackathon, não transporte coletivo (que exige concessão/PPP, processo muito mais longo). Alternativa: aprofundar Umuarama (radar+estacionamento+transporte, mesma faixa populacional, GO comparável a Patos) como estudo de caso único.
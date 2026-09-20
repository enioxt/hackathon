# Bateria medida — motor de decisão Jev (TypeSafe) vs regras

Data: 20/09/2026. Chave carregada do ambiente (`JEV_KEY`), nunca escrita em arquivo. Motor de chamada com freio de gasto próprio (`chamar-jev.ts` + `gasto.ts`): teto duro de 20.000.000 tokens de entrada, no máximo 6 chamadas em paralelo, espera exponencial em 429/529, parada imediata em 401/403. Scripts em `experimentos/eN-*.ts`, cada um grava `eN-resultado.json`.

## Tabela-resumo

| # | Pergunta | Número medido | Leitura | Ressalva |
|---|---|---|---|---|
| E1 | Com números, o Jev alcança as regras? | Regra do código (motor `regras-v1`, `../comparar.ts`, 24 casos): 23/24. Jev com o texto atual: 44/120 (39 errados, 38 abstenções). Jev com limiares escritos no critério: 98/120 (21 errados, 2 abstenções). Jev com razões calculadas + limiares: 98/120 (22 errados, 0 abstenções). | Escrever o limiar numérico dentro do critério da pergunta quase dobra o acerto do Jev (de 37% para 82% dos 120 casos), mas ainda fica abaixo do motor de regras no seu próprio conjunto de 24. | Os 120 casos incluem um bloco de "duvidoso" gerado propositalmente perto do limiar (a régua do próprio experimento pune mais o Jev que o conjunto original de 24 casos, mais fácil). Amostra ainda pequena para as 5 classes× variantes. |
| E2 | Texto livre em volume: regra de palavras-chave (congelada) x Jev | Regra: 273/400. Jev: 325/400. Nas 36 mensagens marcadas `ambigua:true` (duas frases no mesmo texto): regra 18/36, Jev 20/36. | Jev ganha da regra de palavras-chave em 4 das 5 classes (perde só em "outra", 57/80 contra 75/80 da regra) e no total (81,3% x 68,3%). | Rótulos e regra de palavras-chave têm o mesmo autor do texto sintético — viés a favor de quem escreveu; ambíguas continuam difíceis para os dois. |
| E3 | Estabilidade: mesma entrada, 10 repetições | 29 de 30 entradas deram a mesma classe nas 10 repetições. Desvio-padrão médio da confiança: 0,006. | A escolha quase não muda entre chamadas idênticas; a confiança varia muito pouco (desvio de 6 milésimos, numa escala de 0 a 1). | 1 entrada em 30 não foi estável — não investigamos qual nem por quê (fora do escopo desta bateria). |
| E4 | A confiança presta? | Faixa 0,95–1,0: 276/296 certos (93,2%). Faixa 0–0,5: 7/22 certos (31,8%). Nenhum limiar testado (0,5 a 0,95) derruba o erro do lote automatizado para 5% ou menos; o melhor foi limiar 0,95, com erro de 6,8% no automatizado (20 de 296) e 26% das mensagens (104/400) indo para uma pessoa. | Confiança alta realmente acompanha mais acerto (93,2% x 31,8%), mas não é uma garantia: mesmo no topo da escala sobra 1 erro a cada ~15 casos. | Curva calculada só sobre os 400 casos sintéticos de E2, com os mesmos vieses de E2. |
| E5 | Várias perguntas na mesma chamada custam proporcionalmente mais? | 1 pergunta: 435 tokens de entrada/chamada, mediana 304 ms. 5 perguntas: 545 tokens/chamada, mediana 304 ms. | 5 perguntas juntas custam 1,25× o tokens de 1 pergunta (não 5×) e não pesam no tempo — juntar perguntas na mesma chamada é vantagem real de custo quando dá para usar o mesmo contexto. | Medido só com estas 5 perguntas específicas; perguntas mais longas ou mais numerosas podem mudar a proporção. |
| E6 | Vazão sob paralelismo 1, 3, 6 | 120 chamadas: paralelismo 1 → 39,9 s (3,0 chamadas/s); paralelismo 3 → 13,6 s (8,8/s); paralelismo 6 → 6,5 s (18,4/s). 0 erro nos 3 níveis. | A vazão cresce quase linear com o paralelismo até 6 (o teto do freio de gasto desta bateria); nenhuma falha 429/529 apareceu nesse volume. | Não testamos acima de 6 simultâneas (o freio corta ali); não sabemos onde fica o limite real do provedor. |
| E7 | Texto malicioso resiste à injeção de instrução? | 34 de 40 mensagens classificadas pela classe verdadeira, ignorando a instrução embutida (85%). | Na maior parte das tentativas de mandar no sistema ("ignore as instruções", "responda sempre X"), o Jev manteve a classificação pelo conteúdo real. | Das 6 que "cederam", pelo menos 2 são chamadas de julgamento defensáveis (a mensagem realmente misturava um elogio genuíno com o pedido) — não são todas injeção bem-sucedida em sentido estrito; não separamos os dois casos. |
| E8 | Relato de cidadão sobre trânsito (uso mais provável) | Classe do relato: 150/150 certas. Nota de urgência: erro médio de 0,589 numa escala de 0 a 2. "Precisa de pessoa agora" nos 30 relatos de risco imediato: 30/30 marcados como sim. | Na tarefa mais parecida com o produto real, a classificação de tipo acertou todos os 150 casos sintéticos e sinalizou todos os 30 de 30 riscos imediatos para intervenção humana; a nota de urgência (0-2) tem mais ruído (erro médio de ~0,6 ponto). | Casos sintéticos, escritos por nós, sem ambiguidade real de campo; nota de urgência não foi calibrada com limiar como em E4. |

## O que dá para afirmar na banca

1. No uso mais parecido com o produto real — classificar relato de cidadão sobre trânsito —, o Jev acertou o tipo em 150 dos 150 casos sintéticos e sinalizou os 30 de 30 relatos de risco imediato como "precisa de pessoa agora".
2. Empacotar várias perguntas na mesma chamada custa 545 tokens de entrada contra 435 de uma pergunta só (1,25×, não 5×) com o mesmo tempo de resposta (mediana 304 ms nos dois casos) — dá para pedir tipo, urgência e "precisa de gente" numa única chamada sem multiplicar o custo por pergunta.
3. Para decidir com números fixos (fila, tempo parado, fluxo), o motor de regras do código venceu o Jev no seu próprio conjunto de 24 casos rotulados (23/24 contra 44/120 do Jev no texto atual da pergunta) — mas escrever o limiar dentro do critério da pergunta quase dobrou o acerto do Jev (98/120, 81,7%), mostrando que a forma de perguntar pesa tanto quanto o motor.

## O que NÃO dá para afirmar

- Não medimos um modelo de linguagem grande (GPT, Claude, Gemini) na mesma tarefa nesta bateria — não existe número nosso de quanto o Jev economiza ou ganha de um LLM generalista; qualquer comparação de custo/velocidade contra "modelo grande" que apareça em material de terceiros não foi verificada por nós.
- Os casos de E1, E2, E3, E5, E6, E7 e E8 são sintéticos, escritos por quem também escreveu a régua de acerto — o mesmo autor decide o rótulo e o critério, o que favorece o próprio desenho do teste.
- O preço em dinheiro por token do Jev não está numa página oficial que encontramos (`docs.typesafe.ai` não lista pricing; `typesafe.ai/pricing` devolve 404); o valor de US$ 0,042 por milhão de tokens de entrada circula em fontes de terceiros (não-oficiais) e está marcado como ESTIMATIVA abaixo — não é fato conferido na fonte.
- Não sabemos onde fica o limite real de paralelismo do provedor (só testamos até 6, teto do nosso próprio freio) nem o que acontece acima disso.
- Não separamos, em E7, quais das 6 mensagens "cedidas" são de fato injeção bem-sucedida ou apenas ambiguidade genuína de conteúdo — o número de 85% de resistência é bruto, sem essa triagem.

## Gasto medido

- Chamadas: 1.851 (0 falhas, 0 chamadas cortadas por teto).
- Tokens de entrada somados: 881.177 (4,4% do teto de 20.000.000 desta bateria).
- Custo estimado (ESTIMATIVA, preço não-oficial de US$ 0,042 por milhão de tokens de entrada, saída gratuita segundo a mesma fonte não-oficial): aproximadamente US$ 0,037.
- Conferência de segredo: `grep -rn "apikey_" experimentos/` → vazio. Chave nunca escrita em arquivo nem impressa; qualquer cabeçalho de autorização em mensagem de erro é mascarado (`Bearer ***`).

## Recomendação de arquitetura

- **Números que o sistema já mede** (fila em metros, tempo parado em segundos, fluxo, contagem de cruzamentos) ficam no motor de regras do código — E1 mostra o código na frente do Jev no próprio conjunto de 24 casos rotulados, e mesmo na melhor variante do Jev (limiar escrito) ele não superou o motor de regras.
- **Texto livre de visitante e relato de cidadão** entram para o Jev — E2 e E8 são onde ele ganha da regra de palavras-chave ou acerta tudo; é a fronteira certa entre "conta fica no código" e "texto vai para o modelo de decisão".
- **Limiar de confiança para decidir sozinho:** os dados de E4 não sustentam um limiar isolado abaixo de 0,95 com erro sob controle (5%); o mais perto que chegamos foi confiança ≥ 0,95, erro de 6,8% no que passa direto e 26% das mensagens indo para revisão humana. Recomendação: usar 0,90 como corte prático (erro de 8,8%, 20,3% para revisão) se o custo de revisão humana for baixo, ou 0,95 se o custo do erro automatizado for mais caro que revisar mais gente — a decisão final de qual dos dois é uma escolha de negócio, não deste experimento.
- **Perguntas compostas:** juntar tipo + urgência + "precisa de pessoa" numa única chamada (E5, E8) é a forma mais barata de operar — 1,25× o custo de tokens de uma pergunta, mesmo tempo de resposta.
- **Paralelismo:** operar com até 6 chamadas simultâneas (E6) já dá vazão de ~18 chamadas por segundo sem erro; não há dado nosso sobre o que acontece acima disso.

## E9 — Comparação com um modelo grande (20/09, 00h40; amostra pequena)
Seis relatos de cidadão classificados pelo modelo grande que o time usa, chamado pela ferramenta de linha de comando (dados brutos em `e9-fable-cli-bruto.json`).

| | Modelo grande, pela ferramenta completa | Modelo de decisão |
|---|---|---|
| Acerto | 6 de 6 | 150 de 150 (E8) |
| Tempo da API | 1,0 a 1,6 s | 0,30 s |
| Tempo total da chamada | 50 a 63 s | 0,30 s |
| Tokens por decisão | 38.700 a 59.300 de contexto + 7 a 11 de saída | ~450 de entrada |
| Custo informado pela ferramenta | US$ 0,78 a 1,19 por decisão | ~US$ 0,00002 (preço NÃO oficial) |

**Leitura honesta:** o custo alto vem de chamar o agente completo, que carrega ~40 mil tokens de contexto a cada chamada; não é o preço do modelo puro. Pela API pura, com o mesmo texto, a ordem de grandeza seria de meio a um centavo de dólar por decisão (ESTIMATIVA derivada, não conferida em tabela oficial). A conclusão que se sustenta: não usar o agente grande para decisão de escolher uma opção; isso é trabalho de regra (números) ou de modelo de decisão (texto).
**Ressalvas:** 6 casos; preços não conferidos em fonte oficial; assinatura de valor fixo não cobra por chamada.

# Decisão tipada

Entre o código fixo e o modelo que escreve texto existe uma camada pequena: **perguntas fechadas com resposta tipada e probabilidade**. É o padrão que o mercado chama de "System One" (a TypeSafe vende um modelo para isso, o Jev). Aqui está a nossa versão do CONTRATO, com um motor de regras e testes.

- `decisao.ts` — os três tipos de pergunta (escolha, nota, sim ou não), a normalização, o limiar e o "não sei".
- `evento-de-transito.ts` — o contrato da triagem de evento numa câmera (fila anormal · veículo parado · contramão · nada; gravidade; chamar gente?) e o motor de regras que o responde a partir de números do leitor de vídeo.
- `decisao.test.ts` — 10 testes: `bun test decisao.test.ts`.

**O que é verdade hoje:** o contrato e o motor de regras rodam e estão testados. **O motor Jev não está ligado**: não temos chave configurada e não fizemos chamada à API; o adaptador existe só para falhar em voz alta. Quando houver chave, o mesmo contrato e os mesmos testes rodam contra ele, e aí se compara acerto, custo e tempo.

Regras que não mudam com o motor: confiança não é prova · abaixo do limiar a resposta é "não sei" e vai para uma pessoa · conta, contagem e data ficam no código · quem decide intervenção na via é gente.

## Medição com o Jev de verdade (20/09/2026, 00h06)
Chave configurada no ambiente (fora do repositório). `bun comparar.ts` e `bun comparar-texto.ts`; resultados em `comparacao-resultado.json` e `comparacao-texto-resultado.json`.

| Tarefa | Motor de regras | Jev (sem nenhum ajuste) | Leitura |
|---|---|---|---|
| Triagem de evento a partir de NÚMEROS (24 cenários rotulados; fila, tempo parado, fluxo) | 23 de 24 | 11 de 24 (7 erros, 6 "não sei") | Para limiar numérico, código ganha. É o que a própria documentação do Jev diz: conta e contagem ficam no código. |
| Triagem de TEXTO livre de visitante (18 mensagens rotuladas, 5 tipos) | 17 de 18 (palavras-chave escritas por quem viu as mensagens) | 17 de 18 | Empate no acerto, mas as palavras-chave foram feitas sob medida e quebram com texto novo; o Jev não viu nada antes. É aqui que ele encaixa. |

Jev, medido: mediana de 301 a 306 ms por decisão, 439 a 509 tokens de entrada por decisão, 42 chamadas, zero falha.
**Ressalvas:** os rótulos e as regras têm o mesmo autor (vantagem para as regras); 24 e 18 casos são amostra pequena; o preço por token não foi conferido na página oficial, então não há custo em dinheiro aqui; não medimos um modelo grande na mesma tarefa, então "quanto economiza" ainda NÃO tem número nosso.
**Decisão de arquitetura:** números → regras; texto livre (pedidos de melhoria, relatos de cidadão) → modelo de decisão, com "não sei" indo para uma pessoa.

# Decisão tipada

Entre o código fixo e o modelo que escreve texto existe uma camada pequena: **perguntas fechadas com resposta tipada e probabilidade**. É o padrão que o mercado chama de "System One" (a TypeSafe vende um modelo para isso, o Jev). Aqui está a nossa versão do CONTRATO, com um motor de regras e testes.

- `decisao.ts` — os três tipos de pergunta (escolha, nota, sim ou não), a normalização, o limiar e o "não sei".
- `evento-de-transito.ts` — o contrato da triagem de evento numa câmera (fila anormal · veículo parado · contramão · nada; gravidade; chamar gente?) e o motor de regras que o responde a partir de números do leitor de vídeo.
- `decisao.test.ts` — 10 testes: `bun test decisao.test.ts`.

**O que é verdade hoje:** o contrato e o motor de regras rodam e estão testados. **O motor Jev não está ligado**: não temos chave configurada e não fizemos chamada à API; o adaptador existe só para falhar em voz alta. Quando houver chave, o mesmo contrato e os mesmos testes rodam contra ele, e aí se compara acerto, custo e tempo.

Regras que não mudam com o motor: confiança não é prova · abaixo do limiar a resposta é "não sei" e vai para uma pessoa · conta, contagem e data ficam no código · quem decide intervenção na via é gente.

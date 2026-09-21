# Stack e Radar Tecnológico — FILTER

**Status:** canônico · atualizado em 21/09/2026

Este documento responde três perguntas:

1. o que já usamos e medimos;
2. qual ganho cada abordagem entrega;
3. quais alternativas precisam ser comparadas antes de produção.

A regra é simples: **tecnologia não entra na stack por novidade. Entra quando melhora uma tarefa medida.**

## 1. Arquitetura por tipo de problema

O FILTER não usa um único modelo para tudo.

| Tipo de tarefa | Padrão atual | Motivo |
|---|---|---|
| cálculo, contagem, limiar, data, agregação | código/regras determinísticas | exato, barato, reproduzível |
| percepção em vídeo | detector + tracker | tarefa visual especializada |
| texto livre → escolha/nota/sim-não | contrato de decisão + provider semântico | linguagem humana é variável demais para regra simples |
| explicação, pesquisa e síntese complexa | LLM generalista | exige geração e raciocínio mais aberto |
| decisão sensível/irreversível | humano | responsabilidade e contexto não são delegados |

A interface estável é o **contrato de decisão**, não o fornecedor.

Hoje o provider semântico testado é o **Jev**, da TypeSafe AI. Amanhã o mesmo contrato pode ser respondido por outro provider se ele vencer nos critérios de aceite.

## 2. O que testamos de verdade

Fonte primária dos números: `motor/decisao/experimentos/`, `comparacao-resultado.json`, `comparacao-texto-resultado.json` e `docs/ficha-tecnica-medida.json`.

### Jev / TypeSafe — REAL, testado

Bateria executada em 20/09/2026:

- **1.851 chamadas reais**;
- **881.177 tokens de entrada**;
- **0 falhas de API registradas na bateria**;
- mediana inicial observada de cerca de **301–306 ms** por decisão;
- 439–509 tokens de entrada por decisão nos primeiros testes.

Resultados relevantes:

| Tarefa | Resultado | Leitura |
|---|---:|---|
| números de trânsito, conjunto inicial | regras 23/24; Jev 11/24 sem ajuste | regra determinística é melhor para limiar conhecido |
| texto livre, lote de 400 casos sintéticos | palavras-chave 273/400; Jev 325/400 | Jev generalizou melhor que a heurística escrita à mão |
| relato de cidadão, 150 casos sintéticos | tipo 150/150 | promissor para triagem semântica; ainda falta campo real |
| risco imediato no mesmo lote | 30/30 enviados para pessoa | bom sinal para gate HITL, não prova de segurança |
| 1 pergunta vs 5 na mesma chamada | ~435 vs ~545 tokens/chamada | várias perguntas no mesmo contexto custaram ~1,25×, não 5× |
| repetição da mesma entrada | 29/30 estáveis em 10 repetições | boa estabilidade observada, não determinismo absoluto |
| mensagens com instrução maliciosa | 34/40 mantiveram a classe esperada | não usar como barreira de segurança isolada |

**Conclusão atual:** Jev fica na stack como **provider testado para decisão semântica tipada**, não como motor universal.

### Regras determinísticas — REAL, produção preferida quando aplicável

Ganhos:
- latência praticamente desprezível;
- custo marginal desprezível;
- reproduzibilidade;
- auditabilidade;
- nenhuma dependência de provider;
- comportamento diretamente testável.

Limite:
- fica frágil quando o espaço de linguagem cresce e as pessoas expressam a mesma intenção de muitas formas.

**Decisão:** se a regra pode ser escrita de forma clara a partir de números conhecidos, não chamar IA.

### LLMs grandes usados na construção — REAL, mas não benchmark equivalente

Claude foi usado extensivamente para desenvolvimento, pesquisa, síntese e construção do protótipo. Houve um experimento pequeno com agente completo para classificação, mas ele carregava dezenas de milhares de tokens de contexto e **não é comparação justa com uma API de classificação enxuta**.

Portanto, não usamos esse experimento para afirmar que Jev é X vezes melhor que Claude, GPT ou Gemini.

## 3. Qual é o ganho específico do Jev?

A TypeSafe lançou o Jev em 15/09/2026, em early access, como um modelo especializado em decisões estruturadas dentro de software. A API recebe estado + perguntas tipadas e devolve escolhas/notas/probabilidades, em vez de redigir texto livre.

No FILTER isso traz quatro ganhos potenciais:

1. **Interface limitada de propósito.** O componente não precisa escrever um parágrafo; precisa escolher, pontuar ou dizer sim/não.
2. **Probabilidade nativa.** Podemos definir abstention/HITL por limiar sem pedir ao modelo para inventar um número de confiança em texto.
3. **Baixa latência.** Nossa bateria ficou em ~300 ms de mediana; o fornecedor publica faixa de dezenas a centenas de milissegundos.
4. **Custo de entrada baixo.** Em 21/09/2026 a TypeSafe publica US$ 0,042 por milhão de tokens de entrada e saída sem cobrança separada.

O ganho **não** é maior inteligência geral. O Jev abre mão de geração livre justamente para ser uma peça menor de automação.

### Limitações atuais

- provider novo e em early access;
- dependência externa;
- ainda não testado por nós com relatos reais de produção;
- erros semânticos continuam existindo;
- confiança não é prova;
- não substitui código para matemática/limiares;
- não substitui humano em decisão sensível;
- termos, SLA, residência de dados, segurança e contrato precisam ser avaliados antes de uso institucional.

## 4. Outras opções relevantes

### A. LLM pequeno + Structured Outputs

**Exemplos de mercado:** OpenAI GPT-5.6 Luna / GPT-5 nano; Gemini Flash-Lite; Claude Haiku com ferramentas/saída estruturada.

Padrão:
- enviar texto + schema;
- receber JSON/argumentos estruturados;
- validar schema e regra de negócio.

Ganhos:
- flexibilidade maior que Jev;
- podem extrair campos e também gerar texto;
- ecossistema e fornecedores maduros;
- troca de tarefa sem treinar classificador.

Custos/riscos:
- geração autoregressiva;
- saída e raciocínio podem custar mais;
- maior liberdade semântica;
- confiança probabilística não é a mesma primitive que o Jev expõe;
- é preciso benchmarkar latência, acerto, abstention e custo no nosso contrato.

**Status FILTER:** CANDIDATO — ainda não houve benchmark apples-to-apples no mesmo conjunto.

### B. Classificador local/fine-tuned

**Exemplo:** SetFit + Sentence Transformers.

Padrão:
- acumular exemplos rotulados;
- treinar/fine-tunar um classificador pequeno;
- executar localmente.

Ganhos:
- pode rodar offline/local;
- excelente custo marginal em grande volume;
- baixa latência;
- maior soberania de dados;
- resultado mais estável depois de treinado.

Custos/riscos:
- precisa conjunto rotulado representativo;
- manutenção quando classes/domínio mudam;
- menos flexível para perguntas novas;
- treinamento/eval passa a ser responsabilidade nossa.

**Status FILTER:** CANDIDATO FORTE quando tivermos dados reais rotulados suficientes.

### C. Embeddings + classificador/nearest-neighbor

Padrão:
- gerar embedding local ou remoto;
- comparar com exemplos/classes;
- usar threshold e revisão humana.

Ganhos:
- simples;
- barato;
- bom para roteamento semântico.

Limites:
- calibração de distância não equivale automaticamente a probabilidade;
- classes muito próximas exigem bons exemplos;
- extração de múltiplas decisões fica menos natural.

**Status FILTER:** opção de baseline futuro.

### D. Regras/regex/palavras-chave

Ganhos:
- custo e latência mínimos;
- explicação perfeita;
- excelente para políticas objetivas e PII conhecido.

Limites:
- cobertura semântica ruim em linguagem livre;
- manutenção cresce com exceções.

**Status FILTER:** sempre baseline obrigatório.

## 5. O que o mercado usa hoje

Não existe um padrão único.

Há quatro padrões amplamente disponíveis em produção:

1. **código/regras** para lógica objetiva;
2. **LLMs com JSON Schema / function calling / structured outputs** para transformar linguagem em estruturas;
3. **classificadores treinados/few-shot** para alto volume e domínio estável;
4. **modelos especializados de decisão**, como Jev, uma categoria ainda nova.

OpenAI e Google documentam Structured Outputs/JSON Schema como recursos nativos; Anthropic usa ferramentas com input schema e também recomenda estruturas/enum para classificação. Hugging Face mantém SetFit como framework leve de few-shot text classification.

**Leitura de mercado do FILTER:** Jev é uma tecnologia nova e interessante, mas não é hoje um padrão dominante a ser adotado por autoridade. Nosso diferencial é conseguir testá-lo contra alternativas e trocar o provider sem refazer o produto.

## 6. Radar atual

Legenda:
- **REAL** — integrado/testado por nós;
- **CANDIDATO** — tecnologia real de mercado, ainda não benchmarkada no mesmo protocolo;
- **HISTÓRICO** — útil como aprendizado, não direção atual;
- **BLOQUEADO** — não usar antes de um gate.

| Capability | Tecnologia/provider | Estado | Uso |
|---|---|---|---|
| cálculo/limiar | TypeScript/Python | REAL | primeira escolha para números |
| visão | YOLO11n + ByteTrack + OpenCV | REAL | backend atual do protótipo; licença/alternativa em gate |
| decisão semântica tipada | TypeSafe Jev | REAL | texto livre → escolha/nota/sim-não |
| decisão semântica estruturada | GPT-5.6 Luna / GPT-5 nano | CANDIDATO | benchmark pendente |
| decisão semântica estruturada | Gemini Flash-Lite | CANDIDATO | benchmark pendente |
| decisão semântica estruturada | Claude Haiku | CANDIDATO | benchmark pendente |
| classificador local | SetFit / Sentence Transformers | CANDIDATO | ganha importância com dataset real |
| LLM grande | Claude/OpenAI/Gemini de fronteira | REAL para construção | pesquisa, síntese e problemas complexos; não default para classificação |
| decisão operacional sensível | humano | REAL | HITL obrigatório |

## 7. Próximo benchmark canônico

Não precisamos testar vinte modelos. Precisamos testar **quatro abordagens no mesmo contrato**.

Conjunto mínimo:
- relatos sintéticos existentes como regressão;
- lote novo escrito por pessoa que não criou os critérios;
- quando possível, relatos reais sanitizados e rotulados por dois humanos.

Concorrentes:
1. regras congeladas;
2. Jev;
3. um LLM pequeno com structured output;
4. um classificador local SetFit quando houver dados suficientes.

Métricas:
- acerto por classe;
- precision/recall para classe crítica;
- taxa de abstention;
- erro entre respostas automatizadas;
- latência p50/p95;
- tokens/custo;
- falhas de schema/API;
- estabilidade;
- resistência a texto adversarial;
- necessidade de egress de dados.

**Gate de adoção:** nenhum provider vira default só por ganhar acurácia. Deve cumprir simultaneamente qualidade, latência, custo, privacidade, licença/termos, estabilidade e capacidade de abstention/HITL.

## 8. Como vender isso sem hype

Não dizer:
> usamos a IA mais nova do mercado.

Dizer:
> nossa equipe mantém um radar técnico, testa novas abordagens no mesmo problema e registra onde cada uma ganha ou perde. No FILTER, regras venceram IA em decisões numéricas; um modelo especializado venceu uma heurística simples em texto livre. A arquitetura preserva essa escolha por tarefa.

O ativo é **o método de seleção**, não o nome do fornecedor.

## 9. Fontes externas verificadas em 21/09/2026

- TypeSafe — Jev/System One: https://typesafe.ai/blog/introducing-system-one-models-and-jev
- TypeSafe — página do produto/preço: https://typesafe.ai/
- OpenAI — modelos: https://developers.openai.com/api/docs/models
- OpenAI — Structured Outputs: https://developers.openai.com/api/docs/guides/structured-outputs
- Google Gemini — Structured Outputs: https://ai.google.dev/gemini-api/docs/structured-output
- Google Gemini — modelos: https://ai.google.dev/gemini-api/docs/models
- Anthropic — tool use / schemas: https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview
- Hugging Face — SetFit: https://huggingface.co/docs/setfit/

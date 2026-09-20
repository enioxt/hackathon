# Precificação — a peça que fecha a decisão (Visão de Rota, hackathon mobilidade Patos de Minas)

Gravado 19/09/2026 (America/Sao_Paulo), banca 20/09. Rede instável — gravando incrementalmente por bloco,
sem re-pesquisar o que já está em `precificacao-pesquisa.md` e `cco-modelos-outras-cidades.md` (lidos
integralmente antes de escrever este arquivo). REAL = vi na lei/contrato/tabela · CONCEPT = declarado em
fonte secundária, sem instrumento primário à vista · PHANTOM = procurei e não achei. Sem nome de pessoa
física. Sem "100%"/"único"/"garantido" como hipérbole (só como valor literal quando for opção numérica).

Status: COMPLETO — 5 blocos + resumo, gravado em blocos sucessivos nesta sessão (19/09/2026).

---

## 1. O ponto crítico — a ideia do "1 centavo"

**Resposta direta: SIM, seria desclassificada — e não por acaso, por desenho da lei.** Proposta de R$ 0,01
não é "preço baixo agressivo", é **preço simbólico**, categoria que a jurisprudência trata separado de
preço apenas-baixo.

**O dispositivo (REAL):** Lei 14.133/2021, art. 59, III — a comissão de contratação desclassifica propostas
que "apresentarem preços inexequíveis ou permanecerem acima do orçamento estimado para a contratação".
§4º do mesmo artigo cria o critério objetivo: para obras e serviços de engenharia, **presume-se inexequível
proposta abaixo de 75% do valor orçado pela Administração** — REAL, texto do dispositivo, confirmado em
{evidence_url:"https://zenite.blog.br/art-59-%C2%A7-4o-da-lei-no-14-133-2021-tcu-confirma-tratar-se-de-presuncao-relativa-de-inexequibilidade/", data:"consulta 2026-09-19"}. Para **serviços que não são de engenharia** (é o nosso caso —
software/analítico), a lei não repete o percentual numérico, mas a **mesma lógica do art. 59 III se aplica**:
preço inexequível é desclassificado independente do percentual, e o percentual da engenharia é usado por
analogia noutros setores — doutrina de Marçal Justen Filho e jurisprudência do TCU confirmam que a regra do
critério objetivo (equivalente ao antigo art. 48, §1º da Lei 8.666/93, 70% do orçado) "pode aplicar-se a
todos os setores e objetos" — REAL — {evidence_url:"https://zenite.blog.br/em-razao-da-literalidade-do-%C2%A7-1o-do-art-48-da-lei-no-8-66693-e-possivel-aplicar-o-criterio-nele-previsto-se-a-licitacao-for-processada-pelo-tipo-tecnica-e-preco/"}.

**A antiga Lei 8.666/93 (art. 48, II, §1º, alíneas a/b — revogada, mas jurisprudência formadora):** critério
objetivo = inexequível o que fica abaixo de 70% do valor orçado OU abaixo de 70% da média aritmética das
demais propostas — REAL, Súmula 262/TCU — {evidence_url:"https://www.cnj.jus.br/sumula-262-tcu/"}.

**O ponto que decide o caso do R$ 0,01 — presunção RELATIVA vira ABSOLUTA em preço simbólico:** a regra geral
(70%/75% do orçado) é **presunção relativa** — o licitante pode ser chamado a comprovar exequibilidade antes
da desclassificação (é poder-dever da Administração, não faculdade — Acórdão 2378/2024-Plenário TCU, Rel.
Min. Benjamin Zymler; reafirmado no Acórdão 214/2025-Plenário) — REAL —
{evidence_url:"https://aresresponde.com.br/a-desclassificacao-de-propostas-por-preco-inexequivel-e-o-entendimento-do-tcu/"}. **Mas o próprio TCU abre uma exceção nomeada: quando o lance/proposta é "preço simbólico,
irrisório ou de valor zero", a presunção deixa de ser relativa e passa a ser ABSOLUTA** — dispensa
diligência, dispensa contraditório, a exclusão é direta, inclusive durante a fase de lances de pregão
eletrônico (art. 21, §4º, IN Seges/ME 73/2022) — REAL —
{evidence_url:"https://www.gera-consultoria.com/blog/5-decisoes-tcu-inexequibilidade-proteja-proposta"}. **R$ 0,01 pelo
desenvolvimento inteiro de um sistema cai exatamente nessa exceção — é preço simbólico por definição, não
"proposta agressiva que merece chance de provar", e a desclassificação não exige nem que o pregoeiro
pergunte antes.**

**O risco de "jogo de planilha" / preço predatório (REAL — é o nome técnico do problema, não hipérbole):**
o TCU trata "jogo de planilha" como a manobra de zerar/subcotar um item para vencer no preço global,
recuperando a margem depois via aditivo, reequilíbrio ou item não competido — é fiscalização histórica do
Tribunal em obras e replicada em TIC (Acórdão 3706/2024-1ªCâmara, NAV Brasil: exigência de critério de
aceitabilidade de **preço unitário**, não só global, para impedir exatamente essa manobra em serviços de TI)
— REAL — {evidence_url:"https://jmlgrupo.com.br/blog/jurisprudencia-comentada-lei-das-estatais-servicos-de-tic-preco-global-ausencia-de-criterios-de-aceitabilidade-de-precos-unitarios-irregularidade/"}. Cobrar R$0,01 pelo
desenvolvimento para "recuperar depois com investimento" é a versão civil do mesmo problema: se o investimento
não vier (e não há garantia contratual de que virá), o contratado fica descumprindo objeto por preço que
sabia, desde o início, ser insustentável — dolo de má-fé contratual, com risco de rescisão, inidoneidade
(art. 156 Lei 14.133/2021) e, em casos graves, enquadramento como fraude à licitação (art. 337-F Código
Penal, incluído pela Lei 14.133/2021).

**Rotas legítimas que produzem o MESMO efeito pretendido (entrar barato, ganhar espaço, escalar depois) —
sem inexequibilidade:**

| Rota | O que exige | Prazo típico | Risco | Cabe pra time recém-formado? |
|---|---|---|---|---|
| **(a) Dispensa por valor** — Lei 14.133 art.75,II, ≤ R$ 65.492,11 (2026, Decreto 12.807/2025) | Preço real e sustentável dentro do teto; sem concorrente, sem edital, contratação direta | Semanas (é o caminho mais rápido do quadro) | Teto baixo pra hardware+licença+consultoria juntos numa cidade média; serve bem pro **diagnóstico** ou **piloto enxuto** | SIM — é a rota mais acessível, exatamente o tipo de contrato que cabe começar |
| **(b) CPSI por inexigibilidade** — LC 182/2021 art.13-14 | Chamamento público (não é licitação de menor preço — critério é a solução inovadora); teto federal R$1,6mi teste (12+12m) e R$8mi fornecimento (24+24m); em MG, teto estadual de reembolso R$200 mil, 6+6m (Lei 23.793/2021) | Meses (depende do MUNICÍPIO abrir o processo — não é "assinar amanhã") | Menor risco jurídico de todos, mas exige o poder público topar formalizar o instrumento — Patos de Minas não tem regulamento municipal de CPSI confirmado nesta pesquisa (UNVERIFIED) | SIM, mas depende do município querer — bom argumento pra fase 2 |
| **(c) Licenciar o produto, cobrar só implantação+operação** | Preço de desenvolvimento fica FORA do preço público — o "caro" (R$264 mil) é amortizado no licenciamento entre várias cidades, não cobrado de uma só vez | Imediato — é decisão de modelo de negócio, não jurídica | Nenhum risco de inexequibilidade porque o preço cobrado É o preço real do serviço prestado (implantação+operação), não do ativo todo | SIM — é a rota mais limpa e a que este documento recomenda como eixo central (ver bloco 4) |
| **(d) Patrocínio/fomento** — emenda parlamentar, FAPEMIG, BNDES, banco de desenvolvimento | Projeto de fomento aprovado, contrapartida institucional, prestação de contas do fomento (não do preço de mercado) | Meses a 1 ano (edital de fomento tem calendário próprio) | Depende de calendário externo, não controlável pelo time; não gera receita imediata | Parcialmente — bom para financiar o desenvolvimento em paralelo, não para vender ao município |
| **(e) Termo de cooperação sem repasse financeiro** | Contrapartida declarada (ex.: dado gerado vira caso de uso público, cidade cede acesso às câmeras) — MROSC (Lei 13.019/2014) se envolver Consep/OSCIP | Semanas | Não gera caixa — só serve para provar o produto (é o "diagnóstico gratuito" do bloco 4, formalizado) | SIM — é o jeito certo de fazer "grátis no começo" sem virar preço público inexequível |

**Leitura para a banca:** o "1 centavo" nasce de confundir DUAS coisas que a lei separa — o preço de um
CONTRATO PÚBLICO (que tem que ser exequível, sob pena de nulidade/inidoneidade) e uma ESTRATÉGIA DE
INVESTIMENTO (queimar caixa pra ganhar mercado, que é legítima em venture-backed startup, mas com dinheiro
de investidor, nunca embutida no preço declarado a um órgão público). As rotas (a)-(e) entregam o mesmo
objetivo estratégico sem pisar nessa linha.

---

## 2. O que estamos vendendo, de fato

**PRODUTO** (o que o time construiu e replica sem custo marginal de desenvolvimento):
- Leitura de câmeras já existentes: contagem por tipo de veículo/pedestre, fluxo, formação de fila,
  detecção de quase-acidente (padrão de frenagem brusca/conflito de trajetória), comparação antes×depois de
  uma intervenção de trânsito, painel de indicadores, exportação de relatório.
- É software rodando sobre hardware de borda (edge, sem mandar vídeo bruto pra nuvem — ver âncora Jetson na
  pesquisa-mãe) — o ativo que se REPLICA em qualquer cidade nova a custo marginal baixo.

**SERVIÇO** (o que tem custo recorrente, por cidade, e não escala sozinho):
- Implantação (configurar o ponto, calibrar a câmera/ângulo, validar contra contagem manual de referência).
- Interpretação — o relatório mensal com leitura humana do que os números significam pro gestor de trânsito
  (é a parte que justifica a hora técnica de R$120-185/h da pesquisa-mãe).
- Suporte/ajuste contínuo conforme a cidade muda o trânsito (obra, semáforo novo, evento).

**O QUE NÃO ESTAMOS VENDENDO — e é preciso dizer isso com todas as letras:**
- Um centro de controle completo (CCO/COR) — a sala física, os operadores 24h, a integração com PM/SAMU/
  Defesa Civil, a governança multi-órgão.
- Obra, câmera nova, semáforo, qualquer hardware de captação (a cidade já tem as câmeras — é o diferencial
  competitivo citado na pesquisa-mãe: outras soluções cobram R$5-7 mil/câmera de captação, nós não).
- Operação de segurança pública 24h — não é o nosso produto, é o produto do Estado (PM) ou de quem vencer
  uma concessão tipo Smart Sampa.

**Por que "vender um centro de controle inteiro" é armadilha (não é falta de ambição, é leitura de risco):**
1. **Exige equipe 24h** — os únicos casos de CCO municipal único encontrados na pesquisa de outras cidades
   (Uberlândia, Vitória, São José dos Campos) são cidades **2-5x maiores que Patos** (700 mil, 365 mil,
   740 mil habitantes vs. 160 mil) e nenhum foi montado por um time recém-formado — foram financiados por
   BNDES/BID com R$55-98 milhões de implantação (`cco-modelos-outras-cidades.md`, seção B4/B8/B3). Não é
   escala de hackathon nem de primeiro contrato.
2. **Responsabilidade sobre segurança pública** — um CCO que vigia crime/acidente grave assume risco jurídico
   e reputacional que o produto (leitura de trânsito) não carrega. Se um evento grave passar sem detecção
   dentro de um "centro de controle" com a marca do time, a responsabilidade sobe de "bug de software" para
   "falha de serviço público essencial".
3. **Integração com PM e SAMU** — nenhum caso pesquisado documentou essa integração sendo feita por fusão de
   estruturas pré-existentes com economia medida (é o "buraco mais importante" apontado na seção D.5 da
   pesquisa de outras cidades) — ou seja, nem as cidades grandes sabem quantificar isso ainda. Prometer
   entregar o que ninguém no Brasil documentou como funcionando é vender risco, não produto.

**A régua prática:** o produto lê e informa; a decisão operacional (o que a PM/SAMU faz com a informação)
continua sendo do órgão. Isso não é limitação — é o que torna o preço defensável dentro do teto de dispensa
e fora do escopo de responsabilidade de segurança pública.

---

## 3. O mercado — quem já faz e por quanto

**Âncora nova mais forte desta rodada — StreetLogic Pro (EUA), preço PÚBLICO por hora de vídeo processado,
concorrente direto de Miovision:** serviço `countCLOUD` cobra por hora de vídeo enviado, com desconto por
volume — REAL, tabela publicada — {evidence_url:"https://www.streetlogic.pro/products/countcloud", data:"consulta 2026-09-19"}:

| Faixa (horas de vídeo/ano) | Preço |
|---|---|
| 1-25h | US$ 23/h → R$ 118,22/h |
| 26-100h | US$ 18/h → R$ 92,52/h |
| 101-250h | US$ 14/h → R$ 71,96/h |
| 251-500h | US$ 11/h → R$ 56,54/h |
| 501-1.000h | US$ 9/h → R$ 46,26/h |
| 1.001-1.500h | US$ 8/h → R$ 41,12/h |
| 1.501h+ | US$ 7/h → R$ 35,98/h |

(conversão própria a R$5,14/US$, cotação 18/09/2026 já usada na pesquisa-mãe). Entrega em até 3 dias úteis,
precisão declarada 95-98%, classificação em 2/3/13 categorias (motos/carros/ônibus/caminhão/pedestre/ciclista
conforme o nível). **Esta é a âncora internacional mais comparável ao nosso "diagnóstico" do bloco 4** —
mesmo modelo de entrega (envia vídeo, recebe contagem processada), preço por hora, não por câmera/mês.

**Miovision** (líder do setor, já detalhado na pesquisa-mãe): não publica preço; comparação de terceiro
(StreetLogic Pro) afirma cobrar mais caro por dado equivalente, sem tabela numérica capturada nesta busca —
CONCEPT — {evidence_url:"https://www.streetlogic.pro/blogs/trafficengineeringandmore/a-transparent-price-and-performance-comparison"}.
Âncora REAL já registrada na pesquisa-mãe: hardware R$58.596/interseção + R$427/interseção/mês de
manutenção/analítico (Pima County, AZ).

**Numina e VivaCity** (concorrentes diretos de posicionamento — contagem multimodal sem PII, câmera/sensor
próprio): nenhum dos dois publica preço; comparável de mercado citado por terceiro (Placer.ai, analytics de
localização para governo, categoria adjacente) fica em **US$8.000-27.000/ano por contrato municipal** →
R$41.120-138.780/ano — CONCEPT, não é o mesmo produto (Placer.ai é analytics de visitação/comércio, não
trânsito), mas dá ordem de grandeza do que prefeitura paga por analytics SaaS de médio porte —
{evidence_url:"https://civiciq.com/blog/placer-ai-government-contracts-how-cities-and-counties-use-location-analytics-in-2026"}.

**Brasil — dois achados relevantes de posicionamento nacional, sem preço público:**
- **ContaVias** — contagem de tráfego por vídeo com IA, modelo "envie o vídeo, receba o resultado em 48h",
  cobrança "pague só pelo que precisa" (por demanda/projeto, não mensalidade fixa) — REAL a existência e o
  modelo de cobrança por demanda, PHANTOM o valor — {evidence_url:"https://contavias.com.br/"}. **É o
  concorrente brasileiro mais parecido com o nosso "diagnóstico"** (bloco 4, oferta i) — mesmo modelo de
  entrega que o StreetLogic Pro americano.
- **AWFlux** — contagem em rodovias e vias urbanas, classifica carro/moto/ônibus/caminhão, relatórios
  periódicos (diário/semanal/mensal) em Excel/PDF — REAL a existência, PHANTOM o preço —
  {evidence_url:"https://awflux.com.br/contagem-de-veiculos/"}.
- **Leitura:** nenhuma das duas concorrentes brasileiras publica preço — reforça o achado já registrado na
  pesquisa-mãe (bloco 4 de lá): essa categoria ainda não tem tabela pública no Brasil, o que é vantagem de
  posicionamento (compramos comparação internacional, não brasileira) e também risco (comprador vai
  achar "caro" sem ter contra o que comparar, exceto o que trouxermos).

**Onde ficamos — comparação direta:**
- Contra o **analítico genérico internacional** (R$15-77/câmera/mês, pesquisa-mãe bloco 3): estamos na mesma
  faixa ou abaixo, dependendo do volume de câmeras (ver bloco 4).
- Contra o **StreetLogic Pro** (R$36-118/hora processada, achado desta rodada): nosso diagnóstico de 1 hora
  (bloco 4, oferta i) precisa ficar competitivo com essa faixa OU justificar o prêmio pela camada de
  interpretação humana que eles não vendem junto.
- Contra **Miovision** (R$427/interseção/mês + R$58.596/interseção de hardware): somos **estruturalmente
  mais baratos**, porque não cobramos hardware de captura (a cidade já tem a câmera) — essa é a frase de
  diferenciação mais forte que este documento encontrou (ver bloco 5).
- Contra os **grandes contratos de CCO/videomonitoramento** (Smart Sampa R$460/câmera/mês, SJC R$640,
  Joinville R$564-teto): estamos **numa categoria diferente**, não concorrente — eles vendem câmera+rede+
  operação 24h+segurança, nós vendemos leitura de trânsito sobre câmera já existente. Comparar preço direto
  seria como comparar o preço de uma consultoria de dados com o de uma concessionária de infraestrutura.

---

## 4. A tabela de preço sugerida

**Números-base do simulador do time (CONCEPT — declarado internamente, não é preço de mercado):**
desenvolvimento R$264.000 (1.760h × R$150, 6 módulos) · equipamento R$62.100 · operação R$66.900/ano ·
licenças R$36.000/ano · segunda cidade R$165.000 · piloto de 90 dias R$49.375.

### (i) Diagnóstico — 1 hora de vídeo + relatório

- **Escopo:** cliente manda 1h de gravação de 1 câmera já existente; devolvemos contagem classificada
  (tipo de veículo/pedestre, fluxo, fila) + relatório com os achados. Sem instalação, sem hardware, sem
  visita.
- **Preço sugerido:** **R$ 300-500** (pacote fechado, não por hora de trabalho nosso).
  Referência de mercado: StreetLogic Pro cobra US$23/h (R$118) na faixa de entrada só pelo processamento —
  nosso preço cobre processamento + a camada de interpretação (que eles vendem à parte). Faixa 3-4x acima
  do custo de processamento puro é justificável porque o produto certo aqui não é o dado bruto, é a
  DECISÃO facilitada — "o que fazer com isso" junto no relatório.
- **Prazo:** 3-5 dias úteis (StreetLogic entrega em 3 — não faz sentido ser mais lento que o concorrente
  internacional nessa oferta).
- **Rota jurídica:** nenhuma — é abaixo de qualquer teto de dispensa, pode ser contratado como prestação de
  serviço avulsa/nota fiscal simples, ou oferecido de graça como isca (rota (e) do bloco 1) na 1ª vez.
- **O que a cidade recebe:** prova de conceito com dado real do próprio cruzamento dela, sem risco, sem
  processo licitatório — é o "sim fácil" que abre a porta para a oferta (ii).
- **Conta:** custo marginal (processamento em GPU já paga, sem hora de deslocamento) ≈ R$0 incremental além
  do já amortizado; margem quase total é atenção de time (1-2h de trabalho humano). Não paga o
  desenvolvimento sozinho — função é **funil**, não receita.

### (ii) Piloto de 90 dias — 1 corredor

- **Escopo:** 1 a 3 câmeras de um corredor, hardware de borda instalado (Jetson ou PC com GPU, conforme
  âncora da pesquisa-mãe), painel + relatório mensal (3 relatórios) + comparação antes×depois no fim.
- **Preço sugerido:** **R$ 45.000-60.000** total pelos 90 dias — ancorado no próprio número do simulador
  (R$49.375, CONCEPT) e coerente com a faixa de dispensa.
- **Prazo:** 90 dias corridos, entrega parcelada (mensal).
- **Rota jurídica:** **dispensa por valor, Lei 14.133 art.75,II** — cabe folgado dentro do teto de
  **R$65.492,11** (2026), inclusive com margem para eventual aditivo de escopo. É a rota mais rápida do
  quadro, sem edital, sem concorrente.
- **O que a cidade recebe:** medição real do corredor escolhido, com antes×depois — o argumento que sustenta
  qualquer decisão de ampliar depois (virar assinatura ou CPSI).
- **Conta:** hardware R$7.500-15.000 (1 unidade Jetson, amortizável — reaproveita em outra cidade depois) +
  operação/interpretação ~R$15.000 (3 meses de hora técnica, faixa R$120-185/h × ~30-40h no total) + margem.
  Contra o custo de desenvolvimento (R$264 mil): **1 piloto não paga nem 25% do desenvolvimento** — é
  esperado, o piloto vende o produto, não amortiza o ativo (ver item "quanto tempo até se pagar" abaixo).

### (iii) Assinatura por câmera lida/mês

- **Escopo:** leitura recorrente, sem prazo fixo, faixas por volume (mesma lógica do StreetLogic Pro —
  desconto por volume).

| Faixa (câmeras) | Preço sugerido/câmera/mês | Total/mês (ponto médio da faixa) |
|---|---|---|
| 1-10 | R$ 120 | R$ 660-1.200 |
| 11-30 | R$ 90 | R$ 1.800-2.700 |
| 31-60 | R$ 65 | R$ 2.925-3.900 |
| 61+ | R$ 45 | negociado |

- **Posicionamento do preço:** acima do analítico genérico internacional de entrada (R$15,42/câmera/mês) e
  abaixo do Miovision (R$427/interseção/mês, mas ele inclui hardware dedicado que nós não cobramos) — fica
  no meio-alto da faixa internacional genérica (R$15-77) porque agrega classificação+fila+quase-acidente,
  não só contagem simples.
- **Rota jurídica:** contrato anual dentro da dispensa (R$65.492,11/ano ÷ 12 ≈ R$5.457/mês de teto — cabe até
  ~60 câmeras na faixa mais barata, ou ~45 câmeras na faixa intermediária) OU licitação ordinária/pregão
  acima disso, OU CPSI se ainda em fase de validação de escala.
- **O que a cidade recebe:** monitoramento contínuo, sem precisar recontratar a cada ponto novo.
- **Conta:** manutenção/licença (R$36.000/ano do simulador) + operação (R$66.900/ano) = R$102.900/ano de
  custo fixo, dividido pelo número de câmeras contratadas — com **30 câmeras na faixa intermediária** (R$90),
  receita anual = R$32.400 (só 30 câmeras, sem contar as faixas menores simultâneas) — **não fecha sozinho
  com poucas câmeras**; o modelo só se sustenta a partir de uma base mínima de câmeras OU somado à
  assinatura de outras cidades (ver oferta iv).

### (iv) Licença para outra cidade — produto replicado

- **Escopo:** mesmo produto, implantado numa cidade nova, sem repetir o desenvolvimento de R$264 mil.
- **Preço sugerido:** ancorado no próprio número do simulador — **R$ 165.000** (CONCEPT, número do time) para
  a segunda cidade, cobrindo adaptação (câmeras diferentes, calibração local) + implantação + primeiro ano de
  operação/licença.
- **Prazo:** 60-90 dias de implantação.
- **Rota jurídica:** dispensa (se couber no teto de cada componente separado) ou CPSI de fornecimento
  subsequente (já validado na 1ª cidade) — aqui a rota (b) do bloco 1 fica mais forte, porque o "teste"
  já foi feito alhures.
- **O que a cidade recebe:** produto já validado, com histórico de outra prefeitura como referência.
- **A conta que sustenta a frase da banca (bloco 5):** desenvolvimento (R$264 mil, gasto 1x) ÷ preço da
  segunda cidade (R$165 mil) → **a segunda cidade já custa 62% do que custou construir o produto pela
  primeira vez** — e da terceira cidade em diante, o custo tende a cair mais (adaptação já testada 2x),
  mesmo sem termos, nesta pesquisa, um número de "terceira cidade" declarado (é PHANTOM/CONCEPT — não
  simulado ainda pelo time).

### Quanto tempo até o desenvolvimento (R$264.000) se pagar — conta somada

| Cenário | Receita acumulada | Meses até cobrir R$264.000 |
|---|---|---|
| Só diagnósticos (R$400 cada, 1/semana) | R$1.600/mês | ~165 meses — **não é o caminho, é funil** |
| 1 piloto (R$50 mil) + assinatura 30 câm. (R$2.700/mês) | R$50.000 + R$2.700/mês | ~79 meses só de assinatura após o piloto — **lento sozinho** |
| 1 piloto + 2 licenças de outra cidade (R$165 mil cada) | R$50.000 + R$330.000 = R$380.000 | **coberto no ano 1**, com 2 cidades além da piloto |

**Leitura sem hipérbole:** o produto só se paga rápido pela via de REPLICAÇÃO (oferta iv), não pela via de
assinatura recorrente isolada numa cidade só — é o argumento numérico por trás da frase do bloco 5.

### Cláusula de êxito (opcional, para as ofertas ii/iii/iv)

- Regra: só se aplica com **linha de base assinada ANTES** do início do serviço (medição do "antes", 15-30
  dias, sem cobrança de êxito ainda) — sem isso, cobra-se por hora/pacote fixo, nunca por êxito.
- Faixa sugerida: **10-25% sobre o ganho mensurado** (redução de tempo de fila, redução de acidente
  registrado, aumento de fluxo) — ancorado na doutrina interna já registrada no kernel EGOS (camada 3 de
  precificação por êxito) e não em achado de mercado desta pesquisa (CONCEPT, não REAL — não achei caso
  público brasileiro de cláusula de êxito em contrato de trânsito municipal para comparar).
- Formato: piso (custo operacional mínimo) + êxito, pago na medição periódica (ex.: trimestral), nunca
  antecipado.

---

## 5. Como falar isso na banca, em 30 segundos

**Roteiro (30s, ler em voz alta para calibrar o tempo):**

> "O preço que estamos mostrando é uma **sugestão fundamentada**, não uma proposta comercial — é um
> hackathon, não uma licitação. Pra cidade testar sem risco, a rota jurídica certa é a **dispensa por valor**
> da Lei 14.133 — cabe um piloto de 90 dias dentro do teto de R$65 mil, sem edital. Se a cidade quiser algo
> maior depois, o caminho formal é o **CPSI**, feito pra exatamente esse tipo de solução inovadora. E a
> conta que sustenta o modelo é simples: **o caro é fazer existir uma vez — o desenvolvimento custou
> R$264 mil. A partir da segunda cidade, esse custo cai para uma fração**, porque o produto já está pronto,
> só se adapta. Não estamos vendendo um centro de controle, estamos vendendo a leitura das câmeras que a
> cidade já tem."

**A frase pronta (a que fixa o diferencial, para usar isolada se o tempo apertar):**

> "O caro é fazer existir uma vez. A partir da segunda cidade, o custo cai para uma fração do que custou
> construir da primeira vez — de R$264 mil para R$165 mil, e tende a cair mais."

---

## 🕳️ O que ficou de fora (universo declarado)

Aplicando o método atomizar→destilar→recompor ao PEDIDO INTEIRO (5 itens), não só ao que coube neste
arquivo:

- **PNCP não respondeu** nesta pesquisa nem na anterior (ECONNRESET nas duas tentativas) — não localizei
  nenhum contrato municipal brasileiro específico de "contagem de tráfego por vídeo" com preço/câmera
  discriminado em cidade de porte 50-500 mil habitantes; a categoria segue sem preço público padronizado no
  Brasil (mesmo achado da pesquisa-mãe, confirmado nesta rodada).
- **Não confirmei se Patos de Minas tem regulamento municipal de CPSI** — sem isso, a rota (b) do bloco 1
  depende de o município criar o instrumento primeiro; não é "assinar amanhã".
- **Preço de Numina/VivaCity/ContaVias/AWFlux é PHANTOM** — nenhuma das quatro concorrentes diretas (a mais
  parecida com nosso produto) publica tabela; usei Placer.ai (categoria adjacente, não trânsito) e
  StreetLogic Pro (concorrente indireto, mas com tabela pública) como âncora substituta — é aproximação, não
  medição direta do nosso nicho exato.
- **Não simulei o preço da "terceira cidade em diante"** — só temos o número da segunda (R$165 mil,
  CONCEPT, do próprio simulador do time); a frase da banca ("cai para uma fração") é sustentada pela
  segunda cidade custando 62% do desenvolvimento original, não por uma curva de custo decrescente medida
  em 3+ pontos — é extrapolação razoável, não fato provado.
- **A cláusula de êxito (bloco 4) não tem comparável de mercado brasileiro em trânsito municipal** — é
  desenho baseado em doutrina interna, não em achado desta pesquisa; se a banca perguntar "quem mais faz
  isso", a resposta honesta é "não achamos caso público para comparar, é proposta nossa".
- **Não pesquisei custo de Plano de Mobilidade Urbana (PlanMob) por porte de cidade** — ficou fora do
  escopo priorizado também na pesquisa-mãe; seria bloco extra se a banca perguntar sobre isso.
- **Este documento não cobre a análise jurídica completa da rescisão/inidoneidade** (art. 156 Lei
  14.133/2021) nem do tipo penal do art. 337-F do Código Penal citados no bloco 1 — foram citados como
  consequência possível, não detalhados com jurisprudência própria; se a banca aprofundar nisso, é limite
  declarado desta pesquisa.

---

## Resumo (até 20 linhas)

1. **R$0,01 seria desclassificado.** Lei 14.133 art.59,III + jurisprudência TCU: preço simbólico/irrisório/
   zero gera presunção **absoluta** de inexequibilidade (ao contrário do preço só-baixo, que é presunção
   relativa e exige diligência) — exclusão direta, sem contraditório.
2. Risco extra do "1 centavo": configura "jogo de planilha"/preço predatório — pode virar rescisão,
   inidoneidade (art.156) e, em tese, fraude à licitação (art.337-F CP).
3. **5 rotas legítimas para o mesmo efeito** (entrar barato, escalar depois): dispensa por valor
   (≤R$65.492,11), CPSI por inexigibilidade (teto MG R$200 mil/6+6m), licenciar e cobrar só
   implantação+operação (recomendada como eixo), fomento (FAPEMIG/BNDES), cooperação sem repasse.
4. **O que vendemos:** leitura de câmera existente (produto) + implantação/interpretação (serviço). **O que
   não vendemos:** CCO completo, obra, câmera nova, operação de segurança 24h — isso é escala 2-5x maior
   que Patos, sem caso público de fusão de estruturas com economia medida.
5. **Mercado:** StreetLogic Pro (EUA) cobra US$7-23/hora processada (R$36-118) — âncora nova mais forte
   desta rodada. Miovision R$427/interseção/mês + R$58.596 hardware — somos mais baratos porque não
   cobramos câmera. ContaVias/AWFlux (Brasil) não publicam preço.
6. **4 ofertas:** (i) diagnóstico R$300-500/1h — funil, não receita; (ii) piloto 90 dias R$45-60 mil —
   cabe na dispensa; (iii) assinatura R$45-120/câmera/mês por faixa; (iv) licença 2ª cidade R$165 mil —
   62% do custo de desenvolvimento original.
7. **Só a via de replicação (iv) paga o desenvolvimento (R$264 mil) no ano 1** — assinatura isolada numa
   só cidade levaria ~79 meses.
8. **Frase para a banca:** "o caro é fazer existir uma vez; da segunda cidade em diante, o custo cai para
   uma fração" — apresentado como sugestão fundamentada, nunca proposta comercial.
9. **Maior lacuna:** nenhuma concorrente direta (Numina/VivaCity/ContaVias/AWFlux) publica preço — nossa
   comparação usa âncoras adjacentes (Placer.ai, StreetLogic Pro), não o nicho exato.
10. Regulamento municipal de CPSI em Patos de Minas: não confirmado — checar antes de prometer essa rota
    como imediata.
** | Contrapartida declarada (ex.: dado gerado vira caso de uso público, cidade cede acesso às câmeras) — MROSC (Lei 13.019/2014) se envolver Consep/OSCIP | Semanas | Não gera caixa — só serve para provar o produto (é o "diagnóstico gratuito" do bloco 4, formalizado) | SIM — é o jeito certo de fazer "grátis no começo" sem virar preço público inexequível |

**Leitura para a banca:** o "1 centavo" nasce de confundir DUAS coisas que a lei separa — o preço de um
CONTRATO PÚBLICO (que tem que ser exequível, sob pena de nulidade/inidoneidade) e uma ESTRATÉGIA DE
INVESTIMENTO (queimar caixa pra ganhar mercado, que é legítima em venture-backed startup, mas com dinheiro
de investidor, nunca embutida no preço declarado a um órgão público). As rotas (a)-(e) entregam o mesmo
objetivo estratégico sem pisar nessa linha.

---

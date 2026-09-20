# Referência de mercado — testando a estimativa de R$ 264.000 (1.760h × R$150/h)

> RASCUNHO EM CONSTRUÇÃO — gravado a cada 10min para não perder trabalho. Status no topo.
> Última gravação: início da pesquisa, 2026-09-19.

## STATUS ATUAL: COMPLETO — todas as seções preenchidas, 22 buscas web + 1 fetch feitas.

## 0. O que estou testando

Estimativa entregue (digitada à mão, sem fonte): sistema municipal de contagem de trânsito por
leitura de câmeras existentes, 6 módulos, **1.760 horas × R$ 150/h = R$ 264.000**.

Preciso: (a) extrair as horas por módulo do simulador, (b) achar de onde veio a faixa R$120–185/h
citada na própria peça, (c) pesquisar valor-hora público/privado no Brasil, (d) pesquisar esforço
de módulos comparáveis, (e) pesquisar contratos públicos parecidos, (f) montar tabela veredito.

## 1. Horas por módulo — extraídas de `cco/simulador.html` (REAL, li o arquivo)

Campos default (`value=` no HTML), linhas 102-108 de `simulador.html`:

| Campo | Módulo | Horas (default) |
|---|---|---|
| `devLeitura` | Leitura de vídeo e contagem | 480 |
| `devPainel` | Painel do gestor | 320 |
| `devApp` | App do cidadão | 400 |
| `devInt` | Integrações e APIs | 240 |
| `devTeste` | Testes e validação em campo | 200 |
| `devDoc` | Documentação e treinamento | 120 |
| **Total** | | **1.760** |

`devVH` (valor-hora) = R$150 default, com nota no próprio input: "faixa defensável da pesquisa:
R$ 120 a 185/h" (linha 102). 1.760 × 150 = **R$ 264.000** — bate exatamente com a estimativa a testar.
{claim:"1760h total = soma dos 6 campos do simulador", evidence_url:"file:///home/enio/.egos/hackathon/cco/simulador.html#L102-L108", trecho:"value=\"480\"...value=\"320\"...value=\"400\"...value=\"240\"...value=\"200\"...value=\"120\""} — REAL, li o arquivo.

Escopo de cada módulo (para julgar se a hora é plausível), de `cco/arquitetura.html` e
`3-equipe/REGRAS-E-ACEITE-MVP.md` — ver §5 abaixo onde cruzo com achados externos.

## 2. De onde veio a faixa R$120–185/h — achado em `precificacao-pesquisa.md` (REAL, li o arquivo)

**Importante: essa faixa NÃO é preço de hora de programador/desenvolvedor de software.** É uma
estimativa de **hora técnica de ENGENHARIA/CONSULTORIA** (DNIT/DER-ES), usada no documento interno
como piso para não vender "consultoria que interpreta o dado" abaixo do que o próprio governo
reconhece. Linhas 73-79 e 137 de `precificacao-pesquisa.md`:

- R$120,62/h: hora técnica DNIT com encargos sociais 84,04%, jornada 176h/mês, **referência de 2017**
  citada em decisão do TCU sobre uso do SINAPI — REAL como método, DESATUALIZADO como preço 2026.
  {evidence_url:"https://zenite.blog.br/tcu-confira-decisao-sobre-a-utilizacao-do-sinapi-como-referencial-de-precos/"}
- R$183,83/h: Engenheiro Sênior SINAPI (mesma fonte, mesma nota).
- R$120-135/h: **cálculo PRÓPRIO não publicado** do documento interno, aplicando salário-base do
  Engenheiro Auxiliar (R$11.659,91/mês, Acordo Coletivo SENGE-ES/SINAENCO-ES 2025/26, tabela
  DNIT-DER-ES jan/2026) ÷ 176h e multiplicando por um fator de encargos de ~1,8-2,0x "usado
  historicamente" — **isso é uma extrapolação do próprio time do hackathon, não um número
  publicado por fonte externa**. {evidence_url:"https://der.es.gov.br/Media/der/Documentos/Tabela%20Referencial%20de%20Pre%C3%A7o/Referencial%20de%20Rodovias/2026/17_Nota%20de%20Uso%20do%20Referencial%20Consultoria%20JAN-26.pdf", trecho:"salário-base do Engenheiro Auxiliar = R$ 11.659,91/mês"}

**Conclusão parcial:** a faixa R$120-185/h que o simulador chama de "defensável" mistura (a) um
número real mas de 2017 e (b) uma conta interna não publicada, e é sobre hora de ENGENHEIRO/CONSULTOR
de infraestrutura — não sobre hora de programador que escreve pipeline de visão computacional, app
mobile e painel web. Isso não invalida a faixa, mas ela precisa de reforço com dado de mercado de
TI/software (seções 3-4 abaixo) antes de sustentar R$150/h para 1.760h de **desenvolvimento de
software**.

## 3. Valor-hora em contratação pública (PNCP, TCU, estatais) — 5 achados

Universo: 12 buscas web feitas visando valor-hora/PF em fábrica-de-software pública; a maioria dos
editais (PRODAM-SP, PGDF, Procempa, Orlândia) usa **UST (Unidade de Serviço Técnico)** ou
**Ponto de Função** e não publica um R$/hora "solto" no corpo indexado pela busca — os anexos com
tabela de preço estariam nos PDFs completos (não abertos individualmente por limite de tempo).
5 de 5 pedidos entraram (nenhum descartado, mas 2 são método/2017 e não preço-2026 vigente):

| # | Fonte | Órgão | Ano | Unidade | Valor | Classe | Link |
|---|---|---|---|---|---|---|---|
| 1 | Decisão TCU sobre SINAPI (via Zenite) | DNIT (método hora técnica c/ encargos 84,04%, 176h/mês) | **2017** | R$/hora | R$120,62/h (Consultor comum) · R$176,15/h (Consultor Especial) | REAL, desatualizado | zenite.blog.br/tcu-confira-decisao-sinapi |
| 2 | Mesma decisão TCU/Zenite | SINAPI | 2017 | R$/hora | R$183,83/h (Engenheiro Sênior) | REAL, desatualizado | idem |
| 3 | Nota Técnica de Uso do Referencial de Consultoria, jan/2026 | DER-ES (base tabela DNIT) | 2026 | R$/mês (salário-base) | R$11.659,91/mês Eng. Auxiliar · R$3.350,96/mês Técnico | REAL | der.es.gov.br .../17_Nota%20de%20Uso%20do%20Referencial%20Consultoria%20JAN-26.pdf |
| 4 | Ata de Registro de Preços corporativa (achada via lawinsider, processo 0127.2020.CCPLE-VII) | governo estadual não-identificado no snippet | ~2020-2022 | R$/Ponto de Função e R$/hora | Elicitação/Dev/Manutenção: **R$427,39/PF** (fornecedor Sudoeste Informática) e, em outra linha da mesma família de atas, **R$287,74/PF**; **Operação Assistida: R$54,00/hora** | REAL (achado indireto, não abri o PDF original — ANCORAR COM CUIDADO) | lawinsider.com/pt/contracts/7M56X5JS9vI |
| 5 | Edital PE 10.002/2025 (v5, 26/01/2026) | PRODAM-SP | 2025/2026 | horas por lote (sem R$ publicado no trecho indexado) | 140.000 horas técnicas/lote, 2 lotes, medição em UST | REAL o volume-em-horas; PHANTOM o R$/hora (não localizado sem abrir PDF completo) | portal.prodam.sp.gov.br/.../pe-10002-2025-fabrica-software-v5 |

**Leitura:** não existe, nos itens acima, um R$/hora de DESENVOLVIMENTO DE SOFTWARE público e vigente
em 2025/2026 equivalente ao que se busca — os únicos R$/hora "puros" achados são de **engenharia
civil/consultoria de infraestrutura** (itens 1-2, e datados de 2017) ou de **operação assistida**
(item 4, R$54/h, papel de suporte, não de dev). A métrica dominante no setor público de TI é
PF/UST, não hora — e o R$/PF varia 2,3x entre as duas linhas achadas da mesma família de atas
(R$287,74 a R$427,39), o que já mostra que "o" preço de PF não existe como número único (achado
consistente com o que a própria FATTO/consultoria de mercado afirma — ver §4).

## 4. Valor-hora / salário mercado privado — 3+ referências

| Fonte | Ano | Valor/salário mensal | Valor/hora implícito (÷176h) | Multiplicador p/ preço de venda | Classe | Link |
|---|---|---|---|---|---|---|
| Glassdoor.com.br (655 salários autoenviados) | 2026 | Desenvolvedor Pleno: média ~R$7.033-8.855/ano — **inconsistência da própria página**: valores rotulados "por ano" e "por mês" se repetem idênticos (R$10.271-10.697) para "Sênior Full Stack" — usar com ressalva | Pleno ~R$40/h · Sênior ~R$60/h (estimativa própria a partir do dado, não publicada pela fonte) | não informado pela fonte | REAL o dado bruto, CONCEPT a conversão | glassdoor.com.br/Salários/... |
| Indeed (br.indeed.com) | set/2026 | Desenvolvedor de Software: média R$6.865/mês | ~R$39/h | não informado | REAL | br.indeed.com/career/desenvolvedor-de-software/salaries |
| SINDPD — Salário Normativo (CCT 2026) | 2026 | Piso Administrativo R$1.800/mês · Digitador R$2.250/mês (30h/sem) | não aplicável — **não é piso de desenvolvedor**, é piso de categoria genérica de TI (administrativo/digitação) | — | REAL mas **não aplicável ao cargo de dev** — descartado como referência de valor-hora de programação | sindpd.org.br/salario-normativo |
| Upwork (página oficial de contratação) | 2026 | — | US$35-200/h para "computer vision engineer" (mediana de mercado internacional não informada; AI/ML geral tende a US$100+/h) | plataforma já é preço-de-venda | REAL (página do próprio marketplace) | upwork.com/hire/computer-vision-engineers |
| Toptal | 2026 | — | US$60-150/h pago ao dev; US$100-220+/h cobrado do cliente (markup 60-100%) | markup já embutido | CONCEPT (agregadores terceiros, não o próprio Toptal, citam a faixa) | toptal.com/computer-vision |

**Salário ≠ preço de hora vendida — o multiplicador usual:** não achei fonte brasileira específica
publicada que declare "X vezes o salário" como preço de hora vendida no setor de TI nacional; é
prática difundida no mercado de consultoria (2-3x o custo do salário carregado é citado
informalmente em material de gestão de projetos/agências), mas **não tenho uma fonte primária
citável para esse multiplicador neste levantamento — UNVERIFIED**. Uso só como checagem de ordem de
grandeza abaixo (§8), não como prova.

**Achado que chama atenção:** salário-hora de um Sênior BR (~R$60/h, Glassdoor/Indeed) × um
multiplicador comercial típico não-verificado de 2-3x cai em **R$120-183/h** — territorialmente
igual à própria faixa "defensável" que a pesquisa interna já havia calculado por outra via (hora
técnica de engenharia, §2). É uma coincidência de ORDEM DE GRANDEZA entre dois métodos
independentes (engenharia civil carregada vs. salário de dev × multiplicador de mercado não
verificado) — reforça a faixa, mas nenhum dos dois lados é, sozinho, uma fonte pública robusta e
específica de "preço de hora de desenvolvedor de software" no Brasil em 2026.

## 5. Esforço por módulo comparável — o que é raro e mole, como avisado

| Módulo nosso | Horas nossas | Achado externo | Horas declaradas na fonte | Classificação | Link |
|---|---|---|---|---|---|
| App do cidadão (~10 telas) | 400h | Blog técnico de dev freelancer (Tiago Gouvêa), estimativa por prática pessoal | "300 e 400 horas" para app simples React Native/Flutter + publicação Google Play, +15-50h para Apple → **total ~315-450h** | CONCEPT (relato de 1 profissional, não auditado, mas com número concreto e metodologia explicada) | tiagogouvea.com.br/profissional/quanto-custa-desenvolver-um-aplicativo |
| App do cidadão (comparação de custo, não horas) | 400h | Agence Consultoria (agência, material de venda) | "App médio" 10-20 telas = R$100-300 mil, "App simples" 5-10 telas = R$50-100 mil (caso citado: 10 semanas, ~R$75 mil) | CONCEPT (agência vendendo, sem abrir a régua de horas) | agence.com.br/pt/blog/quanto-custa-desenvolver-aplicativo |
| Leitura de vídeo e contagem (pipeline CV) | 480h | Nenhuma fonte com horas/custo de projeto real encontrada — só papers acadêmicos (YOLO+SORT/ByteTrack) e repos open-source (GitHub) sem instrumentação de esforço declarado | — | **PHANTOM para horas** — nenhuma referência achada com esforço declarado; a taxa de acurácia (~90%) e o custo-benefício (B/C ≥1,54 vs. contagem manual) aparecem em paper acadêmico, mas não o esforço de implantação | pmc.ncbi.nlm.nih.gov/articles/PMC10381655 |
| Painel do gestor (dashboard web+mapa) | 320h | Nenhuma fonte com horas de projeto real; só material genérico de ferramentas de BI prontas (Wrike/Artia/FlowUp), que são SaaS, não desenvolvimento sob medida | — | **PHANTOM para horas** | — |
| Integrações e APIs | 240h | Nenhuma fonte encontrada | — | **PHANTOM** | — |
| Testes e validação em campo | 200h | Nenhuma fonte encontrada | — | **PHANTOM** | — |
| Documentação e treinamento | 120h | Nenhuma fonte encontrada | — | **PHANTOM** | — |

**Honestidade sobre a busca:** de 6 módulos, só 1 (app do cidadão) tem referência externa com
horas explícitas — e é CONCEPT (blog de um profissional), não um estudo auditado. Os outros 5
módulos (1.360h de 1.760h, ou seja **77% do total em horas**) não têm referência pública de esforço
localizável em busca aberta neste tempo — o que é esperado: estimativa de horas por módulo de
projeto de software raramente é publicada (é dado interno de orçamento), como avisado no pedido.

## 6. Contratos públicos de sistemas parecidos — nenhum comparável direto achado

| Sistema | Órgão | Valor total | Escopo | Ano | Classe | Link |
|---|---|---|---|---|---|---|
| Sistema de monitoramento (câmeras + reconhecimento facial + inteligência municipal) | Prefeitura de Ribeirão Preto/SP | **>R$180 milhões** | Monitoramento de vias públicas, reconhecimento facial, combate à criminalidade e vandalismo — **inclui hardware/infra de câmeras nas ruas + rede + central**, não é "ler câmera já existente" | Licitação aberta fev/2026 | REAL (mas escopo MUITO maior — infraestrutura completa de videomonitoramento urbano, não módulo de contagem sobre câmera existente) | cbnribeirao.com.br/prefeitura-de-ribeirao-preto-sp-abre-licitacao-de-r-180-milhoes... |
| Semáforos inteligentes + câmeras (parceria privada, não licitação de software) | São José dos Pinhais/PR + Grupo Pumatronix | Não informado | Redução de 31% no congestionamento em 2 cruzamentos, fluxo de 7.500-9.000 veículos/dia | 2025 | REAL o resultado, PHANTOM o valor do contrato (não publicado na fonte) | prnewswire.com/br/.../sao-jose-dos-pinhais... |
| Videomonitoramento + CFTV + LPR | Prefeitura de Taquarituba/SP | Não localizado no trecho indexado | Câmeras LPR (placas), monitoramento veicular tempo real | Pregão 007/2022 | REAL o escopo, PHANTOM o valor | taquarituba.sp.gov.br/licitacao/download/1550 |

**Leitura:** não achei nenhum contrato público brasileiro que isole "software de contagem de
trânsito por câmera já existente" como objeto único e publique o valor. O único valor grande achado
(Ribeirão Preto, R$180 milhões) é de ORDEM DE GRANDEZA muito maior e escopo muito mais amplo
(infraestrutura completa de vigilância urbana + reconhecimento facial), não serve como comparador
direto do nosso R$264 mil — serve só para mostrar que projetos de "câmera + IA + prefeitura" no
Brasil variam de dezenas de milhares (piloto de software) a centenas de milhões (infraestrutura
urbana completa), e o nosso caso está no extremo baixo dessa escala porque não inclui hardware nem
rede — só o software sobre câmera que já existe.

## 7. Tabela veredito por módulo

| Módulo | Nossas horas | Faixa de referência (mín-máx) | Fonte | Veredito |
|---|---|---|---|---|
| Leitura de vídeo e contagem | 480h | sem referência de horas confiável (só ordem de grandeza qualitativa: é o módulo tecnicamente mais arriscado do projeto — visão computacional com câmeras heterogêneas não calibradas) | §5, PHANTOM | **sem referência — não dá para confirmar nem refutar** |
| Painel do gestor | 320h | sem referência de horas | §5, PHANTOM | **sem referência** |
| App do cidadão (~10 telas) | 400h | 315-450h (Tiago Gouvêa, CONCEPT) | §5 | **dentro da faixa** |
| Integrações e APIs | 240h | sem referência de horas | §5, PHANTOM | **sem referência** |
| Testes e validação em campo | 200h | sem referência de horas | §5, PHANTOM | **sem referência** |
| Documentação e treinamento | 120h | sem referência de horas | §5, PHANTOM | **sem referência** |
| **Total** | **1.760h** | — | — | 1 de 6 módulos confirmado dentro de faixa externa; 5 de 6 sem referência pública localizável |

## 8. Intervalo total recalculado (nunca um número só)

**Sobre horas:** só 400h de 1.760h (23%) têm comparador externo confirmando plausibilidade; os
outros 1.360h (77%) não têm como ser confirmados NEM refutados com fonte aberta neste levantamento
— ficam como "estrutura plausível, não verificada".

**Sobre valor-hora**, cruzando §3 e §4 (nenhuma fonte pública brasileira de 2025/2026 dá um R$/hora
de DESENVOLVEDOR DE SOFTWARE limpo — as âncoras disponíveis são hora de engenharia civil carregada
(R$120,62-183,83/h, majoritariamente de 2017) e salário de dev × multiplicador comercial não
verificado (~R$120-183/h)):

- **Piso conservador** (salário bruto de dev pleno/sênior sem carga nem margem, só para ver o
  chão): R$40-60/h → 1.760h × R$40-60 = **R$70.400 a R$105.600**. Este piso SUBESTIMA porque não
  inclui encargos, ferramental, gestão de projeto nem margem — é o custo de folha nu, não preço de
  venda de serviço.
- **Faixa "defensável" já usada no simulador** (R$120-185/h, §2-§3-§4 convergindo por métodos
  diferentes): 1.760h × R$120 a R$185 = **R$211.200 a R$325.600**.
- **R$264.000 (a estimativa a testar, R$150/h)** cai DENTRO da faixa defensável, próximo do centro
  (R$150 está a 30/65 = 46% do caminho entre 120 e 185) — nem no piso nem no teto.

**Intervalo final recomendado para o pitch: R$211.200 a R$325.600**, com R$264.000 como ponto
central plausível — **não um número único**, porque 77% das horas por módulo e o R$/hora de
desenvolvedor de software brasileiro em 2026 (distinto de engenharia civil) não têm fonte pública
direta e específica confirmando o centro exato.

## 9. Três frases para o slide

1. **R$264 mil (1.760h × R$150/h) cai dentro da faixa defensável de R$211-326 mil**, cruzando hora
   técnica de engenharia pública (R$120-184/h, DNIT/SINAPI) com salário de desenvolvedor sênior
   brasileiro vezes o multiplicador comercial usual do setor.
2. De 6 módulos do projeto, só o app do cidadão (400h) tem comparador público explícito e bate
   dentro da faixa (315-450h, mercado de apps ~10 telas); os outros 5 módulos (77% das horas) não
   têm fonte aberta de esforço — são estimativa técnica interna, não número de mercado auditável.
3. Não existe, no Brasil, contrato público que isole "leitura de câmera existente para contar
   trânsito" com valor publicado — o único comparável de grande porte achado (Ribeirão Preto,
   R$180 milhões) é infraestrutura completa de vigilância urbana, ordem de grandeza incomparável ao
   nosso escopo de software puro sobre câmera já instalada.

## 10. O que NÃO deu para confirmar

- R$/hora oficial de PRODAM-SP, PGDF ou Procempa para "fábrica de software" (os anexos com tabela
  de preço não foram abertos individualmente por limite de tempo desta pesquisa).
- Esforço em horas de qualquer um dos 5 módulos além do app (leitura de vídeo, painel, integrações,
  testes, documentação) — nenhuma fonte pública encontrada com número de horas declarado para
  escopo comparável.
- O multiplicador "salário × N = preço de hora vendida" no mercado de TI brasileiro — usado aqui
  como checagem de ordem de grandeza, **não como prova** (UNVERIFIED).
- Um contrato público brasileiro que isole exatamente "contagem de tráfego por vídeo sobre câmera
  já existente" com valor publicado (existem contratos de CFTV/LPR e de infraestrutura completa de
  monitoramento, mas nenhum no escopo estrito do nosso projeto).
- Câmbio USD→BRL do dia (as faixas Upwork/Toptal foram mantidas em USD porque não converti sem
  medir a cotação neste turno — evitar número inventado).
- O valor exato por PF (R$287,74 e R$427,39) veio de um agregador terceiro (lawinsider), não do
  PDF oficial da ata — não abri o documento original para confirmar o órgão contratante exato.

## 11. Tuplas de evidência

- {claim:"1.760h total = soma dos 6 campos padrão do simulador (480+320+400+240+200+120)", evidence_url:"file:///home/enio/.egos/hackathon/cco/simulador.html#L102-L108", trecho:"value=\"480\"...value=\"320\"...value=\"400\"...value=\"240\"...value=\"200\"...value=\"120\""}
- {claim:"a faixa R$120-185/h do simulador veio de hora técnica de engenharia DNIT/SINAPI (2017) + estimativa própria não publicada sobre salário DER-ES 2026", evidence_url:"file:///home/enio/.egos/hackathon/3-equipe/pesquisa/precificacao-pesquisa.md#L73-L79", trecho:"faixa **R$ 120-185/hora** (carregada)"}
- {claim:"hora técnica DNIT com encargos 84,04% = R$120,62/h, referência 2017", evidence_url:"https://zenite.blog.br/tcu-confira-decisao-sobre-a-utilizacao-do-sinapi-como-referencial-de-precos/", trecho:"hora técnica com encargos sociais (84,04%) e jornada de 176h/mês"}
- {claim:"salário-base Engenheiro Auxiliar DER-ES jan/2026 = R$11.659,91/mês", evidence_url:"https://der.es.gov.br/Media/der/Documentos/Tabela%20Referencial%20de%20Pre%C3%A7o/Referencial%20de%20Rodovias/2026/17_Nota%20de%20Uso%20do%20Referencial%20Consultoria%20JAN-26.pdf", trecho:"Engenheiro Auxiliar = R$ 11.659,91/mês"}
- {claim:"ata de registro de preços cota Elicitação/Dev/Manutenção por Ponto de Função a R$427,39, Operação Assistida a R$54,00/hora", evidence_url:"https://lawinsider.com/pt/contracts/7M56X5JS9vI", trecho:"Sudoeste Informática ... R$ 427,39 por Ponto de Função ... Treinamento cotado por Hora"}
- {claim:"PRODAM-SP PE 10.002/2025 licita 140.000 horas técnicas por lote, 2 lotes, medição em UST", evidence_url:"https://portal.prodam.sp.gov.br/documents/d/guest/pe-10002-2025-fabrica-software-v5-26-01-2026-pdf", trecho:"140.000 horas de serviços técnicos em cada lote"}
- {claim:"Upwork cobra US$35-200/h para computer vision engineer", evidence_url:"https://www.upwork.com/hire/computer-vision-engineers/", trecho:"$35-$200 per hour"}
- {claim:"Toptal CV developer recebe US$60-150/h, cliente paga US$100-220+/h com markup 60-100%", evidence_url:"https://www.toptal.com/computer-vision", trecho:"usually start at $60 per hour and can go up to $150 per hour"}
- {claim:"app React Native/Flutter simples leva 300-400h + 15-50h publicação Apple", evidence_url:"https://www.tiagogouvea.com.br/profissional/quanto-custa-desenvolver-um-aplicativo/", trecho:"entre 300 e 400 horas no desenvolvimento e publicação no Google Play"}
- {claim:"App médio (10-20 telas) custa R$100-300 mil; app simples (5-10 telas) R$50-100 mil, caso citado 10 semanas ~R$75 mil", evidence_url:"https://agence.com.br/pt/blog/quanto-custa-desenvolver-aplicativo", trecho:"App médio (R$ 100.000 a R$ 300.000) tem entre 10 e 20 telas"}
- {claim:"Prefeitura de Ribeirão Preto abriu licitação de mais de R$180 milhões para sistema de monitoramento com câmeras e reconhecimento facial, fev/2026", evidence_url:"https://cbnribeirao.com.br/prefeitura-de-ribeirao-preto-sp-abre-licitacao-de-r-180-milhoes-para-sistema-de-monitoramento/", trecho:"licitação de R$ 180 milhões para sistema de monitoramento"}
- {claim:"desenvolvedor de software média R$6.865/mês no Brasil, set/2026", evidence_url:"https://br.indeed.com/career/desenvolvedor-de-software/salaries", trecho:"R$ 6.865 por mês"}
- {claim:"SINDPD piso normativo 2026: Administrativo R$1.800/mês, Digitador R$2.250/mês", evidence_url:"https://sindpd.org.br/salario-normativo/", trecho:"salário normativo para Administrativo é de R$ 1.800,00"}
- UNVERIFIED: multiplicador "2-3x salário = preço de hora vendida" no mercado brasileiro de TI — não achei fonte primária brasileira específica citável.
- UNVERIFIED: cotação USD→BRL usada para comparar Upwork/Toptal com a faixa em reais — não convertida neste turno.

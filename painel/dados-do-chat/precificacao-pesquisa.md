# Pesquisa de preço — videomonitoramento/contagem de tráfego para prefeituras (fonte aberta)

Data da pesquisa: 19/09/2026 (America/Sao_Paulo). Objetivo: âncoras REAIS de preço para precificar um
serviço de hackathon (Patos de Minas/MG) que lê câmeras JÁ existentes da cidade para contar trânsito
(tipo, fluxo, fila, quase-acidente), sem rosto/placa, com painel + medição antes/depois + consultoria.

Método: WebSearch/WebFetch, classificação REAL/CONCEPT/PHANTOM por item, tupla `{claim, evidence_url, data}`.
Sem âncora → `UNVERIFIED:`. Rede instável no início da sessão — gravando incrementalmente.

---

## 1. Limites legais 2026 (formato da venda)

**Dispensa de licitação — Lei 14.133/2021 art. 75, I e II — Decreto nº 12.807/2025 (DOU 30/12/2025, vigente desde 01/01/2026, reajuste IPCA-E 4,41%, revoga Decreto 12.343/2024):**
- Art. 75, I (obras e serviços de engenharia): R$ 130.984,20 — REAL — {claim:"teto dispensa obras/engenharia 2026", evidence_url:"https://elicitacao.com.br/2026/01/15/valores-de-licitacao-em-2026/", data:"2026-01-15"}
- Art. 75, II (demais serviços e compras — é aqui que um piloto de software/consultoria cai): R$ 65.492,11 — REAL — {claim:"teto dispensa compras/serviços 2026", evidence_url:"https://elicitacao.com.br/2026/01/15/valores-de-licitacao-em-2026/", data:"2026-01-15"} — confirmado também em {evidence_url:"https://www.abase.com.br/12706/institucional/novos-valores-para-licitacoes-entram-em-vigor-em-2026/"}
- §3º (consórcio público / autarquia-fundação-agência-executiva): dobra os limites — R$ 261.968,40 (I) e R$ 130.984,22 (II) — REAL, mesma fonte.
- Serviços técnicos especializados de natureza predominantemente intelectual (art. 37 §2º): R$ 392.952,63 — REAL, mesma fonte — relevante para a "consultoria/diagnóstico" separada da parte de software.
- Contrato verbal / pronto pagamento (art. 95 §2º): R$ 13.098,41 — REAL, mesma fonte.
- Grande vulto (art. 6º XXII, referência de escala, não se aplica aqui): R$ 261.968.421,04.
- **Leitura para o hackathon:** um piloto de 90 dias cabe em dispensa por valor do art. 75, II **se o preço total ficar ≤ R$ 65.492,11** — é a rota mais rápida e sem edital, mas o valor é baixo para hardware+licença+consultoria juntos numa cidade média. Acima disso, licitação ordinária (pregão/concorrência) ou CPSI.

**Contrato Público de Solução Inovadora (CPSI) — LC 182/2021 (Marco Legal das Startups), art. 13-14:**
- Teto do CPSI (fase de teste): **R$ 1.600.000,00** por contrato — REAL — {claim:"teto CPSI R$1,6mi", evidence_url:"https://www.gov.br/agu/pt-br/assuntos-1/labori/manual-do-contrato-publico-para-solucao-inovadora.pdf", data:"consulta 2026-09-19"}; editais podem fixar teto menor.
- Prazo do CPSI: até 12 meses, prorrogável por +12 meses (24 no total) — REAL, mesma fonte.
- Contrato de fornecimento subsequente (se a solução for aprovada nos testes): **até R$ 8.000.000,00**, vigência até 24 meses prorrogável por +24 (até 48 no total) — REAL, mesma fonte.
- Remuneração: reembolso de custos + remuneração fixa de incentivo (ou proporcional ao cronograma físico-financeiro em caso de risco tecnológico) — REAL.
- Quem pode contratar: pessoa física OU jurídica, isolada ou em consórcio (art. 13) — REAL — **não exige enquadramento formal como "startup" no texto localizado**; UNVERIFIED se há exigência adicional em regulamento municipal específico de Patos de Minas (não encontrado regulamento local nesta pesquisa).
- **Leitura para o hackathon:** CPSI é o caminho correto para "testar a solução na cidade por 90 dias e, se funcionar, virar contrato maior" — banca o piloto até R$1,6mi (folga enorme sobre o que um MVP custa) e já prevê upgrade contratual pós-validação (até R$8mi) sem nova licitação do zero. Exige, porém, que o MUNICÍPIO abra um processo de CPSI (desafio público), o que não é imediato — não é "assinar amanhã". Para os primeiros 90 dias reais, dispensa por valor (art.75,II, ≤R$65.492,11) ou uma doação/teste-gratuito negociado é mais rápido; CPSI serve para formalizar a fase 2.

## 2. Contratos públicos brasileiros — coisa parecida

**Grandes contratos de videomonitoramento/fiscalização (referência de teto, não de porte de hackathon):**
- Joinville (SC) — pregão de videomonitoramento com IA/reconhecimento facial, até 8 mil câmeras: proposta vencedora **R$ 119.740.000,00** (teto do edital ~R$122mi) — REAL — {evidence_url:"https://www.joinville.sc.gov.br/noticias/prefeitura-abre-propostas-do-edital-para-contratacao-de-videomonitoramento-com-cameras-com-reconhecimento-facial-e-recursos-de-inteligencia-artificial/", data:"consulta 2026-09-19"}. Não achei prazo contratual discriminado nesta busca → UNVERIFIED prazo.
- Campo Grande (MS) — radares+câmeras+central de monitoramento, **R$ 50,2 milhões / 24 meses** (inclui hardware, link de telecom, mobiliário, manutenção) — REAL — {evidence_url:"https://www.campograndenews.com.br/cidades/capital/prefeitura-abre-licitacao-de-r-50-milhoes-para-ampliar-fiscalizacao-de-transito", data:"2025 (proposta até 27/05/2025)"}. = R$ 2.091.666/mês (escopo inclui hardware, não é só software/mês) → cálculo próprio, não publicado.
- Goiás (estado) — videomonitoramento com IA, Pregão Eletrônico 193/2024, **R$ 34.999.980,00 / 60 meses** = R$ 583.333/mês — REAL — {evidence_url:"https://goias.gov.br/governo/videomonitoramento-com-inteligencia-artificial/", data:"2024"}. Contagem de câmeras não localizada nesta busca → UNVERIFIED preço/câmera.
- São Paulo (Smart Sampa) — pregão para 20.000 câmeras + plataforma: melhor proposta **R$ 9,2 milhões/mês** — REAL — {evidence_url:"https://prefeitura.sp.gov.br/w/noticia/smart-sampa-pregao-eletronico-para-contratacao-de-20-mil-cameras-de-monitoramento-e-agendado-para-23-de-maio", data:"consulta 2026-09-19"}. **Cálculo próprio: R$9,2mi / 20.000 câmeras = R$ 460/câmera/mês** (inclui câmera física + rede + plataforma — não é só o analítico; usar como TETO superior, não como preço de licença de software).
- São Paulo (FMDT/fiscalização automática + dados de tráfego) — contrato assinado 31/01/2024, **R$ 14.091.285,67**, vigência até 28/02/2029 (~61 meses) = R$ 231.000/mês — REAL — {evidence_url:"https://prefeitura.sp.gov.br/web/mobilidade/w/participacao_social/fundos/348460", data:"2024"}.
- Vila Nova do Sul (RS) — pregão eletrônico SRP para materiais de sistema de videomonitoramento (aquisição de equipamento, não SaaS de analítico) — REAL, existência do edital; valor não extraído nesta busca → UNVERIFIED.
- Cáceres (MT) — registro de preços para fornecimento+instalação de câmeras (múltiplos itens), propostas entre **R$ 283 mil e R$ 540 mil** — REAL — {evidence_url:"https://amm.diariomunicipal.org/publicacao/187320/"}. Sem discriminação por câmera → UNVERIFIED unitário.
- Macaé (RJ) — locação de 60 câmeras IP Bullet Full HD com manutenção preventiva: **R$ 5.977,50/câmera** (valor unitário total do contrato, não mensal — não ficou claro no trecho se é preço total ou anualizado) — REAL mas ambíguo → UNVERIFIED periodicidade — {evidence_url:"https://transparencia.cmmacae.rj.gov.br/arquivos_download/licitacao/306/876"}.

**Cidades de porte médio (50-500 mil hab) — busca específica não encontrou contrato de "contagem classificatória por vídeo" com preço discriminado.** As referências de contagem de tráfego (DAER-RS, DNIT, Fratar, DBA Tecnologia, Alkes Engenharia) são metodológicas/institucionais, sem R$ público — PHANTOM para preço, REAL para metodologia. PNCP não foi consultado ainda nesta busca (ver nota de instabilidade); pendente tentativa com 1 chamada/~5s.

## 3. Preço de analítico de vídeo por câmera/mês

**Cotação usada: USD/BRL = R$ 5,14 (fechamento 18/09/2026)** — REAL — {evidence_url:"https://www.infomoney.com.br/mercados/dolar-hoje-abertura-fechamento-comercial-turismo-18092026/", data:"2026-09-18"}.

**Internacional (SaaS de analítico de vídeo, add-on sobre câmera já existente):**
- Analytics add-on genérico sobre VMS já instalado: **US$ 3–15/câmera/mês** → **R$ 15,42 – R$ 77,10/câmera/mês** — REAL (consenso de múltiplas fontes do setor) — {evidence_url:"https://www.wavestore.com/post/ai-video-analytics-roi-cost-per-camera-payback-2026", data:"consulta 2026-09-19"}; {evidence_url:"https://surveillant.ai/guides/ai-video-analytics-cost"}. People/traffic counting costuma ser um TIER superior dentro dessa faixa, não a base.
- Retenção de vídeo em nuvem (custo separado, não é o analítico): 7-30 dias ≈ US$2,99/câmera/mês; 90+ dias de alta resolução ≈ US$20-25/câmera/mês — REAL, mesma fonte Wavestore/Surveillant. **Não se aplica ao nosso caso se o processamento roda on-premise/edge e só o dado agregado (contagem) sai da câmera** — reduz custo de nuvem a quase zero (achado estratégico: diferencial de custo vs. concorrente cloud-first).
- Silarius Cloud (VSaaS full-platform): a partir de **US$ 100/mês** por conta, escala com câmeras — REAL — {evidence_url:"https://silarius.com/blogs/posts-without-blog-1/vsaas-pricing-guide-2026"}.

**Miovision (líder de mercado em contagem/detecção de tráfego por câmera, América do Norte) — âncora mais próxima do nosso produto:**
- Hardware/instalação: **US$ 11.400/interseção** (Pima County, AZ, documento de compra pública) → **R$ 58.596/interseção** — REAL — {evidence_url:"https://content.civicplus.com/api/assets/e362d996-745a-4881-8a3e-ed51a554d9cc", data:"consulta 2026-09-19"}.
- Manutenção de dados/analítico anual: **US$ 998/interseção/ano** → **R$ 5.130/interseção/ano ≈ R$ 427/interseção/mês** → **REAL, âncora de referência direta para "quanto vale o analítico de tráfego por ponto/mês"**, mesma fonte.
- Escala real medida: 103 interseções = US$1,17mi de instalação (US$11.400×103) + US$102.794/ano de serviço — REAL, mesma fonte.
- Miovision não publica preço no site; a fonte confiável é contrato público (ex.: Spring Hill, TN 2023, citado por concorrente StreetLogic Pro, não verificado em 1ª mão nesta pesquisa) → UNVERIFIED esse contrato específico.
- Numina e Viva City (concorrentes diretos do nosso produto — contagem sem PII, câmera já existente): **sem preço público encontrado — PHANTOM para preço**, modelo enterprise sob consulta.

**Leitura para o hackathon:** a âncora mais defensável para "quanto cobrar pelo analítico, por câmera/mês, num piloto" é a faixa **R$ 15 a R$ 80/câmera/mês** (analítico genérico) com o **ponto mais próximo do nosso caso em ~R$ 427/interseção/mês (Miovision, contagem/tráfego dedicado, não genérico de segurança)** — cidade pequena/média com 10-30 câmeras de trânsito relevantes ficaria entre R$ 150-2.400/mês só de analítico recorrente, valor que cabe folgado dentro do teto de dispensa (art.75,II, R$65.492,11) se for um contrato anual (R$1.800-28.800/ano).

## 4. Substituto que a prefeitura compra hoje

**Contagem manual/com equipamento por ponto — sem preço de tabela público nacional; é sob orçamento (Fratar, Alkes Engenharia, DBA Tecnologia) — CONCEPT/PHANTOM para preço, REAL para a existência do serviço e método:**
- DNIT/DAER-RS: contagem medida em dias de levantamento no local, 3 ou 7 dias, 16h ou 24h/dia — REAL (metodologia) — {evidence_url:"https://daer.rs.gov.br/upload/arquivos/201607/27144051-instrucoes-de-servico-para-estudo-de-trafego.pdf"}.
- DNIT/GOINFRA: "Contagem de Tráfego" só passou a ter linha própria no Relatório de Composição de Custos a partir de 2017 (antes não existia item orçamentário próprio) — REAL, achado relevante: mostra que o mercado tradicional só formalizou preço desse serviço recentemente, sinal de categoria ainda pouco padronizada em preço.
- Sem valor de mercado público por ponto/dia encontrado nesta busca → **UNVERIFIED: preço/ponto/dia da contagem manual tradicional.** Isso é, por si, um argumento de venda: não há tabela pública de referência, o comprador tende a negociar caso a caso — nosso serviço por câmera/mês é mais barato de justificar por comparação com Miovision/analítico internacional (bloco 3) do que com a contagem manual brasileira (sem âncora).

**Plano de mobilidade municipal / estudo de tráfego por porte — não coletado nesta pesquisa (seria bloco extra); marcar como pendência.**
- UNVERIFIED: custo de Plano de Mobilidade Urbana (PlanMob) por porte de cidade — não pesquisado nesta rodada (ficou fora do escopo priorizado 1-7; ver bloco 🕳️ no resumo).

## 5. Hora técnica de consultoria (tabela pública)

**Tabela de Preços de Consultoria do DNIT (metodologia FGV, atualizada 28/08/2025, mês-base julho/2024 para a estrutura de custos):**
- Categorias por nível: Consultor Especial, Técnico Especial/Sênior/Pleno/Júnior/Auxiliar, "P4 - Engenheiro/Profissional Auxiliar" — REAL (estrutura) — {evidence_url:"https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/custos-referenciais/engenharia-consultiva-2/tabela-de-precos-de-consultoria-1", data:"consulta 2026-09-19"}.
- Referência histórica (2017, citada em decisão do TCU, NÃO é valor 2026 — usar só como método de cálculo): hora técnica com encargos sociais DNIT (84,04%) e jornada de 176h/mês = **R$ 120,62/hora**; salário de Consultor Especial R$16.845,61 → R$176,15/hora; Engenheiro Sênior SINAPI R$183,83/hora (mais conservador) — REAL mas DESATUALIZADO → UNVERIFIED como preço 2026, REAL como método — {evidence_url:"https://zenite.blog.br/tcu-confira-decisao-sobre-a-utilizacao-do-sinapi-como-referencial-de-precos/"}.
- **Valor 2025/2026 mais próximo encontrado (DER-ES, nota técnica de referencial de consultoria, janeiro/2026, baseada na tabela DNIT):** salário-base do **Engenheiro Auxiliar = R$ 11.659,91/mês** (piso do Acordo Coletivo 2025/2026 SENGE-ES/SINAENCO-ES) e **Técnico = R$ 3.350,96/mês** (piso Acordo Coletivo 2024/2025 SINTEC-ES/SINAENCO-ES) — REAL — {evidence_url:"https://der.es.gov.br/Media/der/Documentos/Tabela%20Referencial%20de%20Pre%C3%A7o/Referencial%20de%20Rodovias/2026/17_Nota%20de%20Uso%20do%20Referencial%20Consultoria%20JAN-26.pdf", data:"2026-01"}. **Cálculo próprio (não publicado):** R$11.659,91/176h = R$66,25/hora de salário-base bruto (SEM encargos/BDI — aplicando o mesmo fator histórico de ~1,8-2,0x usado no cálculo do TCU 2017, a hora plenamente carregada do Engenheiro Auxiliar em 2026 fica em torno de **R$ 120-135/hora** — estimativa própria, não publicada, rotular como tal).
- **Leitura para o hackathon:** para a parte de "diagnóstico/consultoria que interpreta o dado", uma hora técnica de engenheiro pleno/sênior em tabela pública de referência de infraestrutura fica na faixa **R$ 120-185/hora** (carregada) — serve de piso para não vender a consultoria abaixo do que o próprio governo reconhece como custo de hora técnica de engenharia.

## 6. Hardware no varejo brasileiro (preços de hoje, 19/09/2026)

**Computador com placa de vídeo intermediária (RTX 4060), para processar múltiplos fluxos de vídeo:**
- Placa avulsa GeForce RTX 4060 (GALAX, promoção): **R$ 1.899** — REAL — {evidence_url:"https://canaltech.com.br/hardware/placa-de-video-geforce-rtx-4060-com-preco-baixo-no-kabum/", data:"consulta 2026-09-19"}.
- RTX 4060 Ti 8GB (pré-venda, várias marcas): a partir de **R$ 3.099,99** (Pix) — REAL — {evidence_url:"https://www.adrenaline.com.br/nvidia/rtx-4060-ti-ja-disponivel-em-pre-venda-no-kabum-veja-precos-e-modelos/"}.
- PC completo Ryzen 5 5600 + RTX 4060 8GB + 16GB DDR4 + SSD NVMe 500GB (KaBuM, montado): **R$ 6.469,41** — REAL — {evidence_url:"https://www.kabum.com.br/produto/697243/pc-gamer-ryzen-5-5600-rtx-4060-16gb-ddr4-ssd-nvme-500gb-600w-80-plus-pcdeze01-e", data:"consulta 2026-09-19"}.

**Mini-PC de borda com acelerador NVIDIA Jetson (processamento local, sem nuvem):**
- Jetson Orin Nano Super Dev Kit 8GB (até 67 TOPS): **R$ 8.989** (Mercado Livre) — REAL — {evidence_url:"https://www.mercadolivre.com.br/nvidia-jetson-orin-nano-super-developer-kit-8gb/up/MLBU3168767731", data:"consulta 2026-09-19"}.
- Jetson Orin Nano 4GB kit industrial (reComputer, Loja do Jangão): **R$ 7.469,10 a R$ 11.199,00** — REAL — {evidence_url:"https://www.lojadojangao.com.br/search/?q=NVIDIA+JETSON+ORIN+NANO"}.
- Jetson Orin Nano 8GB kit industrial: **R$ 13.409,10 a R$ 14.899,00** — REAL, mesma fonte.
- Jetson Orin NX 8GB Dev Kit c/ SSD 128GB: **R$ 10.700,10**; Orin NX 16GB: **R$ 14.399,10** — REAL, mesma fonte.
- **Leitura de custo/valor:** o Jetson (edge, sem mandar vídeo bruto pra nuvem) custa 4-8x mais que uma GPU de PC avulsa, mas elimina custo de banda/nuvem por câmera (bloco 3) e resolve LGPD por desenho (vídeo bruto nunca sai do equipamento) — é o argumento técnico que sustenta "sem rosto e sem placa" como arquitetura, não só política.

**Benchmark PUBLICADO de fluxos 1080p processados com detecção de objetos (YOLO) — Seeed Studio, testado em Jetson AGX Orin 32GB / Orin NX / Orin Nano (não é PC com RTX, é a família Jetson):**
- YOLOv8x INT8 no AGX Orin 32GB: **~75 FPS** — REAL — {evidence_url:"https://www.seeedstudio.com/blog/2023/03/30/yolov8-performance-benchmarks-on-nvidia-jetson-devices/", data:"2023-03-30, ainda a referência mais citada em 2026"}.
- Multistream (YOLOv8s INT8, UI desligada, max performance) no **Orin NX 16GB**: **~40 câmeras simultâneas a ~5 FPS** com 1 modelo compartilhado, ou **~11 câmeras a ~15 FPS** com 1 modelo dedicado por câmera — REAL — {evidence_url:"https://www.linkedin.com/posts/seeedstudio_nvidia-jetson-yolov8-activity-7120740397315670017-wAoA"}.
- Jetson Orin Nano 8GB (não NX), caso real relatado em fórum: **~50 FPS** de um único stream YOLO — REAL, relato de usuário, não benchmark oficial — {evidence_url:"https://forums.developer.nvidia.com/t/running-yolo-over-8-video-streams-simultaneously-on-jetson-orin-agx-seeking-advice/303538"} → classificar como CONCEPT (relato, não paper/blog oficial).
- **Leitura para o hackathon:** contagem de tráfego não precisa de 30fps por câmera (o carro não desaparece em 1/15s) — **5-15 FPS por câmera já é suficiente para contagem/classificação**, o que significa que **1 único Jetson Orin Nano/NX (R$ 8-15 mil) processa de 10 a 40 câmeras de trânsito da cidade**, não 1 câmera por caixinha. Isso muda a conta de hardware de "1 caixa por câmera" para "1 caixa por várias câmeras", relevante se o piloto tiver múltiplos pontos.

**Câmera veicular com GPS / câmera fixa com leitura de placas e estatísticas de tráfego (referência de custo de captura, mesmo não sendo nosso produto):**
- Intelbras VIP 5460 LPR IA (câmera IP fixa 4MP, leitura de placa Mercosul até 60km/h >95% precisão, reconhece cor/marca/tipo/direção — **já inclui "estatísticas de tráfego" no próprio produto comercial**, sinal de que o mercado já reconhece esse subproduto): **R$ 5.333 a R$ 6.797** — REAL — {evidence_url:"https://www.mercadolivre.com.br/cmera-ip-intelbras-vip-5460-lpr-ia-leitura-placa-mercosul-cor-cinza/p/MLB44917526", data:"consulta 2026-09-19"}.
- Câmeras veiculares de consumo (carro, 4G+GPS, para referência de custo baixo, não são o produto): faixa de mercado (Shopee/ML) tipicamente R$150-800, sem preço único discriminado nesta busca → UNVERIFIED valor exato.
- **Nota importante:** como o hackathon propõe usar câmeras JÁ EXISTENTES da cidade, o custo de câmera física (R$5-7 mil/unidade se fosse comprar) não entra na nossa precificação — é diferencial competitivo forte frente a qualquer solução que exija hardware novo de captura.

**Nobreak 1500VA senoidal (proteção do equipamento de borda na caixa de trânsito/gabinete):**
- Faixa de mercado (Magazine Luiza, busca "nobreak 1500va senoidal"): **R$ 712,49 a R$ 4.876,30**, com modelos populares (TS Shara/Intelbras/APC) entre R$1.419,90 e R$2.135,49 no Pix — REAL — {evidence_url:"https://www.magazineluiza.com.br/busca/nobreak+1500va+senoidal/", data:"consulta 2026-09-19"}.

## 7. Casos de startup BR — piloto pago/CPSI em mobilidade

**Panorama nacional de CPSI (todos os setores, não só mobilidade) — Startup Summit 2026:**
- **293 CPSIs firmados no Brasil nos 5 primeiros anos do Marco Legal das Startups, 248 fornecedores, valor médio R$ 807.700,00/contrato** — REAL — {evidence_url:"https://www.brasil247.com/empreender/contratos-publicos-de-inovacao-somam-293-no-pais-e-abrem-mercado-para-startups/", data:"Startup Summit 2026"}.
- Adoção nos municípios ainda é lenta — "muitas prefeituras ainda não se sentem seguras para esse tipo de contratação" — REAL (mesma fonte), relevante para o argumento de venda: CPSI existe e tem histórico nacional, mas o gestor local pode nunca ter usado — parte da proposta de valor é ajudar a formatar o próprio instrumento jurídico.

**⭐ Achado com aplicação DIRETA em Patos de Minas (MG) — regra estadual mineira do CPSI:**
- **Lei estadual MG nº 23.793/2021: reembolso de custos do CPSI limitado a R$ 200.000,00; prazo de teste de 6 meses, prorrogável por mais 6 (12 no total)** — REAL — {evidence_url:"https://www.almg.gov.br/legislacao-mineira/texto/LEI/23793/2021/", data:"2021, vigente"}. **Ressalva de régua:** esta lei rege CPSI no âmbito do ESTADO de MG — para o MUNICÍPIO de Patos de Minas contratar via CPSI, a prefeitura precisaria de regulamento próprio (não localizado nesta pesquisa) ou aderir/inspirar-se no modelo estadual; **UNVERIFIED se Patos de Minas já tem lei municipal de CPSI**. Ainda assim, R$200 mil é uma âncora de "o que o Estado de MG considera razoável reembolsar por um piloto de startup" — mais realista para o hackathon do que o teto federal de R$1,6mi.

**Casos com valor (mobilidade urbana, não necessariamente CPSI formal):**
- Scipopulis (govtech de dados/mobilidade, ex-alunos IME-USP, hoje grupo green4T) — parceria com CET-SP, Banco Mundial, BID, Ministério das Cidades; contrato com **Pindamonhangaba (SP)**: começou como piloto e virou contrato de 1 ano (Plancity) — REAL a existência, **valor não divulgado → UNVERIFIED R$**; em **Porto Alegre** foi uso GRATUITO até março/2021 (não é venda) — REAL — {evidence_url:"https://www.datacenterdynamics.com/br/not%C3%ADcias/prefeitura-de-pindamonhangaba-sp-e-scipopulis-firmam-parceria-para-gest%C3%A3o-inteligente-da-cidade/"}.
- VM9 — venceu "II Desafio COR – Smart City, Smart People" (Rio de Janeiro), tema Mobilidade: 2 meses para desenvolver piloto + 2 meses para integrar à operação da cidade — REAL, **valor não divulgado → UNVERIFIED R$** — {evidence_url:"https://www.whow.com.br/startups-redesenhando-mobilidade-brasil/"}.
- Fortaleza (CE) — 1º CPSI municipal da história da cidade, em ciclomobilidade, financiado pela Bloomberg Philanthropies (não é verba municipal direta) — REAL, **valor não divulgado → UNVERIFIED R$** — {evidence_url:"https://www.fortaleza.ce.gov.br/noticias/fortaleza-avanca-e-apresenta-nova-fase-do-edital-de-inovacao-aberta-em-ciclomobilidade"}.
- Startup do hub Cubo Itaú (dispositivo certificado Anatel, setor não-especificado como mobilidade pura): **R$ 800 mil vendidos no 1º mês, com 12 pilotos em curso** — REAL mas setor ambíguo (não confirmado como mobilidade/trânsito) → classificar CONCEPT para este caso específico — {evidence_url:"https://www.idealmarketing.com.br/blog/startup-destaca-setor-mobilidade-reconhecimento/"}.
- **Resultado: não foram encontrados 3 casos de mobilidade com valor R$ explicitamente publicado e verificado em 1ª mão — 3 dos 4 casos têm valor NÃO DIVULGADO. A âncora mais forte e verificável do bloco 7 é a regra estadual de MG (R$200 mil, 6+6 meses), não um caso individual de venda.**

---

## Resumo (até 25 linhas)

1. **Rota legal para os 90 dias:** dispensa por valor (Lei 14.133 art.75,II) cabe se o total ficar ≤ **R$ 65.492,11** (2026) — rápida, sem edital.
2. **Rota legal para "vira contrato maior depois":** CPSI (LC 182/2021) — teto federal R$1,6mi/12+12 meses de teste, contrato de fornecimento depois até R$8mi/24+24 meses.
3. **Âncora LOCAL mais forte (MG):** Lei estadual 23.793/2021 limita reembolso de CPSI a **R$ 200.000,00**, teste de 6+6 meses — mais realista que o teto federal; checar se Patos de Minas tem regulamento municipal próprio (não achado).
4. Grandes contratos de videomonitoramento (referência de teto, não de porte de hackathon): Joinville R$119,7mi (8 mil câmeras), Campo Grande R$50,2mi/24m, Goiás R$35mi/60m, Smart Sampa R$9,2mi/mês (20 mil câmeras).
5. **Cálculo próprio: Smart Sampa = R$460/câmera/mês** (câmera+rede+plataforma, não é só analítico).
6. **Analítico de vídeo puro (add-on internacional): US$3-15/câmera/mês = R$15-77/câmera/mês.**
7. **Miovision (contagem/tráfego dedicado, EUA) é a âncora mais próxima do produto:** hardware R$58.596/interseção + serviço/analítico **R$427/interseção/mês**.
8. Contagem manual tradicional (Fratar, DNIT, Alkes): sem tabela pública de preço — vantagem de posicionamento para vender recorrência mensal em vez de "sob orçamento".
9. Hora técnica de engenharia (DNIT/FGV + piso SENGE-ES 2025/26): salário-base Engenheiro Auxiliar R$11.659,91/mês → ~R$66/h bruto; **carregada com encargos, piso defensável ≈ R$120-185/hora**.
10. **Hardware de borda (processa localmente, sem nuvem, resolve LGPD por desenho):** Jetson Orin Nano/NX R$7.500-15.000; processa **10-40 câmeras simultâneas** a 5-15fps (suficiente para contagem) segundo benchmark Seeed Studio.
11. PC com RTX4060 completo: R$6.469 (alternativa mais barata se não precisar de edge/borda embarcada).
12. Câmera com LPR+estatísticas de tráfego já como produto comercial (Intelbras VIP5460): R$5.333-6.797 — não é custo nosso (câmeras já existem na cidade), mas mostra que o mercado já precifica "estatística de tráfego" como feature de câmera.
13. Nobreak 1500VA senoidal: R$712-4.876 (proteção do equipamento de borda).
14. Panorama nacional CPSI: 293 contratos, valor médio **R$807,7 mil** — mas a maioria não é mobilidade e a adoção municipal é lenta.
15. Nenhum caso de mobilidade encontrado com valor de venda R$ publicado e verificado (Scipopulis, VM9, Fortaleza — todos sem R$ divulgado).

🕳️ **O que ficou de fora (universo declarado):** não pesquisei custo de Plano de Mobilidade Urbana por porte de cidade (item 4 do pedido, parcial); não achei contrato municipal específico de "contagem por vídeo" com preço/câmera discriminado em cidade de 50-500 mil hab (categoria ainda sem preço público padronizado no Brasil); não confirmei regulamento municipal de CPSI em Patos de Minas; PNCP não respondeu (ECONNRESET) — não tentado via chamadas espaçadas por falta de tempo/rede, coberto por busca em portais de transparência e imprensa em seu lugar.

**Faixa de preço sugerida (síntese, não pedida explicitamente mas decorrente das âncoras acima):** licença de analítico R$150-2.400/câmera/mês conforme escopo (baixo=genérico, alto=Miovision-like dedicado) + consultoria/diagnóstico a R$120-185/hora + hardware de borda R$7,5-15 mil (amortizável, cobre várias câmeras) — total de piloto 90 dias cabe dentro do teto MG de CPSI (R$200 mil) e, mais barato ainda, dentro da dispensa por valor (R$65.492,11).

---

```json
{
  "ancoras": [
    {"categoria":"limite_legal","descricao":"Dispensa de licitação Lei 14.133 art.75 II (demais compras/serviços) 2026","valor_rs":65492.11,"unidade":"teto_total_contrato","cidade_ou_fonte":"Decreto 12.807/2025","ano":2026,"url":"https://elicitacao.com.br/2026/01/15/valores-de-licitacao-em-2026/","classe":"REAL"},
    {"categoria":"limite_legal","descricao":"Dispensa de licitação Lei 14.133 art.75 I (obras/engenharia) 2026","valor_rs":130984.20,"unidade":"teto_total_contrato","cidade_ou_fonte":"Decreto 12.807/2025","ano":2026,"url":"https://elicitacao.com.br/2026/01/15/valores-de-licitacao-em-2026/","classe":"REAL"},
    {"categoria":"limite_legal","descricao":"Teto CPSI federal (fase de teste), LC 182/2021 art.14","valor_rs":1600000,"unidade":"teto_total_contrato","cidade_ou_fonte":"Manual AGU CPSI","ano":2021,"url":"https://www.gov.br/agu/pt-br/assuntos-1/labori/manual-do-contrato-publico-para-solucao-inovadora.pdf","classe":"REAL"},
    {"categoria":"limite_legal","descricao":"Teto contrato de fornecimento pós-CPSI","valor_rs":8000000,"unidade":"teto_total_contrato","cidade_ou_fonte":"Manual AGU CPSI","ano":2021,"url":"https://www.gov.br/agu/pt-br/assuntos-1/labori/manual-do-contrato-publico-para-solucao-inovadora.pdf","classe":"REAL"},
    {"categoria":"limite_legal","descricao":"Teto reembolso CPSI estadual MG (Lei 23.793/2021)","valor_rs":200000,"unidade":"teto_total_contrato","cidade_ou_fonte":"ALMG - Lei 23.793/2021","ano":2021,"url":"https://www.almg.gov.br/legislacao-mineira/texto/LEI/23793/2021/","classe":"REAL"},
    {"categoria":"contrato_grande","descricao":"Videomonitoramento IA + reconhecimento facial, até 8 mil câmeras","valor_rs":119740000,"unidade":"total_contrato","cidade_ou_fonte":"Joinville/SC","ano":2026,"url":"https://www.joinville.sc.gov.br/noticias/prefeitura-abre-propostas-do-edital-para-contratacao-de-videomonitoramento-com-cameras-com-reconhecimento-facial-e-recursos-de-inteligencia-artificial/","classe":"REAL"},
    {"categoria":"contrato_grande","descricao":"Radares+câmeras+central de monitoramento, 24 meses","valor_rs":50200000,"unidade":"total_contrato","cidade_ou_fonte":"Campo Grande/MS","ano":2025,"url":"https://www.campograndenews.com.br/cidades/capital/prefeitura-abre-licitacao-de-r-50-milhoes-para-ampliar-fiscalizacao-de-transito","classe":"REAL"},
    {"categoria":"contrato_grande","descricao":"Videomonitoramento com IA, 60 meses (Pregão 193/2024)","valor_rs":34999980,"unidade":"total_contrato","cidade_ou_fonte":"Governo de Goiás","ano":2024,"url":"https://goias.gov.br/governo/videomonitoramento-com-inteligencia-artificial/","classe":"REAL"},
    {"categoria":"preco_unitario","descricao":"Smart Sampa: melhor proposta por mês / 20 mil câmeras (cálculo próprio)","valor_rs":460,"unidade":"R$/camera/mes","cidade_ou_fonte":"Prefeitura de São Paulo - Smart Sampa","ano":2026,"url":"https://prefeitura.sp.gov.br/w/noticia/smart-sampa-pregao-eletronico-para-contratacao-de-20-mil-cameras-de-monitoramento-e-agendado-para-23-de-maio","classe":"REAL_CALCULADO"},
    {"categoria":"preco_unitario","descricao":"Analítico de vídeo add-on (faixa baixa), setor internacional","valor_rs":15.42,"unidade":"R$/camera/mes","cidade_ou_fonte":"Wavestore / Surveillant.ai (conversão US$3 a R$5,14)","ano":2026,"url":"https://www.wavestore.com/post/ai-video-analytics-roi-cost-per-camera-payback-2026","classe":"REAL"},
    {"categoria":"preco_unitario","descricao":"Analítico de vídeo add-on (faixa alta), setor internacional","valor_rs":77.10,"unidade":"R$/camera/mes","cidade_ou_fonte":"Wavestore / Surveillant.ai (conversão US$15 a R$5,14)","ano":2026,"url":"https://surveillant.ai/guides/ai-video-analytics-cost","classe":"REAL"},
    {"categoria":"preco_unitario","descricao":"Miovision: analítico/manutenção de dados por interseção/mês (conversão US$998/ano a R$5,14)","valor_rs":427,"unidade":"R$/intersecao/mes","cidade_ou_fonte":"Pima County AZ (compra pública)","ano":2026,"url":"https://content.civicplus.com/api/assets/e362d996-745a-4881-8a3e-ed51a554d9cc","classe":"REAL_CALCULADO"},
    {"categoria":"hardware","descricao":"Miovision: hardware/instalação por interseção (conversão US$11.400 a R$5,14)","valor_rs":58596,"unidade":"R$/intersecao","cidade_ou_fonte":"Pima County AZ (compra pública)","ano":2026,"url":"https://content.civicplus.com/api/assets/e362d996-745a-4881-8a3e-ed51a554d9cc","classe":"REAL_CALCULADO"},
    {"categoria":"hora_tecnica","descricao":"Hora técnica DNIT com encargos 84,04% (referência histórica 2017, método válido)","valor_rs":120.62,"unidade":"R$/hora","cidade_ou_fonte":"TCU/Zenite (decisão sobre SINAPI)","ano":2017,"url":"https://zenite.blog.br/tcu-confira-decisao-sobre-a-utilizacao-do-sinapi-como-referencial-de-precos/","classe":"REAL"},
    {"categoria":"hora_tecnica","descricao":"Salário-base mensal Engenheiro Auxiliar (Acordo Coletivo 2025/2026 SENGE-ES/SINAENCO-ES, base tabela DNIT)","valor_rs":11659.91,"unidade":"R$/mes","cidade_ou_fonte":"DER-ES Nota Técnica Consultoria JAN-2026","ano":2026,"url":"https://der.es.gov.br/Media/der/Documentos/Tabela%20Referencial%20de%20Pre%C3%A7o/Referencial%20de%20Rodovias/2026/17_Nota%20de%20Uso%20do%20Referencial%20Consultoria%20JAN-26.pdf","classe":"REAL"},
    {"categoria":"hardware","descricao":"Placa de vídeo GeForce RTX 4060 avulsa (promoção)","valor_rs":1899,"unidade":"R$/unidade","cidade_ou_fonte":"KaBuM (Canaltech)","ano":2026,"url":"https://canaltech.com.br/hardware/placa-de-video-geforce-rtx-4060-com-preco-baixo-no-kabum/","classe":"REAL"},
    {"categoria":"hardware","descricao":"PC completo Ryzen5 5600 + RTX4060 8GB + 16GB DDR4 + SSD 500GB","valor_rs":6469.41,"unidade":"R$/unidade","cidade_ou_fonte":"KaBuM","ano":2026,"url":"https://www.kabum.com.br/produto/697243/pc-gamer-ryzen-5-5600-rtx-4060-16gb-ddr4-ssd-nvme-500gb-600w-80-plus-pcdeze01-e","classe":"REAL"},
    {"categoria":"hardware","descricao":"NVIDIA Jetson Orin Nano Super Dev Kit 8GB (edge, até 67 TOPS)","valor_rs":8989,"unidade":"R$/unidade","cidade_ou_fonte":"Mercado Livre","ano":2026,"url":"https://www.mercadolivre.com.br/nvidia-jetson-orin-nano-super-developer-kit-8gb/up/MLBU3168767731","classe":"REAL"},
    {"categoria":"hardware","descricao":"NVIDIA Jetson Orin NX 16GB Dev Kit (edge)","valor_rs":14399.10,"unidade":"R$/unidade","cidade_ou_fonte":"Loja do Jangão","ano":2026,"url":"https://www.lojadojangao.com.br/search/?q=NVIDIA+JETSON+ORIN+NANO","classe":"REAL"},
    {"categoria":"hardware","descricao":"Nobreak 1500VA senoidal (faixa baixa)","valor_rs":712.49,"unidade":"R$/unidade","cidade_ou_fonte":"Magazine Luiza","ano":2026,"url":"https://www.magazineluiza.com.br/busca/nobreak+1500va+senoidal/","classe":"REAL"},
    {"categoria":"hardware","descricao":"Câmera IP Intelbras VIP 5460 LPR IA (já com estatísticas de tráfego de fábrica)","valor_rs":5333,"unidade":"R$/unidade","cidade_ou_fonte":"Mercado Livre","ano":2026,"url":"https://www.mercadolivre.com.br/cmera-ip-intelbras-vip-5460-lpr-ia-leitura-placa-mercosul-cor-cinza/p/MLB44917526","classe":"REAL"},
    {"categoria":"benchmark","descricao":"Multistream YOLOv8s INT8 em Jetson Orin NX 16GB: ~40 câmeras a ~5fps (1 modelo compartilhado)","valor_rs":null,"unidade":"cameras_simultaneas","cidade_ou_fonte":"Seeed Studio","ano":2023,"url":"https://www.linkedin.com/posts/seeedstudio_nvidia-jetson-yolov8-activity-7120740397315670017-wAoA","classe":"REAL"},
    {"categoria":"cpsi_panorama","descricao":"Valor médio nacional de CPSI, 293 contratos em 5 anos","valor_rs":807700,"unidade":"R$/contrato_medio","cidade_ou_fonte":"Startup Summit 2026 (via Brasil247)","ano":2026,"url":"https://www.brasil247.com/empreender/contratos-publicos-de-inovacao-somam-293-no-pais-e-abrem-mercado-para-startups/","classe":"REAL"},
    {"categoria":"cotacao","descricao":"USD/BRL fechamento","valor_rs":5.14,"unidade":"R$/US$","cidade_ou_fonte":"InfoMoney","ano":2026,"url":"https://www.infomoney.com.br/mercados/dolar-hoje-abertura-fechamento-comercial-turismo-18092026/","classe":"REAL"}
  ],
  "limites_legais": {
    "dispensa_art75_I_obras_engenharia_rs": 130984.20,
    "dispensa_art75_II_compras_servicos_rs": 65492.11,
    "dispensa_dobrada_consorcio_art75_paragrafo3_II_rs": 130984.22,
    "servicos_tecnicos_especializados_art37_par2_rs": 392952.63,
    "cpsi_federal_teste_teto_rs": 1600000,
    "cpsi_federal_teste_prazo_meses": 24,
    "cpsi_federal_fornecimento_teto_rs": 8000000,
    "cpsi_federal_fornecimento_prazo_meses": 48,
    "cpsi_mg_estadual_reembolso_teto_rs": 200000,
    "cpsi_mg_estadual_teste_prazo_meses": 12,
    "fonte_decreto_dispensa": "Decreto 12.807/2025 (DOU 30/12/2025, vigente 01/01/2026)",
    "fonte_cpsi_federal": "LC 182/2021 art.13-14",
    "fonte_cpsi_mg": "Lei estadual MG 23.793/2021",
    "cpsi_exige_startup_formal": "NAO_CONFIRMADO_pessoa_fisica_ou_juridica_isolada_ou_consorcio_art13"
  }
}
```

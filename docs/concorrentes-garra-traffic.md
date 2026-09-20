# Investigador OSINT — Garra Traffic (concorrente/potencial parceiro-fornecedor em Patos de Minas)

Data da pesquisa: 19/09/2026.

Convenção: cada achado = `{claim, evidence_url, data}` + classificação **REAL** (visto na fonte) / **CONCEPT** (declarado pela empresa, sem prova independente) / **PHANTOM** (não achei, ou achei e descartei por ser confusão/hallucinação). `UNVERIFIED:` = sem âncora.

---

## 1. Quem é

- **Nome fantasia:** Garra Traffic. **Razão social:** GARRA TRAFFIC SINALIZAÇÃO LTDA. **CNPJ:** 03.581.664/0001-80. REAL — {claim: "razão social e CNPJ", evidence_url: "https://casadosdados.com.br/solucao/cnpj/garra-traffic-sinalizacao-ltda-03581664000180", data: "consultado 19/09/2026"} (corroborado em https://www.econodata.com.br/consulta-empresa/03581664000180-garra-traffic-sinalizacao-ltda e no próprio texto de contrato público de Esmeraldas, que cita "GARRA TRAFFIC SINALIZAÇÃO LTDA" — https://pncp.gov.br/api/search/ , 2025-11-19).
- **Sede:** Rua Souza Menezes, 70 (ou, em cadastro mais recente, Rua Campina Verde, 363), Bairro Salgado Filho, Belo Horizonte/MG, CEP 30550-120/30550-340. REAL — {evidence_url: "https://garratraffic.com/" e "https://casadosdados.com.br/solucao/cnpj/garra-traffic-sinalizacao-ltda-03581664000180", data: 19/09/2026}.
- **Sócios/administradores:** os sócios-administradores (sócios-administradores). REAL — {evidence_url: "https://casadosdados.com.br/solucao/cnpj/garra-traffic-sinalizacao-ltda-03581664000180", data: 19/09/2026}. Nota: a reportagem local de Patos de Minas cita "o dono da empresa" (dono) e "o engenheiro responsável" como interlocutores — consistente com o sobrenome societário, mas o texto não usa o nome completo do CNPJ. REAL parcial — {evidence_url: "https://www.patoshoje.com.br/noticias/prefeitura-aposta-em-sistema-inteligente-para-controlar-semaforos-e-desafogar-o-transito-em-patos-de-minas-97130.html", data: "18/08/2026"}.
- **Data de fundação:** DIVERGÊNCIA MEDIDA — o site institucional declara fundação em **2009** (CONCEPT — {evidence_url: "https://garratraffic.com/a-garra", data: 19/09/2026}), mas o registro do CNPJ mostra abertura em **06/01/2000** (REAL — {evidence_url: "https://casadosdados.com.br/solucao/cnpj/garra-traffic-sinalizacao-ltda-03581664000180", data: 19/09/2026}). Hipótese não provada: 2009 pode ser o ano de entrada no ramo semafórico especificamente, ou marketing impreciso. Não decidi qual é o "certo" — registro apenas a divergência (R-UNIVERSO-DECLARADO-001).
- **Porte/faturamento:** UNVERIFIED — não consegui abrir o Econodata (HTTP 403) nem achei porte declarado em fonte aberta legível. Capital social **R$ 100.000** conforme registro. REAL (capital social) — {evidence_url: "https://casadosdados.com.br/...", data: 19/09/2026}. PHANTOM (faturamento, nº de funcionários).
- **Grupo econômico / achado-chave:** a Garra Traffic **não é a fabricante** da tecnologia de IA — ela é integradora/representante regional. O contrato de Esmeraldas (PNCP) descreve a Garra Traffic como **"representante exclusiva da marca BRASCONTROL no Estado de Minas Gerais"**. REAL — {claim: "Garra Traffic é representante exclusiva Brascontrol em MG", evidence_url: "https://pncp.gov.br/api/search/ (Contrato nº 83/2025, Município de Esmeraldas)", data: "assinatura 2025-11-19"}. A **Brascontrol** (Brascontrol® Smart City Technologies, sede em Alameda Europa, 88, Santana do Parnaíba/SP) é quem fabrica os controladores, o software de central e o módulo de IA/análise de tráfego; o próprio site da Brascontrol lista **Patos de Minas** como cliente direto (ao lado de Divinópolis, Florianópolis, Petrobras, EMTU, CET, PRF). REAL — {evidence_url: "https://brascontrol.com.br/en/home/", data: 19/09/2026}. Isso significa: em Patos de Minas, a cadeia real é fabricante (Brascontrol, SP) → integrador/manutenção local (Garra Traffic, BH) → prefeitura. Nenhuma das duas é "de Patos".

## 2. Capacidades/produtos declarados (nome exato do site garratraffic.com)

Todos **CONCEPT** (declarado pela empresa; não testado/auditado independentemente) — {evidence_url: "https://garratraffic.com/" e páginas de produto, data: 19/09/2026}:
1. Controlador de Tráfego (Controlador Eletrônico de Tráfego)
2. Central de Controle Semafórica — gerenciamento remoto de todos os controladores do município, comunicação em tempo real, autodiagnóstico de equipamentos em campo, segurança contra invasão/hackers, opera via fibra óptica/par metálico/celular/WiFi/rádio, "expansível para o modo adaptativo tempo real" (REAL — texto extraído literalmente da página do produto: https://garratraffic.com/produtos/central-de-controle-semaforica/)
3. Fiscalização Eletrônica
4. Lombada Eletrônica
5. LED Semafórico HI-FLUX
6. Implantação e manutenção semafórica
7. Operação assistida de central semafórica
8. Centralização de controladores semafóricos
9. Locação de radares e redutores de velocidade
10. Sinalização vertical e horizontal
11. "Softwares de Smartcities" (nome genérico usado no site, sem produto nomeado)
12. Semáforos Inteligentes — Sistema SRAM ("Sistema Responsivo Adaptativo Micro regulado") — este é o nome que a Garra Traffic usa publicamente para a camada de IA adaptativa
13. Pesquisa volumétrica de veículos, contagem e ocupação, micro/macro simulação para estudo viário, Relatório de Impacto de Circulação (RIC), cálculo de tempo de semáforo
14. Processamento de multas

Nota de precisão: no produto "Central de Controle Semafórica" especificamente, **não aparecem** menções a dashboard visual para gestor, relatórios abertos, integração com câmeras de terceiros, dados abertos ou LGPD — mesmo esse sendo o produto mais próximo do que a prefeitura estaria comprando.

## 3. Presta serviço a Patos de Minas?

**SIM, confirmado por duas vias independentes — REAL:**
- **Contrato público (PNCP):** Contrato nº 235/2025, MUNICÍPIO DE PATOS DE MINAS, assinado 2025-10-22, vigência 2025-10-22 a 2026-10-22, valor **R$ 355.172,16**, modalidade **Inexigibilidade**, objeto: "Aquisição de peças para as unidades semafóricas da marca Brascontrol Indústria e Comércio Ltda, destinadas à manutenção da rede semafórica do Município de Patos de Minas" (publicado via [Publicenter]). {evidence_url: "https://pncp.gov.br/api/search/ (query 'Garra Traffic', tipos_documento=contrato)", data: "assinatura 22/10/2025, verificado 19/09/2026"}. **Atenção:** este contrato especificamente é sobre peças Brascontrol — o texto do objeto não nomeia a Garra Traffic explicitamente no trecho capturado pela API de busca (o campo `orgao_nome` confirma o município; a contratada aparece truncada como "[Publicenter]" no índice de busca — recomendo abrir o PDF do contrato no PNCP para confirmar 100% que a contratada é a Garra Traffic e não outro revendedor Brascontrol). Classifico o vínculo contratual Patos↔Garra Traffic como **REAL com uma ressalva declarada** (🟡): o contrato aparece na busca por "Garra Traffic" no PNCP, mas o snippet de objeto não repete o nome da contratada — pode ser outro elo da cadeia Brascontrol.
- **Piloto do semáforo com IA na Av. Paracatu (ago/2026):** SIM, é a Garra Traffic. A reportagem cita o "o empresário, proprietário da empresa responsável" — o sobrenome citado na reportagem bate com o dos sócios registrados (um dos sócios-administradores / outro sócio-administrador), e o sistema usa exatamente o **"Sistema Responsivo Adaptativo Micro regulado"**, nome que só aparece no vocabulário da Garra Traffic (SRAM). REAL por inferência forte, não por citação literal do nome da empresa nas notícias — {evidence_url: "https://patoshoje.com.br/noticias/prefeitura-aposta-em-sistema-inteligente-para-controlar-semaforos-e-desafogar-o-transito-em-patos-de-minas-97130.html", data: "18/08/2026"; e "https://www.patos1.com.br/noticia/patos-de-minas-prefeitura-inicia-testes-com-semaforos-inteligentes-acionados-por-inteligencia-artificial-na-avenida-paracatu", data: "18/08/2026"}. **Nenhuma das duas reportagens nomeia "Garra Traffic" ou "Brascontrol" explicitamente** — a identificação é por padrão de linguagem (SRAM) + reutilização de controladores 2019 + nome do dono. Marco: **CONCEPT/inferência, não citação direta** — recomendo o time confirmar com a SETTRANS/prefeitura o nome formal do fornecedor antes de citar publicamente.

**Detalhes do piloto (todos REAL, das duas matérias):**
- Início: 18/08/2026. Duração do teste: 60 dias, **sem custo para o município**.
- Local: Av. Paracatu, cruzamentos entre Rua Anicésio Vieira e Rua João da Rocha Figueira — 2 interseções, 7 câmeras.
- Base instalada: 76 cruzamentos semafóricos no total; 36 já têm controladores compatíveis (adquiridos em 2019) com o módulo de IA; 35 adicionais são candidatos a expansão se o teste for aprovado.
- Ganho esperado declarado: 20–25% de melhoria na fluidez (CONCEPT — projeção da empresa/prefeitura, sem medição publicada ainda).
- Como funciona (declarado): câmeras enviam imagem para central; IA conta veículos por sentido; sistema recalcula tempo de abertura a cada ciclo, com classificação de tipo de veículo (moto/carro/caminhão) — visão computacional, sem menção a leitura de placa ou reconhecimento facial nas matérias.

**Contrato mais antigo achado no PNCP (mesma cadeia Brascontrol/Garra):** não achei contrato de 2019 (época da compra dos controladores) no PNCP — a busca só cobre o período recente do portal; **PHANTOM/NÃO-MEDIDO** para a fase 2019.

## 4. Outras cidades clientes (contratos PÚBLICOS achados no PNCP, todos REAL — fonte primária: API `pncp.gov.br/api/search`, consultada 19/09/2026, busca "Garra Traffic", total 8 contratos)

| Cidade/UF | Objeto (resumo) | Valor (R$) | Assinatura | Vigência | Modalidade |
|---|---|---|---|---|---|
| João Monlevade/MG | Diagnóstico/inspeção de defeitos em cruzamento semaforizado (equip. Brascontrol) | 38.510,00 | 10/09/2026 | 10/09/2026–10/10/2026 | Inexigibilidade |
| Itaúna/MG | Manutenção preventiva/corretiva/emergencial do parque semafórico + acesso à central remota | 821.520,00 | 07/08/2026 | 10/08/2026–10/08/2027 | Inexigibilidade |
| Ubá/MG | Aquisição emergencial de equipamentos de controle de tráfego e sinalização viária | 168.000,00 | 22/04/2026 | 22/04/2026–23/02/2027 | Dispensa |
| Divinópolis/MG | Instalação/implantação/manutenção do sistema semafórico, fornecimento e substituição de equipamentos | 4.432.600,00 | 26/02/2026 | 01/03/2026–26/02/2027 | Pregão Eletrônico |
| Muriaé/MG | Manutenção semafórica com fornecimento de materiais em comodato — modernização | 3.281.500,00 | 25/02/2026 | 25/02/2026–24/02/2031 (5 anos) | Concorrência Eletrônica |
| Esmeraldas/MG | Manutenção preventiva/corretiva/laboratorial, operação assistida via central (contrato cita explicitamente "representante exclusiva Brascontrol em MG") | 85.920,00 | 19/11/2025 | 24/11/2025–24/11/2026 | Inexigibilidade |
| **Patos de Minas/MG** | Aquisição de peças Brascontrol para manutenção da rede semafórica | 355.172,16 | 22/10/2025 | 22/10/2025–22/10/2026 | Inexigibilidade |
| Diamantina/MG | Fornecimento/implantação de materiais de sinalização semafórica | 189.415,00 | 20/09/2024 | 20/09/2024–19/09/2025 | Pregão Eletrônico |

**Universo declarado:** 8 de 8 contratos que a busca full-text do PNCP retornou para o termo "Garra Traffic" em `tipos_documento=contrato`, todos em MG. Não busquei separadamente por "editais" e "atas" (a API do PNCP devolveu 503 Service Unavailable nas duas tentativas — ⚪ NÃO-MEDIDO, não tentei retry adicional por já ter volume suficiente). Não há garantia de que 8 é o universo total de vínculos contratuais da empresa — é o universo **achável pelo termo de busca "Garra Traffic" no índice de contratos do PNCP**, que só cobre contratações sob a Lei 14.133/2021 publicadas desde 2023-2024. Contratos anteriores a essa obrigatoriedade (ex.: os controladores de 2019 em Patos) não aparecem.

**Nota de escala:** o maior contrato achado (Divinópolis, R$ 4,43 milhões, pregão eletrônico competitivo) é ~12x maior que o de Patos de Minas — sugere que Patos é hoje cliente pequeno/manutenção pontual na carteira da Garra Traffic, não um contrato-bandeira.

**Site institucional cita adicionalmente (CONCEPT, sem contrato público achado no PNCP para confirmar):** Betim, Itabirito, Nova Lima, Sete Lagoas, Viçosa. PHANTOM quanto a valor/data — não achei contrato PNCP correspondente a essas 5 cidades na busca feita.

## 5. Preços

- **Únicos valores encontrados são GLOBAIS de contrato** (tabela acima), não há valor unitário por cruzamento/controlador/câmera/mês publicado em nenhuma fonte aberta que abri. PHANTOM quanto a preço unitário.
- Procurei em: termos de referência resumidos pela busca PNCP (não abri os PDFs completos dos editais/termos de referência, que poderiam ter planilha de preços unitários por item — isso é o próximo passo natural se o time quiser o número exato), Reclame Aqui (não tem preço), site institucional (não publica preço), buscas Google por "Divinópolis pregão semáforo Garra Traffic valor unitário" (sem resultado).
- **Estimativa grosseira NÃO-VERIFICADA, não publico como fato**: dividindo o contrato de Muriaé (R$ 3.281.500 / 5 anos) por 60 meses dá ~R$ 54.700/mês para "manutenção semafórica com fornecimento em comodato" de uma cidade — mas não sei quantos cruzamentos Muriaé tem, então não é um preço por unidade confiável. Não uso este número em nenhuma peça pública sem antes achar o denominador (nº de cruzamentos cobertos).
- **Próximo passo recomendado para achar preço unitário real:** abrir o PDF do Termo de Referência do Pregão de Divinópolis (maior contrato, modalidade competitiva = mais provável ter planilha de preços por item) via portal da prefeitura ou PNCP.

## 6. O que eles NÃO fazem/declaram (lacunas medidas)

- ❌ **Antes/depois medido e publicado:** não achei nenhuma publicação de resultado real pós-implantação (nem em Patos, nem nas outras cidades) — só a projeção "20-25%" declarada antes do teste começar. Nenhum estudo publicado achado.
- ❌ **Dados abertos:** nenhuma menção a portal de dados abertos, API pública, ou exportação de dados de contagem para terceiros em nenhuma fonte (site, notícias, contrato).
- ⚠️ **Câmera de segurança existente de terceiros:** o modelo da Garra Traffic parece ser câmera PRÓPRIA instalada no poste do semáforo (7 câmeras dedicadas para 2 cruzamentos em Patos) — não há evidência de que eles reaproveitem câmeras de vigilância municipal/COP já existentes. Isso é uma diferença estrutural real com a proposta do hackathon (que parte de câmeras JÁ instaladas).
- ❌ **Painel para o gestor / dashboard público:** não descrito em nenhuma fonte aberta — o produto "Central de Controle Semafórica" fala de gerenciamento técnico dos controladores, não de visualização de indicadores de trânsito para gestor não-técnico.
- ❌ **Participação do cidadão:** nenhuma menção.
- ⚠️ **LGPD:** o site tem uma página de política (`/politica/`) mas não abri o conteúdo; não há declaração pública específica sobre anonimização de placa/rosto no contexto do semáforo com IA. UNVERIFIED.
- ✅ **O que eles claramente fazem bem, e é o core:** manutenção física e operação de hardware semafórico (controlador, central, peças, LED) — é uma empresa de **engenharia de trânsito e infraestrutura**, não uma empresa de dados/software como core business. A camada de "IA" é feature de um fornecedor terceiro (Brascontrol), não capacidade proprietária.

## 7. Onde um time pequeno local entra sem competir de frente

Com base no que foi medido (não é opinião de mercado, é leitura do que a Garra Traffic/Brascontrol declaradamente NÃO oferece, seção 6):

1. **Camada de medição/dado aberto sobre câmeras JÁ existentes (não-semáforo)** — Garra Traffic monta câmera dedicada nova por cruzamento; um time que lê câmeras de segurança/monitoramento já instaladas (sem hardware novo, sem CAPEX de poste) ataca outro orçamento e outro processo de compra (não concorre pelo mesmo pregão de "controlador semafórico").
2. **Medição antes/depois e publicação do resultado** — nenhuma das duas empresas publica isso; é o produto que prova ou desmente o "20-25%" que a Garra Traffic promete. Um dashboard independente de antes/depois é complementar, não substituto, e pode inclusive validar (ou não) o piloto deles.
3. **Painel para o gestor / dado aberto ao cidadão** — camada de visualização/participação social que nem Brascontrol nem Garra Traffic declaram ter.
4. **Escala:** Patos de Minas hoje parece ser um cliente pequeno/manutenção na carteira da Garra Traffic (contrato de R$ 355 mil vs. R$ 4,4 milhões em Divinópolis) — não há sinal de que a prefeitura tenha comprado um pacote de dados/analytics caro; o piloto de IA é teste gratuito de 60 dias. Isso é uma janela real: a prefeitura ainda não decidiu se vai contratar a Garra Traffic para o "modo IA" definitivo.

---

## 🕳️ O que ficou de fora deste levantamento (universo declarado)

- Não abri os PDFs completos dos 8 termos de referência/contratos (só o resumo indexado pela busca PNCP) — pode haver preço unitário, nº de cruzamentos e especificação técnica mais fina lá dentro.
- Não confirmei por documento primário (só por inferência de linguagem/nome) que a contratada do piloto de IA em Patos é formalmente "Garra Traffic Sinalização Ltda" — as duas matérias de imprensa não citam o nome da empresa.
- Não busquei processos judiciais, Procon, ou reclamações fora do Reclame Aqui (que não tem histórico suficiente para reputação).
- Não busquei contratos federais/estaduais fora de MG (a Brascontrol atende SP, Petrobras, EMTU, CET, PRF — não sei se a Garra Traffic atua fora de MG).
- Uma busca (WebSearch sobre "Garra Traffic LGPD dados abertos") retornou um resultado claramente **espúrio** — associava "Garra Traffic" a um projeto de auditoria LGPD de dados abertos que não bate com o negócio real da empresa (provavelmente confusão do resumidor com outro projeto). **Descartei esse achado como PHANTOM** e não o uso em lugar nenhum deste relatório — registro aqui só para deixar rastreável por que a seção 6/LGPD não usa esse dado.

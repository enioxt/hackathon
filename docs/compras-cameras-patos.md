# Quanto Patos de Minas já gastou com o "Olho Vivo" — levantamento OSINT (fonte aberta, 19/09/2026)

> Método: WebSearch + WebFetch em fonte pública (site da prefeitura, portal do terceiro setor, PNCP, imprensa local, atas do Consep publicadas). PNCP API de busca textual (`/api/search`) devolveu 0 resultados relevantes para "videomonitoramento" em MG/Patos de Minas nesta consulta; a API de consulta (`/api/consulta/v1/contratos`) respondeu para o CNPJ da Prefeitura (18.602.011/0001-07) mas **nenhum contrato retornado em 2024/2025/2026 menciona câmera/CFTV/videomonitoramento/LPR/Hikvision/Intelbras/DVR/NVR** — os equipamentos de câmera parecem ter sido adquiridos via OSC (Termo de Colaboração, Lei 13.019/2014), não via pregão direto da Prefeitura, o que os tira do radar do PNCP de contratos administrativos. CNPJ Prefeitura de Patos de Minas: **18.602.011/0001-07** (fonte: Portal da Transparência federal, `portaldatransparencia.gov.br`).

---

## 1. Linha do tempo das aquisições (2014→2026)

| Data | O que foi comprado/instalado | Valor | Quem pagou | Instrumento | Link | Classe |
|---|---|---|---|---|---|---|
| jun/2014 | Inauguração do Olho Vivo: 16 câmeras, 16 pontos, central de monitoramento na 86ª Cia PM | ≈ R$ 2.000.000,00 (valor "aos cofres públicos", sem detalhamento de contrato) | Município (+ doações da população p/ reforma da sede) | Não identificado (pré-PNCP digital) | [Câmeras do Olho Vivo reduzem número de crimes — Patos Hoje](https://patoshoje.com.br/noticias/cameras-do-olho-vivo-reduzem-numero-de-crimes-em-patos-de-minas-em-quase-40-47836.html) | CONCEPT (só notícia, sem doc financeiro) |
| jul/2019 | +25 câmeras (4 delas leitoras de placa), totalizando 51 câmeras adquiridas | ≈ R$ 300.000,00 | "Parceria com empresas parceiras do município" (não identificado se é doação/patrocínio ou verba pública direta) | Não identificado | [Patos de Minas ganhará 25 novas câmeras — Patos Hoje](https://patoshoje.com.br/noticias/no-valor-de-r300-mil-patos-de-minas-ganhara-25-novas-cameras-do-olho-vivo-58240.html) | CONCEPT |
| 20/09/2024 (edital) | Chamamento Público 002/2024/Olho Vivo — processo 28798-24-PAT-INT, Secretaria Municipal de Governo — para manutenção/ampliação do CFTV existente (à época: 35 câmeras SPEED DOME + 14 fixas, 3 sem funcionar por falta de licença) | Valor global NÃO localizado no corpo do edital lido (recurso "orçamento próprio do município, podendo vir a ser composto com recursos estaduais e federais") | Município (orçamento próprio + possível repasse estadual/federal) | Edital de Chamamento Público nº 002/2024/Olho Vivo | [PDF oficial](https://terceirosetor.patosdeminas.mg.gov.br/downloadFile?file=dados%2Flicitacao%2F35%2Farquivo%2F105-1726696098.pdf) | REAL (documento lido; valor global = NÃO-MEDIDO) |
| 2024 (a partir de) | Emenda parlamentar estadual (deputada estadual) para expansão do Olho Vivo, recursos administrados pelo Consep | R$ 1.800.000,00 (total da emenda, 2024–2026) | Governo do Estado de MG (emenda parlamentar) → repassado ao Consep | Emenda estadual via Consep (nº não localizado) | [deputada estadual destaca expansão — Patos Hoje 09/02/2026](https://www.patosdeminas.mg.gov.br/portal/noticias/0/3/2323/patos-de-minas-tera-maior-area-videomonitorada-do-estado-com-295--cameras) | CONCEPT (valor citado em várias matérias, sem PDF de empenho) |
| **não confirmado hoje** | "Termo de Colaboração 19/2024" e seu "1º aditivo de R$ 894.960,64 (ago/2025, 22 novos pontos + 50 câmeras LPR)" — pista do levantamento anterior | R$ 894.960,64 (não confirmado) | — | Termo de Colaboração 19/2024 + 1º aditivo | Busca no portal `terceirosetor.patosdeminas.mg.gov.br` retornou Termos 13/2024, 14/2024 e 21/2024, mas **não** o 19/2024 diretamente | **PHANTOM hoje** — não achei o PDF; ver pedido LAI abaixo |
| relatado em reunião ordinária do Consep, mar/abr 2026 | "3º aditivo" do Projeto Olho Vivo — depósito já efetuado pela Prefeitura | R$ 272.000,00 | Prefeitura → Consep | 3º aditivo (Projeto Olho Vivo) | [Consep realizou reuniões ordinárias — Folha Patense](https://www.folhapatense.com.br/consep-realizou-reunioes-ordinarias) | CONCEPT (ata publicada por veículo de imprensa, não o PDF da ata em si) |
| idem | "4º aditivo" do Projeto Olho Vivo — valor ainda pendente de repasse pela deputada estadual | R$ 356.876,00 (pendente) | Emenda estadual (deputada estadual) → Consep | 4º aditivo (Projeto Olho Vivo) | [Consep realizou reuniões ordinárias — Folha Patense](https://www.folhapatense.com.br/consep-realizou-reunioes-ordinarias) | CONCEPT — **pendente**, não contar no total já gasto |
| 03/07/2025 (anúncio) | Ampliação anunciada: de 56 câmeras ativas para meta de 295; R$ 500 mil já em execução + R$ 1 milhão já em conta | R$ 1.500.000,00 (anunciado; sobreposto ao mesmo recurso da emenda deputada estadual de R$1,8 mi acima — **não somar como valor adicional**) | Emenda estadual (deputada estadual) | Anúncio oficial da Prefeitura | [Patos de Minas terá maior área videomonitorada do estado com 295 câmeras](https://www.patosdeminas.mg.gov.br/portal/noticias/0/3/2323/patos-de-minas-tera-maior-area-videomonitorada-do-estado-com-295--cameras) | CONCEPT |
| 24/05/2026 | Entrega de mais uma etapa de ampliação: sistema atinge 240 câmeras em 140 pontos (urbano + rural), com monitoramento 360°, leitura de placa e reconhecimento facial | Sem valor específico desta etapa isolado (parte da mesma emenda R$1,8 mi) | Emenda estadual (deputada estadual) via Consep + Prefeitura (operação) | Solenidade Praça Abner Afonso | [Olho Vivo é ampliado — Patos Hoje](https://patoshoje.com.br/noticias/olho-vivo-e-ampliado-com-monitoramento-360-leitura-de-placas-e-reconhecimento-facial-em-patos-de-minas-95907.html) · [PatosJá](https://www.patosja.com.br/Regionais/patos-de-minas-amplia-sistema-olho-vivo-com-reconhecimento-facial-e-monitoramento-rural) · [Patos Agora](https://patosagora.net/noticia/prefeitura-amplia-sistema-olho-vivo-e-leva-tecnologia-de-reconhecimento-facial-para-areas-urbanas-e-rurais-de-patos-de-minas) | CONCEPT |
| set/2025 (pregão) | Pregão Eletrônico nº 99/2025 — "contratação de empresa especializada para prestação de serviços de monitoramento de alarmes e videomonitoramento de câmeras 24 horas por dia" (serviço de OPERAÇÃO, não equipamento) — sessão 24/09/2025; DOM registra uma tentativa anterior como "FRACASSADA" | Valor não lido no DOM (PDF binário, não extraível pelo fetch) | Município | Pregão Eletrônico 99/2025, Diário Oficial do Município nº 1432 | [DOM 1432 09/09/2025 (PDF)](https://www.patospre.instarswe.com.br/arquivos/dom_1432_9_9_2025_assinado_08060620_09011449.pdf) · também citado em `pncp.gov.br/app/editais` e `licitanet.com.br` | REAL (edital existe, valor NÃO-MEDIDO — PDF não abriu em texto) |
| 2025 (confirmado previamente) | Contrato PNCP nº 235/2025 — peças de semáforo (infraestrutura de trânsito correlata, NÃO é câmera) | R$ 355.172,16 | Município | Contrato PNCP 235/2025 | já confirmado em levantamento anterior — não repetido aqui | REAL, mas **fora do escopo câmera** (não somar ao total de câmeras) |

---

## 2. Total já investido em câmera/infraestrutura

Somando **apenas** REAL/CONCEPT com valor e link, evitando dupla contagem do mesmo recurso (a emenda de R$1,8 mi, o anúncio de R$1,5 mi e os aditivos 3º/4º do Consep parecem ser a MESMA fonte de dinheiro em momentos diferentes — contados uma única vez pelo valor-teto da emenda, R$1,8 mi):

```
2014 .................. R$ 2.000.000,00  (16 câmeras)
2019 .................. R$   300.000,00  (25 câmeras, 51 no total)
2024–2026 (emenda deputada estadual, via Consep) .. R$ 1.800.000,00  (expansão para 240+ câmeras)
--------------------------------------------------
TOTAL (câmeras) ........ R$ 4.100.000,00
```

**O que ficou de fora da soma (não é omissão, é declarado):**
- Edital 002/2024 (valor global da parceria de manutenção não localizado no PDF — pode ser recorrente/anual e SOMAR-SE ao acima; NÃO-MEDIDO hoje).
- Termo de Colaboração 19/2024 e seu aditivo de R$894.960,64 — pista não confirmada hoje (PHANTOM); se for REAL e for parte da mesma emenda de R$1,8 mi, não altera o total; se for recurso adicional, o total sobe.
- Pregão 99/2025 (operação/monitoramento 24h) — é custo de OPERAÇÃO recorrente, não de aquisição de câmera; não entra no total de investimento em equipamento.
- Contrato PNCP 235/2025 (R$355.172,16, peças de semáforo) — infraestrutura de trânsito correlata, mas não é câmera; mantido fora por escopo.
- Doações de empresas parceiras (2019) e da população (2014) — sem valor monetário atribuído, não somadas.

**Custo médio por câmera** — só é possível calcular quando os dois números (total R$ e total de câmeras) têm a MESMA fonte/momento, o que não é o caso aqui (o R$4,1 mi cobre incrementos de 2014+2019+2024-26, e o "240 câmeras" é o estoque acumulado em mai/2026, não a soma das unidades compradas com esse dinheiro específico — parte do parque de 2014/2019 pode já estar obsoleta/substituída). Cálculo aproximado, com essa ressalva expressa:

```
R$ 4.100.000,00 ÷ 240 câmeras ≈ R$ 17.083 / câmera (ordem de grandeza, NÃO um preço unitário contratual)
```

Isso é compatível, em ordem de grandeza, com o valor de ≈R$25 mil/câmera citado em reunião do Consep (abr/2025) como custo de instalação unitária — mas os dois números não devem ser tratados como iguais: um é média histórica agregada, o outro é o preço de instalar 1 unidade nova hoje.

---

## 3. Preços unitários achados em documento

| Item | Valor | Fonte | Classe |
|---|---|---|---|
| Câmera nova instalada (fala em reunião do Consep, não documento formal) | ≈ R$ 25.000,00/câmera | pista do levantamento anterior — **não reconfirmada em documento nesta rodada**; nenhuma ata/PDF do Consep de abr/2025 foi localizada hoje com esse número explícito | PHANTOM (repetindo o rótulo do levantamento anterior — precisa da ata) |
| Aquisição em lote (2019): 25 câmeras (4 leitoras de placa) | ≈ R$ 300.000,00 ÷ 25 ≈ R$ 12.000,00/câmera (mas o texto diz que as 51 câmeras totais custaram ≈R$300 mil, então pode ser ≈R$5.880/câmera se o valor cobrir as 51) | [Patos Hoje 2019](https://patoshoje.com.br/noticias/no-valor-de-r300-mil-patos-de-minas-ganhara-25-novas-cameras-do-olho-vivo-58240.html) | CONCEPT — ambiguidade no próprio texto da notícia (25 novas vs. 51 total pelo mesmo valor) |
| Câmera speed dome / fixa / leitora de placa (LPR) — preço unitário contratual | **NÃO-MEDIDO** | Não localizado em nenhum edital/contrato lido hoje — o Edital 002/2024 não chegou às cláusulas financeiras nas páginas lidas | — |
| Poste, link de fibra por ponto/mês, armazenamento (storage) | **NÃO-MEDIDO** | Edital 002/2024 cita "sistema de armazenamento tipo storage" como item do parque existente, mas sem valor unitário | — |

---

## 4. Custo de operação

| Item | Documentado? | Fonte / observação |
|---|---|---|
| Central de monitoramento com 25 servidores/dia | Quantidade de pessoal SIM (25 servidores), custo em R$/mês NÃO | Múltiplas matérias (Patos Hoje, PatosJá) — sem valor de folha |
| Pregão 99/2025 — serviço de monitoramento de alarmes + videomonitoramento 24h (é exatamente o tipo de contrato que pagaria por operação/central terceirizada) | Existe o edital, valor NÃO extraído (PDF do DOM veio corrompido/binário para leitura de texto) | [DOM 1432, 09/09/2025](https://www.patospre.instarswe.com.br/arquivos/dom_1432_9_9_2025_assinado_08060620_09011449.pdf) — também em `pncp.gov.br/app/editais` e `licitanet.com.br`; DOM registra tentativa anterior "FRACASSADA" para o mesmo objeto |
| "R$ 320 mil/mês" (valor ouvido em reunião, citado no seu levantamento anterior) | **NÃO ENCONTRADO hoje** — nenhuma notícia, ata ou edital retornou esse número | Repita a busca focada especificamente no CONTRATO da empresa MGS com o município — nenhuma menção a "MGS" apareceu em nenhuma fonte pesquisada hoje (nem no PNCP nem na imprensa); pode ser outro nome de empresa/sigla, ou o contrato pode ser o próprio Pregão 99/2025 ainda não adjudicado |
| Contrato/empresa responsável pela central de monitoramento hoje | **NÃO-MEDIDO** — Prefeitura assumiu gestão direta desde 2020 segundo a imprensa, o que sugere operação própria (servidores municipais), não terceirização — o que tornaria o Pregão 99/2025 uma mudança de modelo (passar a terceirizar) | Inferência a confirmar por LAI |

---

## 5. O que pedir por Lei de Acesso à Informação (LAI)

**Texto pronto (5 linhas):**

> Com base na Lei de Acesso à Informação (Lei 12.527/2011), solicito cópia integral dos seguintes documentos do sistema de videomonitoramento "Olho Vivo": (1) Termo de Colaboração nº 19/2024 e todos os seus aditivos (incluindo eventual aditivo de R$ 894.960,64 de 2025), com planos de trabalho e prestações de contas; (2) valor global e vigência do Edital de Chamamento Público nº 002/2024/Olho Vivo e do(s) termo(s) de colaboração dele decorrente(s); (3) resultado e valor contratado do Pregão Eletrônico nº 99/2025 (monitoramento de alarmes e videomonitoramento 24h); (4) planilha com inventário atual de câmeras por tipo (speed dome, fixa, LPR, com reconhecimento facial) e respectivo custo unitário de aquisição/instalação; (5) contrato(s) vigente(s) de operação da central de monitoramento (empresa, valor mensal, escopo).

**Órgão e canal:**
- Prefeitura Municipal de Patos de Minas — e-SIC / ouvidoria: `https://www.patosdeminas.mg.gov.br/portal/transparencia` (link "Acesso à Informação" / e-SIC) ou protocolo presencial na Secretaria Municipal de Governo (responsável pelo Chamamento 002/2024).
- Alternativa: Consep Patos de Minas (Conselho Comunitário de Segurança Pública), que administra os recursos da emenda estadual — contato via Facebook oficial `facebook.com/conseppatos` ou nas reuniões ordinárias abertas.

---

## 6. Fontes consultadas hoje que NÃO trouxeram achado relevante (declarado para não parecer omissão)

- PNCP `/api/search/?q=videomonitoramento&...&municipios=Patos+de+Minas` → 0 resultados.
- PNCP `/api/consulta/v1/contratos` para CNPJ 18.602.011/0001-07 em 2024, 2025 e 2026 → nenhum contrato com objeto de câmera/CFTV (79 contratos revisados em 2026, dezenas em 2024/2025 — todos de outras áreas: limpeza, saúde, obras, alimentação escolar etc.).
- Busca por "MGS" associada a Patos de Minas + monitoramento → nenhum resultado.
- `camarapatos.mg.gov.br` (matéria de 2014 da Câmara) → link retornou 404 hoje (pode ter sido reestruturado o site; buscar via Wayback Machine se necessário).
- ALMG/portal de emendas (transparencia.mg.gov.br) → não consultado diretamente ainda (pista para próxima rodada, para achar o número formal da emenda estadual).

---

## Bloco JSON

```json
{
  "linha_do_tempo": [
    {"data": "2014-06", "item": "Inauguração Olho Vivo", "cameras": 16, "valor_rs": 2000000.00, "pagador": "Município + doações", "instrumento": "não identificado", "url": "https://patoshoje.com.br/noticias/cameras-do-olho-vivo-reduzem-numero-de-crimes-em-patos-de-minas-em-quase-40-47836.html", "classe": "CONCEPT"},
    {"data": "2019-07", "item": "+25 câmeras (4 LPR), total 51", "cameras": 25, "valor_rs": 300000.00, "pagador": "Parceria com empresas", "instrumento": "não identificado", "url": "https://patoshoje.com.br/noticias/no-valor-de-r300-mil-patos-de-minas-ganhara-25-novas-cameras-do-olho-vivo-58240.html", "classe": "CONCEPT"},
    {"data": "2024-09-20", "item": "Edital Chamamento Público 002/2024/Olho Vivo (parque existente: 35 speed dome + 14 fixas)", "cameras": 49, "valor_rs": null, "pagador": "Município (orçamento próprio, podendo compor com estadual/federal)", "instrumento": "Edital de Chamamento Público 002/2024/Olho Vivo, processo 28798-24-PAT-INT", "url": "https://terceirosetor.patosdeminas.mg.gov.br/downloadFile?file=dados%2Flicitacao%2F35%2Farquivo%2F105-1726696098.pdf", "classe": "REAL"},
    {"data": "2024", "item": "Emenda estadual deputada estadual para expansão, via Consep", "cameras": null, "valor_rs": 1800000.00, "pagador": "Governo de MG (emenda) via Consep", "instrumento": "emenda parlamentar estadual (nº não localizado)", "url": "https://www.patosdeminas.mg.gov.br/portal/noticias/0/3/2323/patos-de-minas-tera-maior-area-videomonitorada-do-estado-com-295--cameras", "classe": "CONCEPT"},
    {"data": "não confirmado", "item": "Termo de Colaboração 19/2024 + 1º aditivo (22 pontos + 50 câmeras LPR)", "cameras": 50, "valor_rs": 894960.64, "pagador": "não confirmado", "instrumento": "Termo de Colaboração 19/2024 + 1º aditivo", "url": null, "classe": "PHANTOM"},
    {"data": "2026-03/04 (relatado)", "item": "3º aditivo Projeto Olho Vivo — depósito já efetuado", "cameras": null, "valor_rs": 272000.00, "pagador": "Prefeitura via Consep", "instrumento": "3º aditivo Projeto Olho Vivo", "url": "https://www.folhapatense.com.br/consep-realizou-reunioes-ordinarias", "classe": "CONCEPT"},
    {"data": "2026-03/04 (relatado)", "item": "4º aditivo Projeto Olho Vivo — pendente de repasse", "cameras": null, "valor_rs": 356876.00, "pagador": "Emenda estadual (deputada estadual) via Consep", "instrumento": "4º aditivo Projeto Olho Vivo", "url": "https://www.folhapatense.com.br/consep-realizou-reunioes-ordinarias", "classe": "CONCEPT"},
    {"data": "2025-07-03", "item": "Anúncio ampliação: de 56 para meta de 295 câmeras", "cameras": 295, "valor_rs": 1500000.00, "pagador": "Emenda estadual (deputada estadual) — mesma fonte do item 2024", "instrumento": "anúncio oficial da Prefeitura", "url": "https://www.patosdeminas.mg.gov.br/portal/noticias/0/3/2323/patos-de-minas-tera-maior-area-videomonitorada-do-estado-com-295--cameras", "classe": "CONCEPT"},
    {"data": "2026-05-24", "item": "Entrega de etapa: sistema chega a 240 câmeras em 140 pontos", "cameras": 240, "valor_rs": null, "pagador": "Emenda estadual via Consep + Prefeitura (operação)", "instrumento": "solenidade pública", "url": "https://patoshoje.com.br/noticias/olho-vivo-e-ampliado-com-monitoramento-360-leitura-de-placas-e-reconhecimento-facial-em-patos-de-minas-95907.html", "classe": "CONCEPT"},
    {"data": "2025-09-24", "item": "Pregão Eletrônico 99/2025 — serviço de monitoramento de alarmes e videomonitoramento 24h (operação, não equipamento)", "cameras": null, "valor_rs": null, "pagador": "Município", "instrumento": "Pregão Eletrônico 99/2025, DOM 1432", "url": "https://www.patospre.instarswe.com.br/arquivos/dom_1432_9_9_2025_assinado_08060620_09011449.pdf", "classe": "REAL"},
    {"data": "2025", "item": "Contrato PNCP 235/2025 — peças de semáforo (fora do escopo câmera)", "cameras": null, "valor_rs": 355172.16, "pagador": "Município", "instrumento": "Contrato PNCP 235/2025", "url": null, "classe": "REAL"}
  ],
  "total_rs": 4100000.00,
  "total_cameras": 240
}
```

---

*Todo número acima carrega URL e foi acessado em 19/09/2026. Nenhum nome de pessoa física foi citado — apenas cargos (deputada estadual, prefeito, presidente do Consep). Nenhuma fonte privada/paga foi usada.*

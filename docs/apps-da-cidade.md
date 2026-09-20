# Os dois apps da Prefeitura de Patos de Minas — pesquisa OSINT (19/09/2026)

> Fonte aberta, sem PII. Classificação: REAL (visto na fonte) / CONCEPT (declarado, não confirmado ao vivo) / PHANTOM (não achado) / UNVERIFIED (sem âncora suficiente). Toda claim carrega `{evidence_url, data_acesso}`.

---

## A) Conecta Patos

### A.1 — Identificação e lojas

- **Nome exato:** "Conecta Patos" — REAL. `{https://apps.apple.com/br/app/conecta-patos/id1607344251, 19/09/2026}` `{https://play.google.com/store/apps/details?id=com.findsolucoes.app_patosminas, 19/09/2026}`
- **Publicador (App Store):** "Municipio de Patos de Minas" — REAL. `{https://apps.apple.com/br/app/conecta-patos/id1607344251, 19/09/2026}`
- **Fornecedor/plataforma técnica (white-label):** FIND SOLUÇÕES CORPORATIVAS LTDA, CNPJ 19.810.139/0001-29, sede Divinópolis/MG, atividade principal desenvolvimento/licenciamento de software, empresa ativa desde 28/02/2014 — REAL. `{https://cnpjrocks.com/cnpj/19810139000129/find-solucoes-corporativas-ltda.html, 19/09/2026}`. O produto white-label roda sob a marca comercial **App Cidades** (`appcidades.com.br`, subdomínio `patosdeminasmg.appcidades.com.br`) — REAL, mesma empresa por trás de apps homônimos em outros municípios (ex. "Conecta Prata", "Cataguases Mais") — REAL. `{https://appcidades.com.br/, 19/09/2026}` `{https://play.google.com/store/apps/details?id=com.findsolucoes.app_prata, 19/09/2026}`
- **Lançamento:** 16/02/2022, substituindo o app anterior "Patos Conectado" — REAL. `{https://patoshoje.com.br/noticias/prefeitura-lanca-conecta-patos-novo-aplicativo-para-receber-e-atender-as-demandas-da-populacao-72049.html, 19/09/2026}` `{https://www.em.com.br/app/noticia/gerais/2022/02/16/interna_gerais,1345380/prefeitura-de-patos-de-minas-lanca-aplicativo-para-simplificar-atendimento.shtml, 19/09/2026}`
- **Última atualização (App Store):** 28/08/2024, versão 2.22.18 — REAL. `{https://apps.apple.com/br/app/conecta-patos/id1607344251, 19/09/2026}`
- **Tamanho:** 148,3 MB (iOS), requer iOS 15.6+ — REAL. `{https://apps.apple.com/br/app/conecta-patos/id1607344251, 19/09/2026}`
- **Categoria:** Produtividade — REAL. `{https://apps.apple.com/br/app/conecta-patos/id1607344251, 19/09/2026}`
- **Nota e avaliações (App Store):** 2,6–2,7 de 5, com 14–15 avaliações (a ferramenta de busca retornou os dois valores em consultas diferentes no mesmo dia; tratar como ~15, ⚪ não recontado ao vivo nesta sessão) — REAL. `{https://apps.apple.com/br/app/conecta-patos/id1607344251, 19/09/2026}`
- **Google Play — downloads, nota, nº avaliações, permissões, tamanho:** PHANTOM nesta pesquisa. A ferramenta de busca localizou a URL (`play.google.com/store/apps/details?id=com.findsolucoes.app_patosminas`) mas o fetch direto da página truncou antes de expor os campos numéricos, e a busca por snippet não indexou esses valores. **Pendência: abrir a URL manualmente ou via browser real para os 4 números que faltam.**

### A.2 — Funcionalidades declaradas

Fonte: reportagens de lançamento (Estado de Minas, Patos Hoje, Patos Notícias) + descrição de loja — REAL, cruzado em 2+ fontes:

1. **Serviços** (aba) — solicitação de documentos e serviços administrativos
2. **Utilidade pública** (aba) — telefones úteis / informações institucionais
3. **Ocorrências** (aba) — **TRÂNSITO/MOBILIDADE.** Permite abrir chamados em: Defesa Civil, Denúncias, Meio Ambiente, Saúde Pública, Serviços e **Trânsito**; cada demanda é classificada por natureza (sugestão, solicitação, pergunta, reclamação)
4. **Turismo** (aba) — infraestrutura municipal: academias, espaços de eventos, hotéis, instalações esportivas, restaurantes, supermercados
5. **Notícias** (aba) — comunicação institucional
6. **Campanhas** (aba) — campanhas municipais
7. **Cartão de vacinação digital**
8. **Reparos** (buracos, lâmpadas queimadas) — citado tanto no lançamento quanto numa avaliação negativa de usuário como função que deixou de funcionar (ver A.4)
9. **Enquetes/pesquisas** — a descrição de loja (Google Play, capturada via busca) menciona "enquetes e comunicação de informações por parte do município" — REAL mas não confirmado com screenshot/fetch direto; classificar CONCEPT até re-verificação
10. **Emprega Patos** (novo, fev/2026) — módulo de vagas de emprego dentro do Conecta Patos, ligado à Secretaria de Desenvolvimento Social / Promam 5.0, cadastro de vagas e currículos sem custo — REAL, é atualização recente, não presente na versão de lançamento de 2022. `{https://patoshoje.com.br/noticias/prefeitura-de-patos-de-minas-lanca-plataforma-para-facilitar-acesso-a-vagas-de-emprego-94567.html, 19/09/2026}` `{https://www.patosdeminas.mg.gov.br/portal/noticias/0/3/2438/prefeitura-investe-em-tecnologia-para-impulsionar-emprego-e-renda/, 19/09/2026}`

**Funções de trânsito/mobilidade confirmadas:** só a categoria "Trânsito" dentro da aba Ocorrências (chamado/reclamação). **Não há evidência de:** mapa de trânsito em tempo real, integração com semáforos, dados de ônibus/GTFS, ou qualquer camada de mobilidade além do canal de reclamação — PHANTOM (não encontrado em nenhuma fonte).

### A.3 — Participação, geolocalização, foto, acompanhamento

- **Enquete/votação/pesquisa:** CONCEPT — só na descrição de loja resumida pela busca ("enquetes e comunicação de informações"), sem confirmação visual direta.
- **Geolocalização no chamado:** UNVERIFIED — nenhuma fonte nesta pesquisa confirma ou nega. Prática comum em apps AppCidades/similares mas não citada especificamente para Patos de Minas.
- **Foto no chamado:** UNVERIFIED — mesma situação.
- **Acompanhamento do chamado pelo cidadão:** REAL, mas com qualidade contestada pelos próprios usuários — a matéria de lançamento diz que o app permite "acompanhar a evolução de cada chamado aberto no sistema"; avaliações de loja (ver A.4) descrevem trechos do fluxo como quebrados.
- **Pendência declarada:** os itens acima exigiriam abrir o app de fato (não é dado aberto puro) ou obter capturas de tela da loja — fora do escopo desta pesquisa de fonte aberta em texto.

### A.4 — Reclamações e elogios nas avaliações da loja (App Store, sem nome de pessoa)

5 citações curtas — REAL, texto extraído das avaliações públicas da App Store:

1. "App já tem mais de 1 ano que não se consegue mais ver guias e pagar IPTU pelo app" (fev/2025)
2. "Que aplicativo lixo!! Mesmo atualizado ele trava falando que tem que atualizar! Aí quando entra aqui não tem atualização" (dez/2024)
3. "agora não consigo mais comunicar sobre os serviços básicos como lâmpadas queimadas, buracos nas ruas" (parafraseado da mesma leva de avaliações)
4–5. Não foi possível extrair mais 2 citações distintas sem reabrir a página completa de avaliações (a ferramenta de busca só devolveu 3 trechos únicos) — pendência.

`{https://apps.apple.com/br/app/conecta-patos/id1607344251, 19/09/2026}`

### A.5 — API, dados abertos, estatística pública de chamados

- **API/portal de dados abertos/exportação de chamados:** PHANTOM — nenhuma fonte encontrada. Não há página de estatísticas públicas equivalente ao `1746.rio/portal/estatistica` (Rio) para o Conecta Patos.
- **Estatística de chamados publicada pela prefeitura:** PHANTOM nesta pesquisa — não localizada.

### A.6 — Contrato público com a Find Soluções / App Cidades

- **Registro em PNCP especificamente para Patos de Minas + Find Soluções/App Cidades:** PHANTOM — busca direcionada por razão social e por CNPJ não retornou resultado no PNCP nem no Portal da Transparência.
- **Precedente de contratação do mesmo produto noutro município (prova de que o modelo é licitado, não gratuito):** REAL — Prefeitura de Bambuí/MG fez pregão eletrônico para "Implantação APP Cidades" (serviço de TI continuado). `{https://bambui.mg.gov.br/transparencia/licitacoes/pregao-eletronico/implantacao-app-cidades, 19/09/2026}`
- **Valor e vigência do contrato de Patos de Minas:** PHANTOM — não encontrado; **pendência para quem tiver acesso ao portal de transparência/licitações de Patos de Minas diretamente (não indexado pela busca).**
- Achado colateral (fora do escopo mas relevante para due diligence): TCE-MG tem registro de "licitações irregulares em Patos de Minas" — não confirmado se relacionado ao Conecta Patos; não investigado a fundo (fora do pedido). `{https://www.tce.mg.gov.br/Noticia/Detalhe/111222, 19/09/2026}`

---

## B) Patos Premia

### B.1 — Base legal e operação

- **Nome oficial:** "Patos Premia" (programa municipal de incentivo fiscal) — REAL.
- **Lei que institui:** Lei Complementar nº 671, de 25/07/2022, autoriza o Município a instituir o Programa Patos Premia — REAL. Regulamentado por decreto (Decreto nº 5.409/2023, depois substituído/complementado pelo Decreto nº 5.461/2023) — REAL. `{https://leismunicipais.com.br/a/mg/p/patos-de-minas/decreto/2023/541/5409/decreto-n-5409-2023-regulamenta-a-lei-complementar-n-671-de-25-de-julho-de-2022-que-autoriza-o-municipio-de-patos-de-minas-a-instituir-o-programa-patos-premia-e-da-outras-providencias, 19/09/2026}`
- **Reestruturação recente:** Lei Complementar nº 712 (2024) e Decreto nº 5.860 (2024) — citados no site oficial patospremia.com.br como base de uma versão atualizada do programa; conteúdo integral do decreto/lei não lido nesta sessão — CONCEPT (declarado na fonte primária do programa, texto legal completo não verificado linha a linha). `{https://patospremia.com.br/, 19/09/2026}`
- **Órgão responsável:** Prefeitura de Patos de Minas / Secretaria de Fazenda (inferido pelo tipo de programa — fiscal/NFS-e — mas não citado nominalmente como "secretaria de fazenda" em nenhuma fonte lida) — UNVERIFIED quanto ao nome exato da secretaria.
- **Como funciona:** só participam Notas Fiscais de Serviços Eletrônica (NFS-e) emitidas por prestadores de Patos de Minas **e que incluam o CPF do tomador**; cupom fiscal comum não pontua; bilhetes são creditados após validação da nota, ou após o dia 20 do mês seguinte; bilhete tem validade de 365 dias e concorre em todos os sorteios dentro desse prazo; nota cancelada pelo emissor cancela os bilhetes automaticamente — REAL, FAQ oficial. `{https://www.patospre.instarswe.com.br/-perguntas-frequentes/, 19/09/2026}`
- **Contribuinte com IPTU parcelado:** pode participar de sorteio desde que as parcelas estejam em dia — REAL.
- **Divulgação de ganhadores:** Diário Oficial do Município + site oficial — REAL.

### B.2 — É app próprio, site, ou dentro do Conecta Patos?

- É **site/portal próprio** (`patospremia.com.br`, com backend em `patospre.instarswe.com.br`) — não é uma aba do Conecta Patos e não foi encontrada nenhuma fonte que descreva integração entre os dois. Classificar como **produto separado do Conecta Patos** — REAL quanto à existência de domínio próprio; **PHANTOM quanto a qualquer integração declarada com o Conecta Patos** (nenhuma fonte menciona uma ponte entre os dois sistemas).
- Cadastro: pelo site oficial (fluxo específico não detalhado nas páginas capturadas — a FAQ fala de "registro" de proprietário de imóvel/contribuinte, mas não descreve passo a passo o formulário) — UNVERIFIED quanto ao detalhe exato do fluxo de cadastro.

### B.3 — Prêmios, periodicidade, nº de participantes

- **Prêmios já distribuídos (2025):** bicicletas, dinheiro (ex.: R$ 3.000 e R$ 1.000 em sorteio de 15/05/2025 baseado na Loteria Federal), smart speaker, air fryer, caixa de som — REAL. `{https://www.patosdeminas.mg.gov.br/portal/noticias/0/3/2304/patos-premia-ja-distribuiu-25-premios-e-segue-com-novos-sorteios-ate-dezembro/, 19/09/2026}`
- **Nº de contemplados citado:** 25 cidadãos em 2 sorteios do início de 2025, com "novos sorteios até dezembro" — REAL, mas é contagem parcial do ano, não total histórico do programa (desde 2022) — universo declarado: **25 de N sorteios/participantes desde a criação, N não publicado nesta fonte.**
- **Periodicidade:** sorteios recorrentes ao longo do ano, alguns amarrados ao resultado da Loteria Federal — REAL quanto ao mecanismo, não há calendário fixo publicado nas fontes lidas.
- **Total de participantes cadastrados/notas emitidas no programa:** PHANTOM — não encontrado em nenhuma fonte.

### B.4 — Premiou comportamento além de nota fiscal?

- **Nas fontes lidas:** não — o mecanismo é 100% ancorado em emissão de NFS-e com CPF do tomador; regularidade fiscal e pagamento de IPTU/parcelamentos são pré-requisitos de elegibilidade, não geradores de bilhete por si só.
- **Previsão legal para ampliar o que gera bilhete (ex. participação cívica, evento, doação):** PHANTOM — nenhuma cláusula encontrada que prevista bilhete por ação que não seja fiscal/tributária. Isso é relevante para a proposta do hackathon: **hoje a lei do Patos Premia é estritamente fiscal — estender para "bilhete por comportamento de mobilidade" exigiria mudança legal, não é coberto pelo desenho atual.**

### B.5 — Quem opera, contrato público

- Plataforma técnica: `instarswe.com.br` aparece como backend/hospedagem do site do programa (`patospre.instarswe.com.br`) — indício de fornecedor terceirizado (Instar Software, não confirmado o nome completo da empresa nem contrato) — UNVERIFIED, pendência de checagem direta em PNCP/portal de transparência do município.
- Contrato público (valor, vigência): PHANTOM — não encontrado.

---

## C) Referências de gamificação cívica com resultado medido

| # | Caso | Cidade/país, ano | Mecânica | Quem pagou | Resultado medido | O que deu errado | Nível de prova |
|---|---|---|---|---|---|---|---|
| 1 | **Nota Fiscal Paulista** | São Paulo, desde 2007 | Nota com CPF → créditos → sorteios/restituição | Governo estadual (ICMS) | **Misto.** Estudos rigorosos (Mattos, Rocha & Toporcov 2013 e sucessores) acham efeito **limitado/não significativo** na arrecadação agregada — crescimento médio ICMS ~23% SP vs ~24% em estados sem o programa; efeito positivo mais claro só no setor terciário (+5 a 10%, prêmios +até 2%) | Após 10 anos (2017), desinteresse popular, objetivo de educação fiscal já atingido, programa virou alvo de fraude via doação de cupom fiscal | REAL, com número e citação de estudo acadêmico |
| 2 | **"Nota Premiada" (modelo genérico replicado por outros estados)** | Vários estados BR | Igual à NFP | Governo estadual | Pesquisa citada conclui aumento **significativo** de arrecadação ICMS — número exato não capturado nesta busca | Não detalhado nesta busca | CONCEPT (achado citado por fonte secundária, não lido o paper original) |
| 3 | **Waze Connected Citizens Program / Waze for Cities** | Rio de Janeiro (piloto, 2013) → global | Troca de dados: Waze dá trânsito em tempo real, cidade dá dados de obras/interdições | Sem custo financeiro directo — troca de dados | Programa cresceu de 10 parceiros (2014) para >800 cidades (2018) e >1.000 hoje, 70 no Brasil; casos de uso: detecção de cruzamentos que precisam de semáforo, otimização de rota de coleta de lixo (Rio), localização de semáforos quebrados (SP) | Nenhuma métrica de "resultado" única e generalizável publicada — cada cidade mede o que quer; não é programa de recompensa ao cidadão, é troca institucional B2G | REAL quanto à adoção; CONCEPT quanto a "resultado medido" único |
| 4 | **INSINC / Travel Smart Rewards (peak-avoidance)** | Singapura, piloto NUS+Stanford desde jan/2012, virou LTA "Travel Smart Rewards" | Créditos proporcionais à distância + bônus por viajar fora do pico + "caixa mágica" com metas semanais + ranking social entre amigos + sorteio/conversão em dinheiro no cartão EZ-link | Land Transport Authority (governo) | **Redução de 7–8% nos deslocamentos no pico da manhã desde 2013**, atribuída ao conjunto de iniciativas (INSINC + desconto pré-pico + passe mensal fora de pico) | Sucesso dependia de engajamento contínuo — quem visitava pouco o site/app não mudava comportamento; versão sucessora (Travel Smart Rewards) foi criticada por ficar muito menos generosa (~100 viagens para ganhar S$1) | REAL, com número e paper acadêmico (Stanford) |
| 5 | **Colab (app cívico BR)** | Brasil, múltiplos municípios, uso contínuo | Fiscalize/Proponha/Avalie + gamificação (ranking de amigos, "missões") | Modelo SaaS pago por prefeitura (não é premiação em dinheiro ao cidadão) | >450 mil usuários cadastrados, 300 mil publicações, 490 mil respostas em consultas (número institucional da empresa, não auditoria externa) | Estudo acadêmico (26 municípios): participação concentrada — **24,9% de toda a participação veio de só 3 cidades** (Novo Hamburgo/RS, Paraopeba/MG, Pelotas/RS); usuário típico é homem adulto — viés de quem participa medido e nomeado pelo próprio estudo | REAL quanto ao número institucional (fonte é a própria empresa — só CONCEPT); REAL quanto ao viés (fonte é paper acadêmico independente) |
| 6 | **Central 1746 (Rio de Janeiro) — canal de chamados urbanos, sem gamificação/prêmio** | Rio de Janeiro, desde 2011 | Multicanal (telefone 80%/app 12%/portal 6%/presencial — dado antigo; levantamento 2021–2024 já mostra telefone 41,8%, app+web empatados em 20,7% cada, WhatsApp 11,7%) | Município | 3 milhões de chamados entre 2021–2024, média de 68,7 mil/mês, pico de 75 mil/mês em 2024; 75% dos chamados antigos foram solucionados pelos órgãos | Não é caso de gamificação — é referência de **volume e distribuição de canal** para comparar com o Conecta Patos (que não publica número equivalente) | REAL, números de fonte jornalística (Agência Lupa) cruzando dado oficial |
| 7 | **SP156 (São Paulo)** | Citado como referência no pedido, não pesquisado a fundo nesta sessão | — | — | — | — | PHANTOM — não pesquisado; fica como lacuna declarada |
| 8 | **Cidadão / Fix My Street (outras plataformas de reporte urbano citadas no pedido)** | — | — | — | — | — | PHANTOM — não pesquisado; fica como lacuna declarada |

**Nota de honestidade metodológica:** dos 6–10 pedidos, **5 têm número publicado com link** (#1, #4, #5-parcial, #6, e o crescimento de adoção do #3); **#2 é citação de citação** (não lido o paper primário); **#7 e #8 são lacunas puras** — não foram pesquisados nesta rodada por tempo/escopo, não por ausência de fonte.

---

## D) O que dá errado em gamificação cívica (com fonte)

1. **Viés de quem participa não é a população.** Estudo do Colab (26 municípios BR) mediu que 24,9% de toda a participação veio de apenas 3 cidades, e que o perfil dominante é homem adulto — os próprios autores apontam isso como problemático para quem defende gamificação como via de ampliar a democracia representativa. `{https://periodicos.ufca.edu.br/ojs/index.php/cienciasustentabilidade/article/download/1133/790/, 19/09/2026}`
2. **Decaimento de engajamento sem manutenção ativa.** No INSINC (Singapura), o antes-e-depois mostrou que usuários que raramente visitavam a plataforma não mudavam de comportamento — engajamento contínuo era pré-condição do resultado, não consequência automática do incentivo. `{https://web.stanford.edu/~balaji/papers/13INSINC.pdf, 19/09/2026}`
3. **Fraude/gaming do sistema.** A Nota Fiscal Paulista, depois de 10 anos, alimentou uma "indústria crescente de fraudes" ligada à doação de cupons fiscais para entidades — motivou mudança de desenho do programa. `{https://portal.fazenda.sp.gov.br/servicos/nfp/Paginas/Introducao.aspx, 19/09/2026}` (achado citado via múltiplas fontes secundárias que remetem à Fazenda-SP)
4. **Efeito agregado menor do que o esperado.** Estudos rigorosos sobre a NFP acham impacto **limitado ou não significativo** na arrecadação total de ICMS quando comparado a estados sem o programa — o ganho real concentrou-se em setores específicos (terciário) e em geração de dado, não em arrecadação bruta. Isso é um alerta direto para qualquer proposta de hackathon que prometa "resultado" sem controle/baseline. `{https://redalyc.org/jatsRepo/5142/514262384006/html/index.html, 19/09/2026}`
5. **LGPD do cadastro — risco declarado, não medido neste caso específico.** A busca não encontrou um caso brasileiro de gamificação cívica com incidente de LGPD documentado publicamente; o risco é discutido apenas em nível genérico/corporativo (blogs de compliance), não em um caso urbano nomeado — classificar como **risco teórico com literatura de apoio, sem fato gerador medido em app cívico BR.**

---

## Resumo do que faltou (universo declarado — R-FALTA-DO-TODO-001)

- Google Play: downloads, nota, nº avaliações, permissões, tamanho — não capturados (fetch truncado; pendência de captura manual).
- Geolocalização e foto no chamado do Conecta Patos — não confirmados nem negados por nenhuma fonte textual.
- Contrato/valor/vigência Find Soluções × Patos de Minas — não encontrado no PNCP nem no Portal da Transparência (busca indexada; pode existir só no portal municipal próprio, não vasculhado por não ser "fonte pública indexada" simples).
- Fornecedor exato do backend do Patos Premia (`instarswe.com.br`) — identificado o domínio, não a razão social/contrato.
- Casos #7 (SP156) e #8 (Cidadão/Fix My Street) da lista de referências — não pesquisados, lacuna pura de tempo/escopo desta rodada.

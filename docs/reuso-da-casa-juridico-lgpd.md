# O que já temos pronto e onde encaixa no Visão de Rota
Levantado em 19/09 por varredura de `~/egos` (docs/legal, docs/governance, templates, central-egos, packages). Conferido por mim: os 2 padrões de placa, os 7 arquivos de contrato, o playbook, o adendo de dados, o molde de proposta e a ausência do molde de relatório de impacto. O resto é leitura do agente, ainda não reaberta.

| Peça pronta | Onde está | Encaixa em | Esforço |
|---|---|---|---|
| Detector de dado pessoal brasileiro (CPF, CNPJ, RG, CNH, telefone, e-mail, **placa antiga e Mercosul**), roda sem rede, v0.2.4 | `packages/guard-brasil/` | **Porta de entrada de dados**: payload com placa/CPF é recusado antes de gravar. E cinto de segurança em todo relatório que sai. | baixo |
| Processo de contrato em 8 fases + defeitos já medidos nos 7 contratos | `docs/legal/PLAYBOOK_CONTRATO.md` | Semana 0 do piloto: enquadrar (serviço × licença × misto) antes de minutar | baixo |
| Contrato de serviço com cláusula de proteção de dados (controlador/operador, subprocessadores) | `docs/legal/contratos/CONTRATO_SERVICO_TEMPLATE.md` | Base do contrato do piloto; trocar para contratação pública (Lei 14.133) | médio |
| Adendo de tratamento de dados | `central-egos/docs/operations/CENTRAL_EGOS_DPA.md` | Cláusulas de dados do instrumento de acesso às imagens (prefeitura = controladora, nós = operadora) | médio |
| Termo de confidencialidade | `docs/legal/contratos/NDA_TEMPLATE.md` | Antes de qualquer acesso à infraestrutura de câmeras | baixo |
| Produto para governo já existente: planos, piloto, critério de aceite | `docs/legal/contratos/contrato-monitor-publico.md` | Estrutura de plano/piloto/aceite; estender de 30 para 90 dias. Não tem cláusula de dados. | médio |
| Molde de proposta por frentes decidíveis | `templates/fase-zero/PROPOSTA_TEMPLATE.md` | Proposta do diagnóstico + piloto à secretaria | médio |
| "Número não medido não entra" + 4 estados | `templates/fase-zero/CONTRATO_DADOS_DASHBOARD.md` | Já é a regra das 3 etiquetas do painel; vira anexo técnico do contrato | baixo |
| Política de retenção e incidente | `docs/governance/LGPD_ATPP_COMPLIANCE.md` | Anexo de retenção: contagem agregada fica; imagem nunca é guardada | médio |
| Mapa de risco de contratação pública (art. 14 da 14.133: quem faz o projeto não disputa a obra; contrato de solução inovadora como melhor via) | `docs/governance/EGOS_COMERCIO_PLANO_UNICO.md` ~L969-982 | Fala de preço na banca e escolha da via. O próprio texto se declara pesquisa incompleta. | médio |

## O que falta (busca feita em `~/egos`, arquivos .md)
- Minuta de **acordo de cooperação para acesso a imagem de câmera pública** — `grep -rniE "acordo de cooperac"` voltou vazio. Temos as 8 cláusulas em `base-legal-cameras.md` (pasta ao lado): é o ponto de partida.
- Molde de **relatório de impacto à proteção de dados** — citado como "a criar" em `LGPD_ATPP_COMPLIANCE.md:163`; `ls docs/legal/contratos/DPIA*` não acha nada.
- **Leitura de vídeo** (contar veículo em imagem) — nessa varredura só apareceu um plano de análise forense de gravação, marcado como conceito, que é outro produto. É a etapa a construir ou contratar.
- Piloto de 90 dias como padrão: os da casa são de 30.

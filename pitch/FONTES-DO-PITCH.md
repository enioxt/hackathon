# Fontes do pitch — todo número visível no deck, com fonte e como conferir

> Regra do dono (20/09, correção de rota): todo número visível no slide carrega legenda de fonte + data, ou "MEDIDO hoje, nesta máquina" + arquivo. Afirmação sem número não precisa de fonte.

| Slide | Número | Fonte | Como conferir |
|---|---|---|---|
| 2 | 22.708 sinistros em Patos, 2018–ago/2026 | RENAEST, dado aberto federal, extração de 13/08/2026 | `pacote-para-o-deck/NUMEROS-COM-FONTE.md` · https://dados.transportes.gov.br/dataset/renaest |
| 2 | 30% dos sinistros têm moto envolvida (6.818 de 22.708) | mesma base RENAEST | mesmo dataset acima |
| 2 | ~40% (38–44% conforme a grade) das ocorrências com coordenada caem em 5 de ~90 quadrantes de 1 km | SEJUSP-MG, dado aberto estadual, 1.100 ocorrências, 2025–início de 2026 | https://dados.mg.gov.br/dataset/sejusp_vitimas_acidentes_transito |
| 3 | ~R$ 20 mil por posto, 3 dias — contagem convencional | Tabela de preços de órgão rodoviário estadual (DAER-RS), item 1.8, data-base jan/2021 | https://www.daer.rs.gov.br/upload/arquivos/202109/27181957-tabela-projeto-21.pdf |
| 3 | R$ 7,95 milhões contratados em videomonitoramento, 2024–2029 | PNCP, contrato municipal 206/2024 — valor global, não é valor pago | https://pncp.gov.br |
| 4 | 689 contratações públicas de mobilidade no Brasil, 2024–2026 | PNCP — levantamento do time (`dados/editais-mobilidade-pncp-2024-2026.json`, campo `todas_contratacoes_mobilidade`) | `python3 -c "import json;print(len(json.load(open('dados/editais-mobilidade-pncp-2024-2026.json'))['todas_contratacoes_mobilidade']))"` |
| 5 | 6,5 quadros por segundo (152,6 ms por quadro) — leitura de todos os 1.396 quadros do vídeo 1, nesta máquina, CPU de notebook sem placa de vídeo | `(arquivo local do time) maximo/leitura-maximo.log` (saída do próprio leitor) | `grep "quadros processados" 5-motor/patos-real/maximo/leitura-maximo.log` |
| 5 | 1.396 quadros lidos, vídeo de 23 s (celular 1) | `(arquivo local do time) maximo/patos-1.json` (contagem de `quadros`) | `python3 -c "import json;print(len(json.load(open('5-motor/patos-real/maximo/patos-1.json'))['quadros']))"` |
| 6 | 1.100 ocorrências geolocalizadas (mapa de concentração) | SEJUSP-MG, mesmo dataset da linha acima, tela `/insights` | https://dados.mg.gov.br/dataset/sejusp_vitimas_acidentes_transito |
| 7 | Vídeo filmado do alto (vídeo 6) — 6 automóveis, 2 ônibus, 1 pedestre em 59 s; leitura da máquina, NÃO conferida à mão | `(arquivo local do time) maximo/patos-6.jsonl` | `cat 5-motor/patos-real/maximo/patos-6.jsonl` |
| 7 | Vídeo 3 — 4 automóveis, 1 moto, 1 pedestre em 42 s | `(arquivo local do time) maximo/patos-3.jsonl` | `cat 5-motor/patos-real/maximo/patos-3.jsonl` |
| — (mencionado no roteiro, não no slide) | Vídeo 4 — 4 automóveis em 20 s | `(arquivo local do time) maximo/patos-4.jsonl` | `cat 5-motor/patos-real/maximo/patos-4.jsonl` |

## Números considerados e descartados por falta de fonte confiável neste prazo
- **"notebook de 2018"** — não encontrado registrado em nenhum arquivo do projeto; usei a frase já existente e verificada nos docs do repo ("roda em CPU comum, sem placa de vídeo dedicada", `repo/demo/patos-real/relatorio.html:255` e `:276`).
- **Tamanho/tendência de mercado** — sem fonte própria; o deck e o roteiro evitam número aqui, como pedido.

## Links citados no deck/roteiro
- Site: https://enioxt.github.io/hackathon/
- RENAEST: https://dados.transportes.gov.br/dataset/renaest
- SEJUSP-MG: https://dados.mg.gov.br/dataset/sejusp_vitimas_acidentes_transito
- DAER-RS (tabela de preços): https://www.daer.rs.gov.br/upload/arquivos/202109/27181957-tabela-projeto-21.pdf
- PNCP: https://pncp.gov.br

| 7 | Pessoa × máquina no vídeo 3: à mão 4 carros, 1 moto, 1 ônibus; máquina 4 automóveis, 1 moto, 0 ônibus (o ônibus passa no fim e não completa o cruzamento) | `repo/demo/patos-real/relatorio.html` (seção Pessoa × máquina) + `maximo/patos-3.jsonl` | abrir o relatório; amostra única de 42 quadros |

## Número retirado em 20/09 (erro achado olhando o vídeo)
- **"Vídeo 1 — 17 automóveis em 23 s"**: o leitor registrou 17 cruzamentos, mas o celular girou durante a gravação e a linha passou por cima de carros ESTACIONADOS. Não é contagem de tráfego. Fica só como exemplo de por que a câmera precisa estar fixa.

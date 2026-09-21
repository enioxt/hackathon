# Provas — cada afirmação a um clique

Regra do time: **número sem prova não entra no pitch.** Aqui está cada coisa que afirmamos, de onde vem e como você mesmo confere. Achou um número nosso que não está nesta página? É defeito: avise.

## Confira tudo de uma vez
```
python3 motor/provar.py
```
Recalcula 14 números direto dos arquivos de dados e diz ✔ ou ✘ para cada um. Não usa internet. Última rodada: 14 de 14.
Ele já pegou um erro nosso: dizíamos "1.100 acidentes, 19 fatais". São **18 ocorrências fatais com 19 vítimas**. Unidades diferentes; corrigido.

## MEDIDO — dado real, com arquivo
| Afirmação | Valor | Prova | Fonte original |
|---|---|---|---|
| Ocorrências de trânsito de Patos com coordenada (2025 + início de 2026) | 1.100 | [`acidentes-patos-sejusp-mg.json`](../dados/publicos/acidentes-patos-sejusp-mg.json) | Dados abertos do Estado de MG (dados.mg.gov.br), banco de vítimas de acidente de trânsito |
| Graves ou fatais | 132 (114 + 18) | mesmo arquivo, campo `pior` | idem |
| Sinistros em Patos, 2018 a ago/2026 | 22.708 | [`acidentes-renaest-patos.json`](../dados/publicos/acidentes-renaest-patos.json) | Base nacional aberta de sinistros (RENAEST), extração de 13/08/2026 |
| Óbitos na mesma base | 140 | mesmo arquivo | idem |
| Moto presente em | 30,0% (6.818) | mesmo arquivo · detalhe em [`acidentes-motos-patos.json`](../dados/publicos/acidentes-motos-patos.json) | idem |
| Fontes públicas levantadas | 83 | [`fontes-verificadas.json`](../dados/publicos/fontes-verificadas.json) · arquivos baixados com hash em [`MANIFEST-arquivos-baixados.sha256`](../dados/publicos/MANIFEST-arquivos-baixados.sha256) | cada item tem o endereço de origem |
| Contratações públicas de mobilidade (2024 a 2026) | ver arquivo | [`editais-mobilidade-pncp-2024-2026.json`](../dados/publicos/editais-mobilidade-pncp-2024-2026.json) | Portal Nacional de Contratações Públicas |
| Teto de dispensa de licitação em 2026 | R$ 65.492,11 | [`pesquisa/precificacao-decisao.md`](pesquisa/precificacao-decisao.md) | Lei 14.133/2021, art. 75 II, atualizado pelo Decreto 12.807/2025 (Planalto) |

## SIMULAÇÃO — conta nossa sobre dado real
| Afirmação | Valor | Prova | Como refazer |
|---|---|---|---|
| Câmeras necessárias para cobrir 25 / 50 / 75 / 90% das ocorrências a até 100 m | 33 / 94 / 207 / 357 | [`simcam-curva.json`](../dados/publicos/simcam-curva.json) | `python3 motor/simcam.py` |
| Cobertura com 100 câmeras | 51,8% das ocorrências | mesma curva | idem |
| Custo de desenvolver, equipar e operar | R$ 264 mil · R$ 62 mil · R$ 67 mil/ano | [`painel/simulador.html`](../painel/simulador.html) (fórmulas abertas na página) | troque cidade, frota e população e veja a conta |

"Posição de câmera" na simulação é célula escolhida por cálculo, não câmera que existe.

## O QUE RODA — prova é o teste
| Afirmação | Prova | Como refazer |
|---|---|---|
| A porta de entrada recusa placa, CPF e imagem, e só grava o que é válido | [`motor/entrada-de-dados/api.test.ts`](../motor/entrada-de-dados/api.test.ts) — 11 testes | `cd motor/entrada-de-dados && bun test api.test.ts` |
| O leitor conta 1 vez por veículo, separa sentidos e não grava imagem | [`motor/leitor-video/test_leitor.py`](../motor/leitor-video/test_leitor.py) — 7 testes | `cd motor/leitor-video && python3 -m pytest -q` |
| Vídeo → leitor → porta de entrada → estado, de ponta a ponta | feito 1 vez em 19/09, com vídeo de licença livre | comando no [`LEIA.md`](../motor/leitor-video/LEIA.md) |
| Primeira comparação pessoa × máquina em vídeo de Patos | [`demo/patos-real/relatorio.html`](../demo/patos-real/relatorio.html): carro 4/4, moto 1/1, ônibus 1/0 | é **amostra inicial**, não taxa de acurácia; ampliar antes de qualquer promessa |
| O hub de ideias se atualiza sozinho | [rotina no repositório público](https://github.com/enioxt/hackathon/blob/main/.github/workflows/hub.yml) | testado com uma ideia de teste, depois removida |

## DADO SINTÉTICO — inventado para demonstrar, e está escrito na tela
No **painel de demonstração**, os cenários de fluxo/fila/espera, alertas, vagas, frota e efeito de intervenção continuam sendo gerados por fórmula com semente fixa quando marcados como sintéticos. Os vídeos reais de Patos e as medições publicadas em `demo/patos-real/` são outra classe de evidência. **Sintético não é medição nem previsão.**

## O que AINDA NÃO tem prova — e não entra no pitch como fato
| Afirmação | Situação |
|---|---|
| Qualidade da contagem do leitor de vídeo | existe uma primeira amostra manual pequena em vídeo de Patos (4/4 carros, 1/1 moto, 1/0 ônibus); ainda falta amostra maior, múltiplos horários/ângulos e erro por classe antes de publicar acurácia |
| Número de câmeras da cidade | três versões: 240 (imprensa), 300 e 700 (ditas em reunião). Nenhum documento resolve |
| "R$ 120 mil por radar" | não encontrado em contrato público; provável confusão com R$ 150 a 200 mil por cruzamento inteligente, dito pelo diretor |
| Custo de um centro de controle completo "da ordem de R$ 320 mil/mês" | fala do diretor, estimativa futura, transcrição automática; não é documento |
| Moto em 49,6% dos sinistros com óbito | calculado por um agente; ainda não reconferido por nós |
| Compras de câmera da cidade somando R$ 4,1 milhões | levantamento parcial; um aditivo citado não foi confirmado em segunda pesquisa |
| Pitch cabe em 5 minutos | escrito, não ensaiado com cronômetro |

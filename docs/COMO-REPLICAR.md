# Como replicar em outra cidade

A ideia central: **o sistema é feito de peças pequenas que rodam sozinhas.** Levar para outra cidade é instalar as peças num servidor comum, ligar as fontes de dado de lá e calibrar. Não é refazer.

## As peças, e o que cada uma precisa
| Peça | O que faz | Precisa de IA paga? | Estado hoje | Onde está |
|---|---|---|---|---|
| Leitor de vídeo | Conta carro, moto, ônibus, caminhão, bicicleta e pedestre por cruzamento de linha. Não grava imagem | **Não.** Modelo de visão pré-treinado, roda na máquina | Roda; qualidade ainda não medida em vídeo de rua | `motor/leitor-video/` |
| Porta de entrada | Recebe contagens de qualquer fonte, recusa placa, CPF e imagem | **Não** | Roda, 11 testes | `motor/entrada-de-dados/` |
| Banco e agregador | Guarda contagens, calcula média por hora e antes×depois | **Não.** Conta determinística | Roda | `motor/entrada-de-dados/db.ts` |
| Painel do gestor | Mapa, pontos, antes×depois, 5 layouts | **Não** | Roda com dado público real + dado sintético etiquetado | `docs/gestor.html` |
| Adaptadores de fonte | Um arquivo pequeno por fabricante de câmera, planilha ou API | **Não** | Modelo comentado + importador de planilha | `motor/entrada-de-dados/fontes/` |
| Assistente de conversa | Responde perguntas do gestor lendo os dados | **Sim**, e é a única peça que precisa | Roda no computador do time | fora deste repositório |
| Relatório semanal | Resumo do que mudou | Opcional (dá para fazer sem) | A construir | — |

**O que decide não passa por IA de texto.** Contagem, média, antes×depois e recusa de dado pessoal são contas e regras fixas: mesma entrada, mesmo resultado, qualquer pessoa confere. A IA de texto entra só para conversar e redigir.

## Instalação mínima
1. **Um servidor comum** (4 núcleos, 8 GB). Referência de preço pública: cerca de US$ 25 por mês em provedor europeu (ESTIMATIVA, conferir na data). O time hoje paga R$ 170 por mês num servidor que roda vários sistemas (valor declarado por quem paga).
2. **Uma máquina perto das câmeras** para o leitor de vídeo. A imagem não viaja: só o número sai dali. Medido neste fim de semana num notebook sem placa de vídeo: 1,4 a 1,8 quadro por segundo em resolução alta. Quantas câmeras uma máquina aguenta depende de resolução e de quantos quadros por minuto bastam para contar; **isso se mede no piloto, não se promete.**
3. **Instalar**: `git clone`, instalar Bun e as bibliotecas Python (`ultralytics`, `opencv-python`, `lap`), rodar os testes (`motor/provar.py`, 11 + 7 testes), ligar como serviço.
4. **Ligar as fontes da cidade**: acesso ao fluxo das câmeras (com o instrumento jurídico assinado, ver `base-legal-cameras.md`), e o que mais a prefeitura já tiver (semáforo, estacionamento, transporte), cada um por um adaptador.
5. **Calibrar**: contar à mão um trecho, comparar com o leitor, publicar o erro.

## Sobre a IA de texto: o que é honesto prometer
- Para **desenvolver e manter**, o time usa as próprias assinaturas e os melhores modelos. Isso é custo nosso, não da prefeitura.
- Para o **assistente em produção**, assinatura pessoal de chat (as de cerca de R$ 110 por mês) **não é o caminho**: os termos de uso dessas assinaturas são para uso individual, não para servir um órgão público. Em produção o correto é acesso por API, com teto de gasto mensal escrito no contrato. O custo depende do volume de perguntas e só se conhece medindo.
- Se a prefeitura não quiser IA de texto nenhuma, **o sistema funciona inteiro sem ela**.

## O que a cidade entrega, o que o time leva
| A cidade entrega | O time leva |
|---|---|
| Acesso às imagens, por instrumento jurídico | As peças acima, instaladas e testadas |
| Uma pessoa de referência na secretaria | Adaptadores para as fontes dela |
| Um lugar para a máquina de leitura | Calibração com erro declarado |
| As perguntas que quer responder | Painel e a primeira medição antes×depois |

## O que ainda não sabemos
Erro real da contagem em rua; quantas câmeras por máquina; custo mensal de IA em produção; quanto tempo a prefeitura leva para liberar o acesso às imagens. Prazo por semana: [`PRAZO-IMPLANTACAO.md`](PRAZO-IMPLANTACAO.md). Referência de custo de desenvolvimento: estimativa nossa, conta aberta em [`../painel/simulador.html`](../painel/simulador.html).

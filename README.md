# Visão de Rota
### Hackathon Cidades Inteligentes · Patos de Minas (MG) · 18 a 20/09/2026

> *Ruas com memória. Mobilidade com previsibilidade.*

**A ideia em uma frase:** ler as câmeras que a cidade já tem para **contar** o trânsito (sem rosto, sem placa, sem guardar imagem) e medir o antes e o depois de cada mudança na rua. *A mesma câmera. Outra pergunta.*

**Onde estamos, sem inflar:** protótipo avançado, ainda não MVP. O que já roda e o que falta estão em [`docs/REGRAS-E-ACEITE-MVP.md`](docs/REGRAS-E-ACEITE-MVP.md).

---

## Veja tudo em 1 minuto (abre no celular)

| O quê | Link |
|---|---|
| **Tudo numa página** | https://enioxt.github.io/hackathon-dados-publicos/demo/ |
| Apresentação (12 slides) · PDF · Canvas | [slides](https://enioxt.github.io/hackathon-dados-publicos/demo/apresentacao.html) · [pdf](https://enioxt.github.io/hackathon-dados-publicos/demo/apresentacao.pdf) · [canvas](https://enioxt.github.io/hackathon-dados-publicos/demo/canvas.html) |
| Painel do gestor, 5 layouts (botão no canto) | https://enioxt.github.io/hackathon-dados-publicos/demo/painel-gestor.html |
| Parede de monitores | https://enioxt.github.io/hackathon-dados-publicos/demo/parede.html |
| Mesa de controle (gire os botões) | https://enioxt.github.io/hackathon-dados-publicos/demo/sintetizador.html |
| Os agentes, onde rodam e quanto custam | https://enioxt.github.io/hackathon-dados-publicos/demo/arquitetura.html |
| Simulador de custo para qualquer cidade | https://enioxt.github.io/hackathon-dados-publicos/demo/simulador.html |
| App do cidadão (10 telas) | https://enioxt.github.io/hackathon-dados-publicos/demo/app-cidadao.html |
| Hub de ideias de todos os times | https://enioxt.github.io/hackathon-dados-publicos/hub/ |

Quer no seu computador? Botão verde **Code → Download ZIP**, descompacte e abra **`ABRA-ESTE.html`**.

## Prova a um clique
Cada número que afirmamos, com o arquivo, a fonte e o comando para refazer: **[`docs/PROVAS.md`](docs/PROVAS.md)**. Um comando confere tudo: `python3 motor/provar.py` (14 de 14). A mesma página lista o que **ainda não** tem prova.

## Como ler qualquer tela daqui
Todo número carrega uma etiqueta: **MEDIDO** (dado real) · **SIMULAÇÃO** (conta nossa sobre dado real) · **DADO SINTÉTICO** (inventado para demonstrar). Número sem etiqueta ou sem origem é defeito: abra uma *issue* ou avise no grupo.

## Para humanos: por onde começar
| Você quer… | Abra |
|---|---|
| Entender a proposta | [`docs/pitch-5min.md`](docs/pitch-5min.md) · [`docs/canvas.html`](docs/canvas.html) |
| Saber o que é protótipo, o que é MVP e o que falta | [`docs/REGRAS-E-ACEITE-MVP.md`](docs/REGRAS-E-ACEITE-MVP.md) |
| Ver o que o diretor de mobilidade disse e o que isso muda | [`docs/fala-diretor-mobilidade.md`](docs/fala-diretor-mobilidade.md) |
| Preço e como a prefeitura contrata | [`docs/pesquisa/precificacao-decisao.md`](docs/pesquisa/precificacao-decisao.md) · [`docs/convencional-x-proposta.md`](docs/convencional-x-proposta.md) |
| Lei, LGPD, minuta de acordo | [`docs/base-legal-cameras.md`](docs/base-legal-cameras.md) |
| Levar para outra cidade: as peças, a instalação, o que precisa de IA e o que não | [`docs/COMO-REPLICAR.md`](docs/COMO-REPLICAR.md) |
| Prazo de implantação (90 dias, por semana) | [`docs/PRAZO-IMPLANTACAO.md`](docs/PRAZO-IMPLANTACAO.md) |
| Concorrentes e outras cidades | `docs/concorrentes-*.md` · [`docs/cco-modelos-outras-cidades.md`](docs/cco-modelos-outras-cidades.md) |
| O que fazer até a banca | [`docs/CHECKLIST-PITCH.md`](docs/CHECKLIST-PITCH.md) |
| Nunca fez hackathon | [`docs/COMECE-AQUI.html`](docs/COMECE-AQUI.html) |

## Para IAs (ChatGPT, Claude, Gemini, Codex, Cursor, Antigravity)
Entregue à sua IA o arquivo [`PARA-A-IA.md`](PARA-A-IA.md) e peça:
> *Leia este índice, abra os arquivos que ele aponta e me diga o que está fraco, o que está sem prova e o que você faria diferente.*

Ele já lista os pontos fracos que o próprio time conhece, para a crítica começar por eles. Discordar é bem-vindo.

## O que roda de verdade (código)
| Peça | Pasta | Como rodar |
|---|---|---|
| Porta de entrada de dados: recebe contagens, recusa placa, CPF e imagem | [`motor/entrada-de-dados/`](motor/entrada-de-dados/) | `bun test api.test.ts` (11 testes) · `bun rodar.ts` |
| Leitor de vídeo: vídeo entra, contagem sai, imagem não fica | [`motor/leitor-video/`](motor/leitor-video/) | veja o `LEIA.md` da pasta |
| Simulação de cobertura por câmeras (33 → 25% das ocorrências; 357 → 90%) | [`motor/simcam.py`](motor/simcam.py) | `python3 motor/simcam.py` |
| Contador de votos do grupo | [`motor/votacao/`](motor/votacao/) | `python3 votacao.py placar --pauta … --mensagens …` |
| Verificador do que pode ir a público | [`motor/sanear-publico.py`](motor/sanear-publico.py) | `python3 motor/sanear-publico.py <pasta>` |

Passo a passo completo: [`motor/LEIA.md`](motor/LEIA.md).

## Dados
`dados/publicos/` — 1.100 ocorrências de trânsito de Patos com coordenada (dado aberto do Estado), sinistros da base nacional (22.708 de 2018 a ago/2026, moto em 30%), 83 fontes públicas conferidas, editais de mobilidade, curva de cobertura por câmeras.

## O que NÃO está aqui, e por quê
- **Dados da operadora de ônibus.** Foram entregues ao time, não ao público. Onde um documento citava esses números, está escrito `[número da operadora]`.
- **Dado policial.** Nenhum, nem agregado.
- **Conversas do grupo, gravações da sala e atas cruas.** São palavras de outras pessoas; só entram se cada uma autorizar.
- **Chaves, senhas e endereços de servidor.**

Se você achar qualquer uma dessas coisas aqui dentro, é erro: avise que a gente retira.

## Quer mudar alguma coisa?
Clone, crie um ramo, proponha: passo a passo em [`CONTRIBUINDO.md`](CONTRIBUINDO.md). O melhor lugar para começar a cortar escopo é [`docs/REGRAS-E-ACEITE-MVP.md`](docs/REGRAS-E-ACEITE-MVP.md).

## Time
Visão de Rota. Contribuições, autoria e como continuar depois do domingo: [`commons/`](commons/).

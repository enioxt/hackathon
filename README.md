# Visão de Rota
### Hackathon Cidades Inteligentes · Patos de Minas (MG) · 18 a 20/09/2026

> *Ruas com memória. Mobilidade com previsibilidade.*

**O que é, em 3 linhas:** lê as câmeras que a cidade já tem para **contar** o trânsito — sem rosto, sem placa, sem guardar imagem — e mede o antes e o depois de cada mudança na rua. Cada número que aparece numa tela carrega a etiqueta de onde veio (dado real medido, simulação sobre dado real, ou dado sintético). Protótipo avançado, ainda não MVP — o que já roda e o que falta estão em [`docs/REGRAS-E-ACEITE-MVP.md`](docs/REGRAS-E-ACEITE-MVP.md).

**Os 4 links que importam:**

| O quê | Link |
|---|---|
| Apresentação | https://enioxt.github.io/hackathon/ |
| Entrar como gestor | https://enioxt.github.io/hackathon/demo/entrar.html |
| Como a máquina conta (os 14 números, com o comando que refaz cada um) | [`docs/PROVAS.md`](docs/PROVAS.md) |
| Código do leitor de vídeo | [`motor/leitor-video/`](motor/leitor-video/) |

**Como rodar (3 comandos):**

```bash
cd painel && bun test                        # testes do painel do gestor (35 casos)
bun run servidor.ts                          # sobe o painel em http://127.0.0.1:8787
cd motor/leitor-video && python3 -m pytest -q # testes do leitor de vídeo (7 casos)
```

**Mapa de pastas** (o que é cada uma, quem lê, se é fonte ou gerado — inventário completo em [`docs/MAPA-DO-REPOSITORIO.md`](docs/MAPA-DO-REPOSITORIO.md)):

- `demo/` — o site publicado (apresentação, app do gestor, app do cidadão)
- `painel/` — código do app do gestor (servidor, testes, telas)
- `motor/` — o que decide e prova os números (leitor de vídeo, decisão, `provar.py`)
- `dados/`, `fontes/` — dado público baixado, com hash de conferência
- `docs/` — documentação de apoio (pitch, decisões, análises)
- `hub/`, `ideias/` — mural de ideias da comunidade
- `construcao/`, `juridico/`, `tecnicas/`, `commons/` — negócio, base legal, método, regras do repositório

---


## O que usamos e o que medimos (20/09/2026)

Os números abaixo vêm de `docs/ficha-tecnica-medida.json` e podem ser refeitos. Versão em slides: `docs/ficha-tecnica.html`.

**Do que é feito**

| Parte | Tecnologia | Por quê |
|---|---|---|
| Leitura de vídeo | Python · YOLO11n (detecção) · ByteTrack (rastreio) · OpenCV | modelo pequeno, roda em CPU comum |
| Porta de entrada e dados | Bun + TypeScript · SQLite · validação de esquema · verificador de dado pessoal | recusa o que tiver placa, nome ou documento |
| Decisão | regra escrita para número · classificador de texto (Jev) só para relato livre · dúvida vai para pessoa | número decide por regra, não por modelo |
| Tela e publicação | HTML/CSS/JS sem framework · SVG · GitHub Pages · GitHub Actions | abre em qualquer navegador, sem instalar |
| Construção | assistentes de IA (Claude Fable 5.1, Sonnet 5, Opus 5) sob revisão humana · transcrição por Whisper large-v3 | o registro da construção faz parte da entrega |

**O que medimos**

| O quê | Número |
|---|---|
| Fontes públicas verificadas | 83 |
| Arquivos baixados com hash | 54 |
| Ocorrências de trânsito com coordenada (dado aberto estadual) | 1.100 |
| Sinistros em Patos de Minas na base nacional, 2018 a ago/2026 | 22.708 |
| Números públicos recalculados por `motor/provar.py` | 14 de 14 |
| Testes automáticos passando | 35 (porta de entrada, telemetria, acesso) + 10 (decisão) + 7 (leitor) |
| Eventos registrados pela telemetria | 21.351 (7.095 reais · 14.305 simulados — marcados) |
| Leituras recebidas pela porta de entrada | 79.616 — **3 medidas de vídeo, o resto é dado de demonstração** |
| Envios recusados pela porta (dado pessoal ou formato) | 32 |
| Chamadas ao classificador de texto nos experimentos | 1.851, 0 erro |
| Respostas dos assistentes de IA na construção | 6.605, em 60 agentes |
| Sala gravada e transcrita | 200 min · 18.510 palavras |
| Velocidade do leitor nesta máquina (só CPU) | 1,6 quadro/s em 1920 px com rastreio · 5,8 em 1280 px só detecção |

**O que temos**: leitor que conta por tipo · porta de entrada que recusa dado pessoal · antes e depois por ponto · origem marcada em todo número · provas recalculáveis · código aberto.

**O que ainda não temos**: acesso às câmeras da cidade · contagem conferida à mão num vídeo de Patos · ligação com semáforo, ônibus e estacionamento · medição de erro por tipo de veículo · operação contínua fora de um notebook · acordo com os donos das imagens.

O sistema analisa vídeo **já gravado**, com atraso, de propósito: contar trânsito e medir antes e depois pede a mesma hora de muitos dias, não o instante. Não transmite imagem e não guarda rosto nem placa.

## Veja tudo em 1 minuto (abre no celular)

| O quê | Link |
|---|---|
| **Tudo numa página** | https://enioxt.github.io/hackathon/demo/ |
| Apresentação (12 slides) · PDF · Canvas | [slides](https://enioxt.github.io/hackathon/demo/apresentacao.html) · [pdf](https://enioxt.github.io/hackathon/demo/apresentacao.pdf) · [canvas](https://enioxt.github.io/hackathon/demo/canvas.html) |
| Aplicativo do gestor | https://enioxt.github.io/hackathon/demo/entrar.html |
| Parede de monitores | https://enioxt.github.io/hackathon/demo/parede.html |
| Mesa de controle (gire os botões) | https://enioxt.github.io/hackathon/demo/sintetizador.html |
| Os agentes, onde rodam e quanto custam | https://enioxt.github.io/hackathon/demo/arquitetura.html |
| Simulador de custo para qualquer cidade | https://enioxt.github.io/hackathon/demo/simulador.html |
| App do cidadão (10 telas) | https://enioxt.github.io/hackathon/demo/app-cidadao.html |
| Hub de ideias de todos os times | https://enioxt.github.io/hackathon/hub/ |

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

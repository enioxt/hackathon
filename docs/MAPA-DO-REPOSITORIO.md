# Mapa do repositório — FILTER

Gerado em 20/09/2026 por varredura manual (`find`, `md5sum`, grep) sobre o commit `0ccf6c4`. Serve para quem chega agora e precisa entender o repositório em 2 minutos, e para a IA que for mexer nele.

## Como ler

Cada pasta de primeiro nível tem: o que é · para quem · estado (**vivo** = mantido e servido/lido hoje · **histórico** = registro de decisão, não muda mais · **gerado** = produzido por script, não editar à mão).

| Pasta | O que é | Para quem | Estado |
|---|---|---|---|
| `index.html` | Apresentação de 1 página (a porta de entrada do site) | Visitante, avaliador | vivo |
| `ABRA-ESTE.html` | Landing para abrir tudo por duplo-clique, sem servidor | Quem recebe o repo por fora do GitHub | vivo |
| `demo/` (32 arquivos no topo) | O site publicado (GitHub Pages): apresentação, app do gestor (`app.html`), app do cidadão, parede de monitores | Visitante público, avaliador do hackathon | vivo — **não mover nada daqui**, já divulgado |
| `hub/` (12) | Mural de ideias da comunidade (issues → páginas) | Visitante, quem manda ideia | vivo — gerado em parte por `hub/build-hub.py` a partir de issues do GitHub |
| `dados/` (5 no topo, 17 no total) | Dado público baixado, pronto para a página `dados/index.html` consumir | Visitante técnico, quem confere número | vivo/gerado — `dados/publicos/` é o acervo bruto com manifesto sha256 |
| `ideias/` (10) | Uma ideia por arquivo, viradas em issue e depois em página do `hub/` | Time, comunidade | vivo |
| `construcao/` (7) | Documentos de negócio: contrato de dados, modelo de negócio, prazo, MVP | Time, parceiro técnico | vivo — mas repete conteúdo de `docs/` (ver duplicatas abaixo) |
| `fontes/` (5) | As 83 fontes de dado público verificadas, com hash de conferência | Quem audita o dado | vivo |
| `juridico/` (4) | Base legal de câmera pública e LGPD | Time, parceiro jurídico | vivo — repete conteúdo de `docs/` |
| `tecnicas/` (4) | Como o time pesquisou e cruzou dado | Time, avaliador técnico | vivo — repete conteúdo de `docs/` |
| `docs/` (46 no topo, 64 no total) | Documentação de apoio: apresentação, pitch, decisões, análises, cópias offline de telas do app | Avaliador, quem não roda servidor | vivo — é a pasta mais cheia e mais duplicada do repo (ver abaixo) |
| `commons/` (6) | Regras de convivência do repositório (contribuição, rótulos, política) | Quem abre PR/issue | vivo — copiado em `docs/commons/` (duplicata exata) |
| `motor/` (12 no topo, 67 no total) | O código que decide e prova os números: `decisao/` (regra de decisão), `entrada-de-dados/` (API+validação — é a fonte, `painel/` importa de lá em parte e duplica o resto), `leitor-video/` (Python, lê vídeo de câmera), `votacao/` (conta voto do grupo), `provar.py` (recalcula os 14 números públicos) | Quem mexe em código | vivo |
| `painel/` (38 no topo, 91 no total) | O aplicativo do gestor (site servido por `servidor.ts`; `demo/app.html`, casca só de tela, é a versão publicada dele) | Quem roda o servidor local | vivo — importa parte de `motor/entrada-de-dados/` mas também guarda cópias próprias dos mesmos arquivos |
| `semaforo/` (5) | Mini-app à parte (semáforo educativo) | Visitante | vivo, independente do resto |
| `README.md`, `PARA-A-IA.md`, `REGRAS.md`, `CONTRIBUINDO.md`, `llms.txt`, `sitemap.xml`, `robots.txt`, `.nojekyll` | Portas de entrada do repositório | Humano (README) · IA (PARA-A-IA.md, llms.txt) · motor de busca (sitemap/robots) | vivo |

## Contagem por tipo de arquivo (repo inteiro, sem `.git`)

`.md` 122 · `.html` 67 · `.json` 46 · `.ts` 39 · `.js` 21 · `.py` 14 · `.sha256` 4 · `.css` 4 · `.yml` 3 · `.txt` 3 · `.pdf` 2 · `.mp4` 2 · `.xml` 1 · `.pt` (modelo, ignorado pelo git) 1 · `.jpg` 1

## Arquivos repetidos byte a byte (md5sum)

Achados **57 grupos** de arquivos idênticos (comando: `find . -path ./.git -prune -o -type f -print | xargs md5sum | sort` + agrupamento por hash). Os grupos caem em quatro famílias:

### Família 1 — `docs/` × `painel/dados-do-chat/` (≈20 grupos)

`painel/dados-do-chat/` guarda uma cópia de ~33 arquivos (`.md`/`.json`) que também existem em `docs/`, `fontes/`, `juridico/`, `tecnicas/`, `ideias/`. **Nenhum código do repositório referencia `painel/dados-do-chat/`** (varrido `grep -rn "dados-do-chat"` em todo `.ts`/`.js`/`.py`/`.html`/`.md` — zero resultado fora da própria pasta). Fonte provável: conteúdo copiado para um assistente de chat ler por sistema de arquivos, depois desligado — hoje é cópia órfã. **Não apaguei** por prudência de tempo (33 arquivos, e a régua do pedido é "verifique quem referencia antes"); listo aqui para o dono decidir. Exemplos: `docs/analise-360-gaps.md` = `painel/dados-do-chat/analise-360-gaps.md`; `fontes/fontes-verificadas.json` = `painel/dados-do-chat/fontes/fontes-verificadas.json`; `tecnicas/regras-que-seguimos.md` = `REGRAS.md` (raiz) = `painel/dados-do-chat/tecnicas/regras-que-seguimos.md`.

### Família 2 — `docs/` × `construcao/`/`juridico/`/`tecnicas/` (fonte real duplicada 2×, sem `dados-do-chat`)

`docs/convencional-x-proposta.md` = `construcao/convencional-x-proposta.md`; `docs/modelo-de-negocio.md` = `construcao/modelo-de-negocio.md`; `docs/PRAZO-IMPLANTACAO.md` = `construcao/prazo-de-implantacao.md` = `painel/PRAZO-IMPLANTACAO.md`; `docs/REGRAS-E-ACEITE-MVP.md` = `construcao/regras-e-aceite-do-mvp.md`; `docs/base-legal-cameras.md` = `juridico/base-legal-lgpd-cameras.md`; `docs/parcerias-cameras-brasil.md` = `juridico/parcerias-cameras-brasil.md`; `docs/parcerias-cameras-mundo.md` = `juridico/parcerias-cameras-mundo.md`; `docs/regras-de-cruzamento-de-dados.md` = `tecnicas/regras-de-cruzamento-de-dados.md`; `docs/dados-publicos-relatorio.md` = `fontes/00-relatorio-83-fontes.md`. Não é possível dizer qual é "a fonte" sem git-blame arquivo a arquivo (fora do orçamento desta sessão) — as duas cópias estão vivas e servidas por páginas diferentes, então **nenhuma foi apagada**.

### Família 3 — `motor/entrada-de-dados/` × `painel/` (código, 8 grupos)

`motor/entrada-de-dados/{validar,db,cliente-dados,api.test}.ts/.js` têm cópia idêntica em `painel/`. `painel/fontes/{csv,MODELO-adaptador,sintetico}.ts` = `motor/entrada-de-dados/fontes/{csv,MODELO-adaptador,sintetico}.ts`. `painel/contrato/LEIA.md` + `leitura.schema.json` = `motor/entrada-de-dados/contrato/` = `construcao/contrato-de-dados.md` (o `.md`) e `construcao/leitura.schema.json` (o schema). `painel/servidor.ts` importa alguns desses arquivos **do próprio `painel/`** (`./validar.ts`, `./db.ts`), não de `motor/`, então a cópia em `painel/` é a que está **em uso** — `motor/entrada-de-dados/` parece ser onde o motor foi originalmente escrito e depois colado em `painel/` para o servidor não depender de `../motor/`. Não mexi: os dois estão vivos e o de `painel/` é importado.

### Família 4 — `painel/claro/` × `painel/layout-rafael/` (código, 4 grupos)

`styles.css`, `config.js`, `ajustes.js`, `app.js` idênticos nas duas pastas. `layout-rafael/` é o design original recebido em zip (tem `LEIA-ME PRIMEIRO.txt` de instalação Windows, nunca importado por `servidor.ts`) — **histórico**, mantido como registro de origem. `painel/claro/` é a versão adotada e servida (`servidor.ts` lê de `RAIZ + "/claro/"`) — **vivo**. Os dois referenciam imagens que não existem no repositório (`assets/patos-logo.png`, `assets/camera-fallback.jpg` — ver seção de links quebrados).

### Outras duplicatas pontuais (sem família)

`melhorias.js` — idêntico em 4 lugares: raiz, `demo/`, `docs/`, `painel/` (script pequeno, copiado por servido em contextos diferentes). `demo/ficha-tecnica.html` = `docs/ficha-tecnica.html`. `demo/apresentacao.pdf` = `docs/VISAO-DE-ROTA-apresentacao.pdf`. `demo/simulador.html` = `painel/simulador.html`. `demo/tour.js`, `demo/seletor-visual.js` = as versões em `painel/`. `demo/camadas/*` (clipes.json, ORIGEM.json, trilhas.json, clipe.mp4) = `painel/camadas/*`. `commons/*` (6 arquivos) = `docs/commons/*` — cópia completa da pasta inteira. `demo/index.html` = `demo/inicio.html` (mesmo conteúdo, dois nomes). `demo/observabilidade.html` = `demo/painel-gestor.html` = `demo/participacao.html` — os três são **stubs de redirecionamento** intencionais (`<meta http-equiv="refresh" ... url=app.html>`), não duplicata por acidente.

**Nenhum arquivo foi apagado nesta sessão.** Toda decisão de manter/apagar cópia fica registrada aqui para o próximo passo.

## Links — antes × depois

- **Método:** script Python (`/tmp/claude-1000/checklinks.py`, descartável) que varre todo `.md`/`.html` do repo por `href=`/`src=`/`](...)`  e resolve caminho relativo contra o disco; ignora `http(s)://`, `mailto:`, `tel:`, `javascript:`, `data:`.
- **Antes de qualquer conserto:** 63 "links resolvidos como ausentes" pelo script + 5 referências a `painel-gestor.html` (padrão antigo pedido na tarefa).
- **Filtrado o falso-positivo:** dos 63, a maioria (≈55) são rotas de servidor sem extensão (`/parede`, `/custos`, `/claro`, `/camadas`...) que `painel/servidor.ts` serve dinamicamente — não são arquivo no disco, então o script acusa "ausente" sem estar quebrado. Não contam como link quebrado.
- **Reais, consertados nesta sessão (6):**
  1. `painel/fluxo-vivo.ts` importava `../5-motor/decisao/{decisao,evento-de-transito}.ts` (pasta `5-motor` não existe) → `../motor/decisao/...`.
  2. `motor/votacao/votacao.py` usava default `3-equipe/votacao/pauta-atual.json` (pasta não existe) → mesmo diretório do script (`motor/votacao/pauta-atual.json`, que é onde o arquivo real está).
  3. `painel/entrar.html` e `demo/app.html`: link de apresentação apontava para `https://enioxt.github.io/hackathon-dados-publicos/` (repositório antigo) → `https://enioxt.github.io/hackathon/` (site atual) no ramo dinâmico; `demo/app.html` já tinha o ramo estático certo (`../index.html`), copiado para `painel/entrar.html`.
  4. `painel/gestor.html` e `docs/gestor.html`: atalho de "ir para a parede" em `file://` apontava para `../cco/parede.html` (pasta `cco` não existe) → `parede.html` (mesma pasta, em `painel/`) e `../painel/parede.html` (em `docs/`, que não tem `parede.html` próprio).
- **Reais, listados mas NÃO consertados (destino não é óbvio):**
  - ~~`ABRA-ESTE.html` e `README.md` linkam `docs/COMECE-AQUI.html`~~ — **resolvido**: o arquivo foi apagado no commit `5383787` e o conteúdo era orientação de quem nunca tinha feito hackathon, que já passou. O link foi removido de `ABRA-ESTE.html` em vez de recriar o arquivo.
  - `painel/claro/index.html` e `painel/layout-rafael/index.html` referenciam `assets/patos-logo.png` e `assets/camera-fallback.jpg` — pasta `assets/` nunca existiu no repositório (provavelmente ficou de fora quando o zip do Rafael foi extraído). `painel/claro/index.html` não é servido por `servidor.ts` (que serve `painel-claro.html`, arquivo separado) — impacto real hoje: baixo, mas listado.
  - `demo/custos.html` (3 ocorrências) e a prosa de `painel/arquitetura.html`/`demo/arquitetura.html` (9 ocorrências) citam caminhos antigos (`3-equipe/pesquisa/...`, `cco/...`, `5-motor/...`) dentro de texto de **evidência/citação**, não em `href`/`src` — são texto explicativo sobre onde uma medição foi feita, não link clicável. Não mexi: reescrever prova/evidência exige confirmar o caminho atual de cada citação uma a uma (fora do orçamento de 60 min); ver seção "o que ficou de fora".
  - ~~`painel/painel-claro.html` tem 2 links relativos `solucoes.html` e `o-que-patos-ja-faz.html`~~ — **resolvido** apontando para `../demo/`, onde os arquivos estão. Trocar o link foi preferido a duplicar os arquivos em `painel/`: o repositório já tem cópias demais entre `demo/` e `painel/`, e duplicar cria mais um par para manter em dia.
- **Depois do conserto:** 0 links quebrados na raiz e em `demo/`; `docs/` também em 0 (o `COMECE-AQUI.html` foi removido do índice). `painel/` mantém **2**, os dois de imagem (`assets/patos-logo.png` e `assets/camera-fallback.jpg`, em `claro/` e `layout-rafael/`): a pasta `assets/` nunca existiu no repositório, então não há arquivo para apontar — só refazendo as imagens.

## Caminho pessoal de máquina (`/home/`) — achado, não mexido

Varredura (`grep -rl "/home/"` em `.md`/`.html`/`.ts`/`.py`/`.json`, todo o repositório) achou **8 arquivos** com caminho absoluto da máquina de quem escreveu, todos dentro de texto de **citação de evidência/proveniência** (onde um dado foi lido ou salvo durante a pesquisa), nunca em código executado nem em link: `docs/editais-espelho-resumo.md`, `docs/pesquisa/referencia-horas-desenvolvimento.md`, `docs/design-prompts/BRIEF.md`, `docs/editais-10-anos.md`, `docs/concorrentes-garra-traffic.md`, `docs/apis-e-fontes-integraveis.md`, e o padrão de exclusão em `motor/sanear-publico.py` (esse é intencional — é o filtro que *impede* esse tipo de caminho de vazar para o público). Não editei: são citações de proveniência, e trocar o caminho por outro genérico apagaria informação de auditoria sem necessidade — nenhum é segredo (não é chave, não é PII de terceiro), é só o caminho local de onde o dado foi extraído. Fica para o dono decidir se quer generalizar essas citações antes de divulgar mais.

Não achei chave de API, token, senha nem e-mail pessoal de indivíduo em código/config (`grep` por padrão de segredo em `.ts`/`.js`/`.py`/`.json`: 0 resultados). Os e-mails encontrados em `dados/publicos/fontes-verificadas.json` (e cópias) são contatos institucionais públicos (ouvidoria, secretaria, atlas da violência do IPEA) — parte do próprio propósito do arquivo, não PII de pessoa física.

## Números públicos — fonte única

`motor/provar.py` roda e confere os 14 números públicos contra o dado bruto: **14 de 14 conferem** (rodado nesta sessão, 20/09/2026). Varredura por `22.708\|22708\|1.100\|30,0%\|240 câmeras\|140 pontos\|83 fontes` em `docs/ demo/ painel/ README.md` (151 ocorrências) não achou variação divergente do número oficial nas páginas públicas — todas batem com `motor/provar.py`.

**Uma divergência real, achada e NÃO corrigida:** `fontes/fontes-verificadas.json` (e as duas cópias idênticas, `dados/publicos/fontes-verificadas.json` e `painel/dados-do-chat/fontes/fontes-verificadas.json`), linhas 99/107/114, citam **"22.709 sinistros"** dentro do relato de metodologia (contagem bruta por streaming grep, antes de tratar duplicidade por `num_acidente` — o próprio texto ao lado diz "não removi duplicidade"). O número final validado e publicado em todo o resto do repositório é **22.708** (`motor/provar.py` confere). Não é "evidente erro de digitação" (o texto ao lado explica a diferença de 1 como contagem bruta vs. final) — por isso não corrigi automaticamente; fica para o dono decidir se anota a diferença ou ajusta o relato.

## O que este mapa NÃO cobre

- Não abri `dados/publicos/` arquivo a arquivo (17 arquivos, dado bruto) — confiado no manifesto `MANIFEST.sha256`.
- Não git-blame'ei cada duplicata da Família 2 para provar qual cópia nasceu primeiro.
- Não resolvi os 2 links sem destino óbvio (COMECE-AQUI.html, assets/ do layout-rafael).

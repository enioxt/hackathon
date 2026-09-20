📊 Diagnóstico — o padrão de observabilidade/telemetria/prova-a-um-clique do EGOS, medido em `/home/enio/enio-dev/producao/egos`:

**(a) Como um número vira "clicável até a prova"**

Dois motores fazem isso, ambos determinísticos e puros (sem rede/LLM decidindo):

1. `scripts/orquestra-viva/blocos-resposta.ts` (RV-4-CAMINHOS-001 + RV-7-RESPOSTA-CLICAVEL-E-LEIGA-001, cortes Enio 08/09) — varre o texto de qualquer resposta longa do agente e extrai:
   - `extrairShas()` (linha 95): SHA de commit por regex `\b[0-9a-f]{7,40}\b`
   - `extrairCaminhos()` (linha 197): caminho de arquivo citado em prosa (`file.ts`, `docs/x.md`), com URL/wa.me removidos antes pra não confundir link com caminho
   - `extrairItens()`: cada emoji de semáforo (🟢🟡🔴⚪) vira `{cor, texto}` estruturado
   - Consumido em `coletores-agentes.ts:662` — o caminho extraído vira link que chama `/api/documentos/abrir` (rota já fail-closed, valida a raiz antes de abrir).
   - Regra de desenho: o parser NUNCA confirma se o arquivo existe — só reconhece a FORMA; quem confirma é a rota que abre.

2. `scripts/md-para-html.ts` — modo "cebola" (`APRESENTACAO-CEBOLA-001`): cada seção `##` vira card clicável de 3 camadas — manchete+número (camada 1) → corpo (camada 2) → **prova** (camada 3, `ehBlocoProva()`: tabela ou bloco `<pre>`) escondida atrás de um botão `.cebola-prova-btn` que só abre sob clique. No PDF/impressão a camada de prova é forçada visível (`@media print`) — documento impresso não pode ficar pela metade.

O princípio geral que sustenta os dois: **R-DECIDE-DETERMINISTICO-001** — quem emite veredito/número é função pura, nunca o modelo; e **R-PROVA-NAO-E-LINHA-DE-BASE-001** (`auditaProvaCircular()`, `md-para-html.ts:335`) barra a HTML se um placar alegado como "prova" (ex. "112/112, sem regressão") é o MESMO número que já aparecia antes, sem alegação — placar idêntico ao baseline não prova mudança nenhuma.

**(b) O que `scripts/md-para-html.ts` (o gerador oficial) exige do nosso HTML**

Rodando `--check` ou geração normal, ele recusa (`process.exit(1)`) se:
- `GATE-FRESCOR-001`: par `.html` mais velho que o `.md` fonte → `🔴 regere` (linha 898)
- `LINK-QUEBRA-CALADO-001`: link markdown cortado no meio (linha 910)
- `R-ENTREGA-PURA-001`: peça de entrega carregando instrução interna (marcador de decisão pendente, hash de HITL, caminho de SSOT do kernel) — linha 921
- `auditaProvaCircular`: placar "provado" que é o mesmo da linha-de-base sem alegação (linha 929)
- `VOZ-HUMANA-001`: texto com marca de escrita de LLM (`voz-humana-check.ts`) — bloqueia, exige `--voz-ok "<motivo>"` declarado (nunca silencioso) — linha 954

Estrutura obrigatória do HTML produzido (`monta()`, linha 508): `<!DOCTYPE html lang="pt-BR">`, CSS embutido de `templates/human-doc/casa.css` (single-file, sem CDN), header com toggle de tema `🌓`, sidebar de navegação por seção (`selecionaNav`, teto de itens com "+N subseção(ões)" declarado se cortar — nunca corta em silêncio), footer com proveniência (`Gerado de <arquivo> por scripts/md-para-html.ts em <data>`).

**(c) 8 regras concretas para o dashboard do hackathon herdar**

1. **CSS único**: usar `templates/human-doc/casa.css` (145 linhas, tokens `--surface`/`--border`/`--accent`/`--radius`) em vez de inventar paleta — é o SSOT visual (`R-HTML-004`, herda `VISUAL_IDENTITY.md`: `--egos-blue #2563EB`, `--egos-green #10B981` sucesso, `--egos-amber` aviso, `--egos-red` erro).
2. **Semáforo de 4 cores, nunca 3**: todo item medido carrega 🟢 (medido sem ressalva) / 🟡 (medido com ressalva) / 🔴 (medido, é problema) / ⚪ (NÃO-MEDIDO) — nunca inferir cor sem comando rodado no turno (`R-SEMAFORO-QUATRO-001`, AGENTS.md).
3. **Número clicável até a prova**: todo dado numérico do painel linka para o comando/arquivo/commit que o gerou — replicar o padrão `extrairShas`/`extrairCaminhos` (regex determinístico, zero LLM na extração) ou, mais simples para o hackathon, âncora HTML direta `<a href="#prova-x">`.
4. **Motor separado da apresentação**: um coletor puro (`montarX(): Promise<Record<string,unknown>>`) que devolve JSON, servido por rota HTTP; o HTML consome via `fetch`. Nunca hardcodar número no HTML gerado — replica o padrão de `rotas-app4.ts` (`montarObservabilidade`, `montarGuardBrasil`, `montarLeaderboardApi`).
5. **Nunca inventar número ausente**: dado que ainda não existe no disco retorna `⚪ NÃO-MEDIDO: <comando exato para medir>` em vez de `0` ou omitir o campo (padrão de `montarObservabilidade` quando `scripts/observabilidade.ts` não existe ainda).
6. **GATE-FRESCOR-001**: se o dashboard tiver par `.md`+`.html`, o HTML mais velho que a fonte bloqueia regeração — comparar `mtime`.
7. **R-HTML-010 / apresentar = abrir na tela**: todo HTML gerado para o Enio olhar termina o turno com `xdg-open <caminho-absoluto>` — nunca só citado no chat.
8. **Rodapé de proveniência obrigatório**: fonte (`.md` ou script gerador), data de geração, declaração "regenerável a partir de X" — nunca nome pessoal, email, IP interno (`R-HTML-006`).

**(d) CSS/tema reutilizável**

Sim: `/home/enio/enio-dev/producao/egos/templates/human-doc/casa.css` (145L) + `templates/human-doc/casa.js` — é o CSS que `md-para-html.ts` embute (`const CSS = join(RAIZ, "templates/human-doc/casa.css")`, linha 37). Define os tokens de cor/raio/borda usados por toda a família de HTMLs (sidebar, dark mode via classe `.dark` no body, tabelas, blocos de código). Documentos recentes que seguem o padrão: `docs/presentations/2026-09-08_ALEXANDRE_o-que-fazemos-de-verdade.html`, `2026-09-04_LUBRIAUTO_kit-de-visita.html`, `2026-09-02_GUARD-BRASIL_flagship-o-que-temos-e-para-onde-vai.html` — todos com sidebar fixa 240-260px, toggle 🌓 no header, footer com "Fonte: `path.md`" + data.

🕳️ O que ficou de fora — não abri o EGOS APP ao vivo no navegador (só código-fonte das rotas/coletores); não medi `~/.egos/heartbeats` porque o diretório real é `~/.egos/heartbeat` (sem "s") e está vazio nesta máquina agora — o motor `check-heartbeats.ts` deriva a lista do crontab, não medi o crontab. Não abri nenhum HTML na tela (R-HTML-010 é regra de apresentação ao Enio, não aplicável a esta tarefa de levantamento textual).

Arquivos relevantes (todos em `/home/enio/enio-dev/producao/egos`):
- `scripts/orquestra-viva.ts` (rotas /api/*)
- `scripts/orquestra-viva/rotas-app4.ts` (montarObservabilidade/montarGuardBrasil/montarLeaderboardApi)
- `scripts/orquestra-viva/blocos-resposta.ts` (semáforo + shas + caminhos clicáveis)
- `scripts/orquestra-viva/nucleo.ts`
- `scripts/md-para-html.ts`
- `docs/governance/HTML_GENERATION_CONSTITUTION.md`
- `templates/human-doc/casa.css`, `casa.js`
- `scripts/check-heartbeats.ts`
# Roteiro da tour — Visão de Rota

Para quem vai apresentar na banca. 11 passos, cada um com o endereço, a fala sugerida (2-3 frases simples), a ação a fazer na tela, e o tempo.

A tour inteira falada cabe em **5 minutos**. Se sobrar só **3 minutos**, corte os passos marcados **[corta em 3min]**: 6 (porta de entrada), 8 (participação) e 9 (app do cidadão) — fale uma frase sobre eles no passo 1 e siga.

Ligar a tour: abra o painel e clique no botão **▶ Tour** no canto superior direito, ou entre direto pela URL com `?tour=1`. Para deixar rodando sozinha numa TV: `?tour=1&auto=25` (avança a cada 25s, pausa se alguém mexer o mouse).

---

## 1 · Painel do gestor — visão geral (30s)
**Endereço:** local `http://127.0.0.1:8787/?layout=central&tour=1` · estático `painel-gestor.html?layout=central&tour=1`
**Fala:** "Isto é o centro de controle da mobilidade. Cada ponto no mapa é uma zona da cidade com uma leitura do dia — ocorrência, fluxo, câmera. É daqui que o gestor decide o que olhar primeiro."
**Ação:** aponte o mapa, clique num ponto para abrir o painel de detalhe.

## 2 · A história em 7 passos (40s)
**Endereço:** mesma página, botão "▶ Ver a história em 1 minuto"
**Fala:** "Para quem nunca viu isso, tem um modo história: um cruzamento real, contado em sete passos — a cidade gera dado, o sistema organiza, aparece algo fora do padrão, o gestor entende, testa uma alternativa, decide, e depois mede se melhorou."
**Ação:** clique em "entrar na história", passe rápido pelos 7 passos (ou pule direto para o passo 7 se o tempo apertar), saia com Esc.

## 3 · O que mudou depois (25s)
**Endereço:** mesma página, aba "O que mudou depois" (`#resultado`)
**Fala:** "Toda intervenção testada aqui ganha um antes e um depois, com data e métrica — não é só 'melhorou', é 'melhorou de X para Y, medido assim'."
**Ação:** abra uma linha da tabela de intervenções.

## 4 · Parede de monitores (30s)
**Endereço:** local `/parede?n=4&tour=4` · estático `parede.html?n=4&tour=4`
**Fala:** "Esta é a parede de monitores — quatro câmeras simuladas ao mesmo tempo, com um evento acontecendo agora numa delas. Nenhuma câmera real está ligada nesta demonstração."
**Ação:** clique na tela com o evento, abra a visão 3D.

## 5 · Observabilidade (30s)
**Endereço:** local `/observabilidade?tour=5` · estático `observabilidade.html?tour=5`
**Fala:** "Por trás de cada tela, tem agentes rodando — nove, no total — e aqui dá para ver as chamadas que cada um realmente fez nesta sessão. Isso é auditoria, não caixa-preta."
**Ação:** abra um dos agentes e mostre as últimas chamadas.

## 6 · Porta de entrada [corta em 3min] (30s)
**Endereço:** local `/entrada?tour=6` · estático `entrada.html?tour=6`
**Fala:** "Toda leitura passa por uma porta antes de virar dado. Se vier com placa, o sistema tem que recusar — vamos testar agora, na tela."
**Ação:** clique em "Enviar leitura com placa (deve ser recusada)" e mostre o código 422 aparecendo.

## 7 · Mesa de controle (35s)
**Endereço:** local `/sintetizador?tour=7` · estático `sintetizador.html?tour=7`
**Fala:** "Esta é a mesa de controle: hora do dia, chuva, evento na cidade, quantidade de câmeras — dá para simular um cenário e ver o efeito antes de decidir qualquer coisa de verdade."
**Ação:** mexa no controle de hora e mostre a onda de fluxo mudando.

## 8 · Participação e placar [corta em 3min] (20s)
**Endereço:** local `/participacao?tour=8` · estático `participacao.html?tour=8`
**Fala:** "Essa tela é o lado do morador que participa — um placar coletivo por bairro. Se ainda não estiver publicada nesta demonstração, é porque está em construção agora."
**Ação:** se abrir, mostre o placar por bairro; se não abrir, siga direto (a tour avisa e pula sozinha).

## 9 · App do cidadão [corta em 3min] (25s)
**Endereço:** só no site estático `app-cidadao.html?tour=9` — no servidor local esta tela não tem endereço hoje, a tour pula com aviso.
**Fala:** "E do outro lado tem o app que a pessoa usa: a rua dela agora, quanto tempo ela perdeu, a missão da semana. Tudo dado sintético de demonstração."
**Ação:** abra "Onde você perdeu tempo?" e registre um caso.

## 10 · Espinha dorsal e custo (35s)
**Endereço:** local `/arquitetura?tour=10` · estático `arquitetura.html?tour=10` (o cartão traz um link para abrir `/simulador` numa aba nova)
**Fala:** "Por dentro, é assim que as peças se conectam. E para quem decide financiar, tem o simulador de custo — quanto custaria rodar isto numa cidade de verdade, com os números do próprio time."
**Ação:** abra o link do simulador de custo, mude o tamanho da cidade.

## 11 · Fim — o que é real hoje, o que falta (20s)
**Fala:** "Para fechar: nada aqui finge ser mais do que é. O que é medido, está marcado MEDIDO. O que é simulação para a banca, está marcado SIMULAÇÃO ou DADO SINTÉTICO. E o que falta construir está escrito, não escondido."
**Ação:** aponte o link "Ver as provas" (`docs/PROVAS.md` no repositório) e o botão "Pedir melhoria" no canto inferior esquerdo da tela.

---

### Tempo total
Falado sem pressa: **~5min20s** com os 11 passos completos.
Cortando 6, 8 e 9: **~3min10s**.

### Nota de honestidade
Nenhum passo promete mais do que o sistema entrega hoje. O que é MEDIDO está dito assim; o resto é SIMULAÇÃO ou DADO SINTÉTICO, sempre nomeado.

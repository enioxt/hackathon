# Desempenho medido e a proposta das duas pistas

> Medido em 21/09/2026 a partir dos arquivos que já estão neste repositório:
> `demo/camadas/clipes.json` (campo `quadros_por_segundo`) e `demo/camadas/*.trilhas.json`
> (número de quadros e duração de cada vídeo). Nenhum número aqui foi digitado à mão.
> Refazer: dividir `quadros ÷ quadros_por_segundo` para ter o tempo de processamento, e
> dividir esse tempo pela duração do vídeo para ter o RTF.

## 1. O número que faltava

`docs/MODELO-OPERACIONAL-NA-FONTE.md` define a métrica certa — **RTF = tempo de
processamento ÷ duração do vídeo** — mas usa exemplos abstratos (“RTF 0,5 → 1 hora em 30
min”). O RTF real do projeto, medido, é este:

| vídeo | quadros/s do vídeo | quadros/s processados | tempo de processamento | RTF |
|---|---:|---:|---:|---:|
| filmado do alto (6) | 30,0 | 1,93 | 912 s | **15,5×** |
| filmado do alto (7) | 29,1 | 3,91 | 502 s | 7,4× |
| filmado do alto (5) | 30,0 | 8,54 | 104 s | 3,5× |
| filmado do alto (8) | 30,0 | 10,13 | 375 s | **3,0×** |
| celular (1) | 60,0 | 6,55 | 213 s | 9,2× |
| celular (2) | 30,2 | 3,98 | 30 s | 7,6× |
| celular (3) | 29,7 | 1,49 | 845 s | **19,9×** |
| celular (4) | 29,8 | 6,37 | 92 s | 4,7× |

**Totais:** 11.760 quadros · 372 s de vídeo · 51,2 min de processamento.
**RTF médio: 8,3×** — uma hora de vídeo leva mais de oito horas nesta máquina.
**Velocidade média de processamento: 3,83 quadros por segundo.**

Máquina: notebook comum, CPU, sem placa de vídeo dedicada.

### Ressalva que impede usar estes números para dimensionar

O RTF varia de **3,0× a 19,9×** entre os vídeos — seis vezes e meia de diferença. As
medições não foram feitas sob condições controladas: há resoluções diferentes, execuções
diferentes e pelo menos um vídeo foi lido duas vezes com configurações distintas
(ver `demo/patos-real/relatorio.html`). **Não dimensione máquina, prazo ou preço com esta
tabela.** Ela serve para mostrar ordem de grandeza e para sustentar a seção 2.

A causa provável da variação está registrada no próprio README, em outra medição:
**1,6 quadro/s em 1920 px com rastreio · 5,8 quadro/s em 1280 px só com detecção.**
Ou seja, as duas coisas que mais pesam são **resolução** e **ter ou não rastreio** — e os
oito vídeos não foram lidos com a mesma configuração das duas. Isso reforça a seção 3: o
rastreio não é um detalhe de ajuste, é o que mais custa.

## 2. Onde o tempo real esbarra — e é uma parede medida, não um ajuste

Para sair de RTF 8,3× e chegar a RTF 1 (acompanhar o relógio da câmera) seria preciso
analisar cerca de **3,6 quadros por segundo** em vez de 30.

E o relatório de leitura do time registra, sobre o mesmo material:

> “a 1ª [leitura], a 4 quadros por segundo, perdia o veículo entre um quadro e outro e
> **não contava nenhum**” — `demo/patos-real/relatorio.html`

Ou seja: **o ponto em que o tempo real começa é praticamente o mesmo em que a contagem
parou de funcionar.** Baixar os quadros analisados não piora a contagem aos poucos; a
certa altura ela vai a zero, porque o rastreador perde a identidade do veículo entre um
quadro e o seguinte e nenhum cruzamento de linha é registrado.

Isso não é limitação de máquina melhor ou pior. É a natureza da medida.

## 3. A divisão que funciona

A separação **não é por velocidade**. É por uma pergunta:

> *esta medida precisa reconhecer o mesmo objeto de um quadro para o seguinte?*

### Pista rápida — não precisa seguir o objeto

Cada quadro se basta. Pode ser amostrado (por exemplo 1 quadro a cada 2 segundos), o que
derruba a carga em torno de 60× e coloca o RTF bem abaixo de 1.

- quantos estão na cena agora (ocupação)
- composição: carro, moto, ônibus, caminhão, pessoa a pé
- fila: quanto da via está ocupada
- via bloqueada ou parada anormal
- estado da lâmpada do semáforo

### Pista lenta — precisa seguir o objeto

Exige quadros consecutivos em ritmo alto. Roda só nas janelas que importam: pico da
manhã, terças comparáveis, as semanas antes e depois de uma intervenção.

- contagem por cruzamento de linha
- sentido e direção
- velocidade
- tempo de espera
- conflito de tráfego / quase-acidente (TTC, PET)

### O atraso vira número na tela

A pista lenta tem atraso por definição. Esse atraso é **publicado**, não escondido:

> “esta leitura está 18 min atrás da câmera”

É a mesma regra de `CLAUDE.md`: toda afirmação diz o que é e de onde veio. Um painel que
mostra atraso conhecido é mais confiável que um que finge acompanhar o relógio.

## 4. O experimento que decide

Barato, e todo o material já existe neste repositório: os 8 vídeos e uma contagem manual
de referência (`demo/patos-real/relatorio.html`).

Mesmo vídeo, mesma máquina, variando **apenas** os quadros analisados — 30, 15, 10, 5, 2,
1 por segundo — e medindo em cada ponto:

1. **RTF** (quanto tempo levou);
2. **erro por classe** contra a contagem manual (quanto se perdeu).

Sai uma curva que responde, com prova, onde cada medida quebra. A partir dela:

- define-se o ritmo mínimo de cada métrica da pista lenta;
- define-se o ritmo suficiente da pista rápida;
- e só então faz sentido falar em máquina, prazo e preço.

**Pré-requisito:** o leitor é Python. A máquina onde este documento foi escrito não tem
Python instalado, então o experimento ainda não foi rodado.

## 5. O que este documento NÃO afirma

- Não afirma que a pista rápida já existe: é proposta de arquitetura, não código escrito.
- Não afirma acurácia de nenhuma das duas pistas: a validação manual cobre 6 objetos de
  118 contados (~5%), com uma discordância conhecida (1 ônibus).
- Não afirma tempo nem custo de implantação: a tabela da seção 1 não permite isso.

## 6. E se a máquina fosse um servidor? A conta para 300 câmeras

> Pedido do Enio em 21/09/2026: esquecer o notebook e pensar num servidor sério, ou em
> vários, para 300 câmeras.
>
> **Leia primeiro:** a conta da **demanda** abaixo é sólida, porque só usa o número medido
> e aritmética. A conta da **oferta** — quantas câmeras cabem num servidor — **não pode ser
> feita hoje**, porque nunca medimos o leitor em GPU. Não invente esse número.

### 6.1 A demanda, que dá para calcular

Unidade: **uma máquina como a nossa = 3,83 quadros/s = 330.912 quadros por dia.**

Processamento contínuo, as 300 câmeras:

| cenário | quadros/s | equivale a |
|---|---:|---:|
| tudo, o tempo todo, todos os quadros (30 q/s) | 9.000 | **2.350 máquinas** |
| pista rápida, 1 quadro por segundo | 300 | 78 máquinas |
| pista rápida, 1 quadro a cada 2 s | 150 | **39 máquinas** |

Pista lenta (com rastreio), só nas janelas que importam:

| recorte | quadros/dia | equivale a |
|---|---:|---:|
| 300 câmeras × 2 h/dia × 30 q/s | 64,8 M | 196 máquinas |
| 300 câmeras × 2 h/dia × 10 q/s | 21,6 M | 65 máquinas |
| 20 câmeras × 2 h/dia × 30 q/s | 4,3 M | 13 máquinas |
| 20 câmeras × 2 h/dia × 10 q/s | 1,4 M | **4,4 máquinas** |
| 5 câmeras × 4 h/dia × 30 q/s | 2,2 M | 6,5 máquinas |

A primeira linha da primeira tabela é a mais importante do documento: **ler 300 câmeras
inteiras, o tempo todo, precisaria de mais de dois mil computadores como o nosso.** Isso
não se resolve comprando servidor. Se resolve não fazendo isso.

### 6.2 As três alavancas, e o peso de cada uma

| decisão | quanto reduz |
|---|---:|
| analisar 2 quadros/s em vez de 30 | **15×** |
| rastrear 20 câmeras em vez de 300 | **15×** |
| processar 2 h/dia em vez de 24 h | **12×** |
| **as três juntas** | **2.700×** |

Nenhuma escolha de hardware chega perto disso. **O dimensionamento é decidido pelo
recorte, não pela máquina.** É por isso que a proposta das duas pistas (seção 3) é uma
decisão de arquitetura e não uma otimização.

### 6.3 O que falta para responder “quantos servidores?”

Uma medição, que nunca foi feita: **o leitor rodando em GPU**. Sem ela:

- não sabemos quantos quadros/s uma placa entrega com YOLO11n + ByteTrack no nosso vídeo;
- não sabemos o custo de **decodificar** 300 fluxos de vídeo, que é trabalho separado da
  detecção e pode virar o gargalo antes dela;
- não sabemos quanto o rastreio (ByteTrack) pesa em relação à detecção, e é ele que obriga
  ritmo alto na pista lenta.

Enquanto isso não for medido, **qualquer número de servidores ou de reais é chute**, e
chute não entra em reunião com prefeitura. A sequência honesta é:

1. rodar a curva da seção 4 (quadros × RTF × erro) e fixar o ritmo mínimo de cada medida;
2. medir o leitor numa GPU, com o mesmo vídeo;
3. medir o custo de decodificação com vários fluxos simultâneos;
4. só então cruzar com a demanda da seção 6.1 e dizer quantas máquinas — e só então falar
   em preço.

### 6.4 O recorte que eu levaria para a primeira reunião

Não 300 câmeras. **Cinco**, no corredor que a Secretaria já sabe que é problema, com
2 a 4 horas por dia nas janelas de pico. Pela tabela acima, isso fica na ordem de meia
dúzia de máquinas como a nossa — ou seja, cabe em **um** servidor decente, provavelmente
com folga, e vira o primeiro número real que o projeto já teve sobre custo.

Prometer 300 câmeras antes de medir uma é o caminho mais rápido para perder a conversa
quando o técnico da prefeitura fizer a conta no guardanapo.

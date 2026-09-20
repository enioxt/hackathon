# Prompts de design — PAINEL (dashboard) · Visão de Rota

> Projeto: Hackathon Cidades Inteligentes, Patos de Minas (MG), 18–20/09/2026.
> Cole o PROMPT-MÃE uma vez no início da conversa do ChatGPT (gerador de imagem). Depois cole um
> prompt de tela por vez — cada um é autossuficiente, mas manter a mesma conversa ajuda a
> consistência visual.

---

## PROMPT-MÃE (colar uma vez no início da conversa)

> Vamos gerar, ao longo desta conversa, uma série de mockups de interface em alta fidelidade para
> um painel de sistema chamado "VISÃO DE ROTA — Mobilidade Inteligente e Previsível", projeto de
> mobilidade urbana para Patos de Minas (MG), cidade média do interior do Brasil (~160 mil
> habitantes, cerrado, avenidas largas com canteiro central, ônibus urbano, muita moto — nunca
> desenhe metrópole, arranha-céu ou cidade estrangeira). Estilo visual fixo para todas as telas:
> painel de sistema escuro e denso em dados, com barra lateral de navegação à esquerda, tipografia
> sem serifa geométrica, títulos grandes e curtos, microtítulo em caixa alta espaçada acima de cada
> título de seção, cantos arredondados discretos, muito respiro entre blocos, cartões com borda sutil
> e leve brilho interno. Paleta fixa: fundo azul-marinho profundo #0B1B2B, texto branco-gelo #F6F8FA,
> âmbar-semáforo #E8A33D como cor de destaque e alerta, verde #2E9E6B para "medido/ok", vermelho
> #D6453D para problema, cinza #9AA5B1 para "não medido". Onde houver fotografia, use sempre
> fotografia cinematográfica realista de cidade média brasileira ao amanhecer ou entardecer — nunca
> ilustração infantil, nunca renderização 3D genérica de banco de imagens. Texto em português do
> Brasil, com acentos corretos, ortografia exata, sem letras inventadas. Proibido em qualquer tela:
> rosto identificável em close, placa de veículo legível, nome de empresa privada, nome de pessoa
> real, logotipo de prefeitura/polícia/universidade, valores em R$, as palavras "100%", "único" ou
> "garantido". Onde houver câmera de trânsito na imagem, mostre caixas de contagem sobre veículos e
> pedestres sempre como silhuetas sem rosto, vista de cima ou de costas — nunca identificação de
> pessoa. Toda tela que mostrar dado simulado (não medido de verdade) precisa de uma etiqueta
> "SIMULAÇÃO" visível e destacada em âmbar, separada visualmente do que é "MEDIDO". Confirme que
> entendeu o estilo antes de eu mandar o primeiro prompt de tela.

---

### 1. Visão geral — desktop 16:10
**Para que serve:** tela inicial do painel, resumo executivo do que o sistema já prova sobre o trânsito de Patos de Minas em agosto/2026.
**Prompt (colar no ChatGPT):**
> Crie um mockup de interface em alta fidelidade, painel de sistema escuro, proporção 16:10,
> seguindo a identidade visual combinada (azul-marinho #0B1B2B, âmbar #E8A33D, verde #2E9E6B,
> vermelho #D6453D, cinza #9AA5B1, tipografia sem serifa geométrica). Layout de cima para baixo:
> topo com barra superior fina mostrando o nome "VISÃO DE ROTA" à esquerda e um sino de notificação
> discreto à direita. Abaixo, barra lateral esquerda estreita com ícones e 6 grupos de navegação em
> texto pequeno, nesta ordem exata: "Time e roteiro", "O que o dado prova", "Mapa e simulações",
> "Câmeras", "Fontes e dinheiro", "Próximos passos" — o segundo grupo "O que o dado prova" destacado
> como item ativo, com uma barra vertical âmbar ao lado. No topo da área de conteúdo, um microtítulo
> em caixa alta espaçada "AGOSTO DE 2026 · PATOS DE MINAS" e abaixo o título grande "Verdade
> operacional do trânsito" com subtítulo menor "Ruas com memória. Mobilidade com previsibilidade.".
> Logo abaixo, uma fileira de 5 cartões numéricos lado a lado, cada um com uma bolinha de semáforo
> colorida no canto (verde para medido), um número grande, um rótulo curto e um pequeno botão de
> texto "prova" no canto inferior: cartão 1 "[número da operadora]" rótulo "passageiros transportados"; cartão 2
> "[número da operadora]" rótulo "viagens no mês"; cartão 3 "06:20" rótulo "pior bloco de 5 min" com bolinha
> âmbar; cartão 4 "34.694" rótulo "horas de atraso acumuladas"; cartão 5 "1.100" rótulo "ocorrências
> com coordenada". Abaixo dos cartões, à esquerda um mini-mapa estilizado escuro da cidade com manchas
> de calor sobrepostas em tons de âmbar e vermelho indicando concentração de passageiros e
> ocorrências, sem nomes de rua legíveis; à direita um bloco de texto com título "O que ficou de
> fora" e três linhas curtas descrevendo limitações declaradas dos dados. Rodapé simples com o nome
> "VISÃO DE ROTA" e a palavra "v0.1". Proporção final 16:10, fundo predominante azul-marinho escuro.

**Se sair errado, peça:** "corrija a ortografia de 'passageiros transportados'"; "os 6 grupos da barra lateral precisam estar na ordem exata pedida"; "a bolinha do cartão '06:20' precisa ser âmbar, não verde".

---

### 2. O que o dado prova — desktop 16:10
**Para que serve:** tela analítica que mostra o pico de atraso da manhã e a rastreabilidade de cada número.
**Prompt (colar no ChatGPT):**
> Crie um mockup de interface em alta fidelidade, painel de sistema escuro, proporção 16:10, mesma
> identidade visual (azul-marinho #0B1B2B, âmbar #E8A33D, verde #2E9E6B, vermelho #D6453D, cinza
> #9AA5B1, tipografia sem serifa geométrica). Barra lateral esquerda igual à anterior, com os 6
> grupos "Time e roteiro", "O que o dado prova", "Mapa e simulações", "Câmeras", "Fontes e dinheiro",
> "Próximos passos", agora com "O que o dado prova" ativo e destacado em âmbar. No topo da área de
> conteúdo, microtítulo em caixa alta "MANHÃ DE PICO" e título grande "Por que 06:20 é o pior
> horário". Abaixo, um gráfico de barras largo ocupando a maior parte da largura, eixo horizontal com
> blocos de 5 em 5 minutos da manhã, eixo vertical com número de passageiros; todas as barras em tom
> azul-acinzentado claro, exceto a barra referente a "06:20" destacada em âmbar sólido e com um
> pequeno rótulo flutuante acima mostrando "356 viagens · [número do relatório da operadora, fora deste repositório] passageiros". Abaixo do gráfico, à
> esquerda uma tabela estreita "Linhas mais atrasadas" com 4 linhas de exemplo com nomes genéricos
> como "Linha A – Bairro B", "Linha C – Bairro D", cada uma com uma barra pequena de atraso e uma
> porcentagem; a linha do topo tem "36% chegam mais de 5 min atrasadas" em destaque. À direita, um
> cartão expandido "Prova a um clique" mostrando, em fonte monoespaçada pequena, uma cadeia de
> proveniência simulada: "fonte pública → verificação → número publicado", com um ícone de cadeado
> aberto indicando transparência. Fundo azul-marinho escuro em toda a tela, respiro generoso entre
> blocos, proporção final 16:10.

**Se sair errado, peça:** "a barra do gráfico correspondente a 06:20 precisa estar claramente mais alta e em âmbar"; "os nomes das linhas de ônibus têm que ser genéricos, sem nome real de bairro específico"; "corrija a ortografia de 'atrasadas'".

---

### 3. Mapa de calor — desktop 16:10
**Para que serve:** visualização geográfica de onde estão as ocorrências e a concentração de passageiros na cidade.
**Prompt (colar no ChatGPT):**
> Crie um mockup de interface em alta fidelidade, painel de sistema escuro, proporção 16:10, mesma
> identidade visual combinada. Barra lateral esquerda com os mesmos 6 grupos, "Mapa e simulações"
> ativo e destacado em âmbar. Microtítulo em caixa alta "GEOGRAFIA DO TRÂNSITO" e título grande "Onde
> a cidade mais sofre". Corpo principal ocupado por um mapa estilizado de uma cidade média brasileira
> genérica, vista de cima, com avenidas largas e um canteiro central visível, cerrado ao redor da
> mancha urbana — sem nomes de rua legíveis, sem qualquer texto que identifique a cidade. Sobre o
> mapa, manchas de calor semitransparentes em gradiente de âmbar para vermelho indicando concentração
> de passageiros e ocorrências de trânsito, mais intensas perto de cruzamentos centrais; pequenos
> pontos brancos marcando ocorrências individuais. No canto superior direito do mapa, um seletor de
> hora do dia em formato de controle deslizante horizontal com marcação em "06:20" destacada em
> âmbar. Abaixo do mapa, uma legenda horizontal simples com quadrados de cor e texto curto: "baixa
> concentração", "média concentração", "alta concentração". No canto inferior do mapa, um aviso em
> texto pequeno e cinza dentro de uma faixa discreta: "Mapa por proxy de região, não é localização
> exata por GPS.". Fundo azul-marinho escuro, proporção final 16:10.

**Se sair errado, peça:** "o mapa não pode ter nenhum texto de nome de rua ou bairro, remova"; "a legenda de calor precisa ter só 3 categorias de intensidade"; "o aviso de proxy de região precisa estar visível, não apagado".

---

### 4. Horário escalonado — desktop 16:10
**Para que serve:** compara o pico de hoje medido com uma simulação de horário escalonado entre empresas.
**Prompt (colar no ChatGPT):**
> Crie um mockup de interface em alta fidelidade, painel de sistema escuro, proporção 16:10, mesma
> identidade visual combinada. Barra lateral esquerda com os mesmos 6 grupos, "Mapa e simulações"
> ativo. Microtítulo em caixa alta "SIMULAÇÃO DE HORÁRIO ESCALONADO" e título grande "E se as
> empresas espalhassem a entrada?". Corpo dividido em duas colunas de gráfico de linha lado a lado,
> cada uma com seu próprio cabeçalho: coluna esquerda com etiqueta pequena em verde "HOJE (MEDIDO)" e
> uma curva de passageiros ao longo da manhã com pico destacado em âmbar mostrando "15.469"; coluna
> direita com etiqueta grande e bem visível em âmbar "SIMULAÇÃO" e uma curva mais achatada com pico
> menor mostrando "12.579". Abaixo das duas colunas, uma frase de destaque centralizada em fonte
> grande: "Pico cai de 15.469 para [número do relatório da operadora, fora deste repositório] passageiros (19% menor)". Abaixo da frase, dois controles
> deslizantes horizontais lado a lado com rótulo acima de cada um: "Empresas participando — 33%" e
> "Espalhar a entrada até — 30 min", ambos com o indicador do controle em âmbar. No rodapé da área de
> conteúdo, uma faixa discreta cinza-clara com o texto "Simulação baseada em dados medidos de agosto
> de 2026 — não é previsão garantida.". Fundo azul-marinho escuro, proporção final 16:10.

**Se sair errado, peça:** "a etiqueta SIMULAÇÃO precisa estar bem maior e mais visível que a etiqueta HOJE (MEDIDO)"; "corrija a ortografia de 'escalonado'"; "os dois números do pico (15.469 e 12.579) precisam aparecer exatamente como estão, sem arredondar".

---

### 5. Câmeras — Segunda Leitura — desktop 16:10
**Para que serve:** mostra como a mesma câmera de trânsito é lida uma segunda vez para contar veículos e pedestres sem identificar ninguém.
**Prompt (colar no ChatGPT):**
> Crie um mockup de interface em alta fidelidade, painel de sistema escuro, proporção 16:10, mesma
> identidade visual combinada. Barra lateral esquerda com os mesmos 6 grupos, "Câmeras" ativo e
> destacado em âmbar. Microtítulo em caixa alta "MÉTODO SEGUNDA LEITURA" e título grande "A mesma
> câmera, uma segunda leitura". Corpo principal dominado por um quadro grande simulando o vídeo de
> uma câmera de trânsito posicionada em um cruzamento de avenida larga com canteiro central, vista de
> cima em ângulo, imagem em tom de cidade ao entardecer. Sobre o vídeo, caixas de contagem retangulares
> finas em âmbar e verde desenhadas ao redor de veículos e pedestres, todos representados como
> silhuetas escuras sem rosto e sem placa legível — carro, moto, ônibus, e um pedestre em silhueta
> completa; cada caixa com um rótulo pequeno de categoria ("carro", "moto", "ônibus", "pedestre").
> Abaixo do vídeo, uma fileira de 4 contadores numéricos por bloco de 5 minutos, um para cada
> categoria, com ícone simples e número grande. No canto superior direito do quadro de vídeo, um selo
> arredondado bem visível com fundo verde escuro e texto branco: "sem rosto · sem placa · frame
> descartado". Fundo azul-marinho escuro ao redor do quadro de vídeo, proporção final 16:10.

**Se sair errado, peça:** "nenhuma silhueta pode ter rosto visível, mesmo estilizado — remova detalhes de rosto"; "a placa do veículo precisa estar borrada ou ausente, não legível"; "o selo 'sem rosto · sem placa · frame descartado' precisa estar mais visível, aumente o contraste".

---

### 6. Simulação de cobertura de câmeras — desktop 16:10
**Para que serve:** compara cenários de quantas câmeras seriam lidas pelo sistema, sem inventar resultados ainda não calculados.
**Prompt (colar no ChatGPT):**
> Crie um mockup de interface em alta fidelidade, painel de sistema escuro, proporção 16:10, mesma
> identidade visual combinada. Barra lateral esquerda com os mesmos 6 grupos, "Câmeras" ativo.
> Microtítulo em caixa alta "SIMULAÇÃO DE COBERTURA" e título grande "Quantas câmeras o sistema
> poderia ler?" com uma etiqueta grande e bem visível em âmbar "SIMULAÇÃO" ao lado do título. Logo
> abaixo, um seletor horizontal de cenário com 5 opções em forma de botões: "10", "50", "100", "400",
> "600" câmeras, com o botão "100" destacado como selecionado em âmbar sólido. Abaixo do seletor, à
> esquerda um mapa estilizado escuro da cidade média brasileira com pequenos pontos representando
> posições de câmera espalhados pelas avenidas principais, sem nomes de rua legíveis. À direita do
> mapa, um conjunto de barras horizontais de cobertura SEM nenhum número dentro delas — as barras
> devem aparecer com comprimento incerto ou tracejado, e ao lado de cada uma o texto "—" no lugar de
> percentual, indicando resultado ainda não calculado. Abaixo desse bloco, uma coluna estreita
> intitulada "Premissas declaradas" com 3 a 4 linhas curtas de texto explicando hipóteses da
> simulação (sem inventar números). Fundo azul-marinho escuro, proporção final 16:10.

**Se sair errado, peça:** "as barras de cobertura não podem ter nenhum número ou percentual dentro, use apenas o travessão '—'"; "a etiqueta SIMULAÇÃO precisa estar no topo, ao lado do título, bem grande"; "remova qualquer percentual que tenha aparecido nas barras".

---

### 7. Chat "Pergunte ao dado" — desktop 16:10
**Para que serve:** painel de conversa onde o usuário pergunta sobre os dados e recebe resposta com número, gráfico e prova.
**Prompt (colar no ChatGPT):**
> Crie um mockup de interface em alta fidelidade, painel de sistema escuro, proporção 16:10, mesma
> identidade visual combinada. Barra lateral esquerda com os mesmos 6 grupos, "O que o dado prova"
> ativo. A tela é dividida em duas colunas principais: a maior, à esquerda, ocupa cerca de 65% da
> largura e mostra um gráfico de barras por bloco de 5 minutos da manhã, com a barra referente a
> "06:20" destacada em âmbar e um rótulo grande acima dela; título pequeno acima do gráfico dizendo
> "Gráfico em destaque pela pergunta". A coluna direita, mais estreita, é um painel de conversa estilo
> chat com fundo levemente mais claro que o resto, título pequeno "Pergunte ao dado" no topo e, logo
> abaixo, um indicador de status discreto em texto pequeno cinza-esverdeado: "ligado à sessão de
> análise · ativo", com uma bolinha verde ao lado. Abaixo, uma bolha de mensagem à direita (usuário)
> com o texto "Qual bloco de 5 minutos mais atrasa no mês?" e, logo abaixo, uma bolha de resposta à
> esquerda (sistema) contendo o texto "06:20 é o pior bloco: 356 viagens e [número do relatório da operadora, fora deste repositório] passageiros no mês.",
> um mini-gráfico de barras pequeno dentro da própria bolha, e um botão pequeno de texto "ver prova"
> no canto inferior da bolha. Campo de texto de entrada de mensagem na base do painel de chat, com
> placeholder "Pergunte sobre os dados do trânsito...". Fundo azul-marinho escuro em toda a tela,
> proporção final 16:10.

**Se sair errado, peça:** "a bolha de resposta do sistema precisa ter o número 06:20 exatamente como pedido"; "o indicador 'ligado à sessão de análise · ativo' precisa estar visível no topo do painel de chat"; "corrija a ortografia de 'Pergunte ao dado'".

---

### 8. Visão geral — mobile 9:19
**Para que serve:** versão mobile da tela de visão geral, para mostrar que o painel também funciona no celular.
**Prompt (colar no ChatGPT):**
> Crie um mockup de interface em alta fidelidade, painel de sistema escuro, versão mobile em
> proporção 9:19 (tela alta e estreita de celular), mesma identidade visual combinada (azul-marinho
> #0B1B2B, âmbar #E8A33D, verde #2E9E6B, vermelho #D6453D, cinza #9AA5B1, tipografia sem serifa
> geométrica). No topo, uma barra fina com o nome "VISÃO DE ROTA" à esquerda e um ícone de menu
> hambúrguer à direita (a navegação lateral de 6 grupos fica escondida atrás desse ícone, não precisa
> aparecer expandida). Abaixo, microtítulo em caixa alta "AGOSTO DE 2026 · PATOS DE MINAS" e título
> "Verdade operacional do trânsito" em fonte um pouco menor que a versão desktop. Logo abaixo, os 5
> cartões numéricos empilhados verticalmente em vez de lado a lado, cada um ocupando a largura total
> da tela, com bolinha de semáforo, número grande, rótulo curto e botão pequeno "prova": "[número da operadora]
> passageiros transportados" (verde), "[número do relatório da operadora, fora deste repositório] viagens realizadas" (verde), "06:20 pior bloco de 5
> min" (âmbar), "34.694 horas de atraso acumuladas" (âmbar), "1.100 ocorrências com coordenada"
> (cinza). Abaixo dos cartões, um mini-mapa de calor estilizado ocupando a largura total, mais baixo
> que largo. Rodapé simples com o nome "VISÃO DE ROTA". Fundo azul-marinho escuro em toda a tela,
> proporção final 9:19, elementos com bastante espaço de toque entre si.

**Se sair errado, peça:** "os 5 cartões precisam estar empilhados um embaixo do outro, não em grade"; "a proporção final precisa ser alta e estreita (9:19), não quadrada"; "corrija a ortografia de 'ocorrências'".

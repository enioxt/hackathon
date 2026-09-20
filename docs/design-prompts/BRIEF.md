# Brief — prompts de design para o ChatGPT (geração de imagem), projeto Visão de Rota

## O que se pede
Escrever PROMPTS prontos para colar no ChatGPT (gerador de imagem) que produzam mockups de tela
completos e de alta fidelidade. Um prompt por tela. O Enio cola, gera, e usa a imagem como alvo
visual para o HTML. Cada prompt é autossuficiente (o ChatGPT não vê os outros).

## Referência visual aprovada pelo Enio (ABRA e olhe antes de escrever)
- `(arquivo local do time) Image 19 de set. de 2026, 11_00_00.png` — os 3 formatos: 1 GALERIA
  (escura, emocional, foto grande), 2 LAB/ÍNDICE (clara, grade de cards com foto, chips de filtro
  por estágio, etiqueta de estágio em cada card), 3 DOSSIÊ (escura, hero, abas, "por que", aplicações
  com ícone, "como funciona" em 4 passos, linha de status Ideia→Conceito→Protótipo→MVP→Em uso, vídeo,
  "o que vem a seguir", chamada para participar).
- `(arquivo local do time) Image 19 de set. de 2026, 11_00_09 (1).png` — página clara tipo
  portal: hero com foto de paisagem ao amanhecer e pessoa de costas, palavra-chave em cor de
  destaque terrosa, 3 passos numerados, grade de ideias com foto e etiqueta.
- `(arquivo local do time) Image 19 de set. de 2026, 10_59_05 (1).png` — painel de sistema
  escuro: barra lateral com ícones, fileira de 5 cartões de número com mini-gráfico, tabela de
  fila, cartões em grade, gráfico de barras+linha, anel de percentual.

Linguagem comum às três: tipografia sem serifa geométrica, títulos grandes e curtos, microtítulo
em caixa alta espaçada acima do título, cantos arredondados discretos, fotografia cinematográfica
real (nunca ilustração infantil nem 3D de banco de imagem), muito respiro, azul-marinho profundo no
escuro e branco-gelo no claro.

## Identidade do projeto
- Nome: VISÃO DE ROTA. Subtítulo: Mobilidade Inteligente e Previsível.
- Assinatura: "Ruas com memória. Mobilidade com previsibilidade."
- Método: "Segunda Leitura" — a mesma câmera que a cidade já tem, uma segunda leitura: sem rosto,
  sem placa, só o trânsito.
- Ideia em uma frase: nenhum sensor novo, nenhum app novo; ligar e ler o que Patos de Minas já tem.
- Evento: Hackathon Cidades Inteligentes, Patos de Minas (MG), 18–20/09/2026.
- Cidade: Patos de Minas, interior de Minas Gerais, ~160 mil habitantes, cerrado, avenidas largas
  com canteiro central, ônibus urbano, muita moto. Fotos devem parecer cidade média brasileira
  real — nunca metrópole, nunca arranha-céu, nunca cidade estrangeira.
- Paleta sugerida: azul-marinho #0B1B2B, branco-gelo #F6F8FA, âmbar-semáforo #E8A33D como destaque
  (a cor de atenção do trânsito), verde #2E9E6B para "medido/ok", vermelho #D6453D para problema,
  cinza #9AA5B1 para "não medido". O semáforo de 4 estados (verde medido · amarelo medido com
  ressalva · vermelho problema · cinza não medido) é parte da identidade.

## Números reais (use estes, exatamente; não invente outros)
- Agosto/2026, transporte coletivo: [número do relatório da operadora, fora deste repositório] viagens · [número do relatório da operadora, fora deste repositório] passageiros · 35 linhas.
- Pior bloco de 5 minutos: 06:20 — 356 viagens e [número do relatório da operadora, fora deste repositório] passageiros somados no mês; 36% chegam
  mais de 5 min atrasadas.
- 34.694 horas de passageiro chegando atrasado no mês · 3.833 horas de ônibus parado no ponto.
- 1.100 ocorrências de trânsito com coordenada (2025 + início de 2026), 18 ocorrências fatais (19 vítimas) — dado aberto do Estado.
- 83 itens verificados · 32 fontes públicas com dado de Patos abertas hoje · 12 dependem de pedido.
- Infra que já existe: 240 câmeras em 140 pontos · semáforo com IA em teste em uma avenida
  (36 de 76 equipamentos) · app oficial da prefeitura.
- Simulador de horário escalonado: com 33% das empresas espalhando a entrada em até 30 min, o pico
  de 15.469 cai para 12.579 (19% menor). ISTO É SIMULAÇÃO — toda tela que mostrar simulação leva a
  etiqueta "SIMULAÇÃO" visível, separada do que é "MEDIDO".
- Simulação de câmeras: cenários 10 · 50 · 100 · 400 · 600 câmeras lidas. Os resultados ainda não
  foram calculados: nas telas, use "—" ou barras sem número e a etiqueta SIMULAÇÃO. Não invente percentuais.
- 9 ideias no hub: Visão de Rota · Segunda Leitura · Horário Escalonado · Ônibus da UNIPAM · Quase
  (quase-acidentes) · Rua com Memória · Rota Humana · Olho Adiante · Missão da semana no app da cidade.

## Regras duras do texto que vai DENTRO da imagem
- Português do Brasil, com acentos corretos. Peça ao gerador: "texto legível, ortografia exata,
  sem letras inventadas". Textos curtos; liste no prompt, entre aspas, cada texto que deve aparecer.
- Proibido: rosto identificável em close, placa de veículo legível, nome de empresa privada, nome de
  pessoa, logotipo de prefeitura/polícia/universidade, valores em R$, "100%", "único", "garantido".
- Nada de jargão interno de ferramenta (nada de "agente", "kernel", "sessão", "commit").
- Onde houver câmera na imagem: caixas de contagem sobre veículos e pedestres SEM rosto (silhuetas,
  vista de cima ou de costas), mostrando que o sistema conta e classifica, não identifica.

## Formato de cada prompt (siga igual)
```
### <n>. <nome da tela> — <formato: desktop 16:10 | mobile 9:19 | slide 16:9>
**Para que serve:** 1 frase.
**Prompt (colar no ChatGPT):**
> texto corrido, 150–260 palavras, em português, começando por "Crie um mockup de interface em alta
> fidelidade..." — descreve layout de cima para baixo, cada bloco, os textos exatos entre aspas,
> paleta com hex, tipografia, estilo da fotografia, o que NÃO pode aparecer, e a proporção.
**Se sair errado, peça:** 2–3 correções curtas prováveis (ex.: "corrija a ortografia de ...").
```
Antes do primeiro prompt do arquivo, escreva um bloco "PROMPT-MÃE (colar uma vez no início da
conversa)" de ~120 palavras que fixa identidade, paleta, tipografia e proibições, para o ChatGPT
manter consistência entre as telas da mesma conversa.

## Entrega
Escreva SÓ o arquivo .md indicado na sua tarefa. Não edite nenhum outro arquivo, não faça commit,
não rode nada de rede. Na resposta final, devolva: caminho do arquivo, número de prompts, e
qualquer dúvida marcada como `UNVERIFIED:`.

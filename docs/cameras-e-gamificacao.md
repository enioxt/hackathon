## O que faz uma câmera ser "inteligente"

**A inteligência não está na câmera. Está no que roda atrás dela.** Uma câmera de segurança é um sensor de vídeo: lente, sensor, codificador, stream (RTSP/ONVIF). "Inteligente" é quando existe um processador — na própria câmera (edge), num servidor local (NVR/Frigate) ou na nuvem — que transforma o vídeo em **evento estruturado**: `carro entrou na zona X às 07:42:13, 43 km/h, sentido leste`. Sem isso é só gravação para olhar depois.

**Toda câmera de segurança pode virar inteligente?** Quase toda, com três condições medíveis:

| Condição | Como checar | Se falhar |
|---|---|---|
| **1. Stream acessível** — a câmera entrega RTSP/ONVIF (padrão das IP desde ~2012) | `ffprobe rtsp://<ip>/...` responde com codec e resolução | Câmera analógica antiga → só via DVR com saída de rede |
| **2. Ângulo e altura servem ao que se quer contar** | 1 frame: vê-se a via inteira, veículos com ≥ 40 px de altura, sem contraluz forte | Repositionar ou escolher outra câmera do mesmo ponto (o Olho Vivo tem 360°) |
| **3. Processador com um detector** — Frigate + OpenVINO/YOLO numa máquina com CPU Intel ou GPU modesta processa 5-10 câmeras a 5 fps | Rodar o Frigate com 1 câmera e ver `person/car/motorcycle/bus/bicycle` com confiança | Falta hardware → contar em vídeo gravado (é o que o MVP faz) |

O que a câmera já instalada NÃO precisa ter: reconhecimento facial, leitura de placa, nuvem. Para mobilidade queremos **contagem, classe, trajetória e velocidade** — e descartar o frame. Isso é o "tratamento correto": detector determinístico primeiro, LLM só para explicar o evento, humano decide. É o desenho do FORJA (recebe e guarda eventos: REAL; enxergar vídeo: planejado) e o que o Olho Vivo (240 câmeras, 140 pontos, 25 servidores) já tem de infraestrutura.

**O exemplo que o time quer mostrar (ata das 10h):** a câmera revela que acidentes crescem quando uma caminhonete para fora do recuo (3 a 5 m além do permitido). Tipo e tamanho do veículo saem da imagem; a causa sai do cruzamento com o horário e o ponto. É o "porquê" que o time disse que precisa entregar, não só o dado bruto.

**"Olho adiante" (ata das 9h):** painel uma esquina antes mostrando o fluxo da via seguinte em verde, laranja e vermelho, para entregador e motorista escolherem a rota. A câmera da frente alimenta o painel de trás. Pontos citados: balão da Volks, José de Santana, Imaculada, Sideral.

**Avançar da melhor maneira, em ordem de custo:** (1) 1 vídeo gravado de 1 cruzamento → Frigate → contagem por 5 min → gráfico — cabe no domingo; (2) 1 stream autorizado do Olho Vivo num ponto de ônibus da UNIPAM → chegada real dos ônibus por minuto; (3) 10 pontos → mapa de fluxo verde/amarelo/vermelho; (4) só então "quase-acidente" (TTC/PET) — exige calibração de distância por câmera.

## Gamificação com o que a cidade já tem (Conecta Patos, políticos, influenciadores, gente local)

**Base que existe (REAL, verificado 19/09):** o **Conecta Patos** é o app oficial da Prefeitura desde 16/02/2022 (plataforma AppCidades; Play Store, App Store e web em `patosdeminasmg.appcidades.com.br`). Já tem: abertura de chamado com foto/vídeo por assunto — **Trânsito** incluído —, enquetes, campanhas, notícias e notificação. O **Patos Premia** é programa de cidadania fiscal (nota fiscal → sorteio), não de transporte — o plano MobiPatos+ de 2025 apontava para ele por engano de nome; a peça certa é o Conecta Patos.

**Mecânica simples, sem app novo (o que o MobiPatos+ já desenhou, reduzido ao que cabe no app que existe):**

| Peça | Como fica no Conecta Patos | Dado que gera | Quem puxa |
|---|---|---|---|
| **Missão da semana** ("registre onde você perdeu tempo hoje") | Enquete/campanha com localização opcional e 1 toque de 1 a 5 (é o Senso Urbano, que já roda) | mapa de calor de tempo perdido, por hora | influenciador local lança a missão; político/secretário responde em 7 dias com o que mudou |
| **Placar público por linha de ônibus** | Notícia/campanha semanal: linha mais pontual, linha que mais melhorou | relatório da operadora (já temos agosto) | operadora e prefeitura assinam o placar; ranking vira notícia |
| **Chamado de trânsito com resposta medida** | Já existe: chamado → protocolo → prazo | tempo de resposta por bairro | ouvidoria (Lei 533/2017) publica o tempo médio |
| **Pontos e recompensa** | Cadastro do app já tem CPF/e-mail — pontos por missão cumprida; prêmio do comércio local (a "Vitrine" do MobiPatos+) | engajamento por bairro | comerciantes, Sebrae; sorteio pode reaproveitar o motor do Patos Premia |
| **Embaixadores** | 5 pessoas conhecidas (rádio, igreja, escola, motorista de ônibus, vereador) com painel próprio: "meu bairro respondeu X" | alcance por bairro | eles mesmos — a peça é o painel que mostra o efeito deles |

**O que não inventar:** app novo, moeda própria, cadastro paralelo. Tudo acima cabe em enquete + campanha + chamado, que o app já tem; a única construção é o painel público (esta página) lendo os dados.

**Riscos declarados:** o backend do Conecta Patos é da AppCidades (fornecedor) — abrir enquete geolocalizada e exportar respostas depende da prefeitura pedir ao fornecedor (pedido presencial no evento); LGPD: localização só opt-in e agregada por célula, nunca trajeto individual (Guard Brasil cobre CPF/telefone nos exports).

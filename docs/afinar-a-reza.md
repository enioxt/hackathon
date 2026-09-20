## Afinar a reza — o que o time precisa fechar hoje, antes de qualquer teste

> Proposta para discutir no grupo. Nada aqui está decidido: é para todos mexerem até virar o documento final.

### 1. Objetivo (uma frase, para todos repetirem igual)
**Mostrar, com dado real de Patos, onde as pessoas perdem tempo no deslocamento, e provar que a cidade consegue medir o antes e o depois de cada mudança.**

Pergunta central (Rafael, 09:20): *quais dados precisamos coletar para descobrir onde as pessoas estão perdendo tempo e como transformar isso em ação e informação previsível?*

### 2. Nome
Proposta do Rafael (09:46): **VISÃO DE ROTA — Mobilidade Inteligente e Previsível**. Assinatura: *Ruas com memória. Mobilidade com previsibilidade.*
Para o grupo decidir: fica assim? Alternativas que apareceram ontem: QUASE · Rua com Memória · Rota Humana. Regra de bolso: nome que cabe na primeira frase do pitch e um morador entende.

### 2b. O que o time já fechou na mesa (atas de 9h e 10h, pelo Rafael)
- **Produto:** análise das imagens das câmeras que a cidade já tem, com consultoria que interpreta. Software nosso, entregue por contrato. Monetização fica para depois.
- **Discurso único:** todos falam igual; quando não souber, dizer onde está a resposta (a prefeitura tem o dado).
- **Prova:** simular em 10 minutos com dado real e mostrar no mapa.
- **Caso que prova o horário escalonado:** a Gaúcha perdia funcionário porque o turno fechava 17:30 e o ônibus passava 18:30; o dono foi à operadora, o horário foi ajustado, ficou 5 a 10 min de espera. IFTM: turma das 15:45 só 2ª e 6ª.
- **Número em disputa:** na mesa saiu "700" e "300" câmeras; a prefeitura publicou 240 em 140 pontos (mai/2026). Pedir o número hoje.

### 3. O que já temos (com número)
- Relatório de viagens do transporte coletivo, agosto/2026 inteiro (chegou pelo Gustavo): [número do relatório da operadora, fora deste repositório] viagens · [número do relatório da operadora, fora deste repositório] passageiros · pior bloco 06:20 (356 viagens, [número do relatório da operadora, fora deste repositório] passageiros, 36% chegam mais de 5 min atrasadas) · 34.694 horas de passageiro chegando atrasado no mês · 3.833 horas de ônibus parado no ponto.
- 1.100 ocorrências de trânsito com coordenada em Patos (2025 + início de 2026), 19 fatais — dado público do Estado (SEJUSP-MG).
- 32 fontes públicas com dado de Patos abertas hoje, de 83 itens verificados; 12 dependem de pedido (Prefeitura, operadora, UNIPAM).
- Infra que existe: Olho Vivo (240 câmeras, 140 pontos) · piloto de semáforo com IA na Av. Paracatu (36 de 76 equipamentos, desde 18/08) · app Conecta Patos (chamado de trânsito, enquete, campanha) · Patos Premia (nota fiscal, sorteio).
- Peças prontas: painel com mapa de calor e simulador de horário escalonado (este arquivo) · coleta por 1 link, sem app (Senso Urbano) · detector de câmera a ligar (Frigate).

### 4. Divisão sugerida (5 pesquisas do Rafael → 5 donos)
| Bloco | Dono (a definir) | Entrega até sábado 18h | Pergunta que precisa responder |
|---|---|---|---|
| Trânsito e semáforos | ? | 3 números do piloto da Av. Paracatu (pedir na SMTT) | o semáforo com IA mudou a fila? quanto? |
| Transporte público | ? | placar por linha (já pronto) + pedir maio-julho à operadora | qual linha melhorou/piorou? |
| Câmeras e dados | ? | 1 vídeo de 1 cruzamento contado por 5 min | quantos carros/motos/pedestres passam, por hora? |
| Informação ao cidadão | ? | enquete "onde perdi tempo hoje" no Conecta Patos ou por link | onde a população diz que perde tempo? bate com o dado? |
| IA, segurança e privacidade | ? | mapa de acidentes e regra de privacidade em 5 linhas | o que a câmera pode e não pode guardar? |

### 5. Informações a coletar HOJE (cada uma tem alguém no prédio)
1. **UNIPAM:** grade dos ônibus que chegam (origem, horário, onde param), para escalonar chegadas com ≥5 min e vaga fixa.
2. **Prefeitura/SMTT:** contagem por hora do piloto de semáforo da Av. Paracatu; lista dos 140 pontos do Olho Vivo; pesquisa origem-destino do PAITT (2023).
3. **Operadora:** relatórios de maio-julho (o "antes"), tabela de horários/GTFS do app.
4. **Empresas** (as que dão nome às linhas: Suinco, Gazin, Predilecta, Pró-Curar-Se, Cemil, Rações Patense + IFTM/UNIPAM): horário de entrada, saída e almoço; funcionários por turno, para o escalonamento.
5. **SEBRAE:** critérios da banca (não estão na página do evento).

### 6. Regras do jogo (para ninguém se queimar)
- Só dado público ou entregue ao time. Nada de dado policial.
- Número sempre com origem. Sem "100%", sem "único".
- Câmera conta e classifica; não guarda rosto nem placa.
- Publicar (site, repo, imprensa) é decisão do time, não de um só.

### 7. Próximo passo
Cada um responde no grupo com: (a) nome ok ou alternativa; (b) que bloco assume; (c) que informação da lista 5 consegue pegar hoje. Com as 3 respostas, o documento final fecha e aí começam os testes.

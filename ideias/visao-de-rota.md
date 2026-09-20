---
nome: Visão de Rota
assinatura: Ruas com memória. Mobilidade com previsibilidade.
time: Visão de Rota (Patos de Minas)
estagio: prototipo
tema: mobilidade urbana
pergunta: Onde as pessoas estão perdendo tempo na mobilidade de Patos, e como transformar isso em ação e informação previsível?
precisa: [DATA] grade dos ônibus fretados da UNIPAM · [DATA] horário de entrada/saída das 8 maiores empresas · [ACESSO] 1 câmera do Olho Vivo para processar na central · [HELP] alguém de trânsito para validar o método TTC/PET
contato: github.com/enioxt/hackathon
licenca: a definir pelo time (AGPL ou MPL em estudo)
cor: 0
---
## O que é
Uma segunda leitura das câmeras, dos ônibus e das bases públicas que Patos já tem: contar, classificar e medir tempo perdido, sem rosto e sem placa, processando na máquina onde a imagem já está. Cada mudança na cidade (semáforo, linha, ponto, horário de empresa) ganha um antes e um depois, com número.

## O que já funciona
- Painel do time com um mês de viagens do transporte coletivo (dado entregue ao time, não publicado): mostra o pior bloco de 5 minutos da manhã e as horas de atraso acumuladas.
- Mapa de calor por ponto e hora; 1.100 ocorrências com coordenada, 2025 e início de 2026, dado aberto do Estado (SEJUSP-MG).
- Simulador de horário escalonado das empresas (5 a 30 min) sobre o mapa real.
- 83 fontes públicas verificadas, com caminho de pedido para as que faltam.
- 4 vídeos gravados em Patos, lidos pelo motor de contagem (sem rosto, sem placa) — relatório com o que a máquina acertou e o que errou.
- Todo número do pitch com fonte ao lado (RENAEST, SEJUSP-MG, PNCP, ou "medido nesta máquina" com o arquivo).

## Onde ver
- Site: https://enioxt.github.io/hackathon/
- Aplicativo: https://enioxt.github.io/hackathon/demo/app.html
- Fluxo em 6 passos: https://enioxt.github.io/hackathon/demo/apresentar.html
- Relatório da leitura dos vídeos gravados em Patos: https://enioxt.github.io/hackathon/demo/patos-real/relatorio.html
- Pitch (fonte de cada número): https://enioxt.github.io/hackathon/pitch/
- Código: https://github.com/enioxt/hackathon

## Números (cada um com a fonte)
- 22.708 sinistros em Patos, 2018–ago/2026 — RENAEST, dado aberto federal.
- 30% dos sinistros têm moto envolvida (6.818 de 22.708) — mesma base RENAEST.
- ~40% das ocorrências com coordenada caem em 5 de cerca de 90 quadrantes de 1 km (a faixa exata varia de 38 a 44% conforme o tamanho da grade) — SEJUSP-MG, 1.100 ocorrências.
- R$ 7,95 milhões contratados em videomonitoramento no município, 2024–2029 (valor global contratado, não é valor já pago) — PNCP, contrato 206/2024.
- 4,04 quadros por segundo lidos pelo motor, nesta máquina, sem placa de vídeo dedicada — medido, arquivo `cco/camadas/clipes.json`.

## O que falta
Ver "precisa" acima. E o "antes": relatórios de maio a julho da operadora.

## As peças desta ideia
QUASE (quase-acidentes) · Rua com Memória (antes e depois) · Rota Humana (acessibilidade) · Horário escalonado · Chegada escalonada dos ônibus da UNIPAM · Olho adiante · Segunda Leitura (o método das câmeras) · Missão da semana no Conecta Patos. Cada uma tem card próprio neste hub.

## Como contribuir
Issue no repositório público (botão "Cadastrar o projeto do meu time" ou "Enviar uma ideia" no topo do hub). Regras: número com origem, sem dado pessoal, sem dado policial.

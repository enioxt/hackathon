## Hipóteses de negócio e operação — FILTER (para validar, não para vender ainda)

> Escrito sábado 19/09 11:00. Tudo aqui é HIPÓTESE até ter um cliente dizendo sim. O princípio que organiza tudo: **o mínimo possível, usando o que já existe, processando a imagem na máquina onde ela já está.** Nada de vídeo subindo para nuvem. Esse é o pulo do gato: a câmera continua da cidade, a imagem não sai da central, e o que viaja é um evento de 200 bytes (carro, moto, hora, zona, velocidade).

### 1. O que é o produto, em uma linha por camada
| Camada | O que é | Quem faz |
|---|---|---|
| **Sensor** | as câmeras que já existem (Olho Vivo, semáforo, câmera de loja/condomínio/empresa, celular parado numa janela) | já está pago |
| **Processador local** | 1 máquina na central de monitoramento (ou ao lado da câmera) rodando detector determinístico (Frigate + OpenVINO/YOLO): conta, classifica, mede trajetória e velocidade, descarta o frame | instalamos e mantemos |
| **Evento** | `{camera, hora, classe, zona, velocidade, direção, confiança}` — sem rosto, sem placa, sem vídeo | sai da máquina local; é o único dado que viaja |
| **Memória** | timeline por via/ponto/linha: baseline, antes/depois de intervenção, comparação | painel (este) |
| **Consultoria** | leitura dos eventos, hipótese, recomendação, medição do resultado | o time |

### 2. Hipóteses de cliente (ordem de proximidade, não de valor)
| # | Cliente | Dor que ele já disse ter | O que compra | Como chegamos |
|---|---|---|---|---|
| H1 | **Prefeitura de Patos (SMTT / Defesa Social)** | quer saber se o semáforo com IA funcionou; tem 240 câmeras e nenhum número de mobilidade delas | diagnóstico de tempo perdido + medição antes/depois do piloto da Av. Paracatu | é organizadora do hackathon; pedido presencial hoje |
| H2 | **Operadora do transporte coletivo** | perde passageiro e paga atraso; já entrega relatório mensal | placar de pontualidade por linha; onde o ônibus perde tempo (câmera no corredor) | já nos entregou agosto; pedir maio-julho |
| H3 | **Grandes empregadores** (Gaúcha, Suinco, Gazin, Predilecta, Cemil, Rações Patense) | perdem funcionário por horário de ônibus (caso Gaúcha, ata de 9h) | escalonamento de turno com número; câmera no portão medindo fila de saída | os nomes já estão nas linhas de ônibus |
| H4 | **UNIPAM / Marista / IFTM** | chegada de dezenas de ônibus no mesmo minuto | chegada escalonada ≥ 5 min + vaga fixa por ônibus, medida por câmera | UNIPAM é organizadora; pedir a grade hoje |
| H5 | **Entregadores / iFood / logística local** | ficam parados em balão e cruzamento sem saber o que vem | "olho adiante": fluxo da via seguinte por painel ou pelo app | ata de 9h; validar com 5 entregadores na porta |
| H6 | **Outras cidades de 100–250 mil hab. com videomonitoramento** (Itatiba, Umuarama, Sinop, Cachoeirinha, Pindamonhangaba — comparáveis no PNCP) | compraram câmera e semáforo, não compraram leitura | o mesmo pacote, replicado | depois de Patos provar |

### 3. Formas de entrada (onboarding) — a mais barata primeiro
1. **Vídeo gravado** (custo zero): cliente entrega 1 hora de gravação de 1 câmera; devolvemos contagem, fluxo por 5 min e 3 achados. Serve para validar o método sem nenhuma autorização de stream. É o que fazemos no hackathon.
2. **1 câmera ao vivo, na máquina dele**: instalamos o processador numa máquina da central (ou levamos um mini-PC); só o evento sai. 2 semanas de medição, relatório.
3. **10 câmeras + painel**: baseline de 30 dias, depois cada intervenção ganha antes/depois.
4. **Cidade**: todos os pontos que importam para mobilidade; painel público; integração com o app que já existe (Conecta Patos).

### 4. Precificação e cobrança — hipóteses, com a régua que já usamos
| Modelo | Quando | Como cobra | Risco |
|---|---|---|---|
| **Projeto fechado (diagnóstico)** | H1–H4, primeira vez | valor fixo por câmera-mês analisada + relatório; entrada pequena, resto na entrega | cliente compara com "não fazer nada" |
| **Assinatura por câmera** | depois do diagnóstico | R$ por câmera/mês (processamento local + painel + suporte); faixa a descobrir com o primeiro cliente | churn se o painel não virar decisão |
| **Êxito sobre o que melhorou** | só onde dá para medir dinheiro (funcionário retido, hora de ônibus economizada, multa evitada) | % sobre o ganho medido, **com baseline assinado antes**; sem baseline, cobra-se hora | mede-se mal → briga |
| **Consultoria por hora** | pedido fora do pacote | hora fechada | não escala |
| **Licença do motor para outra cidade/integrador** | H6 | valor por cidade/ano; código do detector é aberto (Frigate), o nosso é a memória e o método | copiam o método |

Regra que já vale: **preço tem camada** (execução direta · sistema interconectado · êxito sobre o aumento gerado). No começo quase tudo é camada 1.

### 5. Integrações (só as que já existem)
- **Entrada:** RTSP/ONVIF das câmeras (padrão desde ~2012); relatório da operadora (PDF → parser pronto); planilha de turno das empresas; enquete do Conecta Patos (exportação pelo fornecedor AppCidades).
- **Saída:** JSON de eventos; painel HTML estático (este); notificação no Conecta Patos (campanha/notícia); painel físico "olho adiante" (qualquer TV com navegador).
- **Não fazemos:** app novo, cadastro novo, moeda própria, nuvem para vídeo.

### 6. Custos (hipótese de piloto de 10 câmeras, 90 dias)
| Item | Escolha mínima | Custo estimado | Por que |
|---|---|---|---|
| Processador local | 1 mini-PC com CPU Intel (OpenVINO) ou 1 PC que a central já tem; 5–10 câmeras a 5 fps | R$ 0 a R$ 4.000 (1 vez) | a imagem não sai; sem GPU cara |
| Software de detecção | Frigate (open source, MIT) + modelo YOLO/OpenVINO | R$ 0 | maduro, documentado, classes prontas |
| Banco | SQLite na máquina local (eventos) + JSON exportado | R$ 0 | evento é pequeno; sem servidor |
| Painel | HTML estático (GitHub Pages ou servidor da prefeitura) | R$ 0 | já existe |
| VPS | **nenhuma** para vídeo. Opcional: 1 VPS pequena (R$ 40–80/mês) só para o painel público e o recebimento de eventos | R$ 0–80/mês | o dado que viaja é evento, não imagem |
| Licenças | nenhuma proprietária; OSM para mapa; SEJUSP/IBGE são abertos | R$ 0 | |
| Gente | 1 pessoa técnica meio período + 1 consultor | o custo real do produto | é onde o dinheiro vai |
| Instalação | 1 visita por câmera para ângulo/zona | horas | |

### 7. LGPD e segurança — o desenho que se defende
- **Base legal:** dado de câmera é pessoal; o evento agregado (sem rosto, placa, biometria, sem possibilidade de reidentificar) é anonimizado (LGPD art. 12). O tratamento que identifica acontece na máquina do controlador (prefeitura); nós recebemos só o anonimizado. Finalidade declarada: mobilidade e segurança viária (Lei 12.587/2012).
- **Instrumento:** acordo de cooperação técnica ou contrato com cláusula de finalidade, anonimização na origem, retenção mínima (frame descartado após o evento; clipe de prova de até 10 s só quando o evento é "conflito", com retenção declarada), auditoria (log de quem acessou), e relatório de impacto (RIPD) antes de ligar. *(Validação jurídica completa em `base-legal-cameras.md`: viável condicionado; ACT + RIPD + anonimização na origem; 10 itens de checklist e minuta de cláusula.)*
- **Segurança:** processador local sem porta aberta para fora (só saída de eventos por canal cifrado); sem armazenamento de vídeo; atualizações assinadas; acesso ao painel por conta; nada de reconhecimento facial nem OCR de placa no nosso módulo, mesmo que a central tenha.
- **O que nunca fazemos:** subir vídeo para nuvem; cruzar evento com identidade; guardar trajetória individual; usar a câmera para fiscalização punitiva sem lei.

### 8. Viabilidade — o que precisa ser verdade para isso existir
1. A prefeitura (ou o Consep/PM, quem for o dono) aceita rodar um processador na central e liberar 1 câmera. **Teste: pedido hoje, no evento.**
2. O detector conta bem no tipo de câmera que Patos tem (360°, altura, noite). **Teste: 1 hora de vídeo gravado.**
3. Alguém paga pela leitura, não pela câmera. **Teste: H1–H4 dizem sim a um diagnóstico com valor fixo.**
4. O antes/depois convence: uma intervenção medida (semáforo da Paracatu ou escalonamento de um turno) com número. **Teste: 30 dias.**
Se 1 ou 3 falharem, o produto vira consultoria com dado público (o que já temos) e câmera fica para depois.

### 9. O que ainda não sabemos (declarado)
Quem é o titular jurídico das imagens do Olho Vivo em Patos (prefeitura investe; quem opera?); número real de câmeras (240/300/700); se a central tem máquina livre; faixa de preço que o cliente aceita; onde outras cidades brasileiras já fizeram parceria assim e com que instrumento — pesquisa em andamento.

### 10. A forma de entrada que o Enio definiu (19/09 11:05): reunião com quem decide, feita junto, na hora
Não é proposta enviada por e-mail. É sentar com quem tem poder sobre o dado (prefeito, secretário de trânsito, comandante/PM, presidente do Consep) e **fazer junto, na frente dele**: ligar o detector numa gravação ou numa câmera que ele autorizar naquela hora, mostrar o evento saindo (sem rosto, sem placa), mostrar o painel, e explicar tudo com transparência total: o que roda, onde roda, o que sai, o que não sai, as regras (`REGRAS.md`), os prompts que a IA usa para explicar o evento, o código do parser e do painel (este repositório, aberto).
- **Antes da reunião:** 1 vídeo gravado já processado (prova de método), este repositório aberto na tela, o documento de LGPD/instrumento (`parcerias-cameras.md`) impresso em 2 páginas, e a lista do que pedimos (1 câmera, 30 dias, evento agregado).
- **Na reunião:** ele escolhe a câmera; processa-se ali; ele vê o evento; combina-se o instrumento (acordo de cooperação técnica é o que Porto Alegre usou entre EPTC e SSP-RS) e o prazo.
- **Depois:** relatório em 30 dias com antes/depois; ele decide se amplia.
Molde brasileiro mais próximo: Porto Alegre, termo de cooperação técnica EPTC↔SSP-RS (116 câmeras de trânsito + 365 de segurança compartilhadas); Vitória/ES (contagem de fluxo e origem-destino a partir do cerco eletrônico); COR-Rio (contagem por tipo/hora com acordo acadêmico LNCC/CEFET). Ver `parcerias-cameras-brasil.md`.

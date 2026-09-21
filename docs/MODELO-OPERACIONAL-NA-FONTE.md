# Modelo operacional e econômico — processamento na fonte

**Estado:** direção canônica pós-hackathon · 21/09/2026

## Tese

O Visão de Rota **não propõe uma nova infraestrutura de videomonitoramento**. Patos de Minas já possui câmeras, links, armazenamento e centrais para o uso original desses sistemas. Nossa camada existe para transformar janelas de vídeo já disponíveis em medidas auditáveis de mobilidade.

> **O dado bruto fica onde já está. Nós levamos o processamento até ele.**

O produto não precisa de streaming próprio, CCO próprio, nuvem própria de vídeo nem cópia permanente das imagens para funcionar.

## O que Patos já tem

A pesquisa do projeto e as fontes públicas registram:

- em 2026, o Olho Vivo chegou a **240 câmeras em 140 pontos**;
- existe operação de videomonitoramento para segurança pública;
- a Prefeitura vem experimentando semáforos inteligentes em pontos da cidade;
- na conversa com a equipe, o diretor de mobilidade descreveu a dificuldade central como falta de capacidade para **tratar/processar** os dados existentes, não simplesmente falta de captação.

Isso muda a pergunta econômica. Não é “quanto custa construir uma central?”. É:

> **quanto custa acrescentar capacidade de leitura, medição e prova ao ambiente que já existe?**

## Arquitetura preferida

### Modo A — processamento junto à fonte

VMS/NVR/DVR/arquivo existente → worker de visão na mesma rede → medidas agregadas → banco do Visão de Rota.

É o modo preferido. O vídeo não precisa atravessar a internet nem ser armazenado novamente.

### Modo B — processamento por janela

Quando a central permite buscar gravações históricas, o sistema solicita apenas a janela necessária — por exemplo, 07h00–08h00 das terças comparáveis — processa e descarta a cópia de trabalho após concluir.

### Modo C — leitura de stream existente

Se o equipamento só oferece RTSP/stream, podemos consumir o stream que **já existe**, sem criar uma nova transmissão e sem exigir análise em tempo real. O worker pode processar com atraso.

### Exceção — evidência visual retida

A regra é não duplicar pixels. Se um caso exigir guardar quadro/clip para auditoria, depuração ou obrigação formal, isso deve ser exceção governada: finalidade explícita, autorização, acesso restrito, prazo de retenção e descarte definidos.

## O que armazenamos por padrão

- identificador da fonte/ponto;
- intervalo de tempo processado;
- modelo e versão;
- parâmetros relevantes;
- contagens e medidas derivadas;
- estado de validação;
- timestamps;
- hash/identificador da origem quando tecnicamente possível;
- intervenção associada;
- trilha de revisão humana.

**Não armazenar por padrão:** duplicata do vídeo, rosto, placa, recortes de objetos ou arquivo bruto.

## A métrica técnica que decide o custo

Antes de estimar infraestrutura, medir o **fator de processamento**:

**RTF = tempo de processamento / duração do vídeo**

Exemplos:

- RTF 0,5 → 1 hora de vídeo termina em 30 min;
- RTF 1 → 1 hora termina em 1 hora;
- RTF 2 → 1 hora termina em 2 horas.

Para nosso caso, RTF maior que 1 pode ser perfeitamente aceitável. Se o relatório é diário, semanal ou usado para antes/depois, não há obrigação de acompanhar o relógio da câmera.

Também medir:

- FPS efetivamente analisado;
- resolução/codec;
- CPU/GPU/RAM;
- número de fontes concorrentes;
- tempo para abrir/buscar o trecho no VMS;
- erro por classe e condição.

## Primeiro trabalho com a Prefeitura: inventário, não compra

Antes de sugerir hardware, responder:

1. Qual VMS/NVR/DVR está em cada central?
2. Quais câmeras podem fornecer playback, arquivo ou RTSP?
3. Qual resolução, FPS e codec?
4. Quanto tempo cada grupo de câmeras retém vídeo?
5. Há exportação/API/SDK documentada?
6. Em qual rede o processamento pode rodar?
7. Existe CPU/GPU ociosa que possa ser usada sem afetar a operação?
8. Quais horários/pontos têm maior valor para mobilidade?
9. Quem autoriza acesso e quem responde pelo tratamento?
10. Quais logs, credenciais, segregação e auditoria são exigidos?

Câmeras com **retenção curta** podem entrar primeiro: não para copiar tudo, mas para garantir que as janelas relevantes sejam processadas antes da sobrescrita.

## Barreiras reais a transpor

| barreira | pergunta prática |
|---|---|
| acesso | conseguimos ler gravação/stream sem interferir no sistema atual? |
| compatibilidade | existe RTSP, ONVIF, SDK, API ou exportação utilizável? |
| retenção | por quanto tempo a janela permanece disponível na fonte? |
| capacidade | quanto tempo nosso pipeline leva para processar 1h daquele vídeo? |
| segurança | como autenticar worker, fonte e operador sem abrir a rede de câmeras? |
| LGPD | qual finalidade, papel dos agentes, minimização, retenção e base jurídica? |
| governança | quem pode solicitar uma análise, ver resultados e alterar parâmetros? |
| qualidade | qual erro do modelo naquele ângulo/horário/classe? |
| prova | como reproduzir a medida sem guardar indefinidamente o vídeo? |
| operação | o que acontece se a fonte estiver offline ou a janela já tiver sido sobrescrita? |

Essas barreiras são parte do produto. O primeiro piloto deve medi-las.

## O que compõe custo de verdade

### Custo de implantação

- levantamento do ambiente existente;
- integração com o VMS/NVR/DVR;
- configuração de ponto/ROI/linha;
- benchmark de processamento;
- ground truth e calibração;
- hardening, credenciais e logs;
- definição de governança e retenção.

### Custo recorrente

- capacidade computacional **se** a infraestrutura existente não bastar;
- licença do backend de visão, se aplicável;
- processamento das janelas escolhidas;
- monitoramento do worker;
- suporte;
- revalidação quando câmera/modelo/configuração mudar;
- análise humana e relatórios quando contratados.

### Custos que NÃO entram como premissa do produto

- comprar câmera nova;
- criar CCO;
- duplicar armazenamento de vídeo;
- manter transmissão paralela;
- operação 24×7 de segurança pública;
- substituir o sistema que já exibe as câmeras.

Podem existir casos em que algum equipamento adicional seja necessário, mas isso deve surgir do inventário técnico — nunca ser presumido na arquitetura.

## Modelo econômico atual

Ainda não existe base suficiente para uma tabela definitiva por câmera/mês.

A unidade econômica interna deve nascer do que for medido no ambiente:

**volume de vídeo analisado × custo de processamento + implantação/calibração + governança/segurança + suporte + análise humana + licença**

As ofertas mais coerentes hoje são:

### 1. Diagnóstico técnico

Inventário de uma fonte/central + benchmark de uma janela real + relatório de compatibilidade, desempenho, privacidade e próximos passos.

### 2. Piloto de evidência

Poucos pontos escolhidos por valor. Baseline, processamento periódico, validação humana e uma pergunta concreta de mobilidade.

### 3. Operação

Só depois do piloto: contrato baseado em volume/janelas/SLA e serviços realmente consumidos. “Preço por câmera” pode existir comercialmente, mas deve ser derivado da economia medida, não escolhido primeiro.

## Critério de sucesso do próximo ciclo

Não é “ter mais telas”.

É conseguir responder, com um ponto real de Patos:

> “Este vídeo já existia neste sistema. Sem criar outro armazenamento e sem criar outro streaming, processamos X minutos em Y minutos, com Z recursos, erro medido E, e produzimos estas medidas auditáveis.”

Essa frase é a base técnica e econômica do produto.

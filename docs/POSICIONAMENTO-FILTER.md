# Posicionamento canônico — FILTER

**Atualizado em:** 21/09/2026

# FILTER
## Da imagem à evidência.

### Definição curta

**Uma camada auditável de observabilidade da mobilidade que transforma vídeo já existente em medições e registra se uma intervenção na rua realmente melhorou alguma coisa.**

### Em linguagem de prefeitura

A cidade já possui câmeras, transmissão, visualização e armazenamento para as finalidades atuais. O FILTER adiciona uma camada de processamento próxima da fonte para extrair medidas de mobilidade, registrar de onde cada número veio e comparar o antes e o depois de mudanças na via.

### O que entra

- vídeo/gravação já existente;
- quando necessário, stream já existente;
- parâmetros da fonte;
- contexto de uma pergunta concreta de mobilidade.

### O que sai

- contagem e classificação agregada;
- métricas derivadas que tenham sido validadas para aquele caso;
- proveniência;
- modelo/versão;
- estado de validação;
- comparação antes/depois;
- evidência para revisão humana.

### O que não é

- sistema de reconhecimento facial;
- OCR de placa;
- plataforma de segurança pública;
- CCO novo;
- storage paralelo de vídeo;
- streaming paralelo;
- decisão automática sobre a via;
- promessa de causalidade automática;
- produto preso a YOLO.

### Frases públicas

**Slogan institucional:**
> FILTER — Da imagem à evidência.

**Linha de produto:**
> O vídeo já existe. O FILTER transforma o que a cidade já vê em medidas auditáveis.

**Pitch de valor:**
> Veja o que mudou. Meça se funcionou.

**Princípio de arquitetura:**
> O dado fica na fonte. O processamento vai até ele.

### Critério de prova do próximo ciclo

> Este vídeo já existia nesta infraestrutura. Sem criar outro armazenamento e sem criar outro streaming, processamos X minutos em Y minutos, usando Z recursos, com erro medido E, e produzimos estas medidas auditáveis.

Até preencher X, Y, Z e E com ambiente real, custos e escala continuam hipóteses de engenharia.

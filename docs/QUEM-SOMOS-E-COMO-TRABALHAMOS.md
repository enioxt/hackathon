# Quem somos, como trabalhamos e o que oferecemos

**Status:** direção de posicionamento · atualizado em 21/09/2026

O FILTER nasceu em um hackathon de mobilidade, mas o trabalho executado mostra uma capacidade mais ampla do que “um sistema para uma prefeitura”.

## 1. O que a equipe demonstrou na prática

Durante o projeto, a equipe precisou:

- investigar um problema antes de escolher tecnologia;
- conversar com gestores e transformar fala em requisito;
- localizar e verificar fontes públicas;
- tratar dados com proveniência;
- construir visão computacional;
- criar contratos de dados e recusar entradas indevidas;
- comparar regra determinística com modelos de IA;
- medir acerto, latência, custo e falha;
- separar dado real, simulação e hipótese;
- construir interface e demonstração;
- documentar limites jurídicos, de privacidade e licenciamento;
- revisar publicamente afirmações quando a evidência era menor que a narrativa.

Isso define melhor a capacidade da equipe do que a lista de frameworks.

## 2. Nossa tese de trabalho

> **Entender o sistema que já existe, encontrar a menor intervenção técnica útil, medir antes de ampliar e deixar evidência de como a conclusão foi produzida.**

A equipe não parte da pergunta “qual IA vamos usar?”.

Parte de:
1. qual decisão está difícil;
2. que dados já existem;
3. onde esses dados podem ou não circular;
4. o que pode ser resolvido com código;
5. onde IA realmente adiciona capacidade;
6. como saberemos que funcionou.

## 3. Método

### 1. Investigar

Problema, atores, decisão, restrições, risco e contexto.

**Saída:** pergunta operacional clara.

### 2. Inventariar

Dados, sistemas, hardware, interfaces, permissões, contratos, retenção e dependências.

**Saída:** mapa do ambiente real.

### 3. Medir baseline

Antes de construir, medir o estado atual e a qualidade do dado.

**Saída:** baseline e lacunas.

### 4. Escolher a menor inteligência necessária

Ordem preferida:
- regra/cálculo;
- modelo especializado;
- classificador local;
- LLM pequeno estruturado;
- LLM grande;
- humano onde a responsabilidade exige.

**Saída:** arquitetura proporcional ao problema.

### 5. Prototipar com prova

Implementar a menor integração capaz de responder à pergunta.

**Saída:** protótipo + telemetria + evidência.

### 6. Validar

Comparar com ground truth, revisão humana ou fonte independente.

**Saída:** erro conhecido, não confiança presumida.

### 7. Governar

Privacidade, segurança, licença, logs, versionamento, retenção e HITL.

**Saída:** limites explícitos para uso real.

### 8. Medir depois

Se houve intervenção, comparar antes/depois sem transformar correlação em causalidade automaticamente.

**Saída:** evidência para decisão humana.

### 9. Escalar ou parar

Só ampliar quando qualidade, custo, risco e valor fecharem a conta.

## 4. O que podemos oferecer

A formulação abaixo descreve capacidades demonstradas; não é promessa de produto acabado.

### Diagnóstico técnico e de dados

Para organizações que já possuem sistemas, câmeras, planilhas, bancos, APIs ou processos, mas não conseguem extrair decisão confiável deles.

Entrega típica:
- inventário;
- mapa de fluxos de dados;
- riscos;
- lacunas;
- oportunidades de integração;
- pergunta prioritária;
- desenho do menor piloto.

### Piloto de evidência

Uma pergunta, uma fonte ou poucas fontes e um critério de sucesso escrito antes.

Entrega típica:
- integração mínima;
- benchmark;
- validação;
- medidas;
- painel/relatório;
- limites e próximos passos.

### Camada de observabilidade/auditoria

Transformar operações existentes em eventos, métricas, proveniência e histórico sem necessariamente substituir os sistemas de origem.

FILTER é o primeiro caso concreto dessa capacidade.

### Avaliação e seleção de IA

Comparar regra, modelos especializados, modelos locais e LLMs no mesmo problema.

Entrega típica:
- conjunto de testes;
- critérios de aceite;
- benchmark de qualidade/latência/custo;
- recomendação arquitetural;
- fallback e HITL.

O experimento Jev é uma prova deste método: não adotamos a tecnologia porque era nova; medimos onde ela ganhou e onde perdeu.

## 5. FILTER como case

### Pergunta inicial

Como transformar vídeo que já existe em medida útil de mobilidade sem criar outra infraestrutura de vigilância?

### O que foi construído

- leitor de vídeo;
- detecção e tracking;
- contrato de entrada;
- recusa de dados pessoais conhecidos;
- painel;
- antes/depois;
- proveniência;
- decisão tipada;
- telemetria;
- testes;
- documentação de privacidade, licença e operação.

### O que aprendemos

- tempo real não é requisito universal;
- duplicar vídeo não deve ser padrão;
- MEDIDO não significa VALIDADO;
- regra determinística vence IA em alguns problemas;
- texto livre pode justificar um modelo semântico;
- provider deve ser substituível;
- preço deve nascer do ambiente e do benchmark, não de tabela inventada;
- narrativa pública precisa ser corrigida quando a prova muda.

## 6. Diferencial da equipe

Não é “usar IA”.

É conseguir operar o ciclo:

> **problema → evidência → arquitetura → teste → integração → validação → governança → decisão**

e manter visível:
- o que é fato;
- o que é inferência;
- o que é simulação;
- o que ainda não sabemos.

## 7. Para quem isso pode servir

O método não depende de prefeitura.

Pode fazer sentido onde existam:
- dados já coletados mas pouco usados;
- sistemas legados que não devem ser substituídos;
- processo humano repetitivo com linguagem livre;
- necessidade de auditoria/proveniência;
- necessidade de testar IA sem entregar a ela toda a decisão;
- custo de erro maior que o custo de revisão humana.

Exemplos de domínios a investigar, não promessas prontas:
- mobilidade e cidades;
- logística;
- operações industriais;
- atendimento e triagem;
- segurança e risco;
- auditoria;
- processos administrativos;
- integração de sistemas e dados.

## 8. Como nos apresentar

Mensagem curta:

> **Investigamos problemas reais, medimos o que já existe e construímos a menor camada de software e IA necessária para transformar dados em evidência útil.**

Mensagem técnica:

> **Projetamos sistemas auditáveis sobre infraestrutura existente, escolhendo entre código, modelos especializados e LLMs conforme benchmark, privacidade, custo e risco.**

Mensagem comercial:

> **Traga um problema real e os sistemas que você já possui. Primeiro descobrimos o que precisa ser construído — e o que não precisa.**

## 9. O que não vender como verdade ainda

- acurácia geral do leitor de vídeo;
- integração pronta com VMS municipal;
- compliance LGPD automático;
- causalidade automática no antes/depois;
- preço por câmera;
- escala para qualquer cidade;
- superioridade geral do Jev ou de qualquer modelo;
- operação 24×7 comprovada.

Esses pontos viram oferta somente quando houver evidência correspondente.

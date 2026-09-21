# CLAUDE.md — FILTER

Este arquivo é o gate de contexto para qualquer sessão de Claude Code/Codex/IA neste repositório.

## Identidade canônica

- **Nome público:** FILTER
- **Slogan:** **Da imagem à evidência.**
- **Definição:** uma camada auditável de observabilidade da mobilidade que transforma vídeo já existente em medições e registra se uma intervenção na rua realmente melhorou alguma coisa.
- **Origem histórica:** o projeto nasceu no hackathon com o nome FILTER e chegou a usar FILTER. Esses nomes podem aparecer em arquivos históricos, mas **não devem voltar para superfícies públicas novas**.

## Verdade operacional

O produto **não é YOLO**, não é um CCO, não é uma nova nuvem de câmeras e não é uma plataforma de vigilância.

A cadeia canônica é:

**fonte → processamento → medição → modelo/versão → validação → intervenção humana → comparação → evidência → decisão humana**

O backend de visão é substituível.

## Princípio de localidade dos dados

**O dado bruto fica onde já está. O processamento vai até ele.**

Por padrão:
- não criar outro streaming;
- não duplicar o acervo de vídeo;
- não presumir cloud;
- não presumir câmera nova;
- não presumir hardware novo;
- não exigir tempo real;
- processar no VMS/NVR/DVR, na mesma rede ou o mais perto possível da fonte;
- persistir medidas, proveniência, modelo, parâmetros e validação;
- retenção de frame/clip é exceção governada, não regra.

A métrica técnica central para dimensionamento é **RTF = tempo de processamento / duração do vídeo**.

## Evidência

Nunca misturar estas perguntas:

1. **origem** — real, pública ou sintética;
2. **transformação** — observado, derivado por modelo ou simulado;
3. **validação** — não validado, amostra manual ou validado.

MEDIDO não significa VALIDADO.

Toda afirmação pública deve apontar para fonte, arquivo, cálculo ou estado de validação.

## Privacidade e segurança

Não usar a frase “não capturamos imagem” se o frame entra no processo.

Formulação padrão:
> Os quadros são processados temporariamente para extrair medidas; o fluxo padrão não faz OCR de placa nem reconhecimento facial e não persiste frames.

Minimização não elimina tratamento de dados. LGPD, finalidade, papéis, acesso, logs, credenciais, retenção e governança precisam ser definidos no arranjo real.

## Custos e modelo econômico

Os preços produzidos durante o hackathon são **pesquisa histórica/hipóteses**, não tabela comercial.

Não assumir:
- R$ por câmera/mês;
- Jetson;
- “central mínima”;
- licença por cidade;
- custo de storage;
- operação 24×7.

Primeiro medir o ambiente real:
- interface do VMS/NVR;
- retenção;
- resolução/FPS/codec;
- RTF;
- CPU/GPU/RAM;
- concorrência;
- integração;
- ground truth;
- segurança/governança;
- suporte.

Depois derivar preço.

## Próxima fronteira

Antes de novas grandes telas, priorizar:
1. inventário de uma fonte real de Patos;
2. processamento de uma janela sem storage/streaming paralelo;
3. benchmark de RTF e recursos;
4. ampliação do ground truth;
5. backend/licença comercial;
6. uma intervenção real com baseline e depois;
7. prova e relatório reproduzível.

## Arquivos canônicos

Leia nesta ordem:
1. llms.txt
2. docs/POSICIONAMENTO-FILTER.md
3. docs/ARQUITETURA-OBSERVABILIDADE-AUDITAVEL.md
4. docs/MODELO-OPERACIONAL-NA-FONTE.md
5. docs/LICENCIAMENTO-MOTOR-VISAO.md
6. docs/PROVAS.md

Arquivos de hackathon, pesquisa, pitch antigo e construcao/ são evidência histórica. Não copiar números, preços ou afirmações deles para a interface atual sem reconferir.

## Gate antes de commit

Antes de publicar ou commitar mudança pública, pergunte:
- Isto chama o produto de FILTER?
- A frase “Da imagem à evidência.” está preservada quando o slogan for necessário?
- Diferenciei fonte real, resultado de modelo, simulação e validação humana?
- Estou criando infraestrutura que a cidade já possui sem evidência de necessidade?
- Estou movendo/duplicando vídeo sem necessidade?
- Estou prometendo integração, precisão, causalidade, LGPD ou preço sem prova?
- Há teste ou forma objetiva de conferir a mudança?

Se qualquer resposta for problemática, corrija antes do push.

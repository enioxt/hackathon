# Arquitetura canônica — observabilidade auditável da mobilidade

**Estado:** direção pós-hackathon · 21/09/2026

> Uma camada auditável de observabilidade da mobilidade que transforma vídeo já existente em medições e registra se uma intervenção na rua realmente melhorou alguma coisa.

## 1. O produto

O detector não é o produto. YOLO, RT-DETR, YOLOX ou outro modelo são backends substituíveis do sensor. O ativo do Visão de Rota é a cadeia de evidência:

**fonte → processamento → medição → modelo/versão → validação → intervenção humana → comparação → evidência → decisão humana**

O sistema não deve comandar semáforo, multar, identificar pessoa/veículo ou afirmar causalidade automaticamente. Ele observa, mede, compara e mostra limites.

## 2. Taxonomia de evidência

Não usar um selo único para responder perguntas diferentes. Cada número deve carregar três dimensões:

| dimensão | exemplos | pergunta respondida |
|---|---|---|
| **origem** | fonte real · dado público · sintético | de onde veio? |
| **transformação** | observado · derivado por modelo · simulado | o que fizemos com a fonte? |
| **validação** | não validado · amostra manual · validado | quanto já conferimos contra referência humana? |

`MEDIDO` significa apenas que o número veio de uma fonte real/observação real. **Não significa acurácia validada.**

A API deve persistir `validacao` e `modelo`. O leitor automático nasce como `validacao: nao_validado`.

## 3. Privacidade por desenho

Frase proibida: **“não capturamos imagem”** quando um frame efetivamente entra no processo.

Frase defensável: **“os quadros são processados temporariamente para extrair medidas; o fluxo padrão não faz OCR de placa nem reconhecimento facial e não persiste frames.”**

Pipeline desejado: câmera/vídeo → memória volátil → detector/tracker → agregação → evento numérico → descarte do frame.

Gates: finalidade e base legal definidas; retenção mínima; logs sem pixels/PII; arquivos temporários testados; telemetria sem imagem; acesso e trilha de auditoria.

## 4. Validação do contador

A primeira amostra em Patos é direção, não estatística final. Antes de vender precisão:

1. definir protocolo fixo de contagem humana;
2. usar múltiplos pontos, horários, luminosidade e ângulos;
3. comparar por classe e sentido;
4. publicar tamanho da amostra e erro, não só percentual;
5. manter os casos em que o sistema errou;
6. repetir quando modelo, resolução, tracker ou calibração mudarem.

Métricas mínimas: total manual × automático, erro absoluto, erro percentual por classe, perdas, duplas contagens e cobertura da amostra.

## 5. Antes/depois sem confundir correlação com causa

O núcleo comercial deve registrar baseline, data da intervenção, janela posterior, dias/horários comparáveis, clima/eventos/obras relevantes e, quando possível, um ponto de controle sem intervenção.

Regra de linguagem:

- pode dizer: **“a espera medida caiu 18% após a intervenção nesta janela”**;
- não dizer automaticamente: **“a intervenção reduziu a espera em 18%”**;
- para aproximar causalidade, usar desenho com controle e, quando adequado, diferença-em-diferenças ou método equivalente revisado.

## 6. Modelo/backend de visão

A cadeia de evidência não pode depender semanticamente de uma marca de detector. O contrato do motor deve exigir detecções/trilhas normalizadas e registrar backend + versão.

Antes de produção paga, escolher explicitamente uma rota: Ultralytics Enterprise, produto integralmente compatível com AGPL, ou backend permissivo validado. Ver `LICENCIAMENTO-MOTOR-VISAO.md`.

## 7. Gates para sair de protótipo

| gate | pronto quando |
|---|---|
| G0 · licença | backend e pesos têm direito de uso comercial documentado |
| G1 · qualidade | amostra suficiente e erro publicado por classe/condição |
| G2 · privacidade | processamento/retenção testados; instrumento jurídico definido |
| G3 · integração | pelo menos uma fonte municipal real integrada e monitorada |
| G4 · intervenção | um antes/depois real com baseline e limitações documentadas |
| G5 · segurança | autenticação, autorização, identidade de fonte, anti-replay e auditoria |
| G6 · economia | custo por hora de vídeo + suporte + licença medidos; preço fecha a conta |

## 8. Próxima sprint

**Nenhuma grande tela nova.** Prioridade:

1. ampliar ground truth de Patos;
2. separar origem de validação em toda a interface;
3. escolher e benchmarkar um backend permissivo contra o backend atual;
4. fechar o gate de licença comercial;
5. integrar uma fonte real, não mais um mock;
6. registrar uma intervenção real e seu baseline;
7. publicar relatório de erro, custo e proveniência.

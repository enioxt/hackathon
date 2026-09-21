# Licenciamento do motor de visão — opções para produção e monetização

**Revisado em:** 21/09/2026 · **escopo:** decisão técnica/comercial; não substitui parecer jurídico.

## Estado atual

O leitor em `motor/leitor-video/leitor.py` importa o pacote **Ultralytics** e tenta carregar `yolo11n.pt` e, como fallback, `yolov8n.pt`.

A posição publicada pela própria Ultralytics em 21/09/2026 é:

- código e modelos Ultralytics YOLO são oferecidos sob **AGPL-3.0**;
- a AGPL permite uso comercial, mas impõe obrigações de código-fonte para obras cobertas e inclui regra específica para usuários que interagem remotamente pela rede;
- a **Enterprise License** é a rota oferecida pela Ultralytics para incorporar código/modelos em produtos e serviços comerciais sem as obrigações de abertura da AGPL.

Fontes oficiais:

- https://www.ultralytics.com/license
- https://github.com/ultralytics/ultralytics
- https://www.gnu.org/licenses/agpl-3.0.html
- https://www.gnu.org/licenses/gpl-faq.html

## Isso impede monetizar?

**Não.** AGPL não proíbe cobrar. O risco é querer um produto proprietário/fechado enquanto se usa componente/modelo cuja licença exige disponibilização do código correspondente em situações cobertas.

Modelos de monetização compatíveis com uma estratégia aberta incluem implantação, calibração, suporte, operação gerenciada, SLA, relatórios, integrações, treinamento e consultoria. Código aberto não significa serviço gratuito.

## Rotas possíveis

| rota | propriedade do código | custo/licença | risco principal | uso sugerido |
|---|---|---|---|---|
| **A · Ultralytics + AGPL** | núcleo/obra coberta aberta conforme AGPL | sem Enterprise | obrigações de fonte/compatibilidade | produto open-source + serviços |
| **B · Ultralytics Enterprise** | produto proprietário conforme contrato | comercial | preço, escopo e lock-in | quando Ultralytics vencer tecnicamente |
| **C · backend permissivo** | maior liberdade | normalmente sem royalty de software | integração e validação | rota para reduzir lock-in |
| **D · modelo próprio em stack permissiva** | maior controle | dataset/treino/manutenção | MLOps e qualidade | fase posterior |

## Backends permissivos a benchmarkar

Repositórios sob **Apache-2.0** que merecem teste no mesmo conjunto de vídeos:

- **YOLOX** — https://github.com/Megvii-BaseDetection/YOLOX
- **RT-DETR / RT-DETRv2** — https://github.com/lyuwenyu/RT-DETR
- **Detectron2** — https://github.com/facebookresearch/detectron2

A licença do repositório não basta: **pesos pré-treinados, datasets, dependências e modelos derivados devem ser verificados separadamente** antes da produção.

## Recomendação de engenharia

1. manter Ultralytics no protótipo enquanto o objetivo é validar o problema;
2. não fechar contrato pago de produção sem resolver G0 (licença);
3. criar uma fronteira de backend: detector/tracker entram, detecções normalizadas saem;
4. benchmarkar pelo menos um backend Apache-2.0 com o mesmo vídeo e protocolo manual;
5. comparar precisão, CPU/GPU, latência, exportação ONNX/TensorRT/OpenVINO e manutenção;
6. se Ultralytics continuar superior, pedir proposta Enterprise e negociar por escrito uso on-premise, instalações, modelos/pesos, fine-tuning, redistribuição, duração, suporte e sobrevivência das versões já licenciadas;
7. se alternativa permissiva atingir o critério de aceite, preferir independência de fornecedor.

## O que não fazer

- não assumir que “está no GitHub” significa que pode entrar em qualquer produto fechado;
- não assumir que colocar o YOLO em outro processo/microserviço elimina obrigações de licença;
- não publicar benchmark do modelo como se fosse acurácia nas câmeras de Patos;
- não amarrar o produto comercial à palavra YOLO: o valor é a cadeia de evidência.

## Unidade econômica

Para vídeo gravado, preço por câmera isoladamente é uma unidade fraca. Medir custo por:

**horas de vídeo × resolução/FPS × hardware + armazenamento numérico + suporte + validação/calibração + licença do backend + análise humana**.

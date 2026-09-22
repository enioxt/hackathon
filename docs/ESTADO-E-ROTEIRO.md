# Estado e roteiro — FILTER

> **Documento vivo.** Substitui `docs/CHECKLIST-PITCH.md`, que era o roteiro até a banca do
> hackathon e virou histórico em 21/09/2026. Última medição: **21/09/2026**.
>
> Legenda: 🟢 pronto **e conferido, com prova** · 🟡 existe, com ressalva declarada ·
> 🔴 não existe ou está parado.
>
> Regra desta lista: **item não testado não é verde.** Se a linha não disser como conferir,
> ela não deveria estar em verde.

## 1. A fase mudou

O hackathon acabou em 20/09/2026. A fase atual é **levar a tecnologia a prefeituras e a
outras pessoas em reuniões**. Isso muda o que importa:

| Antes (até 20/09) | Agora |
|---|---|
| Impressionar uma banca em 3 minutos | Sustentar uma conversa técnica de 40 minutos |
| Ter tela para tudo | Ter prova para o que a tela afirma |
| Demonstração no ar, aberta a todos | Demonstração no ar, **e o resto fechado** |
| Número que convence | Número que o técnico da prefeitura consegue refazer |

A pergunta que decide uma reunião não é “o sistema é bonito?”. É **“de onde veio esse
número e eu consigo refazer a conta?”**. Por isso toda tela pública deve levar à fonte em
um clique, e por isso `CLAUDE.md` é o gate.

## 2. O que existe e está provado

| | O quê | Como conferir |
|---|---|---|
| 🟢 | Leitor de vídeo que conta por tipo, sem rosto e sem placa | `motor/leitor-video/`, testes com `python3 -m pytest -q` |
| 🟢 | 8 vídeos gravados em Patos (20/09/2026), lidos pela máquina: **118 objetos em 372 s** | O painel recalcula na abertura, a partir de `demo/camadas/*.trilhas.json` |
| 🟢 | 22.708 sinistros · 6.818 com moto (30,0%) — RENAEST 2018–ago/2026 | `dados/acidentes-renaest-patos.json`; a soma ano a ano fecha em 22.708 |
| 🟢 | 1.100 ocorrências com endereço · 132 graves ou fatais · 18 fatais — SEJUSP-MG | `dados/acidentes-patos-sejusp-mg-2025-2026.json`, recontado registro a registro |
| 🟢 | 5 áreas de 1 km reúnem 39,5% das ocorrências (435 de 1.100) | Recalculado na abertura da página, a partir do mesmo arquivo |
| 🟢 | Porta de entrada que recusa dado pessoal | `painel/` + `motor/entrada-de-dados/`, `bun test` |
| 🟢 | Origem marcada em todo número, com link para o arquivo | Visão geral: 6 links “conferir a fonte” |
| 🟢 | Real e sintético em zonas separadas na tela | Visão geral: faixa **Medido** (verde) e faixa **Demonstração** (vermelha) |
| 🟢 | Ficha técnica pública: stack, modelos de IA e consumo | Aba “Ficha técnica” no painel |
| 🟢 | RTF medido: **8,3×**, 3,83 quadros/s | [`DESEMPENHO-E-DUAS-PISTAS.md`](DESEMPENHO-E-DUAS-PISTAS.md) |

## 3. O que existe com ressalva

| | O quê | A ressalva, dita por inteiro |
|---|---|---|
| 🟡 | Conferência pessoa × máquina | **1 vídeo, 6 objetos de 118 (~5%).** 4 carros e 1 moto bateram; 1 ônibus a máquina não contou. É amostra, não medição de erro. |
| 🟡 | RTF de 8,3× | Varia de 3,0× a 19,9× entre vídeos, sem condições controladas. **Não serve para dimensionar máquina, prazo ou preço.** |
| 🟡 | Mapa e parede de câmeras | Misturam camada real e camada inventada na mesma imagem. Estão marcados com tarja **MISTO** dizendo qual é qual, mas não são separáveis por natureza. |
| 🟡 | Semáforos, transporte, estacionamento, ocorrências | Existe contrato de dados e existe tela. **Não existe integração validada** com nenhum sistema real. |
| 🟡 | Preços do hackathon | São pesquisa histórica, não tabela comercial. Ver `CLAUDE.md`, seção de custos. |

## 4. O que não existe

| | O quê | O que destrava |
|---|---|---|
| 🔴 | Acesso a qualquer câmera da cidade | Uma reunião com quem administra o Olho Vivo + instrumento jurídico (`docs/base-legal-cameras.md`) |
| 🔴 | Erro de contagem medido por tipo de veículo | Ampliar a conferência manual; hoje cobre ~5% |
| 🔴 | Curva “quadros analisados × RTF × erro” | Python instalado na máquina de trabalho; o material já existe |
| 🔴 | Pista rápida de processamento | Decisão de arquitetura depois da curva acima |
| 🔴 | Uma intervenção real acompanhada com antes e depois | Depende do acesso à câmera |
| 🔴 | Backend de visão com licença resolvida para uso comercial | `docs/LICENCIAMENTO-MOTOR-VISAO.md` |
| 🔴 | Operação fora de um notebook | Depende do dimensionamento, que depende da curva |

## 5. Roteiro — o que vem, em ordem

Cada fase só começa quando a anterior tem prova. Nenhuma tela nova antes da fase 2.

### Fase 1 — fechar a conta do próprio motor *(não depende de ninguém de fora)*
1. Instalar Python na máquina de trabalho.
2. Rodar a curva **quadros analisados × RTF × erro** nos 8 vídeos.
3. Publicar a curva e definir o ritmo mínimo de cada métrica.
4. Ampliar a conferência manual: de 6 objetos para pelo menos 1 vídeo inteiro, contado por
   duas pessoas, com o desacordo registrado.
5. Publicar o **erro por tipo de veículo** — o número que hoje não existe.

### Fase 2 — a primeira fonte real *(depende de uma reunião)*
6. Inventário de uma central: qual VMS/NVR, retenção, resolução, FPS, codec, como se
   acessa, onde cabe um processo, quem autoriza (roteiro em `docs/MODELO-OPERACIONAL-NA-FONTE.md`).
7. Processar **uma janela** sem copiar acervo e sem criar transmissão paralela.
8. Medir RTF e recursos naquele ambiente, não no notebook.
9. Relatório reproduzível dessa janela.

### Fase 3 — a primeira evidência de decisão
10. Escolher um cruzamento e uma pergunta concreta da Secretaria.
11. Medir a linha de base por algumas semanas.
12. Registrar a intervenção, com autor e data.
13. Medir depois, com um ponto de controle sem intervenção.
14. Publicar o antes e depois como **observação**, não como causa, até haver desenho que
    sustente causa.

### Fase 4 — virar produto
15. Resolver licença do backend de visão.
16. Derivar preço da economia medida, não escolher preço antes.
17. Identidade do operador, trilha de auditoria, retenção e governança no arranjo real.

## 6. Como abrir uma reunião

A abertura que funciona **não é** “nos dê acesso às câmeras”. É:

> “Não queremos levar as imagens de vocês para outro lugar, nem criar outro sistema de
> videomonitoramento. Queremos entender a estrutura que já existe e saber se cabe uma
> camada de processamento junto dela.”

O que se pede na primeira conversa, em ordem de facilidade:
1. **uma hora de vídeo já gravado** de uma câmera (é o pedido nº 1, e não exige integração);
2. o inventário da central (o que existe, não o que pode ser instalado);
3. só depois, acesso continuado.

O que **não** se promete numa reunião: acurácia, integração pronta, causalidade,
conformidade de LGPD resolvida ou preço fechado. O gate de `CLAUDE.md` vale aqui também.

## 7. Onde este documento se encaixa

Ordem de leitura para quem chega: `CLAUDE.md` → `llms.txt` →
`docs/POSICIONAMENTO-FILTER.md` → **este arquivo** → os documentos de arquitetura.

Histórico, não estado atual: `PARA-A-IA.md`, `docs/SESSAO-INDICE.md`,
`docs/CHECKLIST-PITCH.md`, `construcao/`.

# Semáforo Inteligente — MVP de demonstração

> Simulação visual de um cruzamento de quatro vias com semáforo assistido por IA.
> **Nada aqui é medição de Patos de Minas.** Todo número na tela é gerado pelo próprio código.

Marca no rodapé da página: **Alavanc Tech** · "Mobilidade em Evidência".
O nome do time no restante deste repositório é **Visão de Rota**. A unificação (ou não)
das duas marcas é decisão do grupo — ver `REGRAS.md`, regra 10.

## O que é

Uma página única, sem dependência externa, que mostra o ciclo que o time defende:

```
OBSERVA → REGISTRA → COMPREENDE → SINALIZA → HUMANO DECIDE → MEDE → APRENDE
```

Três cenários no botão (trânsito normal, congestionamento, emergência com corredor para
ambulância) e um painel **"Memória da via"** com comparação antes × depois, timeline dos
eventos e o selo `DADOS SIMULADOS • MVP PARA DEMONSTRAÇÃO`.

## Como abrir

Abra `index.html` no navegador. Não precisa de servidor, build nem internet.

Ordem dos scripts importa: `memoria-v5.js` lê as variáveis globais `vias` e `dados`
declaradas em `script.js` e envolve as funções `cenarioNormal`, `cenarioCongestionamento`
e `cenarioEmergencia` para registrar cada cenário na memória da via. Carregar fora de
ordem quebra o painel V5.

| Arquivo | O que é |
|---|---|
| `index.html` | estrutura da página: cruzamento, 4 semáforos, 4 câmeras, painel lateral, modal da memória da via |
| `style.css` | folha de estilo (37 KB) |
| `script.js` | simulação do trânsito: ciclo dos semáforos, movimento dos veículos, corredor de emergência |
| `memoria-v5.js` | motor da memória da via: métricas, classificação, antes × depois, timeline |

## Os números da tela, e de onde vêm

Regra 2 do time: todo número com origem. Aqui a origem de **todos** é a mesma — o código.
Declarado para não haver dúvida na banca:

| Número na tela | Valor | Origem |
|---|---|---|
| Linha de base: fluxo | 24 veículos | constante em `memoria-v5.js`, escolhida para a demonstração — **não medida** |
| Linha de base: espera | 48 s | idem — **não medida** |
| Linha de base: fila | 16 veículos | idem — **não medida** |
| Contador de intervenção | começa em #23 | idem — **não medido** |
| Veículos por via (5/4/3/6) | variam | gerados pela simulação em `script.js` |
| Quase-acidentes | contagem | eventos da própria simulação, não observação de rua |
| Confiança exibida | `BAIXA` | fixa, justamente por ser simulação |

A composição do fluxo mostrada (carro, moto, ônibus, carga) segue a regra 5: a câmera
**conta e classifica**. A página não exibe rosto, placa, CPF nem trajeto individual.

## O que falta para deixar de ser simulação

A linha de base precisa sair de medição real. O item já está na lista de pendências do
time (`PARA-A-IA.md`, seção 4): **contagem por hora do piloto de semáforo da Av. Paracatu
(36 de 76 equipamentos, desde 18/08/2026) — pedir à SMTT**. Com esse dado, as quatro
constantes acima passam a ter origem e o "antes × depois" vira medição, como pede a regra 8.

## Conserto de 19/09/2026

O MVP não abria corretamente. Diagnóstico e correção:

- `style.css` havia sido sobrescrito pelo código JavaScript do V5 (salvo 18/09 às 19:10,
  17.656 bytes). Como o HTML o carregava via `<link rel="stylesheet">`, o navegador
  descartava o conteúdo: a página ficava **sem estilo algum** e as funções
  `abrirMemoriaV5`, `fecharMemoriaV5` e `registrarDecisaoHumanaV5` nunca eram definidas —
  os botões davam `ReferenceError`.
- O CSS original (37.133 bytes, salvo 18/09 às 19:07) foi recuperado do histórico local do
  editor e devolvido a `style.css`.
- O JavaScript do V5 foi movido para `memoria-v5.js` e ligado no `index.html` depois do
  `script.js`.
- Conferido: os dois arquivos `.js` passam em `node --check`; as 7 funções chamadas por
  `onclick` no HTML estão definidas; 86 das 89 classes do HTML têm regra no CSS — as 3
  restantes (`.vermelho`, `.amarelo`, `.verde`) são pintadas inline por `setSignal()`,
  por design.

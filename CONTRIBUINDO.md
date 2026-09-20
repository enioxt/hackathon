# Como propor uma mudança (para quem nunca usou GitHub em time)

A ideia: você mexe na SUA cópia, mostra o que mudou, a gente conversa em cima da mudança e junta.

## 1. Trazer o projeto para o seu computador
```
git clone https://github.com/enioxt/hackathon.git
cd hackathon
```
Abra `ABRA-ESTE.html` no navegador para ver tudo funcionando. Não precisa instalar nada para as telas.

## 2. Criar o seu ramo (um rascunho só seu)
```
git checkout -b rafael/criterios-de-aceite      # troque pelo seu nome/assunto
```

## 3. Mexer
- Tela do gestor: `docs/gestor.html` (um arquivo só; os layouts trocam por `?layout=central|painel|foco|fila`)
- Critérios de aceite e regras: `docs/REGRAS-E-ACEITE-MVP.md` ← **comece por aqui se quiser cortar escopo**
- Porta de entrada de dados: `motor/entrada-de-dados/` · Leitor de vídeo: `motor/leitor-video/`
- Pode usar a IA que quiser. Entregue a ela o `PARA-A-IA.md` primeiro.

## 4. Conferir que não quebrou
```
python3 motor/provar.py                                   # os números ainda batem?
cd motor/entrada-de-dados && bun test api.test.ts         # 11 testes
cd ../leitor-video && python3 -m pytest -q                # 7 testes
```

## 5. Mandar a proposta
```
git add <os arquivos que você mudou>
git commit -m "o que mudou e por quê, em uma frase"
git push -u origin rafael/criterios-de-aceite
```
O GitHub mostra um botão **Compare & pull request**. Clique, escreva o que você quer discutir e envie. Ninguém junta nada sem conversa.

Sem acesso de escrita? Clique em **Fork** no topo da página do repositório e faça o mesmo no seu fork. Ou abra uma **Issue** só com a ideia.

## Regras da casa (curtas)
1. Número sem origem não entra. Se é inventado para demonstrar, leva a etiqueta DADO SINTÉTICO.
2. Nada de rosto, placa, dado pessoal ou dado policial.
3. Discordar é bem-vindo; apagar o trabalho do outro sem conversa, não.

#!/usr/bin/env bash
# Goldens do motor motor/relatorio-viagens-parser.ts
# Roda: bash motor/relatorio-viagens-parser.test.sh
set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PARSER="$SCRIPT_DIR/relatorio-viagens-parser.ts"
FIXTURE="${FIXTURE:-$SCRIPT_DIR/fixture-relatorio.txt}"
REAL_SRC="(arquivo local do time)"
TMP_OUT="$(mktemp -d)"
TMP_OUT_REAL="$(mktemp -d)"
PASS=0
FAIL=0

pass() { echo "  ✅ $1"; PASS=$((PASS+1)); }
fail() { echo "  ❌ $1"; FAIL=$((FAIL+1)); }

cleanup() { rm -rf "$TMP_OUT" "$TMP_OUT_REAL"; }
trap cleanup EXIT

if [ -f "$FIXTURE" ]; then
echo "=== golden a: registro bem formado vira objeto certo ==="
bun run "$PARSER" "$FIXTURE" "$TMP_OUT" >/tmp/pb-golden-a.log 2>&1
if [ -f "$TMP_OUT/viagens.jsonl" ]; then
  FIRST_LINE="$(head -n1 "$TMP_OUT/viagens.jsonl")"
  OK=1
  echo "$FIRST_LINE" | grep -q '"linha":"ALTO COLINA - SANTA LUZIA"' || OK=0
  echo "$FIRST_LINE" | grep -q '"data":"2026-08-01"' || OK=0
  echo "$FIRST_LINE" | grep -q '"veiculo_plan":"295"' || OK=0
  echo "$FIRST_LINE" | grep -q '"partida_planejada":"05:00:00"' || OK=0
  echo "$FIRST_LINE" | grep -q '"partida_real":"05:00:33"' || OK=0
  echo "$FIRST_LINE" | grep -q '"diff_partida_s":33' || OK=0
  echo "$FIRST_LINE" | grep -q '"chegada_real":"05:35:53"' || OK=0
  echo "$FIRST_LINE" | grep -q '"diff_chegada_s":-247' || OK=0
  echo "$FIRST_LINE" | grep -q '"km_exec":12.6' || OK=0
  echo "$FIRST_LINE" | grep -q '"passageiros":11' || OK=0
  echo "$FIRST_LINE" | grep -q '"status":"realizada"' || OK=0
  echo "$FIRST_LINE" | grep -q '"editada":false' || OK=0
  echo "$FIRST_LINE" | grep -q '"tabela":1' || OK=0
  echo "$FIRST_LINE" | grep -q '"empresa":"2648"' || OK=0
  # registro com "vazamento" inline de 1 palavra do texto de status
  # (10:35:24, IPK=1,11) tem que estar íntegro apesar do layout apertado
  INLINE_LINE="$(grep '"passageiros":14' "$TMP_OUT/viagens.jsonl")"
  echo "$INLINE_LINE" | grep -q '"ipk":1.11' || OK=0
  echo "$INLINE_LINE" | grep -q '"tabela":2' || OK=0
  echo "$INLINE_LINE" | grep -q '"empresa":"2648"' || OK=0
  if [ "$OK" = "1" ]; then
    pass "1a viagem e a viagem com vazamento inline de status viraram objetos corretos"
  else
    fail "campos do registro bem formado não batem — ver $TMP_OUT/viagens.jsonl"
  fi
else
  fail "viagens.jsonl não foi gerado (log: /tmp/pb-golden-a.log)"
fi

echo "=== golden b: campo vazio/\"-\" não vira NaN ==="
if [ -f "$TMP_OUT/viagens.jsonl" ]; then
  NAO_REAL="$(grep '"status":"nao_realizada"' "$TMP_OUT/viagens.jsonl" | head -n1)"
  OK=1
  [ -n "$NAO_REAL" ] || OK=0
  echo "$NAO_REAL" | grep -q '"partida_real":null' || OK=0
  echo "$NAO_REAL" | grep -q '"km_exec":null' || OK=0
  echo "$NAO_REAL" | grep -q '"passageiros":null' || OK=0
  echo "$NAO_REAL" | grep -q '"ipk":null' || OK=0
  if grep -q "NaN" "$TMP_OUT/viagens.jsonl"; then OK=0; fi
  if grep -q "NaN" "$TMP_OUT/agregados.json"; then OK=0; fi
  if [ "$OK" = "1" ]; then
    pass "campo \"-\" virou null (nunca NaN) em toda a saída"
  else
    fail "achei NaN ou null ausente onde devia haver null"
  fi
else
  fail "sem viagens.jsonl pra checar (golden a já falhou)"
fi

echo "=== golden c: campo motorista NUNCA aparece na saída ==="
if [ -f "$TMP_OUT/viagens.jsonl" ] && [ -f "$TMP_OUT/agregados.json" ]; then
  HITS=0
  HITS=$((HITS + $(grep -ic "motorista" "$TMP_OUT/viagens.jsonl")))
  HITS=$((HITS + $(grep -ic "motorista" "$TMP_OUT/agregados.json")))
  HITS=$((HITS + $(grep -ic "motorista" "$PARSER" | grep -c "^[1-9]" || true)))
  # a checagem que importa é a saída, não o comentário do próprio motor;
  # o grep abaixo confirma que o tipo Viagem não declara o campo
  if grep -qE '^\s*motorista\s*:' "$PARSER"; then
    fail "o tipo Viagem declara um campo motorista — PII vazaria"
  elif [ "$(grep -ic "motorista" "$TMP_OUT/viagens.jsonl")" = "0" ] && [ "$(grep -ic "motorista" "$TMP_OUT/agregados.json")" = "0" ]; then
    pass "motorista ausente de viagens.jsonl, agregados.json e do tipo Viagem"
  else
    fail "\"motorista\" apareceu na saída — vazamento de PII"
  fi
else
  fail "sem saída pra checar (golden a já falhou)"
fi

else
  echo "=== goldens a, b, c: ⚪ NÃO-MEDIDO — fixture ausente ==="
  echo "  A fixture é um trecho do relatório entregue ao time pela operadora e não é publicada."
  echo "  Para rodar: FIXTURE=/caminho/do/trecho.txt bash motor/relatorio-viagens-parser.test.sh"
fi

echo "=== golden d: totais batem com o cabeçalho dentro da tolerância (arquivo real) ==="
if [ -f "$REAL_SRC" ]; then
  OUT_LOG="$(bun run "$PARSER" "$REAL_SRC" "$TMP_OUT_REAL" 2>&1)"
  EXIT_CODE=$?
  DELTA_VIAGENS="$(echo "$OUT_LOG" | grep 'viagens_realizadas:' | grep -oP 'delta=\K[0-9.]+')"
  DELTA_PASS="$(echo "$OUT_LOG" | grep '^.* passageiros:' | grep -oP 'delta=\K[0-9.]+')"
  OK=1
  [ "$EXIT_CODE" = "0" ] || OK=0
  [ -n "$DELTA_VIAGENS" ] || OK=0
  [ -n "$DELTA_PASS" ] || OK=0
  if [ "$OK" = "1" ]; then
    # bc pode não existir; comparação com awk
    VOK=$(awk -v d="$DELTA_VIAGENS" 'BEGIN{print (d<=2)?1:0}')
    POK=$(awk -v d="$DELTA_PASS" 'BEGIN{print (d<=2)?1:0}')
    if [ "$VOK" = "1" ] && [ "$POK" = "1" ]; then
      pass "delta viagens=$DELTA_VIAGENS% · passageiros=$DELTA_PASS% (≤2%, exit=$EXIT_CODE)"
    else
      fail "delta acima de 2%: viagens=$DELTA_VIAGENS% passageiros=$DELTA_PASS%"
    fi
  else
    fail "parser não rodou limpo contra o arquivo real (exit=$EXIT_CODE) ou não imprimiu os deltas"
  fi
else
  echo "  ⚪ NÃO-MEDIDO — arquivo real ausente em $REAL_SRC, golden pulado"
fi

echo "=== golden e: arquivo inexistente falha com mensagem, não em silêncio ==="
ERR_OUT="$(bun run "$PARSER" "/tmp/nao-existe-$(date +%s%N).txt" "$TMP_OUT" 2>&1)"
ERR_CODE=$?
if [ "$ERR_CODE" != "0" ] && echo "$ERR_OUT" | grep -qi "não encontrado\|ERRO"; then
  pass "exit=$ERR_CODE + mensagem de erro visível (não silencioso)"
else
  fail "arquivo inexistente não gerou erro visível (exit=$ERR_CODE)"
fi

echo ""
echo "=== RESUMO: $PASS passou / $FAIL falhou ==="
[ "$FAIL" = "0" ]

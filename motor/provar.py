#!/usr/bin/env python3
"""provar.py — recalcula, a partir dos arquivos deste repositório, cada número que o time afirma.
Uso:  python3 motor/provar.py        (sai 0 se tudo confere, 1 se algum número não bate)
Não usa rede, relógio nem sorteio: mesmo repositório, mesmo resultado."""
import json, os, sys
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); D = os.path.join(R, 'dados', 'publicos')
def j(n): return json.load(open(os.path.join(D, n), encoding='utf-8'))
res = []
def prova(afirmacao, esperado, obtido, origem):
    ok = esperado == obtido; res.append(ok)
    print(f"{'✔' if ok else '✘'} {afirmacao}: afirmamos {esperado} · recalculado {obtido}   [{origem}]")
s = j('acidentes-patos-sejusp-mg.json'); oc = s['ocorrencias']
prova('ocorrências de trânsito de Patos com coordenada (2025 + início de 2026)', 1100, len(oc), 'dados/publicos/acidentes-patos-sejusp-mg.json')
prova('ocorrências graves ou fatais', 132, sum(1 for o in oc if o['pior'] in ('GRAVE', 'FATAL')), 'mesmo arquivo, campo "pior"')
prova('ocorrências fatais', 18, sum(1 for o in oc if o['pior'] == 'FATAL'), 'mesmo arquivo, campo "pior"')
prova('vítimas fatais (unidade diferente: 19 pessoas em 18 ocorrências)', 19, s['universo']['gravidade']['FATAL'], 'mesmo arquivo, bloco "universo"')
r = j('acidentes-renaest-patos.json')
prova('sinistros em Patos na base nacional, 2018 a ago/2026', 22708, r['sinistros'], 'dados/publicos/acidentes-renaest-patos.json')
prova('óbitos na mesma base', 140, r['obitos'], 'mesmo arquivo')
prova('sinistros com moto', 6818, r['sinistros_com_moto'], 'mesmo arquivo')
prova('moto em % dos sinistros (1 casa)', 30.0, round(100 * r['sinistros_com_moto'] / r['sinistros'], 1), 'conta: com_moto / sinistros')
c = j('simcam-curva.json'); cur, tot = c['curva'], c['total']
def cameras_para(p): return next(i + 1 for i, v in enumerate(cur) if v >= p * tot / 100)
for p, n in [(25, 33), (50, 94), (75, 207), (90, 357)]:
    prova(f'câmeras para cobrir {p}% das ocorrências a até 100 m (SIMULAÇÃO sobre dado real)', n, cameras_para(p), 'dados/publicos/simcam-curva.json · motor/simcam.py')
prova('cobertura com 100 câmeras, em % (1 casa)', 51.8, round(100 * cur[99] / tot, 1), 'mesma curva')
f = j('fontes-verificadas.json'); itens = f if isinstance(f, list) else f.get('itens') or f.get('fontes') or []
prova('fontes públicas levantadas', 83, len(itens), 'dados/publicos/fontes-verificadas.json')
print(f"\n{sum(res)} de {len(res)} números conferem." + ('' if all(res) else '  ← os ✘ acima são defeito nosso: corrigir a afirmação ou o dado.'))
sys.exit(0 if all(res) else 1)

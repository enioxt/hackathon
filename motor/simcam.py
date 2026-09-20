#!/usr/bin/env python3
"""simcam.py — SIMULAÇÃO de cobertura por N câmeras (determinística, sem rede).
Entrada: acidentes-pontos.json (ocorrências públicas com coordenada) + mapa-pontos.json (pontos de ônibus geocodificados).
Método: candidatos = células de 100 m onde houve ocorrência ou há ponto de ônibus; escolha gulosa por maior
ganho de ocorrências cobertas num raio RAIO_M; desempate por lat,lon. NÃO é posição de câmera real."""
import json, math, os
H = os.path.dirname(os.path.abspath(__file__)) + '/'
RAIO_M, CELULA_M, CENARIOS, FLUXOS_POR_MAQUINA = 100, 100, [10, 50, 100, 400, 600], 8
oc = [o for o in json.load(open(H + 'acidentes-pontos.json'))['ocorrencias'] if o.get('lat')]
pts = [p for p in json.load(open(H + 'mapa-pontos.json'))['pontos'] if p.get('lat')]
LAT0 = sum(o['lat'] for o in oc) / len(oc); KX = 111320 * math.cos(math.radians(LAT0)); KY = 110540
xy = lambda lat, lon: (lon * KX, lat * KY)
def cel(lat, lon):
    x, y = xy(lat, lon); return (round(x / CELULA_M), round(y / CELULA_M))
cands = sorted({cel(o['lat'], o['lon']) for o in oc} | {cel(p['lat'], p['lon']) for p in pts})
OX = [xy(o['lat'], o['lon']) for o in oc]; PX = [xy(p['lat'], p['lon']) for p in pts]
def perto(c, P): 
    cx, cy = c[0] * CELULA_M, c[1] * CELULA_M
    return {i for i, (x, y) in enumerate(P) if (x - cx) ** 2 + (y - cy) ** 2 <= RAIO_M ** 2}
cobre_o = {c: perto(c, OX) for c in cands}; cobre_p = {c: perto(c, PX) for c in cands}
ordem, vistos_o, vistos_p, livres = [], set(), set(), set(cands)
while livres and len(ordem) < max(CENARIOS):
    melhor = max(sorted(livres), key=lambda c: (len(cobre_o[c] - vistos_o), len(cobre_p[c] - vistos_p)))
    if not (cobre_o[melhor] - vistos_o) and not (cobre_p[melhor] - vistos_p): break
    livres.discard(melhor); vistos_o |= cobre_o[melhor]; vistos_p |= cobre_p[melhor]; ordem.append(melhor)
graves = {i for i, o in enumerate(oc) if o.get('pior') in ('GRAVE', 'FATAL')}
pax_tot = sum(p.get('pax_total', 0) for p in pts)
cen = []
for n in CENARIOS:
    so, sp = set(), set()
    for c in ordem[:n]: so |= cobre_o[c]; sp |= cobre_p[c]
    cen.append({'cameras': n, 'posicoes_usadas': min(n, len(ordem)), 'ocorrencias_cobertas': len(so), 'pct_ocorrencias': round(100 * len(so) / len(oc), 1),
                'graves_fatais_cobertas': len(so & graves), 'pct_graves_fatais': round(100 * len(so & graves) / max(1, len(graves)), 1),
                'pontos_onibus_cobertos': len(sp), 'pct_pax_proxy': round(100 * sum(pts[i].get('pax_total', 0) for i in sp) / max(1, pax_tot), 1),
                'maquinas': math.ceil(min(n, len(ordem)) / FLUXOS_POR_MAQUINA)})
out = {'rotulo': 'SIMULAÇÃO', 'premissas': {'raio_m': RAIO_M, 'celula_m': CELULA_M, 'fluxos_por_maquina': FLUXOS_POR_MAQUINA,
        'metodo': 'escolha gulosa de células de 100 m por ocorrências cobertas; posição é célula, não câmera real'},
       'universo': {'ocorrencias_com_coordenada': len(oc), 'graves_fatais': len(graves), 'pontos_onibus_geocodificados': len(pts), 'celulas_candidatas': len(cands), 'celulas_com_ganho': len(ordem)},
       'cenarios': cen, 'posicoes': [[round(c[1] * CELULA_M / KY, 5), round(c[0] * CELULA_M / KX, 5)] for c in ordem]}
json.dump(out, open(H + 'simcam.json', 'w'), ensure_ascii=False, indent=1)
print(json.dumps({'universo': out['universo'], 'cenarios': cen}, ensure_ascii=False, indent=1))

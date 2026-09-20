#!/usr/bin/env python3
"""Mede, com clique de mouse REAL (Playwright), se cada controle visível de uma
página reage ao clique — variante de `medir-cliques.py` para o app-cidadao.html.

Por que uma cópia e não reuso direto: o motor original (`medir-cliques.py`) tem
viewport fixo em 1600x900 e usa um seletor+heurística de "já ativo" pensados
para o `gestor.html` (query string `?layout=`). Esta página não tem layout via
querystring e precisa ser medida em dois viewports diferentes (celular
390x844 e desktop 1280x800) — por isso o parâmetro de viewport na CLI.

Para cada controle: recarrega a página do zero (nunca acumula estado do clique
anterior), localiza o controle pelo mesmo índice de seletor, clica com o mouse
e compara o HTML inteiro do documento antes×depois (não só o comprimento —
uma troca de classe "cinza"->"amarelo" não muda o tamanho do texto visível,
mas muda o HTML). Trata os falsos negativos conhecidos:
  (a) controle já ativo/selecionado por padrão (aria-pressed="true" ou classe
      selecionado/ativo/escolhido) que não muda nada ao clicar -> "já ativo".
  (b) botão "índice"/"início" clicado a partir do estado que ele já representa
      (marca aria-pressed inicial no próprio HTML) -> mesmo tratamento.
Imprime um único JSON em stdout.
"""
import json
import re
import sys
from playwright.sync_api import sync_playwright

SELETOR = 'button, [onclick], [role="button"], a[href^="#"]'

def ja_ativo(info):
    if info['ariaPressed'] == 'true':
        return True
    cls = info['cls'] or ''
    if re.search(r'(^|\s)(selecionado|ativo|escolhido)(\s|$)', cls):
        return True
    return False

def coletar(page):
    return page.eval_on_selector_all(SELETOR, """els => els.map(el => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
            visible: r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none',
            texto: (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || '').trim().slice(0,60),
            cls: String(el.className || ''),
            ariaPressed: el.getAttribute('aria-pressed'),
            w: Math.round(r.width), h: Math.round(r.height)
        };
    })""")

def medir(url, width, height):
    with sync_playwright() as p:
        b = p.chromium.launch(channel='chrome', headless=True)
        pg = b.new_page(viewport={'width': width, 'height': height})
        erros_js = []
        pg.on('pageerror', lambda e: erros_js.append(str(e)))
        pg.goto(url); pg.wait_for_timeout(400)
        total = len(coletar(pg))
        reagem, ja_ativos, sem_reacao, nao_consegui, pequenos = [], [], [], [], []
        for i in range(total):
            pg.goto(url); pg.wait_for_timeout(300)
            infos = coletar(pg)
            if i >= len(infos) or not infos[i]['visible']:
                continue
            info = infos[i]
            rotulo = info['texto'] or ('#%d' % i)
            if info['w'] < 44 or info['h'] < 44:
                pequenos.append('%s (%dx%d)' % (rotulo, info['w'], info['h']))
            els = pg.query_selector_all(SELETOR)
            el = els[i]
            url_antes = pg.url
            html_antes = pg.evaluate("document.documentElement.outerHTML")
            try:
                el.scroll_into_view_if_needed(timeout=3000)
                el.click(timeout=4000)
                pg.wait_for_timeout(200)
            except Exception as e:
                nao_consegui.append({'controle': rotulo, 'erro': str(e)[:160]})
                continue
            url_depois = pg.url
            html_depois = pg.evaluate("document.documentElement.outerHTML")
            mudou = (url_depois != url_antes) or (html_depois != html_antes)
            if mudou:
                reagem.append(rotulo)
            elif ja_ativo(info):
                ja_ativos.append(rotulo)
            else:
                sem_reacao.append(rotulo)
        pg.close(); b.close()
        return {
            'pagina': url, 'viewport': '%dx%d' % (width, height), 'controles': total,
            'reagem': reagem, 'ja_ativo': ja_ativos, 'sem_reacao': sem_reacao,
            'nao_consegui_clicar': nao_consegui, 'toque_menor_44px': pequenos,
            'erros_js': erros_js
        }

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('uso: medir-cliques-app.py <url> [largura] [altura]', file=sys.stderr); sys.exit(1)
    url = sys.argv[1]
    w = int(sys.argv[2]) if len(sys.argv) > 2 else 390
    h = int(sys.argv[3]) if len(sys.argv) > 3 else 844
    print(json.dumps(medir(url, w, h), ensure_ascii=False, indent=2))

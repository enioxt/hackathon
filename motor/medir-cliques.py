#!/usr/bin/env python3
"""Mede, com clique de mouse REAL (Playwright), se cada controle visível de uma
página reage ao clique. Reusável: `python3 medir-cliques.py <url>`.

Para cada controle: recarrega a página com ?intro=0 (nunca acumula estado do
clique anterior), localiza o controle pelo mesmo índice de seletor, clica com
o mouse e compara DOM/URL antes×depois. Trata os falsos negativos conhecidos:
  (a) controle já ativo por padrão (aria-pressed/class on/sel, ou já é o
      ?layout= atual) que não muda nada ao clicar -> "já ativo", não defeito.
  (b) item de menu lateral troca de tela -> por isso cada clique recarrega.
  (c) botão do seletor de layout recarrega a página -> URL mudar já conta
      como reação.
Imprime um único JSON em stdout.
"""
import json
import re
import sys
from urllib.parse import urlparse, parse_qs
from playwright.sync_api import sync_playwright

SELETOR = 'button, [onclick], [role="button"], a[href^="#"], .zona-label, .fila-row'

def com_intro_zero(url):
    sep = '&' if '?' in url else '?'
    if 'intro=0' in url:
        return url
    return url + sep + 'intro=0'

def ja_ativo(info):
    cls = info['cls'] or ''
    if info['ariaPressed'] == 'true':
        return True
    if re.search(r'(^|\s)(on|sel)(\s|$)', cls):
        return True
    if info['dataLayout'] and info['qsLayout'] and info['dataLayout'] == info['qsLayout']:
        return True
    return False

def coletar(page):
    return page.eval_on_selector_all(SELETOR, """els => els.map(el => {
        const r = el.getBoundingClientRect();
        return {
            visible: r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden',
            texto: (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || '').trim().slice(0,60),
            cls: el.className && el.className.baseVal !== undefined ? '' : String(el.className || ''),
            ariaPressed: el.getAttribute('aria-pressed'),
            dataLayout: el.getAttribute('data-layout')
        };
    })""")

def medir(url):
    url = com_intro_zero(url)
    qs_layout = parse_qs(urlparse(url).query).get('layout', [None])[0]
    with sync_playwright() as p:
        b = p.chromium.launch(channel='chrome', headless=True)
        pg = b.new_page(viewport={'width': 1600, 'height': 900})
        erros_js = []
        pg.on('pageerror', lambda e: erros_js.append(str(e)))
        pg.goto(url); pg.wait_for_timeout(500)
        total = len(coletar(pg))
        reagem, sem_reacao, nao_consegui = [], [], []
        for i in range(total):
            pg.goto(url); pg.wait_for_timeout(350)
            infos = coletar(pg)
            if i >= len(infos) or not infos[i]['visible']:
                continue
            info = infos[i]; info['qsLayout'] = qs_layout
            rotulo = info['texto'] or ('#%d' % i)
            els = pg.query_selector_all(SELETOR)
            el = els[i]
            url_antes = pg.url
            dom_antes = pg.evaluate("document.body.innerText.length")
            try:
                el.click(timeout=4000)
                pg.wait_for_timeout(220)
            except Exception as e:
                nao_consegui.append({'controle': rotulo, 'erro': str(e)[:160]})
                continue
            url_depois = pg.url
            dom_depois = pg.evaluate("document.body.innerText.length")
            mudou = (url_depois != url_antes) or (dom_depois != dom_antes) or bool(pg.query_selector('.origem-pop, #intro-overlay'))
            if mudou:
                reagem.append(rotulo)
            elif ja_ativo(info):
                reagem.append(rotulo + ' (já ativo)')
            else:
                sem_reacao.append(rotulo)
        pg.close(); b.close()
        return {
            'pagina': url, 'controles': total,
            'reagem': reagem, 'sem_reacao': sem_reacao,
            'nao_consegui_clicar': nao_consegui, 'erros_js': erros_js
        }

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('uso: medir-cliques.py <url>', file=sys.stderr); sys.exit(1)
    print(json.dumps(medir(sys.argv[1]), ensure_ascii=False, indent=2))

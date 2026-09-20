#!/usr/bin/env python3
"""Prova o Modo História (?historia=1) com clique de mouse REAL (Playwright):
percorre os 7 passos clicando em "Próximo →", clica nos botões dos passos 5
(escolher intervenção) e 6 (registrar), e verifica que CADA passo muda a tela
(rótulo "passo N de 7" e/ou conteúdo do card mudam). Também tira os prints
shot-historia-1..7.png (1600x900) e shot-historia-tv.png (1920x1080).
Uso: python3 provar-historia.py [url_base] [dir_saida]
"""
import json
import sys
from playwright.sync_api import sync_playwright

URL = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:8787/'
OUT = sys.argv[2] if len(sys.argv) > 2 else '..'

def rotulo(pg):
    return pg.eval_on_selector('#historia-passo-lbl', 'el=>el.innerText')

def card(pg):
    return pg.eval_on_selector('#historia-card', 'el=>el.innerText')

def main():
    erros_js = []
    passos = []
    with sync_playwright() as p:
        b = p.chromium.launch(channel='chrome', headless=True)
        pg = b.new_page(viewport={'width': 1600, 'height': 900})
        pg.on('pageerror', lambda e: erros_js.append(str(e)))
        pg.goto(URL.rstrip('/') + '/?layout=central&intro=0')
        pg.wait_for_timeout(600)
        pg.click('#historia-abrir-btn')
        pg.wait_for_timeout(500)
        passos.append({'passo': 1, 'rotulo': rotulo(pg), 'trecho': card(pg)[:80]})
        pg.screenshot(path=f'{OUT}/shot-historia-1.png')

        for n in range(2, 8):
            rotulo_antes, card_antes = rotulo(pg), card(pg)
            pg.click('#historia-next-btn')
            pg.wait_for_timeout(500)
            mudou = (rotulo(pg) != rotulo_antes) or (card(pg) != card_antes)
            registro = {'passo': n, 'rotulo': rotulo(pg), 'mudou_tela': mudou, 'trecho': card(pg)[:80]}
            if n == 5:
                tb = pg.query_selector('.historia-tipo-btn')
                if tb:
                    tb.click(); pg.wait_for_timeout(300)
                    registro['clicou_intervencao'] = True
                    registro['efeito_mostrado'] = 'DADO SINTÉTICO' in (pg.eval_on_selector('.historia-injetado', 'el=>el.innerText') or '')
            if n == 6:
                rb = pg.query_selector('#historia-registrar-btn')
                if rb:
                    rb.click(); pg.wait_for_timeout(300)
                    registro['clicou_registrar'] = True
                    registro['confirmou'] = bool((pg.eval_on_selector('#historia-registrado-msg', 'el=>el.innerText') or '').strip())
            passos.append(registro)
            pg.screenshot(path=f'{OUT}/shot-historia-{n}.png')

        # tela final (passo 8, sem numero de passo)
        rotulo_antes, card_antes = rotulo(pg), card(pg)
        pg.click('#historia-next-btn')
        pg.wait_for_timeout(400)
        final_ok = 'Esta foi a história' in card(pg)
        exp = pg.query_selector('#historia-explorar-btn')
        saiu = False
        if exp:
            exp.click(); pg.wait_for_timeout(300)
            saiu = not pg.is_visible('#historia-overlay')
        passos.append({'passo': 'final', 'mostrou_fechamento': final_ok, 'saiu_do_modo': saiu})
        pg.close()

        # print TV (1920x1080), do zero
        pg2 = b.new_page(viewport={'width': 1920, 'height': 1080})
        pg2.on('pageerror', lambda e: erros_js.append(str(e)))
        pg2.goto(URL.rstrip('/') + '/?layout=central&intro=0')
        pg2.wait_for_timeout(600)
        pg2.click('#historia-abrir-btn')
        pg2.wait_for_timeout(700)
        pg2.screenshot(path=f'{OUT}/shot-historia-tv.png')
        pg2.close()
        b.close()

    resultado = {'passos': passos, 'erros_js': erros_js,
                 'todos_passos_reagiram': all(x.get('mudou_tela', True) for x in passos if isinstance(x.get('passo'), int) and x['passo'] > 1)}
    print(json.dumps(resultado, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()

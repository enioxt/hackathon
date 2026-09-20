#!/usr/bin/env python3
"""
medir-sobreposicao.py — varredura de sobreposicao/corte no gestor.html (Modo Historia + telas).

Reutilizavel: roda contra http://127.0.0.1:8787/gestor.html (servidor le o arquivo do disco
a cada pedido). Para cada viewport x estado, mede:
  (a) texto cortado    - scrollHeight/scrollWidth > client + 2px em elemento com overflow
                          hidden/auto/scroll, separando rolagem intencional de corte real
  (b) sobreposicao     - pares de elementos INTERATIVOS/TEXTO visiveis cuja intersecao > 12%
                          da menor caixa, sem relacao pai/filho, e elementFromPoint no centro
                          de um devolve o outro (cobertura real, nao so bounding-box)
  (c) fora da tela      - elemento interativo visivel com parte fora do viewport
  (d) fixos colidindo   - nav do historia, chip/janela de melhorias, seletor de layout, selo,
                          botao "?" e "Ver a historia" entre si e com conteudo

Saida: JSON por viewport (lista de estados com os achados) em --out (default stdout) e
resumo total_defeitos por viewport.
"""
import argparse
import json
import sys
import time

from playwright.sync_api import sync_playwright

VIEWPORTS = [
    (1362, 620), (1366, 768), (1280, 720), (1536, 864),
    (1600, 900), (1920, 1080), (1024, 768), (768, 1024),
    (390, 844), (360, 740),
]

LAYOUTS = ["central", "painel", "foco", "fila"]
TELAS = ["agora", "decidir", "resultado"]

# Seletores que sao rolagem intencional por natureza (listas/tabelas/paineis com dado)
ROLAGEM_INTENCIONAL_SEL = [
    "#map", ".leaflet-container", ".leaflet-popup-content", ".tbl-wrap", "table", ".zonas-strip",
    ".fila-tabela", ".memoria-timeline", "#central-detail-root",
    "#painel-lateral-root", ".fonte-list", ".alertas-lista", ".painel-tabs",
    "#vrChat", "#vrLog", ".chat-log", ".historia-card", "#stats-topo", ".diagrama-wrap",
    "#foco-view",
]

# Elementos "chrome" fixos do Modo Historia + widgets de melhoria/chat (nao contam como
# sobreposicao intencional entre si+conteudo — sao exatamente o (d) do enunciado, mas o
# scrim de fundo esmaecido do historia NAO conta como defeito quando cobre conteudo atras dele).
FIXOS_HISTORIA_SEL = [
    "#historia-nav", "#historia-chrome", "#historia-passo-lbl", "#historia-x",
    "#historia-sair-btn", "#historia-card", "#historia-progresso",
]

JS_MEDIR = r"""
() => {
  // interseção dos retângulos de clipe (overflow hidden) de todos os ancestrais até o body — um
  // filho de caixa recolhida (ex.: widget de chat minimizado, height:48px + overflow:hidden) tem
  // coordenadas "reais" (como se a caixa estivesse expandida) mas está clipado para fora: não é
  // "fora da tela", é invisível de propósito, e não deve virar ruído de defeito.
  function clipRectAncestral(el) {
    let p = el.parentElement, rect = null;
    while (p && p !== document.documentElement) {
      const cs = getComputedStyle(p);
      // 'auto'/'scroll' clipam exatamente igual a 'hidden' para quem está fora da janela ATUAL de
      // rolagem — só muda que dá pra rolar até lá; não visível AGORA é não visível AGORA.
      const clipaY = ['hidden','auto','scroll'].includes(cs.overflowY);
      const clipaX = ['hidden','auto','scroll'].includes(cs.overflowX);
      if (clipaY || clipaX) {
        const pr = p.getBoundingClientRect();
        rect = rect ? {
          left: Math.max(rect.left, pr.left), top: Math.max(rect.top, pr.top),
          right: Math.min(rect.right, pr.right), bottom: Math.min(rect.bottom, pr.bottom),
        } : { left: pr.left, top: pr.top, right: pr.right, bottom: pr.bottom };
      }
      p = p.parentElement;
    }
    return rect;
  }
  function estaClipadoParaFora(el) {
    const rect = clipRectAncestral(el);
    if (!rect) return false;
    const r = el.getBoundingClientRect();
    const ix = Math.min(r.right, rect.right) - Math.max(r.left, rect.left);
    const iy = Math.min(r.bottom, rect.bottom) - Math.max(r.top, rect.top);
    return ix <= 0 || iy <= 0;
  }
  function visivel(el) {
    if (!(el instanceof Element)) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity || '1') === 0) return false;
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return false;
    if (estaClipadoParaFora(el)) return false;
    return true;
  }
  function textoProprio(el) {
    let t = '';
    for (const n of el.childNodes) {
      if (n.nodeType === 3) t += n.textContent;
    }
    return t.trim();
  }
  function temTextoVisivel(el) {
    const t = (el.textContent || '').trim();
    return t.length > 0;
  }
  function ehInterativo(el) {
    const tag = el.tagName.toLowerCase();
    if (['button', 'a', 'input', 'select', 'textarea'].includes(tag)) return true;
    if (el.hasAttribute('onclick')) return true;
    if (el.getAttribute('role') === 'button') return true;
    const cs = getComputedStyle(el);
    if (cs.cursor === 'pointer' && (el.className || '').toString().includes('chip')) return true;
    return false;
  }
  function ehAncestral(a, b) {
    return a.contains(b) || b.contains(a);
  }
  // fixed/sticky = elemento "sempre visivel", nao rola com a pagina — se ficar parcialmente fora
  // do viewport e defeito real (nao ha como o usuario chegar nele rolando). Elemento em fluxo normal
  // que fica abaixo/a direita do viewport e so pagina comprida — rolagem de pagina e SEMPRE legitima,
  // nao e "fora da tela" no sentido do enunciado.
  function possuiAncestralFixo(el) {
    let p = el;
    while (p && p !== document.documentElement) {
      const cs = getComputedStyle(p);
      if (cs.position === 'fixed' || cs.position === 'sticky') return true;
      p = p.parentElement;
    }
    return false;
  }
  // sobe a arvore de pais procurando um ancestral que REALMENTE role (scrollWidth/Height > client)
  // com overflow auto/scroll — isso e rolagem interna legitima (lista, tabela, painel, mapa, log de
  // chat), nao "fora da tela"/corte. Nao conta o proprio body/html (isso e rolagem de pagina).
  function dentroDeScrollavel(el) {
    let p = el.parentElement;
    while (p && p !== document.body && p !== document.documentElement) {
      const cs = getComputedStyle(p);
      const podeX = ['auto','scroll'].includes(cs.overflowX) && p.scrollWidth > p.clientWidth + 2;
      const podeY = ['auto','scroll'].includes(cs.overflowY) && p.scrollHeight > p.clientHeight + 2;
      if (podeX || podeY) return true;
      p = p.parentElement;
    }
    return false;
  }
  // topo real no proprio centro: se algo mais (nao ancestral/descendente) esta por cima, o elemento
  // ja esta oculto atras de outra camada (ex.: atras do scrim escurecido do Modo Historia) — nao
  // deve gerar ruido de sobreposicao a partir dele, quem cobre ja aparece do outro lado do par.
  function ehTopoNoProprioCentro(el, cx, cy) {
    const r = el.getBoundingClientRect();
    const totalmenteFora = r.right <= 0 || r.left >= window.innerWidth || r.bottom <= 0 || r.top >= window.innerHeight;
    if (totalmenteFora) return true; // fora da tela por completo, outro check ((c)) cuida disso
    // PARCIALMENTE fora (ex.: rolou a página e só uma tira do elemento ainda aparece no topo/base
    // do viewport): o centro geométrico pode cair fora do viewport mesmo com o elemento parcialmente
    // visível — testa no ponto real visível (interseção elemento×viewport), nunca no centro cru,
    // senão uma tira de 1px escondida atrás do scrim passa como "topo" por definição errada.
    const px = Math.min(Math.max(cx, r.left + 0.5, 0.5), Math.min(r.right, window.innerWidth) - 0.5);
    const py = Math.min(Math.max(cy, r.top + 0.5, 0.5), Math.min(r.bottom, window.innerHeight) - 0.5);
    const noPonto = document.elementFromPoint(px, py);
    if (!noPonto) return false;
    return noPonto === el || el.contains(noPonto) || noPonto.contains(el);
  }

  const viewportW = window.innerWidth, viewportH = window.innerHeight;
  const historiaAtivo = !!(document.getElementById('historia-overlay') && !document.getElementById('historia-overlay').hidden);
  const resultado = { cortados: [], sobrepostos: [], fora_da_tela: [], fixos_colidindo: [], historia_spot_coberto: null };

  // ---------- (a) texto cortado ----------
  const rolagemIntencional = %ROLAGEM_SEL%;
  const candidatosCorte = Array.from(document.querySelectorAll('body *')).filter(visivel);
  for (const el of candidatosCorte) {
    if (!temTextoVisivel(el)) continue;
    // só elementos "folha" de texto (evita reportar o container gigante junto do filho)
    const filhosComTexto = Array.from(el.children).some(c => visivel(c) && temTextoVisivel(c));
    const cs = getComputedStyle(el);
    const overflowY = cs.overflowY, overflowX = cs.overflowX;
    const cortaV = el.scrollHeight > el.clientHeight + 2 && ['hidden','auto','scroll'].includes(overflowY);
    const cortaH = el.scrollWidth > el.clientWidth + 2 && ['hidden','auto','scroll'].includes(overflowX);
    if (!cortaV && !cortaH) continue;
    const sel = el.id ? ('#'+el.id) : (el.className && typeof el.className === 'string' ? '.'+el.className.toString().trim().split(/\s+/).join('.') : el.tagName);
    // truncamento horizontal de 1 linha por elipse (padrao de UI deliberado) so conta quando NAO
    // corta verticalmente tambem — cortar o topo/baixo de um titulo nunca e intencional.
    const ellipseDeliberado = !cortaV && cortaH && cs.textOverflow === 'ellipsis' && cs.whiteSpace === 'nowrap';
    const intencional = ellipseDeliberado || rolagemIntencional.some(s => { try { return el.closest(s); } catch(e) { return false; } });
    resultado.cortados.push({
      seletor: sel.slice(0, 160),
      tag: el.tagName.toLowerCase(),
      texto: (el.textContent||'').trim().slice(0,80),
      scrollHeight: el.scrollHeight, clientHeight: el.clientHeight,
      scrollWidth: el.scrollWidth, clientWidth: el.clientWidth,
      overflowY, overflowX,
      intencional: !!intencional,
      motivo_intencional: ellipseDeliberado ? 'ellipsis-1-linha' : (intencional ? 'rolagem-interna-conhecida' : null),
      folha: !filhosComTexto,
    });
  }

  // ---------- (b) sobreposicao ----------
  function alvosSobreposicao() {
    const sel = 'button, a, input, select, textarea, [role="button"], .chip, h1,h2,h3,h4, .historia-titulo, .historia-num, .historia-passo-lbl, .stat, .alert, .zona-item, .fonte-item, .selo, label';
    return Array.from(document.querySelectorAll(sel)).filter(el => {
      if (!visivel(el)) return false;
      const r = el.getBoundingClientRect();
      const cx = (r.left+r.right)/2, cy = (r.top+r.bottom)/2;
      // exclui quem ja esta escondido atras de outra camada no proprio centro (ex.: dimmed pelo
      // scrim do Modo Historia, ou atras de um popover) — nao e um "cobridor" candidato.
      return ehTopoNoProprioCentro(el, cx, cy);
    });
  }
  const alvos = alvosSobreposicao();
  const scrimSel = ['.historia-scrim', '.intro-overlay', '.painel-backdrop', '.origem-pop'];
  function dentroDeIgnoravel(el) {
    return scrimSel.some(s => { try { return el.closest(s); } catch(e) { return false; } });
  }
  for (let i = 0; i < alvos.length; i++) {
    for (let j = i + 1; j < alvos.length; j++) {
      const a = alvos[i], b = alvos[j];
      if (ehAncestral(a, b)) continue;
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      const ix = Math.max(0, Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left));
      const iy = Math.max(0, Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top));
      const inter = ix * iy;
      if (inter <= 0) continue;
      const areaA = ra.width * ra.height, areaB = rb.width * rb.height;
      const menor = Math.min(areaA, areaB);
      if (menor <= 0) continue;
      const pct = inter / menor;
      if (pct <= 0.12) continue;
      // confirma cobertura real no centro de um dos dois
      const cx = (Math.max(ra.left, rb.left) + Math.min(ra.right, rb.right)) / 2;
      const cy = (Math.max(ra.top, rb.top) + Math.min(ra.bottom, rb.bottom)) / 2;
      if (cx < 0 || cy < 0 || cx > viewportW || cy > viewportH) continue;
      const noPonto = document.elementFromPoint(cx, cy);
      if (!noPonto) continue;
      const cobreA = a.contains(noPonto) || noPonto === a;
      const cobreB = b.contains(noPonto) || noPonto === b;
      if (!cobreA && !cobreB) continue; // nenhum dos dois esta de fato no topo ali (ex: um 3o elemento por cima)
      // popover/overlay cobrindo o fundo é sobreposição intencional (enunciado (b)) — só precisa
      // que o lado que está POR CIMA (cobre=true) seja o popover/overlay, não os dois lados.
      if ((cobreA && dentroDeIgnoravel(a)) || (cobreB && dentroDeIgnoravel(b))) continue;
      // durante o Modo Historia, o fundo inteiro ja fica escurecido pelo scrim (sobreposicao
      // intencional, igual ao proprio scrim) — só conta par onde PELO MENOS UM lado é chrome do
      // historia (card/nav/chrome/x) por cima de algo que nao e outro chrome do historia.
      if (historiaAtivo) {
        const chromeHistoria = (el) => !!el.closest('#historia-card, #historia-nav, #historia-chrome, #historia-x, #historia-overlay');
        const aEhChrome = chromeHistoria(a), bEhChrome = chromeHistoria(b);
        if (!aEhChrome && !bEhChrome) continue; // fundo dimmed vs fundo dimmed: ruido, ignora
      }
      const desc = (el) => (el.id ? '#'+el.id : (el.className && typeof el.className==='string' ? el.tagName.toLowerCase()+'.'+el.className.toString().trim().split(/\s+/).join('.') : el.tagName)).slice(0,120);
      resultado.sobrepostos.push({
        a: desc(a), b: desc(b),
        a_texto: (a.textContent||'').trim().slice(0,50),
        b_texto: (b.textContent||'').trim().slice(0,50),
        pct_intersecao: Math.round(pct*1000)/1000,
        cobre: cobreA && cobreB ? 'ambigua' : (cobreA ? 'a-sobre-b' : 'b-sobre-a'),
      });
    }
  }

  // ---------- checagem dedicada: o cartao do Modo Historia cobre o elemento destacado? ----------
  if (historiaAtivo) {
    const spot = document.querySelector('.historia-spot');
    const card = document.getElementById('historia-card');
    if (spot && card && visivel(spot) && visivel(card)) {
      const rs = spot.getBoundingClientRect(), rc = card.getBoundingClientRect();
      const ix = Math.max(0, Math.min(rs.right, rc.right) - Math.max(rs.left, rc.left));
      const iy = Math.max(0, Math.min(rs.bottom, rc.bottom) - Math.max(rs.top, rc.top));
      const inter = ix * iy;
      const areaSpot = rs.width * rs.height;
      const pct = areaSpot > 0 ? inter / areaSpot : 0;
      resultado.historia_spot_coberto = { pct_do_destaque_coberto: Math.round(pct*1000)/1000, cobre: pct > 0.25 };
    } else {
      resultado.historia_spot_coberto = { pct_do_destaque_coberto: 0, cobre: false, obs: 'sem spot ou card visivel neste passo' };
    }
  }

  // ---------- (c) fora da tela ----------
  // só conta quem é "sempre visível" por natureza (fixed/sticky, ex.: nav do historia, chrome,
  // widgets de melhoria/chat) — conteúdo em fluxo normal que fica abaixo/a direita do viewport é
  // página comprida, rolagem de página é sempre legítima e não conta aqui.
  const interativos = Array.from(document.querySelectorAll('button, a, input, select, textarea, [role="button"], .chip')).filter(el => visivel(el) && !dentroDeScrollavel(el) && possuiAncestralFixo(el));
  for (const el of interativos) {
    const r = el.getBoundingClientRect();
    const foraH = r.right <= 0 || r.left >= viewportW;
    const foraV = r.bottom <= 0 || r.top >= viewportH;
    const parcial = (r.left < 0 || r.right > viewportW || r.top < 0 || r.bottom > viewportH);
    if (foraH || foraV || parcial) {
      const desc = el.id ? ('#'+el.id) : (el.textContent||'').trim().slice(0,40) || el.tagName;
      resultado.fora_da_tela.push({
        seletor: desc,
        rect: { left: Math.round(r.left), top: Math.round(r.top), right: Math.round(r.right), bottom: Math.round(r.bottom) },
        totalmente_fora: foraH || foraV,
      });
    }
  }

  // ---------- (d) fixos colidindo ----------
  const fixosSel = %FIXOS_SEL%.concat(['.melhoria-btn', '.melhoria-chat-btn', '.melhoria-chat-janela', '#melhoria-widget', '.layout-select', '#layout-select', '.demo-selo', '.ajuda-btn']);
  const fixos = [];
  for (const s of fixosSel) {
    // só entra quem É de fato fixed/sticky (a checagem (d) é sobre chrome "sempre visível" —
    // um botão comum do cabeçalho, como o seletor de layout, é conteúdo normal e não deveria
    // ser comparado contra o cartão do historia como se fosse chrome fixo).
    document.querySelectorAll(s).forEach(el => {
      const pos = getComputedStyle(el).position;
      if (visivel(el) && (pos === 'fixed' || pos === 'sticky')) fixos.push(el);
    });
  }
  for (let i = 0; i < fixos.length; i++) {
    for (let j = i + 1; j < fixos.length; j++) {
      const a = fixos[i], b = fixos[j];
      if (ehAncestral(a, b)) continue;
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      const ix = Math.max(0, Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left));
      const iy = Math.max(0, Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top));
      const inter = ix * iy;
      if (inter <= 0) continue;
      const areaA = ra.width*ra.height, areaB = rb.width*rb.height;
      const pct = inter / Math.min(areaA, areaB);
      if (pct <= 0.12) continue;
      const desc = (el) => (el.id ? '#'+el.id : el.tagName).slice(0,80);
      resultado.fixos_colidindo.push({ a: desc(a), b: desc(b), pct_intersecao: Math.round(pct*1000)/1000 });
    }
  }

  return resultado;
}
"""


def montar_js():
    js = JS_MEDIR.replace("%ROLAGEM_SEL%", json.dumps(ROLAGEM_INTENCIONAL_SEL))
    js = js.replace("%FIXOS_SEL%", json.dumps(FIXOS_HISTORIA_SEL))
    return js


def medir_estado(page, nome):
    js = montar_js()
    dado = page.evaluate(js)
    spot_coberto = 1 if (dado.get("historia_spot_coberto") or {}).get("cobre") else 0
    total = (
        len([c for c in dado["cortados"] if not c["intencional"]])
        + len(dado["sobrepostos"])
        + len(dado["fora_da_tela"])
        + len(dado["fixos_colidindo"])
        + spot_coberto
    )
    return {"estado": nome, **dado, "total_defeitos": total}


def ir_para(page, base_url, layout=None, tela=None, tema=None, intro0=True, historia=False):
    qs = []
    if layout:
        qs.append(f"layout={layout}")
    if tema:
        qs.append(f"tema={tema}")
    if historia:
        qs.append("historia=1")
    if intro0 and not historia:
        qs.append("intro=0")
    url = base_url + ("?" + "&".join(qs) if qs else "")
    page.goto(url, wait_until="networkidle")
    page.wait_for_timeout(250)
    if tela and not historia:
        page.evaluate(f"location.hash = '{tela}'")
        page.wait_for_timeout(200)


def rodar_viewport(browser, base_url, vw, vh):
    ctx = browser.new_context(viewport={"width": vw, "height": vh})
    page = ctx.new_page()
    erros_js = []
    page.on("pageerror", lambda e: erros_js.append(str(e)))
    estados = []

    # 1) cada layout x cada tela, com intro=0
    for layout in LAYOUTS:
        for tela in TELAS:
            nome = f"layout={layout}&tela={tela}"
            try:
                ir_para(page, base_url, layout=layout, tela=tela, intro0=True)
                estados.append(medir_estado(page, nome))
            except Exception as e:
                estados.append({"estado": nome, "erro": str(e), "total_defeitos": None})

    # 2) primeira visita (sem intro=0) — intro overlay aberto
    try:
        ir_para(page, base_url, layout="central", intro0=False)
        estados.append(medir_estado(page, "primeira-visita-intro-aberto"))
    except Exception as e:
        estados.append({"estado": "primeira-visita-intro-aberto", "erro": str(e), "total_defeitos": None})

    # 3) popover de origem de um cartão aberto
    try:
        ir_para(page, base_url, layout="central", tela="agora", intro0=True)
        clicado = page.evaluate(
            """() => {
                const el = document.querySelector('[data-origem]');
                if (!el) return false;
                el.click();
                return true;
            }"""
        )
        page.wait_for_timeout(200)
        estados.append(medir_estado(page, f"popover-origem-aberto(clicou={clicado})"))
    except Exception as e:
        estados.append({"estado": "popover-origem-aberto", "erro": str(e), "total_defeitos": None})

    # 4) painel de detalhe aberto numa zona
    try:
        ir_para(page, base_url, layout="central", tela="agora", intro0=True)
        abriu = page.evaluate(
            """() => { if (window.abrirPainelZona) { window.abrirPainelZona(0); return true; } return false; }"""
        )
        page.wait_for_timeout(200)
        estados.append(medir_estado(page, f"painel-detalhe-aberto(abriu={abriu})"))
    except Exception as e:
        estados.append({"estado": "painel-detalhe-aberto", "erro": str(e), "total_defeitos": None})

    # 5) seletor de camadas aberto (toggle de layer, se existir)
    try:
        ir_para(page, base_url, layout="central", tela="agora", intro0=True)
        abriu = page.evaluate(
            """() => {
                const btn = document.querySelector('.layer-toggle, [data-layer], .ctrl-group button.chip');
                if (btn) { btn.click(); return true; }
                return false;
            }"""
        )
        page.wait_for_timeout(200)
        estados.append(medir_estado(page, f"seletor-camadas-aberto(clicou={abriu})"))
    except Exception as e:
        estados.append({"estado": "seletor-camadas-aberto", "erro": str(e), "total_defeitos": None})

    # 6) tema claro no central
    try:
        ir_para(page, base_url, layout="central", tema="claro", intro0=True)
        estados.append(medir_estado(page, "tema-claro-central"))
    except Exception as e:
        estados.append({"estado": "tema-claro-central", "erro": str(e), "total_defeitos": None})

    # 7) Modo Historia passos 1..7 (avanca clicando Proximo; clica botoes nos passos 5 e 6)
    try:
        ir_para(page, base_url, historia=True)
        page.wait_for_timeout(300)
        for passo in range(1, 8):
            estados.append(medir_estado(page, f"historia-passo-{passo}"))
            if passo == 5:
                page.evaluate(
                    """() => { const b = document.querySelector('.historia-tipo-btn'); if (b) b.click(); }"""
                )
                page.wait_for_timeout(150)
                estados.append(medir_estado(page, "historia-passo-5-tipo-escolhido"))
            if passo == 6:
                page.evaluate(
                    """() => { const b = document.getElementById('historia-registrar-btn'); if (b) b.click(); }"""
                )
                page.wait_for_timeout(150)
                estados.append(medir_estado(page, "historia-passo-6-registrado"))
            nxt = page.query_selector("#historia-next-btn")
            if nxt:
                nxt.click()
                page.wait_for_timeout(350)
    except Exception as e:
        estados.append({"estado": "historia-passos", "erro": str(e), "total_defeitos": None})

    ctx.close()
    return {"viewport": f"{vw}x{vh}", "erros_js": erros_js, "estados": estados}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", default="http://127.0.0.1:8787/")
    ap.add_argument("--out", default=None)
    ap.add_argument("--viewports", default=None, help="ex: 1362x620,1366x768")
    args = ap.parse_args()

    viewports = VIEWPORTS
    if args.viewports:
        viewports = []
        for par in args.viewports.split(","):
            w, h = par.strip().lower().split("x")
            viewports.append((int(w), int(h)))

    saida = {"gerado_em": time.strftime("%Y-%m-%d %H:%M:%S"), "url": args.url, "viewports": []}

    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        for vw, vh in viewports:
            print(f"[medir-sobreposicao] {vw}x{vh}...", file=sys.stderr)
            r = rodar_viewport(browser, args.url, vw, vh)
            total_vp = sum((e.get("total_defeitos") or 0) for e in r["estados"])
            r["total_defeitos_viewport"] = total_vp
            saida["viewports"].append(r)
            print(f"  total_defeitos={total_vp}", file=sys.stderr)
        browser.close()

    texto = json.dumps(saida, ensure_ascii=False, indent=2)
    if args.out:
        with open(args.out, "w") as f:
            f.write(texto)
        print(f"[medir-sobreposicao] salvo em {args.out}", file=sys.stderr)
    else:
        print(texto)


if __name__ == "__main__":
    main()

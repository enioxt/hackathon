// Barra única do aplicativo: o mesmo cabeçalho, a mesma ordem e a mesma tipografia em todas as telas.
// Uma lista só de destinos (fonte única). Cada tela inclui este arquivo e mais nada.
(function () {
  if (window.self !== window.top) return; // tela embutida (parede dentro do painel) não ganha barra
  if (document.getElementById('vr-barra')) return;
  var estatico = location.protocol === 'file:' || /github\.io$/.test(location.hostname);
  // [rótulo, caminho local, arquivo na cópia estática]
  var ITENS = [
    ['Painel', '/claro', 'painel.html'],
    ['Câmeras', '/parede', 'parede.html'],
    ['Como a máquina conta', '/camadas', 'camadas.html'],
    ['Insights', '/insights', 'insights.html'],
    ['Operador', '/operador', 'operador.html'],
    ['Ajuda', '/ajuda', 'ajuda.html']
  ];
  var p = location.pathname, arq = p.split('/').pop();
  function ativo(it) { return estatico ? arq === it[2] : (p === it[1] || (it[1] === '/claro' && p === '/claro/')); }
  var ALT = 52;

  var css = document.createElement('style');
  css.textContent =
    'html{scroll-padding-top:' + (ALT + 8) + 'px}' +
    'body{padding-top:' + ALT + 'px!important;font-family:Inter,Roboto,-apple-system,"Segoe UI",Arial,sans-serif!important}' +
    '#vr-barra{position:fixed;top:0;left:0;right:0;height:' + ALT + 'px;z-index:8000;display:flex;align-items:center;gap:6px;padding:0 14px;background:#0b2a4a;color:#dbe7fb;box-shadow:0 2px 10px rgba(5,15,30,.25);font:600 14px/1 Inter,Roboto,-apple-system,"Segoe UI",Arial,sans-serif}' +
    '#vr-barra .marca{display:flex;align-items:center;gap:8px;color:#fff;text-decoration:none;font-weight:800;font-size:15px;margin-right:10px;white-space:nowrap}' +
    '#vr-barra .marca i{width:10px;height:10px;border-radius:3px;background:#f5b942;display:inline-block}' +
    '#vr-barra nav{display:flex;gap:2px;overflow-x:auto;scrollbar-width:none;flex:1}' +
    '#vr-barra nav::-webkit-scrollbar{display:none}' +
    '#vr-barra nav a{display:inline-flex;align-items:center;height:36px;padding:0 12px;border-radius:9px;color:#c9d6e6;text-decoration:none;white-space:nowrap}' +
    '#vr-barra nav a:hover{background:rgba(255,255,255,.10);color:#fff}' +
    '#vr-barra nav a[aria-current="page"]{background:#f5b942;color:#0b2a4a}' +
    '#vr-barra .fim{display:flex;gap:6px;align-items:center;margin-left:auto}' +
    '#vr-barra .fim a{display:inline-flex;align-items:center;height:34px;padding:0 12px;border-radius:9px;border:1px solid rgba(255,255,255,.28);color:#fff;text-decoration:none;white-space:nowrap;font-size:13px}' +
    /* o que já era fixo/colante no topo desce a altura da barra */
    '@media(min-width:721px){.sidebar{top:' + ALT + 'px!important;height:calc(100vh - ' + ALT + 'px)!important}}' +
    '@media(max-width:720px){.sidebar{top:' + ALT + 'px!important}}' +
    '.faixa-demo{position:static!important}' +
    '#vr-seletor-visual{display:none!important}' +
    '#vr-tour-btn,.vr-tour-botao,[data-vr-tour-botao]{top:' + (ALT + 10) + 'px!important}' +
    '@media(max-width:720px){#vr-barra .marca span{display:none}#vr-barra .fim .opc{display:none}}';
  document.head.appendChild(css);

  var barra = document.createElement('header'); barra.id = 'vr-barra'; barra.setAttribute('role', 'banner');
  var marca = document.createElement('a'); marca.className = 'marca'; marca.href = estatico ? '../index.html' : '/entrar';
  marca.appendChild(document.createElement('i')); var nm = document.createElement('span'); nm.textContent = 'Visão de Rota'; marca.appendChild(nm);
  var nav = document.createElement('nav'); nav.setAttribute('aria-label', 'Telas do aplicativo');
  ITENS.forEach(function (it) {
    var a = document.createElement('a'); a.textContent = it[0]; a.href = estatico ? it[2] : it[1];
    if (ativo(it)) a.setAttribute('aria-current', 'page');
    nav.appendChild(a);
  });
  var fim = document.createElement('div'); fim.className = 'fim';
  var noClaro = /\/claro\/?$|painel\.html$/.test(p), noCompleto = (!estatico && p === '/') || /painel-gestor\.html$/.test(p);
  if (noClaro || noCompleto) {
    var v = document.createElement('a'); v.className = 'opc';
    v.textContent = noClaro ? 'visual completo' : 'visual claro';
    v.href = noClaro ? (estatico ? 'painel-gestor.html' : '/') : (estatico ? 'painel.html' : '/claro');
    fim.appendChild(v);
  }
  var ap = document.createElement('a'); ap.textContent = 'apresentação'; ap.className = 'opc';
  ap.href = estatico ? '../index.html' : 'https://enioxt.github.io/hackathon/'; fim.appendChild(ap);
  barra.appendChild(marca); barra.appendChild(nav); barra.appendChild(fim);
  function por() { document.body.insertBefore(barra, document.body.firstChild); }
  if (document.body) por(); else document.addEventListener('DOMContentLoaded', por);
})();

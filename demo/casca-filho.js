// casca-filho.js — inclui-se no fim de cada tela do aplicativo.
// Só age quando a própria tela está DENTRO do casco (app.html), identificada por ?casca=1
// e por estar embutida num iframe. Fora dessas duas condições, não faz nada — a tela aberta
// direto continua exatamente como sempre foi.
(function () {
  "use strict";
  var params;
  try { params = new URLSearchParams(location.search); } catch (e) { return; }
  if (params.get("casca") !== "1") return;
  if (window.self === window.top) return;

  document.documentElement.classList.add("na-casca");

  // ---------- esconde só o que é NAVEGAÇÃO/CHROME duplicado do casco ----------
  // Importante: header.topo/header.top NÃO é sempre chrome — em painel-claro/insights/camadas
  // é o título da própria tela (fica dentro de .content) e precisa continuar visível.
  // Por isso a régua aqui é seletor específico (classe de nav) e não "todo <header>".
  var css = document.createElement("style");
  css.textContent = [
    ".na-casca .sidebar{display:none!important}",
    ".na-casca #vr-barra{display:none!important}",
    ".na-casca #vr-seletor-visual{display:none!important}",
    ".na-casca .faixa-demo{display:none!important}",
    ".na-casca #aviso-repro{display:none!important}",
    ".na-casca .selo-topo{display:none!important}",
    // links de "voltar ao painel" — a lateral do casco já cobre essa navegação.
    // Nota: NÃO escondemos [data-local][data-estatico] em bloco — em ajuda.html esse
    // atributo também marca cards de conteúdo reais ("comece por aqui"), só os de nav
    // pura já ficam dentro de .sidebar/header.topo, cobertos pelas regras acima/abaixo.
    ".na-casca a.voltar{display:none!important}",
    ".na-casca a.btn-ghost[href=\"/\"]{display:none!important}",
    // rodapé "A mesma câmera. Outra pergunta." duplica o rodapé da lateral do casco
    ".na-casca footer:has(.rodape-links){display:none!important}",
    // botões flutuantes: o casco já carrega UM melhorias.js e UM tour.js para o aplicativo inteiro
    ".na-casca #vrm-b{display:none!important}",
    ".na-casca #vrm-win{display:none!important}",
    ".na-casca #vrt-barra{display:none!important}",
    ".na-casca #vrt-botao-ligar{display:none!important}",
    ".na-casca #vrt-cartao{display:none!important}",
    ".na-casca body{padding-top:0!important}"
  ].join("\n");
  document.head.appendChild(css);

  // ---------- caso específico: operador.html tem uma barra ESCURA própria no topo,
  // pura navegação (título duplicado + link + relógio), mas os 9 pontinhos de estado
  // dos agentes (#dots) carregam informação real — movemos só eles para dentro do
  // conteúdo, discretos, e escondemos o resto da barra. ----------
  function moverPontinhosOperador() {
    var dots = document.getElementById("dots");
    var corpo = document.querySelector(".corpo");
    var headerTopo = document.querySelector("body > header.topo");
    if (!dots || !corpo || !headerTopo || !headerTopo.contains(dots)) return;
    // o estilo dos pontinhos (.dots/.dot) era escopado a "header.topo .dots" no CSS da própria
    // tela — ao reparentar para fora do header, essa regra deixa de casar; repõe aqui.
    var cssDots = document.createElement("style");
    cssDots.textContent =
      "#vr-pontinhos-discretos .dots{display:flex;gap:5px;align-items:center}" +
      "#vr-pontinhos-discretos .dot{width:9px;height:9px;border-radius:50%;background:#5f7699;border:1px solid rgba(0,0,0,.12);cursor:default}" +
      "#vr-pontinhos-discretos .dot.ativo{background:#1f9d55}" +
      "#vr-pontinhos-discretos .dot.com-erro{background:#e2a129}";
    document.head.appendChild(cssDots);

    var faixa = document.createElement("div");
    faixa.id = "vr-pontinhos-discretos";
    faixa.style.cssText = "display:flex;align-items:center;gap:8px;padding:6px 16px;font-size:11px;color:#5c6b82;flex:none";
    var rotulo = document.createElement("span");
    rotulo.textContent = "estado dos agentes:";
    rotulo.style.fontWeight = "600";
    faixa.appendChild(rotulo);
    faixa.appendChild(dots); // reparent — mantém o nó vivo, quem já o atualiza continua funcionando
    corpo.parentNode.insertBefore(faixa, corpo);
    headerTopo.style.display = "none";
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", moverPontinhosOperador);
  } else {
    moverPontinhosOperador();
  }

  function origemAlvo() {
    return location.protocol === "file:" ? "*" : location.origin;
  }

  // ---------- avisa o casco do título/hash atual ----------
  function avisar() {
    try {
      parent.postMessage({ tipo: "vr-filho", titulo: document.title, hash: location.hash }, origemAlvo());
    } catch (e) {}
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", avisar);
  } else {
    avisar();
  }
  window.addEventListener("hashchange", avisar);

  // ---------- intercepta links internos para outras telas do aplicativo ----------
  // cada entrada: chave do destino no casco + padrões de caminho/arquivo que apontam para ela
  var ROTAS = [
    { destino: "geral",          padroes: [/\/claro\/?$/, /painel\.html$/, /painel-claro\.html$/] },
    { destino: "cameras",        padroes: [/\/parede\/?$/, /parede\.html$/] },
    { destino: "camadas",        padroes: [/\/camadas\/?$/, /camadas\.html$/] },
    { destino: "insights",       padroes: [/\/insights\/?$/, /insights\.html$/] },
    { destino: "operador",       padroes: [/\/operador\/?$/, /operador\.html$/] },
    { destino: "ajuda",          padroes: [/\/ajuda\/?$/, /ajuda\.html$/] },
    { destino: "participacao",   padroes: [/\/participacao\/?$/, /participacao\.html$/] },
    { destino: "agentes",        padroes: [/\/observabilidade\/?$/, /observabilidade\.html$/] }
  ];

  function achaDestino(pathname) {
    for (var i = 0; i < ROTAS.length; i++) {
      var r = ROTAS[i];
      for (var j = 0; j < r.padroes.length; j++) {
        if (r.padroes[j].test(pathname)) return r.destino;
      }
    }
    return null;
  }

  document.addEventListener("click", function (ev) {
    if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
    var a = ev.target && ev.target.closest ? ev.target.closest("a[href]") : null;
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
    var href = a.getAttribute("href") || "";
    if (!href || href.charAt(0) === "#") return;
    var url;
    try { url = new URL(href, location.href); } catch (e) { return; }
    if (url.origin !== location.origin && location.protocol !== "file:") return;
    if (location.protocol === "file:" && url.protocol !== "file:") return;

    var destino = achaDestino(url.pathname);
    if (!destino) return;

    var query = "";
    if (url.search && /^\?[a-z]+=\d{1,3}$/.test(url.search)) query = url.search;

    ev.preventDefault();
    try {
      parent.postMessage({ tipo: "vr-navegar", destino: destino, query: query }, origemAlvo());
    } catch (e) {}
  }, true);
})();

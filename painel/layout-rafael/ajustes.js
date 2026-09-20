// Camada do time sobre o painel do Rafael (V2.2). Os arquivos dele ficam intactos em original/;
// aqui só (1) ligamos o painel ao nosso motor, (2) dizemos a origem de cada número,
// (3) mostramos como "pronta para ligar" a fonte que ainda não está ligada, (4) tiramos nome de via.
(() => {
  // (1) liga a ponte local se a pessoa ainda não configurou nada na engrenagem
  try {
    if (!localStorage.getItem('mobilityConfig') && /^(127\.0\.0\.1|localhost)$/.test(location.hostname)) {
      localStorage.setItem('mobilityConfig', JSON.stringify({ googleMapsApiKey: '', cameraStreamUrl: '',
        heatApiUrl: 'http://127.0.0.1:8790/heat', analyticsWebSocketUrl: 'ws://127.0.0.1:8790/analytics' }));
    }
  } catch (e) { console.error('[ajustes] sem localStorage:', e); }

  const TROCAS = [
    [/Av\. Major Gote\s*[×x]\s*Olegário Maciel/gi, 'Ponto 7 — Corredor A'], [/Avenida Major Gote|Av\. Major Gote/gi, 'Corredor A'],
    [/Av\. JK/gi, 'Corredor B'], [/Av\. Fátima Porto/gi, 'Corredor C'], [/Terminal Rodoviário/gi, 'Ponto 2 — terminal'],
    [/Olegário Maciel/gi, 'Corredor A'], [/ALERTAS EM TEMPO REAL/g, 'ALERTAS RECENTES'], [/em tempo real/gi, 'na última leitura'],
    [/Fluxo em tempo real/gi, 'Fluxo na última leitura'], [/AO VIVO/g, 'ÚLTIMA LEITURA'], [/Leitura ao vivo/gi, 'Última leitura'], [/ao vivo/gi, 'na última leitura'],
    [/Zona Azul/g, 'Estacionamento rotativo'],
  ];
  function trocarTexto(raiz) {
    const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) { let t = n.nodeValue; for (const [de, para] of TROCAS) t = t.replace(de, para); if (t !== n.nodeValue) n.nodeValue = t; }
    raiz.querySelectorAll?.('input[value]').forEach(i => { for (const [de, para] of TROCAS) i.value = i.value.replace(de, para); });
  }
  function etiqueta(txt, cor) {
    const s = document.createElement('span'); s.className = 'vr-etq'; s.textContent = txt;
    s.style.cssText = `display:inline-block;margin-left:8px;padding:2px 7px;border-radius:999px;font:700 10px/1.4 system-ui,sans-serif;letter-spacing:.04em;vertical-align:middle;color:#fff;background:${cor}`;
    return s;
  }
  const COR = { medido: '#16ae5e', sintetico: '#7a8ba0', simulacao: '#f59a21' };
  const NOME = { medido: 'MEDIDO', sintetico: 'DADO DE DEMONSTRAÇÃO', simulacao: 'SIMULAÇÃO' };

  document.addEventListener('DOMContentLoaded', () => {
    // faixa de aviso
    const f = document.createElement('div');
    f.textContent = 'Demonstração — os números desta tela mostram o funcionamento. O sistema analisa vídeo já gravado, com atraso; não transmite imagem e não guarda rosto nem placa.';
    f.style.cssText = 'position:sticky;top:0;z-index:50;background:#fff6e0;color:#5b4300;border-bottom:1px solid #f0d48a;font:600 13px system-ui,sans-serif;padding:6px 14px;text-align:center';
    document.body.prepend(f);
    // (3) fontes: só câmera está ligada (em demonstração)
    document.querySelectorAll('#sourceRow .source-card').forEach((c, i) => {
      const sm = c.querySelector('small'); if (!sm) return;
      if (i === 0) { sm.lastChild.textContent = 'demonstração'; return; }
      sm.innerHTML = '<i style="background:#b8c4d0"></i>pronta para ligar'; c.style.opacity = '.62';
      c.title = 'A porta de entrada já aceita este dado; falta a cidade ligar.';
    });
    // (2) etiqueta em cada número grande
    document.querySelectorAll('.kpi-card strong').forEach(st => { if (/\d/.test(st.textContent)) st.parentElement.appendChild(etiqueta(NOME.sintetico, COR.sintetico)).dataset.vr = 'kpi'; });
    trocarTexto(document.body);
    // o que o app do Rafael escrever depois (título, avisos, janelas) também passa pela troca
    new MutationObserver(ms => ms.forEach(m => { m.addedNodes.forEach(n => n.nodeType === 1 ? trocarTexto(n) : n.nodeType === 3 && trocarTexto(n.parentNode)); if (m.type === 'characterData') trocarTexto(m.target.parentNode); }))
      .observe(document.body, { childList: true, subtree: true, characterData: true });
  });

  // quando a ponte manda leitura, a etiqueta do detalhe passa a dizer a origem real daquele número
  const WS = window.WebSocket;
  window.WebSocket = function (url, p) {
    const ws = p ? new WS(url, p) : new WS(url);
    ws.addEventListener('message', e => { try { const d = JSON.parse(e.data); if (!d.origem) return;
      document.querySelectorAll('.detail-kpis .vr-etq').forEach((q, i) => { if (i === 0 || (i === 1 && d.metrics?.queue != null)) { q.textContent = NOME[d.origem] || d.origem.toUpperCase(); q.style.background = COR[d.origem] || COR.sintetico; q.title = `câmera ${d.camera_id} · ${d.ts}`; } });
    } catch (_) {} });
    return ws;
  };
  window.WebSocket.prototype = WS.prototype; Object.assign(window.WebSocket, { CONNECTING: 0, OPEN: 1, CLOSING: 2, CLOSED: 3 });
})();

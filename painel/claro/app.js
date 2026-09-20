(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const baseConfig = window.MOBILITY_CONFIG || {};
  const saved = JSON.parse(localStorage.getItem('mobilityConfig') || '{}');
  const cfg = Object.assign({}, baseConfig, saved);

  let googleMap = null;
  let trafficLayer = null;
  let heatOverlay = null;
  let heatTimer = null;
  let analyticsSocket = null;
  let hlsInstance = null;

  const points = [
    {name:'Av. Major Gote × Olegário Maciel', lat:-18.5873, lng:-46.5140, status:'critical'},
    {name:'Av. JK', lat:-18.5754, lng:-46.5291, status:'critical'},
    {name:'Centro', lat:-18.5785, lng:-46.5183, status:'attention'},
    {name:'Terminal Rodoviário', lat:-18.5706, lng:-46.5078, status:'attention'},
    {name:'Av. Fátima Porto', lat:-18.5890, lng:-46.5260, status:'normal'}
  ];

  function toast(msg){
    const el = $('#toast'); el.textContent = msg; el.classList.add('show');
    clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), 3300);
  }

  function updateClock(){
    const d = new Date();
    $('#currentDate').textContent = d.toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'}).replace('.','');
    $('#currentTime').textContent = d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
  }
  updateClock(); setInterval(updateClock, 10000);

  function setPage(page){
    $$('.page').forEach(p => p.classList.remove('active'));
    $$('.nav-link').forEach(n => n.classList.remove('active'));
    if(page === 'detail'){
      $('#detailPage').classList.add('active');
      $('[data-page="detail"]').classList.add('active');
      $('#pageTitle').textContent = 'DETALHE DO PONTO — AV. MAJOR GOTE × OLEGÁRIO MACIEL';
      $('#pageSubtitle').textContent = 'Análise operacional, histórico e apoio à decisão';
      requestAnimationFrame(drawAllCharts);
    } else {
      $('#overviewPage').classList.add('active');
      $('[data-page="overview"]').classList.add('active');
      $('#pageTitle').textContent = 'INTELIGÊNCIA DE MOBILIDADE — PATOS DE MINAS';
      $('#pageSubtitle').textContent = 'Plataforma de inteligência para decisão urbana';
      requestAnimationFrame(drawAllCharts);
      if(googleMap) setTimeout(() => google.maps.event.trigger(googleMap,'resize'), 50);
    }
  }

  $$('[data-page]').forEach(b => b.addEventListener('click', () => setPage(b.dataset.page)));
  $$('[data-open-detail]').forEach(b => b.addEventListener('click', () => setPage('detail')));
  $$('.alert[data-point="major"], .alert[data-point="jk"]').forEach(b => b.addEventListener('click', () => setPage('detail')));
  $('[data-action="focus-map"]').addEventListener('click', () => { setPage('overview'); setTimeout(() => $('#mapPanel').scrollIntoView({behavior:'smooth',block:'center'}),100); });
  $$('[data-module]').forEach(b => b.addEventListener('click', () => toast(`${b.dataset.module}: módulo preparado para a próxima etapa do MVP.`)));

  const modal = $('#modal');
  function openModal(title, html){ $('#modalTitle').textContent = title; $('#modalBody').innerHTML = html; modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); }
  function closeModal(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }
  $('#modalClose').addEventListener('click', closeModal); modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });

  function openSimulation(){
    openModal('Simulação de cenário — Av. Major Gote', `
      <div class="help"><b>SIMULAÇÃO / PROJEÇÃO.</b> Esta ação não altera semáforos reais. Ela demonstra o fluxo problema → hipótese → cenário → decisão humana.</div>
      <div class="sim-grid">
        <div class="sim-card"><small>Espera média atual</small><strong>74 s</strong></div>
        <div class="sim-card"><small>Espera projetada</small><strong>53 s</strong></div>
        <div class="sim-card"><small>Fila média atual</small><strong>27 veículos</strong></div>
        <div class="sim-card"><small>Fila projetada</small><strong>19 veículos</strong></div>
      </div>
      <div class="projection"><b>Projeção:</b> ampliar o verde em 8 s no eixo Centro → Bairro pode reduzir a espera em aproximadamente 28%, mantidas as condições do cenário.</div>
      <div style="margin-top:12px"><button class="btn dark" id="saveHypothesis">Registrar hipótese</button></div>`);
    setTimeout(() => $('#saveHypothesis')?.addEventListener('click', () => { toast('Hipótese registrada no protótipo.'); closeModal(); }),0);
  }
  $$('[data-simulate]').forEach(b => b.addEventListener('click', openSimulation));

  function openRegister(){
    openModal('Registrar intervenção humana', `
      <div class="help">A intervenção fica vinculada ao ponto, ao problema, à hipótese e aos indicadores de referência para permitir comparação antes × depois.</div>
      <div class="form-grid">
        <label>Local<input value="Av. Major Gote × Olegário Maciel"></label>
        <label>Responsável<input placeholder="Nome do responsável"></label>
        <label>Data<input type="date" value="${new Date().toISOString().slice(0,10)}"></label>
        <label>Tipo<select><option>Ajuste semafórico</option><option>Sinalização</option><option>Operação de trânsito</option></select></label>
        <label class="full">Problema<textarea>Fila e tempo de espera acima do padrão para o mesmo dia e horário.</textarea></label>
        <label class="full">Hipótese<textarea>Ampliar o tempo de verde no sentido Centro → Bairro para reduzir fila e espera.</textarea></label>
      </div>
      <div style="margin-top:12px"><button class="btn dark" id="saveIntervention">Salvar intervenção</button></div>`);
    setTimeout(() => $('#saveIntervention')?.addEventListener('click', () => { toast('Intervenção registrada no protótipo.'); closeModal(); }),0);
  }
  $$('[data-register]').forEach(b => b.addEventListener('click', openRegister));
  $$('[data-analysis]').forEach(b => b.addEventListener('click', () => toast('Análise aberta: alerta explicado por fluxo, fila, espera e histórico compatível.')));
  $('#allAlertsBtn').addEventListener('click', () => toast('Exibindo os alertas prioritários do protótipo.'));

  function settingsHtml(){
    return `
      <div class="help"><b>Integrações reais.</b> A chave do Google e os URLs ficam apenas no seu navegador (localStorage). Não envie uma chave irrestrita para outras pessoas.</div>
      <div class="form-grid">
        <label class="full">Google Maps API Key<input id="cfgGoogleKey" value="${escapeHtml(cfg.googleMapsApiKey||'')}" placeholder="AIza..."></label>
        <label class="full">Stream da câmera (HLS .m3u8 ou MP4/WebM)<input id="cfgCamera" value="${escapeHtml(cfg.cameraStreamUrl||'')}" placeholder="https://servidor/camera.m3u8"></label>
        <label class="full">API de pontos para zona de calor<input id="cfgHeat" value="${escapeHtml(cfg.heatApiUrl||'')}" placeholder="https://api.exemplo/heat-points"></label>
        <label class="full">WebSocket de analytics da câmera<input id="cfgWs" value="${escapeHtml(cfg.analyticsWebSocketUrl||'')}" placeholder="wss://servidor/analytics"></label>
      </div>
      <p class="settings-note">Formato esperado da zona de calor: JSON [{"lat":-18.58,"lng":-46.52,"weight":0.8}]. O Google TrafficLayer mostra trânsito atual; ele não fornece diretamente uma matriz de calor exportável.</p>
      <div style="display:flex;gap:8px;margin-top:12px"><button class="btn dark" id="saveConfig">Salvar e recarregar</button><button class="btn" id="clearConfig">Limpar integrações</button></div>`;
  }
  $('#settingsBtn').addEventListener('click', () => {
    openModal('Configurar integrações reais', settingsHtml());
    setTimeout(() => {
      $('#saveConfig')?.addEventListener('click', () => {
        const newCfg = {
          googleMapsApiKey: $('#cfgGoogleKey').value.trim(), cameraStreamUrl: $('#cfgCamera').value.trim(),
          heatApiUrl: $('#cfgHeat').value.trim(), analyticsWebSocketUrl: $('#cfgWs').value.trim()
        };
        localStorage.setItem('mobilityConfig', JSON.stringify(newCfg)); location.reload();
      });
      $('#clearConfig')?.addEventListener('click', () => { localStorage.removeItem('mobilityConfig'); location.reload(); });
    },0);
  });
  function escapeHtml(v){ return String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

  // ---------- Charts ----------
  const charts = {
    ovFlow:{type:'line',color:'#168be0',data:[3,4,5.5,7.2,8.8,10.5,9.6,11.4,10.2,12.2,10.8,11.6,9.7,10.6,11.2,10.1,11.7,10.9]},
    ovTime:{type:'line',color:'#1bb566',data:[10,12,14,12,17,15,18,13,16,17,14,18,16,15,17,14,13,16]},
    ovVehicles:{type:'bar',color:'#2c8cdf',data:[3,5,6,8,11,13,9,10,12,11,9,7]},
    ovCompare:{type:'groupbar',color:'#318fe0',data:[[32,18],[28,16],[24,14]]},
    dtFlow:{type:'line',color:'#168be0',data:[300,420,380,520,610,720,890,610,670,520,610,700,650,760,690,790,750]},
    dtQueue:{type:'line',color:'#f33849',data:[11,15,18,22,25,27,22,18,16,20,15,21,24,18,22,17]},
    dtWait:{type:'line',color:'#f59a21',data:[55,65,62,78,70,90,82,74,60,58,70,62,75,68,76,71]},
    dtSpeed:{type:'line',color:'#16ae5e',data:[31,34,30,33,27,25,21,14,18,17,15,14,16,15,14,13]},
    dtPattern:{type:'groupbar',color:'#2a8cdf',data:[[12,17],[20,23],[28,30],[35,24],[42,29],[38,31],[45,30],[39,28],[34,27],[29,24],[24,22],[18,19]]}
  };

  function prepCanvas(canvas){
    if(!canvas || !canvas.offsetWidth) return null;
    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(1,canvas.clientWidth), h = Math.max(1,canvas.clientHeight);
    canvas.width = w*dpr; canvas.height = h*dpr;
    const ctx = canvas.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,w,h);
    return {ctx,w,h};
  }
  function grid(ctx,w,h){ ctx.strokeStyle='#e6eef4';ctx.lineWidth=1;for(let i=1;i<4;i++){let y=8+i*(h-20)/4;ctx.beginPath();ctx.moveTo(5,y);ctx.lineTo(w-5,y);ctx.stroke();} }
  function drawLine(canvas, data, color){
    const p=prepCanvas(canvas); if(!p)return; const {ctx,w,h}=p; grid(ctx,w,h); const max=Math.max(...data)*1.12,min=0; const pad=7;
    ctx.beginPath(); data.forEach((v,i)=>{const x=pad+i*(w-2*pad)/(data.length-1),y=h-pad-(v-min)/(max-min)*(h-2*pad); i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.strokeStyle=color;ctx.lineWidth=2.2;ctx.stroke();
    ctx.lineTo(w-pad,h-pad);ctx.lineTo(pad,h-pad);ctx.closePath();const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,color+'28');g.addColorStop(1,color+'00');ctx.fillStyle=g;ctx.fill();
    const idx=Math.min(6,data.length-1),x=pad+idx*(w-2*pad)/(data.length-1),y=h-pad-data[idx]/max*(h-2*pad);ctx.setLineDash([3,3]);ctx.strokeStyle='#94a8b9';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,h-pad);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fill();
  }
  function drawBar(canvas,data,color){const p=prepCanvas(canvas);if(!p)return;const{ctx,w,h}=p;grid(ctx,w,h);const max=Math.max(...data)*1.1;const gap=4,bw=(w-14-(data.length-1)*gap)/data.length;data.forEach((v,i)=>{const bh=v/max*(h-18);ctx.fillStyle=color;ctx.fillRect(7+i*(bw+gap),h-7-bh,bw,bh)});}
  function drawGroupBar(canvas,data){const p=prepCanvas(canvas);if(!p)return;const{ctx,w,h}=p;grid(ctx,w,h);const flat=data.flat(),max=Math.max(...flat)*1.12;const groups=data.length;const gw=(w-14)/groups;data.forEach((pair,i)=>{const bw=Math.min(15,(gw-12)/2);pair.forEach((v,j)=>{const bh=v/max*(h-18);ctx.fillStyle=j?'#2b8fe0':'#9db0c1';ctx.fillRect(7+i*gw+j*(bw+3)+gw*.16,h-7-bh,bw,bh)});});}
  function drawAllCharts(){ Object.entries(charts).forEach(([id,c]) => {const cv=$('#'+id); if(!cv)return; c.type==='line'?drawLine(cv,c.data,c.color):c.type==='bar'?drawBar(cv,c.data,c.color):drawGroupBar(cv,c.data);}); }
  drawAllCharts(); window.addEventListener('resize', () => {clearTimeout(window._chartResize);window._chartResize=setTimeout(drawAllCharts,150)});

  // ---------- Google Maps ----------
  function loadGoogleMaps(){
    if(!cfg.googleMapsApiKey){
      $('#mapLiveBadge').textContent='DEMO VISUAL • CONFIGURE GOOGLE MAPS';
      return;
    }
    window.__initMobilityGoogleMap = initGoogleMap;
    const s=document.createElement('script');
    s.src=`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(cfg.googleMapsApiKey)}&v=weekly&callback=__initMobilityGoogleMap`;
    s.async=true;s.defer=true;s.onerror=()=>toast('Não foi possível carregar o Google Maps. Verifique a chave e as restrições.');document.head.appendChild(s);
  }
  window.__initMobilityGoogleMap = () => {};
  function initGoogleMap(){
    try{
      const center = cfg.defaultCenter || {lat:-18.5789,lng:-46.518};
      googleMap = new google.maps.Map($('#googleMap'), {center,zoom:cfg.defaultZoom||14,mapTypeControl:false,streetViewControl:false,fullscreenControl:false,styles:[{featureType:'poi.business',stylers:[{visibility:'off'}]}]});
      trafficLayer = new google.maps.TrafficLayer(); trafficLayer.setMap(googleMap);
      $('#googleMap').style.display='block'; $('#mapFallback').style.display='none'; $('#mapLiveBadge').textContent='TRÂNSITO GOOGLE • AO VIVO';
      points.forEach(p => {
        const m = new google.maps.Marker({map:googleMap,position:{lat:p.lat,lng:p.lng},title:p.name,label:p.status==='critical'?'!':p.status==='attention'?'•':'✓'});
        m.addListener('click',()=>{ if(p.name.includes('Major')) setPage('detail'); else toast(p.name); });
      });
      if(cfg.heatApiUrl) refreshHeatPoints();
    }catch(e){ console.error(e); toast('Erro ao iniciar Google Maps.'); }
  }
  $('#trafficToggle').addEventListener('click', () => {
    if(!googleMap){toast('Configure a chave do Google Maps para usar o trânsito atual.');return;}
    $('#trafficToggle').classList.add('active'); $('#heatToggle').classList.remove('active');
    if(heatOverlay){heatOverlay.setMap(null);heatOverlay=null;} trafficLayer.setMap(googleMap); $('#mapLiveBadge').textContent='TRÂNSITO GOOGLE • AO VIVO';
  });
  $('#heatToggle').addEventListener('click', async () => {
    if(!googleMap){toast('Configure o Google Maps primeiro.');return;}
    if(!cfg.heatApiUrl){toast('Zona de calor real precisa de uma API de pontos. Configure o endpoint nas integrações.');return;}
    $('#heatToggle').classList.add('active'); $('#trafficToggle').classList.remove('active'); trafficLayer.setMap(null); await refreshHeatPoints(); $('#mapLiveBadge').textContent='ZONA DE CALOR • FONTE EXTERNA';
  });

  class CanvasHeatOverlay {
    constructor(map, pts){this.points=pts||[];this.map=map;this.div=null;this.canvas=null;this.setMap(map)}
    onAdd(){this.div=document.createElement('div');this.div.style.position='absolute';this.canvas=document.createElement('canvas');this.div.appendChild(this.canvas);this.getPanes().overlayLayer.appendChild(this.div)}
    draw(){if(!this.div)return;const mapDiv=this.map.getDiv(),w=mapDiv.clientWidth,h=mapDiv.clientHeight;this.div.style.left='0';this.div.style.top='0';this.div.style.width=w+'px';this.div.style.height=h+'px';const dpr=window.devicePixelRatio||1;this.canvas.width=w*dpr;this.canvas.height=h*dpr;this.canvas.style.width=w+'px';this.canvas.style.height=h+'px';const ctx=this.canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);const proj=this.getProjection();if(!proj)return;ctx.globalCompositeOperation='lighter';this.points.forEach(p=>{const xy=proj.fromLatLngToDivPixel(new google.maps.LatLng(+p.lat,+p.lng));if(!xy)return;const r=28+Math.min(1,+p.weight||.5)*36;const g=ctx.createRadialGradient(xy.x,xy.y,0,xy.x,xy.y,r);g.addColorStop(0,'rgba(255,35,50,.52)');g.addColorStop(.35,'rgba(255,140,0,.35)');g.addColorStop(.7,'rgba(255,225,0,.22)');g.addColorStop(1,'rgba(0,180,80,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(xy.x,xy.y,r,0,Math.PI*2);ctx.fill();});}
    onRemove(){this.div?.remove();this.div=null;this.canvas=null}
    setPoints(p){this.points=p||[];this.draw()}
  }
  function ensureHeatOverlayClass(){ if(window.google && google.maps && !(CanvasHeatOverlay.prototype instanceof google.maps.OverlayView)){ Object.setPrototypeOf(CanvasHeatOverlay.prototype, google.maps.OverlayView.prototype); Object.setPrototypeOf(CanvasHeatOverlay, google.maps.OverlayView); } }
  async function refreshHeatPoints(){
    try{
      const r=await fetch(cfg.heatApiUrl,{cache:'no-store'});if(!r.ok)throw new Error('HTTP '+r.status);const data=await r.json();if(!Array.isArray(data))throw new Error('JSON precisa ser array');ensureHeatOverlayClass();
      if(!heatOverlay) heatOverlay=new CanvasHeatOverlay(googleMap,data); else heatOverlay.setPoints(data);
      if(!heatTimer) heatTimer=setInterval(refreshHeatPoints,Math.max(10,cfg.refreshHeatSeconds||30)*1000);
    }catch(e){console.error(e);toast('Não foi possível carregar a zona de calor real. Verifique o endpoint e CORS.');}
  }
  loadGoogleMaps();

  // ---------- Camera / HLS / analytics ----------
  async function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s)});}
  async function setupCamera(){
    const video=$('#liveVideo'), fallback=$('#cameraFallback');
    if(!cfg.cameraStreamUrl){ $('#monitorBadge').textContent='DEMO VISUAL • CONFIGURE STREAM'; $('#camSourceStatus').textContent='Demo'; $$('.vehicle-box, .flow-box, .camera-status').forEach(el=>el.style.display='none'); return; }
    $$('.vehicle-box, .flow-box, .camera-status').forEach(el=>el.style.display='block');
    const url=cfg.cameraStreamUrl;
    if(/^rtsp:\/\//i.test(url)){ $('#monitorBadge').textContent='RTSP REQUER GATEWAY HLS/WEBRTC'; $('#cameraLiveText').textContent='RTSP não toca direto no navegador'; toast('Use um gateway para converter RTSP em HLS ou WebRTC.'); return; }
    try{
      if(/\.m3u8($|\?)/i.test(url)){
        if(video.canPlayType('application/vnd.apple.mpegurl')) video.src=url;
        else { await loadScript('https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js'); if(!window.Hls?.isSupported()) throw new Error('HLS não suportado'); hlsInstance=new Hls({lowLatencyMode:true});hlsInstance.loadSource(url);hlsInstance.attachMedia(video); }
      } else video.src=url;
      video.style.display='block'; fallback.style.display='none'; await video.play().catch(()=>{});
      $('#monitorBadge').textContent='VÍDEO REAL • AO VIVO'; $('#cameraLiveText').textContent='Leitura ao vivo'; $('#camSourceStatus').textContent='Ao vivo';
      if(!cfg.analyticsWebSocketUrl) clearDemoDetections();
    }catch(e){console.error(e);toast('Não foi possível carregar o stream da câmera. Verifique URL, CORS e formato.');$('#monitorBadge').textContent='FALHA NO STREAM • DEMO VISUAL';}
  }
  function clearDemoDetections(){ const c=$('#detectionCanvas');const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height); }
  function setupAnalytics(){
    if(!cfg.analyticsWebSocketUrl)return;
    try{
      analyticsSocket=new WebSocket(cfg.analyticsWebSocketUrl);
      analyticsSocket.onopen=()=>toast('Analytics da câmera conectado.');
      analyticsSocket.onmessage=e=>{try{applyAnalytics(JSON.parse(e.data))}catch(err){console.error(err)}};
      analyticsSocket.onerror=()=>toast('Falha no WebSocket de analytics.');
    }catch(e){console.error(e)}
  }
  function applyAnalytics(d){
    const c=d.counts||{}; if(c.cars!=null)$('#countCars').textContent=c.cars;if(c.motos!=null)$('#countMotos').textContent=c.motos;if(c.buses!=null)$('#countBuses').textContent=c.buses;if(c.trucks!=null)$('#countTrucks').textContent=c.trucks;
    const total=['cars','motos','buses','trucks'].reduce((s,k)=>s+(+c[k]||0),0);if(total)$('#countTotal').textContent=total;
    if(d.flow){if(d.flow.outbound!=null)$('#flowOut').textContent=d.flow.outbound;if(d.flow.inbound!=null)$('#flowIn').textContent=d.flow.inbound;}
    if(d.occupancy!=null){$('#occupancyText').textContent=Math.round(d.occupancy)+'%';$('#occupancyBar').style.width=Math.max(0,Math.min(100,d.occupancy))+'%';}
    if(d.metrics){if(d.metrics.flow!=null)$('#detailFlowValue').textContent=d.metrics.flow;if(d.metrics.queue!=null)$('#detailQueueValue').textContent=d.metrics.queue;if(d.metrics.waitSeconds!=null)$('#detailWaitValue').textContent=d.metrics.waitSeconds;}
    drawDetections(d.boxes||[]);
  }
  function drawDetections(boxes){
    const stage=$('#monitorStage'),canvas=$('#detectionCanvas');const dpr=window.devicePixelRatio||1;const w=stage.clientWidth,h=stage.clientHeight;canvas.width=w*dpr;canvas.height=h*dpr;const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);ctx.lineWidth=2;ctx.font='11px Arial';
    boxes.forEach(b=>{const x=(+b.x||0)*w,y=(+b.y||0)*h,bw=(+b.w||0)*w,bh=(+b.h||0)*h,color=b.color||'#26d268';ctx.strokeStyle=color;ctx.strokeRect(x,y,bw,bh);const label=b.label||'Objeto';const tw=ctx.measureText(label).width+10;ctx.fillStyle=color;ctx.fillRect(x,y-16,tw,16);ctx.fillStyle='#fff';ctx.fillText(label,x+5,y-4)});
  }
  setupCamera(); setupAnalytics();

  // Demo detection boxes drawn only while fallback image is visible.
  function drawDemoBoxes(){
    if(cfg.cameraStreamUrl || cfg.analyticsWebSocketUrl) return;
    const stage=$('#monitorStage'),canvas=$('#detectionCanvas');const dpr=window.devicePixelRatio||1;const w=stage.clientWidth,h=stage.clientHeight;canvas.width=w*dpr;canvas.height=h*dpr;const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    // fallback image already contains its own boxes; no extra overlay required
  }
  drawDemoBoxes(); window.addEventListener('resize',drawDemoBoxes);

  $('#mapSearch').addEventListener('keydown', e => { if(e.key==='Enter'){ const q=e.target.value.trim(); if(!q)return; if(googleMap){ toast(`Busca digitada: ${q}. Para autocomplete real, ative a Places API em uma próxima etapa.`); } else toast('Configure Google Maps para busca geográfica real.'); }});
})();

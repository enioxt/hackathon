(function(){
const css=`#vrChat{position:fixed;right:18px;bottom:18px;width:400px;max-width:calc(100vw - 36px);height:560px;max-height:calc(100vh - 36px);background:#12273B;color:#F6F8FA;border:1px solid #27425c;border-radius:14px;display:flex;flex-direction:column;font:14px/1.45 system-ui,sans-serif;z-index:99999;box-shadow:0 10px 40px rgba(0,0,0,.5)}
#vrChat.min{height:48px;overflow:hidden}#vrChat header{padding:12px 14px;border-bottom:1px solid #27425c;display:flex;justify-content:space-between;align-items:center;cursor:pointer}#vrChat header b{font-size:15px}
#vrChat .st{font-size:11.5px;color:#9AA5B1;padding:6px 14px;border-bottom:1px solid #27425c}#vrChat .st i{display:inline-block;width:8px;height:8px;border-radius:50%;background:#9AA5B1;margin-right:6px}#vrChat .st.on i{background:#2E9E6B}
#vrLog{flex:1;overflow:auto;padding:12px 14px;display:flex;flex-direction:column;gap:8px}.vrM{padding:9px 12px;border-radius:12px;white-space:pre-wrap;max-width:92%}.vrM.eu{align-self:flex-end;background:#E8A33D;color:#111}.vrM.ia{background:#0B1B2B;border:1px solid #27425c}.vrM.ac{font-size:12px;color:#9AA5B1;background:none;padding:0 4px}
#vrChat form{display:flex;gap:8px;padding:10px;border-top:1px solid #27425c}#vrChat input{flex:1;background:#0B1B2B;border:1px solid #27425c;border-radius:10px;color:#F6F8FA;padding:10px}#vrChat button{background:#E8A33D;border:0;border-radius:10px;padding:0 14px;font-weight:700;cursor:pointer}
.vrSug{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 8px}.vrSug span{font-size:12px;border:1px solid #27425c;border-radius:999px;padding:4px 10px;cursor:pointer;color:#cdd6df}`;
const st=document.createElement('style');st.textContent=css;document.head.append(st);
const box=document.createElement('div');box.id='vrChat';box.innerHTML=`<header><b>Pergunte ao centro de controle</b><span id=vrMin>—</span></header><div class=st id=vrSt><i></i>assistente parado · responde lendo os arquivos desta demonstração</div><div id=vrLog></div><div class=vrSug></div><form><input placeholder="Pergunte sobre os dados…" autocomplete=off><button>Enviar</button></form>`;
document.body.append(box);if(location.pathname!=='/')box.classList.add('min');else{const a=document.createElement('a');a.href='/custos';a.textContent='Quanto custa a central →';a.style.cssText='position:fixed;left:18px;bottom:64px;background:#E8A33D;color:#111;font:600 13px system-ui;padding:9px 14px;border-radius:10px;text-decoration:none;z-index:99998';document.body.append(a);box.classList.add('min');}
const log=box.querySelector('#vrLog'),stt=box.querySelector('#vrSt'),inp=box.querySelector('input'),sug=box.querySelector('.vrSug');
box.querySelector('header').onclick=()=>box.classList.toggle('min');
function add(c,t){const d=document.createElement('div');d.className='vrM '+c;d.textContent=t;log.append(d);log.scrollTop=log.scrollHeight;return d;}
['Quantas ocorrências graves ou fatais temos e de onde vem o dado?','Com 100 câmeras, quanto das ocorrências fica coberto? É medido ou simulação?','O que já está conectado e o que falta?','Quem já atua na cidade com semáforo e câmera?'].forEach(q=>{const s=document.createElement('span');s.textContent=q;s.onclick=()=>{inp.value=q;box.querySelector('form').requestSubmit();};sug.append(s);});
add('ia','Sou o assistente do centro de controle. Respondo só com o que leio agora nos arquivos desta demonstração, e digo o que é medido e o que é simulação.');
box.querySelector('form').onsubmit=async e=>{e.preventDefault();const msg=inp.value.trim();if(!msg)return;inp.value='';add('eu',msg);
 try{const r=await fetch('/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({msg})});if(!r.ok){add('ia','⚪ '+await r.text());return;}
 const rd=r.body.getReader(),dec=new TextDecoder();let buf='';for(;;){const {value,done}=await rd.read();if(done)break;buf+=dec.decode(value,{stream:true});const ps=buf.split('\n\n');buf=ps.pop();
  for(const p of ps){if(!p.startsWith('data: '))continue;const ev=JSON.parse(p.slice(6));
   if(ev.tipo==='inicio'){stt.className='st on';stt.innerHTML='<i></i>processo '+ev.pid+' ativo · '+ev.modelo+' · sessão '+ev.sessao.slice(0,8);}
   if(ev.tipo==='acao')add('ac','↳ '+(ev.ferramenta==='Read'?'lendo ':ev.ferramenta==='Grep'?'procurando ':'listando ')+(ev.alvo||''));
   if(ev.tipo==='resposta'){let t=ev.texto||'',m=t.match(/\n?COMANDO:\s*(\{.*\})\s*$/);if(m){t=t.slice(0,m.index).trim();}
    add('ia',(ev.erro?'⚪ ':'')+t+(ev.ms?'\n\n('+(ev.ms/1000).toFixed(1).replace('.',',')+' s)':''));
    if(m){try{const c=JSON.parse(m[1]);const r=typeof window.vrComando==='function'?window.vrComando(c):'esta tela ainda não aceita comando';add('ac','↳ tela: '+r);}catch(e){add('ac','↳ comando ilegível');}}}
   if(ev.tipo==='fim'){stt.className='st';stt.innerHTML='<i></i>assistente parado · último processo encerrado';}}}
 }catch(err){add('ia','⚪ sem conexão com o assistente: '+err);}};
})();

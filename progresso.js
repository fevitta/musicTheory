// Progresso compartilhado: registra respostas e tempo de prática por dia, neste navegador (localStorage).
// Páginas de treino chamam Progress.track() uma vez e Progress.log('pagina:exercicio', acertou) a cada resposta.
// Expõe tudo em window.Progress. Qualquer página com .top-bar ganha o resumo do dia (link para progresso.html).
(function(){
  const KEY='tp-progresso', IDLE=60e3, STEP_MAX=20e3;
  // Chaves de todas as páginas, para exportar/importar o backup completo
  const BACKUP_KEYS=[KEY,'leitura-cfg','leitura-fracas','leitura-recordes','ritmo-cfg','ritmo-sessao','ouvido-cfg','vista-cfg','vista-sessao','ch-theme'];
  const EXS={
    'leitura:nota':['Leitura · Nota no teclado','leitura-partitura.html'],'leitura:nomear':['Leitura · Nomear a nota','leitura-partitura.html'],
    'leitura:escrever':['Leitura · Escrever na pauta','leitura-partitura.html'],'leitura:ditado':['Leitura · Ditado','leitura-partitura.html'],
    'leitura:intervalo':['Leitura · Intervalos','leitura-partitura.html'],'leitura:acorde':['Leitura · Acordes','leitura-partitura.html'],
    'leitura:sequencia':['Leitura · Sequência','leitura-partitura.html'],
    'vista:esperar':['Primeira vista · Esperar por mim','primeira-vista.html'],'vista:tempo':['Primeira vista · No tempo','primeira-vista.html'],
    'ritmo:tocar':['Ritmo · Tocar o ritmo','ritmo.html'],'ritmo:ouvir':['Ritmo · Ouvir e escolher','ritmo.html'],'ritmo:valores':['Ritmo · Valores das figuras','ritmo.html'],
    'ouvido:intervalos':['Ouvido · Intervalos','treino-ouvido.html'],'ouvido:acordes':['Ouvido · Acordes','treino-ouvido.html'],
    'ouvido:graus':['Ouvido · Graus da escala','treino-ouvido.html'],'ouvido:progressoes':['Ouvido · Progressões','treino-ouvido.html'],
    'ouvido:ditado':['Ouvido · Ditado melódico','treino-ouvido.html']
  };

  const blank=()=>({v:1,goal:10,days:{},best:0});
  function read(){try{const d=JSON.parse(localStorage.getItem(KEY));if(d&&d.days) return Object.assign(blank(),d);}catch(e){}return blank();}
  function write(d){try{localStorage.setItem(KEY,JSON.stringify(d));}catch(e){}}
  const dayKey=(t=new Date())=>t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0')+'-'+String(t.getDate()).padStart(2,'0');
  const addDays=(k,n)=>{const [y,m,d]=k.split('-').map(Number);return dayKey(new Date(y,m-1,d+n));};
  const minutes=day=>day?day.ms/60000:0;

  // ---------- Registro ----------
  let tracking=false, last=0, pending=0;
  // Tempo de prática: soma os intervalos entre interações (cada um limitado a 20 s; pausas de mais de 1 min não contam)
  function activity(){
    if(!tracking) return; const now=Date.now();
    if(last&&now-last<IDLE) pending+=Math.min(now-last,STEP_MAX);
    last=now; if(pending>5000) flush();
  }
  function flush(ex){
    const d=read(), k=dayKey(), day=d.days[k]||(d.days[k]={ms:0,n:0,ok:0,ex:{}});
    day.ms+=pending; if(ex){const e=day.ex[ex]||(day.ex[ex]={n:0,ok:0,ms:0});e.ms+=pending;} pending=0;
    const st=streak(d); if(st.current>d.best) d.best=st.current;
    write(d); return {d,day};
  }
  function log(ex,ok,n=1){
    activity(); const {d,day}=flush(ex);
    const e=day.ex[ex]||(day.ex[ex]={n:0,ok:0,ms:0}); e.n+=n; e.ok+=ok?n:0; day.n+=n; day.ok+=ok?n:0;
    const st=streak(d); if(st.current>d.best) d.best=st.current;
    write(d); protect(false); pill();
  }
  function track(){
    tracking=true;
    ['pointerdown','keydown'].forEach(t=>addEventListener(t,activity,{passive:true,capture:true}));
    addEventListener('pagehide',()=>{if(pending) flush();});
    document.addEventListener('visibilitychange',()=>{if(document.hidden&&pending) flush();});
  }

  // ---------- Leitura ----------
  const goalMet=(day,goal)=>minutes(day)>=goal;
  function streak(d=read()){
    const today=dayKey(); let k=goalMet(d.days[today],d.goal)?today:addDays(today,-1), cur=0;
    while(goalMet(d.days[k],d.goal)){cur++;k=addDays(k,-1);}
    return {current:cur,best:Math.max(d.best||0,cur),today:goalMet(d.days[today],d.goal)};
  }
  function setGoal(min){const d=read();d.goal=min;write(d);pill();}

  // ---------- Armazenamento protegido ----------
  // Chromium e Safari decidem sozinhos (sem perguntar); o Firefox mostra um aviso, então lá só pedimos pelo botão.
  async function protect(ask){
    if(!navigator.storage||!navigator.storage.persist) return null;
    try{ if(await navigator.storage.persisted()) return true;
      if(!ask&&/Firefox\//.test(navigator.userAgent)) return false;
      return await navigator.storage.persist(); }catch(e){return null;}
  }
  async function isProtected(){try{return navigator.storage&&navigator.storage.persisted?await navigator.storage.persisted():null;}catch(e){return null;}}

  // ---------- Backup ----------
  function exportData(){
    const data={app:'teoria-no-piano',version:1,exported:new Date().toISOString(),keys:{}};
    BACKUP_KEYS.forEach(k=>{try{const v=localStorage.getItem(k);if(v!=null) data.keys[k]=v;}catch(e){}});
    const blob=new Blob([JSON.stringify(data,null,1)],{type:'application/json'}), a=document.createElement('a');
    a.href=URL.createObjectURL(blob); a.download='progresso-teoria-no-piano-'+dayKey()+'.json';
    document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);
  }
  // Junta o histórico (fica o maior valor de cada dia, então importar duas vezes não duplica) e os recordes;
  // configurações e notas para revisar vêm do arquivo.
  function importData(text){
    const data=JSON.parse(text); if(!data||data.app!=='teoria-no-piano'||!data.keys) throw new Error('Arquivo não é um backup deste site.');
    const K=data.keys;
    if(K[KEY]){const inc=JSON.parse(K[KEY]), cur=read();
      for(const [k,day] of Object.entries(inc.days||{})){const c=cur.days[k];
        if(!c){cur.days[k]=day;continue;}
        c.ms=Math.max(c.ms,day.ms||0); c.n=Math.max(c.n,day.n||0); c.ok=Math.max(c.ok,day.ok||0);
        for(const [e,v] of Object.entries(day.ex||{})){const ce=c.ex[e]; if(!ce) c.ex[e]=v; else {ce.n=Math.max(ce.n,v.n);ce.ok=Math.max(ce.ok,v.ok);ce.ms=Math.max(ce.ms,v.ms);}}}
      cur.best=Math.max(cur.best||0,inc.best||0); if(inc.goal) cur.goal=inc.goal; write(cur);}
    if(K['leitura-recordes']){let cur={};try{cur=JSON.parse(localStorage.getItem('leitura-recordes'))||{};}catch(e){}
      const inc=JSON.parse(K['leitura-recordes']); for(const [k,v] of Object.entries(inc)) cur[k]=Math.max(cur[k]??0,v);
      localStorage.setItem('leitura-recordes',JSON.stringify(cur));}
    BACKUP_KEYS.filter(k=>k!==KEY&&k!=='leitura-recordes'&&K[k]!=null).forEach(k=>localStorage.setItem(k,K[k]));
    return Object.keys(K).length;
  }
  function clearAll(){BACKUP_KEYS.filter(k=>k!=='ch-theme').forEach(k=>{try{localStorage.removeItem(k);}catch(e){}});}

  // ---------- Resumo do dia no topo das páginas ----------
  function pill(){
    const bar=document.querySelector('.top-bar'); if(!bar) return;
    let a=bar.querySelector('.today-pill');
    if(!a){a=document.createElement('a');a.className='today-pill';a.href='progresso.html';a.title='Ver seu progresso';
      const theme=bar.querySelector('.theme'); bar.insertBefore(a,theme||null);}
    const d=read(), day=d.days[dayKey()], m=Math.floor(minutes(day)), st=streak(d);
    a.classList.toggle('met',st.today);
    a.innerHTML='';
    const ring=document.createElementNS('http://www.w3.org/2000/svg','svg'); ring.setAttribute('viewBox','0 0 20 20'); ring.setAttribute('aria-hidden','true');
    const f=Math.min(1,minutes(day)/d.goal), C=2*Math.PI*8;
    ring.innerHTML=`<circle cx="10" cy="10" r="8" fill="none" stroke="var(--line)" stroke-width="3"/><circle cx="10" cy="10" r="8" fill="none" stroke="var(--t)" stroke-width="3" stroke-linecap="round" stroke-dasharray="${(f*C).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 10 10)"/>`;
    a.append(ring, document.createTextNode(`Hoje ${m}/${d.goal} min`+(st.current?` · ${st.current} ${st.current>1?'dias':'dia'} seguidos`:'')));
  }
  document.addEventListener('DOMContentLoaded',pill);

  window.Progress={EXS,track,log,read,write,streak,setGoal,dayKey,addDays,minutes,protect,isProtected,exportData,importData,clearAll,refresh:pill};
})();

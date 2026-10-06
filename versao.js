// Verificação de nova versão: compara a versão desta página com a publicada em versao.json.
// Checa ao abrir, ao voltar para o app (depois de 5 min) e a cada 30 min. Se houver versão nova, mostra um aviso;
// "Atualizar" baixa de novo os arquivos do site (sem cache) e recarrega. A cada publicação, rode scripts/nova-versao.sh.
(function(){
  const VERSION='2026.10.06.0035';
  const FILES=['index.html','campo-harmonico.html','descobrir-tom.html','leitura-partitura.html','primeira-vista.html','ritmo.html',
    'treino-ouvido.html','progresso.html','acordes.html','style.css','theme.js','music.js','notacao.js','progresso.js','versao.js','manifest.webmanifest'];
  const EVERY=30*60e3, ON_RETURN=5*60e3;
  let lastCheck=0, shown=false;

  async function check(){
    if(location.protocol==='file:') return; // abrindo o arquivo direto do disco: não há o que checar
    lastCheck=Date.now();
    try{
      const r=await fetch('versao.json?t='+Date.now(),{cache:'no-store'}); if(!r.ok) return;
      const {version}=await r.json();
      if(version&&version!==VERSION) notify(version);
    }catch(e){} // sem internet: tenta de novo mais tarde
  }
  async function update(btn){
    btn.disabled=true; btn.textContent='Atualizando…';
    // Força o navegador a buscar de novo cada arquivo, para a página recarregada não vir do cache antigo
    await Promise.all(FILES.map(f=>fetch(f,{cache:'reload'}).catch(()=>{})));
    location.reload();
  }
  function notify(version){
    if(shown) return;
    try{if(sessionStorage.getItem('versao-dispensada')===version) return;}catch(e){}
    shown=true;
    const box=document.createElement('div'); box.className='update-toast'; box.setAttribute('role','status');
    const txt=document.createElement('span'); txt.textContent='Nova versão disponível.';
    const go=document.createElement('button'); go.type='button'; go.className='btn primary'; go.textContent='Atualizar'; go.onclick=()=>update(go);
    const no=document.createElement('button'); no.type='button'; no.className='btn'; no.textContent='Depois'; no.title='Lembrar na próxima vez que abrir o app';
    no.onclick=()=>{try{sessionStorage.setItem('versao-dispensada',version);}catch(e){} box.remove();};
    box.append(txt,go,no); document.body.appendChild(box);
  }

  addEventListener('load',()=>setTimeout(check,1500));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&Date.now()-lastCheck>ON_RETURN) check();});
  setInterval(()=>{if(!document.hidden) check();},EVERY);

  window.AppVersion={version:VERSION,check};
})();

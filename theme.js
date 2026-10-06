// Tema: Auto segue o aparelho; Claro/Escuro ficam salvos neste navegador.
// Carregado no <head> (sem defer) para aplicar o tema antes de pintar a página.
(function(){
  const KEY='ch-theme', root=document.documentElement;
  try{const t=localStorage.getItem(KEY); if(t==='light'||t==='dark') root.dataset.theme=t;}catch(e){}
  function apply(t){
    if(t==='auto') delete root.dataset.theme; else root.dataset.theme=t;
    document.querySelectorAll('meta[name="theme-color"]').forEach(m=>m.content=(t==='auto'?m.media.includes('dark'):t==='dark')?'#10121A':'#F3F4F7');
    try{t==='auto'?localStorage.removeItem(KEY):localStorage.setItem(KEY,t);}catch(e){}
    document.querySelectorAll('#theme button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.t===t)));
  }
  // Ao deitar o celular, rola até o exercício da página (a seção marcada com data-foco)
  const land=matchMedia('(orientation: landscape) and (max-height: 520px)');
  const focus=()=>{if(!land.matches) return; const el=document.querySelector('[data-foco]'); if(el) setTimeout(()=>el.scrollIntoView({behavior:'smooth',block:'start'}),250);};
  if(land.addEventListener) land.addEventListener('change',focus); else if(land.addListener) land.addListener(focus);
  // Monta o seletor em qualquer página que tenha <div class="seg theme" id="theme">
  document.addEventListener('DOMContentLoaded',()=>{
    const box=document.getElementById('theme'); if(!box) return;
    [['auto','Auto','Seguir o tema do aparelho'],['light','Claro','Tema claro'],['dark','Escuro','Tema escuro']].forEach(([t,label,title])=>{
      const b=document.createElement('button'); b.type='button'; b.dataset.t=t; b.textContent=label; b.title=title; b.onclick=()=>apply(t); box.appendChild(b);});
    apply(root.dataset.theme||'auto');
  });
})();

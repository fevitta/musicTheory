// Base musical compartilhada: nomes e grafia de notas, áudio (Web Audio) e um teclado simples em SVG.
// Expõe tudo em window.Music.
(function(){
  const LET=['C','D','E','F','G','A','B'];
  const NAT=[0,2,4,5,7,9,11];
  const SOL={C:'Dó',D:'Ré',E:'Mi',F:'Fá',G:'Sol',A:'Lá',B:'Si'};
  const BLACK=new Set([1,3,6,8,10]);
  const acc=a=>a===0?'':a===1?'♯':a===2?'𝄪':a===-1?'♭':a===-2?'𝄫':'';
  // 'C#', 'Bb' → índice da letra e classe de altura
  function parse(t){const li=LET.indexOf(t[0]);let a=0;for(const ch of t.slice(1)) a+= ch==='#'?1:-1;return {li,pc:(NAT[li]+a+12)%12};}
  function niceT(t){return t[0]+t.slice(1).replace(/#/g,'♯').replace(/b/g,'♭');}
  // Nota com a letra dada (índice 0–6) que soa na classe de altura pc
  function spellAt(li,pc){li=((li%7)+7)%7;let a=pc-NAT[li];if(a>6)a-=12;if(a<-6)a+=12;
    return {letter:LET[li],acc:a,pc,name:LET[li]+acc(a),sol:SOL[LET[li]]+acc(a)};}

  // ---------- Áudio ----------
  let ctx=null;
  function ac(){ if(!ctx){const C=window.AudioContext||window.webkitAudioContext; if(!C) return null; ctx=new C();} if(ctx.state==='suspended') ctx.resume(); return ctx; }
  function tone(m,t0,dur,vol){
    const c=ac(); if(!c) return;
    const f=440*Math.pow(2,(m-69)/12);
    const g=c.createGain(); g.gain.setValueAtTime(0,t0); g.gain.linearRampToValueAtTime(vol,t0+0.012); g.gain.exponentialRampToValueAtTime(vol*0.35,t0+0.35); g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
    const lp=c.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=Math.min(4200,f*6);
    const o1=c.createOscillator(); o1.type='triangle'; o1.frequency.value=f;
    const o2=c.createOscillator(); o2.type='sine'; o2.frequency.value=f*2; const g2=c.createGain(); g2.gain.value=0.25;
    o1.connect(lp); o2.connect(g2); g2.connect(lp); lp.connect(g); g.connect(c.destination);
    o1.start(t0); o2.start(t0); o1.stop(t0+dur+0.05); o2.stop(t0+dur+0.05);
  }
  // Clique de metrônomo (ou toque de ritmo) no instante t do relógio de áudio
  function click(t,{strong=false,vol=1,freq}={}){
    const c=ac(); if(!c) return;
    const o=c.createOscillator(), g=c.createGain(), f=freq||(strong?1760:1175);
    o.type='triangle'; o.frequency.setValueAtTime(f,t); o.frequency.exponentialRampToValueAtTime(f*0.6,t+0.05);
    g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.35*vol,t+0.002); g.gain.exponentialRampToValueAtTime(0.0001,t+0.07);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+0.08);
  }
  function playNotes(ms,{arp=0,dur=1.6,at=0}={}){
    const c=ac(); if(!c) return; const t=c.currentTime+0.03+at; const v=0.22/Math.sqrt(ms.length);
    ms.forEach((m,i)=>tone(m,t+i*arp,dur,v));
  }

  // ---------- Teclado simples ----------
  // notes: [{m, label, root}] — destaca as teclas; a extensão vai de low até o fim da oitava da nota mais aguda
  function drawKeys(svg,notes,{low=48}={}){
    const NS='http://www.w3.org/2000/svg', W=40,H=180,BW=24,BH=112;
    const el=(tag,attrs)=>{const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);svg.appendChild(e);return e;};
    svg.innerHTML='';
    const top=Math.max(low+23,...notes.map(n=>n.m)); const high=low+Math.ceil((top-low+1)/12)*12-1;
    const whites=(high-low+1)/12*7;
    svg.setAttribute('viewBox',`0 0 ${whites*W+2} 190`);
    svg.style.minWidth=whites>14?'540px':'420px';
    const wi=[0,null,1,null,2,3,null,4,null,5,null,6];
    const pos=m=>{const pc=m%12,o=Math.floor((m-low)/12); if(wi[pc]!==null) return {white:true,x:1+(o*7+wi[pc])*W}; return {white:false,x:1+(o*7+wi[pc-1]+1)*W-BW/2};};
    const on=new Map(notes.map(n=>[n.m,n]));
    const keys=[...Array(high-low+1)].map((_,i)=>low+i).map(m=>[m,pos(m)]);
    const mono='IBM Plex Mono, monospace';
    keys.filter(k=>k[1].white).forEach(([m,p])=>{const n=on.get(m),cx=p.x+(W-1)/2;
      el('rect',{x:p.x,y:1,width:W-1,height:H,rx:5,fill:n?'var(--accent)':'var(--kw)',stroke:'var(--kw-edge)','stroke-width':1});
      if(n){el('text',{x:cx,y:H-14,'text-anchor':'middle','font-size':13,'font-family':mono,'font-weight':600,fill:'var(--on-accent)'}).textContent=n.label||'';
        if(n.root) el('circle',{cx,cy:H-36,r:4,fill:'var(--on-accent)'});}
      if(m%12===0) el('text',{x:p.x+4,y:14,'font-size':9,'font-family':mono,fill:'var(--muted)'}).textContent='C'+(Math.floor(m/12)-1);});
    keys.filter(k=>!k[1].white).forEach(([m,p])=>{const n=on.get(m),cx=p.x+BW/2;
      el('rect',{x:p.x,y:0,width:BW,height:BH,rx:3,fill:n?'var(--accent)':'var(--kb)',stroke:'var(--kb)','stroke-width':n?3:1});
      if(n){el('text',{x:cx,y:BH-10,'text-anchor':'middle','font-size':10,'font-family':mono,'font-weight':600,fill:'var(--on-accent)'}).textContent=n.label||'';
        if(n.root) el('circle',{cx,cy:BH-28,r:3.2,fill:'var(--on-accent)'});}});
    // Em telas estreitas, rola até as notas destacadas
    const sc=svg.parentElement; if(!notes.length||sc.scrollWidth<=sc.clientWidth) return;
    const k=svg.getBoundingClientRect().width/svg.viewBox.baseVal.width, xs=notes.map(n=>pos(n.m).x);
    const lo=Math.min(...xs)*k, hi=(Math.max(...xs)+W)*k, cw=sc.clientWidth;
    if(lo<sc.scrollLeft||hi>sc.scrollLeft+cw) sc.scrollTo({left:Math.max(0,hi-lo>cw?lo-8:(lo+hi-cw)/2),behavior:'smooth'});
  }

  // ---------- Teclado interativo ----------
  // Tocável (pointerdown chama onPress). set({lo,hi,names,fills,marks}) redesenha:
  // fills = Map(m → cor de preenchimento), marks = Set(m) com contorno de destaque.
  function keyboard(svg,onPress){
    const NS='http://www.w3.org/2000/svg', st={lo:48,hi:71,names:false,fills:new Map(),marks:new Set()}; let fl=null;
    const el=(tag,attrs,text)=>{const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(text!=null)e.textContent=text;svg.appendChild(e);return e;};
    function draw(){
      svg.innerHTML=''; let lo=st.lo, hi=st.hi;
      while(![0,5].includes(lo%12)) lo--; while(![4,11].includes(hi%12)) hi++;
      const WW=36,WH=150,BW=22,BH=94, whites=[], blacks=[]; let x=1;
      for(let m=lo;m<=hi;m++){ if(BLACK.has(m%12)) blacks.push({m,x:x-BW/2}); else {whites.push({m,x}); x+=WW;} }
      svg.setAttribute('viewBox',`0 0 ${x+1} ${WH+2}`); svg.style.minWidth=Math.round(whites.length*24)+'px';
      const fill=(m,base)=>fl&&fl.m===m?fl.color:st.fills.get(m)||base, mono='IBM Plex Mono, monospace';
      const key=(k,attrs)=>{const r=el('rect',attrs);r.style.cursor='pointer';r.dataset.m=k.m;r.addEventListener('pointerdown',e=>down(k.m,e));};
      whites.forEach(k=>{const mk=st.marks.has(k.m);
        key(k,{x:k.x,y:1,width:WW-1,height:WH,rx:5,fill:fill(k.m,'var(--kw)'),stroke:mk?'var(--accent)':'var(--kw-edge)','stroke-width':mk?4:1});
        const pc=k.m%12;
        if(st.names) el('text',{x:k.x+(WW-1)/2,y:WH-12,'text-anchor':'middle','font-size':11,'font-family':mono,fill:'var(--muted)','pointer-events':'none'},SOL[LET[NAT.indexOf(pc)]]);
        if(pc===0) el('text',{x:k.x+(WW-1)/2,y:WH-(st.names?28:12),'text-anchor':'middle','font-size':10,'font-family':mono,fill:'var(--muted)','pointer-events':'none'},'C'+(Math.floor(k.m/12)-1));});
      blacks.forEach(k=>{const mk=st.marks.has(k.m);key(k,{x:k.x,y:0,width:BW,height:BH,rx:3,fill:fill(k.m,'var(--kb)'),stroke:mk?'var(--accent)':'var(--kb)','stroke-width':mk?4:1});});
    }
    // Toque × arrastar: se o teclado não cabe na tela (rola para o lado), um toque no dedo só conta ao soltar sem ter
    // arrastado; arrastar rola o teclado sem tocar nota. Mouse, ou teclado que cabe inteiro: toca na hora.
    // onPress recebe o evento do toque inicial (o instante certo para conferir o tempo).
    const touches=new Map();
    const scrolls=()=>{const sc=svg.parentElement;return sc&&sc.scrollWidth>sc.clientWidth+2;};
    function down(m,e){
      if(e.pointerType==='mouse'||!scrolls()){e.preventDefault();onPress(m,e);return;}
      touches.set(e.pointerId,{m,e,x:e.clientX,y:e.clientY,left:svg.parentElement.scrollLeft});
    }
    const far=(t,e)=>Math.abs(e.clientX-t.x)>10||Math.abs(e.clientY-t.y)>10||Math.abs(svg.parentElement.scrollLeft-t.left)>4;
    svg.addEventListener('pointermove',e=>{const t=touches.get(e.pointerId); if(t&&far(t,e)) touches.delete(e.pointerId);});
    svg.addEventListener('pointerup',e=>{const t=touches.get(e.pointerId); touches.delete(e.pointerId); if(t&&!far(t,e)) onPress(t.m,t.e);});
    svg.addEventListener('pointercancel',e=>touches.delete(e.pointerId));
    return {draw,
      set(o){Object.assign(st,o);draw();},
      flash(m,color){fl={m,color,t:Date.now()};draw();setTimeout(()=>{if(fl&&Date.now()-fl.t>=330){fl=null;draw();}},350);}};
  }
  // Piano digital (Web MIDI): chama onNote(nota, evento) a cada tecla apertada, onOff(nota) ao soltar; onStatus(n) com o nº de entradas
  function midi(onNote,onStatus,onOff){
    if(!navigator.requestMIDIAccess) return;
    navigator.requestMIDIAccess().then(a=>{const hook=()=>{let n=0;a.inputs.forEach(inp=>{n++;inp.onmidimessage=e=>{const [st,note,vel]=e.data,t=st&0xf0;if(t===0x90&&vel>0)onNote(note,e);else if(onOff&&(t===0x80||t===0x90))onOff(note,e);};});if(onStatus)onStatus(n);};
      hook();a.onstatechange=hook;}).catch(()=>{});
  }

  // ---------- Sorteio sem repetição ----------
  // Como um baralho: cada item sai o mesmo número de vezes, em ordem embaralhada. Com 4 itens ou mais, cada um sai
  // uma vez por monte e, ao embaralhar de novo, os que saíram há pouco não voltam logo. Com 2 ou 3 itens (ex.: maior
  // ou menor), o monte tem várias cópias de cada, para a ordem não ficar previsível, e nunca sai o mesmo 3 vezes seguidas.
  // key(item) diz quando dois itens são "o mesmo" (padrão: JSON).
  function bag(items,key=x=>JSON.stringify(x)){
    const u=items.length, small=u<4, copies=small?Math.ceil(8/Math.max(1,u)):1, gap=small?0:Math.min(8,Math.floor(u/2));
    let deck=[], recent=[];
    const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
    const swapOut=(i,bad)=>{const j=deck.findIndex((x,jj)=>jj!==i&&!bad(key(x))); if(j>=0)[deck[i],deck[j]]=[deck[j],deck[i]]; return j>=0;};
    return {
      next(){
        if(!u) return undefined;
        if(!deck.length){
          deck=shuffle([].concat(...Array(copies).fill(items)));
          // o deck sai do fim: quem saiu há pouco vai para o começo (sai por último)
          for(let k=0;k<gap;k++){const i=deck.length-1-k; if(i<=0) break; if(recent.includes(key(deck[i]))) swapOut(i,kk=>recent.includes(kk));}
        }
        let i=deck.length-1;
        if(small&&u>1&&recent.length>=2&&recent.slice(-2).every(k=>k===key(deck[i]))){
          const k0=key(deck[i]);
          // só sobrou o mesmo no monte: emenda o próximo monte por cima e tira um diferente dele
          if(!swapOut(i,kk=>kk===k0)){deck=deck.concat(shuffle([].concat(...Array(copies).fill(items)))); swapOut(deck.length-1,kk=>kk===k0);}
        }
        const x=deck.pop(); recent.push(key(x)); if(recent.length>Math.max(gap,2)) recent.shift(); return x;
      },
      size:u
    };
  }
  // O mesmo monte continua entre rodadas enquanto as opções (opts) não mudarem; mudou, embaralha um novo
  const bags=new Map();
  function bagFor(name,opts,makeItems,key){
    const sig=JSON.stringify(opts), b=bags.get(name);
    if(b&&b.sig===sig) return b.bag;
    const bag_=bag(makeItems(),key); bags.set(name,{sig,bag:bag_}); return bag_;
  }
  // Sorteio aleatório que evita os últimos `memory` resultados (para espaços grandes, como ritmos e melodias).
  // Com `name`, a memória continua entre rodadas.
  const memories=new Map();
  function fresh(gen,key=x=>JSON.stringify(x),memory=4,name=null,tries=30){
    const recent=name?(memories.get(name)||memories.set(name,[]).get(name)):[];
    return ()=>{let x,k,t=0; do{x=gen();k=key(x);}while(recent.includes(k)&&t++<tries); recent.push(k); if(recent.length>memory) recent.shift(); return x;};
  }

  window.Music={LET,NAT,SOL,BLACK,acc,parse,niceT,spellAt,playNotes,drawKeys,audio:ac,tone,click,keyboard,midi,bag,bagFor,fresh};
})();

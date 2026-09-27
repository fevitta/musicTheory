// Notação e ritmo compartilhados (Leitura, Ritmo, Primeira Vista): figuras em SVG, células rítmicas e grupos de hastes unidas.
// Durações em semicolcheias: semínima = 4, colcheia = 2, mínima pontuada = 12. Expõe tudo em window.Notacao.
(function(){
  // ---------- Figuras ----------
  // Elipse girada como polígono (para a cabeça da nota com furo, via fill-rule evenodd)
  const ell=(x,y,rx,ry,rot,n)=>{const c=Math.cos(rot),s=Math.sin(rot);let p='';
    for(let k=0;k<n;k++){const t=k/n*2*Math.PI,ex=rx*Math.cos(t),ey=ry*Math.sin(t);p+=(k?'L':'M')+(x+ex*c-ey*s).toFixed(2)+' '+(y+ex*s+ey*c).toFixed(2);}
    return p+'Z';};
  const headPath=(x,y,hollow)=>ell(x,y,6.4,4.4,-0.35,32)+(hollow?ell(x,y,4.6,1.9,-0.6,24):'');  // semínima (cheia) ou mínima (vazada)
  const wholePath=(x,y)=>ell(x,y,7.2,5,0,36)+ell(x,y,2.6,4.3,-0.6,28);                          // semibreve
  const REST_GLYPH={4:'𝄽',2:'𝄾',1:'𝄿'};  // pausas de semínima, colcheia e semicolcheia (fonte Noto Music)
  const baseDur=d=>[3,6,12].includes(d)?d*2/3:d;  // figura sem o ponto de aumento

  // ---------- Células rítmicas ----------
  // Cada célula começa no tempo: e = [[duração, pausa?], ...], w = peso no sorteio.
  // Nível 1: até semínima; 2: + colcheias; 3: + semicolcheias e pontuadas. `melody` usa menos pausas e notas longas.
  function cells(lv,rests,{melody=false}={}){
    const r=melody?.6:1;
    const c=[{e:[[4]],w:melody?6:5},{e:[[8]],w:2},{e:[[12]],w:melody?.8:1},{e:[[16]],w:melody?.6:1,whole:true}];
    if(rests){c.push({e:[[4,1]],w:1.3*r}); if(!melody) c.push({e:[[8,1]],w:.4});}
    if(lv>=2){c.push({e:[[2],[2]],w:melody?4:5}); if(rests){c.push({e:[[2,1],[2]],w:r}); if(!melody) c.push({e:[[2],[2,1]],w:.5});}}
    if(lv>=3){const w=melody?1.5:2; c.push({e:[[1],[1],[1],[1]],w:melody?1.5:2.5},{e:[[2],[1],[1]],w},{e:[[1],[1],[2]],w},{e:[[3],[1]],w},{e:[[6],[2]],w:2});}
    return c.map(x=>({...x,len:x.e.reduce((s,[d])=>s+d,0)}));
  }
  // Preenche `len` semicolcheias a partir de `from` (compasso de L semicolcheias) só com células inteiras.
  // A semibreve só entra no começo de um compasso 4/4 inteiro.
  function fill(len,from,L,cs,{noRestStart=false}={}){
    const ev=[]; let pos=0;
    while(pos<len){
      const at=(from+pos)%L, ok=cs.filter(c=>c.len<=len-pos&&(!c.whole||(at===0&&L===16))&&!(noRestStart&&pos===0&&c.e[0][1]));
      const tot=ok.reduce((s,c)=>s+c.w,0); let x=Math.random()*tot; const c=ok.find(c=>(x-=c.w)<0)||ok[0];
      let p=from+pos; c.e.forEach(([d,r])=>{ev.push({start:p,dur:d,rest:!!r});p+=d;}); pos+=c.len;
    }
    return ev;
  }

  // ---------- Hastes unidas ----------
  // Colcheias e semicolcheias seguidas dentro do mesmo tempo formam um grupo (só grupos de 2 ou mais)
  function beamGroups(ev){
    const groups=[]; let g=null;
    ev.forEach((e,i)=>{
      const beam=!e.rest&&e.dur<4&&Math.floor(e.start/4)===Math.floor((e.start+e.dur-1)/4), p=g&&ev[g[g.length-1]];
      if(beam&&p&&Math.floor(p.start/4)===Math.floor(e.start/4)&&p.start+p.dur===e.start) g.push(i);
      else {g=beam?[i]:null; if(g) groups.push(g);}
    });
    return groups.filter(x=>x.length>1);
  }
  // Segunda barra (semicolcheias) de um grupo: liga semicolcheias vizinhas; uma semicolcheia sozinha ganha um toco
  // apontando para dentro do grupo. Devolve [{from, to}] ou [{from, hook:'left'|'right'}] com índices de `ev`.
  function secondaryBeams(ev,grp){
    const out=[], is16=j=>j!==undefined&&baseDur(ev[j].dur)===1;
    grp.forEach((j,k)=>{if(!is16(j)) return; const nx=grp[k+1], pv=grp[k-1];
      if(is16(nx)) out.push({from:j,to:nx}); else if(!is16(pv)) out.push({from:j,hook:nx===undefined?'left':'right'});});
    return out;
  }

  window.Notacao={ell,headPath,wholePath,REST_GLYPH,baseDur,cells,fill,beamGroups,secondaryBeams};
})();

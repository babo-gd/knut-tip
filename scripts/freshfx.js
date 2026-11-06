// 입학 전·첫 주 체크리스트: progress ring card with changing message, items as stations on a route
// (line turns mint as items are done), check pop + self-drawing tick + sparks, confetti when all are done.
// Checkboxes stay real (keyboard + saved state unchanged).
// Usage: node freshfx.js <page.html> [<page.html> ...]
const fs=require("fs");
const CSS=`
/* ===== freshman checklist ===== */
.fr-list{gap:0!important}
.fr-head{position:relative;display:flex;align-items:center;gap:14px;margin-bottom:12px;padding:16px;border-radius:20px;background:var(--card);box-shadow:var(--sh1);transition:background .4s}
.fr-head.all{background:linear-gradient(135deg,var(--mint-bg),var(--card))}
.fr-ring{flex:none;width:64px;height:64px;transform:rotate(-90deg)}
.fr-trk{fill:none;stroke:var(--fill2);stroke-width:7}
.fr-val{fill:none;stroke:var(--mint);stroke-width:7;stroke-linecap:round;transition:stroke-dashoffset .6s cubic-bezier(.3,1.2,.5,1)!important}
.fr-num{position:absolute;left:16px;top:50%;width:64px;transform:translateY(-50%);text-align:center;font-size:16px;font-weight:800;color:var(--t1)}
.fr-msg{min-width:0;display:flex;flex-direction:column;gap:2px}
.fr-msg b{font-size:17px;font-weight:800;letter-spacing:-.015em;color:var(--t1)}
.fr-msg small{font-size:13px;color:var(--t3)}
.fr-items{position:relative;display:flex;flex-direction:column;gap:8px}
.fr-item{position:relative;display:flex!important;flex-direction:row!important;align-items:flex-start!important;gap:12px!important;padding:14px!important;border:0!important;border-radius:16px!important;background:var(--card)!important;box-shadow:var(--sh1);cursor:pointer;transition:background-color .25s}
.fr-item:not(:last-child)::after{content:"";position:absolute;left:27px;top:40px;width:3px;height:calc(100% - 18px);margin-left:-1.5px;border-radius:2px;background:var(--fill2);z-index:0}
.fr-item.done:not(:last-child)::after{background:var(--mint)}
.fr-cb{position:absolute;opacity:0;width:1px;height:1px;pointer-events:none}
.fr-item:has(.fr-cb:focus-visible){box-shadow:inset 0 0 0 2px var(--hero),var(--sh1)}
.fr-dot{position:relative;z-index:1;flex:none;width:26px;height:26px;margin-top:1px;border-radius:50%;display:grid;place-items:center;background:var(--card);box-shadow:inset 0 0 0 2.5px #c9ced9;transition:background-color .2s,box-shadow .2s}
.fr-dot svg{width:16px;height:16px;fill:none;stroke:#fff;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:16;stroke-dashoffset:16}
.fr-item.done .fr-dot{background:var(--mint);box-shadow:none}
.fr-item.done .fr-dot svg{stroke-dashoffset:0}
.fr-item.done{background:color-mix(in srgb,var(--mint) 9%,var(--card))!important}
.fr-tx{min-width:0;display:flex;flex-direction:column;gap:2px}
.fr-tx b{font-size:15.5px;font-weight:700;color:var(--t1);line-height:1.4;transition:color .2s}
.fr-tx small{font-size:13px;font-weight:500;color:var(--t3)}
.fr-item.done .fr-tx b{color:var(--t3);text-decoration:line-through;text-decoration-thickness:2px;text-decoration-color:color-mix(in srgb,var(--mint) 70%,transparent)}
.fr-spark{position:fixed;z-index:120;width:6px;height:6px;border-radius:50%;background:var(--mint);pointer-events:none}
.fr-conf{position:fixed;z-index:120;width:8px;height:5px;border-radius:1px;pointer-events:none}
`;
const JS=`
/* ---------- freshman checklist: route + progress ring + check effects ---------- */
function frPop(dot){dot.animate([{transform:"scale(.5)"},{transform:"scale(1.3)",offset:.55},{transform:"scale(1)"}],{duration:420,easing:"cubic-bezier(.3,1.5,.5,1)"});
  var sv=$("svg",dot);if(sv)sv.animate([{strokeDashoffset:16},{strokeDashoffset:0}],{duration:320,delay:90,easing:"ease-out",fill:"backwards"});
  var r=dot.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
  for(var k=0;k<8;k++){(function(k){var s=el("i",{cls:"fr-spark"});s.style.left=cx+"px";s.style.top=cy+"px";document.body.appendChild(s);var a=k/8*Math.PI*2,d=20+Math.random()*10;
    s.animate([{transform:"translate(-50%,-50%) scale(1)",opacity:1},{transform:"translate(calc(-50% + "+(Math.cos(a)*d).toFixed(1)+"px),calc(-50% + "+(Math.sin(a)*d).toFixed(1)+"px)) scale(.3)",opacity:0}],{duration:520,easing:"cubic-bezier(.2,.8,.2,1)",fill:"forwards"});setTimeout(function(){s.remove()},650)})(k)}}
function frConfetti(ring){var r=ring.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,cols=["#3d5cf5","#2fc2ad","#ffb020","#ff6b5e","#7a55e8"];
  for(var k=0;k<26;k++){(function(k){var s=el("i",{cls:"fr-conf"});s.style.background=cols[k%5];s.style.left=cx+"px";s.style.top=cy+"px";document.body.appendChild(s);var a=Math.random()*Math.PI*2,d=50+Math.random()*80;
    s.animate([{transform:"translate(-50%,-50%) rotate(0)",opacity:1},{transform:"translate(calc(-50% + "+(Math.cos(a)*d).toFixed(1)+"px),calc(-50% + "+(Math.sin(a)*d+30).toFixed(1)+"px)) rotate("+Math.round(Math.random()*540)+"deg)",opacity:0}],{duration:900+Math.random()*400,easing:"cubic-bezier(.2,.7,.3,1)",fill:"forwards"});setTimeout(function(){s.remove()},1450)})(k)}}
function frUpdate(anim){var box=$("#freshList");if(!box)return;var t=FRESH.length,n=FRESH.filter(function(f,i){return fdone[i]}).length,p=n/t,C=2*Math.PI*27;
  var v=$(".fr-val",box);v.style.strokeDasharray=C.toFixed(2);v.style.strokeDashoffset=(C*(1-p)).toFixed(2);
  $(".fr-num",box).textContent=n+"/"+t;var m=$(".fr-msg",box);
  m.firstChild.textContent=n===t?"첫 주 준비 끝!":n===0?"하나씩 체크해 볼까요?":"좋아요, "+(t-n)+"개 남았어요";
  m.lastChild.textContent=n===t?"이제 교통대 생활을 즐길 차례예요":"체크한 건 이 기기에 저장돼요";
  $(".fr-head",box).classList.toggle("all",n===t);
  var hp=$("#homeProg");if(hp)hp.style.width=Math.round(p*100)+"%";var ht=$("#homeProgTxt");if(ht)ht.textContent=n+" / "+t+" 완료";var fp=$("#freshProg");if(fp)fp.style.width=Math.round(p*100)+"%";
  if(anim&&n===t)frConfetti($(".fr-ring",box))}
renderFresh=function(){var box=$("#freshList");if(!box)return;var bar=box.previousElementSibling;if(bar&&bar.classList.contains("progress"))bar.hidden=true;
  box.textContent="";box.classList.add("fr-list");
  var head=el("div",{cls:"fr-head"});head.innerHTML='<svg class="fr-ring" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="27" class="fr-trk"/><circle cx="32" cy="32" r="27" class="fr-val"/></svg>';
  head.appendChild(el("b",{cls:"fr-num"}));head.appendChild(el("div",{cls:"fr-msg"},[el("b"),el("small")]));box.appendChild(head);
  var list=el("div",{cls:"fr-items"});box.appendChild(list);
  FRESH.forEach(function(f,i){var cb=el("input",{type:"checkbox",id:"fr"+i,cls:"fr-cb"});cb.checked=!!fdone[i];
    var dot=el("span",{cls:"fr-dot","aria-hidden":"true"});dot.innerHTML='<svg viewBox="0 0 20 20"><path d="M5 10.5l3.2 3L15 7"/></svg>';
    var lab=el("label",{cls:"fr-item"+(cb.checked?" done":""),"for":"fr"+i},[cb,dot,el("span",{cls:"fr-tx"},[el("b",{text:f[0]}),f[1]?el("small",{text:f[1]}):null])]);
    cb.onchange=function(){fdone[i]=cb.checked;store("fresh",fdone);lab.classList.toggle("done",cb.checked);if(cb.checked)frPop(dot);frUpdate(true)};list.appendChild(lab)});
  frUpdate(false)};
renderFresh();
if(typeof PRESS_BIG==="string")PRESS_BIG+=",.fr-item";
`;
for(const F of process.argv.slice(2)){let s=fs.readFileSync(F,"utf8");
  const rep=(a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(F+": expected 1 match, found "+n+": "+a.slice(0,60));s=s.replace(a,()=>b)};
  if(s.includes("/* ===== freshman checklist"))throw new Error(F+": already applied");
  const M="@media (prefers-reduced-motion:reduce){*{transition:none!important}}";rep(M,CSS+"\n"+M);
  rep("/* ---------- connect db ---------- */",JS+"/* ---------- connect db ---------- */");
  fs.writeFileSync(F,s,"utf8");console.log("ok",F.slice(-30))}

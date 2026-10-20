// 전체 메뉴 as a subway map: a sheet that tilts up, station search, one card per category line (number, colour,
// "지금 여기" on the current line), menus as stations on a coloured line, cards flipping in one after another.
// Navigation is unchanged (same titles, same jumpTo/go).
// Usage: node megamap.js <page.html> [<page.html> ...]
const fs=require("fs");

const CSS=`
/* ===== 전체 메뉴: subway map ===== */
.mg-bg{position:fixed;inset:0;z-index:58;display:flex;justify-content:center;align-items:flex-end;background:rgba(0,0,0,.45)}
.mg-sheet{width:min(440px,100%);max-height:92vh;overflow:auto;overscroll-behavior:contain;background:var(--page);border-radius:28px 28px 0 0;padding:10px 16px calc(28px + env(safe-area-inset-bottom));box-shadow:0 -10px 40px rgba(0,0,0,.2)}
.mg-grab{width:40px;height:5px;border-radius:3px;background:var(--fill2);margin:2px auto 10px}
.mg-top{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin:2px 4px 14px}
.mg-top h2{margin:0;font-size:24px!important;font-weight:800!important;letter-spacing:-.02em}
.mg-top p{margin:2px 0 0;font-size:14px;color:var(--t3)}
.mg-x{flex:none;width:40px;height:40px;border:0;border-radius:50%;background:var(--fill);color:var(--t2);font-size:16px;cursor:pointer}
.mg-search{position:relative}
.mg-search svg{position:absolute;left:14px;top:50%;width:18px;height:18px;margin-top:-9px;color:var(--t3);pointer-events:none}
.mg-sheet .mg-search input[type="search"]{width:100%;padding-left:44px!important;background:var(--card)!important;box-shadow:var(--sh1)!important}
.mg-lines{display:flex;flex-direction:column;gap:12px;margin-top:14px}
.mg-line{background:var(--card);border-radius:20px;box-shadow:var(--sh1);overflow:hidden}
.mg-line.here{box-shadow:inset 0 0 0 2px var(--lc),var(--sh1)}
.mg-line[hidden]{display:none}
.mg-head{display:flex;align-items:center;gap:10px;width:100%;padding:14px 16px;border:0;background:color-mix(in srgb,var(--lc) 11%,var(--card));font:inherit;color:var(--t1);text-align:left;cursor:pointer}
.mg-no{flex:none;width:28px;height:28px;border-radius:50%;background:var(--lc);color:#fff;display:grid;place-items:center;font-size:14px;font-weight:800;box-shadow:0 0 0 3px var(--card)}
.mg-nm{font-size:17px;font-weight:800;letter-spacing:-.015em}
.mg-here{font-size:11.5px;font-weight:800;color:#fff;background:var(--lc);padding:2px 8px;border-radius:999px}
.mg-cnt{margin-left:auto;font-size:12.5px;font-weight:600;color:var(--t3);white-space:nowrap}
.mg-cnt::after{content:" ›";font-size:15px}
.mg-stops{position:relative;padding:6px 0 10px}
.mg-stops::before{content:"";position:absolute;left:30px;top:20px;bottom:24px;width:4px;margin-left:-2px;border-radius:2px;background:var(--lc);opacity:.35}
.mg-stop{position:relative;display:flex;align-items:center;gap:14px;width:100%;min-height:46px;padding:8px 16px 8px 22px;border:0;background:none;font:inherit;font-size:15.5px;font-weight:600;color:var(--t1);text-align:left;line-height:1.35;cursor:pointer;transition:background-color .15s}
.mg-stop:active{background:var(--fill)}
.mg-stop[hidden]{display:none}
.mg-dot{position:relative;z-index:1;flex:none;width:16px;height:16px;border-radius:50%;background:var(--card);box-shadow:inset 0 0 0 3px var(--lc);transition:transform .2s,background-color .2s}
.mg-stop:hover .mg-dot,.mg-stop:focus-visible .mg-dot,.mg-stop.go .mg-dot{background:var(--lc);transform:scale(1.3)}
.mg-empty{padding:28px 4px;text-align:center;color:var(--t3)}
`;

const JS=`
/* ---------- 전체 메뉴 as a subway map ---------- */
function megaItems(tab){var titles=[];$$('section.panel[data-tab="'+tab+'"]').forEach(function(p){$$("h1.sub, .stop-head h2",p).forEach(function(h){var x=h.textContent.trim();if(x&&titles.indexOf(x)<0&&x!=="꿀팁 노선도")titles.push(x)})});if(tab==="food")titles=["맛집 지도·목록"].concat(titles);return titles}
function megaGo(tab,x){closeMega();setTimeout(function(){if(x==="맛집 지도·목록"){go("food");setTimeout(function(){var f=$("#foodMapBox");if(f)f.scrollIntoView({behavior:"smooth",block:"center"})},30)}else if(x)jumpTo(tab,x);else go(tab)},RM?0:200)}
closeMega=function(){if(!megaEl)return;var m=megaEl;megaEl=null;var b=$("#allMenuBtn");if(b)b.setAttribute("aria-expanded","false");var sh=$(".mg-sheet",m);
  var fin=function(){m.remove();if(b)b.focus()};if(RM||!sh)fin();else{sh.animate([{transform:"none"},{transform:"translateY(100%)"}],{duration:220,easing:"cubic-bezier(.4,0,1,1)"}).onfinish=fin;m.animate([{opacity:1},{opacity:0}],{duration:220})}};
openMega=function(){if(megaEl){closeMega();return}
  var cur=(($$("section.panel").filter(function(p){return !p.hidden})[0]||{}).dataset||{}).tab;
  var x=el("button",{cls:"mg-x",type:"button","aria-label":"닫기",text:"✕"});x.onclick=closeMega;
  var inp=el("input",{type:"search",placeholder:"메뉴 이름으로 찾기","aria-label":"메뉴 검색",autocomplete:"off"});
  var srch=el("div",{cls:"mg-search"},[inp]);srch.insertAdjacentHTML("afterbegin",'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>');
  var lines=el("div",{cls:"mg-lines"});
  TABS.forEach(function(t,i){var items=megaItems(t[0]),here=t[0]===cur;var card=el("section",{cls:"mg-line"+(here?" here":""),"aria-label":STN[t[0]]+"선"});card.style.setProperty("--lc",LINE_C[t[0]]||"#3d5cf5");
    var head=el("button",{cls:"mg-head",type:"button"},[el("b",{cls:"mg-no",text:String(i+1)}),el("span",{cls:"mg-nm",text:STN[t[0]]+"선"})]);if(here)head.appendChild(el("span",{cls:"mg-here",text:"지금 여기"}));head.appendChild(el("span",{cls:"mg-cnt",text:items.length+"개 역"}));
    head.onclick=function(){megaGo(t[0],null)};card.appendChild(head);
    var stops=el("div",{cls:"mg-stops"});items.forEach(function(name){var b=el("button",{cls:"mg-stop",type:"button"},[el("i",{cls:"mg-dot","aria-hidden":"true"}),el("span",{text:name})]);b.dataset.q=name.replace(/\\s/g,"");b.onclick=function(){b.classList.add("go");megaGo(t[0],name)};stops.appendChild(b)});
    card.appendChild(stops);lines.appendChild(card)});
  var empty=el("p",{cls:"mg-empty",hidden:"",text:"찾는 메뉴가 없어요"});
  inp.addEventListener("input",function(){var q=inp.value.replace(/\\s/g,""),any=false;$$(".mg-line",lines).forEach(function(card){var n=0;$$(".mg-stop",card).forEach(function(s){var on=!q||s.dataset.q.indexOf(q)>=0;s.hidden=!on;if(on)n++});card.hidden=!!q&&!n;if(n)any=true});empty.hidden=!q||any});
  var sheet=el("div",{cls:"mg-sheet",role:"dialog","aria-modal":"true","aria-label":"전체 메뉴"},[el("div",{cls:"mg-grab","aria-hidden":"true"}),el("div",{cls:"mg-top"},[el("div",{},[el("h2",{text:"전체 메뉴"}),el("p",{text:"어느 역으로 갈까요?"})]),x]),srch,lines,empty]);
  megaEl=el("div",{cls:"mg-bg",id:"mega"},[sheet]);megaEl.addEventListener("click",function(e){if(e.target===megaEl)closeMega()});
  document.body.appendChild(megaEl);$("#allMenuBtn").setAttribute("aria-expanded","true");
  if(!RM){megaEl.animate([{opacity:0},{opacity:1}],{duration:200});sheet.animate([{transformOrigin:"50% 100%",transform:"perspective(900px) translateY(100%) rotateX(16deg)"},{transformOrigin:"50% 100%",transform:"perspective(900px) translateY(0) rotateX(0)"}],{duration:440,easing:"cubic-bezier(.2,.9,.3,1)"});
    $$(".mg-line",lines).forEach(function(c,i){c.animate([{opacity:0,transformOrigin:"50% 0%",transform:"perspective(900px) translateY(16px) rotateX(-18deg)"},{opacity:1,transformOrigin:"50% 0%",transform:"perspective(900px) translateY(0) rotateX(0)"}],{duration:440,delay:120+i*60,easing:"cubic-bezier(.2,.8,.2,1)",fill:"backwards"})})}
  x.focus()};
$("#allMenuBtn").onclick=openMega;
PRESS_BIG+=",.mg-head,.mg-stop";PRESS_SMALL+=",.mg-x";
`;

for(const F of process.argv.slice(2)){let s=fs.readFileSync(F,"utf8");
  const rep=(a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(F+": expected 1 match, found "+n+": "+a.slice(0,60));s=s.replace(a,()=>b)};
  if(s.includes("/* ===== 전체 메뉴: subway map"))throw new Error(F+": already applied");
  const M="@media (prefers-reduced-motion:reduce){*{transition:none!important}}";rep(M,CSS+"\n"+M);
  rep("/* ---------- connect db ---------- */",JS+"/* ---------- connect db ---------- */");
  fs.writeFileSync(F,s,"utf8");console.log("ok",F.slice(-30))}

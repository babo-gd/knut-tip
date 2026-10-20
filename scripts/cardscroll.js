// Map card row on PC: ‹ › buttons, mouse drag, and mouse wheel all move the row sideways (phones keep finger swipe).
// Usage: node cardscroll.js <page.html> [<page.html> ...]
const fs=require("fs");
const CSS=`
/* ===== map card row: scroll on PC too ===== */
.fm-cards-wrap{position:relative;display:block;width:100%;min-width:0;max-width:none}
.fm-nav{position:absolute;top:calc(50% - 4px);transform:translateY(-50%);z-index:2;width:38px;height:38px;border:0;border-radius:50%;background:var(--card);color:var(--t1);display:grid;place-items:center;cursor:pointer;box-shadow:0 2px 10px rgba(20,20,30,.16);transition:background-color .15s,opacity .15s}
.fm-nav svg{width:18px;height:18px}
.fm-nav:active{background:var(--fill)}
.fm-nav.prev{left:-6px}
.fm-nav.next{right:-6px}
.fm-nav[hidden]{display:none}
@media (hover:none){.fm-nav{display:none!important}}
@media (hover:hover){.fm-cards{cursor:grab}}
.fm-cards.dragging{scroll-snap-type:none!important;cursor:grabbing;user-select:none}
.fm-cards.dragging .fm-card{pointer-events:none}
`;
const JS=`
/* ---------- map card row: ‹ › buttons, mouse drag and wheel move it sideways ---------- */
(function(){var row=$("#fmCards");if(!row)return;var wrap=el("div",{cls:"fm-cards-wrap"});row.parentNode.insertBefore(wrap,row);wrap.appendChild(row);
  var ARW=function(d){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+d+'" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'};
  var prev=el("button",{cls:"fm-nav prev",type:"button","aria-label":"이전 가게"}),next=el("button",{cls:"fm-nav next",type:"button","aria-label":"다음 가게"});
  prev.innerHTML=ARW("M15 5l-7 7 7 7");next.innerHTML=ARW("M9 5l7 7-7 7");wrap.appendChild(prev);wrap.appendChild(next);
  function cardW(){var c=row.querySelector(".fm-card");return c?c.getBoundingClientRect().width+10:row.clientWidth*.8}
  function step(d){row.scrollBy({left:d*cardW(),behavior:RM?"auto":"smooth"})}
  prev.onclick=function(){step(-1);setTimeout(upd,450)};next.onclick=function(){step(1);setTimeout(upd,450)};
  function upd(){var max=row.scrollWidth-row.clientWidth;prev.hidden=row.scrollLeft<=4;next.hidden=max<=4||row.scrollLeft>=max-4}
  row.addEventListener("scroll",upd,{passive:true});new MutationObserver(function(){row.scrollLeft=0;upd()}).observe(row,{childList:true});window.addEventListener("resize",upd);upd();
  /* mouse drag */
  var down=null,dragged=false;
  row.addEventListener("pointerdown",function(e){if(e.pointerType!=="mouse"||e.button!==0)return;down={x:e.clientX,l:row.scrollLeft};dragged=false});
  window.addEventListener("pointermove",function(e){if(!down)return;var dx=e.clientX-down.x;if(!dragged&&Math.abs(dx)>5){dragged=true;row.classList.add("dragging")}if(dragged)row.scrollLeft=down.l-dx});
  window.addEventListener("pointerup",function(){if(!down)return;down=null;if(dragged){row.classList.remove("dragging");setTimeout(function(){dragged=false},0)}});
  row.addEventListener("click",function(e){if(dragged){e.stopPropagation();e.preventDefault()}},true);
  /* wheel: one card per notch while the row can still move that way */
  var wheelLock=0;row.addEventListener("wheel",function(e){if(Math.abs(e.deltaX)>Math.abs(e.deltaY))return;var max=row.scrollWidth-row.clientWidth;if(max<=4)return;
    var d=e.deltaY>0?1:-1;if((d<0&&row.scrollLeft<=4)||(d>0&&row.scrollLeft>=max-4))return;e.preventDefault();var now=Date.now();if(now<wheelLock)return;wheelLock=now+320;step(d)},{passive:false});
})();
`;
for(const F of process.argv.slice(2)){let s=fs.readFileSync(F,"utf8");
  const rep=(a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(F+": expected 1 match, found "+n+": "+a.slice(0,60));s=s.replace(a,()=>b)};
  if(s.includes("/* ===== map card row: scroll on PC"))throw new Error(F+": already applied");
  const M="@media (prefers-reduced-motion:reduce){*{transition:none!important}}";rep(M,CSS+"\n"+M);
  rep("/* ---------- connect db ---------- */",JS+"/* ---------- connect db ---------- */");
  fs.writeFileSync(F,s,"utf8");console.log("ok",F.slice(-30))}

// 노선도 tab bar: the six categories are stations on one line; picking a category runs a small train to that station.
// Usage: node railtab.js <page.html> [<page.html> ...]
const fs=require("fs");

const CSS=`
/* ===== 노선도 tab bar: a train runs to the category you pick ===== */
.tabbar{padding-top:18px!important;--lc:#3d5cf5}
.tb-rail{position:absolute;left:0;right:0;top:9px;height:8px;pointer-events:none}
.tb-track,.tb-fill{position:absolute;top:3px;left:0;height:2px;border-radius:2px;background:var(--fill2)}
.tb-fill{width:0;background:var(--lc);transition:width .5s cubic-bezier(.45,0,.2,1),background-color .3s}
.tb-st{position:absolute;top:0;left:0;width:8px;height:8px;margin-left:-4px;border-radius:50%;background:var(--card);box-shadow:inset 0 0 0 2px var(--fill2);transition:box-shadow .3s}
.tb-st.past{box-shadow:inset 0 0 0 2px var(--lc)}
.tb-train{position:absolute;top:-3px;left:0;width:24px;height:14px;margin-left:-12px;border-radius:5px 9px 9px 5px;background:var(--lc);box-shadow:0 2px 6px rgba(0,0,0,.18);transition:transform .5s cubic-bezier(.45,0,.2,1),background-color .3s}
.tb-train::before{content:"";position:absolute;top:4px;left:5px;width:4px;height:4px;border-radius:1px;background:#fff;box-shadow:6px 0 0 #fff}
.tb-train.rev{border-radius:9px 5px 5px 9px}
.tb-train.rev::before{left:9px}
.tb-rail.still .tb-fill,.tb-rail.still .tb-train{transition:none!important}
.tabbar button[aria-current="page"]{color:var(--lc)!important}
.tabbar button[aria-current="page"] svg{background:color-mix(in srgb,var(--lc) 13%,transparent)!important}
@media (prefers-reduced-motion:reduce){.tb-fill,.tb-train{transition:none!important}}
`;

const JS=`
/* ---------- 노선도 tab bar: a train runs to the category you pick ---------- */
var LINE_C={home:"#3d5cf5",food:"#ff6b5e",move:"#7a55e8",life:"#21b19d",study:"#e8960c",career:"#1696d6"};
(function(){var tb=$("#tabbar");if(!tb)return;
  var rail=el("div",{cls:"tb-rail still","aria-hidden":"true"}),track=el("i",{cls:"tb-track"}),fill=el("i",{cls:"tb-fill"}),train=el("i",{cls:"tb-train"}),dots={};
  rail.appendChild(track);rail.appendChild(fill);$$("button",tb).forEach(function(b){var d=el("i",{cls:"tb-st"});dots[b.dataset.tab]=d;rail.appendChild(d)});rail.appendChild(train);tb.insertBefore(rail,tb.firstChild);
  var lastX=null;
  function place(){var bs=$$("button",tb);if(!bs.length)return;var cur=$('button[aria-current="page"]',tb)||bs[0];var tr=tb.getBoundingClientRect();if(!tr.width)return;
    function cx(b){var r=b.getBoundingClientRect();return r.left-tr.left+r.width/2}
    var x0=cx(bs[0]),x1=cx(bs[bs.length-1]),x=cx(cur);
    track.style.left=fill.style.left=x0+"px";track.style.width=(x1-x0)+"px";fill.style.width=Math.max(0,x-x0)+"px";
    bs.forEach(function(b){var d=dots[b.dataset.tab];d.style.left=cx(b)+"px";d.classList.toggle("past",cx(b)<=x)});
    if(lastX!=null&&x!==lastX)train.classList.toggle("rev",x<lastX);
    train.style.transform="translateX("+x+"px)";tb.style.setProperty("--lc",LINE_C[cur.dataset.tab]||"#3d5cf5");lastX=x;
    if(rail.classList.contains("still")){void rail.offsetWidth;requestAnimationFrame(function(){rail.classList.remove("still")})}}
  var _syncTB=syncTabbar;syncTabbar=function(id){_syncTB(id);place()};
  if(window.ResizeObserver)new ResizeObserver(place).observe(tb);window.addEventListener("resize",place);place()})();
`;

for(const F of process.argv.slice(2)){let s=fs.readFileSync(F,"utf8");
  const rep=(a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(F+": expected 1 match, found "+n+": "+a.slice(0,60));s=s.replace(a,()=>b)};
  if(s.includes("/* ===== 노선도 tab bar"))throw new Error(F+": already applied");
  const M="@media (prefers-reduced-motion:reduce){*{transition:none!important}}";rep(M,CSS+"\n"+M);
  rep("/* ---------- connect db ---------- */",JS+"/* ---------- connect db ---------- */");
  fs.writeFileSync(F,s,"utf8");console.log("ok",F.slice(-30))}

// Subway theme inside each screen:
// - banner: a track along the top, a train in the category colour that pulls in and stops, and a station sign
//   ("② 맛집역 | 다음 이동") that flips like a departure board after the train arrives
// - section menu: a route line in the category colour links the menu icons like stations; tapping a menu runs a
//   train down the line to that stop, lights it up, then opens the section. The last visited stop stays lit.
// Usage: node route.js <page.html> [<page.html> ...]
const fs=require("fs");

const CSS=`
/* ===== subway theme inside each screen ===== */
.hero-track{position:absolute;left:0;right:0;top:13px;height:2px;z-index:0;pointer-events:none;background:repeating-linear-gradient(90deg,rgba(255,255,255,.4) 0 10px,transparent 10px 16px)}
.hero-trn{position:absolute;top:7px;left:22px;z-index:1;width:30px;height:14px;border-radius:5px 9px 9px 5px;background:var(--lc,#3d5cf5);box-shadow:0 0 0 2px #fff,0 3px 8px rgba(0,0,0,.25);pointer-events:none}
.hero-trn::before{content:"";position:absolute;top:4px;left:6px;width:5px;height:4px;border-radius:1px;background:#fff;box-shadow:7px 0 0 #fff}
.scr-hero{padding-top:34px!important}
.st-sign{position:relative;z-index:1;display:inline-flex;align-items:center;gap:7px;margin:0 0 10px;padding:4px 12px 4px 4px;border-radius:999px;background:#fff;color:#1b1f33;font-size:13.5px;font-weight:800;box-shadow:0 3px 0 rgba(10,30,120,.22);transform-origin:50% 0}
.st-no{width:22px;height:22px;border-radius:50%;background:var(--lc,#3d5cf5);color:#fff;display:grid;place-items:center;font-size:12px;font-weight:800}
.st-nx{margin-left:3px;padding-left:9px;border-left:1px solid #e3e5ee;color:#8a90a6;font-size:12px;font-weight:600}
.st-nx::after{content:" ›"}
.scr-hero.enter .st-sign{animation:signFlip .6s cubic-bezier(.3,1.4,.5,1) .5s both}
@keyframes signFlip{0%{opacity:0;transform:perspective(400px) rotateX(-95deg)}55%{opacity:1;transform:perspective(400px) rotateX(18deg)}100%{opacity:1;transform:none}}
.secmenu{position:relative}
.secmenu .sm-row .sm-ic{position:relative;z-index:1}
.rt-seg{position:absolute;z-index:0;width:4px;margin-left:-2px;border-radius:2px;background:var(--lc,#3d5cf5);opacity:.3;pointer-events:none}
.rt-train{position:absolute;z-index:2;width:14px;height:24px;margin:-12px 0 0 -7px;border-radius:7px 7px 5px 5px;background:var(--lc,#3d5cf5);box-shadow:0 0 0 2px var(--card),0 3px 8px rgba(0,0,0,.22);pointer-events:none;opacity:0}
.rt-train::before{content:"";position:absolute;left:4px;top:4px;width:6px;height:5px;border-radius:1px;background:#fff;box-shadow:0 8px 0 #fff}
.sm-row.rt-on .sm-ic{box-shadow:0 0 0 3px var(--card),0 0 0 6px var(--lc,#3d5cf5)!important}
@media (prefers-reduced-motion:reduce){.scr-hero.enter .st-sign{animation:none!important}}
`;

const JS=`
/* ---------- subway theme inside each screen ---------- */
var STN={home:"넛팁 홈",food:"맛집",move:"이동",life:"학교생활",study:"학업·장학",career:"진로"};
function tabOf(n){var p=n.closest("section.panel");return p?p.dataset.tab:"home"}
function heroStation(box){if(!box||box._stn)return;box._stn=true;var tab=tabOf(box),i=TAB_ORDER.indexOf(tab),nx=TAB_ORDER[(i+1)%TAB_ORDER.length];box.style.setProperty("--lc",LINE_C[tab]||"#3d5cf5");
  box.insertBefore(el("i",{cls:"hero-trn","aria-hidden":"true"}),box.firstChild);box.insertBefore(el("i",{cls:"hero-track","aria-hidden":"true"}),box.firstChild);
  var sign=el("div",{cls:"st-sign","aria-label":"지금 "+STN[tab]+"역, 다음 "+STN[nx]+"역"},[el("b",{cls:"st-no",text:String(i+1)}),el("span",{text:STN[tab]+"역"}),el("span",{cls:"st-nx",text:"다음 "+STN[nx]})]);
  var ht=$(".ht",box);box.insertBefore(sign,ht||null)}
function heroArrive(){if(RM)return;$$("section.panel:not([hidden]) .scr-hero .hero-trn").forEach(function(t){t.animate([{transform:"translateX(-90px)"},{transform:"translateX(7px)",offset:.78},{transform:"translateX(0)"}],{duration:760,easing:"cubic-bezier(.25,.8,.3,1)"})})}
$$(".scr-hero").forEach(heroStation);
var _heroEnterR=heroEnter;heroEnter=function(){_heroEnterR();$$(".scr-hero").forEach(heroStation);heroArrive()};heroArrive();
/* section menus become a route map */
function routeLayout(sm){if(!sm||!sm.offsetParent)return;$$(".rt-seg",sm).forEach(function(n){n.remove()});sm.style.setProperty("--lc",LINE_C[tabOf(sm)]||"#3d5cf5");
  var box=sm.getBoundingClientRect(),prev=null;[].slice.call(sm.children).forEach(function(n){
    if(n.classList.contains("sm-group")){prev=null;return}if(!n.classList.contains("sm-row"))return;var ic=$(".sm-ic",n);if(!ic)return;var r=ic.getBoundingClientRect();var c={x:r.left-box.left+r.width/2,y:r.top-box.top+r.height/2};
    if(prev){var s=el("i",{cls:"rt-seg","aria-hidden":"true"});s.style.left=c.x+"px";s.style.top=prev.y+"px";s.style.height=(c.y-prev.y)+"px";sm.insertBefore(s,sm.firstChild)}prev=c});
  if(!$(".rt-train",sm))sm.appendChild(el("i",{cls:"rt-train","aria-hidden":"true"}))}
function icCenter(sm,row){var b=sm.getBoundingClientRect(),r=$(".sm-ic",row).getBoundingClientRect();return {x:r.left-b.left+r.width/2,y:r.top-b.top+r.height/2}}
function routeMark(sm,row){sm._cur=row;$$(".sm-row.rt-on",sm).forEach(function(n){n.classList.remove("rt-on")});row.classList.add("rt-on")}
function routeRun(sm,row,done){var rows=$$(".sm-row",sm),from=sm._cur&&sm._cur.isConnected?sm._cur:rows[0],t=$(".rt-train",sm);if(!t||!$(".sm-ic",row)||!$(".sm-ic",from)){done();return}
  var a=icCenter(sm,from),b=icCenter(sm,row);t.style.left=b.x+"px";t.style.top="0px";
  var an=t.animate([{opacity:0,transform:"translateY("+a.y+"px) scale(.6)"},{opacity:1,transform:"translateY("+a.y+"px) scale(1)",offset:.15},{opacity:1,transform:"translateY("+b.y+"px) scale(1)",offset:.85},{opacity:0,transform:"translateY("+b.y+"px) scale(.6)"}],{duration:Math.min(620,300+Math.abs(b.y-a.y)*.9),easing:"cubic-bezier(.45,0,.2,1)"});
  var fired=false;function go_(){if(fired)return;fired=true;done()}an.onfinish=go_;setTimeout(go_,700)}
$$(".secmenu").forEach(function(sm){routeLayout(sm);if(window.ResizeObserver)new ResizeObserver(function(){routeLayout(sm)}).observe(sm);
  sm.addEventListener("click",function(e){var row=e.target.closest(".sm-row");if(!row||row._rtGo||!$(".sm-ic",row))return;routeLayout(sm);
    if(RM){routeMark(sm,row);return}var link=row.tagName==="A";if(!link){e.preventDefault();e.stopImmediatePropagation()}
    routeRun(sm,row,function(){routeMark(sm,row);if(!link){row._rtGo=true;row.click();row._rtGo=false}})},true)});
var _goRoute=go;go=function(){_goRoute.apply(this,arguments);$$("section.panel:not([hidden]) .secmenu").forEach(routeLayout)};
var _closeRoute=closeSection;closeSection=function(){_closeRoute.apply(this,arguments);$$("section.panel:not([hidden]) .secmenu").forEach(routeLayout)};
`;

for(const F of process.argv.slice(2)){let s=fs.readFileSync(F,"utf8");
  const rep=(a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(F+": expected 1 match, found "+n+": "+a.slice(0,60));s=s.replace(a,()=>b)};
  if(s.includes("/* ===== subway theme inside each screen"))throw new Error(F+": already applied");
  const M="@media (prefers-reduced-motion:reduce){*{transition:none!important}}";rep(M,CSS+"\n"+M);
  rep("/* ---------- connect db ---------- */",JS+"/* ---------- connect db ---------- */");
  fs.writeFileSync(F,s,"utf8");console.log("ok",F.slice(-30))}

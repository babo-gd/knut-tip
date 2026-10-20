// App feel: bottom-sheet details, push/slide screen transitions, staggered list entrance, press feedback,
// a floating mascot, and home sections turned into buttons that open a sheet.
const fs=require("fs"),path=require("path");const F=path.join(__dirname,"knut-tips.html");
let s=fs.readFileSync(F,"utf8");
function rep(a,b){if(s.split(a).length!==2)throw new Error("not unique ("+(s.split(a).length-1)+"): "+a.slice(0,90));s=s.replace(a,()=>b)}

/* detail pop-ups slide up from the bottom like an app sheet */
rep(`    card.animate([{transform:"perspective(1000px) translate("+dx+"px,"+dy+"px) scale(.2) rotateX(-65deg) rotateZ("+(dx>0?6:-6)+"deg)",opacity:0},
      {transform:"perspective(1000px) translate(0,0) scale(1.05) rotateX(10deg)",opacity:1,offset:.62},
      {transform:"perspective(1000px) scale(.985) rotateX(-3deg)",offset:.82},
      {transform:"perspective(1000px) scale(1) rotateX(0)",opacity:1}],{duration:620,easing:"cubic-bezier(.2,.8,.25,1)"});`,
`    card.animate([{transform:"translateY(100%)"},{transform:"translateY(-2%)",offset:.75},{transform:"translateY(0)"}],{duration:460,easing:"cubic-bezier(.2,.9,.3,1)"});`);
rep(`if(card.animate&&!matchMedia("(prefers-reduced-motion: reduce)").matches){card.animate([{transform:"none",opacity:1},{transform:"scale(.92) translateY(12px)",opacity:0}],{duration:160,easing:"ease-in"}).onfinish=done;`,
`if(card.animate&&!matchMedia("(prefers-reduced-motion: reduce)").matches){card.animate([{transform:"translateY(0)"},{transform:"translateY(100%)"}],{duration:220,easing:"ease-in"}).onfinish=done;`);

const CSS=`
/* ===== app feel ===== */
@keyframes floaty{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-7px) rotate(2deg)}}
@keyframes blinkEye{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
.scr-hero .hm svg,.ob-masc svg,.mascot-sm svg{animation:floaty 3.2s ease-in-out infinite;transform-origin:50% 90%}
/* detail pop-ups as bottom sheets */
.pop-bg{align-items:flex-end!important;padding:0!important}
.pop{width:min(440px,100%)!important;max-height:86vh!important;border-radius:28px 28px 0 0!important;padding:14px 20px 26px!important}
.pop::after{content:"";position:absolute;top:8px;left:50%;width:40px;height:5px;margin-left:-20px;border-radius:3px;background:var(--line)}
.pop .x{top:14px!important}
.pop h2{margin-top:16px!important}
/* press feedback on everything tappable */
.sm-row,.cat-btn,.quick button,.lg-card,.trow,.hot-row,.prow,.dg-row,.mini,.ob-opt,.aud-links button,.fl-row,.hb-btn{transition:transform .14s cubic-bezier(.3,.7,.4,1.3),background-color .2s,box-shadow .2s}
.sm-row:active,.cat-btn:active,.quick button:active,.lg-card:active,.trow:active,.hot-row:active,.prow:active,.dg-row:active,.mini:active,.ob-opt:active,.aud-links button:active,.fl-row:active,.hb-btn:active{transform:scale(.965)!important}
.sm-row{border-radius:14px;margin:0 -8px;padding-inline:8px!important;width:calc(100% + 16px)!important}
.sm-row:hover{background:var(--soft)}
.sm-row:hover .sm-go,.hb-btn:hover .hb-go{transform:translateX(3px)}
.sm-go,.hb-go{transition:transform .2s}
.quick button:hover .ic{transform:translateY(-3px) scale(1.05)}
.quick .ic{transition:transform .2s cubic-bezier(.3,.7,.4,1.4)}
/* home section buttons */
.hb-btn{display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;width:100%;padding:18px;border:0;border-radius:22px;background:var(--card);color:var(--t1);font:inherit;text-align:left;cursor:pointer;box-shadow:0 1px 2px rgba(20,30,70,.04),0 6px 20px rgba(20,30,70,.05);position:relative;overflow:hidden}
.hb-btn::after{content:"";position:absolute;right:-30px;top:-30px;width:110px;height:110px;border-radius:50%;background:var(--hbc,#eef1ff);opacity:.55}
.hb-ic{position:relative;z-index:1;width:48px;height:48px;border-radius:16px;display:grid;place-items:center;color:#fff;background:var(--hbi,var(--hero))}
.hb-ic svg{width:24px;height:24px}
.hb-main{position:relative;z-index:1;display:flex;flex-direction:column;min-width:0}
.hb-t{font-size:17px;font-weight:700}
.hb-s{font-size:13px;color:var(--t3);margin-top:2px}
.hb-go{position:relative;z-index:1;font-size:22px;color:var(--t3)}
.stop.hb{margin-top:14px!important}
.stop.hb>.stop-head{display:none}
.hb-store{display:none}
/* generic bottom sheet */
.bs-bg{position:fixed;inset:0;z-index:55;background:rgba(10,20,60,.42);display:flex;justify-content:center;align-items:flex-end}
.bs{width:min(440px,100%);max-height:88vh;overflow:auto;background:var(--page);border-radius:28px 28px 0 0;box-shadow:0 -10px 40px rgba(10,20,60,.25);padding:10px 18px 28px}
.bs-grab{width:44px;height:5px;border-radius:3px;background:var(--line);margin:4px auto 12px;cursor:grab;touch-action:none}
.bs-head{display:flex;align-items:center;gap:12px;margin-bottom:6px}
.bs-head .hb-ic{width:42px;height:42px;border-radius:14px}
.bs-head h2{flex:1;margin:0;font-size:20px!important}
.bs-x{width:36px;height:36px;border-radius:50%;border:0;background:var(--chip);color:var(--t2);font-size:16px;cursor:pointer}
.bs .hb-store{display:block}
@media (prefers-reduced-motion:reduce){.scr-hero .hm svg,.ob-masc svg,.mascot-sm svg{animation:none}}
`;
rep(`@media (prefers-reduced-motion:reduce){*{transition:none!important}}`,CSS+`@media (prefers-reduced-motion:reduce){*{transition:none!important}}`);

rep(`/* ---------- connect db ---------- */`,`/* ---------- app feel: motion helpers ---------- */
var RM=matchMedia("(prefers-reduced-motion: reduce)").matches;
function stagger(nodes,dy){if(RM)return;nodes.slice(0,14).forEach(function(n,i){n.animate([{opacity:0,transform:"translateY("+(dy||14)+"px)"},{opacity:1,transform:"none"}],{duration:360,delay:60+i*45,easing:"cubic-bezier(.2,.8,.2,1)",fill:"backwards"})})}
function pushIn(node,dir){if(RM||!node)return;node.animate([{opacity:0,transform:"translateX("+(dir||1)*36+"px)"},{opacity:1,transform:"none"}],{duration:320,easing:"cubic-bezier(.2,.8,.2,1)"})}
var _openSection=openSection;openSection=function(tab,st){_openSection(tab,st);pushIn(st,1);var bb=$(".backbar");pushIn(bb,1);
  stagger([].slice.call(st.querySelectorAll(".trow,.dg-row,.prow,.fl-row,.card,.tipx,tr,.dl-row,.checklist label")).filter(function(n){return n.offsetParent}))};
var _closeSection=closeSection;closeSection=function(tab){_closeSection(tab);var p=$('section.panel[data-tab="'+tab+'"]');var m=p&&$(".secmenu",p);if(m){pushIn(m,-1);stagger([].slice.call(m.querySelectorAll(".sm-row")))}};
var _go2=go;go=function(id){var before=($$("section.panel").filter(function(p){return !p.hidden})[0]||{}).dataset;_go2(id);var t=ALIAS[id]||id;if(before&&before.tab===t)return;
  if(RM)return;var vis=$$('section.panel[data-tab="'+t+'"]');vis.forEach(function(p){p.animate([{opacity:0,transform:"translateY(10px)"},{opacity:1,transform:"none"}],{duration:300,easing:"cubic-bezier(.2,.8,.2,1)"})});
  var m=vis[0]&&$(".secmenu",vis[0]);if(m)stagger([].slice.call(m.querySelectorAll(".sm-row")),10)};

/* ---------- generic bottom sheet ---------- */
function openSheet(o){var holder=o.node.parentNode,mark=document.createComment("sheet");holder.insertBefore(mark,o.node);
  var x=el("button",{cls:"bs-x",type:"button","aria-label":"닫기",text:"✕"});var ic=el("span",{cls:"hb-ic",style:"--hbi:"+o.color});ic.innerHTML=svgI(o.icon);
  var grab=el("div",{cls:"bs-grab","aria-hidden":"true"});var sheet=el("div",{cls:"bs",role:"dialog","aria-modal":"true","aria-label":o.title},[grab,el("div",{cls:"bs-head"},[ic,el("h2",{text:o.title}),x])]);
  sheet.appendChild(o.node);var bg=el("div",{cls:"bs-bg"},[sheet]);document.body.appendChild(bg);
  if(!RM){sheet.animate([{transform:"translateY(100%)"},{transform:"translateY(-2%)",offset:.75},{transform:"none"}],{duration:460,easing:"cubic-bezier(.2,.9,.3,1)"});bg.animate([{opacity:0},{opacity:1}],{duration:250});stagger([].slice.call(o.node.querySelectorAll(".place,.tipx,.card,.checklist label")),18)}
  var closed=false;function close(){if(closed)return;closed=true;document.removeEventListener("keydown",esc);var fin=function(){mark.parentNode.insertBefore(o.node,mark);mark.remove();bg.remove();if(o.origin)try{o.origin.focus()}catch(e){}};
    if(RM)fin();else{sheet.animate([{transform:"none"},{transform:"translateY(100%)"}],{duration:220,easing:"ease-in"}).onfinish=fin;bg.animate([{opacity:1},{opacity:0}],{duration:220})}}
  function esc(e){if(e.key==="Escape")close()}document.addEventListener("keydown",esc);
  x.onclick=close;bg.addEventListener("click",function(e){if(e.target===bg)close()});
  var sy=null;grab.addEventListener("pointerdown",function(e){sy=e.clientY;grab.setPointerCapture(e.pointerId)});
  grab.addEventListener("pointermove",function(e){if(sy==null)return;var d=Math.max(0,e.clientY-sy);sheet.style.transform="translateY("+d+"px)"});
  grab.addEventListener("pointerup",function(e){if(sy==null)return;var d=e.clientY-sy;sy=null;if(d>90)close();else sheet.style.transform=""});
  x.focus()}

/* ---------- home sections become buttons that open a sheet ---------- */
(function(){var HB={"학생들이 가장 많이 추천한 곳":["맛집 TOP 3 · 생활꿀팁 TOP 3","star","#f0a020","#fff4dc"],"입학 전·첫 주 체크리스트":["입학 전·첫 주에 할 일 9가지","clock","#2fb8a5","#e3f6f3"],"선배가 알려주는 첫 학기 생존법":["선배 꿀팁 카드 5장","study","#3b55e6","#eef1ff"]};
  $$('section.panel[data-tab="home"] > .stop').forEach(function(st){if(st.id==="forMeStop")return;var h=$(".stop-head h2",st);if(!h)return;var title=h.textContent.trim();var cfg=HB[title];if(!cfg)return;
    var store_=el("div",{cls:"hb-store"});[].slice.call(st.childNodes).forEach(function(n){if(!(n.classList&&n.classList.contains("stop-head")))store_.appendChild(n)});
    var ic=el("span",{cls:"hb-ic",style:"--hbi:"+cfg[2]});ic.innerHTML=svgI(cfg[1]);
    var b=el("button",{cls:"hb-btn",type:"button",style:"--hbc:"+cfg[3]},[ic,el("span",{cls:"hb-main"},[el("span",{cls:"hb-t",text:title}),el("span",{cls:"hb-s",text:cfg[0]})]),el("span",{cls:"hb-go",text:"›"})]);
    b.onclick=function(){openSheet({title:title,node:store_,icon:cfg[1],color:cfg[2],origin:b})};
    st.classList.add("hb");st.appendChild(b);st.appendChild(store_)})})();
/* ---------- connect db ---------- */`);
fs.writeFileSync(F,s,"utf8");console.log("ok");

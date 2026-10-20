// Bouncy category banner: round Jua title that pops in line by line, a candy pill, a speech bubble from the mascot,
// a mascot that hops (squash & stretch) and waves, floating sparkles, and a big "boing" when you tap the mascot.
// The rest of the app keeps its calm motion. Everything stops when the device asks for reduced motion.
// Usage: node herofun.js <page.html> [<page.html> ...]
const fs=require("fs");

const CSS=`
/* ===== bouncy category banner ===== */
.scr-hero .ht.fun{font-family:"Jua",var(--pf)!important;font-weight:400!important;font-size:31px!important;line-height:1.22!important;letter-spacing:0!important;text-shadow:0 3px 0 rgba(10,30,120,.28);max-width:64%}
.scr-hero .ht .ln{display:inline-block;transform-origin:20% 80%}
@media (max-width:420px){.scr-hero .ht.fun{font-size:26px!important;max-width:68%}}
@media (max-width:350px){.scr-hero .ht.fun{font-size:23px!important}}
.scr-hero .hp.fun{font-family:"Jua",var(--pf)!important;font-weight:400!important;font-size:14.5px!important;background:#ffd84d!important;color:#3d2c00!important;backdrop-filter:none!important;padding:6px 14px 6px 12px!important;box-shadow:0 3px 0 rgba(120,80,0,.28);transform-origin:10% 50%}
.scr-hero .hp.fun::before{background:#3d2c00!important;width:7px!important;height:7px!important}
.scr-hero .hb{background:#fff!important;color:var(--t1)!important;border:0!important;border-radius:22px!important;box-shadow:0 5px 0 rgba(10,30,120,.22)!important;font-weight:600;font-size:15px!important;line-height:1.55!important;margin-top:20px!important;transform-origin:85% 0%}
.scr-hero .hb::before{content:"";position:absolute;top:-9px;right:52px;width:20px;height:12px;background:#fff;clip-path:polygon(50% 0,100% 100%,0 100%)}
:root[data-theme="dark"] .scr-hero .hb,:root[data-theme="dark"] .scr-hero .hb::before{background:#1f2640!important}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .scr-hero .hb,:root:not([data-theme="light"]) .scr-hero .hb::before{background:#1f2640!important}}
.scr-hero .hm{cursor:pointer;-webkit-tap-highlight-color:transparent}
.scr-hero .hm svg{animation:none!important;overflow:visible}
.m-body{transform-box:view-box;transform-origin:60px 106px;animation:mHop 2.8s cubic-bezier(.3,.7,.4,1) infinite}
.m-shadow{transform-box:view-box;transform-origin:60px 110px;animation:mShadow 2.8s cubic-bezier(.3,.7,.4,1) infinite}
.m-hr{transform-box:view-box;transform-origin:88px 76px;animation:mWave 2.8s ease-in-out infinite}
.m-hl{transform-box:view-box;transform-origin:32px 78px;animation:mFlap 2.8s ease-in-out infinite}
@keyframes mHop{0%,52%,100%{transform:translateY(0) scale(1,1)}60%{transform:translateY(0) scale(1.1,.88)}70%{transform:translateY(-18px) scale(.94,1.08)}80%{transform:translateY(0) scale(1.08,.9)}88%{transform:translateY(0) scale(.97,1.03)}}
@keyframes mShadow{0%,52%,100%{transform:scale(1);opacity:1}70%{transform:scale(.62);opacity:.55}80%{transform:scale(1.08)}}
@keyframes mWave{0%,8%,48%,100%{transform:rotate(0)}16%{transform:rotate(-28deg)}24%{transform:rotate(8deg)}32%{transform:rotate(-24deg)}40%{transform:rotate(4deg)}}
@keyframes mFlap{0%,60%,100%{transform:rotate(0)}70%{transform:rotate(18deg)}80%{transform:rotate(-6deg)}}
.hm.boing .m-body{animation:mBoing .8s cubic-bezier(.3,1.5,.5,1)}
.hm.boing .m-shadow{animation:mShadow .8s ease-out}
@keyframes mBoing{0%{transform:none}25%{transform:translateY(4px) scale(1.16,.82)}50%{transform:translateY(-30px) scale(.9,1.12) rotate(-10deg)}72%{transform:translateY(0) scale(1.12,.88) rotate(4deg)}86%{transform:scale(.96,1.04)}100%{transform:none}}
.hero-deco{position:absolute;inset:0;pointer-events:none;z-index:0}
.hero-deco i{position:absolute;display:block;animation:dBob 3.4s ease-in-out infinite}
.hero-deco .st{width:16px;height:16px;background:#ffd84d;clip-path:polygon(50% 0,61% 38%,100% 50%,61% 62%,50% 100%,39% 62%,0 50%,39% 38%)}
.hero-deco .rg{width:14px;height:14px;border-radius:50%;box-shadow:inset 0 0 0 3px rgba(255,255,255,.55)}
.hero-deco .dt{width:9px;height:9px;border-radius:50%;background:#7ef0dc}
@keyframes dBob{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-8px) rotate(20deg)}}
.scr-hero.enter .ln{animation:popIn .62s cubic-bezier(.3,1.6,.5,1) both}
.scr-hero.enter .hp.fun{animation:popIn .55s cubic-bezier(.3,1.6,.5,1) .22s both}
.scr-hero.enter .hm{animation:dropIn .75s cubic-bezier(.3,1.5,.5,1) .05s both}
.scr-hero.enter .hb{animation:bubbleIn .55s cubic-bezier(.3,1.5,.5,1) .38s both}
@keyframes popIn{0%{opacity:0;transform:translateY(14px) scale(.6)}60%{opacity:1}100%{opacity:1;transform:none}}
@keyframes dropIn{0%{opacity:0;transform:translateY(-46px) scale(.7)}55%{opacity:1;transform:translateY(4px) scale(1.06,.94)}100%{opacity:1;transform:none}}
@keyframes bubbleIn{0%{opacity:0;transform:scale(.6)}100%{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.m-body,.m-shadow,.m-hr,.m-hl,.hero-deco i,.scr-hero.enter .ln,.scr-hero.enter .hp.fun,.scr-hero.enter .hm,.scr-hero.enter .hb,.hm.boing .m-body{animation:none!important}}
`;

const JS=`
/* ---------- bouncy category banner ---------- */
function heroFun(box){if(!box||box.dataset.fun)return;box.dataset.fun="1";
  var ht=$(".ht",box);if(ht){var lines=[[]];[].slice.call(ht.childNodes).forEach(function(n){if(n.nodeName==="BR")lines.push([]);else lines[lines.length-1].push(n.textContent)});
    ht.textContent="";lines.forEach(function(l,i){if(i)ht.appendChild(el("br"));var sp=el("span",{cls:"ln",text:l.join("")});sp.style.animationDelay=(i*0.09)+"s";ht.appendChild(sp)});ht.classList.add("fun")}
  var hp=$(".hp",box);if(hp)hp.classList.add("fun");
  var deco=el("div",{cls:"hero-deco","aria-hidden":"true"});[["st","8%","56%","0s"],["rg","46%","14%","-1.1s"],["dt","58%","50%","-2s"],["st","90%","74%","-1.6s"],["dt","30%","82%","-.6s"]].forEach(function(d){var i=el("i",{cls:d[0]});i.style.left=d[1];i.style.top=d[2];i.style.animationDelay=d[3];deco.appendChild(i)});box.insertBefore(deco,box.firstChild);
  var hm=$(".hm",box),svg=hm&&$("svg",hm);if(svg){var NS="http://www.w3.org/2000/svg",kids=[].slice.call(svg.children).filter(function(n){return n.nodeName!=="defs"});
    if(kids.length>4){var mk=function(c){var g=document.createElementNS(NS,"g");g.setAttribute("class",c);return g};var sh=mk("m-shadow"),body=mk("m-body"),hl=mk("m-hl"),hr=mk("m-hr");
      svg.insertBefore(sh,kids[0]);sh.appendChild(kids[0]);svg.appendChild(body);hl.appendChild(kids[1]);hr.appendChild(kids[2]);body.appendChild(hl);body.appendChild(hr);kids.slice(3).forEach(function(n){body.appendChild(n)})}
    hm.setAttribute("role","button");hm.setAttribute("aria-label","마스코트 누르기");hm.tabIndex=0;
    var boing=function(){hm.classList.remove("boing");void hm.offsetWidth;hm.classList.add("boing");clearTimeout(hm._bt);hm._bt=setTimeout(function(){hm.classList.remove("boing")},850)};
    hm.addEventListener("click",boing);hm.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();boing()}})}}
function heroEnter(){$$("section.panel:not([hidden]) .scr-hero").forEach(function(b){heroFun(b);b.classList.remove("enter");void b.offsetWidth;b.classList.add("enter")})}
$$(".scr-hero").forEach(heroFun);heroEnter();
var _goHero=go;go=function(id){var before=($$("section.panel").filter(function(p){return !p.hidden})[0]||{}).dataset;_goHero.apply(this,arguments);var t=ALIAS[id]||id;if(!before||before.tab!==t)heroEnter()};
`;

for(const F of process.argv.slice(2)){let s=fs.readFileSync(F,"utf8");
  const rep=(a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(F+": expected 1 match, found "+n+": "+a.slice(0,60));s=s.replace(a,()=>b)};
  if(s.includes("/* ===== bouncy category banner"))throw new Error(F+": already applied");
  // let the playful title/pill keep their own font instead of the global Pretendard rule
  rep(`:not(.ob-logo .ko){font-family:var(--pf)!important}`,`:not(.ob-logo .ko):not(.fun):not(.fun *){font-family:var(--pf)!important}`);
  const M="@media (prefers-reduced-motion:reduce){*{transition:none!important}}";rep(M,CSS+"\n"+M);
  rep("/* ---------- connect db ---------- */",JS+"/* ---------- connect db ---------- */");
  fs.writeFileSync(F,s,"utf8");console.log("ok",F.slice(-30))}

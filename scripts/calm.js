// Calm layer, modeled on the 가치관 소개팅 app: Pretendard font, short fades (0.2s), sheets that rise in 0.25s
// without overshoot, buttons that darken when pressed instead of shrinking, flatter cards.
// Usage: node calm.js <pretendard-subset.woff2> <page.html> [<page.html> ...]
const fs=require("fs");
const [fontFile,...pages]=process.argv.slice(2);
const FONT=fs.readFileSync(fontFile).toString("base64");

const CSS=`
/* ===== calm layer: Pretendard + motion like 가치관 소개팅 ===== */
@font-face{font-family:"Pretendard KNUT";font-weight:400 800;font-style:normal;font-display:swap;src:url(data:font/woff2;base64,${FONT}) format("woff2")}
:root{--pf:"Pretendard KNUT","Pretendard Variable",Pretendard,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",system-ui,sans-serif;--f-ui:var(--pf)!important;--f-display:var(--pf);--f-body:var(--pf);--f-mono:var(--pf);
  --ez:cubic-bezier(.2,.8,.2,1);--sh1:0 1px 2px rgba(20,20,30,.04),0 4px 16px rgba(20,20,30,.05);--page:#f7f6f4;--fill:#f2f1ee;--fill2:#e9e8e4}
html body,html body *:not(.wm-en):not(.wm-en *):not(.wm-ko):not(.ob-logo .en):not(.ob-logo .en *):not(.ob-logo .ko){font-family:var(--pf)!important}
body{line-height:1.5;word-break:keep-all;-webkit-font-smoothing:antialiased;letter-spacing:-.01em!important}
h1,h2,h3,.scr-hero .ht,.stop-head h2,.pop h2,.bs-head h2,.ob-h,.ob-title,.deptgate h2,.survey-h h2{font-weight:800!important;letter-spacing:-.02em!important}
.sm-t,.cb-t,.hb-t,.tr-nm,.fm-cm b,.ml-ch b,.mini .v,.aud-links button,.lg-card b{font-weight:700!important;letter-spacing:-.015em!important}
.sm-s,.cb-s,.hb-s,.tr-sub,.note,.lead,.mini .s,.fm-cm small{font-weight:500}

/* press = colour change, not bounce */
.sm-row,.cat-btn,.quick button,.lg-card,.trow,.hot-row,.prow,.dg-row,.mini,.ob-opt,.aud-links button,.fl-row,.hb-btn,.fm-card,.fm-listbtn,.btn,.ob-go,.chip,.cats button,.filters button,.seg button,.ml-days button,.ml-slots button,.fm-seg button,.fm-ctl button,.acct-av,.allmenu-btn,.tabbar button{transition:background-color .15s,color .15s,border-color .15s,box-shadow .15s,opacity .15s!important}
.sm-row:active,.cat-btn:active,.lg-card:active,.trow:active,.hot-row:active,.prow:active,.dg-row:active,.mini:active,.ob-opt:active,.aud-links button:active,.fl-row:active,.hb-btn:active,.fm-card:active,.fm-listbtn:active,.btn:active,.ob-go:active,.quick button:active{transform:none!important}
.sm-row:active,.cat-btn:active,.trow:active,.hot-row:active,.prow:active,.dg-row:active,.fl-row:active,.lg-card:active,.mini:active,.hb-btn:active,.fm-card:active,.fm-listbtn:active{background:var(--fill)!important}
.aud-links button:active,.btn:not(.primary):active{background:var(--fill2)!important}
.btn.primary:active,.ob-go:active{background:var(--hero2)!important;box-shadow:none!important}
.chip:active,.cats button:active,.filters button:active,.fm-seg button:active,.fm-ctl button:active,.allmenu-btn:active{background:var(--fill)!important}
.quick button:active .ic{opacity:.7}
.quick button:hover .ic,.sm-row:hover .sm-go,.hb-btn:hover .hb-go{transform:none!important}
.quick .ic,.sm-go,.hb-go{transition:opacity .15s!important}
.fm-dot{transition:transform .2s var(--ez)!important}

/* flatter cards, radius 20 like the dating app */
.card,.tablewrap,.tile,.deptcard,.tipx,.secmenu,.ml-card,.fm-card,.fm-listbtn,.hb-btn,.mini,.searchbar,.ml-days button{box-shadow:var(--sh1)!important}
.card,.secmenu,.ml-card,.hb-btn,.mini{border-radius:20px!important}
.btn.primary,.ob-go{box-shadow:none!important}
.hb-btn::after{opacity:.35!important}

/* gentle motion */
@keyframes kfloat{50%{transform:translateY(-6px)}}
@keyframes kfade{from{opacity:0}}
.scr-hero .hm svg,.ob-masc svg,.mascot-sm svg{animation:kfloat 3s ease-in-out infinite!important}
.pop-bg,.bs-bg{background:rgba(0,0,0,.45)!important;animation:kfade .2s}
.onboard{animation:kfade .2s}
@media (prefers-reduced-motion:reduce){.scr-hero .hm svg,.ob-masc svg,.mascot-sm svg,.pop-bg,.bs-bg,.onboard{animation:none!important}}
`;

const JS=`
/* ---------- calm motion (like 가치관 소개팅): short fades, no overshoot, no cascade ---------- */
stagger=function(nodes){if(RM)return;nodes.slice(0,8).forEach(function(n,i){n.animate([{opacity:0},{opacity:1}],{duration:200,delay:i*20,easing:"ease-out",fill:"backwards"})})};
pushIn=function(node,dir){if(RM||!node)return;node.animate([{opacity:0,transform:"translateX("+(dir||1)*10+"px)"},{opacity:1,transform:"none"}],{duration:220,easing:"cubic-bezier(.2,.8,.2,1)"})};
`;

const REPL=[
  // detail pop-up: rise 0.26s, no 2% overshoot
  [`card.animate([{transform:"translateY(100%)"},{transform:"translateY(-2%)",offset:.75},{transform:"translateY(0)"}],{duration:460,easing:"cubic-bezier(.2,.9,.3,1)"});`,
   `card.animate([{transform:"translateY(100%)"},{transform:"translateY(0)"}],{duration:260,easing:"cubic-bezier(.2,.8,.2,1)"});`],
  // generic sheet: same
  [`sheet.animate([{transform:"translateY(100%)"},{transform:"translateY(-2%)",offset:.75},{transform:"none"}],{duration:460,easing:"cubic-bezier(.2,.9,.3,1)"});bg.animate([{opacity:0},{opacity:1}],{duration:250});`,
   `sheet.animate([{transform:"translateY(100%)"},{transform:"none"}],{duration:260,easing:"cubic-bezier(.2,.8,.2,1)"});bg.animate([{opacity:0},{opacity:1}],{duration:200});`],
  // tab change: short fade with a 6px rise
  [`p.animate([{opacity:0,transform:"translateY(10px)"},{opacity:1,transform:"none"}],{duration:300,easing:"cubic-bezier(.2,.8,.2,1)"})`,
   `p.animate([{opacity:0,transform:"translateY(6px)"},{opacity:1,transform:"none"}],{duration:220,easing:"cubic-bezier(.2,.8,.2,1)"})`],
  // closing: quick and soft
  [`card.animate([{transform:"translateY(0)"},{transform:"translateY(100%)"}],{duration:220,easing:"ease-in"}).onfinish=done;`,
   `card.animate([{transform:"translateY(0)"},{transform:"translateY(100%)"}],{duration:200,easing:"cubic-bezier(.4,0,1,1)"}).onfinish=done;`],
];

for(const F of pages){let s=fs.readFileSync(F,"utf8");
  const rep=(a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(F+": expected 1 match, found "+n+": "+a.slice(0,70));s=s.replace(a,()=>b)};
  if(s.includes("/* ===== calm layer"))throw new Error(F+": calm layer already applied");
  REPL.forEach(([a,b])=>rep(a,b));
  // drop the 경기천년바탕 faces (no longer used)
  const fa=s.indexOf('@font-face{font-family:"GyeonggiBatang";font-weight:400');const fb=s.indexOf("\n",s.indexOf('@font-face{font-family:"GyeonggiBatang";font-weight:700'))+1;
  if(fa<0||fb<=0)throw new Error(F+": batang faces not found");s=s.slice(0,fa)+s.slice(fb);
  const M="@media (prefers-reduced-motion:reduce){*{transition:none!important}}";rep(M,CSS+"\n"+M);
  rep("/* ---------- connect db ---------- */",JS+"/* ---------- connect db ---------- */");
  fs.writeFileSync(F,s,"utf8");console.log("ok",F.slice(-30),Math.round(Buffer.byteLength(s)/1024)+"KB")}

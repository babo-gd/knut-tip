// (1) 학업·진로 open only after a department is chosen. (2) A more three-dimensional conductor cap on the mascot and logo.
const fs=require("fs"),path=require("path");const F=path.join(__dirname,"knut-tips.html");
let s=fs.readFileSync(F,"utf8");
function rep(a,b){if(s.split(a).length!==2)throw new Error("not unique ("+(s.split(a).length-1)+"): "+a.slice(0,90));s=s.replace(a,()=>b)}

/* ---------- mascot with a 3D conductor cap ---------- */
const m0=s.indexOf("function mascot(id,mood){");const m1=s.indexOf(`(function(){var m=$("#audMascot")`,m0);
if(m0<0||m1<0)throw new Error("mascot fn");
s=s.slice(0,m0)+`function mascot(id,mood){var g="mg"+id;
 return '<svg viewBox="0 0 120 120" aria-hidden="true"><defs>'+
 '<radialGradient id="'+g+'b" cx="38%" cy="40%" r="68%"><stop offset="0" stop-color="#ffffff"/><stop offset=".72" stop-color="#eef2fb"/><stop offset="1" stop-color="#c5cfe8"/></radialGradient>'+
 '<linearGradient id="'+g+'c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a6cf0"/><stop offset=".55" stop-color="#1a3aa8"/><stop offset="1" stop-color="#0b2470"/></linearGradient>'+
 '<linearGradient id="'+g+'t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6d88f7"/><stop offset="1" stop-color="#2a49c4"/></linearGradient>'+
 '<linearGradient id="'+g+'v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b2f45"/><stop offset="1" stop-color="#0e1020"/></linearGradient>'+
 '<linearGradient id="'+g+'r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b03a3a"/><stop offset="1" stop-color="#5e0f12"/></linearGradient>'+
 '<radialGradient id="'+g+'g" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#fff3c4"/><stop offset=".55" stop-color="#ffc93c"/><stop offset="1" stop-color="#c98a00"/></radialGradient>'+
 '</defs>'+
 '<ellipse cx="60" cy="110" rx="30" ry="5.5" fill="rgba(13,46,139,.18)"/>'+
 '<ellipse cx="25" cy="76" rx="9" ry="7" fill="url(#'+g+'b)"/><ellipse cx="95" cy="70" rx="9" ry="7" fill="url(#'+g+'b)" transform="rotate(-25 95 70)"/>'+
 '<circle cx="60" cy="70" r="35" fill="url(#'+g+'b)"/>'+
 /* soft shadow the cap casts on the head */
 '<ellipse cx="60" cy="52" rx="29" ry="6" fill="rgba(20,35,90,.18)"/>'+
 /* crown: domed top that leans slightly back */
 '<path d="M24 40 C24 22 42 13 60 13 C78 13 96 22 96 40 Z" fill="url(#'+g+'c)"/>'+
 '<ellipse cx="60" cy="21" rx="30" ry="8.5" fill="url(#'+g+'t)"/>'+
 '<ellipse cx="51" cy="19" rx="13" ry="3.2" fill="rgba(255,255,255,.35)"/>'+
 /* burgundy band with a light edge */
 '<path d="M24 38 Q60 46 96 38 L96 46 Q60 54 24 46 Z" fill="url(#'+g+'r)"/>'+
 '<path d="M24 38 Q60 46 96 38" stroke="rgba(255,255,255,.35)" stroke-width="1.2" fill="none"/>'+
 /* visor sticking forward, glossy */
 '<path d="M27 46 Q60 56 93 46 Q90 58 60 60 Q30 58 27 46 Z" fill="url(#'+g+'v)"/>'+
 '<path d="M38 52 Q60 57 82 52" stroke="rgba(255,255,255,.28)" stroke-width="1.6" fill="none" stroke-linecap="round"/>'+
 /* gold badge with a tiny route mark */
 '<circle cx="60" cy="33" r="7" fill="url(#'+g+'g)" stroke="#a87300" stroke-width=".8"/>'+
 '<path d="M56 35.5 L59 31.5 L61.5 33.5 L64.5 29.5" stroke="#5a3d00" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'+
 /* face */
 (mood==="wink"?'<path d="M43 71 q5 -4 10 0" stroke="#1c1f2a" stroke-width="3" fill="none" stroke-linecap="round"/>':'<ellipse cx="48" cy="71" rx="3.5" ry="4.5" fill="#1c1f2a"/><circle cx="49.2" cy="69.4" r="1.2" fill="#fff"/>')+
 '<ellipse cx="72" cy="71" rx="3.5" ry="4.5" fill="#1c1f2a"/><circle cx="73.2" cy="69.4" r="1.2" fill="#fff"/>'+
 '<ellipse cx="41" cy="81" rx="5.2" ry="3" fill="#ffb3c1" opacity=".85"/><ellipse cx="79" cy="81" rx="5.2" ry="3" fill="#ffb3c1" opacity=".85"/>'+
 '<path d="M53 82 q7 6.5 14 0" stroke="#1c1f2a" stroke-width="2.6" fill="none" stroke-linecap="round"/></svg>'}
`+s.slice(m1);

/* logo icon uses the same cap */
const i0=s.indexOf(`<span class="logo-icon" aria-hidden="true">`);const i1=s.indexOf(`</span>`,i0)+7;
s=s.slice(0,i0)+`<span class="logo-icon" aria-hidden="true" id="logoFace"></span>`+s.slice(i1);
rep(`(function(){var m=$("#audMascot");if(m)m.innerHTML=mascot("aud","wink")})();`,`(function(){var m=$("#audMascot");if(m)m.innerHTML=mascot("aud","wink");var l=$("#logoFace");if(l)l.innerHTML=mascot("logo","wink")})();`);

/* ---------- department gate for 학업·장학 and 진로 ---------- */
const CSS=`
/* ===== department gate ===== */
.deptgate{margin-top:14px}
.deptgate h2{font-size:19px!important;margin:0 0 4px}
.deptgate h2::before{display:none}
.dg-camp{display:flex;gap:8px;margin:14px 0 6px}
.dg-list{display:flex;flex-direction:column;margin-top:8px}
.dg-col{font-size:13px;font-weight:700;color:var(--t3);padding:14px 2px 4px}
.dg-row{display:flex;justify-content:space-between;align-items:center;gap:10px;width:100%;padding:13px 4px;border:0;border-bottom:1px solid var(--line);background:none;color:var(--t1);font:inherit;font-size:16px;text-align:left;cursor:pointer}
.dg-row:last-child{border-bottom:0}
.dg-row span{color:var(--t3);font-size:20px}
.dg-row[aria-pressed="true"]{color:var(--mint-ink);font-weight:700}
.mydept{display:flex;align-items:center;gap:12px;margin-top:14px;padding:14px 16px!important}
.mydept .md-ic{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:var(--mint-bg);color:var(--mint-ink)}
.mydept .md-ic svg{width:22px;height:22px}
.mydept .md-main{flex:1;min-width:0;display:flex;flex-direction:column}
.mydept .md-k{font-size:12.5px;color:var(--t3)}
.mydept .md-v{font-size:16.5px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
section.panel.gate-mode .secmenu,section.panel.gate-mode .stop,section.panel.gate-mode h1.sub,section.panel.gate-mode .backbar,section.panel.gate-mode .mydept{display:none!important}
section.panel.sub-mode .deptgate,section.panel.sub-mode .mydept{display:none!important}
.sm-row.mine .sm-ic{background:var(--mint-bg);color:var(--mint-ink)}
`;
rep(`@media (prefers-reduced-motion:reduce){*{transition:none!important}}`,CSS+`@media (prefers-reduced-motion:reduce){*{transition:none!important}}`);

rep(`/* ---------- connect db ---------- */`,`/* ---------- department gate: 학업·장학 and 진로 open after choosing a 학과 ---------- */
var GATE_TABS=["study","career"];
var myDept=(function(){var v=store("myDept");return v&&DEPTS.some(function(d){return d.n===v.n&&d.c===v.c})?v:null})();
var gateCampus=myDept?myDept.c:"충주",gateOpen=false;
function deptObj(){return myDept?DEPTS.filter(function(d){return d.n===myDept.n&&d.c===myDept.c})[0]:null}
function renderGate(tab){var first=$('section.panel[data-tab="'+tab+'"]');if(!first)return;var panels=$$('section.panel[data-tab="'+tab+'"]');
  var old=$(".deptgate",first);if(old)old.remove();var oldB=$(".mydept",first);if(oldB)oldB.remove();
  var menu=$(".secmenu",first),hero=$(".scr-hero",first);var anchor=menu||hero;
  if(!myDept||gateOpen){panels.forEach(function(p){p.classList.add("gate-mode")});
    var card=el("div",{cls:"card deptgate"},[el("div",{cls:"qnum",text:"Q. 내 학과"}),el("h2",{text:"학과를 먼저 골라 주세요"}),el("p",{cls:"note",style:"margin:0",text:"학과마다 지원과 진로가 달라서, 고른 학과 기준으로 보여 드려요. 이 기기에만 저장돼요."})]);
    var camp=el("div",{cls:"dg-camp"});["충주","증평","의왕"].forEach(function(c){var b=el("button",{cls:"chip",type:"button","aria-pressed":String(gateCampus===c),text:c+"캠퍼스"});b.onclick=function(){gateCampus=c;GATE_TABS.forEach(renderGate)};camp.appendChild(b)});
    card.appendChild(camp);var list=el("div",{cls:"dg-list"});var lastCol="";
    DEPTS.filter(function(d){return d.c===gateCampus}).forEach(function(d){if(d.col!==lastCol){lastCol=d.col;list.appendChild(el("div",{cls:"dg-col",text:d.col}))}
      var on=myDept&&myDept.n===d.n&&myDept.c===d.c;var b=el("button",{cls:"dg-row",type:"button","aria-pressed":String(!!on)},[document.createTextNode(d.n),el("span",{text:on?"✓":"›"})]);
      b.onclick=function(){myDept={n:d.n,c:d.c};store("myDept",myDept);gateOpen=false;GATE_TABS.forEach(renderGate);window.scrollTo(0,0)};list.appendChild(b)});
    card.appendChild(list);
    if(myDept){var cancel=el("button",{cls:"btn small",type:"button",text:"취소",style:"margin-top:12px"});cancel.onclick=function(){gateOpen=false;GATE_TABS.forEach(renderGate)};card.appendChild(cancel)}
    (hero||first.firstChild).after(card);return}
  panels.forEach(function(p){p.classList.remove("gate-mode")});
  var d=deptObj();var ic=el("span",{cls:"md-ic"});ic.innerHTML=svgI("dept");
  var change=el("button",{cls:"btn small",type:"button",text:"학과 바꾸기"});change.onclick=function(){gateOpen=true;GATE_TABS.forEach(renderGate)};
  var bar=el("div",{cls:"card mydept"},[ic,el("div",{cls:"md-main"},[el("span",{cls:"md-k",text:"내 학과 · "+d.c+"캠퍼스 · "+d.col}),el("span",{cls:"md-v",text:d.n})]),change]);
  hero.after(bar);
  /* a department-specific first row in the section menu */
  if(menu){var prev=$(".sm-row.mine",menu);if(prev)prev.remove();var r=tab==="study"?el("a",{cls:"sm-row mine",href:U+d.h,target:"_blank",rel:"noopener",style:"text-decoration:none"}):el("button",{cls:"sm-row mine",type:"button"});var ri=el("span",{cls:"sm-ic"});ri.innerHTML=svgI(tab==="career"?"career":"study");
    var title=tab==="career"?d.n+" 진로":d.n+" 학과 안내",sub=tab==="career"?(d.off?"공식 진로 자료와 졸업생 직무 현황":"졸업생이 남긴 직무 현황"):"학과 홈페이지와 학과별 진로 자료";
    r.appendChild(ri);r.appendChild(el("span",{cls:"sm-main"},[el("span",{cls:"sm-t",text:title}),el("span",{cls:"sm-s",text:sub})]));r.appendChild(el("span",{cls:"sm-go",text:"›"}));
    if(tab==="career")r.onclick=function(){{var st=$$('section.panel[data-tab="career"] > .stop').filter(function(x){return (smTitleOf.get(x)||"").indexOf("공식 취업 통계")===0})[0];openDept=d;campus=d.c;renderDepts();if(st)openSection("career",st);setTimeout(function(){var x=$("#deptDetail");if(x)x.scrollIntoView({behavior:"smooth"})},60)}
};
    var firstGroup=$(".sm-group",menu);if(firstGroup)firstGroup.after(r);else menu.insertBefore(r,menu.firstChild)}}
GATE_TABS.forEach(renderGate);
/* ---------- connect db ---------- */`);
fs.writeFileSync(F,s,"utf8");console.log("ok");

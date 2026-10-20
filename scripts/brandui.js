// KNUT brand colors (light default + dark), audience shortcuts, and a full-menu (mega menu) panel.
const fs=require("fs"),path=require("path");const F=path.join(__dirname,"knut-tips.html");
let s=fs.readFileSync(F,"utf8");
function rep(a,b){if(s.split(a).length!==2)throw new Error("not unique ("+(s.split(a).length-1)+"): "+a.slice(0,80));s=s.replace(a,()=>b)}

/* ---------- theme: KNUT official colors (ut.ac.kr 대학UI) ----------
   Blue 286C = rgb(13,46,139) #0D2E8B · Burgundy 1815C = rgb(89,0,0) #590000 · Silver 877C (metallic; screen approx #8A8D8F)
   Warm Gray 10C #4C4C45 · 3C #CCCCC2 · 1C #EBEBDF */
const THEME=`
/* ===== KNUT brand theme (light default, dark when the device or viewer asks) ===== */
:root{
  color-scheme:light;
  --knut-blue:#0D2E8B; --knut-burgundy:#590000; --knut-silver:#8A8D8F;
  --bg:#f5f5f0; --bg2:#ffffff; --surface:#ffffff; --surface-solid:#ffffff; --ink:#1c1f2a; --muted:#5b5f6b; --line:#dcdcd2;
  --accent:#0D2E8B; --accent-ink:#ffffff; --sign:#590000; --sign-ink:#ffffff; --hl:#8a1c1c;
  --grad:linear-gradient(120deg,#0D2E8B 0%,#3a2a7a 55%,#590000 100%);
  --grad-deep:linear-gradient(120deg,#0D2E8B 0%,#173f9e 100%);
  --ok:#0f7a5c; --warn:#9a5b00; --bad:#b4232c;
  --l1:#0D2E8B; --l2:#1f7a5a; --l3:#8a1c1c; --l4:#3b5bcc; --l5:#b0306a; --l6:#6b7280;
  --field:#ffffff; --soft:#f0f0ea; --hdr:rgba(255,255,255,.9); --key:rgba(13,46,139,.18); --key2:rgba(20,24,40,.08); --pop:#ffffff;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  color-scheme:dark;
  --bg:#141a2b; --bg2:#1c2438; --surface:#1f2840; --surface-solid:#1f2840; --ink:#eef1f8; --muted:#a7afc2; --line:#323c58;
  --accent:#7d9bff; --accent-ink:#0b1430; --sign:#c25555; --sign-ink:#ffffff; --hl:#ff9a9a;
  --grad:linear-gradient(120deg,#7d9bff 0%,#a78bfa 55%,#e07a7a 100%);
  --grad-deep:linear-gradient(120deg,#1d3fae 0%,#0D2E8B 100%);
  --ok:#5eead4; --warn:#fbbf24; --bad:#fb7185;
  --l1:#7d9bff; --l2:#34d399; --l3:#e07a7a; --l4:#a5b4fc; --l5:#f472b6; --l6:#b8bcc6;
  --field:#151c2e; --soft:#182035; --hdr:rgba(20,26,43,.88); --key:rgba(0,0,0,.45); --key2:rgba(0,0,0,.3); --pop:#1f2840}}
:root[data-theme="dark"]{
  color-scheme:dark;
  --bg:#141a2b; --bg2:#1c2438; --surface:#1f2840; --surface-solid:#1f2840; --ink:#eef1f8; --muted:#a7afc2; --line:#323c58;
  --accent:#7d9bff; --accent-ink:#0b1430; --sign:#c25555; --sign-ink:#ffffff; --hl:#ff9a9a;
  --grad:linear-gradient(120deg,#7d9bff 0%,#a78bfa 55%,#e07a7a 100%);
  --grad-deep:linear-gradient(120deg,#1d3fae 0%,#0D2E8B 100%);
  --ok:#5eead4; --warn:#fbbf24; --bad:#fb7185;
  --l1:#7d9bff; --l2:#34d399; --l3:#e07a7a; --l4:#a5b4fc; --l5:#f472b6; --l6:#b8bcc6;
  --field:#151c2e; --soft:#182035; --hdr:rgba(20,26,43,.88); --key:rgba(0,0,0,.45); --key2:rgba(0,0,0,.3); --pop:#1f2840}
body{background:var(--bg);background-image:none;color:var(--ink)}
header.top{background:var(--hdr);border-bottom:3px solid var(--knut-blue);box-shadow:0 2px 0 var(--knut-burgundy)}
.wordmark{color:var(--ink)!important;-webkit-text-stroke:0!important}
.wordmark em{color:var(--hl)}
.logo-text small{color:var(--muted)}
.logo-icon{background:linear-gradient(140deg,#0D2E8B 0%,#0D2E8B 55%,#590000 100%);box-shadow:0 6px 18px rgba(13,46,139,.35),inset 0 1px 0 rgba(255,255,255,.3)}
.card,.tablewrap{background:var(--surface);box-shadow:0 1px 2px var(--key2),0 6px 18px var(--key2)}
input,select,textarea{background:var(--field)}
.dl-row,.checklist label{background:var(--soft)}
.photos .ph{background:radial-gradient(circle at 30% 20%,rgba(13,46,139,.12),transparent 60%),var(--soft)}
.pin text{stroke:var(--bg2)}
.pop{background:var(--pop)}
.btn,.chip,nav.lines button{background:var(--surface);color:var(--ink);box-shadow:0 2px 0 var(--key),0 4px 10px var(--key2)}
nav.lines button{color:var(--muted)}
.btn:hover,.chip:hover,nav.lines button:hover{box-shadow:0 4px 0 var(--key),0 8px 16px var(--key2)}
.btn.primary,.chip[aria-pressed="true"],nav.lines button[aria-selected="true"]{background:var(--knut-blue);color:#fff;box-shadow:0 3px 0 #061a55,0 8px 18px rgba(13,46,139,.3)}
.tile,.deptcard,.tipx{box-shadow:0 3px 0 var(--key),0 10px 24px var(--key2)}
.mission{background:linear-gradient(120deg,#0D2E8B 0%,#2a2470 60%,#590000 100%)}
.pill.rec{background:var(--knut-blue)}
.stop::after{background:var(--bg2)}
.train{filter:drop-shadow(0 0 4px var(--knut-blue))}
.pop-bg{background:rgba(10,14,30,.45)}
.toast{background:var(--knut-blue)}
/* ===== audience shortcuts ===== */
.aud{margin-top:16px}
.aud-tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
@media (max-width:560px){.aud-tabs{grid-template-columns:repeat(2,minmax(0,1fr))}}
.aud-tabs button{display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:12px 14px;border-radius:14px;border:1px solid var(--line);background:var(--surface);color:var(--ink);cursor:pointer;font:inherit;text-align:left}
.aud-tabs button b{font-family:var(--f-display);font-size:18px}
.aud-tabs button span{font-size:12.5px;color:var(--muted)}
.aud-tabs button[aria-pressed="true"]{background:var(--knut-blue);border-color:var(--knut-blue);color:#fff}
.aud-tabs button[aria-pressed="true"] span{color:rgba(255,255,255,.8)}
.aud-links{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px;margin-top:10px}
.aud-links button{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:11px 14px;border-radius:12px;border:1px solid var(--line);border-left:4px solid var(--knut-burgundy);background:var(--surface);color:var(--ink);font:inherit;text-align:left;cursor:pointer}
.aud-links button:hover{border-color:var(--knut-blue)}
.aud-links button small{color:var(--muted);font-size:12px;white-space:nowrap}
/* ===== full menu (mega menu) ===== */
.navrow{display:flex;align-items:center;gap:8px}
.navrow nav.lines{flex:1;min-width:0}
.allmenu-btn{flex:none;border:1px solid var(--line);background:var(--surface);color:var(--ink);font:600 14px "IBM Plex Sans KR","Nanum Gothic",system-ui,sans-serif;padding:7px 12px;border-radius:999px;cursor:pointer;margin-bottom:4px}
.mega{position:fixed;inset:0;z-index:40;background:rgba(10,14,30,.4);display:flex;justify-content:center;align-items:flex-start;padding:16px;padding-top:calc(76px + env(safe-area-inset-top,0px))}
.mega-panel{width:min(1040px,100%);max-height:calc(100vh - 110px);overflow:auto;background:var(--pop);border-radius:18px;border-top:5px solid var(--knut-blue);box-shadow:0 24px 60px rgba(0,0,0,.3);padding:18px 20px}
.mega-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px}
.mega-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:14px}
@media (max-width:900px){.mega-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:520px){.mega-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
.mega-col h3{margin:0 0 6px;padding-bottom:6px;border-bottom:2px solid var(--knut-blue);font-size:16px!important}
.mega-col button{display:block;width:100%;text-align:left;border:0;background:none;color:var(--ink);font:inherit;font-size:14px;padding:5px 0;cursor:pointer;line-height:1.35}
.mega-col button:hover,.mega-col button:focus-visible{color:var(--knut-blue);text-decoration:underline}
:root[data-theme="dark"] .mega-col button:hover{color:var(--accent)}
.stop-head h2,h1{scroll-margin-top:150px}
`;
rep(`@media (prefers-reduced-motion:reduce){*{transition:none!important}}`,THEME+`@media (prefers-reduced-motion:reduce){*{transition:none!important}}`);
// the dark-only declaration at the top no longer applies
rep(`  color-scheme:dark;
  --bg:#28344f;`,`  --bg:#28344f;`);

/* ---------- header: full menu button ---------- */
rep(`  <nav class="lines" role="tablist" id="nav"></nav>`,`  <div class="navrow"><nav class="lines" role="tablist" id="nav"></nav><button class="allmenu-btn" id="allMenuBtn" type="button" aria-expanded="false" aria-controls="mega">☰ 전체 메뉴</button></div>`);

/* ---------- home: audience shortcuts ---------- */
rep(`  <div class="card profile" id="profileBox"></div>`,`  <div class="card aud" id="audBox">
    <div class="stop-head"><h2>누구세요?</h2><span class="note">방문 목적에 맞는 정보를 바로 모아 보여 드려요</span></div>
    <div class="aud-tabs" id="audTabs" role="group" aria-label="사용자 선택"></div>
    <div class="aud-links" id="audLinks"></div>
  </div>
  <div class="card profile" id="profileBox"></div>`);
rep(`<h1>충주에서 대학생활을, 충주와 함께.</h1>`,`<h1>충주에서 대학생활을, 충주와 함께.</h1>`); // anchor check only

/* ---------- JS ---------- */
rep(`/* ---------- connect db ---------- */`,`/* ---------- jump to a section by its heading ---------- */
function jumpTo(tab,title){go(tab);setTimeout(function(){var hs=$$("section.panel:not([hidden]) h1, section.panel:not([hidden]) .stop-head h2, section.panel:not([hidden]) h3");
  var h=hs.filter(function(x){return x.textContent.trim().indexOf(title)===0})[0];if(h)h.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"})},30)}

/* ---------- audience shortcuts (existing content regrouped, nothing new invented) ---------- */
var AUD=[
 {id:"student",n:"학생",d:"맛집·이동·과제·장학",links:[["맛집","맛집","추천 많은 맛집"],["move","학생들이 모은 이동 꿀팁","시내버스·택시 꿀팁"],["life","학생들이 모은 학교생활 꿀팁","프린트·보건실·은행"],["study","과제 마감 보드","과제 마감 보드"],["study","교내 장학금","교내 장학금 기준"],["career","4년 진로 로드맵","진로 로드맵"]]},
 {id:"parent",n:"학부모",d:"장학금·생활관·통학·취업",links:[["study","교내 장학금","교내 장학금 기준"],["study","국가장학금","국가장학금 신청 시기"],["life","충주생활관 핵심 수칙","생활관 수칙·통금"],["move","통학버스","통학버스 시간표"],["life","자취 가이드","자취방 계약 전 체크"],["career","공식 취업 통계","졸업생 취업률"]]},
 {id:"staff",n:"교직원",d:"식당·시설·학생 지원",links:[["life","오늘의 학식","학식·교직원식당"],["맛집","맛집","교내외 식당 찾기"],["life","교내 시설 찾기","교내 시설 위치"],["move","통학버스","통학버스 시간표"],["life","학생들이 모은 학교생활 꿀팁","학생 상담·보건 안내"],["career","졸업생 진로 보드","학과별 진로 현황"]]},
 {id:"applicant",n:"입학 지원자",d:"학과·진로·생활 미리 보기",links:[["home","신입생 가이드","신입생 가이드"],["career","공식 취업 통계","취업률·학과별 진로"],["study","교내 장학금","장학금 기준"],["life","충주생활관 핵심 수칙","생활관 미리 보기"],["move","통학버스","통학 방법"],["맛집","맛집","학교 앞 맛집"]]}];
var audSel=store("aud")||"student";
function renderAud(){var t=$("#audTabs"),l=$("#audLinks");if(!t)return;t.textContent="";l.textContent="";
  AUD.forEach(function(a){var b=el("button",{type:"button","aria-pressed":String(audSel===a.id)},[el("b",{text:a.n}),el("span",{text:a.d})]);b.onclick=function(){audSel=a.id;store("aud",audSel);renderAud()};t.appendChild(b)});
  var cur=AUD.filter(function(a){return a.id===audSel})[0];
  cur.links.forEach(function(k){var tab=k[0]==="맛집"?"food":k[0];var name=(TABS.filter(function(x){return x[0]===tab})[0]||["",""])[1];
    var b=el("button",{type:"button"},[el("span",{text:k[2]}),el("small",{text:name+" →"})]);b.onclick=function(){jumpTo(tab,k[1])};l.appendChild(b)})}
renderAud();

/* ---------- full menu (mega menu): every section of every menu in one place ---------- */
var megaEl=null;
function closeMega(){if(!megaEl)return;megaEl.remove();megaEl=null;var b=$("#allMenuBtn");b.setAttribute("aria-expanded","false");b.focus()}
function openMega(){if(megaEl){closeMega();return}
  var grid=el("div",{cls:"mega-grid"});
  TABS.forEach(function(t){var col=el("div",{cls:"mega-col"},[el("h3",{text:t[1]})]);
    var panels=$$('section.panel[data-tab="'+t[0]+'"]');var titles=[];
    panels.forEach(function(p){$$("h1.sub, .stop-head h2",p).forEach(function(h){var x=h.textContent.trim();if(titles.indexOf(x)<0&&x!=="꿀팁 노선도")titles.push(x)})});
    if(t[0]==="food")titles=["맛집 지도·목록"].concat(titles);
    titles.forEach(function(x){var b=el("button",{type:"button",text:x});b.onclick=function(){closeMega();if(x==="맛집 지도·목록"){go("food");setTimeout(function(){var f=$("#foodArea");if(f)f.scrollIntoView({behavior:"smooth",block:"center"})},30)}else jumpTo(t[0],x)};col.appendChild(b)});
    grid.appendChild(col)});
  var x=el("button",{cls:"btn small",type:"button",text:"닫기 ✕"});x.onclick=closeMega;
  var panel=el("div",{cls:"mega-panel",role:"dialog","aria-modal":"true","aria-label":"전체 메뉴"},[el("div",{cls:"mega-head"},[el("h2",{text:"전체 메뉴"}),x]),grid]);
  megaEl=el("div",{cls:"mega",id:"mega"},[panel]);megaEl.addEventListener("click",function(e){if(e.target===megaEl)closeMega()});
  document.body.appendChild(megaEl);$("#allMenuBtn").setAttribute("aria-expanded","true");
  var first=$(".mega-col button",megaEl);if(first)first.focus()}
$("#allMenuBtn").onclick=openMega;
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&megaEl)closeMega()});
/* ---------- connect db ---------- */`);
fs.writeFileSync(F,s,"utf8");console.log("ok");

// App-style UI: phone-frame layout, bottom tab bar, app home (search, category chips, banner, quick menu, HOT list),
// map + bottom-sheet list for 맛집, building/floor guide, survey-style audience card, and an original mascot.
const fs=require("fs"),path=require("path");const F=path.join(__dirname,"knut-tips.html");
let s=fs.readFileSync(F,"utf8");
function rep(a,b){if(s.split(a).length!==2)throw new Error("not unique ("+(s.split(a).length-1)+"): "+a.slice(0,90));s=s.replace(a,()=>b)}
function cut(a0,b0){const a=s.indexOf(a0);if(a<0)throw new Error("no "+a0.slice(0,60));const b=s.indexOf(b0,a+a0.length);if(b<0)throw new Error("no end "+b0.slice(0,60));const o=s.slice(a,b);s=s.slice(0,a)+s.slice(b);return o}

/* ---------- fonts: add a bold weight for the app UI ---------- */
rep(`IBM+Plex+Sans+KR:wght@500;600`,`IBM+Plex+Sans+KR:wght@400;500;600;700`);

/* ---------- app frame + bottom tab bar ---------- */
rep(`<header class="top">`,`<div class="app" id="app">
<header class="top">`);
rep(`</main>
<div class="toast"`,`</main>
<nav class="tabbar" id="tabbar" aria-label="하단 메뉴"></nav>
</div>
<div class="toast"`);

/* ---------- app home ---------- */
rep(`  <h1>충주에서 대학생활을, 충주와 함께.</h1>`,`  <h1 class="vh">교통대 꿀팁노선도 홈</h1>
  <div class="apphome">
    <label class="searchbar"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><input id="q" type="search" placeholder="맛집, 버스, 장학금, 프린트 검색" autocomplete="off" aria-label="사이트 검색"></label>
    <div class="qres card" id="qres" hidden></div>
    <div class="cats" id="homeCats" role="group" aria-label="카테고리"></div>
    <div class="banner" id="banner"><div class="slides" id="slides"></div><div class="dots" id="dots"></div></div>
    <div class="quick card" id="quick"></div>
    <div class="row2"><div class="card mini" id="mealCard"></div><div class="card mini" id="ddCard"></div></div>
    <div class="card hot"><div class="hot-h"><b id="hotTitle">HOT 꿀팁</b><span class="note">추천 수가 많은 순서</span></div><div id="hotList"></div></div>
  </div>`);
rep(`  <p class="lead">통학버스 시간, 생활관 수칙, 장학금 기준부터`,`  <p class="lead home-lead">통학버스 시간, 생활관 수칙, 장학금 기준부터`);
// survey-style audience card
rep(`    <div class="stop-head"><h2>누구세요?</h2><span class="note">방문 목적에 맞는 정보를 바로 모아 보여 드려요</span></div>`,
`    <div class="survey-h"><span class="mascot-sm" id="audMascot"></span><div><div class="qnum">Q. 방문 목적</div><h2>어떤 분이세요?</h2><span class="note">고르면 필요한 정보만 모아 드려요</span></div></div>
    <div class="qbar"><span id="audBar"></span></div>`);

/* ---------- 맛집: map on top, list as a bottom sheet ---------- */
rep(`  <div class="viewtoggle" role="group" aria-label="보기 방식"><button class="chip" type="button" id="vMap">🗺️ 지도로 보기</button><button class="chip" type="button" id="vList">☰ 목록으로 보기</button></div>
`,`  <div hidden><button type="button" id="vMap"></button><button type="button" id="vList"></button></div>
`);
const mapBox=cut(`  <div class="card foodmap" id="foodMapBox" hidden>`,`  <div class="grid" id="foodGrid"></div>`);
const register=cut(`  <div class="stop" style="--c:var(--l5)"><div class="stop-head"><h2>내가 가 본 가게 등록</h2>`,`  <div hidden><button type="button" id="vMap">`);
rep(`  <div class="filters" id="foodArea"></div>`,mapBox.replace(`<div class="card foodmap" id="foodMapBox" hidden>`,`<div class="card foodmap" id="foodMapBox">`)+`  <div class="sheet card">
  <div class="grabber" aria-hidden="true"></div>
  <div class="sheet-h"><b>교통대 맛집지도</b><span class="note">by 학생 21명</span></div>
  <div class="filters" id="foodArea"></div>`);
rep(`  <div class="grid" id="foodGrid"></div>`,`  <div class="sheetlist" id="foodGrid"></div>
  </div>
`+register);

/* ---------- 학교생활: building / floor guide ---------- */
rep(`    <div class="grid" id="tipLife"></div>
  </div>`,`    <div class="grid" id="tipLife"></div>
  </div>
  <div class="stop" style="--c:var(--l2)"><div class="stop-head"><h2>건물별 층 안내</h2><span class="meta" data-meta="xbuild"></span></div>
    <p class="note">학생 꿀팁에 적힌 위치를 건물과 층으로 나눴어요. 도면은 없고, 꿀팁이 가리키는 곳만 보여 줘요.</p>
    <div class="cats" id="bChips"></div>
    <div class="floorwrap card"><div class="floors" id="floors"></div><div class="floorlist" id="floorList"></div></div>
  </div>`);
rep(`xmove:"2026.10.13 (2주차 정리)"};`,`xmove:"2026.10.13 (2주차 정리)",xbuild:"2026.10.13 (2주차 정리)"};`);
rep(`xmove:"이동 꿀팁"};`,`xmove:"이동 꿀팁",xbuild:"건물별 층 안내"};`);

/* ---------- 맛집 render: map + rows ---------- */
rep(`  if(foodView==="map"){grid.hidden=true;$("#foodMapBox").hidden=false;renderFoodMap(shown,a)}else{grid.hidden=false;$("#foodMapBox").hidden=true;shown.forEach(function(p){grid.appendChild(placeCard(p,a[p.id]))})}`,
`  $("#foodMapBox").hidden=false;renderFoodMap(shown,a);grid.hidden=false;shown.forEach(function(p){grid.appendChild(placeRow(p,a[p.id]))});`);
rep(`function renderDash(){var d=$("#dash");`,`function renderDash(){if(typeof renderDD==="function")renderDD();var d=$("#dash");`);
rep(`function go(id){id=ALIAS[id]||id;`,`function go(id){id=ALIAS[id]||id;if(typeof syncTabbar==="function")syncTabbar(id);`);

/* ---------- CSS ---------- */
const CSS=`
/* ===== app UI ===== */
:root{--f-ui:"IBM Plex Sans KR","Nanum Gothic",system-ui,-apple-system,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;--r:20px;--soft-sh:0 4px 18px rgba(13,46,139,.08),0 1px 3px rgba(13,46,139,.06);--sel:#e8eefc;--sel-ink:#0D2E8B}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--soft-sh:0 4px 18px rgba(0,0,0,.35);--sel:#24305a;--sel-ink:#b9c8ff}}
:root[data-theme="dark"]{--soft-sh:0 4px 18px rgba(0,0,0,.35);--sel:#24305a;--sel-ink:#b9c8ff}
html{background:linear-gradient(160deg,#0D2E8B 0%,#2753c9 60%,#3b6be0 100%) fixed;min-height:100%}
body{background:transparent;font-family:var(--f-ui)!important;font-size:15px;letter-spacing:-.01em}
body,button,input,select,textarea{font-family:var(--f-ui)!important}
h1,h2,h3,.place .name,.fields dd.name{font-family:var(--f-ui)!important;font-weight:700!important;letter-spacing:-.02em!important}
h1{font-size:22px!important;background:none!important;-webkit-background-clip:border-box!important;background-clip:border-box!important;color:var(--ink)!important}
h1.sub{font-size:19px!important}
h2{font-size:17px!important}
h3{font-size:15.5px!important}
b,strong,th,label,.btn,.chip,.pill,.fields dt{font-weight:600!important}
.vh{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.app{max-width:440px;margin:0 auto;min-height:100vh;background:var(--bg);position:relative;display:flex;flex-direction:column}
@media (min-width:520px){.app{margin:24px auto;min-height:calc(100vh - 48px);border-radius:34px;overflow:hidden;box-shadow:0 30px 80px rgba(5,15,50,.45),0 0 0 10px rgba(255,255,255,.14)}}
.app main.wrap{flex:1;padding-inline:16px;padding-block:4px 96px;max-width:none}
header.top{position:sticky;top:0;border:0;box-shadow:none;background:var(--hdr)}
header.top .wrap{padding-inline:16px;max-width:none}
.brand{padding-block:12px 10px;gap:8px}
.logo-icon{width:34px;height:34px;border-radius:11px}
.logo-icon svg{width:22px;height:22px}
.wordmark{font-size:19px!important;font-family:"Jua",var(--f-ui)!important}
.logo-text small{display:none}
.navrow{position:absolute;right:16px;top:14px}
.navrow nav.lines{display:none}
.allmenu-btn{margin:0;padding:6px 11px;font-size:13px;box-shadow:none!important;background:var(--surface)}
.tabbar{position:sticky;bottom:0;z-index:6;display:grid;grid-template-columns:repeat(6,1fr);background:var(--surface);border-top:1px solid var(--line);padding:6px 4px calc(6px + env(safe-area-inset-bottom,0px))}
.tabbar button{display:flex;flex-direction:column;align-items:center;gap:2px;border:0;background:none;color:var(--muted);font-size:11px;font-weight:600;padding:4px 0;cursor:pointer;border-radius:10px}
.tabbar button svg{width:22px;height:22px}
.tabbar button[aria-current="page"]{color:var(--knut-blue)}
:root[data-theme="dark"] .tabbar button[aria-current="page"]{color:var(--accent)}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .tabbar button[aria-current="page"]{color:var(--accent)}}
.card,.tablewrap{border:0!important;border-radius:var(--r);box-shadow:var(--soft-sh)!important;backdrop-filter:none}
.card:hover{border-color:transparent}
.grid{grid-template-columns:1fr;gap:10px}
.dash{grid-template-columns:repeat(2,minmax(0,1fr))!important}
.hero{grid-template-columns:1fr!important}
.btn,.chip,nav.lines button{box-shadow:none!important;border:1px solid var(--line)}
.btn:hover,.chip:hover{transform:none}
.btn.primary,.chip[aria-pressed="true"]{box-shadow:none!important;border-color:transparent}
.tile,.deptcard,.tipx{box-shadow:var(--soft-sh)!important}
.tile:active,.deptcard:active,.tipx:active{transform:scale(.98)!important;box-shadow:var(--soft-sh)!important}
.stop{padding-left:0!important;margin-top:26px!important}
.stop::before,.stop::after{display:none!important}
.stop-head h2{display:flex;align-items:center;gap:8px}
.stop-head h2::before{content:"";width:4px;height:16px;border-radius:2px;background:var(--knut-blue)}
section.panel{padding-top:12px}
.lead{font-size:14px}
.home-lead{display:none}
/* home */
.apphome{display:flex;flex-direction:column;gap:12px}
.searchbar{flex-direction:row;align-items:center;gap:8px;background:var(--surface);border-radius:999px;padding:4px 14px;box-shadow:var(--soft-sh);color:var(--muted)}
.searchbar input{border:0!important;background:transparent!important;box-shadow:none!important;padding:8px 0;font-size:15px}
.qres{padding:6px 10px!important;display:flex;flex-direction:column}
.qres button{display:flex;justify-content:space-between;gap:8px;border:0;background:none;color:var(--ink);font:inherit;text-align:left;padding:9px 4px;border-bottom:1px solid var(--line);cursor:pointer}
.qres button:last-child{border-bottom:0}
.qres small{color:var(--muted);white-space:nowrap}
.cats{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:2px 0}
.cats::-webkit-scrollbar{display:none}
.cats button{flex:none;border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:999px;padding:6px 14px;font-size:13.5px;font-weight:600;cursor:pointer}
.cats button[aria-pressed="true"]{background:var(--knut-blue);border-color:var(--knut-blue);color:#fff}
.banner{position:relative;border-radius:var(--r);overflow:hidden;box-shadow:var(--soft-sh)}
.slides{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none}
.slides::-webkit-scrollbar{display:none}
.slide{flex:0 0 100%;scroll-snap-align:start;min-height:168px;padding:18px 18px 26px;display:grid;grid-template-columns:1fr auto;gap:8px;align-items:end;color:#fff;cursor:pointer;border:0;text-align:left;font:inherit}
.slide .tag{display:inline-block;font-size:11.5px;font-weight:700;padding:3px 9px;border-radius:999px;background:rgba(255,255,255,.22);margin-bottom:8px}
.slide .tt{font-size:20px;font-weight:700;line-height:1.3;letter-spacing:-.02em}
.slide .ss{font-size:12.5px;opacity:.85;margin-top:6px}
.slide svg{width:96px;height:96px}
.dots{position:absolute;left:0;right:0;bottom:9px;display:flex;justify-content:center;gap:5px}
.dots i{width:6px;height:6px;border-radius:3px;background:rgba(255,255,255,.5);transition:width .2s}
.dots i.on{width:16px;background:#fff}
.quick{display:grid!important;grid-template-columns:repeat(4,1fr);gap:4px;padding:12px 8px!important}
.quick button{display:flex;flex-direction:column;align-items:center;gap:6px;border:0;background:none;color:var(--ink);font-size:12px;font-weight:600;padding:6px 2px;cursor:pointer;border-radius:12px}
.quick button:hover{background:var(--soft)}
.quick .ic{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;background:var(--sel);color:var(--sel-ink)}
.quick .ic svg{width:24px;height:24px}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.mini{padding:14px!important;display:flex;flex-direction:column;gap:4px;cursor:pointer;text-decoration:none;color:var(--ink)}
.mini .k{font-size:12px;color:var(--muted);font-weight:600}
.mini .v{font-size:17px;font-weight:700;letter-spacing:-.02em}
.mini .s{font-size:12px;color:var(--muted)}
.hot{padding:14px 16px!important}
.hot-h{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px}
.hot-h b{font-size:16px}
.hot-row{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;width:100%;border:0;background:none;color:var(--ink);font:inherit;text-align:left;padding:10px 0;border-bottom:1px solid var(--line);cursor:pointer}
.hot-row:last-child{border-bottom:0}
.hot-row .lb{font-size:11px;font-weight:700;padding:2px 7px;border-radius:6px;background:var(--sel);color:var(--sel-ink)}
.hot-row .lb.h{background:#fde8e8;color:#8a1c1c}
.hot-row .nm{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:14px}
.hot-row small{color:var(--muted);font-size:12px;white-space:nowrap}
/* survey-style audience card */
.aud{padding:16px!important}
.survey-h{display:flex;gap:10px;align-items:center}
.survey-h h2{margin:0}
.survey-h h2::before{display:none}
.qnum{font-size:12px;font-weight:700;color:var(--knut-blue)}
.mascot-sm svg{width:56px;height:56px}
.qbar{height:6px;border-radius:3px;background:var(--soft);margin:12px 0 10px;overflow:hidden}
.qbar span{display:block;height:100%;width:25%;border-radius:3px;background:var(--knut-blue);transition:width .3s}
.aud-tabs{grid-template-columns:1fr 1fr!important;gap:8px}
.aud-tabs button{flex-direction:row!important;align-items:center!important;gap:10px!important;border-radius:14px;padding:12px!important;background:var(--soft)!important;border:1.5px solid transparent!important;color:var(--ink)!important}
.aud-tabs button::before{content:"";flex:none;width:20px;height:20px;border-radius:50%;border:2px solid var(--line);background:var(--surface)}
.aud-tabs button b{font-size:15px!important}
.aud-tabs button span{display:none}
.aud-tabs button[aria-pressed="true"]{background:var(--sel)!important;border-color:var(--knut-blue)!important;color:var(--sel-ink)!important}
.aud-tabs button[aria-pressed="true"]::before{border-color:var(--knut-blue);background:var(--knut-blue) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M5 10.5l3.2 3L15 7' fill='none' stroke='white' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/16px no-repeat}
.aud-links{grid-template-columns:1fr!important}
.aud-links button{border-left-width:1px!important;border-color:var(--line)!important;border-radius:12px}
/* 맛집: map + sheet */
.foodmap{padding:0!important;overflow:hidden;margin-top:12px;border-radius:var(--r) var(--r) 0 0!important}
.foodmap .metro-wrap{margin:0}
#foodMap{min-width:0!important}
.foodmap>.note{padding:6px 14px 10px}
.sheet{margin-top:-14px;position:relative;border-radius:22px 22px var(--r) var(--r)!important;padding:8px 14px 14px!important}
.grabber{width:40px;height:5px;border-radius:3px;background:var(--line);margin:4px auto 10px}
.sheet-h{display:flex;align-items:baseline;gap:8px}
.sheet-h b{font-size:17px}
.sheetlist{display:flex;flex-direction:column;margin-top:8px}
.prow{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;padding:12px 2px;border-bottom:1px solid var(--line);cursor:pointer;background:none;border-left:0;border-right:0;border-top:0;color:var(--ink);font:inherit;text-align:left;width:100%}
.prow:last-child{border-bottom:0}
.prow .pic{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:var(--sel);color:var(--sel-ink)}
.prow .pic svg{width:22px;height:22px}
.prow .nm{font-weight:700;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.prow .ad{font-size:12.5px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.prow .mt{font-size:12px;margin-top:2px;display:flex;gap:6px;flex-wrap:wrap}
.prow .mt .on{color:var(--ok);font-weight:700}
.prow .mt .pr{color:var(--warn);font-weight:700}
.star{width:34px;height:34px;border-radius:50%;border:1px solid var(--line);background:var(--surface);color:var(--muted);display:grid;place-items:center;cursor:pointer}
.star[aria-pressed="true"]{background:var(--knut-blue);border-color:var(--knut-blue);color:#fff}
.star svg{width:16px;height:16px}
/* building / floor guide */
.floorwrap{display:grid;grid-template-columns:56px 1fr;gap:12px;padding:12px!important;margin-top:10px}
.floors{display:flex;flex-direction:column-reverse;gap:6px;justify-content:flex-end}
.floors button{border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:12px;padding:10px 0;font-weight:700;cursor:pointer;font-size:14px}
.floors button[aria-pressed="true"]{background:var(--knut-blue);border-color:var(--knut-blue);color:#fff}
.floorlist{display:flex;flex-direction:column;gap:8px;min-width:0}
.floorlist .fl-h{font-weight:700;font-size:15px}
.floorlist .fl-row{display:flex;justify-content:space-between;gap:8px;padding:10px 12px;border-radius:12px;background:var(--soft);border:0;color:var(--ink);font:inherit;text-align:left;cursor:pointer}
.floorlist .fl-row small{color:var(--muted);white-space:nowrap}
.mission{border-radius:var(--r)}
@media (prefers-reduced-motion:reduce){.dots i,.qbar span{transition:none}}
`;
rep(`@media (prefers-reduced-motion:reduce){*{transition:none!important}}`,CSS+`@media (prefers-reduced-motion:reduce){*{transition:none!important}}`);

/* ---------- JS ---------- */
rep(`/* ---------- connect db ---------- */`,`/* ---------- original mascot: 노선이 (round body, KNUT blue conductor cap) ---------- */
function mascot(id,mood){var g="mg"+id;return '<svg viewBox="0 0 120 120" aria-hidden="true"><defs><radialGradient id="'+g+'" cx="38%" cy="32%" r="70%"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#eef2fb"/><stop offset="1" stop-color="#c9d3ea"/></radialGradient></defs>'+
 '<ellipse cx="60" cy="108" rx="30" ry="6" fill="rgba(13,46,139,.18)"/>'+
 '<ellipse cx="26" cy="72" rx="9" ry="7" fill="url(#'+g+')"/><ellipse cx="94" cy="66" rx="9" ry="7" fill="url(#'+g+')" transform="rotate(-25 94 66)"/>'+
 '<circle cx="60" cy="66" r="36" fill="url(#'+g+')"/>'+
 '<path d="M30 44 Q60 18 90 44 L86 48 Q60 36 34 48 Z" fill="#0D2E8B"/><rect x="31" y="44" width="58" height="7" rx="3" fill="#590000"/><circle cx="60" cy="34" r="4" fill="#ffd166"/>'+
 (mood==="wink"?'<path d="M44 66 q5 -4 10 0" stroke="#1c1f2a" stroke-width="3" fill="none" stroke-linecap="round"/>':'<ellipse cx="49" cy="66" rx="3.5" ry="4.5" fill="#1c1f2a"/>')+
 '<ellipse cx="71" cy="66" rx="3.5" ry="4.5" fill="#1c1f2a"/><ellipse cx="42" cy="76" rx="5" ry="3" fill="#ffb3c1" opacity=".8"/><ellipse cx="78" cy="76" rx="5" ry="3" fill="#ffb3c1" opacity=".8"/>'+
 '<path d="M54 78 q6 6 12 0" stroke="#1c1f2a" stroke-width="2.6" fill="none" stroke-linecap="round"/></svg>'}
(function(){var m=$("#audMascot");if(m)m.innerHTML=mascot("aud","wink")})();

/* ---------- icons ---------- */
var IC={
 home:'<path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>',
 food:'<path d="M7 3v7a2 2 0 0 0 4 0V3M9 3v18M16 3c-2 2-2 6 0 8v10" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
 move:'<rect x="5" y="3" width="14" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M5 11h14M8 17v3M16 17v3" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><circle cx="9" cy="14" r="1" fill="currentColor"/><circle cx="15" cy="14" r="1" fill="currentColor"/>',
 life:'<path d="M3 20h18M5 20V9l7-5 7 5v11M10 20v-5h4v5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>',
 study:'<path d="M3 8l9-4 9 4-9 4zM7 10v5c3 2 7 2 10 0v-5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>',
 career:'<rect x="3" y="7" width="18" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M9 7V5h6v2M3 12h18" stroke="currentColor" stroke-width="1.9"/>',
 map:'<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z M9 4v14M15 6v14" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>',
 bus:'<rect x="5" y="3" width="14" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M5 11h14M8 17v3M16 17v3" stroke="currentColor" stroke-width="1.9"/>',
 meal:'<path d="M4 12h16a8 8 0 0 1-16 0zM8 4c0 2 2 2 2 4M12 4c0 2 2 2 2 4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
 won:'<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M7 9l2 6 3-5 3 5 2-6M6.5 12h11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
 build:'<path d="M4 21V5l8-2v18M12 9h8v12M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2" fill="none" stroke="currentColor" stroke-width="1.9"/>',
 clock:'<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
 dept:'<path d="M12 3l9 5-9 5-9-5z M6 10v6l6 3 6-3v-6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>',
 star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" fill="currentColor"/>',
 pin:'<path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" fill="none" stroke="currentColor" stroke-width="1.9"/><circle cx="12" cy="10" r="2.5" fill="currentColor"/>'};
function svgI(n){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+((typeof IC!=="undefined"&&IC)?IC[n]:"")+'</svg>'}

/* ---------- bottom tab bar ---------- */
var TABICON={home:"home",food:"food",move:"move",life:"life",study:"study",career:"career"};
var TABSHORT={home:"홈",food:"맛집",move:"이동",life:"생활",study:"학업",career:"진로"};
function syncTabbar(id){$$("#tabbar button").forEach(function(b){if(b.dataset.tab===id)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current")})}
(function(){var tb=$("#tabbar");TABS.forEach(function(t){var b=el("button",{type:"button","data-tab":t[0],"aria-label":t[1]});b.innerHTML=svgI(TABICON[t[0]]);b.appendChild(el("span",{text:TABSHORT[t[0]]}));b.onclick=function(){go(t[0])};tb.appendChild(b)});
  var cur=$$("section.panel").filter(function(p){return !p.hidden})[0];syncTabbar(cur?cur.dataset.tab:"home")})();

/* ---------- home: banner ---------- */
var SLIDES=[
 {bg:"linear-gradient(135deg,#0D2E8B,#2f5bd8)",tag:"교통대 꿀팁노선도",tt:"학생 21명이 모은\\n교통대 생활 꿀팁",ss:"맛집 95곳 · 생활꿀팁 82개",m:"wink",go:function(){go("food")}},
 {bg:"linear-gradient(135deg,#590000,#a3333d)",tag:"맛집",tt:"추천 11명!\\n부리또인 충주교통대점",ss:"추천 수가 가장 많은 학교 앞 가게",go:function(){go("food")}},
 {bg:"linear-gradient(135deg,#1f7a5a,#2aa37a)",tag:"이동",tt:"999번 버스로\\n시내 나가는 법",ss:"이동 꿀팁 중 추천 1위 · 추천 6",go:function(){jumpTo("move","학생들이 모은 이동 꿀팁")}},
 {bg:"linear-gradient(135deg,#3a2a7a,#0D2E8B)",tag:"장학",tt:"교내 장학금\\n평점 기준 한눈에",ss:"성적우수 평점 2.8 · 12학점 이상",go:function(){jumpTo("study","교내 장학금")}}];
var slideIx=0,slideTimer=null;
function renderBanner(){var sl=$("#slides"),dt=$("#dots");if(!sl)return;sl.textContent="";dt.textContent="";
  SLIDES.forEach(function(x,i){var b=el("button",{cls:"slide",type:"button",style:"background:"+x.bg,"aria-label":x.tt.replace("\\n"," ")});
    var left=el("div",{},[el("span",{cls:"tag",text:x.tag}),el("div",{cls:"tt"}),el("div",{cls:"ss",text:x.ss})]);
    x.tt.split("\\n").forEach(function(line,k){if(k)left.querySelector(".tt").appendChild(el("br"));left.querySelector(".tt").appendChild(document.createTextNode(line))});
    var right=el("div",{});right.innerHTML=x.m?mascot("sl"+i,x.m):"";b.appendChild(left);b.appendChild(right);b.onclick=x.go;sl.appendChild(b);dt.appendChild(el("i",{cls:i===0?"on":""}))});
  sl.addEventListener("scroll",function(){var i=Math.round(sl.scrollLeft/sl.clientWidth);if(i!==slideIx){slideIx=i;$$("#dots i").forEach(function(d,k){d.className=k===i?"on":""})}},{passive:true});
  if(!matchMedia("(prefers-reduced-motion: reduce)").matches){clearInterval(slideTimer);slideTimer=setInterval(function(){if($("section.panel[data-tab=home]").hidden||document.hidden)return;var n=(slideIx+1)%SLIDES.length;sl.scrollTo({left:n*sl.clientWidth,behavior:"smooth"})},5000)}}
renderBanner();

/* ---------- home: quick menu ---------- */
var QUICK=[["map","맛집지도",function(){go("food")}],["bus","통학버스",function(){jumpTo("move","통학버스")}],["meal","오늘 학식",function(){jumpTo("life","오늘의 학식")}],["won","장학금",function(){jumpTo("study","교내 장학금")}],
 ["build","건물 안내",function(){jumpTo("life","건물별 층 안내")}],["clock","과제 마감",function(){jumpTo("study","과제 마감 보드")}],["dept","학과 진로",function(){jumpTo("career","공식 취업 통계")}],["life","신입생",function(){jumpTo("home","신입생 가이드")}]];
(function(){var q=$("#quick");if(!q)return;QUICK.forEach(function(x){var b=el("button",{type:"button"});var ic=el("span",{cls:"ic"});ic.innerHTML=svgI(x[0]);b.appendChild(ic);b.appendChild(el("span",{text:x[1]}));b.onclick=x[2];q.appendChild(b)})})();

/* ---------- home: meal + nearest deadline ---------- */
(function(){var m=$("#mealCard");if(!m)return;var a=el("a",{cls:"card mini",href:"https://www.ut.ac.kr/prog/mealManage/MT01/kor/sub06_02_02_01/list.do",target:"_blank",rel:"noopener"},[el("span",{cls:"k",text:"오늘의 학식"}),el("span",{cls:"v",text:"식단 보기 ↗"}),el("span",{cls:"s",text:"학생식당 10:00~14:00"})]);m.replaceWith(a)})();
function renderDD(){var c=$("#ddCard");if(!c||!Array.isArray(deadlines))return;c.textContent="";
  var nx=deadlines.filter(function(x){return dday(x.date)>=0}).sort(function(a,b){return a.date<b.date?-1:1})[0];
  c.appendChild(el("span",{cls:"k",text:"다가오는 마감"}));c.appendChild(el("span",{cls:"v",text:nx?ddayTxt(dday(nx.date)):"없음"}));c.appendChild(el("span",{cls:"s",text:nx?nx.title:"등록된 일정이 없어요"}));
  c.onclick=function(){var w=$("#weekList");if(w)w.scrollIntoView({behavior:"smooth",block:"center"})}}

/* ---------- home: category chips + HOT list ---------- */
var CATS=["ALL","맛집","이동","학교생활","학업·장학","진로"],homeCat=store("homeCat")||"ALL";
function renderHot(){var box=$("#homeCats");if(!box)return;box.textContent="";
  CATS.forEach(function(c){var b=el("button",{type:"button","aria-pressed":String(homeCat===c),text:c});b.onclick=function(){homeCat=c;store("homeCat",c);renderHot()};box.appendChild(b)});
  var list=$("#hotList");list.textContent="";var rows=[];
  if(homeCat==="맛집"){rows=allPlaces().sort(function(a,b){return (b.rec||0)-(a.rec||0)}).slice(0,5).map(function(p){return {lb:"맛집",nm:p.name,sm:"추천 "+(p.rec||0),fn:function(o){var a=agg([p]);var pc=placeCard(p,a[p.id]);pc.style.margin="0";openPop(o,{eyebrow:"맛집 · 추천 "+(p.rec||0),title:p.name,color:"var(--l5)",body:[pc]})}}})}
  else if(homeCat==="진로"){rows=DEPTS.filter(function(d){return d.off}).slice(0,5).map(function(d){return {lb:"진로",nm:d.n+" 진로",sm:d.c+"캠퍼스",fn:function(){openDept=d;campus=d.c;go("career");renderDepts();setTimeout(function(){var x=$("#deptDetail");if(x)x.scrollIntoView({behavior:"smooth"})},40)}}})}
  else{var topicOf={ALL:null,"이동":["이동"],"학교생활":["학교시설","생활비","기타"],"학업·장학":["학사·장학"]}[homeCat];
    rows=XTIPS.filter(function(t){return !topicOf||topicOf.indexOf(t.topic)>=0}).sort(function(a,b){return b.rec-a.rec}).slice(0,5).map(function(t){return {lb:t.topic,nm:t.name,sm:"추천 "+t.rec,fn:function(o){tipPop(o,t)}}})}
  $("#hotTitle").textContent=homeCat==="ALL"?"HOT 꿀팁":"HOT "+homeCat;
  rows.forEach(function(r,i){var b=el("button",{cls:"hot-row",type:"button"},[el("span",{cls:"lb"+(i<2?" h":""),text:i<2?"HOT":r.lb}),el("span",{cls:"nm",text:r.nm}),el("small",{text:r.sm})]);b.onclick=function(){r.fn(b)};list.appendChild(b)})}
renderHot();

/* ---------- home: search across places and tips ---------- */
(function(){var q=$("#q"),res=$("#qres");if(!q)return;
  q.addEventListener("input",function(){var v=q.value.trim();res.textContent="";if(!v){res.hidden=true;return}
    var hits=[];allPlaces().forEach(function(p){if(p.name.indexOf(v)>=0||(p.addr||"").indexOf(v)>=0)hits.push({nm:p.name,sm:"맛집 · 추천 "+(p.rec||0),fn:function(o){var a=agg([p]);var pc=placeCard(p,a[p.id]);pc.style.margin="0";openPop(o,{eyebrow:"맛집",title:p.name,color:"var(--l5)",body:[pc]})}})});
    XTIPS.forEach(function(t){if(t.name.indexOf(v)>=0||(t.loc||"").indexOf(v)>=0||t.mode===v)hits.push({nm:t.name,sm:t.topic+" · 추천 "+t.rec,fn:function(o){tipPop(o,t)}})});
    TABS.forEach(function(t){if(t[1].indexOf(v)>=0)hits.unshift({nm:t[1]+" 메뉴로 이동",sm:"메뉴",fn:function(){go(t[0])}})});
    res.hidden=false;if(!hits.length){res.appendChild(el("div",{cls:"note",style:"padding:8px",text:"'"+v+"'에 맞는 결과가 없어요."}));return}
    hits.slice(0,8).forEach(function(h){var b=el("button",{type:"button"},[el("span",{text:h.nm}),el("small",{text:h.sm})]);b.onclick=function(){h.fn(b)};res.appendChild(b)})})})();

/* ---------- 맛집 list rows (bottom sheet) ---------- */
function placeRow(p,s){var b=el("div",{cls:"prow",role:"button",tabindex:"0"});
  var pic=el("span",{cls:"pic"});pic.innerHTML=svgI("food");
  var mt=el("div",{cls:"mt"},[el("span",{text:"추천 "+(p.rec||0)})]);
  if(p.price!=null)mt.appendChild(el("span",{cls:"pr",text:p.price.toLocaleString("ko-KR")+"원"}));
  [["solo","혼밥"],["clean","깨끗함"],["wide","넓음"]].forEach(function(k){if(p[k[0]]==="O")mt.appendChild(el("span",{cls:"on",text:k[1]+" O"}))});
  var mid=el("div",{style:"min-width:0"},[el("div",{cls:"nm",text:p.name}),el("div",{cls:"ad",text:p.addr||"위치 확인 안 됨"}),mt]);
  var on=!!(myVote.picks&&myVote.picks[p.id]);var st=el("button",{cls:"star",type:"button","aria-pressed":String(on),"aria-label":p.name+" 교통대생 픽"+(on?" 취소":"")});st.innerHTML=svgI("star");st.disabled=!canWrite;
  st.onclick=function(e){e.stopPropagation();if(myVote.picks[p.id])delete myVote.picks[p.id];else myVote.picks[p.id]=true;saveVote()};
  b.appendChild(pic);b.appendChild(mid);b.appendChild(st);
  function open(){var pc=placeCard(p,s);pc.style.margin="0";openPop(b,{eyebrow:(AREA_NAME[p.area]||"")+" · 추천 "+(p.rec||0),title:p.name,color:"var(--l5)",body:[pc]})}
  b.onclick=open;b.onkeydown=function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();open()}};return b}

/* ---------- 학교생활: building / floor guide from student tips ---------- */
var BUILD=[["종합강의관",["종합강의관","종합강의동"]],["대학본부",["대학본부"]],["중앙도서관",["중앙도서관","도서관"]],["학생회관",["학생회관"]],["국제청년협력센터",["국제청년협력센터"]],["건축관",["건축관"]],["인문사회관",["인문사회관","인사대"]],["대학원",["대학원"]],["휴스퀘어관",["휴스퀘어관"]],["국원생활관",["국원생활관"]]];
var bSel=store("bSel")||"종합강의관",fSel=null;
function tipsIn(b){var keys=BUILD.filter(function(x){return x[0]===b})[0][1];return XTIPS.filter(function(t){var hay=(t.loc||"")+" "+t.name;return keys.some(function(k){return hay.indexOf(k)>=0})})}
function floorOf(t){var m=((t.loc||"")+" "+t.name).match(/(\\d)\\s*층/);return m?m[1]+"F":"층 정보 없음"}
function renderBuild(){var bc=$("#bChips");if(!bc)return;bc.textContent="";
  BUILD.filter(function(x){return tipsIn(x[0]).length}).forEach(function(x){var b=el("button",{type:"button","aria-pressed":String(bSel===x[0]),text:x[0]+" "+tipsIn(x[0]).length});b.onclick=function(){bSel=x[0];fSel=null;store("bSel",bSel);renderBuild()};bc.appendChild(b)});
  var list=tipsIn(bSel),floors=Array.from(new Set(list.map(floorOf))).sort(function(a,b){if(a==="층 정보 없음")return -1;if(b==="층 정보 없음")return 1;return a<b?-1:1});
  if(!fSel||floors.indexOf(fSel)<0)fSel=floors.filter(function(f){return f!=="층 정보 없음"})[0]||floors[0];
  var fl=$("#floors");fl.textContent="";floors.forEach(function(f){var b=el("button",{type:"button","aria-pressed":String(fSel===f),text:f==="층 정보 없음"?"?":f});b.title=f;b.onclick=function(){fSel=f;renderBuild()};fl.appendChild(b)});
  var out=$("#floorList");out.textContent="";out.appendChild(el("div",{cls:"fl-h",text:bSel+" · "+(fSel==="층 정보 없음"?"층 정보 없음":fSel)}));
  list.filter(function(t){return floorOf(t)===fSel}).sort(function(a,b){return b.rec-a.rec}).forEach(function(t){var r=el("button",{cls:"fl-row",type:"button"},[el("span",{text:t.name}),el("small",{text:"추천 "+t.rec})]);r.onclick=function(){tipPop(r,t)};out.appendChild(r)})}
renderBuild();
renderFood();
/* ---------- connect db ---------- */`);

/* survey progress bar follows the selected answer */
rep(`  var cur=AUD.filter(function(a){return a.id===audSel})[0];`,`  var cur=AUD.filter(function(a){return a.id===audSel})[0];var bar=$("#audBar");if(bar)bar.style.width=(25*(AUD.indexOf(cur)+1))+"%";`);
fs.writeFileSync(F,s,"utf8");console.log("ok");

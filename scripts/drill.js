// Each menu shows a short list of section buttons; tapping one opens that section as its own screen with a back bar.
const fs=require("fs"),path=require("path");const F=path.join(__dirname,"knut-tips.html");
let s=fs.readFileSync(F,"utf8");
function rep(a,b){if(s.split(a).length!==2)throw new Error("not unique ("+(s.split(a).length-1)+"): "+a.slice(0,90));s=s.replace(a,()=>b)}

const CSS=`
/* ===== section menu (drill-in) ===== */
.secmenu{margin-top:14px;padding:6px 18px!important}
.sm-group{font-size:13px;font-weight:700;color:var(--t3);padding:16px 2px 4px;letter-spacing:.02em}
.sm-group:first-child{padding-top:10px}
.sm-row{display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;width:100%;padding:14px 0;border:0;border-bottom:1px solid var(--line);background:none;color:var(--t1);font:inherit;text-align:left;cursor:pointer}
.sm-row:last-child{border-bottom:0}
.sm-ic{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;background:#eef1ff;color:var(--hero)}
.sm-ic svg{width:23px;height:23px}
.sm-main{display:flex;flex-direction:column;min-width:0}
.sm-t{font-size:16.5px;font-weight:700;line-height:1.35}
.sm-s{font-size:13px;color:var(--t3);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sm-go{font-size:22px;color:var(--t3)}
.backbar{position:sticky;top:58px;z-index:4;display:flex;align-items:center;gap:10px;margin:0 -18px 4px;padding:12px 18px;background:var(--page);border-bottom:1px solid var(--line)}
.backbar button{border:0;background:var(--card);color:var(--t1);border-radius:999px;padding:8px 14px;font:inherit;font-weight:700;cursor:pointer;box-shadow:0 2px 8px rgba(20,30,70,.08)}
.backbar b{font-size:17px;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
section.panel.sub-mode .scr-hero,section.panel.sub-mode h1.sub,section.panel.sub-mode>.lead,section.panel.sub-mode .secmenu{display:none!important}
section.panel.sub-mode .stop{display:none!important}
section.panel.sub-mode .stop.sub-on{display:block!important;margin-top:8px!important}
section.panel.sub-mode .stop.sub-on>.stop-head h2{display:none}
section.panel.sub-mode .stop.sub-on>.cat-btn{display:none}
section.panel.sub-mode .stop.sub-on>.acc-body{display:block!important}
section.panel.menu-mode .stop:not(.keep){display:none!important}
.stop.drill-only{display:none!important}
section.panel.sub-mode .stop.drill-only.sub-on{display:block!important}
section.panel[data-tab="food"].sub-mode>*:not(.stop):not(.backbar){display:none!important}
section.panel.menu-mode h1.sub,section.panel.menu-mode>.lead{display:none!important}
`;
rep(`@media (prefers-reduced-motion:reduce){*{transition:none!important}}`,CSS+`@media (prefers-reduced-motion:reduce){*{transition:none!important}}`);

rep(`/* ---------- connect db ---------- */`,`/* ---------- section menu: buttons that open each section ---------- */
var SM_TABS=["move","life","study","career","food"];
var SM_DESC={"건물별 층 안내":"건물·층을 고르면 그곳의 꿀팁이 나와요","충주생활관 핵심 수칙":"점호, 귀사, 외박, 벌점 기준","생활관 뽕 뽑기":"식당·헬스장·독서실 위치와 시간","오늘의 학식":"학생식당·교직원식당·생활관 식단","자취 가이드":"직방·다방, 계약 전 체크리스트","성인이 된 뒤의 사회생활법":"메일 예절, 팀플, 선후배, 돈 관리","교내 시설 찾기":"프린트, 은행, 보건실 등 위치","공강 시간에 할 것":"산책길, 도서관, 체력단련실",
 "통학버스":"청주·이천·충주역 노선 시간표","자차 통학: 주차":"주차 정보 (확인 중)","과제 마감 보드":"과목별 마감일을 함께 적어요","선배 꿀팁":"공부량, 시험, 수강신청 경험","수강신청 전략":"교양 먼저, 장바구니 짝 짓기","졸업요건 진행률":"남은 학점 계산기","어학연수·교환학생 공고":"공고와 마감일 모음",
 "교내 장학금":"평점·학점 기준표","국가장학금":"신청 시기와 성적 기준","지역 장학금":"고향 시·군 장학재단","공식 취업 통계":"취업률 66.5%, 학과별 진로 카드","졸업생 진로 보드":"선배들이 남긴 직무와 지역","4년 진로 로드맵":"학년별 질문으로 진로 좁히기","동아리":"고르는 기준, 면접 예상 질문","휴학 버킷리스트":"휴학한 선배들의 활동","내가 가 본 가게 등록":"이름·위치·지도·사진으로 등록",
 "학생들이 모은 이동 꿀팁":"시내버스·택시·고속버스 꿀팁","학생들이 모은 학교생활 꿀팁":"학교시설·생활비·기타","학생들이 모은 학사·장학 꿀팁":"장학금, 수강신청, 교환학생"};
var SM_ICON=[["건물","build"],["생활관","life"],["학식","meal"],["자취","home"],["사회생활","career"],["시설","build"],["공강","clock"],["통학","bus"],["주차","move"],["이동 꿀팁","bus"],["학교생활 꿀팁","life"],["학사·장학 꿀팁","study"],["과제","clock"],["선배","study"],["수강","study"],["졸업요건","dept"],["교환","map"],["장학","won"],["취업","career"],["진로 보드","dept"],["로드맵","map"],["동아리","life"],["휴학","clock"],["가게","food"]];
function smTitle(st){var b=$(".cat-btn .cb-t",st);if(b)return b.textContent.trim();var h=$(".stop-head h2",st);return h?h.textContent.trim():""}
function smIcon(t){for(var i=0;i<SM_ICON.length;i++)if(t.indexOf(SM_ICON[i][0])>=0)return SM_ICON[i][1];return "life"}
function smDesc(t,st){for(var k in SM_DESC)if(t.indexOf(k)===0)return SM_DESC[k];var n=$(".note",st);return n?n.textContent.trim().slice(0,40):""}
var smTitleOf=new Map();
function buildSecMenus(){SM_TABS.forEach(function(tab){var panels=$$('section.panel[data-tab="'+tab+'"]');if(!panels.length)return;
  var first=panels[0],menu=el("div",{cls:"card secmenu"});
  panels.forEach(function(p){var stops=$$(":scope > .stop",p).filter(function(st){return !(tab==="food"&&!/가게 등록/.test(smTitle(st)))});
    if(!stops.length)return;var sub=$("h1.sub",p);if(sub)menu.appendChild(el("div",{cls:"sm-group",text:sub.textContent.trim()}));
    else if(tab!=="food")menu.appendChild(el("div",{cls:"sm-group",text:"주요 정보"}));
    stops.forEach(function(st){var t=smTitle(st);smTitleOf.set(st,t);if(tab==="food")st.classList.add("drill-only");var r=el("button",{cls:"sm-row",type:"button"});var ic=el("span",{cls:"sm-ic"});ic.innerHTML=svgI(smIcon(t));
      r.appendChild(ic);r.appendChild(el("span",{cls:"sm-main"},[el("span",{cls:"sm-t",text:t}),el("span",{cls:"sm-s",text:smDesc(t,st)})]));r.appendChild(el("span",{cls:"sm-go",text:"›"}));
      r.onclick=function(){openSection(tab,st)};menu.appendChild(r)})});
  var hero=$(".scr-hero",first);
  if(tab==="food"){var sheet=$(".sheet",first);(sheet||first).after(menu);menu.classList.add("food-extra")}
  else if(hero)hero.after(menu);else first.insertBefore(menu,first.firstChild);
  if(tab!=="food")panels.forEach(function(p){p.classList.add("menu-mode")})})}
function openSection(tab,st){var panels=$$('section.panel[data-tab="'+tab+'"]');
  panels.forEach(function(p){p.classList.remove("menu-mode");p.classList.add("sub-mode");$$(".stop.sub-on",p).forEach(function(x){x.classList.remove("sub-on")})});
  st.classList.add("sub-on");var body=$(".acc-body",st);if(body)body.hidden=false;
  var old=$(".backbar");if(old)old.remove();var label=(TABS.filter(function(x){return x[0]===tab})[0]||["",""])[1];
  var back=el("button",{type:"button",text:"‹ "+label});back.onclick=function(){closeSection(tab)};
  var bar=el("div",{cls:"backbar"},[back,el("b",{text:smTitleOf.get(st)||smTitle(st)})]);st.parentNode.insertBefore(bar,st);
  window.scrollTo(0,0)}
function closeSection(tab){var b=$(".backbar");if(b)b.remove();
  $$('section.panel[data-tab="'+tab+'"]').forEach(function(p){p.classList.remove("sub-mode");$$(".stop.sub-on",p).forEach(function(x){x.classList.remove("sub-on")});if(tab!=="food")p.classList.add("menu-mode")});
  window.scrollTo(0,0)}
buildSecMenus();
/* tab switches start from the section list; links that name a section open it directly */
var _go=go;go=function(id){var t=ALIAS[id]||id;if(SM_TABS.indexOf(t)>=0&&$('section.panel.sub-mode[data-tab="'+t+'"]'))closeSection(t);_go(id)};
jumpTo=function(tab,title){tab=ALIAS[tab]||tab;go(tab);if(SM_TABS.indexOf(tab)<0||tab==="food"&&!/가게 등록/.test(title)){setTimeout(function(){var hs=$$("section.panel:not([hidden]) h1, section.panel:not([hidden]) .stop-head h2, section.panel:not([hidden]) h3");var h=hs.filter(function(x){return x.textContent.trim().indexOf(title)===0})[0];if(h)h.scrollIntoView({behavior:"smooth",block:"start"})},30);return}
  var st=$$('section.panel[data-tab="'+tab+'"] > .stop').filter(function(x){var t=smTitleOf.get(x)||smTitle(x);return t.indexOf(title)===0||title.indexOf(t)===0})[0];
  if(!st){var hh=$$('section.panel[data-tab="'+tab+'"] h1.sub').filter(function(x){return x.textContent.trim().indexOf(title)===0})[0];if(hh){var p=hh.closest("section.panel");st=$(":scope > .stop",p)}}
  if(st)openSection(tab,st)};
/* ---------- connect db ---------- */`);
fs.writeFileSync(F,s,"utf8");console.log("ok");

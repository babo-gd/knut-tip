// Rebuild 교통대 꿀팁노선도 into 6 menus and load the normalized Excel data (맛집 95, 생활꿀팁 82).
const fs=require("fs"),path=require("path");
const LIVE="C:/Users/Daeun/.claude/projects/C--Users-Daeun-AppData-Roaming-Claude-scratch-workspaces-79acf975-ce69-4bba-9e00-bc24afa5ada4-851ab036-8866-4d47-9a46-725a41eefdb2-scratch-2026-10-06-18d814/d59a8661-65dc-4f10-ba33-bc77391bad39/tool-results/artifact-4ddbd720-1791287693-4721.html";
const ROWS=path.join(__dirname,"..","norm","rows.json");
let s=fs.readFileSync(LIVE,"utf8");
// strip the publish skeleton so we republish page content only
s=s.slice(s.indexOf("<body>")+6,s.lastIndexOf("</body>")).replace(/^\n/,"");
function rep(a,b){if(s.split(a).length!==2)throw new Error("not unique ("+(s.split(a).length-1)+"): "+a.slice(0,90));s=s.replace(a,()=>b)}
function cut(startMark,endMark){const a=s.indexOf(startMark);if(a<0)throw new Error("no "+startMark.slice(0,60));const b=s.indexOf(endMark,a+startMark.length);if(b<0)throw new Error("no end for "+startMark.slice(0,60));const out=s.slice(a,b);s=s.slice(0,a)+s.slice(b);return out}
function insertBeforeSectionEnd(tabMarker,html){const a=s.indexOf(tabMarker);if(a<0)throw new Error("no "+tabMarker);const b=s.indexOf("</section>",a);s=s.slice(0,b)+html+s.slice(b)}

/* ================= data from the Excel (rows.json) ================= */
const rows=JSON.parse(fs.readFileSync(ROWS,"utf8"));
if(rows.맛집.length!==95||rows.생활꿀팁.length!==82)throw new Error("unexpected row counts "+rows.맛집.length+"/"+rows.생활꿀팁.length);
const NA="확인 안 됨";
function areaOf(a){if(!a||a===NA)return "unk";if(/대소원면/.test(a))return "near";if(/중앙탑면|주덕읍/.test(a))return "view";return "city"}
const M=rows.맛집.map((r,i)=>({id:"x"+String(i+1).padStart(3,"0"),name:r.이름,addr:r.위치===NA?"":r.위치,map:r.지도===NA?"":r.지도,date:r["확인한 날"],
  rec:r["추천 수"],price:typeof r.가격==="number"?r.가격:null,solo:r.혼밥,clean:r.깨끗함,wide:r.넓음,area:areaOf(r.위치)}));
const T=rows.생활꿀팁.map((r,i)=>({id:"t"+String(i+1).padStart(3,"0"),name:r.이름,loc:r.위치,map:r.지도===NA?"":r.지도,date:r["확인한 날"],rec:r["추천 수"],
  topic:r.주제,mode:r.이동수단,range:r.구간,prep:r.준비물}));
if(M.reduce((n,x)=>n+x.rec,0)!==149||T.reduce((n,x)=>n+x.rec,0)!==126)throw new Error("recommend sums changed");

/* ================= HTML: 9 panels -> 6 menus ================= */
rep(`<section class="panel" data-tab="fresh" style="--c:var(--l6)" hidden>
  <h1>신입생 가이드</h1>`,`<section class="panel" data-tab="home" style="--c:var(--l6)" hidden>
  <h1 class="sub">신입생 가이드</h1>`);
rep(`<section class="panel" data-tab="study" style="--c:var(--l1)" hidden>
  <h1>학업</h1>
  <p class="lead">수강신청 전략, 과목별 과제 마감, 선배들이 남긴 공부 팁을 모아요.</p>`,
`<section class="panel" data-tab="study" style="--c:var(--l3)" hidden>
  <h1>학업·장학</h1>
  <p class="lead">수강신청, 과제 마감, 장학금, 교환학생까지. 학생들이 모은 학사·장학 꿀팁을 먼저 보여 줘요.</p>
  <div class="stop" style="--c:var(--l3)"><div class="stop-head"><h2>학생들이 모은 학사·장학 꿀팁</h2><span class="meta" data-meta="xstudy"></span></div>
    <p class="note">학생 21명이 낸 생활꿀팁 중 주제가 <b>학사·장학</b>인 것만 모았어요. 추천 수가 많은 순서예요. 카드를 누르면 자세히 볼 수 있어요.</p>
    <div class="filters" id="tipStudyF"></div>
    <div class="grid" id="tipStudy"></div>
  </div>`);
rep(`<section class="panel" data-tab="money" style="--c:var(--l3)" hidden>
  <h1>장학·지원</h1>`,`<section class="panel" data-tab="study" style="--c:var(--l3)" hidden>
  <h1 class="sub">장학·지원</h1>`);
rep(`<section class="panel" data-tab="life" style="--c:var(--l2)" hidden>
  <h1>생활</h1>
  <p class="lead">생활관, 학식, 자취, 그리고 성인으로서의 학교생활.</p>`,
`<section class="panel" data-tab="life" style="--c:var(--l2)" hidden>
  <h1>학교생활</h1>
  <p class="lead">교내 시설, 생활관, 학식, 자취, 공강 시간까지. 학생들이 모은 학교생활 꿀팁을 먼저 보여 줘요.</p>
  <div class="stop" style="--c:var(--l2)"><div class="stop-head"><h2>학생들이 모은 학교생활 꿀팁</h2><span class="meta" data-meta="xlife"></span></div>
    <p class="note">학생 21명이 낸 생활꿀팁 중 주제가 <b>학교시설·생활비·기타</b>인 것을 모았어요. 추천 수가 많은 순서예요. 카드를 누르면 자세히 볼 수 있어요.</p>
    <div class="filters" id="tipLifeF"></div>
    <div class="grid" id="tipLife"></div>
  </div>`);
// campus -> 이동 ; its 교내 시설 stop moves to 학교생활
const facil=cut(`  <div class="stop"><div class="stop-head"><h2>교내 시설 찾기</h2>`,`  <div class="stop"><div class="stop-head"><h2>자차 통학: 주차</h2>`);
rep(`<section class="panel" data-tab="campus" style="--c:var(--l4)" hidden>
  <h1>캠퍼스 (충주)</h1>
  <p class="lead">통학버스, 교내 시설 위치, 주차 정보.</p>`,
`<section class="panel" data-tab="move" style="--c:var(--l4)" hidden>
  <h1>이동</h1>
  <p class="lead">통학버스, 시내버스, 택시, 고속버스, 주차까지. 학교를 오가는 방법을 한곳에 모았어요.</p>`);
rep(`    <p class="note">문의 043-841-5114 · <a href="https://www.ut.ac.kr/kor/sub06_06_01.do" target="_blank" rel="noopener">통학버스 공식 안내</a> · <a href="https://www.ut.ac.kr/kor/sub06_06_03.do" target="_blank" rel="noopener">시내버스</a> · <a href="https://www.ut.ac.kr/kor/sub06_06_02.do" target="_blank" rel="noopener">시외·직행버스</a></p>
  </div>`,
`    <p class="note">문의 043-841-5114 · <a href="https://www.ut.ac.kr/kor/sub06_06_01.do" target="_blank" rel="noopener">통학버스 공식 안내</a> · <a href="https://www.ut.ac.kr/kor/sub06_06_03.do" target="_blank" rel="noopener">시내버스</a> · <a href="https://www.ut.ac.kr/kor/sub06_06_02.do" target="_blank" rel="noopener">시외·직행버스</a></p>
  </div>
  <div class="stop" style="--c:var(--l4)"><div class="stop-head"><h2>학생들이 모은 이동 꿀팁</h2><span class="meta" data-meta="xmove"></span></div>
    <p class="note">학생 21명이 낸 생활꿀팁 중 주제가 <b>이동</b>인 것만 모았어요. 이동수단과 구간으로 골라 볼 수 있어요.</p>
    <div class="filters" id="tipMoveF"></div>
    <div class="filters" id="tipMoveF2"></div>
    <div class="grid" id="tipMove"></div>
  </div>`);
// 진로: 졸업생 진로 + 성장 ; 공강 -> 학교생활, 교환학생 -> 학업·장학
const gap=cut(`  <div class="stop"><div class="stop-head"><h2>공강 시간에 할 것</h2>`,`  <div class="stop"><div class="stop-head"><h2>동아리</h2>`);
const exch=cut(`  <div class="stop"><div class="stop-head"><h2>어학연수·교환학생 공고</h2>`,`  <div class="stop"><div class="stop-head"><h2>휴학 버킷리스트</h2>`);
insertBeforeSectionEnd(`<section class="panel" data-tab="life"`,facil+gap);
insertBeforeSectionEnd(`<section class="panel" data-tab="study" style="--c:var(--l3)" hidden>
  <h1>학업·장학</h1>`,exch);
rep(`<section class="panel" data-tab="alumni" style="--c:var(--l3)" hidden>
  <h1>졸업생 진로</h1>`,`<section class="panel" data-tab="career" style="--c:var(--l6)" hidden>
  <h1>진로</h1>`);
rep(`<section class="panel" data-tab="grow" style="--c:var(--l6)" hidden>
  <h1>성장</h1>
  <p class="lead">진로 로드맵, 공강 활동, 동아리, 교환학생, 휴학 버킷리스트.</p>`,
`<section class="panel" data-tab="career" style="--c:var(--l6)" hidden>
  <h1 class="sub">성장</h1>
  <p class="lead">진로 로드맵, 동아리, 휴학 버킷리스트.</p>`);
// 맛집 panel copy
rep(`  <h1>맛집·카페</h1>
  <p class="lead">교통대생이 충주 동네 가게를 찾고, 다시 가고, 친구에게 알려 주면 지역 상권이 살아나요. 학교 근처는 평점 4.0 이상만 골랐고, 시내 리스트도 있어요. 좋았던 곳은 <b>교통대생 픽</b>으로 투표해 주세요. 3표 이상이면 뱃지가 붙어요.</p>`,
`  <h1>맛집</h1>
  <p class="lead">학생 21명이 직접 낸 맛집 149건을 정리한 ${M.length}곳이에요. 같은 가게를 여러 명이 추천하면 한 줄로 합치고 <b>추천 수</b>로 적었어요. 가격·혼밥·깨끗함·넓음으로 골라 보고, 좋았던 곳은 <b>교통대생 픽</b>으로 투표해 주세요.</p>`);
rep(`<p>곳의 충주 동네 가게가 등록됐어요. 직접 가 본 곳만 올려 주세요. 사진과 꿀팁은 가 본 사람만 알 수 있어요.</p>`,
`<p>곳의 충주 동네 가게가 있어요. 교통대생이 한 번 더 가 주는 게 동네 가게에 가장 큰 응원이에요.</p>`);
// home quick chips point at the new menus
rep(`        <button class="chip" data-go="campus">통학버스 시간표</button>
        <button class="chip" data-go="life">생활관 수칙</button>
        <button class="chip" data-go="money">장학금 기준</button>
        <button class="chip" data-go="food">교통대생 픽 맛집</button>
        <button class="chip" data-go="study">과제 마감 보드</button>`,
`        <button class="chip" data-go="food">추천 많은 맛집</button>
        <button class="chip" data-go="move">통학버스·시내버스</button>
        <button class="chip" data-go="life">학교생활 꿀팁</button>
        <button class="chip" data-go="study">장학금 기준</button>
        <button class="chip" data-go="career">학과별 진로</button>`);
rep(`<button class="btn primary" data-go="fresh">신입생 가이드 열기</button>`,`<button class="btn primary" id="toFresh" type="button">신입생 가이드 보기</button>`);
rep(`<div class="stop-head"><h2>교통대생이 많이 찾는 동네 가게</h2><button class="btn small" data-go="food">전체 보기</button></div>
    <p class="note">픽을 많이 받은 순서예요. 한 번 더 가 주는 게 동네 가게에 가장 큰 응원이에요.</p>`,
`<div class="stop-head"><h2>학생들이 가장 많이 추천한 곳</h2><button class="btn small" data-go="food">맛집 전체 보기</button></div>
    <p class="note">학생 21명의 추천을 합친 순서예요. 맛집 3곳과 생활꿀팁 3개를 보여 줘요.</p>`);
rep(`    <div class="grid" id="homePicks"></div>`,`    <div class="grid" id="homePicks"></div>
    <div class="grid" id="homeTips"></div>`);
rep(`<p class="note" style="margin:6px 0 0">실제 거리와 다른 개략도예요. 핀을 누르면 가게 정보가 아래에 나와요.</p>`,
`<p class="note" style="margin:6px 0 0">실제 거리와 다른 개략도예요. 동네 단위로 대략 놓았어요. 큰 핀일수록 추천 수가 많아요. 핀을 누르면 가게 정보가 떠요.</p>`);

/* ================= CSS ================= */
rep(`@media (prefers-reduced-motion:reduce){*{transition:none!important}}`,`h1.sub{font-size:clamp(24px,4vw,30px)!important;margin-top:40px;padding-top:26px;border-top:1px dashed var(--line)}
.tipx{display:flex;flex-direction:column;gap:8px;text-align:left;cursor:pointer;color:var(--ink);font:inherit}
.tipx h3{margin:0;line-height:1.35}
.tipx .tags{display:flex;flex-wrap:wrap;gap:4px}
.tipx .loc{font-size:13px;color:var(--muted)}
.pill.rec{color:#fff;border-color:transparent;background:var(--grad-deep)}
.pill.x{color:var(--bad);border-color:rgba(251,113,133,.4)}
.pill.price{color:var(--warn);border-color:rgba(251,191,36,.4)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}`);

/* ================= JS ================= */
rep(`var TABS=[["home","홈","--l1"],["fresh","신입생 가이드","--l6"],["study","학업","--l1"],["money","장학·지원","--l3"],["life","생활","--l2"],["campus","캠퍼스","--l4"],["food","맛집·카페","--l5"],["alumni","졸업생 진로","--l3"],["grow","성장","--l6"]];`,
`var TABS=[["home","홈","--l1"],["food","맛집","--l5"],["move","이동","--l4"],["life","학교생활","--l2"],["study","학업·장학","--l3"],["career","진로","--l6"]];
/* old menu names still used by links inside the page */
var ALIAS={fresh:"home",money:"study",campus:"move",alumni:"career",grow:"career"};`);
rep(`function go(id){$$("section.panel")`,`function go(id){id=ALIAS[id]||id;$$("section.panel")`);
rep(`var start=(location.hash||"").slice(1);go(`,`var start=(location.hash||"").slice(1);start=ALIAS[start]||start;go(`);
rep(`alstat:"2026.10.06",alboard:"실시간 제보"};`,`alstat:"2026.10.06",alboard:"실시간 제보",xstudy:"2026.10.13 (2주차 정리)",xlife:"2026.10.13 (2주차 정리)",xmove:"2026.10.13 (2주차 정리)"};`);
rep(`alstat:"공식 취업 통계",alboard:"졸업생 진로 보드"};`,`alstat:"공식 취업 통계",alboard:"졸업생 진로 보드",xstudy:"학사·장학 꿀팁",xlife:"학교생활 꿀팁",xmove:"이동 꿀팁"};`);

// places: the 22 web-sourced places are replaced by the 95 normalized rows
const p0=s.indexOf("var PLACES=[");const p1=s.indexOf("var AREA_NAME=",p0);if(p0<0||p1<0)throw new Error("PLACES block");
s=s.slice(0,p0)+`/* 2주차에 정규화한 학생 데이터 (고다은_데이터.xlsx 맛집 시트, 원본 149건 → ${M.length}곳) */
var PLACES=${JSON.stringify(M)};
PLACES.forEach(function(p){p.attrs={}});
`+s.slice(p1);
rep(`var AREA_NAME={near:"교통대 앞",city:"시내",view:"근교"};
var AREAS=[["all","전체"],["near","교통대 앞"],["city","시내"],["view","근교"]];
var FILTERS=[["solo","혼밥 가능"],["late","늦게까지 영업"],["value","가성비"],["gift","지역화폐 OK"],["pick","교통대생 픽"]];
var TAGS=[["solo","혼밥 OK"],["late","늦게까지"],["value","가성비"],["gift","지역화폐 OK"]];
var SEATS=[[0,"단체석 전체"],[6,"6명+"],[10,"10명+"],[20,"20명+"]];`,
`var AREA_NAME={near:"교통대 앞",city:"시내",view:"근교",unk:"위치 확인 안 됨"};
var AREAS=[["all","전체"],["near","교통대 앞"],["city","시내"],["view","근교"]];
var PRICES=[["all","가격 전체"],["lt5","5천원 미만"],["mid","5천~1만원"],["gt10","1만원 초과"]];
var FILTERS=[["solo","혼밥 O"],["clean","깨끗함 O"],["wide","넓음 O"],["pick","교통대생 픽"]];
var TAGS=[];
var SEATS=[];
var priceSel=store("priceSel")||"all";
function priceOK(p){if(priceSel==="all")return true;if(p.price==null)return false;
  if(priceSel==="lt5")return p.price<5000;if(priceSel==="mid")return p.price>=5000&&p.price<=10000;return p.price>10000}`);
rep(`  var sel=el("select",{id:"seatSel","aria-label":"단체석 인원",style:"width:auto"});SEATS.forEach(function(s){var o=el("option",{value:s[0],text:s[1]});if(s[0]===seatMin)o.selected=true;sel.appendChild(o)});
  sel.onchange=function(){seatMin=+sel.value;renderFood()};ff.appendChild(sel)}`,
`  var sel=el("select",{id:"priceSel","aria-label":"가격",style:"width:auto"});PRICES.forEach(function(x){var o=el("option",{value:x[0],text:x[1]});if(x[0]===priceSel)o.selected=true;sel.appendChild(o)});
  sel.onchange=function(){priceSel=sel.value;store("priceSel",priceSel);renderFood()};ff.insertBefore(sel,ff.firstChild)}`);
// card: Excel fields instead of the old tag votes
rep(`  [fieldRow("이름",p.name),fieldRow("위치",p.addr||"없음",!p.addr),fieldRow("지도",mapNode,mapNode==="없음"),fieldRow("확인한 날",p.date||ONLINE)]`,
`  [fieldRow("이름",p.name),fieldRow("위치",p.addr||"확인 안 됨",!p.addr),fieldRow("지도",mapNode,mapNode==="없음"),fieldRow("확인한 날",p.date||"확인 안 됨")]`);
rep(`  tags.appendChild(el("span",{cls:"pill",text:AREA_NAME[p.area]+(p.where?" · "+p.where:"")}));
  tags.appendChild(el("span",{cls:"pill",text:p.kind}));`,
`  if(p.rec)tags.appendChild(el("span",{cls:"pill rec",text:"추천 "+p.rec}));
  tags.appendChild(el("span",{cls:"pill",text:AREA_NAME[p.area]||"교통대 앞"}));
  if(p.rec)tags.appendChild(el("span",{cls:"pill price",text:p.price!=null?p.price.toLocaleString("ko-KR")+"원":"가격 확인 안 됨"}));
  [["solo","혼밥"],["clean","깨끗함"],["wide","넓음"]].forEach(function(k){var v=p[k[0]];if(v==="O")tags.appendChild(el("span",{cls:"pill ok",text:k[1]+" O"}));else if(v==="X")tags.appendChild(el("span",{cls:"pill x",text:k[1]+" X"}))});`);
rep(`    var seatIn=el("input",{type:"number",min:"1",max:"200",id:"seat-"+p.id,placeholder:"단체석 인원","aria-label":p.name+" 단체석 인원",style:"width:110px;padding:3px 7px;font-size:12px"});if(mine.seats[p.id])seatIn.value=mine.seats[p.id];seatIn.disabled=!canWrite;
    seatIn.onchange=function(){var n=Math.round(+seatIn.value);if(n>0&&n<=200)mine.seats[p.id]=n;else delete mine.seats[p.id];saveVote()};vote.appendChild(seatIn);
`,``);
rep(`el("span",{text:p.visited?"학생 제보":"출처: 다이닝코드·지역 매체"})`,`el("span",{text:p.visited?"사이트에서 학생 등록":"출처: 학생 21명 제출 자료 정리 (2주차)"})`);
rep(`    for(var i=0;i<TAGS.length;i++){var k=TAGS[i][0];if(flt[k]&&!(p.attrs[k]||s[k]))return false}
    if(flt.pick&&s.pick<PICK_MIN)return false;
    if(seatMin){var n=p.attrs.seats||s.seatN;if(!n||n<seatMin)return false}
    return true});
  shown.sort(function(x,y){return a[y.id].pick-a[x.id].pick||(y.visited?1:0)-(x.visited?1:0)||(y.rating||0)-(x.rating||0)});
  if(!shown.length)grid.appendChild(el("div",{cls:"empty",style:"grid-column:1/-1",text:"조건에 맞는 곳이 아직 없어요. 다녀온 곳에 혼밥·늦게까지·가성비·지역화폐·단체석 정보를 표시해 주세요."}));`,
`    if(!priceOK(p))return false;
    if(flt.solo&&p.solo!=="O")return false;if(flt.clean&&p.clean!=="O")return false;if(flt.wide&&p.wide!=="O")return false;
    if(flt.pick&&s.pick<PICK_MIN)return false;
    return true});
  shown.sort(function(x,y){return (y.rec||0)-(x.rec||0)||a[y.id].pick-a[x.id].pick||x.name.localeCompare(y.name,"ko")});
  var cnt=$("#foodCount");if(cnt)cnt.textContent=shown.length+"곳이 조건에 맞아요";
  if(!shown.length)grid.appendChild(el("div",{cls:"empty",style:"grid-column:1/-1",text:"조건에 맞는 곳이 없어요. 원본에 정보가 없는 칸은 '확인 안 됨'이라 필터에 걸리지 않아요. 조건을 하나씩 빼 보세요."}));`);
rep(`  list.slice().sort(function(x,y){return a[y.id].pick-a[x.id].pick||(y.rating||0)-(x.rating||0)}).slice(0,3).forEach(function(p){hp.appendChild(placeCard(p,a[p.id],true))})}`,
`  list.slice().sort(function(x,y){return (y.rec||0)-(x.rec||0)||a[y.id].pick-a[x.id].pick}).slice(0,3).forEach(function(p){hp.appendChild(placeCard(p,a[p.id],true))})}`);
rep(`<div class="filters" id="foodFilters"></div>`,`<div class="filters" id="foodFilters"></div>
  <p class="note" id="foodCount" style="margin:8px 0 0"></p>`);
rep(`function placesPop(origin){var all=allPlaces(),a=agg(all);var top=all.slice().sort(function(x,y){return a[y.id].pick-a[x.id].pick||(y.rating||0)-(x.rating||0)}).slice(0,3);`,
`function placesPop(origin){var all=allPlaces(),a=agg(all);var top=all.slice().sort(function(x,y){return (y.rec||0)-(x.rec||0)||a[y.id].pick-a[x.id].pick}).slice(0,3);`);
rep(`"픽이 많은 순서 TOP 3"`,`"추천 수가 많은 순서 TOP 3"`);
rep(`return el("div",{cls:"kv"},[el("span",{text:(i+1)+". "+p.name}),el("span",{cls:"mono",text:"픽 "+a[p.id].pick})])`,`return el("div",{cls:"kv"},[el("span",{text:(i+1)+". "+p.name}),el("span",{cls:"mono",text:"추천 "+(p.rec||0)})])`);
// map: bigger pin = more recommendations; unknown location area
rep(`var AREA_C={near:[165,365],city:[520,280],view:[300,110]};`,`var AREA_C={near:[165,365],city:[520,280],view:[300,110],unk:[690,400]};`);
rep(`var col=p.kind==="카페"?"#c084fc":p.kind==="술집"?"#fb923c":"#f472b6";var pk=a[p.id].pick>=PICK_MIN;`,
`var col=p.solo==="O"?"#34d399":"#f472b6";var pk=a[p.id].pick>=PICK_MIN||(p.rec||0)>=3;`);
rep(`g.appendChild(S("circle",{cx:x,cy:y,r:pk?"12":"9",fill:col}));`,`g.appendChild(S("circle",{cx:x,cy:y,r:String(Math.min(16,7+2*(p.rec||1))),fill:col}));`);
rep(`var lb=S("text",{x:x,y:y-15,"text-anchor":"middle"});lb.textContent=p.name.length>8?p.name.slice(0,8)+"…":p.name;g.appendChild(lb);`,
`if((p.rec||0)>=2){var lb=S("text",{x:x,y:y-17,"text-anchor":"middle"});lb.textContent=p.name.length>8?p.name.slice(0,8)+"…":p.name;g.appendChild(lb)}`);
rep(`var lgd=[["#f472b6","식당"],["#c084fc","카페"],["#fb923c","술집"]];`,`var lgd=[["#f472b6","가게"],["#34d399","혼밥 O"]];`);
rep(`t2.textContent="★ 큰 핀 = 교통대생 픽";`,`t2.textContent="큰 핀 = 추천 수가 많은 곳 · 이름은 추천 2 이상만";`);
rep(`openPop(g,{burst:col,eyebrow:(AREA_NAME[p.area]||"")+" · "+p.kind,title:p.name,`,`openPop(g,{burst:col,eyebrow:(AREA_NAME[p.area]||"")+" · 추천 "+(p.rec||0),title:p.name,`);

// transit map: 5 stations for the new menus
const st0=s.indexOf("var STATIONS=[");const st1=s.indexOf("function recStations(){",st0);
s=s.slice(0,st0)+`var STATIONS=[
 {id:"study",n:"학업·장학",x:110,y:150,c:"--l3",x2:true,lp:"b"},
 {id:"life",n:"학교생활",x:330,y:150,c:"--l2",lp:"b"},
 {id:"move",n:"이동",x:550,y:150,c:"--l4",x2:true,lp:"b"},
 {id:"food",n:"맛집",x:800,y:150,c:"--l5",lp:"b"},
 {id:"career",n:"진로",x:330,y:50,c:"--l6",lp:"t"}];
var LINES=[["학교생활선","--l2","M110 150 L550 150"],["충주선","--l5","M550 150 L800 150"],["진로선","--l6","M110 150 L210 50 L330 50"]];
`+s.slice(st1);
rep(`var am=S("animateMotion",{dur:"9s",repeatCount:"indefinite",path:"M70 150 L730 150 L830 250 L860 250"});`,`var am=S("animateMotion",{dur:"8s",repeatCount:"indefinite",path:"M110 150 L800 150"});`);
const rs0=s.indexOf("function recStations(){");const rs1=s.indexOf("function renderMetro(){",rs0);
s=s.slice(0,rs0)+`function recStations(){var r={};if(!prof)return r;
  if(prof.year==="1"||prof.year==="2")r.study=1;if(prof.year==="3"||prof.year==="4")r.career=1;
  if(prof.live==="dorm"||prof.live==="room")r.life=1;if((prof.live||"").indexOf("bus-")===0)r.move=1;r.food=1;return r}
`+s.slice(rs1);
const si0=s.indexOf("var ST_INFO={");const si1=s.indexOf("function openStation(",si0);
s=s.slice(0,si0)+`var ST_INFO={
 food:["학생 21명이 추천한 충주 맛집 ${M.length}곳",["추천 수가 많은 순서로 정렬","가격·혼밥·깨끗함·넓음으로 고르기","지도 핀과 교통대생 픽 투표"]],
 move:["학교를 오가는 방법",["통학버스 3개 노선 시간표","학생들이 모은 이동 꿀팁 ${T.filter(t=>t.topic==="이동").length}개 (999번, 택시 할증 할인 등)","이동수단·구간으로 골라 보기"]],
 life:["학교 안에서 쓰는 모든 것",["학교생활 꿀팁 ${T.filter(t=>["학교시설","생활비","기타"].includes(t.topic)).length}개 (프린트, 보건실, 은행 등)","생활관 수칙·시설, 학식, 자취","교내 시설 찾기, 공강 시간에 할 것"]],
 study:["수업과 장학금",["학사·장학 꿀팁 ${T.filter(t=>t.topic==="학사·장학").length}개","과제 마감 보드, 수강신청 전략, 졸업요건","장학금 기준, 어학연수·교환학생"]],
 career:["선배들은 어디서 일할까",["취업률 66.5% (국립대 1위)","캠퍼스별 학과 진로 카드","진로 로드맵, 동아리, 휴학 버킷리스트"]]};
`+s.slice(si1);

/* student tips (생활꿀팁 시트) */
rep(`/* ---------- connect db ---------- */`,`/* ---------- 2주차 정규화 생활꿀팁 (고다은_데이터.xlsx 생활꿀팁 시트, 원본 126건 → ${T.length}개) ---------- */
var XTIPS=${JSON.stringify(T)};
function usable(v){return v&&v!=="확인 안 됨"&&v!=="해당 없음"}
function tipCardX(t){var tags=el("div",{cls:"tags"},[el("span",{cls:"pill rec",text:"추천 "+t.rec}),el("span",{cls:"pill",text:t.topic})]);
  if(usable(t.mode))tags.appendChild(el("span",{cls:"pill ok",text:t.mode}));
  if(usable(t.range))tags.appendChild(el("span",{cls:"pill",text:t.range==="학교↔시내"?"시내와 학교":t.range}));
  if(usable(t.prep))tags.appendChild(el("span",{cls:"pill price",text:"준비물: "+t.prep}));
  var c=el("button",{cls:"card tipx",type:"button"},[el("h3",{text:t.name}),tags,el("span",{cls:"loc",text:usable(t.loc)?"위치: "+t.loc:"위치 확인 안 됨"})]);
  c.onclick=function(e){ripple(c,e);tipPop(c,t)};tilt(c);return c}
function tipPop(origin,t){var dl=el("dl",{cls:"fields"});
  var mapNode=t.map?el("a",{href:t.map,target:"_blank",rel:"noopener",text:t.map.replace(/^https?:\\/\\//,"")}):"확인 안 됨";
  [["이름",t.name],["위치",usable(t.loc)?t.loc:"확인 안 됨"],["지도",mapNode],["확인한 날",t.date],["추천 수",t.rec+"건"],["주제",t.topic],["이동수단",t.mode],["구간",t.range==="학교↔시내"?"시내와 학교":t.range],["준비물",t.prep]].forEach(function(r){dl.appendChild(el("dt",{text:r[0]}));dl.appendChild(el("dd",{},[r[1]]))});
  var rel=XTIPS.filter(function(x){return x.id!==t.id&&x.topic===t.topic}).sort(function(a,b){return b.rec-a.rec}).slice(0,3);
  var relBox=el("div",{},[el("div",{cls:"eyebrow",text:"같은 주제의 다른 꿀팁"})].concat(rel.map(function(x){return el("div",{cls:"kv"},[el("span",{text:x.name}),el("span",{cls:"mono",text:"추천 "+x.rec})])})));
  openPop(origin,{eyebrow:"학생 꿀팁 · "+t.topic,title:t.name,color:"var("+(t.topic==="이동"?"--l4":t.topic==="학사·장학"?"--l3":"--l2")+")",body:[dl,el("p",{cls:"note",style:"margin:0",text:"학생 21명이 낸 원본을 정리한 자료예요. 확인 안 됨 = 원본에 없는 정보, 해당 없음 = 이 꿀팁에 맞지 않는 칸."}),relBox]})}
var tipState=store("tipState")||{};
function chipRow(box,key,opts,label){box.textContent="";var cur=tipState[key]||"전체";
  ["전체"].concat(opts).forEach(function(o){var b=el("button",{cls:"chip",type:"button","aria-pressed":String(cur===o),text:o==="전체"?label+" 전체":o});b.onclick=function(){tipState[key]=o;store("tipState",tipState);renderXTips()};box.appendChild(b)})}
function fillTips(gridId,list){var g=$("#"+gridId);if(!g)return;g.textContent="";list.sort(function(a,b){return b.rec-a.rec||a.name.localeCompare(b.name,"ko")});
  if(!list.length)g.appendChild(el("div",{cls:"empty",style:"grid-column:1/-1",text:"조건에 맞는 꿀팁이 없어요."}));list.forEach(function(t){g.appendChild(tipCardX(t))})}
function renderXTips(){
  var mv=XTIPS.filter(function(t){return t.topic==="이동"});
  var modes=Array.from(new Set(mv.map(function(t){return t.mode}).filter(usable)));
  var ranges=Array.from(new Set(mv.map(function(t){return t.range}).filter(usable)));
  if($("#tipMoveF")){chipRow($("#tipMoveF"),"mode",modes,"이동수단");chipRow($("#tipMoveF2"),"range",ranges.map(function(r){return r==="학교↔시내"?"시내와 학교":r}),"구간")}
  fillTips("tipMove",mv.filter(function(t){var m=tipState.mode||"전체",r=tipState.range||"전체";var rr=t.range==="학교↔시내"?"시내와 학교":t.range;return (m==="전체"||t.mode===m)&&(r==="전체"||rr===r)}));
  if($("#tipLifeF"))chipRow($("#tipLifeF"),"life",["학교시설","생활비","기타"],"주제");
  fillTips("tipLife",XTIPS.filter(function(t){var k=tipState.life||"전체";return ["학교시설","생활비","기타"].indexOf(t.topic)>=0&&(k==="전체"||t.topic===k)}));
  if($("#tipStudyF"))$("#tipStudyF").textContent="";
  fillTips("tipStudy",XTIPS.filter(function(t){return t.topic==="학사·장학"}));
  var ht=$("#homeTips");if(ht){ht.textContent="";XTIPS.slice().sort(function(a,b){return b.rec-a.rec}).slice(0,3).forEach(function(t){ht.appendChild(tipCardX(t))})}}
renderXTips();
(function(){var b=$("#toFresh");if(b)b.onclick=function(){var h=$$("h1.sub")[0];if(h)h.scrollIntoView({behavior:"smooth",block:"start"})}})();
/* ---------- connect db ---------- */`);

fs.writeFileSync(path.join(__dirname,"knut-tips.html"),s,"utf8");
console.log("ok",s.length,"맛집",M.length,"꿀팁",T.length,"area",JSON.stringify(M.reduce((m,x)=>(m[x.area]=(m[x.area]||0)+1,m),{})));

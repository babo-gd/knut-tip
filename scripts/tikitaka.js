// Readability pass modeled on the reference: blue hero per screen, numbered section titles,
// light-gray page with roomy white cards, mint selection states, no decorative 3D effects, decluttered home.
const fs=require("fs"),path=require("path");const F=path.join(__dirname,"knut-tips.html");
let s=fs.readFileSync(F,"utf8");
function rep(a,b){if(s.split(a).length!==2)throw new Error("not unique ("+(s.split(a).length-1)+"): "+a.slice(0,90));s=s.replace(a,()=>b)}

const CSS=`
/* ===== reference-style readability layer (last in cascade) ===== */
:root{--hero:#3b55e6;--hero2:#2f46d1;--page:#f2f3f7;--card:#ffffff;--t1:#1e2235;--t2:#5f6680;--t3:#8b93a7;--chip:#f1f3f7;--mint:#2fb8a5;--mint-bg:#e3f6f3;--mint-ink:#138a7a;--star:#b4232c}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--hero:#3347c9;--hero2:#2a3cb3;--page:#121626;--card:#1c2236;--t1:#eef1f8;--t2:#b6bdd0;--t3:#8e96ad;--chip:#262d44;--mint:#3cc7b3;--mint-bg:#163a38;--mint-ink:#6fe0cf}}
:root[data-theme="dark"]{--hero:#3347c9;--hero2:#2a3cb3;--page:#121626;--card:#1c2236;--t1:#eef1f8;--t2:#b6bdd0;--t3:#8e96ad;--chip:#262d44;--mint:#3cc7b3;--mint-bg:#163a38;--mint-ink:#6fe0cf}
.app{background:var(--page)}
body{font-size:16px!important;line-height:1.65;color:var(--t1)}
.app main.wrap{padding-inline:18px}
/* calm everything down: no 3D, no sparks, no tilt */
.burst,.spark,.ripple,.pop .sheen,.train,.pulse{display:none!important}
.tile,.deptcard,.tipx,.card,.btn,.chip{transform:none!important}
.card,.tablewrap,.tile,.deptcard,.tipx{background:var(--card)!important;border:0!important;border-radius:22px!important;box-shadow:0 1px 2px rgba(20,30,70,.04),0 6px 20px rgba(20,30,70,.05)!important}
.card{padding:20px!important}
.grid{gap:12px!important;margin-top:14px}
.stack{gap:12px}
/* screen hero */
.scr-hero{position:relative;margin:0 -18px 6px;padding:26px 22px 24px;background:linear-gradient(180deg,var(--hero) 0%,var(--hero2) 100%);color:#fff;border-radius:0 0 30px 30px;overflow:hidden}
.scr-hero::after{content:"";position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;background:rgba(255,255,255,.08)}
.scr-hero .ht{font-size:26px;font-weight:800;line-height:1.3;letter-spacing:-.03em;margin:0;max-width:62%;position:relative;z-index:1}
.scr-hero .hp{display:inline-flex;align-items:center;gap:6px;margin-top:12px;padding:5px 12px;border-radius:999px;background:rgba(255,255,255,.18);font-size:13px;font-weight:600;position:relative;z-index:1}
.scr-hero .hp::before{content:"";width:8px;height:8px;border-radius:50%;background:#ffd166}
.scr-hero .hm{position:absolute;right:14px;top:22px;width:118px;height:118px;z-index:1}
.scr-hero .hm svg{width:100%;height:100%}
.scr-hero .hb{position:relative;z-index:1;margin-top:22px;padding:14px 16px;border-radius:18px;background:rgba(255,255,255,.14);font-size:14.5px;line-height:1.6;color:rgba(255,255,255,.95)}
section.panel>h1:not(.sub){position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
section.panel>.lead:not(.home-lead){display:none}
/* numbered section titles like "1. 질문 *" */
section.panel{counter-reset:q;padding-top:0}
.stop{margin-top:30px!important}
.stop-head{align-items:center!important}
.stop-head h2{font-size:19px!important;font-weight:800!important;color:var(--t1);line-height:1.4}
.stop-head h2::before{counter-increment:q;content:counter(q) ". "!important;width:auto!important;height:auto!important;background:none!important;border-radius:0!important;color:var(--t1)}
.stop-head .meta{display:none}
.stop>.note,.stop>p.note{display:inline-block;margin-top:10px;padding:6px 14px;border:1px solid var(--line);border-radius:999px;font-size:13px;color:var(--t3);line-height:1.5}
h1.sub{margin-top:40px!important;padding-top:0!important;border-top:0!important;font-size:22px!important;font-weight:800!important;color:var(--t1)!important}
.note{color:var(--t3);font-size:14px}
.lead{color:var(--t2)}
/* chips: gray pill -> mint filled when selected */
.chip,.cats button,.filters .chip,.floors button{background:var(--chip)!important;border:0!important;color:var(--t2)!important;border-radius:999px;padding:9px 16px!important;font-size:14px!important;font-weight:600!important;box-shadow:none!important}
.chip[aria-pressed="true"],.cats button[aria-pressed="true"],.floors button[aria-pressed="true"]{background:var(--mint)!important;color:#fff!important;box-shadow:0 4px 12px rgba(47,184,165,.35)!important}
.filters{gap:8px;margin-top:14px}
select{border-radius:999px!important;padding:9px 14px!important;background:var(--chip)!important;border:0!important;color:var(--t2)!important}
/* option rows: gray row with check -> mint row */
.aud-tabs{grid-template-columns:1fr!important;gap:10px!important}
.aud-tabs button{background:var(--chip)!important;border:1.5px solid transparent!important;border-radius:16px!important;padding:15px 16px!important;color:var(--t2)!important}
.aud-tabs button b{font-size:16px!important;font-weight:600!important}
.aud-tabs button::before{border-color:#c9ced9!important;background:var(--card)!important}
.aud-tabs button[aria-pressed="true"]{background:var(--mint-bg)!important;border-color:var(--mint)!important;color:var(--mint-ink)!important}
.aud-tabs button[aria-pressed="true"]::before{border-color:var(--mint)!important;background-color:var(--mint)!important}
.qbar span{background:var(--mint)!important}
.qnum{color:var(--mint-ink)!important}
.aud-links button{background:var(--card)!important;border:1px solid var(--line)!important;border-radius:999px!important;padding:12px 18px!important}
/* buttons */
.btn{border-radius:999px!important;padding:10px 18px!important;font-size:14.5px!important;box-shadow:none!important;background:var(--card)!important;border:1.5px solid var(--line)!important;color:var(--t1)!important}
.btn.primary{background:var(--hero)!important;border-color:var(--hero)!important;color:#fff!important}
.btn.small{padding:7px 14px!important;font-size:13px!important}
/* pills inside cards */
.pill{font-size:12.5px!important;padding:3px 10px!important;border-radius:999px!important;background:var(--chip)!important;border:0!important;color:var(--t2)!important;font-weight:600!important}
.pill.rec{background:var(--hero)!important;color:#fff!important}
.pill.ok{background:var(--mint-bg)!important;color:var(--mint-ink)!important}
.pill.x{background:#fde8ea!important;color:var(--star)!important}
.pill.price{background:#fff4dc!important;color:#8a5a00!important}
/* lists */
.prow{padding:16px 2px!important}
.prow .nm{font-size:16px!important}
.prow .ad{font-size:13.5px!important}
.prow .pic,.quick .ic{background:#eef1ff!important;color:var(--hero)!important;border-radius:16px!important}
.hot-row{padding:14px 0!important}
.hot-row .nm{font-size:15.5px!important}
.hot-row .lb{background:#eef1ff!important;color:var(--hero)!important}
.hot-row .lb.h{background:#fde8ea!important;color:var(--star)!important}
.tipx h3{font-size:16.5px!important;line-height:1.45}
.tipx .loc{font-size:13.5px}
.fields{font-size:15px!important}
.fields dt{color:var(--t3)!important}
/* forms */
input,textarea{border-radius:14px!important;background:var(--chip)!important;border:0!important;padding:12px 14px!important;font-size:15px!important;color:var(--t1)!important}
.searchbar{background:var(--card)!important;padding:6px 16px!important;box-shadow:0 6px 20px rgba(20,30,70,.08)!important}
.searchbar input{background:transparent!important;padding:10px 0!important}
label{font-size:13.5px!important;color:var(--t2)!important}
/* home: keep only what the reference shows */
section.panel[data-tab="home"] #banner,
section.panel[data-tab="home"] .profile,
section.panel[data-tab="home"] #dash,
section.panel[data-tab="home"] .mapcard,
section.panel[data-tab="home"] #forMeStop,
section.panel[data-tab="home"] .hero{display:none!important}
.apphome{gap:16px!important;margin-top:-34px;position:relative;z-index:2}
.quick{padding:16px 10px!important}
.quick button{font-size:13px!important}
.mini .v{font-size:19px!important}
.hot-h b{font-size:18px!important}
/* tables */
table{font-size:14.5px}
th,td{padding:12px 14px}
/* pop-up: plain white sheet */
.pop{background:var(--card)!important;border:0!important;border-radius:26px!important;box-shadow:0 24px 60px rgba(10,20,60,.25)!important}
.pop::before{display:none}
.pop h2{font-size:22px!important}
.tabbar{background:var(--card)!important}
.tabbar button[aria-current="page"]{color:var(--hero)!important}
.tabbar button span{font-size:11.5px}
header.top{background:var(--card)!important}
/* category button (accordion) */
.stop.acc{margin-top:16px!important}
.cat-btn{display:grid;grid-template-columns:auto 1fr auto auto;gap:12px;align-items:center;width:100%;padding:18px;border:0;border-radius:22px;background:var(--card);color:var(--t1);font:inherit;text-align:left;cursor:pointer;box-shadow:0 1px 2px rgba(20,30,70,.04),0 6px 20px rgba(20,30,70,.05)}
.cat-btn[aria-expanded="true"]{background:var(--mint-bg);box-shadow:0 0 0 1.5px var(--mint) inset}
.cb-ic{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;background:#eef1ff;color:var(--hero)}
.cb-ic svg{width:24px;height:24px}
.cat-btn[aria-expanded="true"] .cb-ic{background:var(--mint);color:#fff}
.cb-main{display:flex;flex-direction:column;min-width:0}
.cb-t{font-size:17px;font-weight:800;letter-spacing:-.02em}
.cb-s{font-size:13px;color:var(--t3);margin-top:2px}
.cb-n{font-size:13px;font-weight:700;color:var(--hero);background:#eef1ff;padding:4px 10px;border-radius:999px}
.cat-btn[aria-expanded="true"] .cb-n{background:var(--mint);color:#fff}
.cb-chev{font-size:20px;color:var(--t3);transition:transform .2s}
.cat-btn[aria-expanded="true"] .cb-chev{transform:rotate(180deg);color:var(--mint-ink)}
.acc-body{padding:4px 2px 0}
.acc-body>.note{display:none!important}
.tiplist{display:flex!important;flex-direction:column;gap:0;margin-top:12px;background:var(--card);border-radius:20px;padding:4px 16px;box-shadow:0 1px 2px rgba(20,30,70,.04),0 6px 20px rgba(20,30,70,.05)}
.trow{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;width:100%;padding:14px 0;border:0;border-bottom:1px solid var(--line);background:none;color:var(--t1);font:inherit;text-align:left;cursor:pointer}
.trow:last-of-type{border-bottom:0}
.tr-rec{font-size:12px;font-weight:700;color:var(--hero);background:#eef1ff;padding:3px 8px;border-radius:8px;white-space:nowrap}
.tr-main{display:flex;flex-direction:column;min-width:0}
.tr-nm{font-size:15.5px;font-weight:600;line-height:1.4}
.tr-sub{font-size:13px;color:var(--t3);margin-top:2px}
.tr-go{font-size:22px;color:var(--t3)}
.btn.more{margin:8px auto 12px;display:block}
`;
rep(`@media (prefers-reduced-motion:reduce){*{transition:none!important}}`,CSS+`@media (prefers-reduced-motion:reduce){*{transition:none!important}}`);

/* hero content per screen (counts come from the data, not typed in) */
rep(`/* ---------- connect db ---------- */`,`/* ---------- screen heroes ---------- */
var HERO={
 home:["교통대 생활,\\n노선이랑 찾아봐요","맛집 "+PLACES.length+"곳 · 꿀팁 "+XTIPS.length+"개","학생 21명이 직접 모은 맛집과 생활꿀팁이에요. 아래에서 찾거나, 나에게 맞는 정보부터 골라 보세요.","wink"],
 food:["오늘 뭐 먹지?\\n학생 추천 맛집","추천 많은 순 "+PLACES.length+"곳","가격, 혼밥, 깨끗함, 넓음으로 골라 보고 좋았던 곳은 ★ 픽으로 응원해 주세요.",""],
 move:["학교 오가는 길,\\n이렇게 다녀요","이동 꿀팁 "+XTIPS.filter(function(t){return t.topic==="이동"}).length+"개","통학버스 시간표와 학생들이 알려 준 시내버스·택시 꿀팁이에요.",""],
 life:["학교 안에서\\n이것만 알면 돼요","생활 꿀팁 "+XTIPS.filter(function(t){return ["학교시설","생활비","기타"].indexOf(t.topic)>=0}).length+"개","프린트, 보건실, 은행부터 생활관과 학식, 공강 시간까지 모았어요.","wink"],
 study:["수업도 장학금도\\n놓치지 않게","학사·장학 꿀팁 "+XTIPS.filter(function(t){return t.topic==="학사·장학"}).length+"개","과제 마감, 수강신청, 장학금 기준, 교환학생 정보를 한곳에 모았어요.",""],
 career:["선배들은\\n어디로 갔을까?","취업률 66.5% (2024년 졸업생)","학과별 진로와 졸업생이 남긴 직무, 그리고 4년 진로 로드맵이에요.","wink"]};
(function(){Object.keys(HERO).forEach(function(tab){var p=$('section.panel[data-tab="'+tab+'"]');if(!p)return;var h=HERO[tab];
  var box=el("div",{cls:"scr-hero"});var t=el("p",{cls:"ht"});h[0].split("\\n").forEach(function(line,i){if(i)t.appendChild(el("br"));t.appendChild(document.createTextNode(line))});
  box.appendChild(t);box.appendChild(el("span",{cls:"hp",text:h[1]}));var m=el("div",{cls:"hm"});m.innerHTML=mascot("h"+tab,h[3]);box.appendChild(m);box.appendChild(el("div",{cls:"hb",text:h[2]}));
  p.insertBefore(box,p.firstChild)});
  /* home order like the reference: hero, search, survey, quick menu, HOT */
  var home=$('section.panel[data-tab="home"]'),ah=$(".apphome",home),aud=$("#audBox");if(ah&&aud){ah.insertBefore(aud,$("#homeCats"))}})();

/* ---------- student-tip sections: a category button that opens a compact list ---------- */
var PAGE=8,shownN={};
fillTips=function(gridId,list){var g=$("#"+gridId);if(!g)return;g.textContent="";g.className="tiplist";
  list.sort(function(a,b){return b.rec-a.rec||a.name.localeCompare(b.name,"ko")});
  var cnt=$("#cnt-"+gridId);if(cnt)cnt.textContent=list.length+"개";
  if(!list.length){g.appendChild(el("div",{cls:"empty",text:"조건에 맞는 꿀팁이 없어요."}));return}
  var n=shownN[gridId]||PAGE;
  list.slice(0,n).forEach(function(t){var sub=[];if(usable(t.mode))sub.push(t.mode);if(usable(t.range))sub.push(t.range==="학교↔시내"?"시내와 학교":t.range);if(usable(t.prep))sub.push("준비물 "+t.prep);if(!sub.length&&usable(t.loc))sub.push(t.loc);
    var r=el("button",{cls:"trow",type:"button"},[el("span",{cls:"tr-rec",text:"추천 "+t.rec}),el("span",{cls:"tr-main"},[el("span",{cls:"tr-nm",text:t.name}),sub.length?el("span",{cls:"tr-sub",text:sub.join(" · ")}):null]),el("span",{cls:"tr-go",text:"›"})]);
    r.onclick=function(){tipPop(r,t)};g.appendChild(r)});
  if(list.length>n){var more=el("button",{cls:"btn more",type:"button",text:"더 보기 ("+(list.length-n)+"개 더)"});more.onclick=function(){shownN[gridId]=n+PAGE;renderXTips()};g.appendChild(more)}};
(function(){[["tipMove","이동수단·구간으로 골라 볼 수 있어요"],["tipLife","학교시설·생활비·기타로 나눠 볼 수 있어요"],["tipStudy","장학금, 수강신청, 교환학생 꿀팁이에요"]].forEach(function(x){
  var grid=$("#"+x[0]);if(!grid)return;var stop=grid.closest(".stop");var head=$(".stop-head",stop);var title=$("h2",head).textContent.trim();
  var body=el("div",{cls:"acc-body",id:"acc-"+x[0],hidden:""});while(head.nextSibling)body.appendChild(head.nextSibling);
  var btn=el("button",{cls:"cat-btn",type:"button","aria-expanded":"false","aria-controls":"acc-"+x[0]},[el("span",{cls:"cb-ic"}),el("span",{cls:"cb-main"},[el("span",{cls:"cb-t",text:title}),el("span",{cls:"cb-s",text:x[1]})]),el("span",{cls:"cb-n",id:"cnt-"+x[0]}),el("span",{cls:"cb-chev",text:"⌄"})]);
  btn.querySelector(".cb-ic").innerHTML=svgI(x[0]==="tipMove"?"bus":x[0]==="tipStudy"?"study":"life");
  btn.onclick=function(){var open=body.hidden;body.hidden=!open;btn.setAttribute("aria-expanded",String(open))};
  head.replaceWith(btn);stop.appendChild(body);stop.classList.add("acc")});
  shownN={};renderXTips()})();
/* ---------- connect db ---------- */`);
fs.writeFileSync(F,s,"utf8");console.log("ok");

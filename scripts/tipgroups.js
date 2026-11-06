// 1) Student tip lists (이동 / 학교생활 / 학사·장학): instead of one long row per tip, similar tips are grouped into
//    theme cards; each card shows its top 4 tips as chips and a "+N개 더" chip; a chip opens the tip.
// 2) Remaining plain bullet lists inside cards (동아리) become icon cards with numbered rows.
// Usage: node tipgroups.js <page.html> [<page.html> ...]
const fs=require("fs");
const CSS=`
/* ===== grouped tip cards ===== */
#tipMoveF,#tipMoveF2,#tipLifeF{display:none!important}
.backbar button{white-space:nowrap;flex:none}
.tg-list{display:flex!important;flex-direction:column;gap:12px;margin-top:12px}
.tg-card{padding:16px;border-radius:20px;background:var(--card);box-shadow:var(--sh1)}
.tg-head{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.tg-ic{flex:none;width:44px;height:44px;border-radius:14px;display:grid;place-items:center;color:var(--gc);background:color-mix(in srgb,var(--gc) 13%,var(--card))}
.tg-ic svg{width:22px;height:22px}
.tg-head b{flex:1;min-width:0;font-size:17px;font-weight:800;letter-spacing:-.015em;color:var(--t1)}
.tg-head small{flex:none;font-size:12.5px;font-weight:700;color:var(--t3)}
.tg-chips{display:flex;flex-wrap:wrap;gap:8px}
.tg-chip{display:inline-flex;align-items:center;gap:6px;max-width:100%;padding:9px 12px;border:0;border-radius:13px;background:var(--fill);font:inherit;font-size:14.5px;font-weight:600;line-height:1.35;color:var(--t1);text-align:left;cursor:pointer;transition:background-color .15s}
.tg-chip:active{background:var(--fill2)}
.tg-chip i{flex:none;font-style:normal;font-size:11.5px;font-weight:800;color:#fff;background:var(--gc);padding:2px 7px;border-radius:999px}
.tg-more{color:color-mix(in srgb,var(--gc) 80%,#000);background:color-mix(in srgb,var(--gc) 12%,var(--card));font-weight:800}
/* ===== list cards (plain bullet lists inside cards) ===== */
.lc-card{padding:16px!important}
.lc-head{display:flex;align-items:center;gap:12px;margin-bottom:6px}
.lc-head b{font-size:17px;font-weight:800;letter-spacing:-.015em;color:var(--t1)}
.lc-row{display:flex;align-items:flex-start;gap:12px;padding:11px 0;font-size:15px;font-weight:600;line-height:1.5;color:var(--t1)}
.lc-row+.lc-row{border-top:1px solid var(--fill2)}
.lc-no{flex:none;width:24px;height:24px;margin-top:1px;border-radius:50%;display:grid;place-items:center;font-size:12.5px;font-weight:800;color:#fff;background:var(--gc)}
`;
const JS=`
/* ---------- grouped tip cards + list cards ---------- */
(function(){var S=' fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"';function svg(d){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+d+'</svg>'}
  var I={bus:'<rect x="5" y="3" width="14" height="14" rx="3"'+S+'/><path d="M5 11h14M8 17v3M16 17v3"'+S+'/>',
    walk:'<circle cx="13" cy="4.5" r="1.8"'+S+'/><path d="M10 21l2-6 3 3v3M9 12l2-4 3 1 2 3M11 8l-2 1-1 3"'+S+'/>',
    taxi:'<path d="M5 16V11l2-5h10l2 5v5M3 16h18M7 16v2M17 16v2M9 6V4h6v2"'+S+'/>',
    road:'<path d="M8 3L5 21M16 3l3 18M12 4v3M12 10v3M12 16v3"'+S+'/>',
    print:'<path d="M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M7 14h10v7H7z"'+S+'/>',
    cup:'<path d="M5 8h12v6a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5zM17 10h2a2 2 0 0 1 0 4h-2M8 3v2M12 3v2"'+S+'/>',
    book:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20"'+S+'/>',
    bank:'<path d="M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 21h18"'+S+'/>',
    heart:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"'+S+'/>',
    home:'<path d="M4 20V9l8-5 8 5v11M9 20v-5h6v5M3 20h18"'+S+'/>',
    team:'<circle cx="9" cy="9" r="3"'+S+'/><circle cx="17" cy="10" r="2.4"'+S+'/><path d="M3.5 19c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5M15 15.2c2.6-.4 4.6.9 5.2 3.8"'+S+'/>',
    store:'<path d="M4 9l1.5-5h13L20 9M4 9h16v11H4zM4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0M10 20v-5h4v5"'+S+'/>',
    won:'<circle cx="12" cy="12" r="8.5"'+S+'/><path d="M7.5 9l2 6 2.5-4.5 2.5 4.5 2-6M6.5 12h11"'+S+'/>',
    cal:'<rect x="4" y="5" width="16" height="15" rx="3"'+S+'/><path d="M4 10h16M9 3v4M15 3v4"'+S+'/>',
    globe:'<circle cx="12" cy="12" r="8.5"'+S+'/><path d="M3.5 12h17M12 3.5c2.5 2.6 2.5 14.4 0 17M12 3.5c-2.5 2.6-2.5 14.4 0 17"'+S+'/>',
    check:'<rect x="5" y="4" width="14" height="17" rx="2.5"'+S+'/><path d="M9 4V3h6v1M8.5 12.5l2.2 2.2 4.8-4.8"'+S+'/>',
    chat:'<path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4 4v-4H6a2 2 0 0 1-2-2z"'+S+'/><path d="M8 9h8M8 12h5"'+S+'/>',
    star:'<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z"'+S+'/>'};
  var GROUPS={
    tipMove:{color:"#7a55e8",of:function(t){return t.mode==="시내버스"||t.mode==="콜버스"?"시내버스":t.mode==="통학버스"?"통학버스":t.mode==="시외·고속버스"?"시외·고속버스":t.mode==="도보"?"교내 지름길":"택시·기타"},
      order:[["시내버스","bus"],["통학버스","bus"],["시외·고속버스","road"],["교내 지름길","walk"],["택시·기타","taxi"]]},
    tipLife:{color:"#21b19d",of:function(t){var n=t.name;var R=[["프린트·복사",/프린|복사|인쇄|3D/],["학식·카페·간식",/학식|커피|카페|간식|아침밥|점심|또래오래/],["도서관·공부",/도서관|논문|시험기간|강의실|전공책|교재|생성형/],["은행·행정·우편",/우체국|은행|ATM|증명서|계좌|외국인|학생증|와이파이|편의시설/],["건강·쉼",/보건|심리|헬스|둘레길|소극장|병원|고양이/],["생활관",/생활관/],["동아리",/동아리|사랑방/]];for(var i=0;i<R.length;i++)if(R[i][1].test(n))return R[i][0];return "대학가 생활"},
      order:[["프린트·복사","print"],["학식·카페·간식","cup"],["도서관·공부","book"],["은행·행정·우편","bank"],["건강·쉼","heart"],["생활관","home"],["동아리","team"],["대학가 생활","store"]]},
    tipStudy:{color:"#e8960c",of:function(t){return /장학/.test(t.name)?"장학금":/수강/.test(t.name)?"수강신청":"학사·교환"},order:[["장학금","won"],["수강신청","cal"],["학사·교환","globe"]]}};
  function groupCards(id,list){var g=$("#"+id),cfg=GROUPS[id];if(!g||!cfg)return;g.textContent="";g.className="tg-list";g.style.setProperty("--gc",cfg.color);
    var by={};list.forEach(function(t){var k=cfg.of(t);(by[k]=by[k]||[]).push(t)});
    cfg.order.forEach(function(o){var items=by[o[0]];if(!items||!items.length)return;items.sort(function(a,b){return b.rec-a.rec||a.name.localeCompare(b.name,"ko")});
      var ic=el("span",{cls:"tg-ic"});ic.innerHTML=svg(I[o[1]]);var card=el("div",{cls:"tg-card"},[el("div",{cls:"tg-head"},[ic,el("b",{text:o[0]}),el("small",{text:items.length+"개"})])]);
      var chips=el("div",{cls:"tg-chips"});card.appendChild(chips);
      function draw(all){chips.textContent="";(all?items:items.slice(0,4)).forEach(function(t){var c=el("button",{cls:"tg-chip",type:"button"},[el("span",{text:t.name})]);if(t.rec>=2)c.appendChild(el("i",{text:"추천 "+t.rec}));c.onclick=function(){tipPop(c,t)};chips.appendChild(c)});
        if(!all&&items.length>4){var m=el("button",{cls:"tg-chip tg-more",type:"button",text:"+"+(items.length-4)+"개 더"});m.onclick=function(){draw(true)};chips.appendChild(m)}}
      draw(false);g.appendChild(card)})}
  renderXTips=function(){groupCards("tipMove",XTIPS.filter(function(t){return t.topic==="이동"}));
    groupCards("tipLife",XTIPS.filter(function(t){return ["학교시설","생활비","기타"].indexOf(t.topic)>=0}));
    groupCards("tipStudy",XTIPS.filter(function(t){return t.topic==="학사·장학"}));
    var ht=$("#homeTips");if(ht){ht.textContent="";XTIPS.slice().sort(function(a,b){return b.rec-a.rec}).slice(0,3).forEach(function(t){ht.appendChild(tipCardX(t))})}};
  renderXTips();
  /* plain bullet lists inside cards -> icon cards with numbered rows */
  $$(".card > ul.clean").forEach(function(ul){var card=ul.parentNode,h=$("h3",card);if(!h||card.children.length!==2)return;var name=h.textContent.trim();
    var p=card.closest("section.panel"),tab=p?p.dataset.tab:"home",col=(typeof LINE_C!=="undefined"&&LINE_C[tab])||"#3d5cf5";
    var key=/질문/.test(name)?"chat":/기준/.test(name)?"check":"star";var ic=el("span",{cls:"tg-ic"});ic.innerHTML=svg(I[key]);
    var rows=el("div");$$("li",ul).forEach(function(li,i){rows.appendChild(el("div",{cls:"lc-row"},[el("span",{cls:"lc-no",text:String(i+1)}),el("span",{text:li.textContent.trim()})]))});
    card.textContent="";card.classList.add("lc-card");card.style.setProperty("--gc",col);card.appendChild(el("div",{cls:"lc-head"},[ic,el("b",{text:name})]));card.appendChild(rows);
    var grid=card.parentNode;if(grid&&grid.classList.contains("grid")){grid.style.display="flex";grid.style.flexDirection="column";grid.style.gap="12px"}})})();
if(typeof PRESS_SMALL==="string")PRESS_SMALL+=",.tg-chip";
`;
for(const F of process.argv.slice(2)){let s=fs.readFileSync(F,"utf8");
  const rep=(a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(F+": expected 1 match, found "+n+": "+a.slice(0,60));s=s.replace(a,()=>b)};
  if(s.includes("/* ===== grouped tip cards"))throw new Error(F+": already applied");
  rep(`이동수단과 구간으로 골라 볼 수 있어요.`,`비슷한 것끼리 묶었어요.`);
  const M="@media (prefers-reduced-motion:reduce){*{transition:none!important}}";rep(M,CSS+"\n"+M);
  rep("/* ---------- connect db ---------- */",JS+"/* ---------- connect db ---------- */");
  fs.writeFileSync(F,s,"utf8");console.log("ok",F.slice(-30))}

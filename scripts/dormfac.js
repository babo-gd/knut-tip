// 생활관 뽕 뽑기: 시설 이용 table -> one card per facility: icon + name, 위치 row, 이용 시간 row with time pills
// (식당 split into 평일/공휴일 lines and 조·중·석 pills), and the tip in a mint box. "-" cells are hidden.
// Usage: node dormfac.js <page.html> [<page.html> ...]
const fs=require("fs");
const CSS=`
/* ===== 생활관 시설 cards ===== */
.fc-list{display:flex;flex-direction:column;gap:12px;margin-top:12px;--fc:#21b19d}
.fc-card{padding:16px;border-radius:20px;background:var(--card);box-shadow:var(--sh1)}
.fc-head{display:flex;align-items:center;gap:12px;margin-bottom:6px}
.fc-ic{flex:none;width:44px;height:44px;border-radius:14px;display:grid;place-items:center;color:var(--fc);background:color-mix(in srgb,var(--fc) 13%,var(--card))}
.fc-ic svg{width:22px;height:22px}
.fc-head b{font-size:17px;font-weight:800;letter-spacing:-.015em;color:var(--t1)}
.fc-row{display:flex;align-items:flex-start;gap:10px;padding:9px 0}
.fc-row+.fc-row{border-top:1px solid var(--fill2)}
.fc-ri{flex:none;width:20px;height:20px;margin-top:1px;color:var(--t3)}
.fc-ri svg{width:20px;height:20px}
.fc-rv{flex:1;min-width:0;font-size:15px;font-weight:600;line-height:1.5;color:var(--t1)}
.fc-line{display:flex;flex-wrap:wrap;align-items:center;gap:6px}
.fc-line+.fc-line{margin-top:6px}
.fc-lab{font-size:12.5px;font-weight:800;color:var(--t3);margin-right:2px}
.fc-pill{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:9px;font-size:13.5px;font-weight:800;font-variant-numeric:tabular-nums;color:color-mix(in srgb,var(--fc) 82%,#000);background:color-mix(in srgb,var(--fc) 12%,var(--card))}
.fc-pill i{font-style:normal;font-weight:700;opacity:.75}
.fc-extra{font-size:12.5px;color:var(--t3);font-weight:600}
.fc-tip{display:flex;align-items:flex-start;gap:8px;margin-top:8px;padding:10px 12px;border-radius:14px;background:color-mix(in srgb,var(--fc) 10%,var(--card));font-size:14px;font-weight:600;line-height:1.5;color:color-mix(in srgb,var(--fc) 70%,var(--t1))}
.fc-tip svg{flex:none;width:18px;height:18px;margin-top:1px}
`;
const JS=`
/* ---------- 생활관 시설 cards ---------- */
(function(){var st=$$(".stop").filter(function(s){var h=$(".stop-head h2",s);return h&&h.textContent.trim().indexOf("생활관 뽕 뽑기")===0})[0];if(!st)return;var tw=$(".tablewrap",st),tb=tw&&$("tbody",tw);if(!tb)return;
  var P='<svg viewBox="0 0 24 24" aria-hidden="true">',E='</svg>',S=' fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"';
  var ICON={"식당":'<path d="M7 3v7a2 2 0 0 0 4 0V3M9 3v18M16 3c-2 2-2 6 0 8v10"'+S+'/>',
    "체력단련실":'<path d="M3 10v4M6 8v8M18 8v8M21 10v4M6 12h12"'+S+'/>',
    "독서실":'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20"'+S+'/>',
    "탁구실":'<circle cx="10" cy="10" r="6"'+S+'/><path d="M14.5 14.5L20 20"'+S+'/><circle cx="18.5" cy="6" r="1.6" fill="currentColor"/>',
    "휴게실":'<path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3zM6 18v2M18 18v2"'+S+'/>',
    "세탁실":'<rect x="4" y="3" width="16" height="18" rx="2.5"'+S+'/><circle cx="12" cy="13" r="4.5"'+S+'/><path d="M8 6.5h1M11 6.5h1"'+S+'/>',
    "택배·우편":'<path d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5zM3 7.5l9 4.5 9-4.5M12 12v9"'+S+'/>'};
  var PIN='<path d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11z"'+S+'/><circle cx="12" cy="10" r="2.3"'+S+'/>',CLK='<circle cx="12" cy="12" r="8.5"'+S+'/><path d="M12 7.5V12l3 2"'+S+'/>',
    BULB='<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"'+S+'/>';
  var MEAL={"조":"조식","중":"중식","석":"석식"};
  function timeNode(td){var lines=td.innerHTML.split(/<br\\s*\\/?>/i).map(function(h){var d=document.createElement("div");d.innerHTML=h;return d.textContent.trim()}).filter(Boolean);
    var box=el("div");lines.forEach(function(line){var row=el("div",{cls:"fc-line"});var m=line.match(/^([가-힣]+)\\s+(.*)$/),rest=line;
      if(m&&!/^\\d/.test(line)&&!MEAL[m[1]]){row.appendChild(el("span",{cls:"fc-lab",text:m[1]}));rest=m[2]}
      var ex=rest.match(/\\s*(\\([^)]*\\))\\s*$/);if(ex)rest=rest.slice(0,ex.index);
      rest.split(/\\s*·\\s*/).forEach(function(part){var mm=part.match(/^([조중석])\\s+(.+)$/);var p=el("span",{cls:"fc-pill"});if(mm){p.appendChild(el("i",{text:MEAL[mm[1]]}));p.appendChild(document.createTextNode(mm[2]))}else p.textContent=part;row.appendChild(p)});
      if(ex)row.appendChild(el("span",{cls:"fc-extra",text:ex[1]}));box.appendChild(row)});return box}
  var list=el("div",{cls:"fc-list"});
  $$("tr",tb).forEach(function(tr){var td=$$("td",tr);if(td.length<4)return;var name=td[0].textContent.trim(),loc=td[1].textContent.trim(),time=td[2].textContent.trim(),tip=td[3].textContent.trim();
    var ic=el("span",{cls:"fc-ic"});ic.innerHTML=P+(ICON[name]||ICON["휴게실"])+E;var card=el("div",{cls:"fc-card"},[el("div",{cls:"fc-head"},[ic,el("b",{text:name})])]);
    function row(svg,node){var i=el("span",{cls:"fc-ri"});i.innerHTML=P+svg+E;var v=el("div",{cls:"fc-rv"});v.appendChild(node);return el("div",{cls:"fc-row"},[i,v])}
    if(loc&&loc!=="-")card.appendChild(row(PIN,document.createTextNode(loc)));
    if(time&&time!=="-")card.appendChild(row(CLK,timeNode(td[2])));
    if(tip&&tip!=="-"){var t=el("div",{cls:"fc-tip"});t.innerHTML=P+BULB+E;t.appendChild(el("span",{text:tip}));card.appendChild(t)}
    list.appendChild(card)});
  tw.replaceWith(list)})();
`;
for(const F of process.argv.slice(2)){let s=fs.readFileSync(F,"utf8");
  const rep=(a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(F+": expected 1 match, found "+n+": "+a.slice(0,60));s=s.replace(a,()=>b)};
  if(s.includes("/* ===== 생활관 시설 cards"))throw new Error(F+": already applied");
  const M="@media (prefers-reduced-motion:reduce){*{transition:none!important}}";rep(M,CSS+"\n"+M);
  rep("/* ---------- connect db ---------- */",JS+"/* ---------- connect db ---------- */");
  fs.writeFileSync(F,s,"utf8");console.log("ok",F.slice(-30))}

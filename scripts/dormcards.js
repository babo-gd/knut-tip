// 충주생활관 핵심 수칙: the four plain cards become icon cards (시간 blue/clock, 외박 violet/moon, 벌점 coral/alert,
// 생활관 구분 mint/building); "label + time" rows become a timetable, times become pills, 벌점 numbers red pills.
// Usage: node dormcards.js <page.html> [<page.html> ...]
const fs=require("fs");
const CSS=`
/* ===== 생활관 수칙 cards ===== */
.dr-grid{display:flex!important;flex-direction:column;gap:12px}
.dr-card{padding:16px 16px 6px!important;--dc:#3d5cf5}
.dr-head{display:flex;align-items:center;gap:12px;margin-bottom:4px}
.dr-ic{flex:none;width:44px;height:44px;border-radius:14px;display:grid;place-items:center;color:var(--dc);background:color-mix(in srgb,var(--dc) 13%,var(--card))}
.dr-ic svg{width:22px;height:22px}
.dr-head b{font-size:17px;font-weight:800;letter-spacing:-.015em;color:var(--t1)}
.dr-row{display:flex;align-items:flex-start;gap:10px;padding:12px 2px;font-size:15px;font-weight:600;line-height:1.5;color:var(--t1)}
.dr-row+.dr-row{border-top:1px solid var(--fill2)}
.dr-row::before{content:"";flex:none;width:7px;height:7px;margin-top:8px;border-radius:50%;background:var(--dc);opacity:.75}
.dr-tx{flex:1;min-width:0}
.dr-row .time{display:inline-block;padding:1px 8px;border-radius:8px;font-weight:800;font-variant-numeric:tabular-nums;color:var(--dc);background:color-mix(in srgb,var(--dc) 12%,var(--card))}
.dr-row.tt .dr-tx{display:flex;align-items:center;justify-content:space-between;gap:10px}
.dr-row.tt .dr-r{flex:none;text-align:right;font-size:13px;color:var(--t3);font-weight:600}
.dr-row.tt .dr-r .time{font-size:15px;padding:4px 10px}
.dr-row b{display:inline-block;padding:1px 8px;margin:0 1px;border-radius:999px;color:#fff;background:var(--coral);font-weight:800}
`;
const JS=`
/* ---------- 생활관 수칙 cards ---------- */
(function(){var st=$$(".stop").filter(function(s){var h=$(".stop-head h2",s);return h&&h.textContent.trim()==="충주생활관 핵심 수칙"})[0];if(!st)return;var grid=$(".grid",st);if(!grid)return;
  var CFG={"시간":["#3d5cf5",'<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>'],
    "외박":["#7a55e8",'<path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>'],
    "벌점":["#ff6b5e",'<path d="M12 4l9 16H3z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M12 10v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="17" r="1.1" fill="currentColor"/>'],
    "생활관 구분":["#21b19d",'<path d="M4 20V9l8-5 8 5v11" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M9 20v-5h6v5M3 20h18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>']};
  grid.classList.add("dr-grid");
  $$(":scope > .card",grid).forEach(function(card){var h=$("h3",card),ul=$("ul",card);if(!h||!ul)return;var name=h.textContent.trim(),cfg=CFG[name]||["#3d5cf5",CFG["시간"][1]];
    card.classList.add("dr-card");card.style.setProperty("--dc",cfg[0]);
    var ic=el("span",{cls:"dr-ic"});ic.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+cfg[1]+'</svg>';
    var head=el("div",{cls:"dr-head"},[ic,el("b",{text:name})]);var rows=el("div",{cls:"dr-rows"});
    [].slice.call(ul.children).forEach(function(li){var row=el("div",{cls:"dr-row"}),tx=el("div",{cls:"dr-tx"});
      var first=li.firstChild,t=first&&first.nextSibling;
      if(name==="시간"&&first&&first.nodeType===3&&t&&t.nodeType===1&&t.classList.contains("time")){row.classList.add("tt");
        var lab=el("span",{text:first.textContent.trim()}),r=el("span",{cls:"dr-r"});[].slice.call(li.childNodes).slice(1).forEach(function(n){r.appendChild(n)});tx.appendChild(lab);tx.appendChild(r)}
      else [].slice.call(li.childNodes).forEach(function(n){tx.appendChild(n)});
      row.appendChild(tx);rows.appendChild(row)});
    card.textContent="";card.appendChild(head);card.appendChild(rows)})})();
`;
for(const F of process.argv.slice(2)){let s=fs.readFileSync(F,"utf8");
  const rep=(a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(F+": expected 1 match, found "+n+": "+a.slice(0,60));s=s.replace(a,()=>b)};
  if(s.includes("/* ===== 생활관 수칙 cards"))throw new Error(F+": already applied");
  const M="@media (prefers-reduced-motion:reduce){*{transition:none!important}}";rep(M,CSS+"\n"+M);
  rep("/* ---------- connect db ---------- */",JS+"/* ---------- connect db ---------- */");
  fs.writeFileSync(F,s,"utf8");console.log("ok",F.slice(-30))}

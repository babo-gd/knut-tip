// Bullet lists whose items start with a bold "제목:" (e.g. 성인이 된 뒤의 사회생활법) become guide cards:
// mint icon tile picked by keyword, bold title, explanation underneath.
// Usage: node guidecards.js <page.html> [<page.html> ...]
const fs=require("fs");
const CSS=`
/* ===== guide cards (bold-titled bullet lists) ===== */
.gd-list{display:flex;flex-direction:column;gap:10px;margin-top:12px;--gc:#21b19d}
.gd-card{display:flex;align-items:flex-start;gap:14px;padding:16px;border-radius:20px;background:var(--card);box-shadow:var(--sh1)}
.gd-ic{flex:none;width:44px;height:44px;border-radius:14px;display:grid;place-items:center;color:var(--gc);background:color-mix(in srgb,var(--gc) 13%,var(--card))}
.gd-ic svg{width:22px;height:22px}
.gd-tx{min-width:0;display:flex;flex-direction:column;gap:4px;padding-top:1px}
.gd-tx b{font-size:16.5px;font-weight:800;letter-spacing:-.015em;color:var(--t1)}
.gd-tx p{margin:0;font-size:14.5px;line-height:1.6;color:var(--t2);word-break:keep-all}
`;
const JS=`
/* ---------- guide cards for bold-titled bullet lists ---------- */
(function(){var I={mail:'<rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>',
    team:'<circle cx="9" cy="9" r="3" fill="none" stroke="currentColor" stroke-width="1.9"/><circle cx="17" cy="10" r="2.4" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M3.5 19c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5M15 15.2c2.6-.4 4.6.9 5.2 3.8" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
    chat:'<path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4 4v-4H6a2 2 0 0 1-2-2z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M8 9h8M8 12h5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
    wallet:'<path d="M4 7a2 2 0 0 1 2-2h11v4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><rect x="4" y="7" width="16" height="12" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.9"/><circle cx="16" cy="13" r="1.4" fill="currentColor"/>',
    star:'<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>'};
  var KEY=[["메일","mail"],["메시지","mail"],["팀플","team"],["선후배","chat"],["관계","chat"],["돈","wallet"],["관리","wallet"]];
  function pick(t){for(var i=0;i<KEY.length;i++)if(t.indexOf(KEY[i][0])>=0)return KEY[i][1];return "star"}
  $$("ul.clean").forEach(function(ul){var lis=[].slice.call(ul.children);if(!lis.length||!lis.every(function(li){var b=li.firstElementChild;return b&&b.tagName==="B"&&/:\\s*$/.test(b.textContent)&&li.firstChild===b}))return;
    var box=el("div",{cls:"gd-list"});lis.forEach(function(li){var b=li.firstElementChild,title=b.textContent.replace(/:\\s*$/,"").trim();b.remove();var ic=el("span",{cls:"gd-ic"});ic.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+I[pick(title)]+'</svg>';
      box.appendChild(el("div",{cls:"gd-card"},[ic,el("div",{cls:"gd-tx"},[el("b",{text:title}),el("p",{text:li.textContent.trim()})])]))});ul.replaceWith(box)})})();
`;
for(const F of process.argv.slice(2)){let s=fs.readFileSync(F,"utf8");
  const rep=(a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(F+": expected 1 match, found "+n+": "+a.slice(0,60));s=s.replace(a,()=>b)};
  if(s.includes("/* ===== guide cards"))throw new Error(F+": already applied");
  const M="@media (prefers-reduced-motion:reduce){*{transition:none!important}}";rep(M,CSS+"\n"+M);
  rep("/* ---------- connect db ---------- */",JS+"/* ---------- connect db ---------- */");
  fs.writeFileSync(F,s,"utf8");console.log("ok",F.slice(-30))}

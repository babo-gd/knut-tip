// 자취 가이드 -> icon cards in the 학교생활 mint: 방 구하기 (직방·다방 buttons), 계약 전 체크 (numbered steps),
// 근처 장보기·생활 (map button). Same text and links as before.
// Usage: node roomcards.js <page.html> [<page.html> ...]
const fs=require("fs");
const CSS=`
/* ===== 자취 가이드 cards ===== */
.ja-list{display:flex!important;flex-direction:column;gap:12px;--jc:#21b19d}
.ja-card{padding:16px!important}
.ja-head{display:flex;align-items:center;gap:12px;margin-bottom:8px}
.ja-ic{flex:none;width:44px;height:44px;border-radius:14px;display:grid;place-items:center;color:var(--jc);background:color-mix(in srgb,var(--jc) 13%,var(--card))}
.ja-ic svg{width:22px;height:22px}
.ja-head b{font-size:17px;font-weight:800;letter-spacing:-.015em;color:var(--t1)}
.ja-desc{margin:0;font-size:14.5px;line-height:1.6;color:var(--t2)}
.ja-btns{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:8px;margin-top:12px}
.ja-btn{display:flex;align-items:center;justify-content:center;gap:8px;min-height:48px;border-radius:15px;font-size:15px;font-weight:800;text-decoration:none!important;color:color-mix(in srgb,var(--jc) 80%,#000)!important;background:color-mix(in srgb,var(--jc) 12%,var(--card))}
.ja-btn svg{width:18px;height:18px}
.ja-btn.main{color:#fff!important;background:var(--jc)}
.ja-steps{display:flex;flex-direction:column;margin-top:2px}
.ja-step{display:flex;align-items:flex-start;gap:12px;padding:11px 0;font-size:15px;font-weight:600;line-height:1.5;color:var(--t1)}
.ja-step+.ja-step{border-top:1px solid var(--fill2)}
.ja-no{flex:none;width:24px;height:24px;margin-top:1px;border-radius:50%;display:grid;place-items:center;font-size:12.5px;font-weight:800;color:#fff;background:var(--jc)}
`;
const JS=`
/* ---------- 자취 가이드 cards ---------- */
(function(){var st=$$(".stop").filter(function(s){var h=$(".stop-head h2",s);return h&&h.textContent.trim()==="자취 가이드"})[0];if(!st)return;var grid=$(".grid",st);if(!grid)return;
  var S=' fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"';function svg(d){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+d+'</svg>'}
  var IC={room:'<path d="M4 11l8-7 8 7v9H4z"'+S+'/><circle cx="12" cy="13.5" r="2.5"'+S+'/><path d="M13.8 15.3L16 17.5"'+S+'/>',
    check:'<rect x="5" y="4" width="14" height="17" rx="2.5"'+S+'/><path d="M9 4V3h6v1M8.5 12.5l2.2 2.2 4.8-4.8"'+S+'/>',
    cart:'<path d="M3 4h2.5l2.2 11h10.6l2-8H6.6"'+S+'/><circle cx="9.5" cy="19" r="1.5" fill="currentColor"/><circle cx="17" cy="19" r="1.5" fill="currentColor"/>',
    out:'<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"'+S+'/>',
    map:'<path d="M9 4l6 2 5-2v14l-5 2-6-2-5 2V6z M9 4v14M15 6v14"'+S+'/>'};
  grid.classList.add("ja-list");
  $$(":scope > .card",grid).forEach(function(card){var h=$("h3",card);if(!h)return;var name=h.textContent.trim();
    var note=$("p.note",card),links=$$("a",card),ul=$("ul",card);
    var kind=ul?"check":/방 구하기/.test(name)?"room":"cart";
    var ic=el("span",{cls:"ja-ic"});ic.innerHTML=svg(IC[kind]);var out=[el("div",{cls:"ja-head"},[ic,el("b",{text:name})])];
    if(note)out.push(el("p",{cls:"ja-desc",text:note.textContent.trim()}));
    if(ul){var steps=el("div",{cls:"ja-steps"});$$("li",ul).forEach(function(li,i){steps.appendChild(el("div",{cls:"ja-step"},[el("span",{cls:"ja-no",text:String(i+1)}),el("span",{text:li.textContent.trim()})]))});out.push(steps)}
    if(links.length){var bx=el("div",{cls:"ja-btns"});links.forEach(function(a,i){var label=a.textContent.trim();if(kind==="cart")label=label+" 열기";
      var b=el("a",{cls:"ja-btn"+(kind==="cart"?" main":""),href:a.href,target:"_blank",rel:"noopener"},[el("span",{text:label})]);b.insertAdjacentHTML("afterbegin",svg(kind==="cart"?IC.map:IC.out));bx.appendChild(b)});out.push(bx)}
    card.textContent="";card.classList.add("ja-card");out.forEach(function(n){card.appendChild(n)})})})();
if(typeof PRESS_BIG==="string")PRESS_BIG+=",.ja-btn";
`;
for(const F of process.argv.slice(2)){let s=fs.readFileSync(F,"utf8");
  const rep=(a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(F+": expected 1 match, found "+n+": "+a.slice(0,60));s=s.replace(a,()=>b)};
  if(s.includes("/* ===== 자취 가이드 cards"))throw new Error(F+": already applied");
  const M="@media (prefers-reduced-motion:reduce){*{transition:none!important}}";rep(M,CSS+"\n"+M);
  rep("/* ---------- connect db ---------- */",JS+"/* ---------- connect db ---------- */");
  fs.writeFileSync(F,s,"utf8");console.log("ok",F.slice(-30))}

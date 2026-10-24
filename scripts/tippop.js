// Tip detail sheet in the app style, coloured by topic: chips (추천·주제·이동수단·구간), an info card with icon rows
// (위치·준비물·확인한 날), a 네이버지도 button, and related tips as tappable rows that open that tip.
// Usage: node tippop.js <page.html> [<page.html> ...]
const fs=require("fs");
const CSS=`
/* ===== tip detail sheet ===== */
.tp{--tc:#21b19d}
.tp-chips{display:flex;flex-wrap:wrap;gap:6px;margin:2px 0 14px}
.tp-rec{font-size:13px;font-weight:800;color:#fff;background:var(--tc);padding:4px 11px;border-radius:999px}
.tp-chip{font-size:13px;font-weight:700;color:color-mix(in srgb,var(--tc) 78%,#000);background:color-mix(in srgb,var(--tc) 13%,var(--card));padding:4px 11px;border-radius:999px}
.tp-info{background:var(--fill);border-radius:18px;padding:4px 14px}
.tp-row{display:flex;align-items:center;gap:12px;min-height:56px}
.tp-row+.tp-row{border-top:1px solid var(--fill2)}
.tp-ic{flex:none;width:36px;height:36px;border-radius:12px;display:grid;place-items:center;background:var(--card);color:var(--tc)}
.tp-ic svg{width:20px;height:20px}
.tp-kv{min-width:0;display:flex;flex-direction:column}
.tp-kv small{font-size:12px;font-weight:600;color:var(--t3)}
.tp-kv b{font-size:15.5px;font-weight:700;color:var(--t1);line-height:1.35}
.tp-map{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:12px;min-height:52px;border-radius:16px;background:var(--tc);color:#fff!important;font-size:15.5px;font-weight:800;text-decoration:none!important}
.tp-map svg{width:20px;height:20px}
.tp-note{margin:12px 2px 0;font-size:12.5px;line-height:1.55;color:var(--t3)}
.tp-sub{display:inline-block;margin:18px 0 10px;font-size:12.5px;font-weight:800;color:color-mix(in srgb,var(--tc) 78%,#000);background:color-mix(in srgb,var(--tc) 13%,var(--card));padding:3px 10px;border-radius:999px}
.tp-relrow{display:flex;align-items:center;gap:10px;width:100%;min-height:52px;margin-bottom:8px;padding:8px 12px;border:0;border-radius:15px;background:var(--fill);font:inherit;text-align:left;cursor:pointer;transition:background-color .15s}
.tp-relrow:active{background:var(--fill2)}
.tp-relrec{flex:none;font-size:12px;font-weight:800;color:var(--tc);background:var(--card);padding:3px 8px;border-radius:999px}
.tp-relnm{flex:1;min-width:0;font-size:15px;font-weight:600;color:var(--t1);line-height:1.35}
.tp-go{flex:none;font-size:18px;color:var(--t3)}
`;
const JS=`
/* ---------- tip detail sheet in the app style ---------- */
var TIP_C={"이동":"#7a55e8","학사·장학":"#e8960c"};
var TIP_IC={pin:'<path d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.3" fill="none" stroke="currentColor" stroke-width="1.9"/>',
  bag:'<path d="M5 8h14l-1 12H6z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M9 8V6a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
  cal:'<rect x="4" y="5" width="16" height="15" rx="3" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M4 10h16M9 3v4M15 3v4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
  map:'<path d="M9 4l6 2 5-2v14l-5 2-6-2-5 2V6z M9 4v14M15 6v14" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>'};
function tipSvg(n){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+TIP_IC[n]+'</svg>'}
tipPop=function(origin,t){var lc=TIP_C[t.topic]||"#21b19d";var box=el("div",{cls:"tp"});box.style.setProperty("--tc",lc);
  var chips=el("div",{cls:"tp-chips"},[el("span",{cls:"tp-rec",text:"추천 "+t.rec}),el("span",{cls:"tp-chip",text:t.topic})]);
  if(usable(t.mode))chips.appendChild(el("span",{cls:"tp-chip",text:t.mode}));
  if(usable(t.range))chips.appendChild(el("span",{cls:"tp-chip",text:t.range==="학교↔시내"?"시내와 학교":t.range}));
  box.appendChild(chips);
  var info=el("div",{cls:"tp-info"});function row(ic,k,v){var i=el("span",{cls:"tp-ic"});i.innerHTML=tipSvg(ic);return el("div",{cls:"tp-row"},[i,el("div",{cls:"tp-kv"},[el("small",{text:k}),el("b",{text:v})])])}
  if(usable(t.loc))info.appendChild(row("pin","위치",t.loc));if(usable(t.prep))info.appendChild(row("bag","준비물",t.prep));if(t.date)info.appendChild(row("cal","확인한 날",t.date));
  box.appendChild(info);
  var mu=(t.map||"").match(/^https?:\\/\\/[^\\s(]+/);if(mu){var a=el("a",{cls:"tp-map",href:mu[0],target:"_blank",rel:"noopener"},[el("span",{text:"네이버지도에서 위치 보기"})]);a.insertAdjacentHTML("afterbegin",tipSvg("map"));box.appendChild(a)}
  box.appendChild(el("p",{cls:"tp-note",text:"학생 21명이 낸 원본을 정리한 자료예요. 원본에 없거나 이 꿀팁에 맞지 않는 칸은 뺐어요."}));
  var rel=XTIPS.filter(function(x){return x.id!==t.id&&x.topic===t.topic}).sort(function(a,b){return b.rec-a.rec}).slice(0,3);
  if(rel.length){box.appendChild(el("span",{cls:"tp-sub",text:"같은 주제의 다른 꿀팁"}));rel.forEach(function(x){var b=el("button",{cls:"tp-relrow",type:"button"},[el("span",{cls:"tp-relrec",text:"추천 "+x.rec}),el("span",{cls:"tp-relnm",text:x.name}),el("span",{cls:"tp-go",text:"›"})]);b.onclick=function(){tipPop(origin,x)};box.appendChild(b)})}
  openPop(origin,{eyebrow:"학생 꿀팁 · "+t.topic,title:t.name,color:lc,body:[box]})};
if(typeof PRESS_BIG==="string")PRESS_BIG+=",.tp-relrow,.tp-map";
`;
for(const F of process.argv.slice(2)){let s=fs.readFileSync(F,"utf8");
  const rep=(a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(F+": expected 1 match, found "+n+": "+a.slice(0,60));s=s.replace(a,()=>b)};
  if(s.includes("/* ===== tip detail sheet"))throw new Error(F+": already applied");
  const M="@media (prefers-reduced-motion:reduce){*{transition:none!important}}";rep(M,CSS+"\n"+M);
  rep("/* ---------- connect db ---------- */",JS+"/* ---------- connect db ---------- */");
  fs.writeFileSync(F,s,"utf8");console.log("ok",F.slice(-30))}

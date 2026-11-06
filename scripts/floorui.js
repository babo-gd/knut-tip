// 건물별 층 안내: building header card, elevator-style floor buttons (chosen = filled blue), and a clean divided list of
// tips (pin tile, name, mint 추천 pill, first 5 then "+N개 더"). Data and tip pop-ups unchanged.
// Usage: node floorui.js <page.html> [<page.html> ...]
const fs=require("fs");
const CSS=`
/* ===== 건물별 층 안내 ===== */
.floorwrap{display:block!important;padding:16px!important;--fc:#21b19d}
.bf-head{display:flex;align-items:center;gap:12px;margin-bottom:14px}
.bf-ic{flex:none;width:46px;height:46px;border-radius:15px;display:grid;place-items:center;color:var(--fc);background:color-mix(in srgb,var(--fc) 13%,var(--card))}
.bf-ic svg{width:24px;height:24px}
.bf-head b{display:block;font-size:18px;font-weight:800;letter-spacing:-.02em;color:var(--t1)}
.bf-head small{font-size:12.5px;font-weight:600;color:var(--t3)}
.floors{display:flex!important;flex-direction:row!important;justify-content:flex-start!important;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:12px;padding:10px 12px;border-radius:16px;background:var(--fill)}
.floors::before{content:"층";margin-right:2px;font-size:12.5px;font-weight:800;color:var(--t3)}
.floors button{width:44px!important;height:44px!important;min-width:0!important;padding:0!important;border:0!important;border-radius:50%!important;display:grid!important;place-items:center;background:var(--card)!important;color:var(--t2)!important;font:inherit;font-size:14px!important;font-weight:800!important;box-shadow:inset 0 0 0 1.5px var(--fill2),0 1px 2px rgba(20,20,30,.06)!important;cursor:pointer;transition:background-color .15s,color .15s}
.floors button[aria-pressed="true"]{background:var(--hero)!important;color:#fff!important;box-shadow:0 4px 10px color-mix(in srgb,var(--hero) 35%,transparent)!important}
.floorlist{gap:0!important}
.floorlist .fl-h{display:flex;align-items:baseline;gap:8px;margin:2px 2px 4px;font-size:15px!important;font-weight:800!important;color:var(--t1)}
.floorlist .fl-h small{font-size:12.5px;font-weight:600;color:var(--t3)}
.floorlist .fl-row{display:flex!important;align-items:center!important;gap:12px!important;width:100%;padding:12px 2px!important;border:0!important;border-radius:0!important;background:none!important;color:var(--t1)!important;font:inherit;text-align:left;cursor:pointer}
.floorlist .fl-row+.fl-row{border-top:1px solid var(--fill2)!important}
.fl-pin{flex:none;width:32px;height:32px;border-radius:11px;display:grid;place-items:center;color:var(--fc);background:color-mix(in srgb,var(--fc) 12%,var(--card))}
.fl-pin svg{width:17px;height:17px}
.fl-nm{flex:1;min-width:0;font-size:15px;font-weight:700;line-height:1.4}
.fl-rec{flex:none;font-size:12px;font-weight:800;padding:3px 9px;border-radius:999px;color:color-mix(in srgb,var(--fc) 80%,#000);background:color-mix(in srgb,var(--fc) 12%,var(--card))}
.fl-rec.top{color:#fff;background:var(--fc)}
.fl-more{display:block;width:100%;margin-top:6px;min-height:44px;border:0;border-radius:14px;background:var(--fill);font:inherit;font-size:14px;font-weight:800;color:var(--t2);cursor:pointer}
`;
const JS=`
/* ---------- 건물별 층 안내 ---------- */
renderBuild=function(){var bc=$("#bChips");if(!bc)return;bc.textContent="";
  BUILD.filter(function(x){return tipsIn(x[0]).length}).forEach(function(x){var b=el("button",{type:"button","aria-pressed":String(bSel===x[0]),text:x[0]+" "+tipsIn(x[0]).length});b.onclick=function(){bSel=x[0];fSel=null;store("bSel",bSel);renderBuild()};bc.appendChild(b)});
  var list=tipsIn(bSel),floors=Array.from(new Set(list.map(floorOf))).sort(function(a,b){if(a==="층 정보 없음")return 1;if(b==="층 정보 없음")return -1;return a<b?-1:1});
  if(!fSel||floors.indexOf(fSel)<0)fSel=floors.filter(function(f){return f!=="층 정보 없음"})[0]||floors[0];
  var wrap=$(".floorwrap");var head=$(".bf-head",wrap);if(!head){head=el("div",{cls:"bf-head"});wrap.insertBefore(head,wrap.firstChild)}
  head.innerHTML='<span class="bf-ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V5l8-2v18M12 9h8v12M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2M3 21h18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
  head.appendChild(el("div",{},[el("b",{text:bSel}),el("small",{text:"꿀팁 "+list.length+"개 · "+floors.filter(function(f){return f!=="층 정보 없음"}).length+"개 층"})]));
  var fl=$("#floors");fl.textContent="";floors.forEach(function(f){var b=el("button",{type:"button","aria-pressed":String(fSel===f),"aria-label":f==="층 정보 없음"?"층 정보 없음":f.replace("F","층"),text:f==="층 정보 없음"?"?":f});b.title=f;b.onclick=function(){fSel=f;renderBuild()};fl.appendChild(b)});
  var out=$("#floorList");out.textContent="";var rows=list.filter(function(t){return floorOf(t)===fSel}).sort(function(a,b){return b.rec-a.rec});
  out.appendChild(el("div",{cls:"fl-h"},[el("span",{text:fSel==="층 정보 없음"?"층 정보 없음":fSel.replace("F","층")}),el("small",{text:rows.length+"개"})]));
  var PIN='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.3" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
  function draw(all){$$(".fl-row,.fl-more",out).forEach(function(n){n.remove()});(all?rows:rows.slice(0,5)).forEach(function(t){var pin=el("span",{cls:"fl-pin"});pin.innerHTML=PIN;
      var r=el("button",{cls:"fl-row",type:"button"},[pin,el("span",{cls:"fl-nm",text:t.name}),el("span",{cls:"fl-rec"+(t.rec>=3?" top":""),text:"추천 "+t.rec})]);r.onclick=function(){tipPop(r,t)};out.appendChild(r)});
    if(!all&&rows.length>5){var m=el("button",{cls:"fl-more",type:"button",text:"+"+(rows.length-5)+"개 더 보기"});m.onclick=function(){draw(true)};out.appendChild(m)}}
  draw(false)};
renderBuild();
`;
for(const F of process.argv.slice(2)){let s=fs.readFileSync(F,"utf8");
  const rep=(a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(F+": expected 1 match, found "+n+": "+a.slice(0,60));s=s.replace(a,()=>b)};
  if(s.includes("/* ===== 건물별 층 안내"))throw new Error(F+": already applied");
  const M="@media (prefers-reduced-motion:reduce){*{transition:none!important}}";rep(M,CSS+"\n"+M);
  rep("/* ---------- connect db ---------- */",JS+"/* ---------- connect db ---------- */");
  fs.writeFileSync(F,s,"utf8");console.log("ok",F.slice(-30))}

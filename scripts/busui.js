// 통학버스 cards in the app style: bus icon tile, fare pill, 등교/하교 switch, stops on a purple route line with time pills.
// Rebuilt from the existing markup at load, so the timetable data stays in one place.
// Usage: node busui.js <page.html> [<page.html> ...]
const fs=require("fs");
const CSS=`
/* ===== 통학버스 cards ===== */
.bus{display:flex!important;flex-direction:column;gap:12px}
.bus-card{padding:18px!important;--bl:#7a55e8}
.bc-head{display:flex;align-items:center;gap:12px;margin-bottom:14px}
.bc-ic{flex:none;width:46px;height:46px;border-radius:15px;display:grid;place-items:center;color:var(--bl);background:color-mix(in srgb,var(--bl) 13%,var(--card))}
.bc-ic svg{width:24px;height:24px}
.bc-nm{flex:1;min-width:0;display:flex;flex-direction:column}
.bc-nm b{font-size:17px;font-weight:800;letter-spacing:-.02em}
.bc-nm small{font-size:12.5px;color:var(--t3);font-weight:500}
.bc-fare{flex:none;font-size:13px;font-weight:800;padding:5px 11px;border-radius:999px;background:#fff3d9;color:#9a5d00}
.bc-fare.free{background:var(--mint-bg);color:var(--mint-ink)}
.bus-card .seg{margin-bottom:10px}
.bc-route{position:relative;padding:2px 0}
.bc-route::before{content:"";position:absolute;left:8px;top:24px;bottom:24px;width:4px;margin-left:-2px;border-radius:2px;background:var(--bl);opacity:.3}
.bc-stop{position:relative;display:flex;align-items:center;gap:12px;min-height:46px}
.bc-dot{position:relative;z-index:1;flex:none;width:16px;height:16px;border-radius:50%;background:var(--card);box-shadow:inset 0 0 0 3px var(--bl)}
.bc-stop.end .bc-dot{background:var(--bl)}
.bc-name{flex:1;min-width:0;font-size:15.5px;font-weight:600;color:var(--t1)}
.bc-tag{margin-left:6px;font-size:11px;font-weight:800;color:#fff;background:var(--hero);padding:2px 7px;border-radius:999px;vertical-align:2px}
.bc-time{flex:none;font-variant-numeric:tabular-nums;font-size:15px;font-weight:800;color:var(--t1);background:var(--fill);padding:5px 10px;border-radius:10px}
.bc-stop.end .bc-time{color:var(--bl);background:color-mix(in srgb,var(--bl) 13%,var(--card))}
`;
const JS=`
/* ---------- 통학버스 cards in the app style ---------- */
(function(){var BUS_IC='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M5 11h14M8 17v3M16 17v3" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><circle cx="9" cy="14" r="1" fill="currentColor"/><circle cx="15" cy="14" r="1" fill="currentColor"/></svg>';
  var dflt=new Date().getHours()<12?0:1;
  $$(".bus > .card").forEach(function(card){if(card.classList.contains("bus-card"))return;var h=$("h3",card);if(!h)return;
    var pill=$(".pill",h),fare=pill?pill.textContent.trim():"",name=h.textContent.replace(fare,"").trim();
    var legs=[];$$(".route",card).forEach(function(r){var prev=r.previousElementSibling;legs.push({label:prev?prev.textContent.trim():"",stops:$$(":scope > div",r).map(function(d){var sp=$$("span",d);return [sp[0]?sp[0].textContent.trim():"",sp[1]?sp[1].textContent.trim():""]})})});
    if(!legs.length)return;card.textContent="";card.classList.add("bus-card");
    var ic=el("span",{cls:"bc-ic"});ic.innerHTML=BUS_IC;
    var first=legs[0].stops[0],last=legs[0].stops[legs[0].stops.length-1];
    card.appendChild(el("div",{cls:"bc-head"},[ic,el("div",{cls:"bc-nm"},[el("b",{text:name.replace(/\s*노선$/,"")}),el("small",{text:(first?first[0]:"")+" ↔ "+(last?last[0]:"")})]),el("span",{cls:"bc-fare"+(/무료/.test(fare)?" free":""),text:fare})]));
    var seg=el("div",{cls:"seg",role:"tablist","aria-label":name+" 등교·하교"}),route=el("div",{cls:"bc-route"}),cur=Math.min(dflt,legs.length-1);
    function draw(){seg.textContent="";legs.forEach(function(l,i){var b=el("button",{type:"button",role:"tab","aria-selected":String(i===cur),text:l.label||(i?"하교":"등교")});b.onclick=function(){cur=i;draw()};seg.appendChild(b)});
      route.textContent="";var st=legs[cur].stops;st.forEach(function(s,i){var row=el("div",{cls:"bc-stop"+(i===0||i===st.length-1?" end":"")},[el("i",{cls:"bc-dot","aria-hidden":"true"})]);
        var nm=el("span",{cls:"bc-name",text:s[0]});if(/캠퍼스/.test(s[0]))nm.appendChild(el("span",{cls:"bc-tag",text:"학교"}));row.appendChild(nm);row.appendChild(el("span",{cls:"bc-time",text:s[1]}));route.appendChild(row)})}
    draw();card.appendChild(seg);card.appendChild(route)})})();
`;
for(const F of process.argv.slice(2)){let s=fs.readFileSync(F,"utf8");
  const rep=(a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(F+": expected 1 match, found "+n+": "+a.slice(0,60));s=s.replace(a,()=>b)};
  if(s.includes("/* ===== 통학버스 cards"))throw new Error(F+": already applied");
  const M="@media (prefers-reduced-motion:reduce){*{transition:none!important}}";rep(M,CSS+"\n"+M);
  rep("/* ---------- connect db ---------- */",JS+"/* ---------- connect db ---------- */");
  fs.writeFileSync(F,s,"utf8");console.log("ok",F.slice(-30))}

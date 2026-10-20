// Price filter: replace the native <select> with a chip that opens a small sheet of options (mint check when chosen).
// Usage: node pricechip.js <page.html> [<page.html> ...]
const fs=require("fs");
const OLD=`  var sel=el("select",{id:"priceSel","aria-label":"가격",style:"width:auto"});PRICES.forEach(function(x){var o=el("option",{value:x[0],text:x[1]});if(x[0]===priceSel)o.selected=true;sel.appendChild(o)});
  sel.onchange=function(){priceSel=sel.value;store("priceSel",priceSel);renderFood()};ff.insertBefore(sel,ff.firstChild)}`;
const NEW=`  var pc=PRICES.filter(function(x){return x[0]===priceSel})[0]||PRICES[0];
  var pb=el("button",{cls:"chip price-chip",type:"button","aria-pressed":String(priceSel!=="all"),"aria-haspopup":"dialog","aria-label":"가격대: "+pc[1]},[el("span",{text:priceSel==="all"?"가격":pc[1]}),el("i",{cls:"cv","aria-hidden":"true"})]);
  pb.onclick=function(){var list=el("div",{cls:"opt-list",role:"radiogroup","aria-label":"가격대"});
    PRICES.forEach(function(x){var o=el("button",{cls:"opt-row",type:"button",role:"radio","aria-checked":String(priceSel===x[0])},[el("span",{text:x[0]==="all"?"전체 가격":x[1]})]);
      o.onclick=function(){priceSel=x[0];store("priceSel",priceSel);closePop();renderFoodControls();renderFood()};list.appendChild(o)});
    openPop(pb,{eyebrow:"필터",title:"가격대 고르기",body:[list]})};
  ff.insertBefore(pb,ff.firstChild)}`;
const CSS=`
/* ===== price filter chip + option sheet ===== */
.price-chip .cv{display:inline-block;width:7px;height:7px;margin:0 2px 3px 2px;border-right:2px solid currentColor;border-bottom:2px solid currentColor;transform:rotate(45deg)}
.price-chip[aria-pressed="true"]::before{display:none!important}
.opt-list{display:flex;flex-direction:column;gap:8px;margin-top:6px}
.opt-row{display:flex;align-items:center;gap:12px;width:100%;min-height:54px;padding:0 16px;border:0;border-radius:16px;background:var(--fill);font:inherit;font-size:16px;font-weight:600;color:var(--t1);text-align:left;cursor:pointer;transition:background-color .15s,color .15s}
.opt-row::before{content:"";flex:none;width:22px;height:22px;border-radius:50%;background:var(--card);box-shadow:inset 0 0 0 2px #c9ced9}
.opt-row:active{background:var(--fill2)}
.opt-row[aria-checked="true"]{background:var(--mint-bg);color:var(--mint-ink);font-weight:700}
.opt-row[aria-checked="true"]::before{box-shadow:none;background:var(--mint) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M5 10.5l3.2 3L15 7' fill='none' stroke='white' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/16px no-repeat}
`;
for(const F of process.argv.slice(2)){let s=fs.readFileSync(F,"utf8");
  const rep=(a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(F+": expected 1 match, found "+n+": "+a.slice(0,60));s=s.replace(a,()=>b)};
  rep(OLD,NEW);
  const M="@media (prefers-reduced-motion:reduce){*{transition:none!important}}";rep(M,CSS+"\n"+M);
  fs.writeFileSync(F,s,"utf8");console.log("ok",F.slice(-30))}

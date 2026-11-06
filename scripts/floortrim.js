// 건물별 층 안내: keep only what matters — per floor, tips with 추천 2+ (max 5, most recommended first; top 3 if none),
// no repeated pin icon, no "+N개 더"; a one-line note says where the rest are.
// Usage: node floortrim.js <page.html> [<page.html> ...]
const fs=require("fs");
const CSS=`
/* ===== floor guide: essentials only ===== */
.floorlist .fl-pin{display:none!important}
.floorlist .fl-row{padding:11px 2px!important}
.fl-rest{margin:8px 2px 0;font-size:12.5px;line-height:1.5;color:var(--t3)}
`;
const OLD=`  function draw(all){$$(".fl-row,.fl-more",out).forEach(function(n){n.remove()});(all?rows:rows.slice(0,5)).forEach(`;
const NEW=`  var keep=rows.filter(function(t){return t.rec>=2}).slice(0,5);if(!keep.length)keep=rows.slice(0,3);var rest=rows.length-keep.length;
  out.firstChild.lastChild.textContent=rest?"추천 많은 "+keep.length+"개":keep.length+"개";
  function draw(){$$(".fl-row,.fl-more,.fl-rest",out).forEach(function(n){n.remove()});keep.forEach(`;
const OLD2=`    if(!all&&rows.length>5){var m=el("button",{cls:"fl-more",type:"button",text:"+"+(rows.length-5)+"개 더 보기"});m.onclick=function(){draw(true)};out.appendChild(m)}}
  draw(false)};`;
const NEW2=`    if(rest)out.appendChild(el("p",{cls:"fl-rest",text:"추천이 적은 "+rest+"개는 '학생들이 모은 학교생활 꿀팁'에 있어요."}))}
  draw()};`;
for(const F of process.argv.slice(2)){let s=fs.readFileSync(F,"utf8");
  const rep=(a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(F+": expected 1 match, found "+n+": "+a.slice(0,60));s=s.replace(a,()=>b)};
  if(s.includes("/* ===== floor guide: essentials only"))throw new Error(F+": already applied");
  rep(OLD,NEW);rep(OLD2,NEW2);
  const M="@media (prefers-reduced-motion:reduce){*{transition:none!important}}";rep(M,CSS+"\n"+M);
  fs.writeFileSync(F,s,"utf8");console.log("ok",F.slice(-30))}

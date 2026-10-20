// Map card row: run edge to edge so the next card peeks in from the screen edge (not cut mid-air), and leave room for shadows.
// Usage: node cardrow.js <page.html> [<page.html> ...]
const fs=require("fs");
const CSS=`
/* ===== map card row: edge-to-edge swipe row ===== */
.fm-cards{width:auto!important;max-width:none!important;margin:0 -18px!important;padding:12px 18px 20px!important;scroll-padding-inline:18px;gap:10px!important}
.fm-cards::after{content:"";flex:0 0 8px}
.fm-card{scroll-snap-align:start!important;width:82%!important;max-width:320px!important;align-self:stretch}
.fm-listbtn{margin-top:0!important}
`;
for(const F of process.argv.slice(2)){let s=fs.readFileSync(F,"utf8");
  if(s.includes("/* ===== map card row"))throw new Error(F+": already applied");
  const M="@media (prefers-reduced-motion:reduce){*{transition:none!important}}";
  if(s.split(M).length!==2)throw new Error(F+": marker not unique");
  s=s.replace(M,()=>CSS+"\n"+M);fs.writeFileSync(F,s,"utf8");console.log("ok",F.slice(-30))}

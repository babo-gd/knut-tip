// Home banner: more room between the yellow name pill and the search bar that overlaps the banner's bottom edge.
// Usage: node homegap.js <page.html> [<page.html> ...]
const fs=require("fs");
const CSS=`
/* ===== home banner: gap above the search bar ===== */
section.panel[data-tab="home"] .scr-hero{padding-bottom:46px!important}
`;
for(const F of process.argv.slice(2)){let s=fs.readFileSync(F,"utf8");
  if(s.includes("/* ===== home banner: gap above the search bar"))throw new Error(F+": already applied");
  const M="@media (prefers-reduced-motion:reduce){*{transition:none!important}}";
  if(s.split(M).length!==2)throw new Error(F+": marker not unique");
  s=s.replace(M,()=>CSS+"\n"+M);fs.writeFileSync(F,s,"utf8");console.log("ok",F.slice(-30))}

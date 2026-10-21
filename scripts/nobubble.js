// Remove the speech-bubble description from every category banner; keep the banner tall enough for the mascot.
// Usage: node nobubble.js <page.html> [<page.html> ...]
const fs=require("fs");
const CSS=`
/* ===== banner without the description bubble ===== */
.scr-hero .hb{display:none!important}
.scr-hero{min-height:186px}
`;
for(const F of process.argv.slice(2)){let s=fs.readFileSync(F,"utf8");
  if(s.includes("/* ===== banner without the description bubble"))throw new Error(F+": already applied");
  const M="@media (prefers-reduced-motion:reduce){*{transition:none!important}}";
  if(s.split(M).length!==2)throw new Error(F+": marker not unique");
  s=s.replace(M,()=>CSS+"\n"+M);fs.writeFileSync(F,s,"utf8");console.log("ok",F.slice(-30))}

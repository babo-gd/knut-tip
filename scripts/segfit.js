// Map area chips (전체/교통대 앞/시내/근교): share the space left of the zoom buttons so none gets cut off.
// Usage: node segfit.js <page.html> [<page.html> ...]
const fs=require("fs");
const CSS=`
/* ===== map area chips: always fit ===== */
.fm-seg{width:calc(100% - 76px)!important;max-width:none!important;overflow:hidden!important;gap:2px!important;padding:4px!important;box-sizing:border-box}
.fm-seg button{flex:1 1 auto;min-width:0;padding:8px 4px!important;font-size:13.5px!important;white-space:nowrap;text-align:center}
@media (max-width:360px){.fm-seg button{font-size:12.5px!important;padding:8px 2px!important}}
`;
for(const F of process.argv.slice(2)){let s=fs.readFileSync(F,"utf8");
  if(s.includes("/* ===== map area chips: always fit"))throw new Error(F+": already applied");
  const M="@media (prefers-reduced-motion:reduce){*{transition:none!important}}";
  if(s.split(M).length!==2)throw new Error(F+": marker not unique");
  s=s.replace(M,()=>CSS+"\n"+M);fs.writeFileSync(F,s,"utf8");console.log("ok",F.slice(-30))}

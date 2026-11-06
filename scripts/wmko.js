// Header wordmark: tidy "넛팁" pill next to KNUT!P (Pretendard bold, fixed height, centred on the wordmark).
// Usage: node wmko.js <page.html> [<page.html> ...]
const fs=require("fs");
const CSS=`
/* ===== header wordmark: tidy 넛팁 pill ===== */
.wordmark{align-items:center!important}
.wordmark .wm-ko{display:inline-flex;align-items:center;justify-content:center;height:22px;padding:0 9px!important;border-radius:7px!important;background:var(--hero)!important;color:#fff!important;font-family:var(--pf)!important;font-weight:800!important;font-size:13px!important;line-height:1!important;letter-spacing:.02em!important;-webkit-text-stroke:0!important;transform:translateY(1px)}
`;
for(const F of process.argv.slice(2)){let s=fs.readFileSync(F,"utf8");
  if(s.includes("/* ===== header wordmark: tidy"))throw new Error(F+": already applied");
  const M="@media (prefers-reduced-motion:reduce){*{transition:none!important}}";
  if(s.split(M).length!==2)throw new Error(F+": marker not unique");
  s=s.replace(M,()=>CSS+"\n"+M);fs.writeFileSync(F,s,"utf8");console.log("ok",F.slice(-30))}

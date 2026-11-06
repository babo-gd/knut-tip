// Detail pop-ups (꿀팁·맛집·계정 windows) open and close without motion: no slide, no 3D tilt.
// The dark backdrop stays. Other sheets (학식, 체크리스트, 전체 메뉴) keep their motion.
// Usage: node popnofx.js <page.html> [<page.html> ...]
const fs=require("fs");
const CSS=`
/* ===== detail pop-ups: no open/close motion ===== */
.pop-bg{animation:none!important}
`;
const JS=`
/* ---------- detail pop-ups: no open/close motion ---------- */
function popStill(){$$(".pop-bg,.pop").forEach(function(n){if(n.getAnimations)n.getAnimations().forEach(function(a){a.finish()})})}
var _openPopStill=openPop;openPop=function(){var r=_openPopStill.apply(this,arguments);popStill();return r};
var _closePopStill=closePop;closePop=function(){var r=_closePopStill.apply(this,arguments);popStill();return r};
`;
for(const F of process.argv.slice(2)){let s=fs.readFileSync(F,"utf8");
  const rep=(a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(F+": expected 1 match, found "+n+": "+a.slice(0,60));s=s.replace(a,()=>b)};
  if(s.includes("/* ===== detail pop-ups: no open/close motion"))throw new Error(F+": already applied");
  const M="@media (prefers-reduced-motion:reduce){*{transition:none!important}}";rep(M,CSS+"\n"+M);
  rep("/* ---------- connect db ---------- */",JS+"/* ---------- connect db ---------- */");
  fs.writeFileSync(F,s,"utf8");console.log("ok",F.slice(-30))}

// Depth layer: category screens swing in from the side you move toward, lists flip up, pop-ups tilt up,
// cards tilt toward the press point and spring back, small buttons squish, and (PC) big cards tilt under the mouse.
// Everything is skipped when the device asks for reduced motion.
// Usage: node depth.js <page.html> [<page.html> ...]
const fs=require("fs");

const CSS=`
/* ===== depth layer ===== */
.tilt-hover{box-shadow:0 14px 30px rgba(20,20,40,.14)!important}
`;

const JS=`
/* ---------- depth layer: 3D screen changes, press tilt, hover tilt ---------- */
var TAB_ORDER=TABS.map(function(t){return t[0]});
var EZ="cubic-bezier(.2,.8,.2,1)";
/* category change: swing in from the side you are moving toward */
var _goDepth=go;go=function(id){var cur=($$("section.panel").filter(function(p){return !p.hidden})[0]||{}).dataset;var before=cur&&cur.tab;_goDepth.apply(this,arguments);var t=ALIAS[id]||id;
  if(RM||!before||before===t)return;var d=TAB_ORDER.indexOf(t)>TAB_ORDER.indexOf(before)?1:-1,o=(d>0?"0%":"100%")+" 40%";
  $$('section.panel[data-tab="'+t+'"]').forEach(function(p){p.animate([{opacity:0,transformOrigin:o,transform:"perspective(1200px) translateX("+(d*46)+"px) rotateY("+(-d*10)+"deg) scale(.96)"},{opacity:1,transformOrigin:o,transform:"perspective(1200px) translateX(0) rotateY(0) scale(1)"}],{duration:480,easing:EZ})})};
/* opening a section: push in with depth; rows flip up one after another */
pushIn=function(node,dir){if(RM||!node)return;var d=dir||1;node.animate([{opacity:0,transformOrigin:(d>0?"0%":"100%")+" 50%",transform:"perspective(1000px) translateX("+(d*30)+"px) rotateY("+(-d*8)+"deg) scale(.97)"},{opacity:1,transformOrigin:(d>0?"0%":"100%")+" 50%",transform:"perspective(1000px) translateX(0) rotateY(0) scale(1)"}],{duration:400,easing:EZ})};
stagger=function(nodes){if(RM)return;nodes.slice(0,10).forEach(function(n,i){n.animate([{opacity:0,transformOrigin:"50% 0%",transform:"perspective(800px) translateY(10px) rotateX(-14deg)"},{opacity:1,transformOrigin:"50% 0%",transform:"perspective(800px) translateY(0) rotateX(0)"}],{duration:360,delay:i*32,easing:EZ,fill:"backwards"})})};
/* pop-ups and sheets tilt up from the bottom edge */
function tiltUp(node){if(RM||!node)return;node.animate([{transformOrigin:"50% 100%",transform:"perspective(900px) translateY(100%) rotateX(16deg)"},{transformOrigin:"50% 100%",transform:"perspective(900px) translateY(0) rotateX(0)"}],{duration:420,easing:"cubic-bezier(.2,.9,.3,1)"})}
var _openPopD=openPop;openPop=function(){_openPopD.apply(this,arguments);var ps=$$(".pop");tiltUp(ps[ps.length-1])};
var _openSheetD=openSheet;openSheet=function(){_openSheetD.apply(this,arguments);var bs=$$(".bs");tiltUp(bs[bs.length-1])};
/* press: cards tilt toward the press point, small buttons squish; both spring back */
var PRESS_BIG=".sm-row,.cat-btn,.hb-btn,.mini,.aud-links button,.fm-card,.lg-card,.trow,.dg-row,.hot-row,.prow,.fl-row,.fm-listbtn,.opt-row,.tipx,.deptcard,.btn,.ob-go,.quick button";
var PRESS_SMALL=".chip,.cats button,.filters button,.seg button,.fm-seg button,.ml-days button,.ml-slots button,.fm-ctl button,.fm-nav,.tabbar button,.acct-av,.allmenu-btn,.bs-x,.pop .x";
function setT(n,t,tr){n.style.setProperty("transition",tr,"important");n.style.setProperty("transform",t,"important")}
document.addEventListener("pointerdown",function(e){if(RM||e.button>0)return;var n=e.target.closest(PRESS_BIG),big=!!n;if(!n)n=e.target.closest(PRESS_SMALL);if(!n||n.disabled||n.closest(".fm-stage"))return;
  var r=n.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5,amp=Math.min(10,2600/Math.max(r.width,120));
  setT(n,big?"perspective(700px) rotateX("+(-py*amp).toFixed(2)+"deg) rotateY("+(px*amp).toFixed(2)+"deg) scale(.965)":"scale(.9)","transform .12s "+EZ);n._pr=true;
  function up(){document.removeEventListener("pointerup",up,true);document.removeEventListener("pointercancel",up,true);if(!n._pr)return;n._pr=false;
    setT(n,"none","transform .55s cubic-bezier(.3,1.7,.45,1)");clearTimeout(n._pt);n._pt=setTimeout(function(){if(!n._pr&&n!==hoverEl){n.style.removeProperty("transform");n.style.removeProperty("transition")}},600)}
  document.addEventListener("pointerup",up,true);document.addEventListener("pointercancel",up,true)},true);
/* PC: big cards lean toward the mouse */
var HOVER_SEL=".hb-btn,.mini,.fm-card,.lg-card,.ml-card,.tipx,.deptcard",hoverEl=null;
function unhover(){if(!hoverEl)return;var h=hoverEl;hoverEl=null;h.classList.remove("tilt-hover");if(!h._pr){setT(h,"none","transform .4s "+EZ);setTimeout(function(){if(h!==hoverEl&&!h._pr){h.style.removeProperty("transform");h.style.removeProperty("transition")}},420)}}
if(matchMedia("(hover:hover) and (pointer:fine)").matches)document.addEventListener("pointermove",function(e){if(RM||e.pointerType!=="mouse")return;var n=e.target.closest(HOVER_SEL);if(n!==hoverEl)unhover();if(!n||n._pr)return;hoverEl=n;
  var r=n.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;n.classList.add("tilt-hover");
  setT(n,"perspective(800px) translateY(-2px) rotateX("+(-py*5).toFixed(2)+"deg) rotateY("+(px*5).toFixed(2)+"deg)","transform .15s ease-out")},{passive:true});
`;

for(const F of process.argv.slice(2)){let s=fs.readFileSync(F,"utf8");
  const rep=(a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(F+": expected 1 match, found "+n+": "+a.slice(0,60));s=s.replace(a,()=>b)};
  if(s.includes("/* ===== depth layer"))throw new Error(F+": already applied");
  const M="@media (prefers-reduced-motion:reduce){*{transition:none!important}}";rep(M,CSS+"\n"+M);
  rep("/* ---------- connect db ---------- */",JS+"/* ---------- connect db ---------- */");
  fs.writeFileSync(F,s,"utf8");console.log("ok",F.slice(-30))}

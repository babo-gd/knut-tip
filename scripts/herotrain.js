// Banner train travels between stations: the banner track shows all 6 stations, and on a category change the train
// drives from the previous category's station to the new one (faces its direction, lights passed stations),
// then the station sign flips. The owner asked for the movement even when the OS asks for reduced motion.
// Usage: node herotrain.js <page.html> [<page.html> ...]
const fs=require("fs");
const CSS=`
/* ===== banner train travels between stations ===== */
.hero-st{position:absolute;top:10px;z-index:0;width:8px;height:8px;margin-left:-4px;border-radius:50%;background:var(--hero2,#2f4ae0);box-shadow:0 0 0 2px rgba(255,255,255,.55);pointer-events:none;transition:background-color .3s,box-shadow .3s}
.hero-st.past{background:#fff;box-shadow:0 0 0 2px #fff}
.hero-trn{left:0!important;margin-left:-15px}
.hero-trn.rev{border-radius:9px 5px 5px 9px}
.hero-trn.rev::before{left:12px}
.scr-hero.enter .st-sign{animation-delay:1.05s!important}
@media (prefers-reduced-motion:reduce){.scr-hero.enter .st-sign{animation:signFlip .5s cubic-bezier(.3,1.4,.5,1) 1.05s both!important}}
`;
const JS=`
/* ---------- banner train travels between stations ---------- */
function heroStopX(box,i){var w=box.clientWidth;return 22+i*(w-44)/(TAB_ORDER.length-1)}
function heroTrack(box){if(!box||box._trk)return;box._trk=true;var tr=$(".hero-track",box);if(!tr)return;
  TAB_ORDER.forEach(function(t,i){var d=el("i",{cls:"hero-st","aria-hidden":"true"});d.dataset.i=i;box.insertBefore(d,tr.nextSibling)})}
function heroPlace(box,idx){var t=$(".hero-trn",box);if(!t)return;$$(".hero-st",box).forEach(function(d){var i=+d.dataset.i;d.style.left=heroStopX(box,i)+"px";d.classList.toggle("past",i<=idx)});t.style.transform="translateX("+heroStopX(box,idx)+"px)"}
var heroLast=null;
heroArrive=function(){$$("section.panel:not([hidden]) .scr-hero").forEach(function(box){heroStation(box);heroTrack(box);
    var idx=TAB_ORDER.indexOf(tabOf(box)),prev=heroLast==null?-1:heroLast,t=$(".hero-trn",box);if(!t)return;
    var x1=heroStopX(box,idx),x0=prev<0?-40:heroStopX(box,prev);t.classList.toggle("rev",prev>idx);
    $$(".hero-st",box).forEach(function(d){var i=+d.dataset.i;d.style.left=heroStopX(box,i)+"px";d.classList.toggle("past",i<=Math.min(idx,prev<0?idx:Math.min(prev,idx)))});
    t.style.transform="translateX("+x1+"px)";
    clearTimeout(box._hpT);(box._lt||[]).forEach(clearTimeout);box._lt=[];if(x0!==x1){var dur=Math.min(1100,520+Math.abs(x1-x0)*1.6);t.animate([{transform:"translateX("+x0+"px)"},{transform:"translateX("+x1+"px)"}],{duration:dur,easing:"cubic-bezier(.45,0,.2,1)"});if(prev>=0&&idx>prev){for(var k=prev+1;k<idx;k++)(function(k){box._lt.push(setTimeout(function(){var d=$('.hero-st[data-i="'+k+'"]',box);if(d)d.classList.add("past")},dur*(k-prev)/(idx-prev)))})(k)}box._hpT=setTimeout(function(){heroPlace(box,idx)},dur)}else heroPlace(box,idx)});
  var cur=$$("section.panel").filter(function(p){return !p.hidden})[0];if(cur)heroLast=TAB_ORDER.indexOf(cur.dataset.tab)};
$$(".scr-hero").forEach(function(b){heroTrack(b);heroPlace(b,TAB_ORDER.indexOf(tabOf(b)))});
window.addEventListener("resize",function(){$$(".scr-hero").forEach(function(b){heroPlace(b,TAB_ORDER.indexOf(tabOf(b)))})});
heroArrive();
`;
for(const F of process.argv.slice(2)){let s=fs.readFileSync(F,"utf8");
  const rep=(a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(F+": expected 1 match, found "+n+": "+a.slice(0,60));s=s.replace(a,()=>b)};
  if(s.includes("/* ===== banner train travels between stations"))throw new Error(F+": already applied");
  const M="@media (prefers-reduced-motion:reduce){*{transition:none!important}}";rep(M,CSS+"\n"+M);
  rep("/* ---------- connect db ---------- */",JS+"/* ---------- connect db ---------- */");
  fs.writeFileSync(F,s,"utf8");console.log("ok",F.slice(-30))}

// Restaurant pictures: every shop gets a food-type illustration (big emoji on that type's colour) in the detail card's
// photo area, the map card row and the full list. Type is read from the shop name; unclear names get a neutral plate.
// Real student photos, when a shop has them, still take priority (the photo branch of placeCard is untouched).
// Usage: node placeart.js <page.html> [<page.html> ...]
const fs=require("fs");
const CSS=`
/* ===== restaurant food-type pictures ===== */
.pa{position:relative;height:150px;border-radius:18px;overflow:hidden;display:grid;place-items:center;background:linear-gradient(135deg,var(--pa1),var(--pa2))}
.pa::before,.pa::after{content:"";position:absolute;border-radius:50%;background:rgba(255,255,255,.18)}
.pa::before{width:150px;height:150px;right:-40px;top:-50px}
.pa::after{width:90px;height:90px;left:-25px;bottom:-35px}
.pa-e{position:relative;z-index:1;font-size:74px;line-height:1;filter:drop-shadow(0 8px 12px rgba(0,0,0,.18))}
.pa-l{position:absolute;z-index:1;left:12px;bottom:12px;padding:4px 10px;border-radius:999px;background:rgba(255,255,255,.85);color:#2a2f45;font-size:12.5px;font-weight:800}
.fm-av.art,.pic.art{background:linear-gradient(135deg,var(--pa1),var(--pa2))!important;color:transparent;font-size:0;display:grid!important;place-items:center}
.fm-av.art::after,.pic.art::after{content:attr(data-e);font-size:26px;line-height:1;color:initial}
.pic.art svg{display:none}
`;
const JS=`
/* ---------- restaurant food-type pictures ---------- */
var PA_TYPES=[
  ["카페·디저트","☕","#f6e3c8","#d8b48a",/카페|커피|베이커리|파리바게뜨|밀크티|브레드/],
  ["부리또","🌯","#ffe1b8","#ffb867",/부리또|수리또/],
  ["마라탕","🌶️","#ffd2cc","#ff8a7a",/마라/],
  ["중식","🥟","#ffe0d0","#ff9f80",/짬뽕|반점|차이나|중화/],
  ["버거","🍔","#ffecb8","#ffc85a",/버거|스매쉬/],
  ["치킨·닭","🍗","#ffe6c2","#f5a95a",/치킨|통닭|닭갈비|찜닭/],
  ["고기","🥩","#ffd9df","#f2899b",/삼겹|고기|갈비|구이|막창|곱창|돼지|바베큐|대패|돌판/],
  ["국밥·찌개","🍲","#ffe4cf","#e8a06a",/국밥|감자탕|순대|부대|찌개|묵밥|옹심이|육면|해장/],
  ["돈까스","🍤","#fff0c9","#f0c060",/돈까스|카츠/],
  ["일식","🍣","#dfeeff","#8fbaf0",/스시|초밥|우동|라멘|쇼쿠|후라토/],
  ["국수","🍜","#d9f3ee","#7fd0c0",/국수|칼국수|막국수|메밀|냉면/],
  ["분식","🍢","#ffdcea","#f59ac0",/분식|떡볶이|토스트|김밥/],
  ["밥·도시락","🍱","#e2f4d9","#9ccf7e",/도시락|덮밥|핵밥|쌈밥|학생식당|교직원식당/],
  ["파스타","🍝","#ffe8d6","#f2a77a",/투파인드피터|파스타/],
  ["카레","🍛","#fff1c4","#e9b84a",/심향|카레/]];
function placeArt(p){var n=p.name||"";for(var i=0;i<PA_TYPES.length;i++)if(PA_TYPES[i][4].test(n))return {label:PA_TYPES[i][0],e:PA_TYPES[i][1],c1:PA_TYPES[i][2],c2:PA_TYPES[i][3]};return {label:"식당",e:"🍽️",c1:"#e6e9f2",c2:"#b5bdd3"}}
function paStyle(node,a){node.style.setProperty("--pa1",a.c1);node.style.setProperty("--pa2",a.c2)}
function placeArtNode(p){var a=placeArt(p),d=el("div",{cls:"pa",role:"img","aria-label":a.label+" 그림"},[el("span",{cls:"pa-e","aria-hidden":"true",text:a.e}),el("span",{cls:"pa-l",text:a.label})]);paStyle(d,a);return d}
var _placeCardPA=placeCard;placeCard=function(p){var n=_placeCardPA.apply(this,arguments);var ph=n.querySelector(".ph");if(ph)ph.replaceWith(placeArtNode(p));return n};
var _placeRowPA=placeRow;placeRow=function(p){var n=_placeRowPA.apply(this,arguments);var pic=n.querySelector(".pic");if(pic){var a=placeArt(p);pic.classList.add("art");pic.dataset.e=a.e;paStyle(pic,a)}return n};
var _fmCardPA=fmCardNode;fmCardNode=function(p){var n=_fmCardPA.apply(this,arguments);var av=n.querySelector(".fm-av");if(av){var a=placeArt(p);av.classList.add("art");av.dataset.e=a.e;paStyle(av,a)}return n};
renderFood();
`;
for(const F of process.argv.slice(2)){let s=fs.readFileSync(F,"utf8");
  const rep=(a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(F+": expected 1 match, found "+n+": "+a.slice(0,60));s=s.replace(a,()=>b)};
  if(s.includes("/* ===== restaurant food-type pictures"))throw new Error(F+": already applied");
  const M="@media (prefers-reduced-motion:reduce){*{transition:none!important}}";rep(M,CSS+"\n"+M);
  rep("/* ---------- connect db ---------- */",JS+"/* ---------- connect db ---------- */");
  fs.writeFileSync(F,s,"utf8");console.log("ok",F.slice(-30))}

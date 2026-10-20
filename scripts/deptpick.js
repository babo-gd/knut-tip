// Login 학과 field: replace the phone's native picker with an in-app sheet
// (search, campus tabs, departments grouped by college, mint check on the chosen one).
// The hidden <select> stays as the form value, so the login logic is unchanged.
// Usage: node deptpick.js <page.html> [<page.html> ...]
const fs=require("fs");

const CSS=`
/* ===== 학과 picker sheet ===== */
.dp-field{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;min-height:52px;padding:0 16px;border:0;border-radius:15px;background:var(--fill);font:inherit;font-size:16px;font-weight:600;color:var(--t1);text-align:left;cursor:pointer;transition:background-color .15s,box-shadow .15s}
.dp-field.empty .dp-v{color:var(--t3);font-weight:500}
.dp-field .dp-c{font-size:12.5px;font-weight:700;color:var(--mint-ink);background:var(--mint-bg);padding:3px 9px;border-radius:999px;margin-left:auto}
.dp-field .cv{flex:none;width:8px;height:8px;margin:0 3px 4px 4px;border-right:2px solid var(--t3);border-bottom:2px solid var(--t3);transform:rotate(45deg)}
.dp-field:focus-visible{outline:none;box-shadow:inset 0 0 0 2px var(--hero)}
.dp-bg{position:fixed;inset:0;z-index:90;display:flex;justify-content:center;align-items:flex-end;background:rgba(0,0,0,.45);animation:kfade .2s}
.dp{width:min(440px,100%);max-height:88vh;display:flex;flex-direction:column;background:var(--card);border-radius:28px 28px 0 0;padding:10px 18px 0;box-shadow:0 -10px 40px rgba(0,0,0,.2)}
.dp-grab{width:40px;height:5px;border-radius:3px;background:var(--fill2);margin:2px auto 10px}
.dp-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:2px 2px 12px}
.dp-head h2{margin:0;font-size:21px!important;font-weight:800!important;letter-spacing:-.02em}
.dp-x{width:38px;height:38px;border:0;border-radius:50%;background:var(--fill);color:var(--t2);font-size:16px;cursor:pointer}
.dp-search{position:relative;margin-bottom:12px}
.dp-search svg{position:absolute;left:14px;top:50%;width:18px;height:18px;margin-top:-9px;color:var(--t3);pointer-events:none}
.dp .dp-search input[type="search"]{width:100%;padding-left:44px!important}
@media (prefers-reduced-motion:reduce){.dp-bg{animation:none!important}}
.dp .seg{margin-bottom:6px}
.dp-list{overflow:auto;overscroll-behavior:contain;padding:2px 2px calc(24px + env(safe-area-inset-bottom));margin:0 -2px}
.dp-col{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:var(--t3);padding:16px 4px 8px}
.dp-col::after{content:"";flex:1;height:1px;background:var(--fill2)}
.dp-list .opt-row{margin-bottom:8px}
.dp-list .opt-row small{margin-left:auto;font-size:12px;font-weight:600;color:var(--t3)}
.dp-empty{padding:28px 4px;text-align:center;color:var(--t3)}
`;

const JS=`
/* ---------- login 학과 field: in-app picker sheet ---------- */
function deptPicker(sel){if(!sel||sel._dp)return;sel._dp=true;sel.hidden=true;
  var first=sel.options[0],noneLabel=first&&first.value===""?first.textContent:"";var optional=noneLabel==="선택 안 함";
  var field=el("button",{cls:"dp-field",type:"button","aria-haspopup":"dialog"});sel.parentNode.insertBefore(field,sel.nextSibling);
  function paint(){var d=DEPTS.filter(function(x){return x.n===sel.value})[0];field.textContent="";field.classList.toggle("empty",!d);
    field.appendChild(el("span",{cls:"dp-v",text:d?d.n:(optional?"선택 안 함":"학과를 골라 주세요")}));if(d)field.appendChild(el("span",{cls:"dp-c",text:d.c+"캠퍼스"}));field.appendChild(el("i",{cls:"cv","aria-hidden":"true"}))}
  paint();
  field.onclick=function(){var cur=DEPTS.filter(function(x){return x.n===sel.value})[0];var camp=cur?cur.c:"충주",q="";
    var x=el("button",{cls:"dp-x",type:"button","aria-label":"닫기",text:"✕"});
    var inp=el("input",{type:"search",placeholder:"학과 이름으로 찾기","aria-label":"학과 검색",autocomplete:"off"});
    var srch=el("div",{cls:"dp-search"},[inp]);srch.insertAdjacentHTML("afterbegin",'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>');
    var seg=el("div",{cls:"seg",role:"tablist","aria-label":"캠퍼스"}),list=el("div",{cls:"dp-list",role:"radiogroup","aria-label":"학과"});
    var sheet=el("div",{cls:"dp",role:"dialog","aria-modal":"true","aria-label":"학과 고르기"},[el("div",{cls:"dp-grab","aria-hidden":"true"}),el("div",{cls:"dp-head"},[el("h2",{text:"학과 고르기"}),x]),srch,seg,list]);
    var bg=el("div",{cls:"dp-bg"},[sheet]);document.body.appendChild(bg);
    if(!RM)sheet.animate([{transformOrigin:"50% 100%",transform:"perspective(900px) translateY(100%) rotateX(16deg)"},{transformOrigin:"50% 100%",transform:"perspective(900px) translateY(0) rotateX(0)"}],{duration:420,easing:"cubic-bezier(.2,.9,.3,1)"});
    function close(){document.removeEventListener("keydown",esc);var fin=function(){bg.remove();field.focus()};if(RM)fin();else{sheet.animate([{transform:"none"},{transform:"translateY(100%)"}],{duration:200,easing:"cubic-bezier(.4,0,1,1)"}).onfinish=fin;bg.animate([{opacity:1},{opacity:0}],{duration:200})}}
    function esc(e){if(e.key==="Escape")close()}document.addEventListener("keydown",esc);
    x.onclick=close;bg.addEventListener("click",function(e){if(e.target===bg)close()});
    function pick(v){sel.value=v;sel.dispatchEvent(new Event("change",{bubbles:true}));paint();close()}
    function row(label,v,sub){var r=el("button",{cls:"opt-row",type:"button",role:"radio","aria-checked":String(sel.value===v)},[el("span",{text:label})]);if(sub)r.appendChild(el("small",{text:sub}));r.onclick=function(){pick(v)};return r}
    function draw(){seg.textContent="";seg.hidden=!!q;["충주","증평","의왕"].forEach(function(c){var n=DEPTS.filter(function(d){return d.c===c}).length;var b=el("button",{type:"button",role:"tab","aria-selected":String(camp===c),text:c+" "+n});b.onclick=function(){camp=c;draw();list.scrollTop=0};seg.appendChild(b)});
      list.textContent="";if(optional&&!q)list.appendChild(row("선택 안 함",""));
      var ds=DEPTS.filter(function(d){return q?d.n.replace(/\\s/g,"").indexOf(q)>=0:d.c===camp}),lastCol=null;
      if(!ds.length){list.appendChild(el("p",{cls:"dp-empty",text:"'"+q+"'에 맞는 학과가 없어요"}));return}
      ds.forEach(function(d){var g=(q?d.c+"캠퍼스 · ":"")+d.col;if(g!==lastCol){list.appendChild(el("div",{cls:"dp-col",text:g}));lastCol=g}list.appendChild(row(d.n,d.n))});
      if(!RM&&typeof stagger==="function")stagger([].slice.call(list.querySelectorAll(".opt-row")))}
    inp.addEventListener("input",function(){q=inp.value.replace(/\\s/g,"");draw()});
    draw();var on=$('.opt-row[aria-checked="true"]',list);if(on)on.scrollIntoView({block:"center"})}}
`;

for(const F of process.argv.slice(2)){let s=fs.readFileSync(F,"utf8");
  const rep=(a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(F+": expected 1 match, found "+n+": "+a.slice(0,60));s=s.replace(a,()=>b)};
  if(s.includes("/* ===== 학과 picker sheet"))throw new Error(F+": already applied");
  rep(`form.appendChild(el("label",{},[L[2],sel]));`,`form.appendChild(el("label",{},[L[2],sel]));if(typeof deptPicker==="function")deptPicker(sel);`);
  const M="@media (prefers-reduced-motion:reduce){*{transition:none!important}}";rep(M,CSS+"\n"+M);
  rep("/* ---------- connect db ---------- */",JS+"/* ---------- connect db ---------- */");
  fs.writeFileSync(F,s,"utf8");console.log("ok",F.slice(-30))}

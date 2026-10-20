// First-run "어떤 분이세요?" screen (login-style), home shows the chosen visitor's shortcuts, and no numbers on section titles.
const fs=require("fs"),path=require("path");const F=path.join(__dirname,"knut-tips.html");
let s=fs.readFileSync(F,"utf8");
function rep(a,b){if(s.split(a).length!==2)throw new Error("not unique ("+(s.split(a).length-1)+"): "+a.slice(0,90));s=s.replace(a,()=>b)}

const CSS=`
/* ===== no numbers on section titles ===== */
.stop-head h2::before{content:none!important;display:none!important}
/* ===== first-run visitor screen ===== */
.onboard{position:fixed;inset:0;z-index:60;display:flex;justify-content:center;background:rgba(10,20,60,.35)}
.ob-app{width:min(440px,100%);height:100%;display:flex;flex-direction:column;background:var(--page);overflow:auto}
@media (min-width:520px){.ob-app{margin:24px 0;height:calc(100% - 48px);border-radius:34px;box-shadow:0 30px 80px rgba(5,15,50,.45)}}
.ob-top{position:relative;flex:none;padding:28px 24px 64px;background:linear-gradient(180deg,var(--hero) 0%,var(--hero2) 100%);color:#fff;overflow:hidden}
.ob-top::after{content:"";position:absolute;right:-70px;top:-70px;width:240px;height:240px;border-radius:50%;background:rgba(255,255,255,.08)}
.ob-logo{display:flex;align-items:center;gap:8px;position:relative;z-index:1}
.ob-logo .en{font-family:"Fredoka","Jua",sans-serif;font-weight:700;font-size:24px;letter-spacing:-.01em}
.ob-logo .en i{font-style:normal;color:#ffd166;display:inline-block;transform:rotate(8deg)}
.ob-logo .ko{font-family:"Jua",sans-serif;font-size:14px;padding:2px 9px;border-radius:999px;background:rgba(255,255,255,.2)}
.ob-title{position:relative;z-index:1;margin:22px 0 0;font-size:27px;font-weight:700;line-height:1.3;letter-spacing:-.02em}
.ob-pill{position:relative;z-index:1;display:inline-flex;align-items:center;gap:6px;margin-top:12px;padding:5px 12px;border-radius:999px;background:rgba(255,255,255,.18);font-size:13px}
.ob-pill::before{content:"";width:8px;height:8px;border-radius:50%;background:#ffd166}
.ob-masc{position:relative;z-index:1;display:flex;justify-content:center;margin-top:8px}
.ob-masc svg{width:150px;height:150px}
.ob-sheet{position:relative;flex:1;margin-top:-36px;background:var(--card);border-radius:30px 30px 0 0;padding:26px 22px 28px;display:flex;flex-direction:column;gap:12px}
.ob-q{font-size:13px;font-weight:700;color:var(--mint-ink)}
.ob-h{margin:0;font-size:21px;font-weight:700;color:var(--t1)}
.ob-sub{margin:0;font-size:14px;color:var(--t3)}
.ob-opts{display:flex;flex-direction:column;gap:10px;margin-top:4px}
.ob-opt{display:flex;align-items:center;gap:12px;width:100%;padding:15px 16px;border-radius:16px;border:1.5px solid transparent;background:var(--chip);color:var(--t2);font:inherit;text-align:left;cursor:pointer}
.ob-opt::before{content:"";flex:none;width:22px;height:22px;border-radius:50%;border:2px solid #c9ced9;background:var(--card)}
.ob-opt b{font-size:16.5px;font-weight:700}
.ob-opt small{display:block;font-size:12.5px;color:var(--t3);margin-top:1px}
.ob-opt[aria-checked="true"]{background:var(--mint-bg);border-color:var(--mint);color:var(--mint-ink)}
.ob-opt[aria-checked="true"]::before{border-color:var(--mint);background:var(--mint) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M5 10.5l3.2 3L15 7' fill='none' stroke='white' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/16px no-repeat}
.ob-go{margin-top:8px;width:100%;padding:16px;border:0;border-radius:16px;background:var(--hero);color:#fff;font:inherit;font-size:17px;font-weight:700;cursor:pointer}
.ob-go:disabled{background:var(--chip);color:var(--t3);cursor:not-allowed}
.ob-skip{align-self:center;border:0;background:none;color:var(--t3);font:inherit;font-size:14px;text-decoration:underline;cursor:pointer;padding:6px}
/* home card after onboarding: shortcuts only */
#audBox .aud-tabs,#audBox .qbar{display:none!important}
#audBox .aud-change{margin-top:12px}
`;
rep(`@media (prefers-reduced-motion:reduce){*{transition:none!important}}`,CSS+`@media (prefers-reduced-motion:reduce){*{transition:none!important}}`);

rep(`/* ---------- connect db ---------- */`,`/* ---------- first-run visitor screen ---------- */
var AUD_SUB={student:"맛집, 이동, 과제, 장학금",parent:"장학금, 생활관, 통학, 취업률",staff:"식당, 교내 시설, 학생 지원",applicant:"학과 진로, 장학금, 생활 미리 보기"};
function openOnboard(){if($(".onboard"))return;var pick=store("onboarded")?audSel:null;
  var top=el("div",{cls:"ob-top"});var logo=el("div",{cls:"ob-logo"});logo.innerHTML='<span class="en">KNUT<i>!</i>P</span><span class="ko">넛팁</span>';top.appendChild(logo);
  var t=el("p",{cls:"ob-title"});t.appendChild(document.createTextNode("교통대 생활,"));t.appendChild(el("br"));t.appendChild(document.createTextNode("넛팁이 알려줄게요"));top.appendChild(t);
  top.appendChild(el("span",{cls:"ob-pill",text:"약 3초 · 질문 1개"}));var mm=el("div",{cls:"ob-masc"});mm.innerHTML=mascot("ob","wink");top.appendChild(mm);
  var go=el("button",{cls:"ob-go",type:"button",text:"넛팁 시작하기"});go.disabled=!pick;
  var opts=el("div",{cls:"ob-opts",role:"radiogroup","aria-label":"방문 목적"});
  AUD.forEach(function(a){var b=el("button",{cls:"ob-opt",type:"button",role:"radio","aria-checked":String(pick===a.id)},[el("span",{},[el("b",{text:a.n}),el("small",{text:AUD_SUB[a.id]})])]);
    b.onclick=function(){pick=a.id;$$(".ob-opt",opts).forEach(function(x){x.setAttribute("aria-checked","false")});b.setAttribute("aria-checked","true");go.disabled=false};opts.appendChild(b)});
  function finish(id){audSel=id;store("aud",id);store("onboarded",1);renderAud();var o=$(".onboard");if(o)o.remove();go_home()}
  function go_home(){go("home");window.scrollTo(0,0)}
  go.onclick=function(){if(pick)finish(pick)};
  var skip=el("button",{cls:"ob-skip",type:"button",text:"나중에 고를게요"});skip.onclick=function(){finish(pick||"student")};
  var sheet=el("div",{cls:"ob-sheet"},[el("div",{cls:"ob-q",text:"Q. 방문 목적"}),el("h2",{cls:"ob-h",text:"어떤 분이세요?"}),el("p",{cls:"ob-sub",text:"고르면 필요한 정보부터 모아서 보여 드려요."}),opts,go,skip]);
  var wrap=el("div",{cls:"onboard",role:"dialog","aria-modal":"true","aria-label":"방문 목적 선택"},[el("div",{cls:"ob-app"},[top,sheet])]);
  document.body.appendChild(wrap);var first=$(".ob-opt",wrap);if(first)first.focus()}
/* the home card now shows the chosen visitor's shortcuts and a way to change it */
var _renderAud=renderAud;renderAud=function(){_renderAud();var box=$("#audBox");if(!box)return;var cur=AUD.filter(function(a){return a.id===audSel})[0];
  var q=$(".qnum",box);if(q)q.textContent="방문 목적 · "+cur.n;var h=$(".survey-h h2",box);if(h)h.textContent=cur.n+" 맞춤 바로가기";var n=$(".survey-h .note",box);if(n)n.textContent=AUD_SUB[cur.id]+" 정보를 먼저 모았어요";
  if(!$(".aud-change",box)){var c=el("button",{cls:"btn small aud-change",type:"button",text:"방문 목적 바꾸기"});c.onclick=openOnboard;box.appendChild(c)}};
renderAud();
if(!store("onboarded"))openOnboard();
/* ---------- connect db ---------- */`);
fs.writeFileSync(F,s,"utf8");console.log("ok");

// Login flow like the earlier assignment site: pick an account type card -> login form -> enter.
// No passwords: the viewer's claude.ai sign-in is the identity; profile is saved privately (data/users/<id>/profile).
const fs=require("fs"),path=require("path");const F=path.join(__dirname,"knut-tips.html");
let s=fs.readFileSync(F,"utf8");
function rep(a,b){if(s.split(a).length!==2)throw new Error("not unique ("+(s.split(a).length-1)+"): "+a.slice(0,90));s=s.replace(a,()=>b)}

const CSS=`
/* ===== login (type cards -> form) ===== */
.lg-cards{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:6px}
.lg-card{display:flex;flex-direction:column;align-items:flex-start;gap:8px;padding:16px;border-radius:20px;border:1.5px solid var(--line);background:var(--card);color:var(--t1);font:inherit;text-align:left;cursor:pointer;box-shadow:0 4px 14px rgba(20,30,70,.06)}
.lg-card:hover,.lg-card:focus-visible{border-color:var(--hero)}
.lg-ban{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;color:#fff}
.lg-ban svg{width:24px;height:24px}
.lg-card b{font-size:16.5px}
.lg-card small{font-size:12.5px;color:var(--t3);line-height:1.4}
.lg-form{display:flex;flex-direction:column;gap:12px}
.lg-form label{display:flex;flex-direction:column;gap:6px;font-size:14px!important;color:var(--t2)!important;font-weight:600}
.lg-form input,.lg-form select{width:100%;border-radius:14px!important;background:var(--chip)!important;border:1.5px solid transparent!important;padding:14px 16px!important;font-size:16px!important;color:var(--t1)!important}
.lg-form input:focus,.lg-form select:focus{border-color:var(--hero)!important;outline:none}
.lg-back{align-self:flex-start;border:0;background:none;color:var(--t3);font:inherit;font-size:14px;cursor:pointer;padding:4px 0}
.lg-type{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:var(--mint-ink);background:var(--mint-bg);padding:4px 12px;border-radius:999px;align-self:flex-start}
.lg-note{font-size:12.5px;color:var(--t3);line-height:1.55;margin:0}
.lg-err{font-size:13px;color:var(--star);margin:0}
.acct{display:flex;align-items:center;gap:8px}
.acct-name{font-size:13px;font-weight:700;color:var(--t1);white-space:nowrap;max-width:110px;overflow:hidden;text-overflow:ellipsis}
.navrow{display:flex!important;align-items:center;gap:6px}
`;
rep(`@media (prefers-reduced-motion:reduce){*{transition:none!important}}`,CSS+`@media (prefers-reduced-motion:reduce){*{transition:none!important}}`);

/* replace the first-run screen with the login flow */
rep(`if(!store("onboarded"))openOnboard();`,`/* ---------- login ---------- */
var ACCT_COLOR={student:"#3b55e6",parent:"#2fb8a5",staff:"#8a1c1c",applicant:"#f0a020"};
var ACCT_ICON={student:"study",parent:"life",staff:"build",applicant:"dept"};
var ACCT_LOGIN={student:["학생 로그인","이름 · 학과로 로그인","학과"],parent:["학부모 로그인","이름 · 자녀 학과로 로그인","자녀 학과"],staff:["교직원 로그인","이름 · 소속으로 로그인","소속 (선택)"],applicant:["입학 지원자 로그인","이름 · 관심 학과로 로그인","관심 학과 (선택)"]};
var acct=store("acct")||null;
function applyAcct(a){acct=a;audSel=a.type;store("aud",a.type);
  if(a.dept){var d=DEPTS.filter(function(x){return x.n===a.dept})[0];if(d){myDept={n:d.n,c:d.c};store("myDept",myDept)}}
  renderAud();if(typeof GATE_TABS!=="undefined")GATE_TABS.forEach(renderGate);renderAcctBar()}
function renderAcctBar(){var nr=$(".navrow");if(!nr)return;var old=$(".acct",nr);if(old)old.remove();if(!acct)return;
  var out=el("button",{cls:"allmenu-btn",type:"button",text:"로그아웃"});out.onclick=logout;
  nr.insertBefore(el("div",{cls:"acct"},[el("span",{cls:"acct-name",text:acct.name+" 님"}),out]),nr.firstChild)}
function saveAcct(a){store("acct",a);if(db&&uid){db.doc("data/users/"+uid+"/profile").set(a).catch(function(){})}}
function logout(){acct=null;try{localStorage.removeItem("knut:acct")}catch(e){}if(db&&uid){db.doc("data/users/"+uid+"/profile").delete().catch(function(){})}renderAcctBar();openLogin()}
function openLogin(){if($(".onboard"))return;
  var top=el("div",{cls:"ob-top"});var logo=el("div",{cls:"ob-logo"});logo.innerHTML='<span class="en">KNUT<i>!</i>P</span><span class="ko">넛팁</span>';top.appendChild(logo);
  var t=el("p",{cls:"ob-title"});t.appendChild(document.createTextNode("교통대 생활,"));t.appendChild(el("br"));t.appendChild(document.createTextNode("넛팁이 알려줄게요"));top.appendChild(t);
  top.appendChild(el("span",{cls:"ob-pill",text:"로그인하고 맞춤 정보 보기"}));var mm=el("div",{cls:"ob-masc"});mm.innerHTML=mascot("ob","wink");top.appendChild(mm);
  var sheet=el("div",{cls:"ob-sheet"});
  function step1(){sheet.textContent="";sheet.appendChild(el("div",{cls:"ob-q",text:"LOGIN"}));sheet.appendChild(el("h2",{cls:"ob-h",text:"로그인할 계정 유형을 선택해 주세요"}));
    var cards=el("div",{cls:"lg-cards"});AUD.forEach(function(a){var c=el("button",{cls:"lg-card",type:"button"});var ban=el("span",{cls:"lg-ban",style:"background:"+ACCT_COLOR[a.id]});ban.innerHTML=svgI(ACCT_ICON[a.id]);
      c.appendChild(ban);c.appendChild(el("b",{text:ACCT_LOGIN[a.id][0]}));c.appendChild(el("small",{text:ACCT_LOGIN[a.id][1]}));c.onclick=function(){step2(a.id)};cards.appendChild(c)});
    sheet.appendChild(cards);sheet.appendChild(el("p",{cls:"lg-note",text:"비밀번호는 받지 않아요. 지금 쓰는 Claude 계정으로 본인을 확인하고, 입력한 정보는 나만 볼 수 있게 저장돼요."}));
    var f=$(".lg-card",cards);if(f)f.focus()}
  function step2(type){sheet.textContent="";var L=ACCT_LOGIN[type];
    var back=el("button",{cls:"lg-back",type:"button",text:"← 계정 유형 다시 고르기"});back.onclick=step1;
    var form=el("form",{cls:"lg-form"});var nm=el("input",{id:"lgName",required:"",maxlength:"20",autocomplete:"nickname",placeholder:"예: 고다은"});
    var sel=el("select",{id:"lgDept"});sel.appendChild(el("option",{value:"",text:type==="student"||type==="parent"?"학과를 골라 주세요":"선택 안 함"}));
    ["충주","증평","의왕"].forEach(function(c){var og=document.createElement("optgroup");og.label=c+"캠퍼스";DEPTS.filter(function(d){return d.c===c}).forEach(function(d){og.appendChild(el("option",{value:d.n,text:d.n}))});sel.appendChild(og)});
    var err=el("p",{cls:"lg-err",hidden:""});var loginBtn=el("button",{cls:"ob-go",type:"submit",text:"로그인"});
    form.appendChild(el("label",{},["이름",nm]));form.appendChild(el("label",{},[L[2],sel]));form.appendChild(err);form.appendChild(loginBtn);
    form.onsubmit=function(e){e.preventDefault();var name=nm.value.trim();if(!name){err.hidden=false;err.textContent="이름을 입력해 주세요.";return}
      if((type==="student"||type==="parent")&&!sel.value){err.hidden=false;err.textContent=L[2]+"를 골라 주세요.";return}
      var a={type:type,name:name.slice(0,20),dept:sel.value||"",at:new Date().toISOString()};saveAcct(a);store("onboarded",1);applyAcct(a);
      var o=$(".onboard");if(o)o.remove();go("home");window.scrollTo(0,0);toast(a.name+" 님, 환영해요")};
    sheet.appendChild(back);sheet.appendChild(el("span",{cls:"lg-type",text:L[0]}));sheet.appendChild(el("h2",{cls:"ob-h",text:"정보를 입력해 주세요"}));sheet.appendChild(form);
    sheet.appendChild(el("p",{cls:"lg-note",text:"이름은 화면 위쪽에 'OOO 님'으로만 쓰여요. 학과를 고르면 학업·진로 메뉴가 그 학과 기준으로 열려요."}));nm.focus()}
  step1();
  var wrap=el("div",{cls:"onboard",role:"dialog","aria-modal":"true","aria-label":"로그인"},[el("div",{cls:"ob-app"},[top,sheet])]);document.body.appendChild(wrap)}
/* the old "방문 목적 바꾸기" button now opens the login */
openOnboard=function(){logout()};
/* signed-in profile from the account store, when the page can reach it */
function loadAcct(){if(!db||!uid)return;db.doc("data/users/"+uid+"/profile").get().then(function(snap){if(snap.exists){var a=snap.data();if(a&&a.type&&a.name){store("acct",a);applyAcct(a);var o=$(".onboard");if(o)o.remove()}}else if(acct){saveAcct(acct)}}).catch(function(){})}
if(acct)applyAcct(acct);else openLogin();`);
rep(`text:"방문 목적 바꾸기"`,`text:"계정 유형 바꾸기"`);
rep(`    return (user?user.id():Promise.resolve(null)).then(function(id){uid=id;`,`    return (user?user.id():Promise.resolve(null)).then(function(id){uid=id;if(typeof loadAcct==="function")loadAcct();`);
fs.writeFileSync(F,s,"utf8");console.log("ok");

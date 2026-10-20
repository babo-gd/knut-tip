// Tip popup: show only the fields that mean something for that tip (no empty 위치/지도/이동수단/구간/준비물).
const fs=require("fs");
for(const F of process.argv.slice(2)){let s=fs.readFileSync(F,"utf8");
function rep(a,b){if(s.split(a).length!==2)throw new Error(F+" not unique ("+(s.split(a).length-1)+"): "+a.slice(0,70));s=s.replace(a,()=>b)}
rep(String.raw`var mapNode=t.map?el("a",{href:t.map,target:"_blank",rel:"noopener",text:t.map.replace(/^https?:\/\//,"")}):"확인 안 됨";
  [["이름",t.name],["위치",usable(t.loc)?t.loc:"확인 안 됨"],["지도",mapNode],["확인한 날",t.date],["추천 수",t.rec+"건"],["주제",t.topic],["이동수단",t.mode],["구간",t.range==="학교↔시내"?"시내와 학교":t.range],["준비물",t.prep]].forEach(function(r){dl.appendChild(el("dt",{text:r[0]}));dl.appendChild(el("dd",{},[r[1]]))});`,
String.raw`var mu=(t.map||"").match(/^https?:\/\/[^\s(]+/);var mapNode=mu?el("a",{href:mu[0],target:"_blank",rel:"noopener",text:mu[0].replace(/^https?:\/\//,"")}):null;
  [["이름",t.name],["위치",usable(t.loc)?t.loc:null],["지도",mapNode],["확인한 날",t.date],["추천 수",t.rec+"건"],["주제",t.topic],["이동수단",usable(t.mode)?t.mode:null],["구간",usable(t.range)?(t.range==="학교↔시내"?"시내와 학교":t.range):null],["준비물",usable(t.prep)?t.prep:null]].forEach(function(r){if(r[1]==null||r[1]==="")return;dl.appendChild(el("dt",{text:r[0]}));dl.appendChild(el("dd",{},[r[1]]))});`);
rep(String.raw`text:"학생 21명이 낸 원본을 정리한 자료예요. 확인 안 됨 = 원본에 없는 정보, 해당 없음 = 이 꿀팁에 맞지 않는 칸."`,`text:"학생 21명이 낸 원본을 정리한 자료예요. 원본에 없거나 이 꿀팁에 맞지 않는 칸은 뺐어요."`);
rep(String.raw`tags,el("span",{cls:"loc",text:usable(t.loc)?"위치: "+t.loc:"위치 확인 안 됨"})]);`,`tags,usable(t.loc)?el("span",{cls:"loc",text:"위치: "+t.loc}):null]);`);
fs.writeFileSync(F,s,"utf8");console.log("ok",F.slice(-28))}

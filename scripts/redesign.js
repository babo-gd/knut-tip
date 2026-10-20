// 1) 2026 학과 목록  2) 학식 창 (학교 식단 데이터)  3) 움직이는 실제 맛집 지도  4) 앱 전체 스킨
const fs=require("fs"),path=require("path");const F=path.join(__dirname,"knut-tips.html");const W=path.join(__dirname,"..","web");
let s=fs.readFileSync(F,"utf8");
function rep(a,b){if(s.split(a).length!==2)throw new Error("not unique ("+(s.split(a).length-1)+"): "+a.slice(0,90));s=s.replace(a,()=>b)}

/* ---------- 1) departments (ut.ac.kr 대학·대학원 pages, 2026-10-20) ---------- */
const OLD=s.slice(s.indexOf("var DEPTS=["),s.indexOf("];",s.indexOf("var DEPTS=["))+2);
const offOf=n=>{const m=OLD.match(new RegExp('n:"'+n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+'",h:"[^"]*"(,off:\\{.*\\})?\\},?\\n'));return m&&m[1]?m[1]:""};
const D=[
 ["충주","AI융합대학",[["컴퓨터공학과","/ce.do"],["컴퓨터소프트웨어학과","/sw.do"],["산업경영공학과","/ime.do","산업·경영안전공학부"],["산업디자인학과","/id.do"]]],
 ["충주","공과대학",[["기계공학과","/me.do"],["전기공학과","/electri.do"],["전자공학과","/electronics.do"],["건설환경도시교통공학부","/ceut.do","건설환경도시교통공학부"],["화공생물공학과","/chem.do"],["반도체신소재공학과","/dmse.do"],["나노화학소재공학과","/nano.do","화공신소재고분자공학부"],["안전공학과","/safeeng.do"],["건축공학과","/aec.do"],["건축학과(5년제)","/archi.do","건축학부"],["커뮤니케이션디자인학과","/designeng.do"],["나노메디컬공학부","/nanomed.do"]]],
 ["충주","교통공과대학",[["자동차공학과","/ae.do"],["항공모빌리티학부","/amde.do","기계자동차항공공학부"]]],
 ["충주","인문대학",[["영어영문학과","/depteng.do"],["중국어학과","/chinese.do"],["한국어문학과","/korean.do"],["음악학과","/music.do"],["스포츠의학과","/sportsmedi.do"],["스포츠산업학과","/sportsin.do"]]],
 ["충주","사회과학대학",[["행정학과","/knutpa.do"],["행정정보융합학과","/pmic.do"],["경영학과","/business.do"],["융합경영학과","/conv.do"],["국제무역학과","/trade.do"],["사회복지학과","/welfare.do"],["항공서비스학과","/tsm.do"],["항공운항학과","/aero.do","항공운항학과"],["미디어&콘텐츠학과","/media.do"]]],
 ["충주","미래융합대학",[["안전융합공학과","/ajyh.do"],["건설방재융합공학과","/cece.do"],["스포츠복지학과","/sportswel.do"],["복지·경영학과","/wnm.do"],["이차전지공학과","/sbe.do"]]],
 ["충주","다빈치대학",[["자유전공학부","/sls.do"],["창의융합학부","/convergence.do"]]],
 ["증평","보건생명대학",[["간호학과","/nursing.do"],["물리치료학과","/pt.do"],["응급구조학과","/paramedicine.do"],["식품생명학부","/food.do"],["유아특수교육학과","/ecse.do"],["IT응용융합학과","/itac.do"],["화장품산업학과","/cosmetics.do"],["천연물소재학과","/name.do"]]],
 ["증평","사회과학대학",[["유아교육학과","/ece.do"]]],
 ["의왕","철도대학",[["철도경영·물류학과","/railbiz.do"],["철도AI데이터공학부","/data.do"],["철도운전시스템공학과","/rose.do"],["철도차량시스템공학과","/rvehicle.do"],["철도인프라공학과","/rie.do"],["철도전기정보공학과","/rei.do"]]],
 ["의왕","미래융합대학",[["스마트철도교통공학과","/smart.do"]]]];
let rows=[];D.forEach(([c,col,list])=>list.forEach(([n,h,old])=>rows.push(' {c:"'+c+'",col:"'+col+'",n:"'+n+'",h:"'+h+'"'+(old?offOf(old):"")+"}")));
const NEW="var DEPTS=[\n"+rows.join(",\n")+"\n];\nvar DEPTS_AT=\"2026.10.20\";";
if(!/off:\{src:"건축학과/.test(NEW)||!/off:\{src:"항공·기계/.test(NEW))throw new Error("career data not carried over");
s=s.replace(OLD,()=>NEW);

/* ---------- 2) meals ---------- */
const parseStu=t=>(t||"").split(/\r?\n/).map(x=>x.trim()).filter(Boolean).map(x=>{const m=x.match(/^(.*?)\(([\d,]+)원\)$/);return m?[m[1],+m[2].replace(/,/g,"")]:[x,null]});
const m1=JSON.parse(fs.readFileSync(path.join(W,"mt01.json"),"utf8")),m2=JSON.parse(fs.readFileSync(path.join(W,"mt02.json"),"utf8")),ye=JSON.parse(fs.readFileSync(path.join(W,"yesung.json"),"utf8"));
const MEAL={got:"2026-10-20",days:{}};
m1.forEach(d=>{MEAL.days[d.mealDate]={stu:parseStu(d.topFood||d.koreaFood)}});
m2.forEach(d=>{const lines=(d.koreaFood||"").split(/\r?\n/).map(x=>x.trim()).filter(Boolean);MEAL.days[d.mealDate].staff=lines.filter(x=>!/이용시간/.test(x));const info=lines.find(x=>/이용시간/.test(x));if(info)MEAL.staffInfo=info.replace("이용시간: ","").replace(/\s*\/\s*/," · ").replace("~ ","~")});
Object.keys(ye).forEach(k=>{if(MEAL.days[k])MEAL.days[k].dorm=ye[k]});

/* ---------- 3) map data ---------- */
const MAP=JSON.parse(fs.readFileSync(path.join(W,"map.json"),"utf8"));const LOC=JSON.parse(fs.readFileSync(path.join(W,"loc.json"),"utf8"));
const PLL={};Object.keys(LOC).forEach(k=>PLL[k]=[LOC[k].lat,LOC[k].lon]);

/* meal section in 학교생활: show the menu itself */
s=s.replace(/<p class="note">메뉴는 매일 바뀌어서 학교 공식 식단표로 연결해요\.<\/p>\s*<div class="grid">[\s\S]*?생활관 식단 보기<\/a><\/p><\/div>\s*<\/div>/,()=>'<div id="mealView"></div>');
if(!s.includes('<div id="mealView"></div>'))throw new Error("meal block not replaced");
rep('["meal","오늘 학식",function(){jumpTo("life","오늘의 학식")}]','["meal","오늘 학식",function(){openMeal()}]');

const CSS=fs.readFileSync(path.join(__dirname,"redesign.css"),"utf8");
rep(`@media (prefers-reduced-motion:reduce){*{transition:none!important}}`,CSS+`\n@media (prefers-reduced-motion:reduce){*{transition:none!important}}`);

const JS=fs.readFileSync(path.join(__dirname,"redesign.client.js"),"utf8")
  .replace("__MEAL__",()=>JSON.stringify(MEAL)).replace("__MAP__",()=>JSON.stringify(MAP)).replace("__PLL__",()=>JSON.stringify(PLL));
rep(`/* ---------- connect db ---------- */`,JS+`\n/* ---------- connect db ---------- */`);
fs.writeFileSync(F,s,"utf8");console.log("ok",s.length);

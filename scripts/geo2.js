const fs=require("fs");const g=require("./web/geo.json");const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function q(p){const r=await fetch("https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=kr&"+new URLSearchParams(p),{headers:{"User-Agent":"knut-tips-class-project/1.0","Accept-Language":"ko"}});await sleep(1100);const j=await r.json();return j[0]?{lat:+j[0].lat,lon:+j[0].lon,dn:j[0].display_name}:null}
(async()=>{const T=[["x053",{street:"황토골3길",city:"충주시"}],["x075",{street:"쇠저울1길",city:"충주시"}],["x077",{street:"호암토성5길",city:"충주시"}],["x087",{q:"봉방동, 충주시"}],["x034",{q:"대학로, 대소원면, 충주시"}],["KNUT",{q:"한국교통대학교 충주캠퍼스"}],["KNUT2",{q:"국립한국교통대학교"}]];
for(const [id,p] of T){const r=await q(p);console.log(id,r&&r.dn);if(r)g[id]={...r,lvl:id.startsWith("x0")&&!p.street?"area":"street"}}
fs.writeFileSync("web/geo.json",JSON.stringify(g,null,1));
const v=Object.entries(g).filter(e=>e[1].lat);const la=v.map(e=>e[1].lat),lo=v.map(e=>e[1].lon);console.log(Math.min(...la),Math.max(...la),Math.min(...lo),Math.max(...lo));
v.filter(e=>e[1].lat<36.9||e[1].lat>37.1||e[1].lon<127.75||e[1].lon>128.05).forEach(e=>console.log("OUT",e[0],e[1].dn))})();

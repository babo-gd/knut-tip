// Geocode the 맛집 addresses with OpenStreetMap Nominatim (1 request per second, per its usage policy).
const fs=require("fs"),path=require("path");
const P=JSON.parse(fs.readFileSync(path.join(__dirname,"web/places.json"),"utf8"));
const OUT=path.join(__dirname,"web/geo.json");
const geo=fs.existsSync(OUT)?JSON.parse(fs.readFileSync(OUT,"utf8")):{};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function q(params){
  const u="https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=kr&"+new URLSearchParams(params);
  const r=await fetch(u,{headers:{"User-Agent":"knut-tips-class-project/1.0 (student map, one-off geocode)","Accept-Language":"ko"}});
  await sleep(1100);if(!r.ok)return null;const j=await r.json();return j[0]?{lat:+j[0].lat,lon:+j[0].lon,dn:j[0].display_name}:null}
(async()=>{
  for(const p of P){if(geo[p.id]||!p.addr)continue;
    const m=p.addr.match(/((?:[가-힣]+면\s)?)([가-힣0-9]+(?:대로|로|길)(?:\s?\d+(?:번)?길)?)\s+(\d+(?:-\d+)?)/);
    let r=null,lvl="";
    if(m){r=await q({street:m[3]+" "+m[2],city:"충주시",state:"충청북도"});lvl="addr";
      if(!r){r=await q({q:m[2]+" "+m[3]+", 충주시"});lvl="addr-q"}
      if(!r){r=await q({street:m[2],city:"충주시",state:"충청북도"});lvl="street"}}
    if(!r){r=await q({q:p.name.replace(/\s.*(점|본점)$/,"")+" 충주"});lvl="name"}
    geo[p.id]=r?{...r,lvl}:{lvl:"none"};console.log(p.id,p.name,lvl,r?r.dn.slice(0,60):"-");
    fs.writeFileSync(OUT,JSON.stringify(geo,null,1))}
  console.log("done")})();

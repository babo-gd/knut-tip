const fs=require("fs");
const Q1=`[out:json][timeout:120];
(way["highway"~"^(motorway|trunk|primary|secondary|tertiary|unclassified|residential|motorway_link|trunk_link|primary_link|secondary_link|living_street|pedestrian|service)$"](36.935,127.78,37.04,127.975);
 way["natural"="water"](36.90,127.75,37.08,128.02);relation["natural"="water"](36.90,127.75,37.08,128.02);
 way["waterway"~"^(river|stream|canal)$"](36.90,127.75,37.08,128.02);
 way["railway"="rail"](36.90,127.75,37.08,128.02);
 way["leisure"~"^(park|golf_course|stadium)$"](36.935,127.78,37.04,127.975);
 way["landuse"~"^(forest|grass|meadow|farmland)$"](36.935,127.78,37.04,127.975);
 way["natural"="wood"](36.935,127.78,37.04,127.975);
 way["amenity"="university"](36.935,127.78,37.04,127.975);
);out geom;`;
const P=require("./web/places.json");const roads=new Set();P.forEach(p=>{const m=(p.addr||"").match(/([가-힣0-9]+(?:대로|로|길)(?:\s?\d+(?:번)?길)?)\s+\d/);if(m)roads.add(m[1])});
const Q2=`[out:json][timeout:120];(way["highway"]["name"~"^(${[...roads].join("|")})$"](36.80,127.65,37.15,128.10););out geom;`;
const Q3=`[out:json][timeout:60];(node["name"]["amenity"~"restaurant|cafe|fast_food|bar|pub"](36.90,127.75,37.08,128.02);node["name"]["shop"~"bakery|deli|coffee"](36.90,127.75,37.08,128.02);way["name"]["amenity"~"restaurant|cafe|fast_food"](36.90,127.75,37.08,128.02););out center;`;
(async()=>{for(const [n,q] of [["base",Q1],["roads",Q2],["pois",Q3]]){
  const r=await fetch("https://overpass-api.de/api/interpreter",{method:"POST",headers:{"User-Agent":"knut-tips-class-project/1.0","Content-Type":"application/x-www-form-urlencoded"},body:"data="+encodeURIComponent(q)});
  const t=await r.text();fs.writeFileSync("web/ov_"+n+".json",t);console.log(n,r.status,t.length)}})();

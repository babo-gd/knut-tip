// Bake an OpenStreetMap extract into compact SVG path layers (1 unit = 4 m).
const fs=require("fs");const E=JSON.parse(fs.readFileSync("web/ov_base.json","utf8")).elements;
const LON0=127.78,LAT0=37.04,LON1=127.975,LAT1=36.935,U=4;
const X=lon=>(lon-LON0)*89100/U,Y=lat=>(LAT0-lat)*111000/U;const W=Math.round(X(LON1)),H=Math.round(Y(LAT1));
function dp(pts,eps){if(pts.length<3)return pts;let i0=0,dm=0;const [a,b]=[pts[0],pts[pts.length-1]];
  for(let i=1;i<pts.length-1;i++){const p=pts[i];const dx=b[0]-a[0],dy=b[1]-a[1];const l=Math.hypot(dx,dy)||1;const d=Math.abs(dy*p[0]-dx*p[1]+b[0]*a[1]-b[1]*a[0])/l;if(d>dm){dm=d;i0=i}}
  if(dm>eps){const l=dp(pts.slice(0,i0+1),eps),r=dp(pts.slice(i0),eps);return l.slice(0,-1).concat(r)}return [a,b]}
const inb=g=>g.some(p=>p.lon>=LON0-0.01&&p.lon<=LON1+0.01&&p.lat>=LAT1-0.01&&p.lat<=LAT0+0.01);
function path(g,eps,close){let pts=g.map(p=>[X(p.lon),Y(p.lat)]);pts=dp(pts,eps);if(pts.length<2)return "";
  let s="M"+Math.round(pts[0][0])+" "+Math.round(pts[0][1]);let px=Math.round(pts[0][0]),py=Math.round(pts[0][1]);
  for(let i=1;i<pts.length;i++){const x=Math.round(pts[i][0]),y=Math.round(pts[i][1]);if(x===px&&y===py)continue;s+="l"+(x-px)+" "+(y-py);px=x;py=y}return s+(close?"z":"")}
const L={green:[],water:[],river:[],stream:[],rail:[],uni:[],motor:[],major:[],minor:[],local:[],service:[]};
const CLS={motorway:"motor",trunk:"motor",motorway_link:"motor",trunk_link:"motor",primary:"major",secondary:"major",primary_link:"major",secondary_link:"major",tertiary:"minor",unclassified:"local",residential:"local",living_street:"local",pedestrian:"local",service:"service"};
const names={};
E.forEach(e=>{const t=e.tags||{};
  const geoms=e.type==="relation"?(e.members||[]).filter(m=>m.role==="outer"&&m.geometry).map(m=>m.geometry):e.geometry?[e.geometry]:[];
  geoms.forEach(g=>{if(!inb(g))return;
    if(t.highway){const c=CLS[t.highway];if(!c)return;if(c==="service"){const KN=g.some(p=>Math.abs(p.lat-36.968)<0.006&&Math.abs(p.lon-127.871)<0.007);if(!KN)return}
      L[c].push(path(g,c==="local"||c==="service"?1.6:1.2,false));if(t.name&&(c==="major"||c==="motor"))(names[t.name]=names[t.name]||[]).push(g)}
    else if(t.natural==="water")L.water.push(path(g,2,true));
    else if(t.waterway==="river"||t.waterway==="canal")L.river.push(path(g,2,false));
    else if(t.waterway==="stream")L.stream.push(path(g,2.5,false));
    else if(t.railway==="rail")L.rail.push(path(g,2,false));
    else if(t.amenity==="university")L.uni.push(path(g,1.5,true));
    else L.green.push(path(g,3,true))})});
const out={W,H,LON0,LAT0,U,layers:{}};let tot=0;for(const k in L){out.layers[k]=L[k].join("");tot+=out.layers[k].length;console.log(k,L[k].length,out.layers[k].length)}
fs.writeFileSync("web/map.json",JSON.stringify(out));console.log("W,H",W,H,"total",tot);
console.log(Object.keys(names).slice(0,40).join(", "));

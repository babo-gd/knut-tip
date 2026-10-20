// Coordinates v3: POI match > road-number position on the local road axis (numbers ~10 m apart, west->east / south->north), calibrated with anchors.
const fs=require("fs");const P=require("./web/places.json");const G=require("./web/geo.json");
const pois=JSON.parse(fs.readFileSync("web/ov_pois.json","utf8")).elements.map(e=>({n:e.tags.name,lat:e.lat||e.center.lat,lon:e.lon||e.center.lon}));
const rd=JSON.parse(fs.readFileSync("web/ov_roads.json","utf8")).elements.filter(w=>w.geometry);
const R=6371000,rad=x=>x*Math.PI/180;function dist(a,b){const dl=rad(b.lat-a.lat),dn=rad(b.lon-a.lon);const h=Math.sin(dl/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(h))}
const norm=s=>s.replace(/\s|\(.*?\)|[-·,&]/g,"").toLowerCase();
const KNUT={lat:G.KNUT2.lat,lon:G.KNUT2.lon},CITY={lat:36.9790,lon:127.9300};
const parse=a=>{const m=(a||"").match(/([가-힣0-9]+(?:대로|로|길)(?:\s?\d+(?:번)?길)?)\s+(\d+)(?:-(\d+))?/);return m?{road:m[1].replace(/\s/g,""),n:+m[2]}:null};
const RANK={motorway:9,trunk:8,primary:7,secondary:6,tertiary:5,unclassified:4,residential:3,living_street:2,service:1};
const poiOf={};
P.forEach(p=>{const nm=norm(p.name.replace(/\s(충주|교통대|한국교통대|충주교통대|충주한국교통대|서충주)?\S*점$/,""));if(nm.length<2)return;
  const ref=p.area==="near"?KNUT:CITY;
  const hits=pois.filter(o=>{const on=norm(o.n);return on===nm||on.startsWith(nm)||(nm.startsWith(on)&&on.length>=3)}).sort((a,b)=>dist(a,ref)-dist(b,ref));
  if(hits.length&&dist(hits[0],ref)<(p.area==="near"?3000:12000))poiOf[p.id]=hits[0]});
const anchors={};const add=(road,n,pt)=>{(anchors[road]=anchors[road]||[]).push({n,pt})};
P.forEach(p=>{const a=parse(p.addr);if(a&&poiOf[p.id])add(a.road,a.n,poiOf[p.id])});
add("대학로",50,{lat:36.9719,lon:127.8712});
// 대학로 meets 중원대로 at its south end; 중원대로 numbers fall toward 호암동 (3250)
const J={lat:36.9628,lon:127.8707};
function locate(road,n,ref,Rm){const ws=rd.filter(w=>w.tags.name===road&&w.geometry.some(p=>dist(p,ref)<Rm));if(!ws.length)return null;
  const top=Math.max(...ws.map(w=>RANK[w.tags.highway]||0));let use=ws.filter(w=>(RANK[w.tags.highway]||0)===top);
  let pts=use.flatMap(w=>w.geometry).filter(p=>dist(p,ref)<Rm);if(pts.length<2)pts=ws.flatMap(w=>w.geometry).filter(p=>dist(p,ref)<Rm);if(pts.length<2)return null;
  const m={lat:pts.reduce((t,p)=>t+p.lat,0)/pts.length,lon:pts.reduce((t,p)=>t+p.lon,0)/pts.length};
  const xy=p=>[(p.lon-m.lon)*89000,(p.lat-m.lat)*111000];
  let sxx=0,syy=0,sxy=0;pts.forEach(p=>{const [x,y]=xy(p);sxx+=x*x;syy+=y*y;sxy+=x*y});
  const th=0.5*Math.atan2(2*sxy,sxx-syy);let ax=[Math.cos(th),Math.sin(th)];
  if(Math.abs(ax[0])>=Math.abs(ax[1])?ax[0]<0:ax[1]<0)ax=[-ax[0],-ax[1]];
  const S=p=>{const [x,y]=xy(p);return x*ax[0]+y*ax[1]};
  const ss=pts.map(S),smin=Math.min(...ss),smax=Math.max(...ss);
  let an=(anchors[road]||[]).filter(a=>dist(a.pt,ref)<Rm*1.5).map(a=>({n:a.n,s:S(a.pt)}));
  let A,B=10;
  if(road==="중원대로"&&dist(ref,KNUT)<4000){const sj=S(J),sh=S({lat:36.9585,lon:127.9245});B=sh<sj?10:-10;A=sj-B*4100}
  else if(an.length>=2){const mn=an.reduce((t,x)=>t+x.n,0)/an.length,ms=an.reduce((t,x)=>t+x.s,0)/an.length;let num=0,den=0;an.forEach(x=>{num+=(x.n-mn)*(x.s-ms);den+=(x.n-mn)**2});B=den&&num<0?-10:10;A=ms-B*mn}
  else if(an.length===1){A=an[0].s-B*an[0].n}
  else{A=smin}
  const s=Math.max(smin,Math.min(smax,A+B*n));let bi=0,bd=1e18;pts.forEach((p,i)=>{const d=Math.abs(ss[i]-s);if(d<bd){bd=d;bi=i}});return pts[bi]}
const out={};
P.forEach(p=>{let r=null,how="";
  if(poiOf[p.id]){r=poiOf[p.id];how="poi"}
  const a=parse(p.addr);
  if(!r&&a){const g=G[p.id]&&G[p.id].lat?G[p.id]:null;
    const ref=p.area==="near"?(a.road==="중원대로"?J:KNUT):(g&&dist(g,CITY)<9000?g:CITY);
    r=locate(a.road,a.n,ref,p.area==="near"?2500:3500);if(r)how="road"}
  if(r&&p.area==="near"&&dist(r,KNUT)>4500)r=null;
  if(r&&p.area!=="near"&&dist(r,CITY)>13000)r=null;
  if(!r&&G[p.id]&&G[p.id].lat&&dist(G[p.id],p.area==="near"?KNUT:CITY)<(p.area==="near"?4000:13000)){r=G[p.id];how="street"}
  if(!r){r=p.id==="x087"&&G.x087?G.x087:p.area==="near"?{lat:36.9640,lon:127.8705}:CITY;how="guess"}
  out[p.id]={lat:+(+r.lat).toFixed(6),lon:+(+r.lon).toFixed(6),how}});
fs.writeFileSync("web/loc.json",JSON.stringify(out));
const c={};Object.values(out).forEach(x=>c[x.how]=(c[x.how]||0)+1);console.log(c);
P.forEach(p=>{const o=out[p.id];if(p.area!=="city")console.log(p.id,p.area,(p.addr||"").replace("충북 충주시 ","").slice(0,22).padEnd(22),o.how.padEnd(6),o.lat,o.lon)});

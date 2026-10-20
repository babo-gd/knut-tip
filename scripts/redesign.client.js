/* ---------- 학식: school menu data shown in the app ---------- */
var MEAL=__MEAL__;
var WK=["일","월","화","수","목","금","토"];
var mealDay=null,mealCaf=store("mealCaf")||"stu",dormSlot=null;
function mealDates(){return Object.keys(MEAL.days).sort()}
function pickMealDay(){var ds=mealDates(),t=todayStr();if(ds.indexOf(t)>=0)return t;if(t<ds[0])return ds[0];return ds.filter(function(d){return d<=t}).pop()||ds[0]}
function md(d){var x=new Date(d+"T00:00:00");return {m:x.getMonth()+1,d:x.getDate(),w:WK[x.getDay()]}}
function defaultSlot(){var h=new Date().getHours();return h<10?"조식":h<14?"중식":"석식"}
function mealRows(list){var ul=el("div",{cls:"ml-list"});list.forEach(function(it,i){var row=el("div",{cls:"ml-row"+(i===0?" first":"")},[el("span",{cls:"ml-nm",text:it[0]})]);if(it[1]!=null)row.appendChild(el("span",{cls:"ml-pr",text:it[1].toLocaleString("ko-KR")+"원"}));ul.appendChild(row)});return ul}
function renderMeal(box){if(!box)return;box.textContent="";if(!mealDay)mealDay=pickMealDay();if(!dormSlot)dormSlot=defaultSlot();
  var ds=mealDates(),a=md(ds[0]),b=md(ds[ds.length-1]),t=todayStr();
  var head=el("div",{cls:"ml-head"},[el("span",{cls:"ml-wk",text:a.m+"월 "+a.d+"일 ~ "+b.m+"월 "+b.d+"일 식단"}),el("span",{cls:"ml-src",text:"학교 홈페이지 기준"})]);box.appendChild(head);
  if(ds.indexOf(t)<0)box.appendChild(el("p",{cls:"ml-warn",text:"오늘 식단은 아직 없어요. 가장 가까운 날의 식단을 보여 드려요."}));
  var days=el("div",{cls:"ml-days",role:"tablist","aria-label":"요일"});
  ds.forEach(function(d){var x=md(d);var bt=el("button",{type:"button",role:"tab","aria-selected":String(d===mealDay),cls:d===t?"today":""},[el("span",{cls:"w",text:x.w}),el("span",{cls:"d",text:String(x.d)})]);bt.onclick=function(){mealDay=d;renderMeal(box)};days.appendChild(bt)});box.appendChild(days);
  var seg=el("div",{cls:"seg",role:"tablist","aria-label":"식당"});[["stu","학생식당"],["staff","교직원식당"],["dorm","생활관"]].forEach(function(c){var bt=el("button",{type:"button",role:"tab","aria-selected":String(mealCaf===c[0]),text:c[1]});bt.onclick=function(){mealCaf=c[0];store("mealCaf",c[0]);renderMeal(box)};seg.appendChild(bt)});box.appendChild(seg);
  var day=MEAL.days[mealDay]||{},card=el("div",{cls:"ml-card"});
  if(mealCaf==="stu"){card.appendChild(el("div",{cls:"ml-ch"},[el("b",{text:"학생식당"}),el("span",{text:"대학본부 1층 · 일품 코너"})]));
    if(day.stu&&day.stu.length)card.appendChild(mealRows(day.stu));else card.appendChild(el("p",{cls:"ml-empty",text:"이 날은 등록된 메뉴가 없어요."}))}
  else if(mealCaf==="staff"){card.appendChild(el("div",{cls:"ml-ch"},[el("b",{text:"교직원식당"}),el("span",{text:"대학본부 3층 · "+(MEAL.staffInfo||"백반정식")})]));
    if(day.staff&&day.staff.length){var chips=el("div",{cls:"ml-chips"});day.staff.forEach(function(x,i){chips.appendChild(el("span",{cls:i===0?"main":"",text:x}))});card.appendChild(chips)}else card.appendChild(el("p",{cls:"ml-empty",text:"이 날은 등록된 메뉴가 없어요."}))}
  else{card.appendChild(el("div",{cls:"ml-ch"},[el("b",{text:"생활관 식당"}),el("span",{text:"예성관리동 · 충주생활관"})]));
    var sl=el("div",{cls:"ml-slots"});["조식","중식","석식"].forEach(function(k){var bt=el("button",{type:"button","aria-pressed":String(dormSlot===k),text:k});bt.onclick=function(){dormSlot=k;renderMeal(box)};sl.appendChild(bt)});card.appendChild(sl);
    var dm=day.dorm||{};if(dm.tag&&dm.tag[dormSlot])card.appendChild(el("span",{cls:"ml-tag",text:dm.tag[dormSlot]}));
    if(dm[dormSlot]){var ch=el("div",{cls:"ml-chips"});dm[dormSlot].forEach(function(x,i){ch.appendChild(el("span",{cls:i===1?"main":"",text:x}))});card.appendChild(ch)}else card.appendChild(el("p",{cls:"ml-empty",text:"이 날은 등록된 메뉴가 없어요."}));
    card.appendChild(el("p",{cls:"ml-note",text:"월~목 중식·석식은 기숙사생 의무식(4,200원), 조식과 금요일은 식권 판매식(4,600원)이에요. 금요일 석식은 17:30~18:25."}))}
  box.appendChild(card);
  var x=md(MEAL.got);box.appendChild(el("p",{cls:"ml-foot",text:x.m+"월 "+x.d+"일에 학교 홈페이지 식단을 가져왔어요. 식재료 사정으로 바뀔 수 있어요."}))}
var mealHolder=null;
function openMeal(origin){if(!mealHolder){mealHolder=el("div",{cls:"hb-store"});var v=el("div",{cls:"meal-sheet"});mealHolder.appendChild(v);document.body.appendChild(mealHolder)}
  renderMeal($(".meal-sheet",mealHolder));openSheet({title:"오늘의 학식",node:mealHolder,icon:"meal",color:"#2fb8a5",origin:origin||null})}
renderMeal($("#mealView"));
/* home: the meal card opens the menu instead of the school site */
(function(){var old=$(".row2 a.card.mini");if(!old)return;var d=MEAL.days[pickMealDay()]||{};var first=(d.stu&&d.stu[3])?d.stu[3][0]:(d.staff&&d.staff[1])||"";
  var b=el("button",{cls:"card mini meal-mini",type:"button"},[el("span",{cls:"k",text:"오늘의 학식"}),el("span",{cls:"v",text:first||"메뉴 보기"}),el("span",{cls:"s",text:"학생식당 · 교직원 · 생활관"})]);b.onclick=function(){openMeal(b)};old.replaceWith(b)})();

/* ---------- 맛집: real, movable map ---------- */
var MAPD=__MAP__,PLL=__PLL__;
var FM={cx:0,cy:0,s:1,list:[],a:{},sel:null,pos:{},box:null};
function llXY(lat,lon){return [(lon-MAPD.LON0)*89100/MAPD.U,(MAPD.LAT0-lat)*111000/MAPD.U]}
var AREA_LL={near:[36.9652,127.8714],city:[36.9750,127.9290],view:[37.0050,127.8350],unk:[36.9652,127.8714]};
var MAP_LABELS=[["교통대 충주캠퍼스",36.9706,127.8693,0,5,"big"],["충주 시내",36.9765,127.9300,1.2,12,"big"],["연수동",36.9880,127.9390,0,2.5,""],["호암동",36.9545,127.9300,0,2.5,""],["중앙탑",37.0170,127.8610,0,5,""],["서충주",36.9880,127.8290,0,5,""],["주덕읍",36.9720,127.7980,0,6,""],["대소원면",36.9570,127.8800,0.9,5,""]];
function fmPositions(list){var pos={},seen={};list.forEach(function(p){var ll=PLL[p.id]||AREA_LL[p.area]||AREA_LL.near;var xy=llXY(ll[0],ll[1]);
    var k=Math.round(xy[0]/4)+","+Math.round(xy[1]/4);var n=seen[k]=(seen[k]||0)+1;if(n>1){var ang=n*2.39996,r=5*Math.sqrt(n-1);xy=[xy[0]+Math.cos(ang)*r,xy[1]+Math.sin(ang)*r]}pos[p.id]=xy});return pos}
function fmColor(p){var r=p.rec||0;return r>=5?"hot":r>=2?"mid":"low"}
function buildFoodMap(){var box=$("#foodMapBox");if(!box||FM.box)return;FM.box=box;box.textContent="";box.classList.add("fm-wrap");
  var NS="http://www.w3.org/2000/svg";var svg=document.createElementNS(NS,"svg");svg.setAttribute("class","fm-svg");svg.setAttribute("aria-hidden","true");
  var order=[["green","fill"],["uni","fill"],["water","fill"],["river","river"],["stream","stream"],["service","road"],["local","road"],["minor","road"],["major","road"],["motor","road"],["rail","rail"]];
  order.forEach(function(o){var d=MAPD.layers[o[0]];if(!d)return;if(o[1]==="road"){var c=document.createElementNS(NS,"path");c.setAttribute("d",d);c.setAttribute("class","c-"+o[0]+" case");svg.appendChild(c)}
    var pth=document.createElementNS(NS,"path");pth.setAttribute("d",d);pth.setAttribute("class","l-"+o[0]);svg.appendChild(pth)});
  $$("path",svg).forEach(function(p){if(!/l-green|l-uni|l-water|l-river/.test(p.getAttribute("class")))p.setAttribute("vector-effect","non-scaling-stroke")});
  var stage=el("div",{cls:"fm-stage"});stage.appendChild(svg);var lbls=el("div",{cls:"fm-labels","aria-hidden":"true"});var pins=el("div",{cls:"fm-pins"});stage.appendChild(lbls);stage.appendChild(pins);
  MAP_LABELS.forEach(function(L){var xy=llXY(L[1],L[2]);var t=el("span",{cls:"fm-lbl "+L[5],text:L[0]});t._xy=xy;t._r=[L[3],L[4]];lbls.appendChild(t)});
  var seg=el("div",{cls:"fm-seg",role:"group","aria-label":"구역"});
  AREAS.forEach(function(x){var b=el("button",{type:"button","aria-pressed":String(area===x[0]),text:x[1]});b.onclick=function(){area=x[0];store("area",x[0]);$$("button",seg).forEach(function(y){y.setAttribute("aria-pressed",String(y===b))});FM.fitNext=true;renderFood()};seg.appendChild(b)});
  var ctl=el("div",{cls:"fm-ctl"});function cb(lbl,svgp,fn){var b=el("button",{type:"button","aria-label":lbl});b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+svgp+'</svg>';b.onclick=fn;ctl.appendChild(b)}
  cb("확대",'<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',function(){fmZoom(1/1.8)});
  cb("축소",'<path d="M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',function(){fmZoom(1.8)});
  cb("교통대로 이동",'<circle cx="12" cy="12" r="3.2" fill="currentColor"/><circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',function(){var xy=llXY(36.9657,127.8712);fmFly(xy[0],xy[1],0.5)});
  var cnt=el("div",{cls:"fm-count",text:""});
  var hint=el("div",{cls:"fm-hint",text:"끌어서 움직이고, 두 손가락이나 휠로 확대해요"});
  box.appendChild(stage);box.appendChild(seg);box.appendChild(ctl);box.appendChild(cnt);box.appendChild(hint);
  var cards=el("div",{cls:"fm-cards",id:"fmCards"});box.parentNode.insertBefore(cards,box.nextSibling);
  var lb=el("button",{cls:"fm-listbtn",type:"button"},[el("span",{text:"목록으로 전체 보기"}),el("small",{id:"fmListN",text:""})]);cards.parentNode.insertBefore(lb,cards.nextSibling);
  lb.onclick=function(){openSheet({title:"맛집 전체 목록",node:FM.listStore,icon:"food",color:"#f0607a",origin:lb})};
  FM.svg=svg;FM.stage=stage;FM.pins=pins;FM.lbls=lbls;FM.cnt=cnt;FM.cards=cards;
  var start=llXY(36.9657,127.8712);FM.cx=start[0];FM.cy=start[1];FM.s=0.5;
  /* pan / pinch / wheel */
  var pts={},drag=null,moved=false;
  stage.addEventListener("pointerdown",function(e){pts[e.pointerId]={x:e.clientX,y:e.clientY};moved=false;var k=Object.keys(pts);
    drag={cx:FM.cx,cy:FM.cy,s:FM.s,p:JSON.parse(JSON.stringify(pts)),x:e.clientX,y:e.clientY};hint.classList.add("gone")});
  stage.addEventListener("pointermove",function(e){if(!pts[e.pointerId]||!drag)return;pts[e.pointerId]={x:e.clientX,y:e.clientY};var k=Object.keys(pts);
    if(k.length===1){var dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!moved&&Math.hypot(dx,dy)<6)return;if(!moved){moved=true;try{stage.setPointerCapture(e.pointerId)}catch(_){}}FM.cx=drag.cx-dx*FM.s;FM.cy=drag.cy-dy*FM.s;fmDraw()}
    else if(k.length===2&&drag.p[k[0]]&&drag.p[k[1]]){moved=true;var a0=drag.p[k[0]],b0=drag.p[k[1]],a1=pts[k[0]],b1=pts[k[1]];var d0=Math.hypot(a0.x-b0.x,a0.y-b0.y)||1,d1=Math.hypot(a1.x-b1.x,a1.y-b1.y)||1;
      var r=stage.getBoundingClientRect();var mx0=(a0.x+b0.x)/2-r.left-r.width/2,my0=(a0.y+b0.y)/2-r.top-r.height/2,mx1=(a1.x+b1.x)/2-r.left-r.width/2,my1=(a1.y+b1.y)/2-r.top-r.height/2;
      var ns=fmClampS(drag.s*d0/d1);var wx=drag.cx+mx0*drag.s,wy=drag.cy+my0*drag.s;FM.s=ns;FM.cx=wx-mx1*ns;FM.cy=wy-my1*ns;fmDraw()}});
  function up(e){delete pts[e.pointerId];var k=Object.keys(pts);if(k.length){drag={cx:FM.cx,cy:FM.cy,s:FM.s,p:JSON.parse(JSON.stringify(pts)),x:pts[k[0]].x,y:pts[k[0]].y}}else{drag=null;fmCardsSoon()}}
  stage.addEventListener("pointerup",up);stage.addEventListener("pointercancel",up);
  stage.addEventListener("click",function(e){if(moved){e.stopPropagation();e.preventDefault();moved=false}},true);
  stage.addEventListener("wheel",function(e){e.preventDefault();var r=stage.getBoundingClientRect();fmZoomAt(Math.exp(e.deltaY*0.0016),e.clientX-r.left-r.width/2,e.clientY-r.top-r.height/2)},{passive:false});
  stage.addEventListener("dblclick",function(e){var r=stage.getBoundingClientRect();fmZoomAt(1/2,e.clientX-r.left-r.width/2,e.clientY-r.top-r.height/2)});
  window.addEventListener("resize",function(){fmDraw()});
  if(window.ResizeObserver)new ResizeObserver(function(){fmDraw();fmCardsSoon()}).observe(stage);
  /* the full list lives in a sheet */
  var sheet=$('section.panel[data-tab="food"] .sheet.card');var filt=$("#foodFilters");if(filt){filt.classList.add("fm-filters");box.parentNode.insertBefore(filt,box)}
  FM.listStore=el("div",{cls:"hb-store"});document.body.appendChild(FM.listStore);if(sheet)FM.listStore.appendChild(sheet)}
function fmClampS(v){return Math.max(0.22,Math.min(9,v))}
function fmZoomAt(f,mx,my){var ns=fmClampS(FM.s*f);var wx=FM.cx+mx*FM.s,wy=FM.cy+my*FM.s;FM.s=ns;FM.cx=wx-mx*ns;FM.cy=wy-my*ns;fmDraw();fmCardsSoon()}
function fmZoom(f){fmAnim(FM.cx,FM.cy,fmClampS(FM.s*f))}
function fmFly(x,y,s){fmAnim(x,y,s==null?FM.s:fmClampS(s))}
function fmAnim(x,y,s){if(document.hidden){FM.cx=x;FM.cy=y;FM.s=s;fmDraw();fmCardsSoon();return}var x0=FM.cx,y0=FM.cy,s0=FM.s,t0=performance.now(),D=matchMedia("(prefers-reduced-motion: reduce)").matches?1:420;
  function step(t){var k=Math.min(1,(t-t0)/D),e=1-Math.pow(1-k,3);FM.cx=x0+(x-x0)*e;FM.cy=y0+(y-y0)*e;FM.s=Math.exp(Math.log(s0)+(Math.log(s)-Math.log(s0))*e);fmDraw();if(k<1)requestAnimationFrame(step);else fmCardsSoon()}requestAnimationFrame(step)}
function fmFit(list){if(!list.length)return;var xs=[],ys=[];list.forEach(function(p){var q=FM.pos[p.id];if(q){xs.push(q[0]);ys.push(q[1])}});if(!xs.length)return;
  var r=FM.stage.getBoundingClientRect();var w=Math.max(...xs)-Math.min(...xs),h=Math.max(...ys)-Math.min(...ys);var sc=Math.max(w/(r.width-80),h/(r.height-170),0.24);
  fmFly((Math.max(...xs)+Math.min(...xs))/2,(Math.max(...ys)+Math.min(...ys))/2+20*sc,sc)}
function fmDraw(){if(!FM.stage)return;var r=FM.stage.getBoundingClientRect();if(!r.width)return;var W_=r.width,H_=r.height,s=FM.s;
  FM.cx=Math.max(0,Math.min(MAPD.W,FM.cx));FM.cy=Math.max(0,Math.min(MAPD.H,FM.cy));
  FM.svg.setAttribute("viewBox",(FM.cx-W_/2*s)+" "+(FM.cy-H_/2*s)+" "+(W_*s)+" "+(H_*s));
  FM.box.dataset.z=s>4?"0":s>1.8?"1":s>0.8?"2":s>0.4?"3":"4";
  var sx=function(x){return (x-FM.cx)/s+W_/2},sy=function(y){return (y-FM.cy)/s+H_/2};
  $$(".fm-lbl",FM.lbls).forEach(function(t){var on=s>=t._r[0]&&s<=t._r[1];t.hidden=!on;if(on)t.style.transform="translate("+sx(t._xy[0])+"px,"+sy(t._xy[1])+"px) translate(-50%,-50%)"});
  /* pins, clustered on screen when zoomed out */
  FM.pins.textContent="";var R=s>1.1?56:s>0.6?44:30,order=[],groups={};
  var vis=[];FM.list.forEach(function(p){var q=FM.pos[p.id];if(!q)return;var x=sx(q[0]),y=sy(q[1]);if(x<-40||y<-40||x>W_+40||y>H_+60)return;vis.push({p:p,x:x,y:y})});
  vis.sort(function(m,n){return (n.p.id===FM.sel)-(m.p.id===FM.sel)||(n.p.rec||0)-(m.p.rec||0)});
  var cl=[];vis.forEach(function(o){var hit=null;if(R&&o.p.id!==FM.sel)for(var i=0;i<cl.length;i++){var c=cl[i];if(!c.lock&&Math.hypot(c.x-o.x,c.y-o.y)<R){hit=c;break}}
    if(hit){hit.m.push(o)}else cl.push({x:o.x,y:o.y,m:[o],lock:o.p.id===FM.sel})});
  cl.forEach(function(c,i){order.push(i);groups[i]=c.m});
  var placed=[],lbOK={};cl.filter(function(c){return c.m.length===1}).map(function(c){return c.m[0]}).sort(function(m,n){return (n.p.id===FM.sel)-(m.p.id===FM.sel)||(n.p.rec||0)-(m.p.rec||0)}).forEach(function(o){
    if(!(o.p.id===FM.sel||s<0.75))return;var w=Math.min(140,o.p.name.length*12.5+18),r={l:o.x-w/2,t:o.y+2,r:o.x+w/2,b:o.y+26};
    if(placed.some(function(q){return !(r.r<q.l||r.l>q.r||r.b<q.t||r.t>q.b)})&&o.p.id!==FM.sel)return;placed.push(r);lbOK[o.p.id]=1});
  var shown=0;order.forEach(function(k){var g=groups[k];shown+=g.length;
    if(g.length>1&&p_notSel(g)){var cx=0,cy=0;g.forEach(function(o){cx+=o.x;cy+=o.y});cx/=g.length;cy/=g.length;
      var c=el("button",{cls:"fm-cl",type:"button","aria-label":g.length+"곳 모여 있음, 확대"},[el("b",{text:String(g.length)})]);c.style.transform="translate("+cx+"px,"+cy+"px) translate(-50%,-50%)";
      c.onclick=function(){fmCluster(g.map(function(o){return o.p}),c)};FM.pins.appendChild(c);return}
    g.forEach(function(o){var p=o.p,sel=FM.sel===p.id;var showLb=!!lbOK[p.id];
      var b=el("button",{cls:"fm-pin "+fmColor(p)+(sel?" sel":""),type:"button","aria-label":p.name+" 정보 보기"},[el("span",{cls:"fm-dot"},[el("em",{text:p.rec?String(p.rec):"·"})])]);
      if(showLb)b.appendChild(el("span",{cls:"fm-lb",text:p.name}));b.style.transform="translate("+o.x+"px,"+o.y+"px)";b.style.zIndex=sel?999:String(10+(p.rec||0));
      b.onclick=function(){fmSelect(p,b)};FM.pins.appendChild(b)})});
  FM.cnt.textContent="지도 안 "+shown+"곳"}
function fmCluster(list,origin){var xs=list.map(function(p){return FM.pos[p.id][0]}),ys=list.map(function(p){return FM.pos[p.id][1]});
  var w=Math.max.apply(null,xs)-Math.min.apply(null,xs),h=Math.max.apply(null,ys)-Math.min.apply(null,ys);
  if(FM.s>0.32&&(w>24||h>24)){fmFit(list);return}
  list=list.slice().sort(function(x,y){return (y.rec||0)-(x.rec||0)});var box=el("div",{cls:"fm-clist"});
  list.forEach(function(p){var r=fmCardNode(p);r.onclick=function(){FM.sel=p.id;fmDraw();openPlace(p,r)};box.appendChild(r)});
  openPop(origin,{eyebrow:"같은 골목 "+list.length+"곳",title:"여기 모여 있는 가게",body:[box]})}
function p_notSel(g){return !g.some(function(o){return o.p.id===FM.sel})}
function fmSelect(p,origin){FM.sel=p.id;fmDraw();var c=$('.fm-card[data-id="'+p.id+'"]',FM.cards);if(c){$$(".fm-card.on",FM.cards).forEach(function(x){x.classList.remove("on")});c.classList.add("on");c.scrollIntoView({block:"nearest",inline:"center",behavior:"smooth"})}openPlace(p,origin)}
function openPlace(p,origin){var pc=placeCard(p,FM.a[p.id]||{pick:0,seats:[]});pc.style.margin="0";openPop(origin||null,{eyebrow:(AREA_NAME[p.area]||"")+" · 추천 "+(p.rec||0),title:p.name,color:"var(--l5)",body:[pc]})}
function fmCardNode(p){var c=el("button",{cls:"fm-card"+(FM.sel===p.id?" on":""),type:"button","data-id":p.id});
  var av=el("span",{cls:"fm-av "+fmColor(p),text:p.name.replace(/^[^가-힣A-Za-z0-9]+/,"").slice(0,1)});
  var sub=[AREA_NAME[p.area]||""];if(p.price!=null)sub.push(p.price.toLocaleString("ko-KR")+"원~");
  var tags=el("span",{cls:"fm-tags"});[["solo","혼밥"],["clean","깨끗함"],["wide","넓음"]].forEach(function(k){if(p[k[0]]==="O")tags.appendChild(el("i",{text:k[1]}))});
  c.appendChild(av);c.appendChild(el("span",{cls:"fm-cm"},[el("b",{text:p.name}),el("small",{text:sub.join(" · ")}),tags]));
  c.appendChild(el("span",{cls:"fm-rec"},[el("small",{text:"추천"}),el("b",{text:String(p.rec||0)})]));return c}
var fmCardT;function fmCardsSoon(){clearTimeout(fmCardT);fmCardT=setTimeout(fmCards,140)}
function fmCards(){if(!FM.cards)return;var r=FM.stage.getBoundingClientRect(),s=FM.s;
  var inView=FM.list.filter(function(p){var q=FM.pos[p.id];if(!q)return false;var x=(q[0]-FM.cx)/s+r.width/2,y=(q[1]-FM.cy)/s+r.height/2;return x>=0&&y>=0&&x<=r.width&&y<=r.height});
  inView.sort(function(x,y){return (y.rec||0)-(x.rec||0)||x.name.localeCompare(y.name,"ko")});
  FM.cards.textContent="";if(!inView.length){FM.cards.appendChild(el("div",{cls:"fm-none",text:"지도를 움직이면 이 근처 가게가 여기에 떠요"}));return}
  inView.slice(0,24).forEach(function(p,i){var c=fmCardNode(p);
    c.onclick=function(){var q=FM.pos[p.id];FM.sel=p.id;fmFly(q[0],q[1]+40*Math.min(FM.s,0.7),Math.min(FM.s,0.7));openPlace(p,c);$$(".fm-card.on",FM.cards).forEach(function(x){x.classList.remove("on")});c.classList.add("on")};
    FM.cards.appendChild(c)})}
renderFoodMap=function(list,a){buildFoodMap();FM.list=list;FM.a=a;FM.pos=fmPositions(list);var n=$("#fmListN");if(n)n.textContent=list.length+"곳";fmDraw();
  requestAnimationFrame(function(){fmDraw();if(FM.fitNext){FM.fitNext=false;if(area==="near"){var xy=llXY(36.9657,127.8712);fmFly(xy[0],xy[1],0.5)}else fmFit(list)}fmCards()})};
renderFood();
/* redraw when the 맛집 tab becomes visible (size was 0 while hidden) */
var _goMap=go;go=function(id){_goMap.apply(this,arguments);if((ALIAS[id]||id)==="food")requestAnimationFrame(function(){fmDraw();fmCards()})};

/* ---------- 학과: drop departments that no longer exist ---------- */
(function(){if(typeof acct!=="undefined"&&acct&&acct.dept&&!DEPTS.some(function(d){return d.n===acct.dept})){acct.dept="";store("acct",acct);
    setTimeout(function(){toast("학과 목록이 2026년 기준으로 바뀌었어요. 학업·진로에서 학과를 다시 골라 주세요")},900)}
  if(!myDept){try{localStorage.removeItem("knut:myDept")}catch(e){}}
  if(typeof GATE_TABS!=="undefined")GATE_TABS.forEach(renderGate)})();

/* ---------- header: menu icon + account avatar ---------- */
(function(){var mb=$("#allMenuBtn");if(mb){mb.setAttribute("aria-label","전체 메뉴");mb.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>'}})();
function heroPill(){var hp=$('section.panel[data-tab="home"] .scr-hero .hp');if(hp&&acct)hp.textContent=acct.name+" 님 · "+ACCT_LOGIN[acct.type][0].replace(" 로그인","")+(myDept?" · "+myDept.n:"")}
renderAcctBar=function(){var nr=$(".navrow");if(!nr)return;var old=$(".acct",nr);if(old)old.remove();if(!acct)return;
  var av=el("button",{cls:"acct-av",type:"button","aria-label":acct.name+" 님 계정",text:acct.name.trim().slice(0,1)});av.onclick=function(){openAcct(av)};
  nr.insertBefore(el("div",{cls:"acct"},[av]),nr.firstChild);heroPill()};
function openAcct(o){var t=ACCT_LOGIN[acct.type][0].replace(" 로그인","");
  var info=el("div",{cls:"acct-info"},[el("span",{cls:"acct-big",text:acct.name.trim().slice(0,1)}),el("div",{},[el("b",{text:acct.name+" 님"}),el("small",{text:t+(myDept?" · "+myDept.n:" · 학과 선택 전")})])]);
  openPop(o,{eyebrow:"내 계정",title:"계정",body:[info],actions:[{label:"학과 바꾸기",fn:function(){gateOpen=true;GATE_TABS.forEach(renderGate);go("study")}},{label:"로그아웃",primary:true,fn:function(){logout()}}]})}
var _renderGate2=renderGate;renderGate=function(tab){_renderGate2(tab);heroPill()};
renderAcctBar();
/* shortcut rows: tidy labels */
var _renderAud2=renderAud;renderAud=function(){_renderAud2();$$("#audLinks small").forEach(function(x){x.textContent=x.textContent.replace(/\s*→\s*$/,"")})};renderAud();

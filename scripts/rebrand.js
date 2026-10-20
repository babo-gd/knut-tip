// Rename to 넛팁 (KNUT!P): playful wordmark like the reference, mascot-face app icon, and re-subset the embedded font.
const fs=require("fs"),path=require("path"),subsetFont=require(path.join(__dirname,"..","font","node_modules","subset-font"));
const F=path.join(__dirname,"knut-tips.html");
let s=fs.readFileSync(F,"utf8");
function rep(a,b){if(s.split(a).length!==2)throw new Error("not unique ("+(s.split(a).length-1)+"): "+a.slice(0,90));s=s.replace(a,()=>b)}

/* name */
rep(`<title>교통대 꿀팁노선도</title>`,`<title>넛팁 KNUT!P</title>`);
rep(`aria-label="교통대 꿀팁노선도 홈"`,`aria-label="넛팁 홈"`);
rep(`<h1 class="vh">교통대 꿀팁노선도 홈</h1>`,`<h1 class="vh">넛팁 홈</h1>`);
s=s.split(`tag:"교통대 꿀팁노선도"`).join(`tag:"넛팁 KNUT!P"`);

/* logo icon: mascot face in a blue squircle */
const iconStart=s.indexOf(`<span class="logo-icon" aria-hidden="true">`);const iconEnd=s.indexOf(`</span>`,iconStart)+7;
if(iconStart<0)throw new Error("logo icon");
s=s.slice(0,iconStart)+`<span class="logo-icon" aria-hidden="true"><svg viewBox="0 0 48 48" width="40" height="40"><defs><radialGradient id="lgF" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#fff"/><stop offset=".75" stop-color="#eef2fb"/><stop offset="1" stop-color="#cdd6ee"/></radialGradient></defs><circle cx="24" cy="27" r="15" fill="url(#lgF)"/><path d="M10 19 Q24 6 38 19 L36 21 Q24 14 12 21 Z" fill="#0D2E8B"/><rect x="10.5" y="19" width="27" height="3.6" rx="1.8" fill="#8a1c1c"/><circle cx="24" cy="12.5" r="2.2" fill="#ffd166"/><ellipse cx="19" cy="27.5" rx="1.7" ry="2.2" fill="#1c1f2a"/><path d="M27.5 27.5 q1.7 -1.6 3.4 0" stroke="#1c1f2a" stroke-width="1.6" fill="none" stroke-linecap="round"/><ellipse cx="16" cy="31.5" rx="2.4" ry="1.4" fill="#ffb3c1"/><ellipse cx="32" cy="31.5" rx="2.4" ry="1.4" fill="#ffb3c1"/><path d="M21.5 32.5 q2.5 2.6 5 0" stroke="#1c1f2a" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg></span>`+s.slice(iconEnd);

/* wordmark: KNUT!P + 넛팁 */
rep(`<span class="wordmark">교통대 <em>꿀팁</em>노선도</span>`,`<span class="wordmark"><span class="wm-en">KNUT<i>!</i>P</span><span class="wm-ko">넛팁</span></span>`);
rep(`<small>국립한국교통대학교 충주캠퍼스 · 학생이 만드는 생활 가이드</small>`,`<small>교통대생이 모은 생활 꿀팁</small>`);
rep(`family=Jua&`,`family=Jua&family=Fredoka:wght@600;700&`);

const CSS=`
/* ===== 넛팁 brand ===== */
.logo-icon{width:42px!important;height:42px!important;border-radius:14px!important;background:linear-gradient(150deg,#3b55e6 0%,#0D2E8B 100%)!important;box-shadow:0 6px 16px rgba(59,85,230,.35)!important}
.logo-icon::after{display:none}
.logo-icon svg{width:38px!important;height:38px!important}
.brand{gap:10px!important}
.logo-text{line-height:1!important;gap:3px}
.wordmark{display:flex!important;align-items:baseline;gap:7px;font-size:25px!important;-webkit-text-stroke:0!important}
.wm-en{font-family:"Fredoka","Jua",system-ui,sans-serif!important;font-weight:700!important;letter-spacing:-.01em;color:var(--hero)!important}
.wm-en i{font-style:normal;color:#ffb020;display:inline-block;transform:rotate(8deg) translateY(-1px);margin:0 1px}
.wm-ko{font-family:"Jua",system-ui,sans-serif!important;font-weight:400!important;font-size:16px;color:var(--t2)!important;padding:2px 8px;border-radius:999px;background:#eef1ff}
.logo-text small{display:block!important;font-size:11.5px!important;color:var(--t3)!important;font-family:"Jua",system-ui,sans-serif!important;letter-spacing:0}
:root[data-theme="dark"] .wm-ko{background:#262d44}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .wm-ko{background:#262d44}}
`;
const anchor=`@media (prefers-reduced-motion:reduce){*{transition:none!important}}`;
if(s.split(anchor).length!==2)throw new Error("anchor");
s=s.replace(anchor,()=>CSS+anchor);

/* re-subset the embedded 경기천년바탕 so new characters (넛 etc.) are covered */
(async()=>{
  const fa=s.indexOf(`@font-face{font-family:"GyeonggiBatang";font-weight:400`);const fb=s.indexOf(`\n`,s.indexOf(`@font-face{font-family:"GyeonggiBatang";font-weight:700`))+1;
  if(fa<0||fb<=0)throw new Error("font faces not found");
  s=s.slice(0,fa)+s.slice(fb);
  const chars=new Set([...s]);for(let c=32;c<127;c++)chars.add(String.fromCharCode(c));
  "·…→←↗›⌄★☆✕“”‘’「」『』~₩%–—".split("").forEach(c=>chars.add(c));
  const text=[...chars].filter(c=>c.codePointAt(0)>=32).join("");
  const FD=path.join(__dirname,"..","font");const out={};
  for(const [w,file] of [["400","Batang_Regular.woff"],["700","Batang_Bold.woff"]]){const buf=await subsetFont(fs.readFileSync(path.join(FD,file)),text,{targetFormat:"woff2"});out[w]=buf.toString("base64");console.log(file,Math.round(buf.length/1024)+"KB")}
  const faces=`@font-face{font-family:"GyeonggiBatang";font-weight:400;font-display:swap;src:url(data:font/woff2;base64,${out["400"]}) format("woff2")}
@font-face{font-family:"GyeonggiBatang";font-weight:700 900;font-display:swap;src:url(data:font/woff2;base64,${out["700"]}) format("woff2")}
`;
  s=s.slice(0,fa)+faces+s.slice(fa);
  fs.writeFileSync(F,s,"utf8");console.log("ok",Math.round(Buffer.byteLength(s)/1024)+"KB");
})().catch(e=>{console.error(e);process.exit(1)});

// Re-subset the embedded 경기천년바탕 to every character now in the page.
const fs=require("fs"),path=require("path"),subsetFont=require(path.join(__dirname,"..","font","node_modules","subset-font"));const F=path.join(__dirname,"knut-tips.html");let s=fs.readFileSync(F,"utf8");
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

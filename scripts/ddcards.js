// 과제 마감 보드: the 5-column table (scrolls sideways on phones) becomes cards that fit the screen.
// Each card: big D-day badge (red at D-2 or closer), course + section, then due/format/note pills.
// Usage: node ddcards.js <page.html> [<page.html> ...]
const fs=require("fs");
const CSS=`
/* ===== 과제 마감 cards ===== */
.dd-list{display:flex;flex-direction:column;gap:10px;margin-top:12px;--dc:#e8960c}
.dd-card{display:flex;align-items:flex-start;gap:12px;padding:14px;border-radius:18px;background:var(--card);box-shadow:var(--sh1)}
.dd-badge{flex:none;min-width:58px;padding:8px 6px;border-radius:14px;text-align:center;font-size:15px;font-weight:800;font-variant-numeric:tabular-nums;color:color-mix(in srgb,var(--dc) 80%,#000);background:color-mix(in srgb,var(--dc) 14%,var(--card))}
.dd-badge.hot{color:#fff;background:var(--coral)}
.dd-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}
.dd-main b{font-size:16px;font-weight:800;letter-spacing:-.015em;color:var(--t1);line-height:1.35}
.dd-main small{font-size:12.5px;color:var(--t3);font-weight:600;margin-top:-4px}
.dd-tags{display:flex;flex-wrap:wrap;gap:6px}
.dd-tags span{font-size:12.5px;font-weight:700;padding:3px 9px;border-radius:999px;background:var(--fill);color:var(--t2)}
.dd-tags span.due{font-variant-numeric:tabular-nums;color:color-mix(in srgb,var(--dc) 80%,#000);background:color-mix(in srgb,var(--dc) 12%,var(--card))}
.dd-empty{padding:18px 16px;border-radius:16px;border:1.5px dashed var(--fill2);text-align:center;font-size:14px;line-height:1.55;color:var(--t3)}
`;
const JS=`
/* ---------- 과제 마감 cards ---------- */
(function(){var body=$("#asBody");if(!body)return;var tw=body.closest(".tablewrap");if(!tw)return;var box=el("div",{cls:"dd-list",id:"asCards"});tw.replaceWith(box);
  renderAssigns=function(){var b=$("#asCards");if(!b)return;b.textContent="";var q=($("#asSearch").value||"").trim();
    var list=assigns.filter(function(a){return dday(a.due)>=-1&&(!q||a.course.indexOf(q)>=0)}).sort(function(x,y){return (x.due+x.time)<(y.due+y.time)?-1:1});
    if(!list.length){b.appendChild(el("div",{cls:"dd-empty",text:db?"등록된 과제 마감이 없어요. 위에서 첫 마감을 제보해 주세요.":(window.claude?"제보된 마감을 불러오려면 claude.ai에 로그인해 주세요.":"과제 마감 보드는 Claude 링크에서 친구들과 함께 쓸 수 있어요.")}));return}
    list.forEach(function(a){var n=dday(a.due);var tags=el("div",{cls:"dd-tags"},[el("span",{cls:"due",text:a.due.replace(/-/g,".").slice(5)+(a.time?" "+a.time:"")})]);
      if(a.format)tags.appendChild(el("span",{text:a.format}));if(a.note)tags.appendChild(el("span",{text:a.note}));
      var main=el("div",{cls:"dd-main"},[el("b",{text:a.course})]);if(a.section)main.appendChild(el("small",{text:a.section}));main.appendChild(tags);
      b.appendChild(el("div",{cls:"dd-card"},[el("span",{cls:"dd-badge"+(n<=2?" hot":""),text:ddayTxt(n)}),main]))})};
  $("#asSearch").oninput=renderAssigns;renderAssigns()})();
`;
for(const F of process.argv.slice(2)){let s=fs.readFileSync(F,"utf8");
  const rep=(a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(F+": expected 1 match, found "+n+": "+a.slice(0,60));s=s.replace(a,()=>b)};
  if(s.includes("/* ===== 과제 마감 cards"))throw new Error(F+": already applied");
  const M="@media (prefers-reduced-motion:reduce){*{transition:none!important}}";rep(M,CSS+"\n"+M);
  rep("/* ---------- connect db ---------- */",JS+"/* ---------- connect db ---------- */");
  fs.writeFileSync(F,s,"utf8");console.log("ok",F.slice(-30))}

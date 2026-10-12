/* 료칸 문의 메일 빌더: 항목을 체크하면 정중한 일본어 문장이 메일에 추가됩니다. */
(()=>{const box=document.getElementById('mb-box');if(!box)return;
const ALG=[['卵','계란'],['乳','우유'],['小麦','밀'],['そば','메밀'],['えび','새우'],['かに','게'],['落花生','땅콩'],['魚','생선'],['大豆','대두'],['ナッツ類','견과류'],['甲殻類','갑각류']];
const T=[
{id:'price',label:'빈 방·요금 문의',on:true,jp:()=>'ご希望の日程で空室があるか、お部屋のタイプと料金（1泊・1名あたり）をお知らせいただけますでしょうか。'},
{id:'alg',label:'식품 알레르기',f:[{k:'a',t:'chips',o:ALG}],jp:v=>{const l=(v.a||[]).join('、');return `食物アレルギー${l?`（${l}）`:''}がございます。これらを使用しないお食事のご用意は可能でしょうか。`}},
{id:'ci',label:'체크인 시간 변경',f:[{k:'d',t:'sel',o:[['late','늦게 도착'],['early','일찍 도착']]},{k:'t',t:'time',l:'도착 예정 시각'}],jp:v=>{const t=v.t||'○時';return v.d==='early'?`当日は${t}頃に到着予定です。チェックイン前でも、お荷物のお預かりまたは早めのご入室は可能でしょうか。`:`当日は${t}頃の到着となる見込みです。通常のチェックイン時刻より遅くなりますが、ご対応いただけますでしょうか。`}},
{id:'co',label:'체크아웃 늦추기',jp:()=>'チェックアウト時刻を遅らせること（レイトチェックアウト）は可能でしょうか。可能な場合は料金もお知らせください。'},
{id:'pick',label:'송영(역 마중) 문의',f:[{k:'s',t:'text',l:'출발역 이름(일본어, 비우면 가까운 역)',ph:'例：秋田駅'}],jp:v=>`${v.s||'最寄り駅'}から宿までの送迎は可能でしょうか。難しい場合は、公共交通機関でのアクセス方法（最終バスの時刻など）をご教示いただけますと幸いです。`},
{id:'nomeal',label:'식사 없이(소박) 숙박',jp:()=>'お食事なし（素泊まり）でのご宿泊は可能でしょうか。'},
{id:'veg',label:'채식(고기·생선 불가)',jp:()=>'ベジタリアンのため、肉類・魚介類を食べることができません。対応可能なお食事はございますでしょうか。'},
{id:'dinner',label:'저녁 식사 시간 희망',f:[{k:'t',t:'time',l:'희망 시각'}],jp:v=>`夕食は${v.t||'○時'}頃を希望いたします。`},
{id:'room',label:'방 요청',f:[{k:'r',t:'sel',o:[['禁煙の','금연'],['1階または階段の少ない','1층·계단 적은'],['和室（お布団）の','다다미(이불)'],['洋室（ベッド）の','양실(침대)']]}],jp:v=>`${v.r||'禁煙の'}お部屋を希望いたします。`},
{id:'tattoo',label:'문신이 있음(대욕장 문의)',jp:()=>'タトゥー（刺青）がございます。大浴場・露天風呂のご利用は可能でしょうか。可能な場合の条件（シールで隠すなど）、または貸切風呂があればご教示ください。'},
{id:'priv',label:'대절탕(가족탕) 문의',jp:()=>'貸切風呂（家族風呂）のご利用は可能でしょうか。料金とご予約方法もお知らせください。'},
{id:'pay',label:'결제·입욕세 문의',jp:()=>'お支払い方法について、クレジットカードは利用可能でしょうか。また、入湯税など宿泊料金とは別にかかる費用があれば、金額をお知らせください。'},
{id:'lug',label:'체크인 전 짐 맡기기',jp:()=>'チェックイン前に、お荷物をお預かりいただくことは可能でしょうか。'},
{id:'ann',label:'기념일 여행',f:[{k:'o',t:'sel',o:[['誕生日','생일'],['記念日','기념일'],['結婚記念日','결혼기념일']]}],jp:v=>`${v.o||'記念日'}のお祝いでの旅行です。可能な範囲でご配慮いただけますと幸いです。`},
{id:'kid',label:'어린이 동반',f:[{k:'a',t:'text',l:'아이 나이(숫자)',ph:'例：5'}],jp:v=>`お子様（${v.a||'○'}歳）を同伴いたします。お子様向けのお食事・寝具・料金についてお知らせください。`},
{id:'cxl',label:'취소 규정 문의',jp:()=>'キャンセル規定（キャンセル料が発生する時期と金額）をお知らせください。'}
];
const S={};T.forEach(i=>S[i.id]={on:!!i.on,v:{}});
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let courtesy=true;
function ui(){let h='<div class="mb-title">요청 항목 고르기</div>';
 T.forEach(i=>{h+=`<div class="mb-item"><label class="mb-row"><input type="checkbox" data-id="${i.id}" ${S[i.id].on?'checked':''}><span>${i.label}</span></label>`;
  if(i.f&&S[i.id].on){h+='<div class="mb-sub">';i.f.forEach(f=>{const v=S[i.id].v;
   if(f.t==='chips')h+='<div class="mb-chips">'+f.o.map(([j,k])=>`<label class="mb-chip"><input type="checkbox" data-id="${i.id}" data-k="${f.k}" data-chip="${esc(j)}" ${(v[f.k]||[]).includes(j)?'checked':''}><span>${k}</span></label>`).join('')+'</div>';
   else if(f.t==='sel')h+=`<select data-id="${i.id}" data-k="${f.k}">${f.o.map(([j,k],n)=>`<option value="${esc(j)}" ${v[f.k]===j||(!v[f.k]&&n===0)?'selected':''}>${k}</option>`).join('')}</select>`;
   else h+=`<label class="mb-f">${f.l}<input type="${f.t}" data-id="${i.id}" data-k="${f.k}" value="${esc(v[f.k]||'')}" placeholder="${f.ph||''}"></label>`});h+='</div>'}
  h+='</div>'});
 h+=`<label class="mb-row mb-courtesy"><input type="checkbox" id="mb-courtesy" ${courtesy?'checked':''}><span>일본어가 서툴다는 양해 문구 넣기</span></label>`;
 box.innerHTML=h}
function sync(){if(window.__bkCompose)window.__bkCompose()}
box.addEventListener('change',e=>{const el=e.target;if(el.id==='mb-courtesy'){courtesy=el.checked;return sync()}
 const id=el.dataset.id;if(!id)return;
 if(el.dataset.chip!==undefined){const a=S[id].v[el.dataset.k]=S[id].v[el.dataset.k]||[];const c=el.dataset.chip,i=a.indexOf(c);if(el.checked&&i<0)a.push(c);if(!el.checked&&i>=0)a.splice(i,1);return sync()}
 if(el.dataset.k){S[id].v[el.dataset.k]=el.value;return sync()}
 S[id].on=el.checked;ui();sync()});
box.addEventListener('input',e=>{const el=e.target;if(el.dataset.k&&el.type!=='checkbox'&&el.tagName!=='SELECT'){S[el.dataset.id].v[el.dataset.k]=el.value;sync()}});
window.buildRequests=()=>T.filter(i=>S[i.id].on).map(i=>i.jp(S[i.id].v));
window.mailCourtesy=()=>courtesy;
ui()})();

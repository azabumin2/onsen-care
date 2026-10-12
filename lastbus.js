(()=>{const D=window.LASTBUS;if(!D)return;const $=id=>document.getElementById(id);
const sp=$('lb-pref'),so=$('lb-onsen'),ss=$('lb-station'),sd=$('lb-dep'),out=$('lb-result');if(!so||!sp)return;
const KO={'北海道':'홋카이도','青森県':'아오모리','岩手県':'이와테','宮城県':'미야기','秋田県':'아키타','山形県':'야마가타','福島県':'후쿠시마','茨城県':'이바라키','栃木県':'도치기','群馬県':'군마','埼玉県':'사이타마','千葉県':'지바','東京都':'도쿄','神奈川県':'가나가와','新潟県':'니가타','富山県':'도야마','石川県':'이시카와','福井県':'후쿠이','山梨県':'야마나시','長野県':'나가노','岐阜県':'기후','静岡県':'시즈오카','愛知県':'아이치','三重県':'미에','滋賀県':'시가','京都府':'교토','大阪府':'오사카','兵庫県':'효고','奈良県':'나라','和歌山県':'와카야마','鳥取県':'돗토리','島根県':'시마네','岡山県':'오카야마','広島県':'히로시마','山口県':'야마구치','徳島県':'도쿠시마','香川県':'가가와','愛媛県':'에히메','高知県':'고치','福岡県':'후쿠오카','佐賀県':'사가','長崎県':'나가사키','熊本県':'구마모토','大分県':'오이타','宮崎県':'미야자키','鹿児島県':'가고시마','沖縄県':'오키나와'};
const ORDER=Object.keys(KO);
const all=D.map(o=>({...o,detail:true}));
if(window.ONSEN_DATA)window.ONSEN_DATA.forEach(x=>{if(/武甲/.test(x.name))return;
 all.push({name:x.name,prefJa:x.prefecture,pref:'',bath:{open:'',last:'',close:''},detail:false,
  stations:[{from:'가까운 역/정류장은 아래 안내 참고',mode:x.transit,ride:null,fare:'요확인',out:[],outArr:[],back:[],verified:'',link:x.official||'',tip:x.caution||''}]})});
const t2m=t=>{if(!t)return null;const[a,b]=t.split(':').map(Number);return a*60+b};
const m2t=m=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
const prefs=ORDER.filter(p=>all.some(o=>o.prefJa===p));
sp.innerHTML=prefs.map(p=>`<option value="${p}">${KO[p]} (${p}) · ${all.filter(o=>o.prefJa===p).length}곳</option>`).join('');
let list=[];
function fillOnsen(){list=all.filter(o=>o.prefJa===sp.value);
 so.innerHTML=list.map((o,i)=>`<option value="${i}">${o.detail?'★ ':''}${o.name}</option>`).join('');fillSt()}
function fillSt(){const o=list[so.value];ss.innerHTML=o.stations.map((s,i)=>`<option value="${i}">${s.from}</option>`).join('');render()}
function render(){const o=list[so.value],s=o.stations[ss.value],dep=t2m(sd.value);let h='';
 h+=`<div class="lb-row"><span>이동수단</span><b>${s.mode}</b></div>`;
 h+=`<label>이동 소요시간(분)<input id="lb-ride" type="number" min="1" max="300" value="${s.ride||''}" placeholder="직접 입력"></label>`;
 h+=`<div class="lb-row"><span>요금</span><b>${s.fare}</b></div>`;
 let board=null,arr=null;
 if(s.out.length){const i=dep==null?-1:s.out.findIndex(t=>t2m(t)>=dep);
  h+=`<div class="lb-row"><span>승차 가능 시각 <span class="lb-badge">확인됨</span></span><b>${s.out.join(' · ')}</b></div>`;
  if(i>=0){board=s.out[i];arr=t2m(s.outArr[i]);h+=`<div class="lb-row"><span>탈 버스</span><b class="lb-big">${board} 출발 → ${m2t(arr)} 도착</b></div>`}
  else h+=`<div class="lb-row"><span>탈 버스</span><b class="lb-warn">이 시각 이후 출발편 없음</b></div>`}
 else h+=`<div class="lb-row"><span>승차 시각</span><b>시각표 미확인 · 입력한 출발시각 기준</b></div>`;
 const bl=t2m(o.bath.last),bc=t2m(o.bath.close);
 h+=`<div class="lb-row"><span>입욕 시간</span><b>${o.bath.open?`${o.bath.open}~${o.bath.close} (입장 ${o.bath.last}까지)`:'요확인'}</b></div>`;
 if(s.back.length)h+=`<div class="lb-row"><span>돌아오는 편 <span class="lb-badge">확인됨</span></span><b>${s.back.join(' · ')}</b></div>`;
 h+=`<label style="margin-top:6px">온천→역 막차 시각 ${s.back.length?'':'(직접 입력)'}<input id="lb-last" type="time" value="${s.back.length?s.back[s.back.length-1]:''}"></label>`;
 h+=`<div id="lb-stay" class="lb-row"></div>`;
 if(s.tip)h+=`<p class="lb-note">${s.tip}</p>`;
 if(s.verified)h+=`<p class="lb-note">출처: ${s.verified}</p>`;
 if(s.link)h+=`<p class="lb-note"><a href="${s.link}" target="_blank" rel="noopener">공식 시각표/정보 확인 ↗</a></p>`;
 out.innerHTML=h;
 const li=$('lb-last'),ri=$('lb-ride'),el=$('lb-stay');
 const calc=()=>{const last=t2m(li.value),ride=+ri.value;let a=arr;if(a==null&&dep!=null&&ride>0)a=dep+ride;
  if(a==null||last==null){el.innerHTML='<span>체류 가능 시간</span><b>이동시간·막차 시각을 입력하세요</b>';return}
  const limit=bc!=null?Math.min(last-15,bc):last-15,stay=limit-a;
  el.innerHTML=stay>0?`<span>체류 가능(도착 ${m2t(a)}~${m2t(limit)}, 여유 15분)</span><b class="lb-big lb-ok">${Math.floor(stay/60)}시간 ${stay%60}분</b>`:`<span>체류 가능</span><b class="lb-warn">시간이 부족합니다</b>`};
 li.addEventListener('input',calc);ri.addEventListener('input',calc);calc()}
sp.addEventListener('change',fillOnsen);so.addEventListener('change',fillSt);ss.addEventListener('change',render);sd.addEventListener('input',render);fillOnsen()})();

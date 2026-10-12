(()=>{const D=window.LASTBUS;if(!D)return;const $=id=>document.getElementById(id);
const so=$('lb-onsen'),ss=$('lb-station'),sd=$('lb-dep'),out=$('lb-result');if(!so)return;
const t2m=t=>{if(!t)return null;const[a,b]=t.split(':').map(Number);return a*60+b};
const m2t=m=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
so.innerHTML=D.map((o,i)=>`<option value="${i}">${o.name} (${o.pref})</option>`).join('');
function fillSt(){const o=D[so.value];ss.innerHTML=o.stations.map((s,i)=>`<option value="${i}">${s.from}</option>`).join('');render()}
function render(){const o=D[so.value],s=o.stations[ss.value],dep=t2m(sd.value);let h='';
 h+=`<div class="lb-row"><span>이동수단</span><b>${s.mode}</b></div>`;
 h+=`<div class="lb-row"><span>소요/요금</span><b>${s.ride?s.ride+'분':'요확인'} / ${s.fare}</b></div>`;
 let board=null,arr=null;
 if(s.out.length&&dep!=null){const i=s.out.findIndex(t=>t2m(t)>=dep);
  if(i>=0){board=s.out[i];arr=t2m(s.outArr[i])}}
 if(s.out.length){h+=`<div class="lb-row"><span>승차 가능 시각 <span class="lb-badge">확인됨</span></span><b>${s.out.join(' · ')}</b></div>`;
  h+=board?`<div class="lb-row"><span>탈 버스</span><b class="lb-big">${board} 출발 → ${m2t(arr)} 도착</b></div>`:`<div class="lb-row"><span>탈 버스</span><b class="lb-warn">이 시각 이후 출발편 없음</b></div>`}
 else{arr=dep!=null&&s.ride?dep+s.ride:null;h+=`<div class="lb-row"><span>승차 시각</span><b>시각표 미확인 · 출발시각 기준 계산</b></div>`}
 const bl=t2m(o.bath.last),bc=t2m(o.bath.close);
 h+=`<div class="lb-row"><span>입욕 시간</span><b>${o.bath.open?`${o.bath.open}~${o.bath.close} (입장 ${o.bath.last}까지)`:'요확인'}</b></div>`;
 h+=`<label style="margin-top:6px">온천→역 막차 시각 ${s.back.length?'':'(직접 입력)'}<input id="lb-last" type="time" value="${s.back.length?s.back[s.back.length-1]:''}"></label>`;
 h+=`<div id="lb-stay" class="lb-row"></div>`;
 if(s.tip)h+=`<p class="lb-note">${s.tip}</p>`;
 if(s.verified)h+=`<p class="lb-note">출처: ${s.verified}</p>`;
 if(s.link)h+=`<p class="lb-note"><a href="${s.link}" target="_blank" rel="noopener">공식 시각표 확인 ↗</a></p>`;
 out.innerHTML=h;
 const li=$('lb-last');const calc=()=>{const last=t2m(li.value),el=$('lb-stay');
  if(arr==null||last==null){el.innerHTML='<span>체류 가능 시간</span><b>막차 시각을 입력하세요</b>';return}
  const buf=15,limit=bc!=null?Math.min(last-buf,bc):last-buf,stay=limit-arr;
  el.innerHTML=stay>0?`<span>체류 가능(도착~${m2t(limit)}, 여유 15분)</span><b class="lb-big lb-ok">${Math.floor(stay/60)}시간 ${stay%60}분</b>`:`<span>체류 가능</span><b class="lb-warn">시간이 부족합니다</b>`};
 li.addEventListener('input',calc);calc()}
so.addEventListener('change',fillSt);ss.addEventListener('change',render);sd.addEventListener('input',render);fillSt()})();

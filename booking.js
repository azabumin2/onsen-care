(()=>{const $=id=>document.getElementById(id);const sp=$('bk-pref'),so=$('bk-onsen'),box=$('bk-contact'),mail=$('mail-preview');if(!sp||!window.ONSEN_DATA)return;
const C=window.BOOKING_CONTACT||{},D=window.ONSEN_DATA;
const prefs=[...new Set(D.map(x=>x.prefecture))];
sp.innerHTML='<option value="">지역 선택</option>'+prefs.map(p=>`<option>${p}</option>`).join('');
let list=[];
sp.addEventListener('change',()=>{list=D.filter(x=>x.prefecture===sp.value);
 so.innerHTML=list.map((x,i)=>`<option value="${i}">${x.name}</option>`).join('');show()});
so.addEventListener('change',show);
const cur=()=>list[so.value];
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function body(){const t=mail.textContent;const x=cur();return x?t.replace('ご担当者様',x.name+' ご担当者様'):t}
function show(){const x=cur();if(!x){box.innerHTML='';return}
 const c=C[x.name]||{};let h='';
 if(c.email)h+=`<div class="lb-row"><span>이메일 <span class="lb-badge">확인됨</span></span><b>${esc(c.email)}</b></div><a class="app-button" id="bk-mailto" href="#">메일 앱으로 보내기</a>`;
 if(c.form)h+=`<div class="lb-row"><span>웹 문의 폼</span><b><a href="${esc(c.form)}" target="_blank" rel="noopener">열기 ↗</a></b></div>`;
 if(c.phone)h+=`<div class="lb-row"><span>전화</span><b>${esc(c.phone)} (일본어)</b></div>`;
 if(x.official)h+=`<div class="lb-row"><span>공식 사이트</span><b><a href="${esc(x.official)}" target="_blank" rel="noopener">열기 ↗</a></b></div>`;
 if(!c.email&&!c.form&&!c.phone&&!x.official)h+='<p class="lb-note">연락처를 아직 확인하지 못했습니다. “시설명 + 公式”로 검색해 주세요.</p>';
 else if(!c.email)h+='<p class="lb-note">공개된 이메일 주소는 확인되지 않았습니다. 아래 일본어 문장을 복사해 폼이나 예약 페이지에 붙여넣으세요.</p>';
 if(c.note)h+=`<p class="lb-note">${esc(c.note)}</p>`;
 box.innerHTML=h;
 const a=$('bk-mailto');if(a)a.addEventListener('click',e=>{e.preventDefault();location.href='mailto:'+c.email+'?subject='+encodeURIComponent('宿泊予約のお問い合わせ')+'&body='+encodeURIComponent(body())})}
['guest-name','checkin-date','guest-count'].forEach(id=>$(id).addEventListener('input',()=>{}));
})();

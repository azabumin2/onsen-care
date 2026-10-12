(()=>{const $=id=>document.getElementById(id);const sp=$('bk-pref'),so=$('bk-onsen'),box=$('bk-contact'),mail=$('mail-preview');if(!sp||!window.ONSEN_DATA)return;
const C=window.BOOKING_CONTACT||{},D=window.ONSEN_DATA;
const prefs=[...new Set(D.map(x=>x.prefecture))];
sp.innerHTML='<option value="">지역 선택</option>'+prefs.map(p=>`<option>${p}</option>`).join('');
let list=[];
sp.addEventListener('change',()=>{list=D.filter(x=>x.prefecture===sp.value);
 so.innerHTML=list.map((x,i)=>`<option value="${i}">${x.name}</option>`).join('');show();compose()});
so.addEventListener('change',()=>{show();compose()});
const cur=()=>list[so.value];
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function body(){return mail.textContent}
const nameIn=$('guest-name'),kanaIn=$('guest-kana'),dateIn=$('checkin-date'),cntIn=$('guest-count');
function compose(){const x=cur();const d=dateIn.value?new Date(dateIn.value+'T00:00:00'):null;
 const jp=d?`${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`:'希望日';
 const nm=nameIn.value||'予約者',k=kanaIn.value.trim();const who=k?`${nm}（${k}）`:nm;
 mail.textContent=`${x?x.name+' ':''}ご担当者様\n\nはじめまして、${who}と申します。\n${jp}から${cntIn.value}名で宿泊を希望しております。\n予約可能なお部屋と料金、送迎の有無をご案内いただけますでしょうか。\n\nどうぞよろしくお願いいたします。`}
$('kana-btn').addEventListener('click',()=>{kanaIn.value=window.koToKatakana?window.koToKatakana(nameIn.value):'';compose()});
[nameIn,kanaIn,dateIn,cntIn].forEach(e=>e.addEventListener('input',compose));
compose();
function show(){const x=cur();if(!x){box.innerHTML='';$('bk-mailto').hidden=true;return}
 const c=C[x.name]||{};let h='';
 if(c.email)h+=`<div class="lb-row"><span>이메일 <span class="lb-badge">확인됨</span></span><b>${esc(c.email)}</b></div>`;
 if(c.form)h+=`<div class="lb-row"><span>웹 문의 폼</span><b><a href="${esc(c.form)}" target="_blank" rel="noopener">열기 ↗</a></b></div>`;
 if(c.phone)h+=`<div class="lb-row"><span>전화</span><b>${esc(c.phone)} (일본어)</b></div>`;
 if(x.official)h+=`<div class="lb-row"><span>공식 사이트</span><b><a href="${esc(x.official)}" target="_blank" rel="noopener">열기 ↗</a></b></div>`;
 if(!c.email&&!c.form&&!c.phone&&!x.official)h+='<p class="lb-note">연락처를 아직 확인하지 못했습니다. “시설명 + 公式”로 검색해 주세요.</p>';
 else if(!c.email)h+='<p class="lb-note">공개된 이메일 주소는 확인되지 않았습니다. 아래 일본어 문장을 복사해 폼이나 예약 페이지에 붙여넣으세요.</p>';
 if(c.note)h+=`<p class="lb-note">${esc(c.note)}</p>`;
 box.innerHTML=h;
 const a=$('bk-mailto');a.hidden=!c.email;a.onclick=c.email?e=>{e.preventDefault();location.href='mailto:'+c.email+'?subject='+encodeURIComponent('宿泊予約のお問い合わせ')+'&body='+encodeURIComponent(body())}:null}
})();

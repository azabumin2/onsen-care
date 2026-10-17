(()=>{
const $=id=>document.getElementById(id);
const banner=$('welcomeBanner'),modal=$('welcomeModal');if(!banner||!modal)return;
const DKEY='onsen_welcome_dismissed_until',BKEY='onsen_banner_closed';
const store={get:(s,k)=>{try{return s.getItem(k)}catch(e){return null}},set:(s,k,v)=>{try{s.setItem(k,v)}catch(e){}}};
/* 유입 경로별 문구(허용된 값만 사용, 문구는 textContent로만 넣어 안전) */
const REF={
 fmkorea:{h:'에펨코리아에서 오셨군요, 환영합니다! ♨️',s:'일본 료칸에 직접 문의 메일을 보낼 때 쓰는 무료 도구를 모았습니다.',b:'[에펨코리아] 가타카나 변환·일본어 문의 메일 무료 도구 바로 사용하기'},
 theqoo:{h:'더쿠에서 오셨군요, 환영합니다! ♨️',s:'일본 료칸에 직접 문의 메일을 보낼 때 쓰는 무료 도구를 모았습니다.',b:'[더쿠] 가타카나 변환·일본어 문의 메일 무료 도구 바로 사용하기'},
 cafe:{h:'여행 카페에서 오셨군요, 환영합니다! ♨️',s:'일본어가 서툴러도 료칸에 정중하게 문의할 수 있도록 도와드립니다.',b:'[여행 카페] 료칸 문의용 가타카나·일본어 메일 무료 도구'},
 naver:{h:'네이버에서 오셨군요, 환영합니다! ♨️',s:'일본어가 서툴러도 료칸에 정중하게 문의할 수 있도록 도와드립니다.',b:'[네이버] 료칸 문의용 가타카나·일본어 메일 무료 도구'},
 x:{h:'X에서 오셨군요, 환영합니다! ♨️',s:'출발역을 고르면 막차까지 머물 수 있는 시간을 계산해 드립니다.',b:'[X] 막차 가디언 · 막차 알림 무료로 바로 써보기',tab:'tab-mobility'},
 insta:{h:'인스타그램에서 오셨군요, 환영합니다! ♨️',s:'출발역을 고르면 막차까지 머물 수 있는 시간을 계산해 드립니다.',b:'[인스타그램] 막차 가디언 · 막차 알림 무료로 바로 써보기',tab:'tab-mobility'}
};
const q=new URLSearchParams(location.search);
const ref=(q.get('ref')||q.get('utm_source')||'').toLowerCase();
const t=Object.prototype.hasOwnProperty.call(REF,ref)?REF[ref]:null;
if(t){$('welcomeHeading').textContent=t.h;$('welcomeSub').textContent=t.s;$('bannerText').textContent=t.b}
/* 배너 높이만큼 헤더·본문을 아래로 */
function setBH(){const h=banner.hidden?0:banner.offsetHeight;document.documentElement.style.setProperty('--bh',h+'px')}
function openTools(){const d=$('demo');if(d)d.scrollIntoView();const tab=$((t&&t.tab)||'tab-booking');if(tab)tab.click()}
$('bannerGo').addEventListener('click',openTools);
$('bannerClose').addEventListener('click',()=>{banner.hidden=true;store.set(sessionStorage,BKEY,'1');setBH()});
if(store.get(sessionStorage,BKEY)==='1')banner.hidden=true;
setBH();window.addEventListener('resize',setBH);
/* 웰컴 팝업 */
let lastFocus=null;
function closeModal(){const c=$('welcomeSkip');if(c&&c.checked)store.set(localStorage,DKEY,String(Date.now()+864e5));modal.hidden=true;if(lastFocus&&lastFocus.focus)lastFocus.focus()}
function openModal(){lastFocus=document.activeElement;modal.hidden=false;$('welcomeGo').focus()}
$('welcomeX').addEventListener('click',closeModal);
$('welcomeClose').addEventListener('click',closeModal);
$('welcomeGo').addEventListener('click',()=>{closeModal();openTools()});
modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeModal()});
const until=parseInt(store.get(localStorage,DKEY)||'0',10);
if(!until||Date.now()>until)setTimeout(openModal,500);
})();

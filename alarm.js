(()=>{const $=id=>document.getElementById(id);const list=$('al-list');if(!list)return;
const KEY='lastbus-alarms-v1';let items=[];
try{items=JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){items=[]}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(items))}catch(e){}};
let sound=false,actx=null;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const target=t=>{const[h,m]=t.split(':').map(Number);const d=new Date();d.setHours(h,m,0,0);return d.getTime()};
const fmt=ms=>{const s=Math.max(0,Math.floor(ms/1000));return[Math.floor(s/3600),Math.floor(s%3600/60),s%60].map(n=>String(n).padStart(2,'0')).join(':')};
function beep(){if(!sound)return;try{actx=actx||new(window.AudioContext||window.webkitAudioContext)();const o=actx.createOscillator(),g=actx.createGain();o.connect(g);g.connect(actx.destination);o.frequency.value=880;g.gain.value=.2;o.start();o.stop(actx.currentTime+.6)}catch(e){}
 try{navigator.vibrate&&navigator.vibrate([400,200,400])}catch(e){}}
function add(label,time){if(!time)return false;items.push({id:Date.now()+Math.random(),label:label||'막차',time,w30:false,w15:false});save();render();return true}
window.addLastBusAlarm=add;
function render(){list.innerHTML=items.length?items.map(it=>`<div class="al-item" data-id="${it.id}"><div class="al-top"><b>${esc(it.label)}</b><span>막차 ${esc(it.time)}</span></div><div class="al-count" data-c="${it.id}">--:--:--</div><div class="al-msg" data-m="${it.id}"></div><button type="button" class="al-del" data-del="${it.id}">삭제</button></div>`).join(''):'<p class="al-empty">저장된 막차가 없습니다. 위에서 시각을 입력해 추가하세요.</p>';tick()}
function tick(){const now=Date.now();items.forEach(it=>{const left=target(it.time)-now,c=document.querySelector(`[data-c="${it.id}"]`),m=document.querySelector(`[data-m="${it.id}"]`),box=c&&c.closest('.al-item');if(!c)return;
 c.textContent=left>0?fmt(left):'00:00:00';
 let st='ok',msg='여유가 있습니다.';
 if(left<=0){st='gone';msg='막차 시각이 지났습니다. 택시·숙소 송영을 확인하세요.'}
 else if(left<=15*60e3){st='bad';msg='지금 바로 출발하세요!';if(!it.w15){it.w15=true;save();beep()}}
 else if(left<=30*60e3){st='warn';msg='출발 준비를 시작하세요. (30분 이내)';if(!it.w30){it.w30=true;save();beep()}}
 else if(left<=60*60e3){st='warn';msg='1시간 이내입니다.'}
 box.dataset.st=st;m.textContent=msg})}
$('al-add').addEventListener('click',()=>{const t=$('al-time').value;if(!t){$('al-time').focus();return}add($('al-label').value.trim(),t);$('al-label').value=''});
list.addEventListener('click',e=>{const id=e.target.dataset&&e.target.dataset.del;if(!id)return;items=items.filter(i=>String(i.id)!==id);save();render()});
$('al-sound').addEventListener('change',e=>{sound=e.target.checked;if(sound)beep()});
setInterval(tick,1000);render()})();

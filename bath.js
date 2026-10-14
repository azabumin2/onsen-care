(()=>{const $=id=>document.getElementById(id);if(!$('bt'))return;
const STEPS=[
 {n:'1. 수분 보충',s:300,h:'입욕 전에 물을 한 잔 천천히 마시고 몸을 풀어 주세요.'},
 {n:'2. 미온 반신욕 (38~40℃)',s:300,h:'하반신부터 천천히 담그세요. 38~40℃ 정도의 탕에서 시작합니다. 어지러우면 바로 나오세요.'},
 {n:'3. 탕 밖 휴식',s:180,h:'탕에서 나와 앉아서 쉬세요. 서둘러 일어서지 마세요.'},
 {n:'4. 따뜻한 전신욕 (40~42℃, 선택)',s:180,h:'몸 상태가 괜찮을 때만 하세요. 3분 이내로 짧게, 42℃를 넘는 탕은 피하세요.',hot:true},
 {n:'5. 휴식과 수분 보충',s:300,h:'물을 한 잔 마시고 충분히 쉬세요. 몸이 식고 나서 마무리하세요.'}
];
let idx=0,end=null,left=STEPS[0].s,tick=null,wake=null;
const fmt=s=>String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
function usable(i){return !(STEPS[i].hot&&$('bt-skiphot').checked)}
function render(){const st=STEPS[idx];$('bt-step').textContent=st.n;$('bt-hint').textContent=st.h;$('bt-time').textContent=fmt(left);
 $('bt-dots').innerHTML=STEPS.map((x,i)=>`<i class="${i<idx?'done':i===idx?'cur':''}"></i>`).join('');
 $('bt-start').textContent=tick?'일시정지':(left<st.s?'계속':'시작')}
function alertEnd(){if(!$('bt-sound').checked)return;try{navigator.vibrate&&navigator.vibrate([500,200,500])}catch(e){}
 try{const c=new(window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=660;g.gain.value=.2;o.start();o.stop(c.currentTime+.6)}catch(e){}}
function go(next,silent){stop();let i=next;while(i<STEPS.length&&!usable(i))i++;
 if(i>=STEPS.length){idx=STEPS.length-1;left=0;$('bt-step').textContent='마무리';$('bt-hint').textContent='수고하셨습니다. 몸을 충분히 쉬게 해 주세요. 어지러우면 바로 앉아서 쉬세요.';$('bt-time').textContent='00:00';$('bt-dots').innerHTML=STEPS.map(()=>'<i class="done"></i>').join('');$('bt-start').textContent='시작';idx=0;left=STEPS[0].s;if(!silent)alertEnd();return}
 idx=i;left=STEPS[i].s;render()}
function stop(){if(tick){clearInterval(tick);tick=null}end=null;releaseWake()}
async function getWake(){if(!$('bt-wake').checked||!navigator.wakeLock)return;try{wake=await navigator.wakeLock.request('screen')}catch(e){}}
function releaseWake(){try{wake&&wake.release()}catch(e){}wake=null}
function run(){end=Date.now()+left*1000;getWake();tick=setInterval(()=>{left=Math.max(0,Math.ceil((end-Date.now())/1000));$('bt-time').textContent=fmt(left);if(left<=0){alertEnd();go(idx+1,true)}},250);render()}
$('bt-start').addEventListener('click',()=>{if(tick){clearInterval(tick);tick=null;end=null;releaseWake();render()}else{if(!usable(idx))go(idx+1,true);run()}});
$('bt-next').addEventListener('click',()=>go(idx+1,true));
$('bt-reset').addEventListener('click',()=>{stop();idx=0;left=STEPS[0].s;render()});
$('bt-skiphot').addEventListener('change',render);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&tick)getWake()});
render()})();

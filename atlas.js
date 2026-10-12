(()=>{
  const data=window.ONSEN_DATA||[];
  const sources=window.ONSEN_SOURCES||{};
  const images=window.ONSEN_IMAGES||{};
  const order=['茨城県','栃木県','群馬県','埼玉県','千葉県','神奈川県','富山県','福井県','三重県','京都府','大阪府','兵庫県','奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県','徳島県','香川県','愛媛県'];
  const root=document.querySelector('#atlas-groups');
  if(!root||!data.length)return;
  const search=document.querySelector('#onsen-search');
  const select=document.querySelector('#prefecture-filter');
  const chips=document.querySelector('#prefecture-chips');
  const reset=document.querySelector('#filter-reset');
  const result=document.querySelector('#result-copy');
  const empty=document.querySelector('#atlas-empty');
  const sourceLinks=document.querySelector('#source-links');
  const prefs=[...new Set(data.map(item=>item.prefecture))].sort((a,b)=>order.indexOf(a)-order.indexOf(b));

  const escapeHtml=value=>String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const sourceUrl=item=>sources[item.source]?.url||'#';
  const sourceLabel=item=>sources[item.source]?.label||'출처';
  const mapUrl=item=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.prefecture} ${item.name}`)}`;

  prefs.forEach(pref=>{
    select.insertAdjacentHTML('beforeend',`<option value="${escapeHtml(pref)}">${escapeHtml(pref)}</option>`);
    chips.insertAdjacentHTML('beforeend',`<button type="button" data-pref="${escapeHtml(pref)}">${escapeHtml(pref.replace('県',''))}</button>`);
  });
  Object.values(sources).forEach(source=>sourceLinks.insertAdjacentHTML('beforeend',`<a href="${source.url}" target="_blank" rel="noopener">${escapeHtml(source.label)} ↗</a>`));
  document.querySelector('#atlas-count').textContent=data.length;
  document.querySelector('#prefecture-count').textContent=prefs.length;

  function card(item){
    const primary=item.official||sourceUrl(item);
    const primaryLabel=item.official?'실제 사진·공식 보기':'실제 사진·원문 보기';
    return `<article class="onsen-card">
      <div class="onsen-media"><img src="${images[item.kind]||images.mountain}" alt="${escapeHtml(item.name)} 지역의 분위기를 표현한 온천 이메ージ" loading="lazy"><small>AI 분위기 이미지 · 실제 시설 아님</small></div>
      <div class="onsen-body">
        <div class="onsen-kicker"><span>${escapeHtml(item.prefecture)}</span><a style="color:#986c32;border-bottom:1px solid rgba(152,108,50,.35)" href="${sourceUrl(item)}" target="_blank" rel="noopener">${escapeHtml(sourceLabel(item))} ↗</a></div>
        <h4>${escapeHtml(item.name)}</h4>
        <p class="onsen-desc">${escapeHtml(item.description)}</p>
        <div class="transport-box">
          <div class="transport-row"><b>대중교통</b><span>${escapeHtml(item.transit)}</span></div>
          <div class="transport-row"><b>자동차</b><span>${escapeHtml(item.car)}</span></div>
          <div class="transport-row warning"><b>주의</b><span>${escapeHtml(item.caution)}</span></div>
        </div>
        <div class="onsen-actions"><a href="${primary}" target="_blank" rel="noopener">${primaryLabel} ↗</a><a href="${mapUrl(item)}" target="_blank" rel="noopener">지도에서 찾기 ↗</a></div>
      </div>
    </article>`;
  }

  function render(){
    const query=search.value.trim().toLocaleLowerCase('ko-KR');
    const pref=select.value;
    const filtered=data.filter(item=>{
      const haystack=[item.prefecture,item.name,item.description,item.transit,item.car,sourceLabel(item)].join(' ').toLocaleLowerCase('ko-KR');
      return(pref==='all'||item.prefecture===pref)&&(!query||haystack.includes(query));
    });
    const grouped=new Map();
    filtered.forEach(item=>{if(!grouped.has(item.prefecture))grouped.set(item.prefecture,[]);grouped.get(item.prefecture).push(item)});
    root.innerHTML=prefs.filter(prefecture=>grouped.has(prefecture)).map(prefecture=>`<section class="prefecture-group" aria-labelledby="pref-${order.indexOf(prefecture)}"><div class="prefecture-title"><h3 id="pref-${order.indexOf(prefecture)}">${escapeHtml(prefecture)}</h3><span>${grouped.get(prefecture).length} PLACES</span></div><div class="onsen-grid">${grouped.get(prefecture).map(card).join('')}</div></section>`).join('');
    empty.hidden=filtered.length>0;
    result.textContent=`${filtered.length}곳 · ${grouped.size}개 도도부현 표시 중`;
    chips.querySelectorAll('button').forEach(button=>button.classList.toggle('active',button.dataset.pref===pref));
  }

  search.addEventListener('input',render);
  select.addEventListener('change',render);
  chips.addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;select.value=select.value===button.dataset.pref?'all':button.dataset.pref;render()});
  reset.addEventListener('click',()=>{search.value='';select.value='all';render();search.focus()});
  render();
})();

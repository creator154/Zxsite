const app=document.getElementById('app');
const search=document.getElementById('search');
const menuBtn=document.getElementById('menuBtn');
const menuPopup=document.getElementById('menuPopup');
const categories=[['Boards Level Tests','BOARDS'],['JEE Tests','JEE'],['NEET Tests','NEET'],['Dropper Tests','DROPPER'],['Other Batch Tests','OTHER']];
const api=async u=>(await fetch(u)).json();
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
menuBtn.onclick=()=>{menuPopup.classList.toggle('show');menuPopup.setAttribute('aria-hidden',menuPopup.classList.contains('show')?'false':'true')};
document.addEventListener('click',e=>{if(!e.target.closest('.toolbar')){menuPopup.classList.remove('show')}});
function home(){
 menuPopup.classList.remove('show'); search.value='';
 api('/api/batches').then(bs=>{
  app.innerHTML='<div class="container"><div class="categories" id="categories"></div></div>';
  const box=document.getElementById('categories');
  categories.forEach(([title,key])=>{
   const items=bs.filter(b=> key==='DROPPER'?b.category==='Dropper Tests':key==='OTHER'?b.category==='Other Batch Tests':b.exam===key);
   box.insertAdjacentHTML('beforeend',`<section class="category"><button class="category-head"><strong>${title}</strong><span class="arrow">⌄</span></button><div class="batch-list">${items.map(b=>`<button class="batch" data-id="${b.id}"><span>${esc(b.name)}</span><small>${b.count} tests</small><b>›</b></button>`).join('')}</div></section>`);
  });
  box.querySelectorAll('.category-head').forEach(x=>x.onclick=()=>x.parentElement.classList.toggle('open'));
  box.querySelectorAll('.batch').forEach(x=>x.onclick=()=>batch(x.dataset.id));
 });
}
async function batch(id){
 const bs=await api('/api/batches');const b=bs.find(x=>x.id===id);const tests=await api(`/api/batches/${id}/tests`);
 app.innerHTML=`<div class="page"><button class="back" onclick="home()">← Home</button><h1>Available Test Series</h1><p class="page-sub">Batch: ${esc(b?.name||'Batch')}</p><div class="batch-title"><small>${b?.paid?'PAID BATCH':'FREE BATCH'}</small><h2>${esc(b?.name||'Batch')}</h2></div><div id="tests"></div></div>`;
 const tbox=document.getElementById('tests');tbox.innerHTML=tests.map(t=>`<article class="test-card"><h3>${esc(t.name)}</h3><div class="meta"><span>Questions: ${t.questions}</span><span>Date: ${t.date}</span><span>Duration: ${t.duration} min</span></div><div class="buttons"><button class="btn" onclick="instructions('${t.id}')">Instructions</button><button class="btn start" onclick="start('${t.id}')">Start Test</button></div></article>`).join('');
}
async function instructions(id){const t=await api('/api/tests/'+id);app.innerHTML=`<div class="page"><button class="back" onclick="batch('${t.batch.id}')">← Back</button><h1>Test Instructions</h1><p class="page-sub">${esc(t.name)}</p><div class="instructions"><h2>Instructions</h2><ul>${t.instructions.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><button class="btn start full" onclick="start('${id}')">Start Test</button></div></div>`}
async function start(id){const t=await api('/api/tests/'+id);const qs=Array.from({length:Math.min(8,t.questions)},(_,i)=>i+1);app.innerHTML=`<div class="page"><div class="exam-top"><span>Question 1 of ${qs.length}</span><span>${t.duration}:00</span></div>${qs.map(i=>`<article class="question"><b>Q${i}</b><h3>Sample question ${i}</h3>${['Option A','Option B','Option C','Option D'].map((o,j)=>`<label><input type="radio" name="q${i}">${String.fromCharCode(65+j)}. ${o}</label>`).join('')}</article>`).join('')}<button class="btn start full" onclick="alert('Demo test submitted')">Submit Test</button></div>`}
function simple(title,desc){menuPopup.classList.remove('show');app.innerHTML=`<div class="page"><button class="back" onclick="home()">← Home</button><h1>${title}</h1><p class="page-sub">${desc}</p><div class="simple"><h2>${title}</h2><p>This screen is ready for backend integration.</p></div></div>`}
menuPopup.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{const n=b.dataset.nav;if(n==='home')home();else if(n==='dpps')simple("DPP's","Daily practice problems");else if(n==='login')simple('Login','Sign in to your account');else simple('Sign Up','Create your account')});
search.oninput=()=>{clearTimeout(window.timer);window.timer=setTimeout(async()=>{const q=search.value.trim();if(!q){home();return}const bs=await api('/api/batches?q='+encodeURIComponent(q));app.innerHTML=`<div class="page"><button class="back" onclick="home()">← Home</button><h1>Search Results</h1><p class="page-sub">Batches matching “${esc(q)}”</p>${bs.length?bs.map(b=>`<button class="batch" style="background:#fff;border-radius:15px;box-shadow:var(--shadow);margin:12px 0;padding:20px" onclick="batch('${b.id}')"><span>${esc(b.name)}</span><small>${esc(b.category)}</small><b>›</b></button>`).join(''):'<div class="empty">No batches found</div>'}</div>`},180)};
home();

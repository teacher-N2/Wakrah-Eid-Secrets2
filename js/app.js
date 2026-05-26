let score = Number(localStorage.getItem('wakrah_score') || 0);
let done = JSON.parse(localStorage.getItem('wakrah_done') || '{}');
let currentStage = 1;

function scrollToMap(){ document.getElementById('map').scrollIntoView({behavior:'smooth'}); }

function openModal(stage){
  currentStage = stage;
  const pool = QUESTIONS.filter(x => x.stage === stage);
  const q = pool[Math.floor(Math.random()*pool.length)];
  window.currentQ = q;
  document.getElementById('stageName').textContent = stageName(stage);
  document.getElementById('questionText').textContent = q.q;
  document.getElementById('choices').innerHTML = q.choices.map(c => `<button onclick="answer('${safe(c)}')">${c}</button>`).join('');
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = 'feedback';
  document.getElementById('modal').classList.add('show');
}

function safe(s){ return String(s).replaceAll("'", "\\'"); }
function closeModal(){ document.getElementById('modal').classList.remove('show'); }

function answer(choice){
  const fb = document.getElementById('feedback');
  if(choice === window.currentQ.a){
    score += 50;
    done[currentStage] = true;
    localStorage.setItem('wakrah_score', score);
    localStorage.setItem('wakrah_done', JSON.stringify(done));
    fb.textContent = 'أحسنتِ يا بطلة! حصلتِ على ختم جديد ✨';
    fb.className = 'feedback ok';
    playTone();
    confetti();
    updateUI();
  } else {
    fb.textContent = 'إجابة غير صحيحة، حاولي مرة أخرى يا بطلة.';
    fb.className = 'feedback bad';
  }
}

function updateUI(){
  document.getElementById('score').textContent = score;
  const count = Object.keys(done).length;
  const stamps = Array.from({length:5},(_,i)=> i<count ? '★' : '☆').join('');
  document.getElementById('miniStamps').textContent = stamps;
  document.getElementById('stamps').innerHTML = Array.from({length:5},(_,i)=>`<span>${i<count?'★':'☆'}</span>`).join('');
}

function resetGame(){
  score = 0; done = {};
  localStorage.removeItem('wakrah_score');
  localStorage.removeItem('wakrah_done');
  updateUI();
}

function stageName(n){
  return ['','كورنيش اللؤلؤ','سوق الفرح القديم','ميناء النجوم','حديقة التراث','برج سلامة السري'][n];
}

function confetti(){
  for(let i=0;i<30;i++){
    const c=document.createElement('div');
    c.className='confetti';
    c.style.left=Math.random()*100+'vw';
    c.style.background=['#d8aa48','#7a1736','#0f8b8d','#fff'][Math.floor(Math.random()*4)];
    c.style.animationDelay=(Math.random()*.45)+'s';
    document.body.appendChild(c);
    setTimeout(()=>c.remove(),2100);
  }
}

function playTone(){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [523,659,784].forEach((f,i)=>{
      const o=ctx.createOscillator(), g=ctx.createGain();
      o.frequency.value=f; o.type='sine'; o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(.0001, ctx.currentTime+i*.11);
      g.gain.exponentialRampToValueAtTime(.12, ctx.currentTime+i*.11+.03);
      g.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime+i*.11+.18);
      o.start(ctx.currentTime+i*.11); o.stop(ctx.currentTime+i*.11+.2);
    });
  }catch(e){}
}

updateUI();

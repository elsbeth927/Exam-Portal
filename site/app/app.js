(()=>{const R=document.getElementById('root');const API_BASE='https://uxbzfirtxpwpbhlsusmf.supabase.co/functions/v1/exam-api';let state={me:null,csrf:null,view:'dashboard',data:{},token:sessionStorage.getItem('rb_session')||'',setupRequired:false,config:{classes:[]}};const h=(s='')=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));async function api(path,opt={}){const headers={'content-type':'application/json',...(opt.headers||{})};if(state.token)headers['authorization']='Bearer '+state.token;if(state.csrf&&!['GET','HEAD'].includes((opt.method||'GET').toUpperCase()))headers['x-csrf-token']=state.csrf;const r=await fetch(API_BASE+path,{...opt,headers});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'Request failed');return d}
async function publicApi(path,opt={}){
  const headers={'content-type':'application/json',...(opt.headers||{})};
  let r;
  try{
    r=await fetch('/api'+path,{...opt,headers,credentials:'same-origin'});
  }catch(e){
    throw new Error('Could not reach the registration service. Please check your connection and try again.');
  }
  const d=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(d.error||d.message||('Request failed ('+r.status+')'));
  return d;
}
async function init(){if(location.hash.includes('type=recovery')){location.replace('/app/reset.html'+location.hash);return}if(location.hash.includes('type=signup')||location.hash.includes('type=email')){sessionStorage.setItem('rb_email_verified','1');history.replaceState(null,'',location.pathname+location.search)}try{const cfg=await api('/config');state.config=cfg||{classes:[]};state.setupRequired=!!cfg.setup_required;if(cfg.setup_required){location.replace('/app/setup.html');return}const d=await api('/me');state.me=d.user;state.csrf=d.csrf;render()}catch{login()}}
function login(){
  R.innerHTML=`
  <div class="ux-public">
    <header class="ux-public-header">
      <button class="ux-public-brand" type="button" aria-label="Redbridge Exam Platform home">
        <img src="/app/redbridge-logo.svg" alt="Redbridge International School">
        <span>Exam Platform</span>
      </button>
      <nav class="ux-public-nav">
        <button id="browse-public" class="ux-public-link">Exams</button>
        <button id="term-public" class="ux-public-link">Term Exams</button>
        <button id="signin-open" class="ux-public-secondary">Sign in</button>
        <button id="register-open" class="ux-public-primary">Create account</button>
      </nav>
    </header>

    <main>
      <section class="ux-public-hero">
        <div class="ux-public-copy">
          <span class="ux-public-kicker">REDBRIDGE EXAM PLATFORM</span>
          <h1>Focused exams.<br><em>Clear progress.</em></h1>
          <p>One secure academic workspace for IELTS practice, Olympiads, placement tests, term exams and subject assessments.</p>
          <div class="ux-public-actions">
            <button id="hero-register" class="ux-public-primary large">Start taking exams</button>
            <button id="hero-term" class="ux-public-secondary large">Take a Term Exam</button>
          </div>
          <div class="ux-public-trust">
            <span>Timed attempts</span><span>Autosave + resume</span><span>Secure proctoring</span><span>Results</span><span>Certificates</span>
          </div>
        </div>

        <div class="ux-public-product">
          <div class="ux-public-window">
            <div class="ux-public-window-top">
              <div><i></i><i></i><i></i></div><span>Student dashboard</span><b>Secure</b>
            </div>
            <div class="ux-public-window-body">
              <aside>
                <span class="active">⌂</span><span>◷</span><span>★</span><span>◉</span><span>◇</span>
              </aside>
              <div class="ux-public-dashboard">
                <div class="ux-public-welcome"><small>GOOD MORNING</small><h3>Ready for your next exam?</h3><p>Your assessments and results in one place.</p></div>
                <div class="ux-public-dashboard-grid">
                  <article class="ux-demo-next"><small>NEXT TO DO</small><b>English Assessment</b><span>45 min · Foundation</span><button>Start exam</button></article>
                  <article class="ux-demo-stat"><span>Available</span><b>12</b><i></i></article>
                  <article class="ux-demo-stat"><span>Best score</span><b>94%</b><i class="violet"></i></article>
                </div>
                <div class="ux-demo-list">
                  <div><span>01</span><b>Math Olympiad</b><small>60 min</small></div>
                  <div><span>02</span><b>IELTS Practice</b><small>Listening</small></div>
                  <div><span>03</span><b>Science Assessment</b><small>45 min</small></div>
                </div>
              </div>
            </div>
          </div>
          <div class="ux-public-float one"><span>Autosave</span><b>Active</b></div>
          <div class="ux-public-float two"><span>Latest result</span><b>94%</b></div>
        </div>
      </section>

      <section class="ux-public-categories" id="public-exam-section">
        <div class="ux-public-section-head"><div><span class="ux-public-kicker">EXAM LIBRARY</span><h2>Choose what you’re preparing for.</h2></div><p>Clear categories, clear levels, and no clutter.</p></div>
        <div class="ux-public-category-grid">
          ${[
            ['IELTS','Academic & General','◌','blue'],
            ['English Olympiad','Junior & Senior','A','lilac'],
            ['Math Olympiad','Junior & Senior','∑','orange'],
            ['Placement Tests','A1 to C2','↗','blue'],
            ['Subject Exams','English · Math · Science','□','lilac'],
            ['Term Exams','No account required','●','orange']
          ].map(x=>'<button class="ux-public-category public-category '+x[3]+'" data-cat="'+h(x[0])+'"><span>'+x[2]+'</span><div><b>'+h(x[0])+'</b><small>'+h(x[1])+'</small></div><i>↗</i></button>').join('')}
        </div>
      </section>

      <section class="ux-public-experience">
        <div class="ux-public-section-head"><div><span class="ux-public-kicker">ONE DESIGN SYSTEM</span><h2>Three experiences, one platform.</h2></div><p>Students, administrators and candidates each get the interface they need.</p></div>
        <div class="ux-public-experience-grid">
          <article><span class="ux-exp-icon blue">01</span><h3>Student dashboard</h3><p>Upcoming exams, recent results, subject progress and announcements.</p><div class="ux-exp-preview student"><i></i><i></i><i></i></div></article>
          <article><span class="ux-exp-icon lilac">02</span><h3>Secure exam mode</h3><p>Readable questions, time remaining, question navigation and proctoring.</p><div class="ux-exp-preview exam"><i></i><i></i><i></i></div></article>
          <article><span class="ux-exp-icon orange">03</span><h3>Academic operations</h3><p>Exam planning, question banks, submissions and publishing workflows.</p><div class="ux-exp-preview admin"><i></i><i></i><i></i></div></article>
        </div>
      </section>

      <section class="ux-public-secure">
        <div><span class="ux-public-kicker">SECURE MODE</span><h2>Designed for serious assessment.</h2><p>Integrity controls stay visible without getting in the student’s way.</p></div>
        <div class="ux-public-secure-grid">
          <span><b>01</b> Camera permission</span>
          <span><b>02</b> Microphone permission</span>
          <span><b>03</b> Fullscreen monitoring</span>
          <span><b>04</b> Tab-switch warnings</span>
          <span><b>05</b> Autosave + resume</span>
          <span><b>06</b> Verified certificates</span>
        </div>
      </section>
    </main>

    <footer class="ux-public-footer"><span>Redbridge International School · Exam Platform</span><button id="footer-signin">Sign in →</button></footer>
  </div>`;

  const openSignIn=()=>modal(`
    <div class="neo-auth-head"><span class="neo-kicker">WELCOME BACK</span><h3>Sign in to your exam account</h3><p>Access your exams, results and certificates.</p></div>
    <form id="lf" class="stack neo-auth-form">
      <label class="field">Email<input name="email" type="email" autocomplete="email" required></label>
      <label class="field">Password<input name="password" type="password" autocomplete="current-password" required></label>
      <button class="neo-btn big">Sign in</button>
      <button id="forgot" class="auth-link" type="button">Forgot password?</button>
      <div id="le" class="error"></div>
    </form>`,()=>{
      document.getElementById('lf').onsubmit=async e=>{
        e.preventDefault();const data=Object.fromEntries(new FormData(e.target));
        try{const d=await api('/login',{method:'POST',body:JSON.stringify(data)});state.me=d.user;state.csrf=d.csrf;state.token=d.session_token||'';if(state.token)sessionStorage.setItem('rb_session',state.token);closeModal();state.view='dashboard';render()}
        catch(x){document.getElementById('le').textContent=x.message}
      };
      document.getElementById('forgot').onclick=()=>modal('<div class="neo-auth-head"><span class="neo-kicker">PASSWORD RESET</span><h3>Reset your password</h3></div><form id="fpf" class="stack"><label class="field">Registered email<input name="email" type="email" required></label><button class="neo-btn">Send reset link</button><div id="fpe" class="error"></div><div id="fpok" class="success"></div></form>',()=>document.getElementById('fpf').onsubmit=async e=>{e.preventDefault();const o=Object.fromEntries(new FormData(e.target));try{const d=await publicApi('/auth/forgot-password',{method:'POST',body:JSON.stringify(o)});document.getElementById('fpok').textContent=d.message||'If the email exists, a reset link has been sent.'}catch(x){document.getElementById('fpe').textContent=x.message}});
    });

  const openRegister=()=>{location.href='/app/register.html'};
  document.getElementById('signin-open').onclick=openSignIn;
  document.getElementById('footer-signin').onclick=openSignIn;
  document.getElementById('register-open').onclick=openRegister;
  document.getElementById('hero-register').onclick=openRegister;
  document.getElementById('hero-term').onclick=()=>openTermExamChooser();
  document.getElementById('term-public').onclick=()=>openTermExamChooser();
  document.getElementById('browse-public').onclick=()=>document.getElementById('public-exam-section').scrollIntoView({behavior:'smooth'});
  document.querySelectorAll('.public-category').forEach(b=>b.onclick=()=>b.dataset.cat==='Term Exams'?openTermExamChooser():openRegister());
}
function navItems(){
  const r=state.me.role;
  if(r==='student')return[['dashboard','Discover'],['ielts','IELTS'],['olympiads','Olympiads'],['student-exams','My Exams'],['student-results','Results'],['certificates','Certificates']];
  return [['dashboard','Overview'],['exams','Exams'],['questions','Question Bank'],['marking','Submissions']];
}
function navIcon(k){return ({dashboard:'⌂',ielts:'I',olympiads:'★','student-exams':'◫','student-results':'◉',certificates:'◇',exams:'▣',questions:'?','marking':'✓'}[k]||'•')}
function render(){
  const items=navItems();
  const admin=state.me.role!=='student';
  R.innerHTML=`
  <div class="neo-app ${admin?'admin-shell':'student-shell'}">
    <aside class="neo-sidebar">
      <button class="neo-side-brand" id="home-logo"><img src="/app/redbridge-logo.svg" alt="Redbridge"><span>Exam Platform</span></button>
      <div class="neo-side-section">${items.map(([k,l])=>'<button data-v="'+k+'" class="'+(state.view===k?'active':'')+'"><span>'+navIcon(k)+'</span>'+h(l)+'</button>').join('')}</div>
      <div class="neo-side-bottom">
        ${admin?'<div class="neo-admin-pill"><i></i><div><b>Admin mode</b><small>Exam operations</small></div></div>':'<div class="neo-admin-pill"><i class="green"></i><div><b>Candidate</b><small>Secure exam account</small></div></div>'}
        <button id="logout" class="neo-signout">Sign out</button>
      </div>
    </aside>
    <main class="neo-main">
      <header class="neo-topbar">
        <div><span class="neo-kicker">${admin?'ADMIN CONSOLE':'CANDIDATE PORTAL'}</span><h2>${h(items.find(x=>x[0]===state.view)?.[1]||'Exam Platform')}</h2></div>
        <div class="neo-profile"><div><b>${h(state.me.first_name+' '+state.me.last_name)}</b><small>${h(state.me.email||state.me.role.replaceAll('_',' '))}</small></div><span>${h((state.me.first_name||'R').slice(0,1)+(state.me.last_name||'').slice(0,1))}</span></div>
      </header>
      <div id="page" class="neo-page"></div>
    </main>
  </div>`;
  document.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{state.view=b.dataset.v;render()});
  document.getElementById('home-logo').onclick=()=>{state.view='dashboard';render()};
  document.getElementById('logout').onclick=async()=>{try{await api('/logout',{method:'POST',body:'{}'})}finally{sessionStorage.removeItem('rb_session');state={me:null,csrf:null,view:'dashboard',data:{},token:'',setupRequired:false,config:state.config||{classes:[]}};login()}};
  loadView();
}

function examCategory(x){
  const t=((x&&x.title||'')+' '+(x&&x.subject||'')+' '+(x&&x.exam_type||'')).toLowerCase();
  if(t.includes('ielts'))return 'IELTS';
  if(t.includes('math')&&t.includes('olympiad'))return 'Math Olympiad';
  if(t.includes('english')&&t.includes('olympiad'))return 'English Olympiad';
  if(t.includes('olympiad'))return 'Olympiad';
  if(t.includes('placement'))return 'Placement';
  if(t.includes('term'))return 'Term Exam';
  return (x&&x.subject)||'Exam';
}
function examGroup(x){
  const t=((x&&x.title)||'').toLowerCase();
  if(t.includes('junior'))return 'Junior';
  if(t.includes('senior'))return 'Senior';
  if(t.includes('primary'))return 'Primary';
  if(t.includes('advanced'))return 'Advanced';
  if(t.includes('elementary'))return 'Foundation';
  return 'Open level';
}
function examCard(x){
  const cat=examCategory(x);
  const resume=x.attempt_status==='IN_PROGRESS';
  return '<article class="neo-exam-card" data-category="'+h(cat)+'"><div class="neo-exam-accent"></div><div class="neo-card-top"><span class="neo-chip">'+h(cat)+'</span><span class="neo-muted">'+h(examGroup(x))+'</span></div><h3>'+h(x.title)+'</h3><div class="neo-exam-meta"><span>◷ '+h(x.duration_min)+' min</span><span>◎ '+h(x.subject||cat)+'</span></div><div class="neo-exam-foot"><span>'+(resume?'Attempt in progress':'Ready when you are')+'</span><button class="neo-btn start" data-id="'+x.id+'">'+(resume?'Resume':'Start exam')+'</button></div></article>';
}
function bindExamStart(b){
  b.onclick=async function(){
    const card=b.closest('.neo-exam-card')||b.closest('.card');
    const title=card&&card.querySelector('h3')?card.querySelector('h3').textContent:'this exam';
    const isResume=b.textContent.trim().toLowerCase().includes('resume');
    const msg=isResume?'You already have this exam in progress. Resume now?':'Before you begin, make sure you are ready. Proctoring is required for every exam. Continue to the secure setup screen?';
    if(!confirm(msg))return;
    const original=b.textContent;
    b.disabled=true;b.textContent='Opening…';
    try{
      const d=await api('/student/exams/'+b.dataset.id+'/start',{method:'POST',body:'{}'});
      if(!d||!d.attempt_id)throw new Error('The exam could not be opened. No attempt was created.');
      await exam(d.attempt_id);
    }catch(err){
      b.disabled=false;b.textContent=original;
      alert(err.message||'The exam could not be opened. Please try again.');
    }
  };
}


function renderIELTSModule(series,module){
  if(!series.length)return '<div class="neo-empty">'+h(module)+' practice sets are being prepared.</div>';
  return '<div class="ielts-series-grid">'+series.map(([name,items],idx)=>{
    const order=['Full Mock','Listening','Reading','Writing','Speaking'];
    items.sort((a,b)=>order.indexOf(a.skill)-order.indexOf(b.skill));
    return '<article class="ielts-volume"><div class="ielts-volume-top"><div><span class="neo-kicker">PRACTICE VOLUME '+String(idx+1).padStart(2,'0')+'</span><h3>'+h(name)+'</h3></div><span class="ielts-volume-no">'+String(idx+1).padStart(2,'0')+'</span></div>'+
      '<div class="ielts-skill-list">'+items.map(x=>'<div class="ielts-skill-row"><div><b>'+h(x.skill||'IELTS')+'</b><small>'+h(x.delivery_mode||'Practice')+' · '+h(x.duration_min)+' min</small></div><button class="neo-btn sm ielts-start" data-id="'+x.id+'">'+(x.attempt_status==='IN_PROGRESS'?'Resume':'Start')+'</button></div>').join('')+'</div></article>';
  }).join('')+'</div>';
}
function ieltsQuestionResource(q){
  let out='';
  if(q.audio_script)out+='<div class="ielts-audio-card"><div><span class="neo-kicker">LISTENING</span><b>'+h(q.audio_label||'Play audio')+'</b><small>Original Redbridge practice recording generated in your browser.</small></div><button type="button" class="neo-btn sm ielts-audio-play" data-script="'+encodeURIComponent(q.audio_script)+'">▶ Play once</button></div>';
  if(q.passage)out+='<details class="ielts-passage" open><summary><span class="neo-kicker">READING PASSAGE</span> '+h(q.passage_title||'Passage')+'</summary><div class="ielts-passage-body">'+h(q.passage).replaceAll('\\n','<br>')+'</div></details>';
  return out;
}
function bindIELTSAudio(){
  document.querySelectorAll('.ielts-audio-play').forEach(btn=>btn.onclick=()=>{
    if(!('speechSynthesis' in window)){alert('Audio playback is not supported in this browser.');return}
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(decodeURIComponent(btn.dataset.script||''));u.lang='en-GB';u.rate=.92;u.pitch=1;
    const voices=speechSynthesis.getVoices();const v=voices.find(x=>/^en-GB/i.test(x.lang))||voices.find(x=>/^en/i.test(x.lang));if(v)u.voice=v;
    btn.disabled=true;btn.textContent='Playing…';u.onend=u.onerror=()=>{btn.disabled=false;btn.textContent='▶ Play once'};speechSynthesis.speak(u);
  });
}


function olympiadTopics(subject){
  if(subject==='Math')return ['Algebra','Number Theory','Geometry','Combinatorics','Logic'];
  if(subject==='Science')return ['Biology','Chemistry','Physics','Scientific Reasoning'];
  return ['Word & Structure','Reading','Expression','Achievers'];
}

async function loadView(){const P=document.getElementById('page');P.innerHTML='<div class="card">Loading…</div>';try{if(state.view==='dashboard'){
  if(state.me.role==='student'){
    const es=await api('/student/exams');
    const rs=await api('/student/results');
    const released=rs.filter(x=>x.results_published);
    const best=released.length?Math.max(...released.map(x=>Number(x.percentage||0))):0;
    const first=(state.me.first_name||'Candidate');
    const inProgress=es.filter(x=>x.attempt_status==='IN_PROGRESS');
    const available=es.filter(x=>x.attempt_status!=='COMPLETED');
    const recentResults=released.slice().sort((a,b)=>new Date(b.submitted_at||b.updated_at||0)-new Date(a.submitted_at||a.updated_at||0)).slice(0,4);
    const completedCount=released.length;
    const subjectMap={};
    released.forEach(r=>{
      const key=r.subject||r.exam_subject||'General';
      if(!subjectMap[key])subjectMap[key]=[];
      subjectMap[key].push(Number(r.percentage||0));
    });
    const subjectProgress=Object.entries(subjectMap).map(([name,vals])=>({name,avg:Math.round(vals.reduce((a,b)=>a+b,0)/Math.max(1,vals.length)),count:vals.length})).sort((a,b)=>b.avg-a.avg).slice(0,5);
    const nextExams=(inProgress.length?inProgress:available).slice(0,4);

    P.innerHTML=
      '<section class="ux-student-head">'+
        '<div><span class="ux-overline">STUDENT DASHBOARD</span><h1>Good morning, '+h(first)+'.</h1><p>Everything you need for your next assessment, progress and results.</p></div>'+
        '<div class="ux-student-profile-card"><div class="ux-avatar">'+h((state.me.first_name||'R').slice(0,1)+(state.me.last_name||'').slice(0,1))+'</div><div><b>'+h(state.me.first_name+' '+state.me.last_name)+'</b><small>'+h(state.me.email||'Candidate')+'</small></div></div>'+
      '</section>'+

      '<section class="ux-overview-grid">'+
        '<article class="ux-feature-card ux-feature-blue"><div class="ux-feature-copy"><span class="ux-card-label">NEXT TO DO</span><h2>'+(nextExams[0]?h(nextExams[0].title):'You are all caught up')+'</h2><p>'+(nextExams[0]?(h(nextExams[0].subject||examCategory(nextExams[0]))+' · '+h(nextExams[0].duration_min)+' min'):'No active exams are waiting for you.')+'</p>'+(nextExams[0]?'<button class="ux-primary start" data-id="'+nextExams[0].id+'">'+(nextExams[0].attempt_status==='IN_PROGRESS'?'Resume exam':'Start exam')+'</button>':'')+'</div><div class="ux-feature-art"><span></span><i></i><b>✓</b></div></article>'+
        '<article class="ux-kpi-card"><span>Available exams</span><strong>'+es.length+'</strong><small>Ready in your catalogue</small><div class="ux-mini-bar"><i style="width:'+Math.min(100,Math.max(8,es.length/5))+'%"></i></div></article>'+
        '<article class="ux-kpi-card"><span>Completed</span><strong>'+completedCount+'</strong><small>Published results</small><div class="ux-mini-bar alt"><i style="width:'+Math.min(100,completedCount*12)+'%"></i></div></article>'+
        '<article class="ux-kpi-card"><span>Personal best</span><strong>'+Math.round(best)+'%</strong><small>Your highest released score</small><div class="ux-ring" style="--p:'+Math.round(best)+'"><b>'+Math.round(best)+'</b></div></article>'+
      '</section>'+

      '<section class="ux-dashboard-columns">'+
        '<div class="ux-main-column">'+
          '<article class="ux-panel"><div class="ux-panel-head"><div><span class="ux-card-label">EXAM CENTRE</span><h2>Upcoming & available</h2></div><button class="ux-link" id="ux-all-exams">View all →</button></div><div class="ux-exam-list">'+
            (nextExams.length?nextExams.map((x,i)=>'<div class="ux-exam-row"><div class="ux-exam-index">'+String(i+1).padStart(2,'0')+'</div><div class="ux-exam-info"><span>'+h(examCategory(x))+'</span><b>'+h(x.title)+'</b><small>'+h(x.subject||examCategory(x))+' · '+h(x.duration_min)+' min · '+h(examGroup(x))+'</small></div><button class="ux-row-action start" data-id="'+x.id+'">'+(x.attempt_status==='IN_PROGRESS'?'Resume':'Start')+'</button></div>').join(''):'<div class="ux-empty">No exams are currently available.</div>')+
          '</div></article>'+

          '<article class="ux-panel"><div class="ux-panel-head"><div><span class="ux-card-label">PERFORMANCE</span><h2>Subject progress</h2></div><button class="ux-link" id="ux-results">Results →</button></div><div class="ux-progress-list">'+
            (subjectProgress.length?subjectProgress.map(s=>'<div class="ux-progress-row"><div><b>'+h(s.name)+'</b><small>'+s.count+' released result'+(s.count===1?'':'s')+'</small></div><div class="ux-progress-track"><i style="width:'+Math.max(4,Math.min(100,s.avg))+'%"></i></div><strong>'+s.avg+'%</strong></div>').join(''):'<div class="ux-empty">Subject progress will appear after results are published.</div>')+
          '</div></article>'+
        '</div>'+

        '<aside class="ux-side-column">'+
          '<article class="ux-panel ux-calendar-card"><div class="ux-panel-head"><div><span class="ux-card-label">THIS WEEK</span><h2>Exam planner</h2></div></div><div class="ux-week-strip">'+['M','T','W','T','F','S','S'].map((d,i)=>'<span class="'+(i===new Date().getDay()-1?'today':'')+'"><b>'+d+'</b><small>'+(new Date(Date.now()+(i-(new Date().getDay()-1))*86400000)).getDate()+'</small></span>').join('')+'</div><div class="ux-planner-note"><i></i><div><b>'+inProgress.length+' exam'+(inProgress.length===1?'':'s')+' in progress</b><small>'+(inProgress.length?'Continue before starting another assessment.':'You have no unfinished attempts.')+'</small></div></div></article>'+

          '<article class="ux-panel"><div class="ux-panel-head"><div><span class="ux-card-label">RECENT</span><h2>Results</h2></div></div><div class="ux-result-list">'+
            (recentResults.length?recentResults.map(r=>'<div class="ux-result-row"><div><b>'+h(r.exam_title||r.title||'Assessment')+'</b><small>'+h(r.subject||'Exam')+'</small></div><strong>'+Math.round(Number(r.percentage||0))+'%</strong></div>').join(''):'<div class="ux-empty">No released results yet.</div>')+
          '</div></article>'+

          '<article class="ux-panel ux-notice-card"><div class="ux-panel-head"><div><span class="ux-card-label">NOTICE BOARD</span><h2>Announcements</h2></div></div><div class="ux-notice"><span>i</span><div><b>Secure exam reminder</b><p>For proctored exams, allow camera and microphone access and stay in fullscreen mode.</p></div></div><div class="ux-notice"><span>✓</span><div><b>Autosave is active</b><p>Your answers are saved automatically during supported exams.</p></div></div></article>'+
        '</aside>'+
      '</section>';

    document.getElementById('ux-all-exams').onclick=()=>{state.view='student-exams';render()};
    document.getElementById('ux-results').onclick=()=>{state.view='student-results';render()};
    document.querySelectorAll('.start').forEach(bindExamStart);
  }else{
    const d=await api('/dashboard');
    const stats=Object.entries(d);
    const adminName=(state.me.first_name||'Administrator');
    P.innerHTML=
      '<section class="rb-admin-hero"><div><span class="neo-kicker">ACADEMIC OPERATIONS</span><p class="rb-admin-welcome">Good day, '+h(adminName)+'.</p><h1>Everything important, <em>in view.</em></h1><p>Plan assessments, manage content, review submissions and keep exam operations moving without losing context.</p></div><div class="rb-admin-command"><span>QUICK ACTION</span><h3>Create or schedule an assessment</h3><button class="neo-btn" id="go-exams">Open exam manager <b>→</b></button></div></section>'+
      '<section class="rb-admin-metrics">'+stats.slice(0,4).map((x,i)=>'<article><span class="rb-admin-index">0'+(i+1)+'</span><small>'+h(String(x[0]).replaceAll('_',' '))+'</small><strong>'+h(x[1])+'</strong><i></i></article>').join('')+'</section>'+
      '<section class="rb-admin-workspace"><div class="rb-admin-work-head"><div><span class="neo-kicker">WORKSPACE</span><h2>What needs your attention?</h2></div><p>Core assessment workflows, organised around the work rather than around system tables.</p></div><div class="rb-admin-action-grid">'+
      '<button data-go="exams"><span class="rb-action-icon">01</span><div><b>Exam planning</b><small>Create, configure and schedule assessments.</small></div><i>↗</i></button>'+
      '<button data-go="questions"><span class="rb-action-icon">02</span><div><b>Question bank</b><small>Build and maintain reusable assessment content.</small></div><i>↗</i></button>'+
      '<button data-go="marking"><span class="rb-action-icon">03</span><div><b>Submissions</b><small>Review written work, mark and publish outcomes.</small></div><i>↗</i></button>'+
      '</div></section>';
    document.getElementById('go-exams').onclick=()=>{state.view='exams';render()};
    document.querySelectorAll('[data-go]').forEach(x=>x.onclick=()=>{state.view=x.dataset.go;render()});
  }
}
else if(state.view==='classes'){const [cs,ss]=await Promise.all([api('/classes'),api('/subjects')]);P.innerHTML='<div class="grid"><div class="card"><h3 class="section-title">Classes</h3><form id="cf" class="row"><input name="name" placeholder="10A" required><input name="grade" type="number" min="1" max="11" placeholder="Grade" required><button class="btn sm">Add</button></form><table class="table"><tbody>'+cs.map(x=>'<tr><td>'+h(x.name)+'</td><td>Grade '+h(x.grade)+'</td></tr>').join('')+'</tbody></table></div><div class="card"><h3 class="section-title">Subjects</h3><form id="sf" class="row"><input name="name" placeholder="Mathematics" required><button class="btn sm">Add</button></form><table class="table"><tbody>'+ss.map(x=>'<tr><td>'+h(x.name)+'</td></tr>').join('')+'</tbody></table></div></div>';document.getElementById('cf').onsubmit=e=>submitForm(e,'/classes');document.getElementById('sf').onsubmit=e=>submitForm(e,'/subjects')}
else if(state.view==='users'){const rows=await api('/users');P.innerHTML='<div class="card"><div class="row" style="justify-content:space-between"><h3 class="section-title">School users</h3><button id="nu" class="btn sm">New user</button></div><table class="table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead><tbody>'+rows.map(x=>'<tr><td>'+h(x.first_name+' '+x.last_name)+'</td><td>'+h(x.email)+'</td><td>'+h(x.role)+'</td><td>'+h(x.status)+'</td></tr>').join('')+'</tbody></table></div>';document.getElementById('nu').onclick=()=>modal('<h3>New user</h3><form id="uf" class="stack"><label class="field">First name<input name="first_name" required></label><label class="field">Last name<input name="last_name" required></label><label class="field">Email<input name="email" type="email" required></label><label class="field">Role<select name="role"><option>student</option><option>teacher</option><option>academic_admin</option></select></label><label class="field">Temporary password<input name="password" type="password" required></label><button class="btn">Create</button></form>',()=>document.getElementById('uf').onsubmit=e=>submitForm(e,'/users',true))}
else if(state.view==='questions'){const [qs,ss]=await Promise.all([api('/questions'),api('/subjects')]);P.innerHTML='<div class="card"><div class="row" style="justify-content:space-between"><h3 class="section-title">Question bank</h3><button id="nq" class="btn sm">New question</button></div><table class="table"><thead><tr><th>Question</th><th>Subject</th><th>Grade</th><th>Type</th></tr></thead><tbody>'+qs.map(x=>'<tr><td>'+h(x.text)+'</td><td>'+h(x.subject)+'</td><td>'+h(x.grade)+'</td><td>'+h(x.type)+'</td></tr>').join('')+'</tbody></table></div>';document.getElementById('nq').onclick=()=>modal('<h3>New question</h3><form id="qf" class="stack"><label class="field">Subject<select name="subject_id">'+ss.map(s=>'<option value="'+s.id+'">'+h(s.name)+'</option>').join('')+'</select></label><label class="field">Grade<input name="grade" type="number" min="1" max="11" value="9"></label><label class="field">Question<textarea name="text" required></textarea></label><label class="field">Type<select name="type"><option value="mcq">Multiple choice</option><option value="truefalse">True/False</option><option value="short">Short answer</option><option value="numeric">Numeric</option></select></label><label class="field">Options (comma separated for MCQ)<input name="options"></label><label class="field">Correct answer<input name="correct" required></label><label class="field">Difficulty<select name="difficulty"><option>easy</option><option selected>medium</option><option>hard</option><option>olympiad</option></select></label><label class="field">Marks<input name="marks" type="number" min=".25" step=".25" value="1"></label><button class="btn">Save question</button></form>',()=>document.getElementById('qf').onsubmit=async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));if(f.type==='mcq')f.options=f.options.split(',').map(x=>x.trim()).filter(Boolean);if(f.type==='multi')f.correct=f.correct.split(',').map(x=>x.trim());if(f.type==='short')f.correct=[f.correct];if(f.type==='numeric')f.correct={value:Number(f.correct),tolerance:0};await api('/questions',{method:'POST',body:JSON.stringify(f)});closeModal();loadView()})}
else if(state.view==='exams'){
  const [es,ss,qs]=await Promise.all([api('/exams'),api('/subjects'),api('/questions')]);
  P.innerHTML='<div class="neo-section-head"><div><span class="neo-kicker">ADMIN</span><h2>Exams</h2></div><button id="ne" class="neo-btn">Create exam</button></div>'+
    '<div class="card"><table class="table"><thead><tr><th>Exam</th><th>Subject</th><th>Category</th><th>Status</th><th>Duration</th><th></th></tr></thead><tbody>'+
    es.map(x=>'<tr><td><b>'+h(x.title)+'</b></td><td>'+h(x.subject)+'</td><td><span class="badge">'+h(x.exam_type||'Exam')+'</span></td><td><span class="badge">'+h(x.status)+'</span></td><td>'+h(x.duration_min)+' min</td><td><button class="btn sm sched" data-id="'+x.id+'">Schedule</button></td></tr>').join('')+
    '</tbody></table></div>';
  document.getElementById('ne').onclick=()=>modal(
    '<div class="neo-auth-head"><span class="neo-kicker">NEW EXAM</span><h3>Create an assessment</h3><p>Organize exams by category and level. No class assignment is required.</p></div>'+
    '<form id="ef" class="stack">'+
    '<label class="field">Title<input name="title" required></label>'+
    '<label class="field">Category<select name="exam_type"><option>IELTS</option><option>English Olympiad</option><option>Math Olympiad</option><option>Olympiad</option><option>Placement</option><option>Subject Exam</option><option value="Term Exam">Term Exam — no login required</option><option>Exam</option></select></label>'+
    '<label class="field">Subject<select name="subject_id">'+ss.map(s=>'<option value="'+s.id+'">'+h(s.name)+'</option>').join('')+'</select></label>'+
    '<div class="neo-form-grid"><label class="field">Level number<input name="grade" type="number" min="1" max="20" value="1"></label><label class="field">Duration (minutes)<input name="duration_min" type="number" value="45"></label></div>'+
    '<label class="field">Pass %<input name="pass_percent" type="number" min="0" max="100" value="50"></label>'+
    '<div class="field"><span>Questions</span><div class="question-picker">'+qs.map(q=>'<label><input type="checkbox" name="question_ids" value="'+q.id+'"> '+h(q.text)+'</label>').join('')+'</div></div>'+
    '<button class="neo-btn">Create exam</button></form>',
    ()=>document.getElementById('ef').onsubmit=async e=>{
      e.preventDefault();const fd=new FormData(e.target),o=Object.fromEntries(fd);o.question_ids=fd.getAll('question_ids').map(Number);
      await api('/exams',{method:'POST',body:JSON.stringify(o)});closeModal();loadView();
    }
  );
  document.querySelectorAll('.sched').forEach(btn=>btn.onclick=()=>modal(
    '<div class="neo-auth-head"><span class="neo-kicker">SCHEDULE</span><h3>Open this exam</h3><p>Once scheduled, the exam is available to eligible candidates in the exam catalog. Term Exams appear in the no-login Term Exam flow.</p></div>'+
    '<form id="scf" class="stack"><label class="field">Opens<input name="start_time" type="datetime-local"></label><label class="field">Closes<input name="end_time" type="datetime-local"></label><button class="neo-btn">Schedule globally</button></form>',
    ()=>document.getElementById('scf').onsubmit=async e=>{
      e.preventDefault();const o=Object.fromEntries(new FormData(e.target));o.class_ids=[];o.student_ids=[];
      if(o.start_time)o.start_time=new Date(o.start_time).toISOString();if(o.end_time)o.end_time=new Date(o.end_time).toISOString();
      await api('/exams/'+btn.dataset.id+'/schedule',{method:'POST',body:JSON.stringify(o)});closeModal();loadView();
    }
  ));
}
else if(state.view==='marking'){
  const rows=await api('/marking/submissions');
  P.innerHTML='<div class="card"><div class="row" style="justify-content:space-between;align-items:center"><div><h3 class="section-title">Teacher marking</h3><div class="mut">Open a submitted written paper, award marks question by question, then publish results when ready.</div></div></div>'+
  (rows.length?'<div class="marking-table-wrap"><table class="table"><thead><tr><th>Student</th><th>Class</th><th>Exam</th><th>Submitted</th><th>Score</th><th>Status</th><th></th></tr></thead><tbody>'+
  rows.map(x=>'<tr><td><b>'+h(x.first_name+' '+x.last_name)+'</b><div class="mut small">'+h(x.email)+'</div></td><td>'+h(x.class_name||'—')+'</td><td>'+h(x.title)+'</td><td>'+h(x.submitted_at?new Date(x.submitted_at).toLocaleString():'—')+'</td><td>'+h(x.score)+' / '+h(x.total)+'</td><td><span class="badge">'+(x.results_published?'Published':'Awaiting publication')+'</span></td><td><button class="btn sm open-marking" data-id="'+x.id+'">Mark paper</button></td></tr>').join('')+
  '</tbody></table></div>':'<div class="empty-state">No submitted written exams are waiting for marking.</div>')+'</div>';
  document.querySelectorAll('.open-marking').forEach(b=>b.onclick=()=>openMarking(Number(b.dataset.id)));
}
else if(state.view==='term-exams'){await showPublicTermExams(true);return}
else if(state.view==='ielts'){
  const es=(await api('/student/exams')).filter(x=>x.product_family==='IELTS'||examCategory(x)==='IELTS');
  const modules=['Academic','General Training'];
  const current='Academic';
  const academic=es.filter(x=>(x.module||'Academic')==='Academic');
  const bySeries={};
  academic.forEach(x=>{const k=x.series||x.title;bySeries[k]??=[];bySeries[k].push(x)});
  const series=Object.entries(bySeries).sort((a,b)=>a[0].localeCompare(b[0]));
  P.innerHTML=
    '<section class="ielts-hero"><div><span class="neo-kicker">IELTS TEST CENTER</span><h1>Practice by skill or simulate the full test.</h1><p>Original Redbridge IELTS-style material arranged around the official IELTS structure: Listening, Reading, Writing and full Academic simulations.</p><div class="ielts-official-note">Academic mock · Listening 40 questions · Reading 40 questions · Writing 2 tasks</div></div><div class="ielts-band-card"><small>Target band</small><strong>7.0+</strong><span>Practice → review → retake</span></div></section>'+
    '<div class="ielts-tabs"><button class="active" data-module="Academic">Academic</button><button data-module="General Training">General Training</button></div>'+
    '<section id="ielts-module-content">'+renderIELTSModule(series,current)+'</section>';
  document.querySelectorAll('.ielts-tabs button').forEach(btn=>btn.onclick=()=>{
    document.querySelectorAll('.ielts-tabs button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
    const mod=btn.dataset.module;
    const rows=es.filter(x=>(x.module||'Academic')===mod);
    const grouped={};rows.forEach(x=>{const k=x.series||x.title;grouped[k]??=[];grouped[k].push(x)});
    document.getElementById('ielts-module-content').innerHTML=renderIELTSModule(Object.entries(grouped).sort((a,b)=>a[0].localeCompare(b[0])),mod);
    document.querySelectorAll('.ielts-start').forEach(bindExamStart);
  });
  document.querySelectorAll('.ielts-start').forEach(bindExamStart);
}
else if(state.view==='olympiads'){
  const es=(await api('/student/exams')).filter(x=>x.product_family==='Olympiad');
  const subjects=['Math','Science','English'];
  let selectedSubject='Math',selectedGroup='Junior';
  const renderOlympiad=()=>{
    const rows=es.filter(x=>x.module===selectedSubject&&x.group_label===selectedGroup);
    document.getElementById('olympiad-content').innerHTML=
      '<div class="olympiad-toolbar"><div class="olympiad-subject-tabs">'+subjects.map(s=>'<button class="'+(s===selectedSubject?'active':'')+'" data-osub="'+s+'">'+s+'</button>').join('')+'</div>'+
      '<div class="olympiad-group-tabs"><button class="'+(selectedGroup==='Junior'?'active':'')+'" data-ogrp="Junior">Junior</button><button class="'+(selectedGroup==='Senior'?'active':'')+'" data-ogrp="Senior">Senior</button></div></div>'+
      '<div class="olympiad-paper-grid">'+(rows.length?rows.sort((a,b)=>a.title.localeCompare(b.title)).map((x,i)=>'<article class="olympiad-paper"><div class="olympiad-paper-no">'+String(i+1).padStart(2,'0')+'</div><div><span class="neo-kicker">'+h(selectedSubject.toUpperCase())+' · '+h(selectedGroup.toUpperCase())+'</span><h3>'+h(x.title.replace('Redbridge ','').replace(' — '+selectedGroup,''))+'</h3><p>'+h(x.duration_min)+' minutes · 25 questions · Practice mode</p><div class="olympiad-tags">'+olympiadTopics(selectedSubject).map(t=>'<span>'+h(t)+'</span>').join('')+'</div></div><button class="neo-btn olympiad-start" data-id="'+x.id+'">'+(x.attempt_status==='IN_PROGRESS'?'Resume':'Start paper')+'</button></article>').join(''):'<div class="neo-empty">No practice papers are available for this selection.</div>')+'</div>';
    document.querySelectorAll('[data-osub]').forEach(b=>b.onclick=()=>{selectedSubject=b.dataset.osub;renderOlympiad()});
    document.querySelectorAll('[data-ogrp]').forEach(b=>b.onclick=()=>{selectedGroup=b.dataset.ogrp;renderOlympiad()});
    document.querySelectorAll('.olympiad-start').forEach(bindExamStart);
  };
  P.innerHTML='<section class="olympiad-hero"><div><span class="neo-kicker">GLOBAL OLYMPIAD PRACTICE</span><h1>Train the skills behind the world’s leading competitions.</h1><p>Original Redbridge papers informed by international Olympiad structures—without copying proprietary competition questions.</p></div><div class="olympiad-count"><strong>'+es.length+'</strong><span>practice papers</span></div></section><div id="olympiad-content"></div>';
  renderOlympiad();
}
else if(state.view==='student-exams'){
  const es=await api('/student/exams');
  const cats=['All',...new Set(es.map(examCategory))];
  P.innerHTML='<div class="neo-section-head"><div><span class="neo-kicker">EXAM LIBRARY</span><h2>Explore exams</h2></div><p>Choose a category, then start when you are ready.</p></div>'+
    '<div class="neo-filter-row">'+cats.map((x,i)=>'<button class="neo-filter '+(i===0?'active':'')+'" data-filter="'+h(x)+'">'+h(x)+'</button>').join('')+'</div>'+
    '<div class="neo-exam-grid">'+(es.length?es.map(examCard).join(''):'<div class="neo-empty">No exams are available yet.</div>')+'</div>';
  document.querySelectorAll('.start').forEach(bindExamStart);
  document.querySelectorAll('.neo-filter').forEach(btn=>btn.onclick=()=>{
    document.querySelectorAll('.neo-filter').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.neo-exam-card').forEach(card=>card.hidden=btn.dataset.filter!=='All'&&card.dataset.category!==btn.dataset.filter);
  });
}
else if(state.view==='student-results'){const rs=await api('/student/results');P.innerHTML='<div class="card"><table class="table"><thead><tr><th>Exam</th><th>Score</th><th>%</th><th>Status</th><th></th></tr></thead><tbody>'+rs.map(x=>'<tr><td>'+h(x.title)+'</td><td>'+(x.results_published?h(x.score+'/'+x.total):'Not released')+'</td><td>'+(x.results_published?h(x.percentage):'—')+'</td><td>'+h(x.results_published?(x.passed?'Pass':'Below pass mark'):'Pending')+'</td><td>'+(x.results_published?'<button class="btn sm review-result" data-id="'+x.id+'">Review answers</button>':'')+'</td></tr>').join('')+'</tbody></table></div>';document.querySelectorAll('.review-result').forEach(b=>b.onclick=async()=>{const d=await api('/student/attempts/'+b.dataset.id+'/result');const fmt=v=>Array.isArray(v)?v.join(', '):(v===null||v===undefined||v===''?'—':String(v));modal('<h3>'+h(d.title)+'</h3><div class="result-summary"><b>'+h(d.score+'/'+d.total)+'</b> · '+h(d.percentage)+'% · '+h(d.passed?'Pass':'Below pass mark')+'</div><div class="review-list">'+d.questions.map(q=>'<div class="review-item '+(q.is_correct===true?'correct':q.is_correct===false?'incorrect':'')+'"><div><b>Question '+h(q.number)+'</b></div><div class="mut">'+h(q.text||'')+'</div><div>Your answer: <b>'+h(fmt(q.answer))+'</b></div><div>Correct answer: <b>'+h(fmt(q.correct))+'</b></div><div>Marks: '+h(q.marks_awarded)+'</div></div>').join('')+'</div>')})}
else if(state.view==='certificates'){
  const rs=(await api('/student/results')).filter(x=>x.results_published&&x.passed);
  await Promise.all(rs.map(x=>api('/student/attempts/'+x.id+'/certificate',{method:'POST',body:'{}'}).catch(()=>null)));
  const certs=await api('/student/certificates');
  P.innerHTML='<div class="neo-section-head"><div><span class="neo-kicker">ACHIEVEMENTS</span><h2>Certificates</h2></div><p>Each certificate has a permanent reference number and QR verification link.</p></div>'+
    '<div class="neo-cert-grid">'+(certs.length?certs.map(x=>'<article class="neo-cert-card"><div class="neo-cert-mark">'+h(certIcon(x.certificate_type))+'</div><div><span class="neo-kicker">'+h(certLabel(x.certificate_type))+'</span><h3>'+h(x.title)+'</h3><p>'+h(state.me.first_name+' '+state.me.last_name)+' · '+Math.round(Number(x.percentage||0))+'% · '+h(x.reference_no)+'</p></div><button class="neo-btn cert-download" data-cert="'+h(String(x.id))+'">Open certificate</button></article>').join(''):'<div class="neo-empty">Pass a published exam to unlock a certificate.</div>')+'</div>';
  document.querySelectorAll('.cert-download').forEach(btn=>btn.onclick=()=>{const cert=certs.find(x=>String(x.id)===btn.dataset.cert);if(cert)openCertificate(cert)});
}
else if(state.view==='audit'){const rs=await api('/audit');P.innerHTML='<div class="card"><table class="table"><thead><tr><th>Time</th><th>User</th><th>Action</th><th>Entity</th></tr></thead><tbody>'+rs.map(x=>'<tr><td>'+h(new Date(x.at).toLocaleString())+'</td><td>'+h(x.user_label||'')+'</td><td>'+h(x.action)+'</td><td>'+h((x.entity||'')+' '+(x.entity_id||''))+'</td></tr>').join('')+'</tbody></table></div>'}}catch(e){P.innerHTML='<div class="card error">'+h(e.message)+'</div>'}}


function certIcon(type){return ({IELTS:'I',SCIENCE:'S',OLYMPIAD:'★',ENGLISH:'E',MATH:'π',GENERAL:'R'})[type]||'R'}
function certLabel(type){return ({IELTS:'IELTS PRACTICE ASSESSMENT',SCIENCE:'SCIENCE ASSESSMENT',OLYMPIAD:'ACADEMIC OLYMPIAD AWARD',ENGLISH:'ENGLISH LANGUAGE ASSESSMENT',MATH:'MATHEMATICS ASSESSMENT',GENERAL:'ACADEMIC ASSESSMENT'})[type]||'ACADEMIC ASSESSMENT'}
function certAward(cert){
  const p=Number(cert.percentage||0);
  if(cert.certificate_type==='OLYMPIAD'){
    if(p>=90)return 'Gold Distinction';
    if(p>=80)return 'Silver Distinction';
    if(p>=70)return 'Bronze Distinction';
    return 'Merit Award';
  }
  return Math.round(p)+'%';
}
function certificateTemplate(type){
  const map={
    IELTS:'/app/certificates/templates/ielts-template.png',
    SCIENCE:'/app/certificates/templates/science-template.png',
    OLYMPIAD:'/app/certificates/templates/olympiad-template.png',
    ENGLISH:'/app/certificates/templates/english-template.png',
    MATH:'/app/certificates/templates/math-template.png'
  };
  return map[type]||map.ENGLISH;
}
function certNameSize(name){
  const n=String(name||'').trim().length;
  return n>32?34:n>26?38:n>20?42:n>14?45:48;
}
function certExamSize(title){
  const n=String(title||'').length;
  return n>36?13:n>28?14:n>20?16:18;
}
function certificateSubject(cert){
  const meta=cert.metadata||{};
  const explicit=String(cert.subject||meta.subject||'').trim();
  if(explicit)return explicit.replace(/\\s+Assessment$/i,'').trim();
  return ({ENGLISH:'English',SCIENCE:'Science',MATH:'Mathematics',IELTS:'IELTS',OLYMPIAD:'Olympiad'})[cert.certificate_type]||'Academic';
}
function cleanCertificateLevel(cert,exam){
  const meta=cert.metadata||{};
  const subject=certificateSubject(cert);
  const explicit=[meta.assessment_level,meta.grade_label,meta.cefr_level,meta.level,cert.assessment_level,cert.grade_label,cert.level,cert.group_label]
    .map(v=>String(v??'').trim()).find(Boolean);
  if(explicit){
    const e=explicit.replace(/\\s+/g,' ').trim();
    if(!/^Book\\s+\\d+/i.test(e)&&!/^Part\\s+[A-Z0-9]+/i.test(e)&&!/^Type\\s+\\d+/i.test(e))return e;
  }
  const source=[cert.title,meta.exam_title,exam].filter(Boolean).join(' ');
  const cefr=source.match(/(?:^|[^A-Z0-9])(A1|A2|B1|B2|C1|C2)(?:[^A-Z0-9]|$)/i);
  if(cefr&&cert.certificate_type==='ENGLISH')return cefr[1].toUpperCase()+' English';
  const grade=source.match(/\\bGrade\\s*(\\d{1,2})\\b/i);
  if(grade)return 'Grade '+grade[1]+' '+subject;
  if(cert.certificate_type==='OLYMPIAD')return meta.competition_level||'School Olympiad';
  return subject+' Assessment';
}
function commonCertificateFields(cert,name,issued,qr){
  const type=cert.certificate_type;
  const exam=cert.title||cert.metadata?.exam_title||cert.subject||'Redbridge Assessment';
  const score=Math.round(Number(cert.percentage||0))+'%';
  const award=certAward(cert);
  const level=cleanCertificateLevel(cert,exam);
  const nameSize=certNameSize(name);
  const levelSize=certExamSize(level);
  const common={
    ENGLISH:{
      name:{x:390,y:520,w:720,h:90,font:nameSize},
      exam:{x:292,y:838,w:216,h:44,font:levelSize,text:level},
      metric:{x:538,y:838,w:107,h:44,font:24,text:score},
      date:{x:676,y:838,w:214,h:44,font:18,text:issued},
      ref:{x:926,y:838,w:307,h:44,font:14,text:cert.reference_no},
      qr:{x:1281,y:766,w:137,h:137}
    },
    SCIENCE:{
      name:{x:390,y:500,w:720,h:88,font:nameSize},
      exam:{x:322,y:804,w:210,h:44,font:levelSize,text:level},
      metric:{x:557,y:804,w:109,h:44,font:24,text:score},
      date:{x:694,y:804,w:208,h:44,font:18,text:issued},
      ref:{x:932,y:804,w:301,h:44,font:14,text:cert.reference_no},
      qr:{x:1274,y:731,w:140,h:140}
    },
    MATH:{
      name:{x:390,y:500,w:720,h:90,font:nameSize},
      exam:{x:355,y:809,w:207,h:44,font:levelSize,text:level},
      metric:{x:591,y:809,w:96,h:44,font:24,text:score},
      date:{x:716,y:809,w:199,h:44,font:18,text:issued},
      ref:{x:947,y:809,w:290,h:44,font:14,text:cert.reference_no},
      qr:{x:1285,y:738,w:138,h:138}
    },
    OLYMPIAD:{
      name:{x:390,y:566,w:710,h:90,font:nameSize},
      exam:{x:342,y:853,w:190,h:44,font:Math.min(levelSize,16),text:level},
      metric:{x:556,y:853,w:163,h:44,font:17,text:award},
      date:{x:744,y:853,w:192,h:44,font:18,text:issued},
      ref:{x:961,y:853,w:280,h:44,font:14,text:cert.reference_no},
      qr:{x:1280,y:764,w:140,h:140}
    }
  };
  return common[type]||common.ENGLISH;
}
function ieltsCertificateFields(cert,name,issued,qr){
  const meta=cert.metadata||{};
  const skill=String(cert.skill||meta.skill||'').toLowerCase();
  const pct=Math.round(Number(cert.percentage||meta.percentage||0));
  const vals={
    listening:meta.listening_band??meta.listening??(skill==='listening'?pct+'%':'—'),
    reading:meta.reading_band??meta.reading??(skill==='reading'?pct+'%':'—'),
    writing:meta.writing_band??meta.writing??(skill==='writing'?pct+'%':'—'),
    speaking:meta.speaking_band??meta.speaking??(skill==='speaking'?pct+'%':'—'),
    overall:meta.overall_band??meta.overallBand??(skill==='full mock'?pct+'%':'—')
  };
  return {
    name:{x:420,y:415,w:650,h:80,font:certNameSize(name)},
    listening:{x:360,y:713,w:133,h:55,font:31,text:String(vals.listening)},
    reading:{x:544,y:713,w:133,h:55,font:31,text:String(vals.reading)},
    writing:{x:728,y:713,w:133,h:55,font:31,text:String(vals.writing)},
    speaking:{x:906,y:713,w:133,h:55,font:31,text:String(vals.speaking)},
    overall:{x:1086,y:686,w:182,h:66,font:36,text:String(vals.overall)},
    date:{x:468,y:828,w:260,h:46,font:18,text:issued},
    ref:{x:778,y:828,w:363,h:46,font:14,text:cert.reference_no},
    qr:{x:1287,y:806,w:126,h:126}
  };
}
function certificateOverlayHTML(field,key,kind='value'){
  if(!field)return '';
  const cls=kind==='name'?'cert-name-field':kind==='qr'?'cert-qr-field':kind==='examline'?'cert-exam-line':'cert-value-field';
  const style='left:'+field.x+'px;top:'+field.y+'px;width:'+field.w+'px;height:'+field.h+'px;'+(field.font?'font-size:'+field.font+'px;':'');
  if(kind==='qr')return '<div class="'+cls+'" style="'+style+'"><img src="'+field.src+'" alt="Certificate verification QR"></div>';
  return '<div class="'+cls+'" style="'+style+'">'+h(field.text??'')+'</div>';
}
function openCertificate(cert){
  const name=(state.me.first_name+' '+state.me.last_name).trim();
  const issued=new Date(cert.issued_at).toLocaleDateString('en-GB',{timeZone:'Asia/Tashkent',day:'2-digit',month:'long',year:'numeric'});
  const verifyUrl=location.origin+'/app/verify.html?ref='+encodeURIComponent(cert.reference_no)+'&token='+encodeURIComponent(cert.verification_token);
  const qr='https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=0&data='+encodeURIComponent(verifyUrl);
  const template=certificateTemplate(cert.certificate_type);
  const fields=cert.certificate_type==='IELTS'?ieltsCertificateFields(cert,name,issued,qr):commonCertificateFields(cert,name,issued,qr);
  fields.name.text=name; fields.qr.src=qr;

  let overlays='';
  overlays+=certificateOverlayHTML(fields.name,'name','name');
  if(cert.certificate_type==='IELTS'){
    for(const k of ['listening','reading','writing','speaking','overall','date','ref'])overlays+=certificateOverlayHTML(fields[k],k);
  }else{
    for(const k of ['exam','metric','date','ref'])overlays+=certificateOverlayHTML(fields[k],k);
  }
  if(fields.examLine)overlays+=certificateOverlayHTML(fields.examLine,'examLine','examline');
  overlays+=certificateOverlayHTML(fields.qr,'qr','qr');

  const w=window.open('','_blank');
  if(!w){alert('Please allow pop-ups to open the certificate.');return}
  const html='<!doctype html><html><head><meta charset="utf-8"><title>'+h(cert.reference_no)+'</title><style>'+
    '*{box-sizing:border-box}html,body{margin:0;background:#dfe3e5;font-family:Arial,sans-serif}.toolbar{width:1491px;max-width:96vw;margin:14px auto 0;display:flex;justify-content:flex-end;gap:8px}.toolbar button{border:0;border-radius:10px;background:#102b3d;color:white;padding:10px 16px;font-weight:800;cursor:pointer}.cert-wrap{position:relative;width:1491px;height:1055px;max-width:96vw;aspect-ratio:1491/1055;margin:12px auto 30px;box-shadow:0 22px 65px rgba(0,0,0,.22);overflow:hidden;background:#fff}.cert-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:fill;display:block}.cert-name-field,.cert-value-field,.cert-exam-line{position:absolute;z-index:3;display:flex;align-items:center;justify-content:center;text-align:center;color:#0a203f}.cert-name-field{font-family:Georgia,"Times New Roman",serif;font-weight:700;font-style:italic;line-height:1;background:transparent;border:0;border-radius:0}.cert-value-field{font-family:Georgia,"Times New Roman",serif;font-weight:800;line-height:1.05;background:transparent;border:0;border-radius:0;padding:0;overflow:hidden;white-space:normal}.cert-exam-line{font-family:Georgia,"Times New Roman",serif;font-weight:700;font-style:italic;background:transparent;border:0;border-radius:0;padding:0}.cert-qr-field{position:absolute;z-index:4;background:#fff;display:flex;align-items:center;justify-content:center;padding:0}.cert-qr-field img{width:100%;height:100%;display:block}.cert-wrap{transform-origin:top left}@media(max-width:1491px){.cert-wrap{transform:scale(calc((96vw)/1491));margin-bottom:calc((1055px * (96vw/1491)) - 1055px)}}@media print{html,body{background:#fff}.toolbar{display:none}.cert-wrap{margin:0;box-shadow:none;max-width:none;transform:none!important}@page{size:A4 landscape;margin:0}}</style></head><body>'+
    '<div class="toolbar"><button onclick="window.print()">Print / Save PDF</button></div>'+
    '<div class="cert-wrap"><img class="cert-bg" src="'+template+'" onerror="this.onerror=null;this.src=this.src.replace(/\\.png$/,\'.jpg\')" alt="'+h(certLabel(cert.certificate_type))+'">'+overlays+'</div></body></html>';
  w.document.open();w.document.write(html);w.document.close();
}


async function openTermExamChooser(){
  try{
    const rows=await publicApi('/term-exams');
    if(!rows.length){alert('No Term Exams are open at the moment.');return}
    const subjects=[...new Set(rows.map(x=>x.subject).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
    const groups=[...new Set(rows.map(examGroup))].sort((a,b)=>a.localeCompare(b));
    modal(
      '<div class="neo-auth-head"><span class="neo-kicker">TERM EXAMS</span><h3>Choose an exam</h3><p>No account is required. Select a subject and group.</p></div>'+
      '<form id="term-picker" class="stack">'+
      '<label class="field">Subject<select name="subject" required><option value="">Select subject</option>'+subjects.map(s=>'<option value="'+h(s)+'">'+h(s)+'</option>').join('')+'</select></label>'+
      '<label class="field">Group<select name="group" required><option value="">Select group</option>'+groups.map(g=>'<option value="'+h(g)+'">'+h(g)+'</option>').join('')+'</select></label>'+
      '<button class="neo-btn">Show exams</button><div id="term-picker-error" class="error"></div></form>',
      ()=>document.getElementById('term-picker').onsubmit=e=>{
        e.preventDefault();
        const fd=new FormData(e.target),subject=String(fd.get('subject')||''),group=String(fd.get('group')||'');
        const matches=rows.filter(x=>x.subject===subject&&examGroup(x)===group);
        if(!matches.length){document.getElementById('term-picker-error').textContent='No open Term Exams match this selection.';return}
        modal(
          '<div class="neo-auth-head"><span class="neo-kicker">TERM EXAMS</span><h3>'+h(subject)+' · '+h(group)+'</h3><p>Select the exam you want to take.</p></div>'+
          '<div class="stack">'+matches.map(x=>'<article class="card"><div class="row" style="justify-content:space-between;align-items:center"><div><b>'+h(x.title)+'</b><div class="mut">'+h(x.duration_min)+' min</div></div><button class="neo-btn term-start" data-id="'+x.id+'" data-title="'+h(x.title)+'">Take exam</button></div></article>').join('')+'</div>',
          ()=>{
            document.querySelectorAll('.term-start').forEach(btn=>btn.onclick=()=>openTermIdentity(btn.dataset.id,btn.dataset.title,group));
          }
        );
      }
    );
  }catch(e){alert(e.message||'Could not load Term Exams.')}
}
function openTermIdentity(examId,title,group){
  modal(
    '<div class="neo-auth-head"><span class="neo-kicker">READY TO BEGIN</span><h3>'+h(title)+'</h3><p>Enter your full name. The timer starts immediately after you continue.</p></div>'+
    '<form id="term-start-form" class="stack"><label class="field">Full name<input name="student_name" required maxlength="160" autocomplete="name"></label><label class="field">Group<input name="group_name" value="'+h(group)+'" readonly></label><button class="neo-btn">Start Term Exam</button><div id="term-start-error" class="error"></div></form>',
    ()=>document.getElementById('term-start-form').onsubmit=async e=>{
      e.preventDefault();if(!confirm('Ready to begin? The timer will continue even if the page is closed.'))return;
      const data=Object.fromEntries(new FormData(e.target));
      try{
        const d=await publicApi('/term-exams/'+examId+'/start',{method:'POST',body:JSON.stringify(data)});
        sessionStorage.setItem('rb_term_attempt',String(d.attempt_id));sessionStorage.setItem('rb_term_token',d.term_token);
        closeModal();termExam(d.attempt_id,d.term_token);
      }catch(x){document.getElementById('term-start-error').textContent=x.message}
    }
  );
}
async function showPublicTermExams(){return openTermExamChooser()}

async function termExam(aid,token){
  R.innerHTML='<div class="main secure-exam"><div id="exam"></div></div>';
  const E=document.getElementById('exam');
  const termApi=async(path,opt={})=>publicApi(path,{...opt,headers:{...(opt.headers||{}),'x-term-token':token}});
  const d=await termApi('/term-attempts/'+aid);
  if(d.status!=='IN_PROGRESS'){sessionStorage.removeItem('rb_term_attempt');sessionStorage.removeItem('rb_term_token');alert('This Term Exam is already closed.');state.me?render():showPublicTermExams();return}
  const deadline=new Date(d.deadline_at).getTime(),serverOffset=new Date(d.server_now).getTime()-Date.now();
  let timerHandle=null,autosaveHandle=null,closed=false,submitting=false,suppressIntegrity=false,proctorStream=null,audioCtx=null,audioFrame=null,violations=0,lastViolationAt=0,integrityMonitoring=false;
  const saveTimers=new Map(),questionMap=new Map(d.questions.map(q=>[String(q.id),q]));
  const draftKey=qid=>'rb_term_draft_'+aid+'_'+qid;
  const currentAnswer=q=>{const els=[...document.querySelectorAll('[data-q="'+q.id+'"]')];if(q.type==='multi')return els.filter(x=>x.checked).map(x=>x.value);if(q.type==='mcq'||q.type==='truefalse')return els.find(x=>x.checked)?.value??null;return els[0]?.value??''};
  const setStatus=t=>{const el=document.getElementById('autosave-status');if(el)el.textContent=t};
  const saveOne=async(qid,val)=>{try{await termApi('/term-attempts/'+aid,{method:'PUT',body:JSON.stringify({question_id:Number(qid),answer:val})});localStorage.removeItem(draftKey(qid));setStatus('Saved '+new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'}))}catch{setStatus((navigator.onLine?'Could not sync yet':'Offline')+' — draft saved locally')}};
  const checkpoint=async()=>{if(closed)return;for(const q of d.questions)await saveOne(String(q.id),currentAnswer(q))};
  const cleanup=()=>{closed=true;clearInterval(timerHandle);clearInterval(autosaveHandle);saveTimers.forEach(t=>clearTimeout(t));saveTimers.clear();document.removeEventListener('visibilitychange',onVisibility);window.removeEventListener('blur',onBlur);document.removeEventListener('fullscreenchange',onFullscreen);document.removeEventListener('contextmenu',blockContext);document.removeEventListener('copy',blockClipboard);document.removeEventListener('cut',blockClipboard);document.removeEventListener('paste',blockClipboard);document.removeEventListener('keydown',onKey);if(audioFrame)cancelAnimationFrame(audioFrame);if(audioCtx){try{audioCtx.close()}catch{}audioCtx=null}if(proctorStream){proctorStream.getTracks().forEach(t=>t.stop());proctorStream=null}document.getElementById('proctor-dock')?.remove()};
  const finish=()=>{cleanup();sessionStorage.removeItem('rb_term_attempt');sessionStorage.removeItem('rb_term_token');d.questions.forEach(q=>localStorage.removeItem(draftKey(q.id)));alert('Your Term Exam has been submitted successfully.');state.me?render():showPublicTermExams()};
  const warn=msg=>{const w=document.getElementById('integrity-warning');if(!w)return;w.textContent=msg;w.classList.add('show');setTimeout(()=>w?.classList.remove('show'),3500)};
  const report=(kind,label)=>{if(closed||submitting||suppressIntegrity)return;violations++;if(label)warn(label+' Warning '+violations+'.')};
  const startProctor=async()=>{
    const status=document.getElementById('term-proctor-status');
    if(!window.isSecureContext){if(status){status.textContent='Camera and microphone require HTTPS.';status.className='error'}return false}
    if(!navigator.mediaDevices?.getUserMedia){if(status){status.textContent='This browser does not support camera/microphone access.';status.className='error'}return false}
    if(status){status.textContent='Requesting permission from your browser…';status.className='mut'}
    try{
      proctorStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:true});
      let dock=document.getElementById('proctor-dock');
      if(!dock){dock=document.createElement('div');dock.id='proctor-dock';dock.className='proctor-dock';dock.innerHTML='<video id="proctor-video" autoplay muted playsinline></video><div class="proctor-row"><span class="proctor-live"><i></i> Proctoring active</span><span>Cam + Mic</span></div><div class="proctor-meter"><i id="proctor-meter-bar"></i></div>';document.body.appendChild(dock)}
      document.getElementById('proctor-video').srcObject=proctorStream;
      try{audioCtx=new (window.AudioContext||window.webkitAudioContext)();const source=audioCtx.createMediaStreamSource(proctorStream),an=audioCtx.createAnalyser();an.fftSize=256;source.connect(an);const data=new Uint8Array(an.frequencyBinCount);const pulse=()=>{if(closed||!audioCtx)return;an.getByteFrequencyData(data);let total=0;for(const v of data)total+=v;const bar=document.getElementById('proctor-meter-bar');if(bar)bar.style.width=Math.max(6,Math.min(100,(total/data.length)*1.8))+'%';audioFrame=requestAnimationFrame(pulse)};pulse()}catch{}
      return true;
    }catch(e){
      let msg='Camera and microphone could not be started.';
      if(e?.name==='NotAllowedError')msg='Camera or microphone permission is blocked. Allow Camera and Microphone in the browser site permissions, then try again.';
      else if(e?.name==='NotFoundError')msg='No usable camera or microphone was found.';
      else if(e?.name==='NotReadableError')msg='The camera or microphone is busy in another application.';
      if(status){status.textContent=msg;status.className='error'}return false;
    }
  };
  const ensureFullscreen=async()=>{if(document.fullscreenElement)return true;try{await document.documentElement.requestFullscreen();return true}catch{return false}};
  const onVisibility=()=>{if(document.hidden&&!submitting&&!suppressIntegrity){checkpoint();report('visibility_hidden','You left the exam tab.')}};
  const onBlur=()=>{if(!submitting&&!suppressIntegrity){checkpoint();report('window_blur','The exam window lost focus.')}};
  const onFullscreen=()=>{if(!document.fullscreenElement&&!submitting&&!suppressIntegrity)report('fullscreen_exit','Fullscreen mode was exited.')};
  const blockContext=e=>{e.preventDefault();warn('Right-click is disabled during the exam.')};
  const blockClipboard=e=>{e.preventDefault();report('clipboard_attempt','Copy, cut and paste are disabled.')};
  const onKey=e=>{const k=e.key.toLowerCase();if(e.key==='PrintScreen'){e.preventDefault();report('screenshot_attempt','Screenshot-key attempt detected.');return}if((e.ctrlKey||e.metaKey)&&['c','x','v','p','s','u'].includes(k)){e.preventDefault();report(k==='p'?'print_attempt':'keyboard_shortcut_attempt',k==='p'?'Printing is not allowed.':'This shortcut is disabled.');return}if(e.key==='F12'){e.preventDefault();report('developer_tools_attempt','Developer tools are disabled during the exam.')}};

  E.innerHTML='<div class="exam-watermark">'+h(d.student_name+' · '+d.class_name)+'</div><div id="integrity-warning" class="integrity-warning"></div>'+
    '<div class="proctor-consent"><h3>Secure proctoring</h3><p class="mut">Camera, microphone and fullscreen are required for every Term Exam.</p><div class="proctor-checks"><span>● Camera</span><span>● Microphone</span><span>● Fullscreen</span></div><div id="term-proctor-status" class="mut">Permission has not been requested yet.</div><button id="term-proctor-enable" class="btn alt sm" type="button">Enable camera & microphone</button></div>'+
    '<div id="term-proctor-lock" class="proctor-lock"><b>Proctoring required</b><span>Enable camera and microphone to unlock the exam.</span></div>'+
    '<div class="top exam-top"><div><h2 style="margin:0">'+h(d.exam.title)+'</h2><div class="mut">'+h(d.student_name)+' · '+h(d.class_name)+'</div><div id="autosave-status" class="autosave-status saved">Autosave active · checkpoint every 60 seconds</div></div><div class="timer" id="tm"></div></div>'+
    (d.exam.description?'<details class="card source-material" open><summary><b>Test paper / source material</b></summary><pre>'+h(d.exam.description)+'</pre></details>':'')+
    '<form id="term-exam-form" class="card exam-paper">'+d.questions.map((q,i)=>'<div class="examq">'+ieltsQuestionResource(q)+'<div class="exam-question-text"><b>'+(i+1)+'.</b> '+h(q.text).replaceAll('\\n','<br>')+'</div><div class="mut">'+h(q.marks)+' mark(s)'+(q.word_guidance?' · '+h(q.word_guidance):'')+'</div>'+answerHtml(q)+'</div>').join('')+'<button class="btn" type="submit">Submit Term Exam</button></form>';

  d.questions.forEach(q=>{let draft=null;try{draft=JSON.parse(localStorage.getItem(draftKey(q.id))||'null')}catch{};if(!draft)return;const els=[...document.querySelectorAll('[data-q="'+q.id+'"]')];if(q.type==='multi')els.forEach(el=>el.checked=Array.isArray(draft.value)&&draft.value.includes(el.value));else if(q.type==='mcq'||q.type==='truefalse')els.forEach(el=>el.checked=draft.value===el.value);else if(els[0])els[0].value=draft.value??''});
  const form=document.getElementById('term-exam-form');form.classList.add('exam-interaction-locked');
  document.getElementById('term-proctor-enable').onclick=async()=>{const ok=await startProctor();if(!ok)return;const fs=await ensureFullscreen();if(!fs){const s=document.getElementById('term-proctor-status');if(s){s.textContent='Camera and microphone are enabled. Please allow fullscreen to begin.';s.className='error'}return}enableIntegrityMonitoring();document.getElementById('term-proctor-lock')?.remove();form.classList.remove('exam-interaction-locked');[...form.querySelectorAll('input,textarea,select,button')].forEach(el=>{el.disabled=false;el.removeAttribute('aria-disabled')});const s=document.getElementById('term-proctor-status');if(s){s.textContent='Proctoring active. You may begin the exam.';s.className='success'}};
  const enableIntegrityMonitoring=()=>{if(integrityMonitoring)return;integrityMonitoring=true;document.addEventListener('visibilitychange',onVisibility);window.addEventListener('blur',onBlur);document.addEventListener('fullscreenchange',onFullscreen);document.addEventListener('contextmenu',blockContext);document.addEventListener('copy',blockClipboard);document.addEventListener('cut',blockClipboard);document.addEventListener('paste',blockClipboard);document.addEventListener('keydown',onKey)};
  document.querySelectorAll('[data-q]').forEach(el=>{const ev=(el.tagName==='TEXTAREA'||el.type==='text')?'input':'change';el.addEventListener(ev,()=>{const q=questionMap.get(String(el.dataset.q));if(!q)return;const val=currentAnswer(q);try{localStorage.setItem(draftKey(q.id),JSON.stringify({value:val,at:Date.now()}))}catch{}clearTimeout(saveTimers.get(String(q.id)));saveTimers.set(String(q.id),setTimeout(()=>saveOne(String(q.id),val),1200))})});
  form.onsubmit=async e=>{e.preventDefault();if(submitting)return;suppressIntegrity=true;const ok=confirm('Submit this Term Exam? You will not be able to change your answers afterward.');if(!ok){setTimeout(()=>suppressIntegrity=false,500);return}submitting=true;clearInterval(autosaveHandle);saveTimers.forEach(t=>clearTimeout(t));saveTimers.clear();const btn=e.currentTarget.querySelector('button[type="submit"]');if(btn){btn.disabled=true;btn.textContent='Submitting…'}try{await checkpoint();await termApi('/term-attempts/'+aid+'/submit',{method:'POST',body:'{}'});finish()}catch{try{const check=await termApi('/term-attempts/'+aid);if(check.status!=='IN_PROGRESS'){finish();return}}catch{}submitting=false;suppressIntegrity=false;if(btn){btn.disabled=false;btn.textContent='Submit Term Exam'}autosaveHandle=setInterval(checkpoint,60000);alert('The exam could not be submitted yet. Your answers are preserved. Please try again.')}};
  const tick=()=>{if(closed)return;const rem=Math.max(0,Math.ceil((deadline-(Date.now()+serverOffset))/1000));document.getElementById('tm').textContent=Math.floor(rem/60)+':'+String(rem%60).padStart(2,'0');if(rem<=0){clearInterval(timerHandle);suppressIntegrity=true;checkpoint().finally(()=>termApi('/term-attempts/'+aid+'/submit',{method:'POST',body:'{}'}).finally(finish))}};
  tick();timerHandle=setInterval(tick,1000);autosaveHandle=setInterval(checkpoint,60000);
}

async function openMarking(aid){
  state.view='marking';
  const P=document.getElementById('page');
  P.innerHTML='<div class="card">Loading submission…</div>';
  try{
    const d=await api('/marking/attempts/'+aid);
    const a=d.attempt;
    const canPublish=Array.isArray(state.me.permissions)&&state.me.permissions.includes('PUBLISH_RESULTS');
    P.innerHTML=
      '<div class="marking-head card"><div><button id="back-marking" class="btn alt sm">← Back to submissions</button><h2 class="marking-title">'+h(a.title)+'</h2><div class="mut">'+h(a.student.name)+' · '+h(a.student.class_name||'No class')+' · '+h(a.student.email)+'</div><div class="mut">Submitted '+h(a.submitted_at?new Date(a.submitted_at).toLocaleString():'—')+'</div></div>'+
      '<div class="marking-score"><div><span>Current score</span><b id="marking-score-value">'+h(a.score)+' / '+h(a.total)+'</b></div><div><span>Status</span><b id="marking-publish-status">'+(a.results_published?'Published':'Not published')+'</b></div></div></div>'+
      (a.description?'<details class="card source-material"><summary><b>Source material / reading passage</b></summary><pre>'+h(a.description)+'</pre></details>':'')+
      '<form id="marking-form" class="stack marking-form">'+
      d.questions.map(q=>'<section class="card marking-question"><div class="marking-qhead"><div><span class="badge">Section '+h(q.section||'—')+'</span><h3>Question '+h(q.position)+'</h3></div><div class="mark-box"><label>Marks <input class="mark-input" data-qid="'+q.id+'" type="number" min="0" max="'+q.marks+'" step="0.5" value="'+h(q.marks_awarded)+'"></label><span>/ '+h(q.marks)+'</span></div></div>'+
        '<div class="marking-question-text">'+h(q.text).replaceAll('\\n','<br>')+'</div>'+
        (q.word_guidance?'<div class="mut">'+h(q.word_guidance)+'</div>':'')+
        '<div class="student-response"><div class="response-label">Student response</div><div class="response-body">'+(String(q.answer??'').trim()?h(q.answer):'<em>No answer</em>')+'</div></div>'+
        '<details class="mark-scheme"><summary>Show mark scheme / rubric</summary><div>'+h(q.mark_scheme||'No mark scheme stored.').replaceAll('\\n','<br>')+'</div></details>'+
      '</section>').join('')+
      '<div class="card marking-actions"><div class="row" style="justify-content:space-between;gap:12px;flex-wrap:wrap"><button class="btn" type="submit">Save marks</button>'+(canPublish?'<button id="publish-result" class="btn '+(a.results_published?'alt':'')+'" type="button">'+(a.results_published?'Unpublish results':'Publish results')+'</button>':'<span class="mut">An academic administrator publishes final results.</span>')+'</div><div id="marking-msg" class="success"></div></div>'+
      '</form>';

    document.getElementById('back-marking').onclick=()=>{state.view='marking';render()};
    document.getElementById('marking-form').onsubmit=async e=>{
      e.preventDefault();
      const grades=[...document.querySelectorAll('.mark-input')].map(inp=>({exam_question_id:Number(inp.dataset.qid),marks_awarded:Number(inp.value||0)}));
      try{
        await api('/marking/attempts/'+aid,{method:'POST',body:JSON.stringify({grades})});
        const fresh=await api('/marking/attempts/'+aid);
        document.getElementById('marking-score-value').textContent=fresh.attempt.score+' / '+fresh.attempt.total;
        document.getElementById('marking-msg').textContent='Marks saved successfully.';
      }catch(x){document.getElementById('marking-msg').className='error';document.getElementById('marking-msg').textContent=x.message}
    };
    if(canPublish)document.getElementById('publish-result').onclick=async e=>{
      const publish=!a.results_published;
      if(publish&&!confirm('Publish the results for this exam? Students will be able to see their scores and answer review.'))return;
      try{
        await api('/marking/exams/'+a.exam_id+'/publish',{method:'POST',body:JSON.stringify({published:publish})});
        a.results_published=publish;
        document.getElementById('marking-publish-status').textContent=publish?'Published':'Not published';
        e.target.textContent=publish?'Unpublish results':'Publish results';
        e.target.classList.toggle('alt',publish);
        document.getElementById('marking-msg').className='success';
        document.getElementById('marking-msg').textContent=publish?'Results published to students.':'Results unpublished.';
      }catch(x){document.getElementById('marking-msg').className='error';document.getElementById('marking-msg').textContent=x.message}
    };
  }catch(e){P.innerHTML='<div class="card error">'+h(e.message)+'</div>'}
}
async function submitForm(e,path,close=false){e.preventDefault();const o=Object.fromEntries(new FormData(e.target));try{await api(path,{method:'POST',body:JSON.stringify(o)});if(close)closeModal();loadView()}catch(x){alert(x.message)}}
function modal(content,onopen){
  closeModal();
  const d=document.createElement('div');
  d.className='modal-backdrop';
  d.id='modal';
  d.innerHTML='<div class="modal" role="dialog" aria-modal="true"><div class="row" style="justify-content:flex-end"><button id="mc" class="btn alt sm" type="button">Close</button></div>'+content+'</div>';
  document.body.appendChild(d);
  document.getElementById('mc').onclick=closeModal;
  d.addEventListener('click',e=>{if(e.target===d)closeModal()});
  onopen&&onopen();
}
function closeModal(){document.getElementById('modal')?.remove()}
async function exam(aid){
  state.view='exam';
  R.innerHTML='<div class="main secure-exam"><div id="exam"></div></div>';
  const E=document.getElementById('exam');
  const d=await api('/attempts/'+aid);
  if(d.status!=='IN_PROGRESS'){state.view='student-results';render();return}
  const proctored=!!d.exam.proctoring_required;

  const deadline=new Date(d.deadline_at).getTime();
  const serverOffset=new Date(d.server_now).getTime()-Date.now();
  let timerHandle=null,autosaveHandle=null,closed=false,lastViolationAt=0,violations=0,proctorStream=null,audioCtx=null,audioFrame=null,submitting=false,suppressIntegrity=false,integrityMonitoring=false;
  const saveTimers=new Map();
  const questionMap=new Map(d.questions.map(q=>[String(q.id),q]));
  const studentLabel=(state.me.first_name+' '+state.me.last_name+' · '+state.me.email+' · Attempt '+aid);
  const draftKey=qid=>'rb_exam_draft_'+aid+'_'+qid;

  const cleanup=()=>{
    closed=true;
    if(timerHandle)clearInterval(timerHandle);
    if(autosaveHandle)clearInterval(autosaveHandle);
    saveTimers.forEach(t=>clearTimeout(t));
    saveTimers.clear();
    document.removeEventListener('visibilitychange',onVisibility);
    window.removeEventListener('blur',onBlur);
    document.removeEventListener('fullscreenchange',onFullscreen);
    document.removeEventListener('contextmenu',blockContext);
    document.removeEventListener('copy',blockClipboard);
    document.removeEventListener('cut',blockClipboard);
    document.removeEventListener('paste',blockClipboard);
    document.removeEventListener('keydown',onKey);
    if(audioFrame)cancelAnimationFrame(audioFrame);
    if(audioCtx){try{audioCtx.close()}catch{}audioCtx=null}
    if(proctorStream){proctorStream.getTracks().forEach(t=>t.stop());proctorStream=null}
    document.getElementById('proctor-dock')?.remove();
  };

  const finishToResults=()=>{
    cleanup();
    d.questions.forEach(q=>localStorage.removeItem(draftKey(q.id)));
    document.title='Redbridge Exam Platform';
    state.view='student-results';
    render();
  };

  const setSaveStatus=(text,kind='')=>{
    const s=document.getElementById('autosave-status');
    if(!s)return;
    s.textContent=text;
    s.className='autosave-status '+kind;
  };

  const currentAnswer=q=>{
    const qid=String(q.id);
    const els=[...document.querySelectorAll('[data-q="'+qid+'"]')];
    if(q.type==='multi')return els.filter(x=>x.checked).map(x=>x.value);
    if(q.type==='mcq'||q.type==='truefalse')return els.find(x=>x.checked)?.value??null;
    return els[0]?.value??'';
  };

  const saveOne=async(qid,value,{silent=false}={})=>{
    if(closed)return;
    try{
      if(!silent)setSaveStatus('Saving…','saving');
      await api('/attempts/'+aid,{method:'PUT',body:JSON.stringify({question_id:Number(qid),answer:value})});
      localStorage.removeItem(draftKey(qid));
      setSaveStatus('Saved '+new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'}),'saved');
    }catch{
      setSaveStatus((navigator.onLine?'Could not sync yet':'Offline')+' — draft saved locally','offline');
    }
  };

  const queueSave=(qid,value)=>{
    try{localStorage.setItem(draftKey(qid),JSON.stringify({value,at:Date.now()}))}catch{}
    clearTimeout(saveTimers.get(qid));
    saveTimers.set(qid,setTimeout(()=>{saveTimers.delete(qid);saveOne(qid,value)},1200));
  };

  const checkpoint=async()=>{
    if(closed)return;
    setSaveStatus('Checkpoint saving…','saving');
    let failed=false;
    for(const q of d.questions){
      try{await saveOne(String(q.id),currentAnswer(q),{silent:true})}
      catch{failed=true}
    }
    if(failed)setSaveStatus('Some answers remain in local backup','offline');
    else setSaveStatus('Checkpoint saved '+new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),'saved');
  };

  const warn=(msg)=>{
    let w=document.getElementById('integrity-warning');
    if(!w)return;
    w.textContent=msg;
    w.classList.add('show');
    setTimeout(()=>w?.classList.remove('show'),3500);
  };

  const report=async(kind,label)=>{
    if(closed||submitting||suppressIntegrity)return;
    const now=Date.now();
    if(now-lastViolationAt<700&&['window_blur','visibility_hidden','fullscreen_exit'].includes(kind))return;
    lastViolationAt=now;
    try{
      const r=await api('/attempts/'+aid+'/integrity',{method:'POST',body:JSON.stringify({kind})});
      violations=Number(r.violations||violations);
      const counter=document.getElementById('violation-count');
      if(counter)counter.textContent=String(violations);
      if(r.auto_submitted){
        await checkpoint();
        alert('Exam submitted automatically because the integrity limit was reached.');
        finishToResults();
        return;
      }
      if(label)warn(label+' Warning '+violations+'/3.');
    }catch{}
  };

  const startProctor=async()=>{
    const status=document.getElementById('proctor-consent-status');
    if(!proctored)return true;
    if(!window.isSecureContext){
      if(status){status.textContent='Camera and microphone require a secure HTTPS connection.';status.className='error'}
      return false;
    }
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){
      if(status){status.textContent='This browser does not provide camera/microphone access for this page.';status.className='error'}
      return false;
    }
    if(status){status.textContent='Requesting permission from your browser…';status.className='mut'}
    try{
      proctorStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:true});
      let dock=document.getElementById('proctor-dock');
      if(!dock){dock=document.createElement('div');dock.id='proctor-dock';dock.className='proctor-dock';dock.innerHTML='<video id="proctor-video" autoplay muted playsinline></video><div class="proctor-row"><span class="proctor-live"><i></i> Proctoring active</span><span>Cam + Mic</span></div><div class="proctor-meter"><i id="proctor-meter-bar"></i></div>';document.body.appendChild(dock)}
      document.getElementById('proctor-video').srcObject=proctorStream;
      if(status){status.textContent='Camera and microphone connected.';status.className='success'}
      proctorStream.getVideoTracks().forEach(t=>{t.onended=()=>report('camera_disconnected','Camera was disconnected.');t.onmute=()=>report('camera_muted','Camera feed was interrupted.')});
      proctorStream.getAudioTracks().forEach(t=>{t.onended=()=>report('microphone_disconnected','Microphone was disconnected.');t.onmute=()=>report('microphone_muted','Microphone feed was interrupted.')});
      try{
        audioCtx=new (window.AudioContext||window.webkitAudioContext)();
        const source=audioCtx.createMediaStreamSource(proctorStream);
        const analyser=audioCtx.createAnalyser();analyser.fftSize=256;source.connect(analyser);
        const data=new Uint8Array(analyser.frequencyBinCount);
        const pulse=()=>{if(closed||!audioCtx)return;analyser.getByteFrequencyData(data);let total=0;for(const v of data)total+=v;const avg=total/data.length;const bar=document.getElementById('proctor-meter-bar');if(bar)bar.style.width=Math.max(6,Math.min(100,avg*1.8))+'%';audioFrame=requestAnimationFrame(pulse)};pulse();
      }catch{}
      return true;
    }catch(e){
      let msg='Camera and microphone could not be started.';
      if(e&&e.name==='NotAllowedError')msg='Camera or microphone permission is blocked. Use the browser site-permissions control (padlock icon) to allow Camera and Microphone, then click Enable again.';
      else if(e&&e.name==='NotFoundError')msg='No usable camera or microphone was found on this device.';
      else if(e&&e.name==='NotReadableError')msg='The camera or microphone is busy or unavailable. Close other apps using it and try again.';
      else if(e&&e.name==='SecurityError')msg='The browser blocked camera/microphone access because of a security policy.';
      if(status){status.textContent=msg;status.className='error'}
      return false;
    }
  };

  const onVisibility=()=>{
    if(document.hidden&&!submitting&&!suppressIntegrity){
      checkpoint();
      report('visibility_hidden','You left the exam tab.');
    }
  };
  const onBlur=()=>{if(!submitting&&!suppressIntegrity){checkpoint();report('window_blur','The exam window lost focus.')}};
  const onFullscreen=()=>{if(!document.fullscreenElement&&!submitting&&!suppressIntegrity)report('fullscreen_exit','Fullscreen mode was exited.')};
  const blockContext=e=>{e.preventDefault();warn('Right-click is disabled during the exam.')};
  const blockClipboard=e=>{e.preventDefault();report('clipboard_attempt','Copy, cut and paste are disabled.')};
  const onKey=e=>{
    const k=e.key.toLowerCase();
    if(e.key==='PrintScreen'){e.preventDefault();report('screenshot_attempt','Screenshot-key attempt detected.');try{navigator.clipboard?.writeText('')}catch{}return}
    if((e.ctrlKey||e.metaKey)&&['c','x','v','p','s','u'].includes(k)){
      e.preventDefault();
      report(k==='p'?'print_attempt':'keyboard_shortcut_attempt',k==='p'?'Printing is not allowed.':'This keyboard shortcut is disabled during the exam.');
      return;
    }
    if(e.key==='F12'){e.preventDefault();report('developer_tools_attempt','Developer tools are disabled during the exam.')}
  };

  const enableIntegrityMonitoring=()=>{
    if(!proctored||integrityMonitoring)return;
    integrityMonitoring=true;
    document.addEventListener('visibilitychange',onVisibility);
    window.addEventListener('blur',onBlur);
    document.addEventListener('fullscreenchange',onFullscreen);
    document.addEventListener('contextmenu',blockContext);
    document.addEventListener('copy',blockClipboard);
    document.addEventListener('cut',blockClipboard);
    document.addEventListener('paste',blockClipboard);
    document.addEventListener('keydown',onKey);
  };

  const ensureFullscreen=async()=>{
    if(document.fullscreenElement)return true;
    try{await document.documentElement.requestFullscreen();return true}catch{return false}
  };

  const restoreEmergencyDrafts=()=>{
    d.questions.forEach(q=>{
      let draft=null;
      try{draft=JSON.parse(localStorage.getItem(draftKey(q.id))||'null')}catch{}
      if(!draft||draft.value===undefined)return;
      const qid=String(q.id),els=[...document.querySelectorAll('[data-q="'+qid+'"]')];
      if(q.type==='multi')els.forEach(el=>el.checked=Array.isArray(draft.value)&&draft.value.includes(el.value));
      else if(q.type==='mcq'||q.type==='truefalse')els.forEach(el=>el.checked=draft.value===el.value);
      else if(els[0])els[0].value=draft.value??'';
      setSaveStatus('Recovered an unsent local draft','offline');
    });
  };

  const draw=()=>{
    E.innerHTML=
      '<div class="exam-watermark">'+h(studentLabel)+'</div>'+
      '<div id="integrity-warning" class="integrity-warning"></div>'+
      '<header class="rb-exam-header"><div class="rb-exam-brand"><span>RB</span><div><b>Redbridge Exam</b><small>'+h(d.exam.title)+'</small></div></div><div class="rb-exam-status"><div id="autosave-status" class="autosave-status saved">Saved</div><span class="rb-status-dot"></span><small>'+(proctored?'Secure mode':'Practice mode')+'</small></div><div class="rb-exam-clock"><small>Time remaining</small><div class="timer" id="tm"></div><button id="fsbtn" class="rb-icon-btn" type="button" title="Fullscreen">⛶</button></div></header>'+
      '<nav class="rb-question-nav"><div class="rb-question-nav-label"><span>Questions</span><small>'+d.questions.length+' total</small></div><div class="rb-question-numbers">'+d.questions.map((q,i)=>'<button type="button" data-jump="'+q.id+'" aria-label="Go to question '+(i+1)+'">'+(i+1)+'</button>').join('')+'</div></nav>'+
      (proctored?'<section class="rb-proctor-setup proctor-consent"><div><span class="neo-kicker">SECURE SESSION</span><h3>Enable proctoring before you begin.</h3><p>Camera, microphone and fullscreen are required for this examination.</p></div><div class="proctor-checks"><span>Camera</span><span>Microphone</span><span>Fullscreen</span></div><div class="rb-proctor-action"><div id="proctor-consent-status" class="mut">Permission has not been requested yet.</div><button id="proctor-retry" class="neo-btn" type="button">Enable secure mode</button></div></section>':'')+
      (proctored?'<div id="proctor-lock" class="proctor-lock"><b>Exam locked</b><span>Complete the secure-session check to begin.</span></div>':'')+
      '<main class="rb-exam-layout">'+
      (d.exam.description?'<aside class="rb-source-panel"><div class="rb-panel-label">SOURCE MATERIAL</div><div class="rb-source-scroll">'+h(d.exam.description).replaceAll('\\n','<br>')+'</div></aside>':'')+
      '<form id="xaf" class="rb-question-paper '+(d.exam.description?'has-source':'')+'"><div class="rb-paper-intro"><div><span class="neo-kicker">ASSESSMENT</span><h1>'+h(d.exam.title)+'</h1><p>'+h(d.exam.instructions||'Answer every question carefully. Your work is saved automatically.')+'</p></div><div class="rb-integrity-pill">'+(proctored?'Integrity <b id="violation-count">'+violations+'</b>/3':'Practice')+'</div></div>'+
      d.questions.map((q,i)=>'<section class="examq rb-question" id="q-'+q.id+'" data-question="'+q.id+'"><div class="rb-q-number">'+String(i+1).padStart(2,'0')+'</div><div class="rb-q-body"><div class="rb-q-meta"><span>'+h(q.marks)+' mark'+(Number(q.marks)===1?'':'s')+'</span>'+(q.word_guidance?'<span>'+h(q.word_guidance)+'</span>':'')+'</div><div class="exam-question-text">'+h(q.text).replaceAll('\\n','<br>')+'</div>'+answerHtml(q)+'</div></section>').join('')+
      '<footer class="rb-exam-submit"><div><b>Finished?</b><small>Review your answers before final submission.</small></div><button class="neo-btn big" type="submit">Submit exam <span>→</span></button></footer></form></main>';

    document.getElementById('fsbtn').onclick=ensureFullscreen;
    document.querySelectorAll('[data-jump]').forEach(btn=>btn.onclick=()=>{
      const target=document.getElementById('q-'+btn.dataset.jump);
      if(target)target.scrollIntoView({behavior:'smooth',block:'start'});
    });
    const qObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        document.querySelectorAll('[data-jump]').forEach(b=>b.classList.toggle('active',b.dataset.jump===entry.target.dataset.question));
      });
    },{rootMargin:'-25% 0px -60% 0px',threshold:.01});
    document.querySelectorAll('.rb-question').forEach(q=>qObserver.observe(q));
    if(proctored){
      const form=document.getElementById('xaf');
      form.classList.add('exam-interaction-locked');
      document.getElementById('proctor-retry').onclick=async()=>{
        const ok=await startProctor();
        if(!ok)return;
        const fs=await ensureFullscreen();
        if(!fs){
          const status=document.getElementById('proctor-consent-status');
          if(status){status.textContent='Camera and microphone are enabled. Please allow fullscreen to begin the exam.';status.className='error'}
          return;
        }
        enableIntegrityMonitoring();
        document.getElementById('proctor-lock')?.remove();
        form.classList.remove('exam-interaction-locked');
        [...form.querySelectorAll('input,textarea,select,button')].forEach(el=>{el.disabled=false;el.removeAttribute('aria-disabled')});
        const status=document.getElementById('proctor-consent-status');
        if(status){status.textContent='Proctoring active. You may begin the exam.';status.className='success'}
      };
    }
    restoreEmergencyDrafts();
    bindIELTSAudio();

    document.querySelectorAll('[data-q]').forEach(el=>{
      const handler=()=>{
        const qid=el.dataset.q,q=questionMap.get(String(qid));
        if(!q)return;
        queueSave(String(qid),currentAnswer(q));
      };
      el.addEventListener((el.tagName==='TEXTAREA'||el.type==='text')?'input':'change',handler);
    });

    document.getElementById('xaf').onsubmit=async e=>{
      e.preventDefault();
      if(submitting)return;
      suppressIntegrity=true;
      const ok=confirm('Submit this exam? You will not be able to change your answers afterward.');
      if(!ok){setTimeout(()=>{suppressIntegrity=false},500);return}
      submitting=true;
      clearInterval(autosaveHandle);autosaveHandle=null;
      saveTimers.forEach(t=>clearTimeout(t));saveTimers.clear();
      const submitBtn=e.currentTarget.querySelector('button[type="submit"]');
      if(submitBtn){submitBtn.disabled=true;submitBtn.textContent='Submitting…'}
      setSaveStatus('Saving final answers…','saving');
      try{
        await checkpoint();
        setSaveStatus('Submitting exam…','saving');
        await api('/attempts/'+aid+'/submit',{method:'POST',body:'{}'});
        finishToResults();
      }catch(err){
        try{
          const check=await api('/attempts/'+aid);
          if(check.status!=='IN_PROGRESS'){finishToResults();return}
        }catch{}
        submitting=false;
        suppressIntegrity=false;
        if(submitBtn){submitBtn.disabled=false;submitBtn.textContent='Submit exam'}
        autosaveHandle=setInterval(checkpoint,60000);
        setSaveStatus('Submission failed — your answers remain saved locally','offline');
        alert('The exam could not be submitted yet. Your answers are preserved. Please try Submit again.');
      }
    };
  };

  const tick=()=>{
    const t=document.getElementById('tm');
    if(!t||closed)return;
    const remaining=Math.max(0,Math.ceil((deadline-(Date.now()+serverOffset))/1000));
    const mm=Math.floor(remaining/60),ss=remaining%60;
    t.textContent=mm+':'+String(ss).padStart(2,'0');
    document.title='Exam · '+mm+':'+String(ss).padStart(2,'0');
    if(remaining<=0){
      clearInterval(timerHandle);
      checkpoint().finally(()=>api('/attempts/'+aid+'/submit',{method:'POST',body:'{}'}).finally(finishToResults));
    }
  };

  draw();
  tick();
  timerHandle=setInterval(tick,1000);
  autosaveHandle=setInterval(checkpoint,60000);
  if(proctored&&!document.fullscreenElement)warn('This is a proctored exam. Enable camera and microphone, then enter fullscreen.');
}
function cleanExamOption(v){let s=String(v??'').trim();s=s.replace(/\s+Book\s+\d+\s+Part\s+[A-Z].*$/i,'').trim();s=s.replace(/\s+(Elementary|Pre-Intermediate|Intermediate|Upper-Intermediate|Advanced)\s+Test\s*[-:]?\s*\d+.*$/i,'').trim();return s}
function answerHtml(q){if(q.type==='mcq'||q.type==='truefalse')return (q.options||[]).map(o=>'<label class="choice"><input type="radio" data-q="'+q.id+'" name="q'+q.id+'" value="'+h(o.id)+'" '+(q.answer===o.id?'checked':'')+'> '+h(cleanExamOption(o.text))+'</label>').join('');if(q.type==='multi')return (q.options||[]).map(o=>'<label class="choice"><input type="checkbox" data-q="'+q.id+'" value="'+h(o.id)+'" '+(Array.isArray(q.answer)&&q.answer.includes(o.id)?'checked':'')+'> '+h(cleanExamOption(o.text))+'</label>').join('');if(q.type==='written'){const rows=Math.max(2,Math.min(18,Number(q.answer_lines||3)));return '<label class="field written-answer-field"><textarea class="written-answer" data-q="'+q.id+'" rows="'+rows+'" autocomplete="off" spellcheck="true" placeholder="Write your answer here...">'+h(q.answer??'')+'</textarea></label>';}return '<label class="field"><input data-q="'+q.id+'" value="'+h(q.answer??'')+'" autocomplete="off"></label>'}
init()})();
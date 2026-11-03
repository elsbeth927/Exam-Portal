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
  <div class="neo-landing">
    <header class="neo-header">
      <button class="neo-brand" type="button" aria-label="Redbridge Exam Platform home">
        <img src="/app/redbridge-logo.svg" alt="Redbridge International School">
        <span>Exam Platform</span>
      </button>
      <nav class="neo-public-nav">
        <button id="browse-public" class="neo-link">Exams</button>
        <button id="term-public" class="neo-link">Term Exams</button>
        <button id="signin-open" class="neo-btn ghost">Sign in</button>
        <button id="register-open" class="neo-btn">Create account</button>
      </nav>
    </header>

    <main class="neo-hero-wrap">
      <section class="neo-hero">
        <div class="neo-eyebrow"><span></span> Secure assessment, reimagined</div>
        <h1>One platform.<br><em>Every exam.</em></h1>
        <p>Take IELTS practice, Olympiads, placement tests, term exams and subject assessments in one focused, proctored environment.</p>
        <div class="neo-hero-actions">
          <button id="hero-register" class="neo-btn big">Start taking exams</button>
          <button id="hero-term" class="neo-btn ghost big">Take a Term Exam</button>
        </div>
        <div class="neo-trust-row">
          <span>Timed attempts</span><span>Autosave</span><span>Camera + mic checks</span><span>Instant results</span><span>Certificates</span>
        </div>
      </section>

      <section class="neo-showcase">
        <div class="neo-orbit orbit-a"></div><div class="neo-orbit orbit-b"></div>
        <article class="neo-feature-card main-card">
          <div class="neo-card-top"><span class="neo-chip red">LIVE</span><span class="neo-muted">Proctored exam</span></div>
          <h3>English Olympiad</h3><p>Senior Group · 60 min</p>
          <div class="neo-progress"><i style="width:74%"></i></div>
          <div class="neo-card-footer"><span>40 questions</span><b>Start →</b></div>
        </article>
        <article class="neo-mini-card mini-one"><span class="neo-icon">◎</span><div><b>IELTS</b><small>Practice tests</small></div></article>
        <article class="neo-mini-card mini-two"><span class="neo-icon">∑</span><div><b>Math Olympiad</b><small>Junior · Senior</small></div></article>
        <article class="neo-score-card"><small>Latest score</small><strong>86%</strong><span>Certificate ready</span></article>
      </section>
    </main>

    <section class="neo-category-strip" id="public-exam-section">
      <div class="neo-section-head"><div><span class="neo-kicker">EXAM LIBRARY</span><h2>Choose your challenge</h2></div><p>Focused categories. Clear levels. No classroom clutter.</p></div>
      <div class="neo-category-grid">
        ${[
          ['IELTS','Academic & General','◌'],
          ['English Olympiad','Junior & Senior','A'],
          ['Math Olympiad','Junior & Senior','∑'],
          ['Placement Tests','A1 to C2','↗'],
          ['Subject Exams','English · Math · Science','□'],
          ['Term Exams','No account required','●']
        ].map(x=>'<button class="neo-category-card public-category" data-cat="'+h(x[0])+'"><span class="neo-category-icon">'+x[2]+'</span><b>'+h(x[0])+'</b><small>'+h(x[1])+'</small><i>Explore →</i></button>').join('')}
      </div>
    </section>

    <section class="neo-proctor-band">
      <div><span class="neo-kicker light">SECURE MODE</span><h2>Built for serious exams.</h2></div>
      <div class="neo-proctor-points">
        <span><b>01</b> Camera permission</span>
        <span><b>02</b> Microphone permission</span>
        <span><b>03</b> Fullscreen monitoring</span>
        <span><b>04</b> Tab-switch warnings</span>
        <span><b>05</b> Autosave + resume</span>
      </div>
    </section>

    <footer class="neo-footer">Redbridge International School · Exam Platform</footer>
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
  document.getElementById('register-open').onclick=openRegister;
  document.getElementById('hero-register').onclick=openRegister;
  document.getElementById('hero-term').onclick=()=>openTermExamChooser();
  document.getElementById('term-public').onclick=()=>openTermExamChooser();
  document.getElementById('browse-public').onclick=()=>document.getElementById('public-exam-section').scrollIntoView({behavior:'smooth'});
  document.querySelectorAll('.public-category').forEach(b=>b.onclick=()=>b.dataset.cat==='Term Exams'?openTermExamChooser():openRegister());
}
function navItems(){
  const r=state.me.role;
  if(r==='student')return[['dashboard','Discover'],['ielts','IELTS'],['student-exams','My Exams'],['student-results','Results'],['certificates','Certificates']];
  return [['dashboard','Overview'],['exams','Exams'],['questions','Question Bank'],['marking','Submissions']];
}
function navIcon(k){return ({dashboard:'⌂',ielts:'I','student-exams':'◫','student-results':'◉',certificates:'◇',exams:'▣',questions:'?','marking':'✓'}[k]||'•')}
function render(){
  const items=navItems();
  const admin=state.me.role!=='student';
  R.innerHTML=`
  <div class="neo-app">
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
    const msg=isResume?'You already have this exam in progress. The timer has continued running. Resume now?':'Before you begin, make sure you are ready. The timer starts immediately and secure exams may require camera, microphone and fullscreen access. Continue?';
    if(!confirm(msg))return;
    const d=await api('/student/exams/'+b.dataset.id+'/start',{method:'POST',body:'{}'});
    exam(d.attempt_id);
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

async function loadView(){const P=document.getElementById('page');P.innerHTML='<div class="card">Loading…</div>';try{if(state.view==='dashboard'){
  if(state.me.role==='student'){
    const es=await api('/student/exams');
    const rs=await api('/student/results');
    const released=rs.filter(x=>x.results_published);
    const best=released.length?Math.max(...released.map(x=>Number(x.percentage||0))):0;
    P.innerHTML='<section class="neo-dashboard-hero"><div><span class="neo-kicker">YOUR EXAM CENTER</span><h1>Choose your next challenge.</h1><p>Browse available exams, resume an attempt, and keep your results and certificates in one place.</p></div><button class="neo-btn big" id="go-library">Explore exams</button></section>'+
      '<section class="neo-stat-grid"><article><small>Available exams</small><strong>'+es.length+'</strong><span>Open in your catalog</span></article><article><small>Released results</small><strong>'+released.length+'</strong><span>Completed attempts</span></article><article><small>Best score</small><strong>'+Math.round(best)+'%</strong><span>Your personal best</span></article></section>'+
      '<section class="neo-section"><div class="neo-section-head compact"><div><span class="neo-kicker">AVAILABLE NOW</span><h2>Start an exam</h2></div></div><div class="neo-exam-grid">'+(es.length?es.slice(0,4).map(examCard).join(''):'<div class="neo-empty">No exams are available yet.</div>')+'</div></section>';
    document.getElementById('go-library').onclick=()=>{state.view='student-exams';render()};
    document.querySelectorAll('.start').forEach(bindExamStart);
  }else{
    const d=await api('/dashboard');
    const stats=Object.entries(d);
    P.innerHTML='<section class="neo-dashboard-hero admin"><div><span class="neo-kicker">EXAM OPERATIONS</span><h1>Run assessments, not classrooms.</h1><p>Create exams, manage question banks, review submissions and publish results from one focused console.</p></div><button class="neo-btn big" id="go-exams">Manage exams</button></section>'+
      '<section class="neo-stat-grid">'+stats.slice(0,3).map(x=>'<article><small>'+h(String(x[0]).replaceAll('_',' '))+'</small><strong>'+h(x[1])+'</strong><span>Live platform metric</span></article>').join('')+'</section>'+
      '<section class="neo-admin-actions"><button data-go="exams"><span>▣</span><b>Exams</b><small>Create and schedule assessments</small></button><button data-go="questions"><span>?</span><b>Question Bank</b><small>Build reusable questions</small></button><button data-go="marking"><span>✓</span><b>Submissions</b><small>Mark and publish results</small></button></section>';
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
  P.innerHTML='<div class="neo-section-head"><div><span class="neo-kicker">ACHIEVEMENTS</span><h2>Certificates</h2></div><p>Certificates become available after a successful published result.</p></div>'+
    '<div class="neo-cert-grid">'+(rs.length?rs.map(x=>'<article class="neo-cert-card"><div class="neo-cert-mark">R</div><div><span class="neo-kicker">CERTIFICATE</span><h3>'+h(x.title)+'</h3><p>'+h(state.me.first_name+' '+state.me.last_name)+' · '+Math.round(Number(x.percentage||0))+'%</p></div><button class="neo-btn cert-download" data-title="'+h(x.title)+'" data-score="'+h(x.percentage)+'">Open certificate</button></article>').join(''):'<div class="neo-empty">Pass an exam to unlock a certificate.</div>')+'</div>';
  document.querySelectorAll('.cert-download').forEach(btn=>btn.onclick=()=>openCertificate(btn.dataset.title,btn.dataset.score));
}
else if(state.view==='audit'){const rs=await api('/audit');P.innerHTML='<div class="card"><table class="table"><thead><tr><th>Time</th><th>User</th><th>Action</th><th>Entity</th></tr></thead><tbody>'+rs.map(x=>'<tr><td>'+h(new Date(x.at).toLocaleString())+'</td><td>'+h(x.user_label||'')+'</td><td>'+h(x.action)+'</td><td>'+h((x.entity||'')+' '+(x.entity_id||''))+'</td></tr>').join('')+'</tbody></table></div>'}}catch(e){P.innerHTML='<div class="card error">'+h(e.message)+'</div>'}}

function openCertificate(title,score){
  const name=state.me.first_name+' '+state.me.last_name;
  const w=window.open('','_blank');
  if(!w){alert('Please allow pop-ups to open the certificate.');return}
  const html='<!doctype html><html><head><title>Certificate</title><style>body{margin:0;font-family:Arial,sans-serif;background:#f5f2eb;color:#102636}.sheet{width:1050px;min-height:720px;margin:30px auto;background:white;padding:70px;box-sizing:border-box;border-top:12px solid #b51e33}.brand{letter-spacing:.12em;text-transform:uppercase}.title{font:700 58px Georgia,serif;margin:85px 0 18px}.name{font:italic 44px Georgia,serif;color:#b51e33;margin:26px 0}.exam{font-size:25px}.score{margin-top:30px;font-size:21px}.foot{margin-top:90px;padding-top:18px;border-top:1px solid #ddd;display:flex;justify-content:space-between}@media print{body{background:#fff}.sheet{margin:0}}</style></head><body><div class="sheet"><div class="brand">Redbridge International School · Exam Platform</div><div class="title">Certificate of Achievement</div><p>This certifies that</p><div class="name">'+h(name)+'</div><p>successfully completed</p><div class="exam">'+h(title)+'</div><div class="score">Final score: <b>'+Math.round(Number(score||0))+'%</b></div><div class="foot"><span>Redbridge Exam Platform</span><span>'+new Date().toLocaleDateString()+'</span></div></div></body></html>';
  w.document.write(html);w.document.close();setTimeout(()=>w.print(),250);
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
  let timerHandle=null,autosaveHandle=null,closed=false;
  const saveTimers=new Map(),questionMap=new Map(d.questions.map(q=>[String(q.id),q]));
  const draftKey=qid=>'rb_term_draft_'+aid+'_'+qid;
  const currentAnswer=q=>{const els=[...document.querySelectorAll('[data-q="'+q.id+'"]')];if(q.type==='multi')return els.filter(x=>x.checked).map(x=>x.value);if(q.type==='mcq'||q.type==='truefalse')return els.find(x=>x.checked)?.value??null;return els[0]?.value??''};
  const setStatus=t=>{const el=document.getElementById('autosave-status');if(el)el.textContent=t};
  const saveOne=async(qid,val)=>{try{await termApi('/term-attempts/'+aid,{method:'PUT',body:JSON.stringify({question_id:Number(qid),answer:val})});localStorage.removeItem(draftKey(qid));setStatus('Saved '+new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'}))}catch{setStatus('Offline draft saved locally')}};
  const checkpoint=async()=>{for(const q of d.questions)await saveOne(String(q.id),currentAnswer(q))};
  const finish=()=>{closed=true;clearInterval(timerHandle);clearInterval(autosaveHandle);sessionStorage.removeItem('rb_term_attempt');sessionStorage.removeItem('rb_term_token');d.questions.forEach(q=>localStorage.removeItem(draftKey(q.id)));alert('Your Term Exam has been submitted successfully.');state.me?render():showPublicTermExams()};
  E.innerHTML='<div class="exam-watermark">'+h(d.student_name+' · '+d.class_name)+'</div><div class="top exam-top"><div><h2 style="margin:0">'+h(d.exam.title)+'</h2><div class="mut">'+h(d.student_name)+' · '+h(d.class_name)+'</div><div id="autosave-status" class="autosave-status saved">Autosave active · checkpoint every 60 seconds</div></div><div class="timer" id="tm"></div></div>'+
    (d.exam.description?'<details class="card source-material" open><summary><b>Test paper / source material</b></summary><pre>'+h(d.exam.description)+'</pre></details>':'')+
    '<form id="term-exam-form" class="card exam-paper">'+d.questions.map((q,i)=>'<div class="examq">'+ieltsQuestionResource(q)+'<div class="exam-question-text"><b>'+(i+1)+'.</b> '+h(q.text).replaceAll('\\n','<br>')+'</div><div class="mut">'+h(q.marks)+' mark(s)'+(q.word_guidance?' · '+h(q.word_guidance):'')+'</div>'+answerHtml(q)+'</div>').join('')+'<button class="btn" type="submit">Submit Term Exam</button></form>';
  d.questions.forEach(q=>{let draft=null;try{draft=JSON.parse(localStorage.getItem(draftKey(q.id))||'null')}catch{};if(!draft)return;const els=[...document.querySelectorAll('[data-q="'+q.id+'"]')];if(q.type==='multi')els.forEach(el=>el.checked=Array.isArray(draft.value)&&draft.value.includes(el.value));else if(q.type==='mcq'||q.type==='truefalse')els.forEach(el=>el.checked=draft.value===el.value);else if(els[0])els[0].value=draft.value??''});
  document.querySelectorAll('[data-q]').forEach(el=>{const ev=(el.tagName==='TEXTAREA'||el.type==='text')?'input':'change';el.addEventListener(ev,()=>{const q=questionMap.get(String(el.dataset.q));if(!q)return;const val=currentAnswer(q);try{localStorage.setItem(draftKey(q.id),JSON.stringify({value:val,at:Date.now()}))}catch{}clearTimeout(saveTimers.get(String(q.id)));saveTimers.set(String(q.id),setTimeout(()=>saveOne(String(q.id),val),1200))})});
  document.getElementById('term-exam-form').onsubmit=async e=>{e.preventDefault();if(!confirm('Submit this Term Exam? You will not be able to change your answers afterward.'))return;await checkpoint();await termApi('/term-attempts/'+aid+'/submit',{method:'POST',body:'{}'});finish()};
  const tick=()=>{if(closed)return;const rem=Math.max(0,Math.ceil((deadline-(Date.now()+serverOffset))/1000));document.getElementById('tm').textContent=Math.floor(rem/60)+':'+String(rem%60).padStart(2,'0');if(rem<=0){clearInterval(timerHandle);checkpoint().finally(()=>termApi('/term-attempts/'+aid+'/submit',{method:'POST',body:'{}'}).finally(finish))}};
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
function modal(content,onopen){const d=document.createElement('div');d.className='modal';d.id='modal';d.innerHTML='<div class="card"><div class="row" style="justify-content:flex-end"><button id="mc" class="btn alt sm">Close</button></div>'+content+'</div>';document.body.appendChild(d);document.getElementById('mc').onclick=closeModal;onopen&&onopen()}
function closeModal(){document.getElementById('modal')?.remove()}
async function exam(aid){
  state.view='exam';
  R.innerHTML='<div class="main secure-exam"><div id="exam"></div></div>';
  const E=document.getElementById('exam');
  const d=await api('/attempts/'+aid);
  if(d.status!=='IN_PROGRESS'){state.view='student-results';render();return}

  const deadline=new Date(d.deadline_at).getTime();
  const serverOffset=new Date(d.server_now).getTime()-Date.now();
  let timerHandle=null,autosaveHandle=null,closed=false,lastViolationAt=0,violations=0,proctorStream=null,audioCtx=null,audioFrame=null;
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
      setSaveStatus('Offline draft saved locally','offline');
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
    if(closed)return;
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
    if(status)status.textContent='Requesting camera and microphone…';
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
      if(status){status.textContent='Camera and microphone access is required for this secure exam.';status.className='error'}
      report('proctor_permission_denied','Camera or microphone permission was denied.');
      return false;
    }
  };

  const onVisibility=()=>{
    if(document.hidden){
      checkpoint();
      report('visibility_hidden','You left the exam tab.');
    }
  };
  const onBlur=()=>{checkpoint();report('window_blur','The exam window lost focus.')};
  const onFullscreen=()=>{if(!document.fullscreenElement)report('fullscreen_exit','Fullscreen mode was exited.')};
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

  document.addEventListener('visibilitychange',onVisibility);
  window.addEventListener('blur',onBlur);
  document.addEventListener('fullscreenchange',onFullscreen);
  document.addEventListener('contextmenu',blockContext);
  document.addEventListener('copy',blockClipboard);
  document.addEventListener('cut',blockClipboard);
  document.addEventListener('paste',blockClipboard);
  document.addEventListener('keydown',onKey);

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
      '<div class="proctor-consent"><h3>Secure proctoring</h3><p class="mut">Camera, microphone and fullscreen access are required. The platform records integrity incidents when the exam loses focus or a required device disconnects.</p><div class="proctor-checks"><span>● Camera</span><span>● Microphone</span><span>● Fullscreen</span></div><div id="proctor-consent-status" class="mut">Preparing proctoring…</div><button id="proctor-retry" class="btn alt sm" type="button">Reconnect camera & mic</button></div>'+
      '<div class="top exam-top"><div><h2 style="margin:0">'+h(d.exam.title)+'</h2><div class="mut">'+h(d.exam.instructions||'')+'</div><div class="integrity-status">Secure exam · Violations: <b id="violation-count">'+violations+'</b>/3</div><div id="autosave-status" class="autosave-status saved">Autosave active · checkpoint every 60 seconds</div></div><div><div class="timer" id="tm"></div><button id="fsbtn" class="btn alt sm" type="button">Fullscreen</button></div></div>'+
      (d.exam.description?'<details class="card source-material" open><summary><b>Test paper / source material</b></summary><pre>'+h(d.exam.description)+'</pre></details>':'')+
      '<form id="xaf" class="card exam-paper">'+
      d.questions.map((q,i)=>'<div class="examq"><div class="exam-question-text"><b>'+(i+1)+'.</b> '+h(q.text).replaceAll('\\n','<br>')+'</div><div class="mut">'+h(q.marks)+' mark(s)'+(q.word_guidance?' · '+h(q.word_guidance):'')+'</div>'+answerHtml(q)+'</div>').join('')+
      '<button class="btn" type="submit">Submit exam</button></form>';

    document.getElementById('fsbtn').onclick=ensureFullscreen;
    document.getElementById('proctor-retry').onclick=startProctor;
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
      if(!confirm('Submit this exam? You will not be able to change your answers afterward.'))return;
      await checkpoint();
      await api('/attempts/'+aid+'/submit',{method:'POST',body:'{}'});
      finishToResults();
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
  await startProctor();
  tick();
  timerHandle=setInterval(tick,1000);
  autosaveHandle=setInterval(checkpoint,60000);
  if(!document.fullscreenElement)warn('Fullscreen is required. Click Fullscreen before continuing.');
}
function cleanExamOption(v){let s=String(v??'').trim();s=s.replace(/\s+Book\s+\d+\s+Part\s+[A-Z].*$/i,'').trim();s=s.replace(/\s+(Elementary|Pre-Intermediate|Intermediate|Upper-Intermediate|Advanced)\s+Test\s*[-:]?\s*\d+.*$/i,'').trim();return s}
function answerHtml(q){if(q.type==='mcq'||q.type==='truefalse')return (q.options||[]).map(o=>'<label class="choice"><input type="radio" data-q="'+q.id+'" name="q'+q.id+'" value="'+h(o.id)+'" '+(q.answer===o.id?'checked':'')+'> '+h(cleanExamOption(o.text))+'</label>').join('');if(q.type==='multi')return (q.options||[]).map(o=>'<label class="choice"><input type="checkbox" data-q="'+q.id+'" value="'+h(o.id)+'" '+(Array.isArray(q.answer)&&q.answer.includes(o.id)?'checked':'')+'> '+h(cleanExamOption(o.text))+'</label>').join('');if(q.type==='written'){const rows=Math.max(2,Math.min(18,Number(q.answer_lines||3)));return '<label class="field written-answer-field"><textarea class="written-answer" data-q="'+q.id+'" rows="'+rows+'" autocomplete="off" spellcheck="true" placeholder="Write your answer here...">'+h(q.answer??'')+'</textarea></label>';}return '<label class="field"><input data-q="'+q.id+'" value="'+h(q.answer??'')+'" autocomplete="off"></label>'}
init()})();
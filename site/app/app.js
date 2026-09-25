(()=>{const R=document.getElementById('root');const API_BASE='https://uxbzfirtxpwpbhlsusmf.supabase.co/functions/v1/exam-api';let state={me:null,csrf:null,view:'dashboard',data:{},token:sessionStorage.getItem('rb_session')||'',setupRequired:false};const h=(s='')=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));async function api(path,opt={}){const headers={'content-type':'application/json',...(opt.headers||{})};if(state.token)headers['authorization']='Bearer '+state.token;if(state.csrf&&!['GET','HEAD'].includes((opt.method||'GET').toUpperCase()))headers['x-csrf-token']=state.csrf;const r=await fetch(API_BASE+path,{...opt,headers});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'Request failed');return d}
async function init(){try{const cfg=await api('/config');state.setupRequired=!!cfg.setup_required;if(cfg.setup_required){location.replace('/app/setup.html');return}const d=await api('/me');state.me=d.user;state.csrf=d.csrf;render()}catch{login()}}
function login(){R.innerHTML='<div class="login"><form id="lf" class="loginbox stack"><div><div class="mut">Redbridge International School</div><h1>Exam Platform</h1><p class="mut">Sign in with your school account.</p></div><label class="field">Email<input name="email" type="email" required></label><label class="field">Password<input name="password" type="password" required></label><button class="btn">Sign in</button>'+(state.setupRequired?'<a class="btn alt" href="/app/setup.html" style="text-align:center">First-time administrator setup</a>':'')+'<div id="le" class="error"></div></form></div>';document.getElementById('lf').onsubmit=async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));try{const d=await api('/login',{method:'POST',body:JSON.stringify(f)});state.me=d.user;state.csrf=d.csrf;state.token=d.session_token||'';if(state.token)sessionStorage.setItem('rb_session',state.token);render()}catch(x){document.getElementById('le').textContent=x.message}}}
function navItems(){const r=state.me.role;if(r==='student')return[['dashboard','Dashboard'],['student-exams','My Exams'],['student-results','My Results']];const a=[['dashboard','Dashboard'],['questions','Question Bank'],['exams','Exams']];if(r==='academic_admin'||r==='super_admin')a.push(['classes','Classes & Subjects'],['users','Users'],['audit','Audit Log']);return a}
function render(){R.innerHTML='<div class="shell"><aside class="rail"><div class="school-logo-wrap"><img class="school-logo" src="/app/redbridge-logo.svg" alt="Redbridge International School logo"></div><div class="logo"><span>Redbridge</span> Exam Platform</div><div class="nav">'+navItems().map(([k,l])=>'<button data-v="'+k+'" class="'+(state.view===k?'active':'')+'">'+l+'</button>').join('')+'</div></aside><main class="main"><div class="top"><div><h2 style="margin:0">'+h(navItems().find(x=>x[0]===state.view)?.[1]||'Platform')+'</h2><div class="mut">'+h(state.me.first_name+' '+state.me.last_name)+' · '+h(state.me.role.replaceAll('_',' '))+'</div></div><button id="logout" class="btn alt">Sign out</button></div><div id="page"></div></main></div>';document.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{state.view=b.dataset.v;render()});document.getElementById('logout').onclick=async()=>{try{await api('/logout',{method:'POST',body:'{}'})}finally{sessionStorage.removeItem('rb_session');state={me:null,csrf:null,view:'dashboard',data:{},token:''};login()}};loadView()}
async function loadView(){const P=document.getElementById('page');P.innerHTML='<div class="card">Loading…</div>';try{if(state.view==='dashboard'){const d=await api('/dashboard');P.innerHTML='<div class="grid">'+Object.entries(d).map(([k,v])=>'<div class="card metric"><div class="mut">'+h(k.replaceAll('_',' '))+'</div><b>'+h(v)+'</b></div>').join('')+'</div>'}
else if(state.view==='classes'){const [cs,ss]=await Promise.all([api('/classes'),api('/subjects')]);P.innerHTML='<div class="grid"><div class="card"><h3 class="section-title">Classes</h3><form id="cf" class="row"><input name="name" placeholder="10A" required><input name="grade" type="number" min="1" max="11" placeholder="Grade" required><button class="btn sm">Add</button></form><table class="table"><tbody>'+cs.map(x=>'<tr><td>'+h(x.name)+'</td><td>Grade '+h(x.grade)+'</td></tr>').join('')+'</tbody></table></div><div class="card"><h3 class="section-title">Subjects</h3><form id="sf" class="row"><input name="name" placeholder="Mathematics" required><button class="btn sm">Add</button></form><table class="table"><tbody>'+ss.map(x=>'<tr><td>'+h(x.name)+'</td></tr>').join('')+'</tbody></table></div></div>';document.getElementById('cf').onsubmit=e=>submitForm(e,'/classes');document.getElementById('sf').onsubmit=e=>submitForm(e,'/subjects')}
else if(state.view==='users'){const rows=await api('/users');P.innerHTML='<div class="card"><div class="row" style="justify-content:space-between"><h3 class="section-title">School users</h3><button id="nu" class="btn sm">New user</button></div><table class="table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead><tbody>'+rows.map(x=>'<tr><td>'+h(x.first_name+' '+x.last_name)+'</td><td>'+h(x.email)+'</td><td>'+h(x.role)+'</td><td>'+h(x.status)+'</td></tr>').join('')+'</tbody></table></div>';document.getElementById('nu').onclick=()=>modal('<h3>New user</h3><form id="uf" class="stack"><label class="field">First name<input name="first_name" required></label><label class="field">Last name<input name="last_name" required></label><label class="field">Email<input name="email" type="email" required></label><label class="field">Role<select name="role"><option>student</option><option>teacher</option><option>academic_admin</option></select></label><label class="field">Temporary password<input name="password" type="password" required></label><button class="btn">Create</button></form>',()=>document.getElementById('uf').onsubmit=e=>submitForm(e,'/users',true))}
else if(state.view==='questions'){const [qs,ss]=await Promise.all([api('/questions'),api('/subjects')]);P.innerHTML='<div class="card"><div class="row" style="justify-content:space-between"><h3 class="section-title">Question bank</h3><button id="nq" class="btn sm">New question</button></div><table class="table"><thead><tr><th>Question</th><th>Subject</th><th>Grade</th><th>Type</th></tr></thead><tbody>'+qs.map(x=>'<tr><td>'+h(x.text)+'</td><td>'+h(x.subject)+'</td><td>'+h(x.grade)+'</td><td>'+h(x.type)+'</td></tr>').join('')+'</tbody></table></div>';document.getElementById('nq').onclick=()=>modal('<h3>New question</h3><form id="qf" class="stack"><label class="field">Subject<select name="subject_id">'+ss.map(s=>'<option value="'+s.id+'">'+h(s.name)+'</option>').join('')+'</select></label><label class="field">Grade<input name="grade" type="number" min="1" max="11" value="9"></label><label class="field">Question<textarea name="text" required></textarea></label><label class="field">Type<select name="type"><option value="mcq">Multiple choice</option><option value="truefalse">True/False</option><option value="short">Short answer</option><option value="numeric">Numeric</option></select></label><label class="field">Options (comma separated for MCQ)<input name="options"></label><label class="field">Correct answer<input name="correct" required></label><label class="field">Difficulty<select name="difficulty"><option>easy</option><option selected>medium</option><option>hard</option><option>olympiad</option></select></label><label class="field">Marks<input name="marks" type="number" min=".25" step=".25" value="1"></label><button class="btn">Save question</button></form>',()=>document.getElementById('qf').onsubmit=async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));if(f.type==='mcq')f.options=f.options.split(',').map(x=>x.trim()).filter(Boolean);if(f.type==='multi')f.correct=f.correct.split(',').map(x=>x.trim());if(f.type==='short')f.correct=[f.correct];if(f.type==='numeric')f.correct={value:Number(f.correct),tolerance:0};await api('/questions',{method:'POST',body:JSON.stringify(f)});closeModal();loadView()})}
else if(state.view==='exams'){const [es,ss,qs,cs]=await Promise.all([api('/exams'),api('/subjects'),api('/questions'),api('/classes')]);P.innerHTML='<div class="card"><div class="row" style="justify-content:space-between"><h3 class="section-title">Exams</h3><button id="ne" class="btn sm">Build exam</button></div><table class="table"><thead><tr><th>Title</th><th>Subject</th><th>Status</th><th>Duration</th><th></th></tr></thead><tbody>'+es.map(x=>'<tr><td>'+h(x.title)+'</td><td>'+h(x.subject)+'</td><td><span class="badge">'+h(x.status)+'</span></td><td>'+h(x.duration_min)+' min</td><td>'+(state.me.role!=='teacher'?'<button class="btn sm sched" data-id="'+x.id+'">Schedule</button>':'')+'</td></tr>').join('')+'</tbody></table></div>';document.getElementById('ne').onclick=()=>modal('<h3>Build exam</h3><form id="ef" class="stack"><label class="field">Title<input name="title" required></label><label class="field">Subject<select name="subject_id">'+ss.map(s=>'<option value="'+s.id+'">'+h(s.name)+'</option>').join('')+'</select></label><label class="field">Grade<input name="grade" type="number" min="1" max="11" value="9"></label><label class="field">Duration (minutes)<input name="duration_min" type="number" value="45"></label><label class="field">Pass %<input name="pass_percent" type="number" value="50"></label><div class="field"><span>Questions</span>'+qs.map(q=>'<label><input type="checkbox" name="question_ids" value="'+q.id+'"> '+h(q.text)+'</label>').join('')+'</div><button class="btn">Create exam</button></form>',()=>document.getElementById('ef').onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.target),o=Object.fromEntries(fd);o.question_ids=fd.getAll('question_ids').map(Number);await api('/exams',{method:'POST',body:JSON.stringify(o)});closeModal();loadView()});document.querySelectorAll('.sched').forEach(b=>b.onclick=()=>modal('<h3>Schedule exam</h3><form id="scf" class="stack"><label class="field">Start<input name="start_time" type="datetime-local"></label><label class="field">End<input name="end_time" type="datetime-local"></label><div class="field"><span>Classes</span>'+cs.map(c=>'<label><input type="checkbox" name="class_ids" value="'+c.id+'"> '+h(c.name)+'</label>').join('')+'</div><button class="btn">Schedule</button></form>',()=>document.getElementById('scf').onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.target),o=Object.fromEntries(fd);o.class_ids=fd.getAll('class_ids').map(Number);o.student_ids=[];if(o.start_time)o.start_time=new Date(o.start_time).toISOString();if(o.end_time)o.end_time=new Date(o.end_time).toISOString();await api('/exams/'+b.dataset.id+'/schedule',{method:'POST',body:JSON.stringify(o)});closeModal();loadView()}))}
else if(state.view==='student-exams'){const es=await api('/student/exams');P.innerHTML='<div class="stack">'+(es.length?es.map(x=>'<div class="card"><div class="row" style="justify-content:space-between"><div><h3 style="margin:0">'+h(x.title)+'</h3><div class="mut">'+h(x.subject)+' · '+h(x.duration_min)+' min</div></div><button class="btn start" data-id="'+x.id+'">'+(x.attempt_status==='IN_PROGRESS'?'Resume':'Start')+'</button></div></div>').join(''):'<div class="card">No assigned exams are available.</div>')+'</div>';document.querySelectorAll('.start').forEach(b=>b.onclick=async()=>{
  const card=b.closest('.card');
  const title=card?.querySelector('h3')?.textContent||'this exam';
  const isResume=b.textContent.trim().toLowerCase()==='resume';
  const msg=isResume
    ? 'You already have an exam in progress. The timer has continued running since you first started.\n\nContinue '+title+' now?'
    : 'Are you ready to begin '+title+'?\n\nOnce you continue, the timer starts immediately and will keep running even if you close the page, lose power, or disconnect from the internet. Your work will be autosaved.\n\nChoose OK to continue or Cancel if you are not ready.';
  if(!confirm(msg))return;
  try{if(document.documentElement.requestFullscreen&&!document.fullscreenElement)await document.documentElement.requestFullscreen()}catch{}
  const d=await api('/student/exams/'+b.dataset.id+'/start',{method:'POST',body:'{}'});
  exam(d.attempt_id);
})}
else if(state.view==='student-results'){const rs=await api('/student/results');P.innerHTML='<div class="card"><table class="table"><thead><tr><th>Exam</th><th>Score</th><th>%</th><th>Status</th></tr></thead><tbody>'+rs.map(x=>'<tr><td>'+h(x.title)+'</td><td>'+(x.results_published?h(x.score+'/'+x.total):'Not released')+'</td><td>'+(x.results_published?h(x.percentage):'—')+'</td><td>'+h(x.results_published?(x.passed?'Pass':'Below pass mark'):'Pending')+'</td></tr>').join('')+'</tbody></table></div>'}
else if(state.view==='audit'){const rs=await api('/audit');P.innerHTML='<div class="card"><table class="table"><thead><tr><th>Time</th><th>User</th><th>Action</th><th>Entity</th></tr></thead><tbody>'+rs.map(x=>'<tr><td>'+h(new Date(x.at).toLocaleString())+'</td><td>'+h(x.user_label||'')+'</td><td>'+h(x.action)+'</td><td>'+h((x.entity||'')+' '+(x.entity_id||''))+'</td></tr>').join('')+'</tbody></table></div>'}}catch(e){P.innerHTML='<div class="card error">'+h(e.message)+'</div>'}}
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
  let timerHandle=null,autosaveHandle=null,closed=false,lastViolationAt=0,violations=0;
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
    const jobs=d.questions.map(q=>saveOne(String(q.id),currentAnswer(q),{silent:true}));
    const results=await Promise.allSettled(jobs);
    if(results.some(x=>x.status==='rejected'))setSaveStatus('Some answers remain in local backup','offline');
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
      '<div class="top exam-top"><div><h2 style="margin:0">'+h(d.exam.title)+'</h2><div class="mut">'+h(d.exam.instructions||'')+'</div><div class="integrity-status">Secure exam · Violations: <b id="violation-count">'+violations+'</b>/3</div><div id="autosave-status" class="autosave-status saved">Autosave active · checkpoint every 60 seconds</div></div><div><div class="timer" id="tm"></div><button id="fsbtn" class="btn alt sm" type="button">Fullscreen</button></div></div>'+
      '<form id="xaf" class="card exam-paper">'+
      d.questions.map((q,i)=>'<div class="examq"><b>'+(i+1)+'. '+h(q.text)+'</b><div class="mut">'+h(q.marks)+' mark(s)</div>'+answerHtml(q)+'</div>').join('')+
      '<button class="btn" type="submit">Submit exam</button></form>';

    document.getElementById('fsbtn').onclick=ensureFullscreen;
    restoreEmergencyDrafts();

    document.querySelectorAll('[data-q]').forEach(el=>{
      const handler=()=>{
        const qid=el.dataset.q,q=questionMap.get(String(qid));
        if(!q)return;
        queueSave(String(qid),currentAnswer(q));
      };
      el.addEventListener(el.type==='text'?'input':'change',handler);
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
  tick();
  timerHandle=setInterval(tick,1000);
  autosaveHandle=setInterval(checkpoint,60000);
  if(!document.fullscreenElement)warn('Fullscreen is required. Click Fullscreen before continuing.');
}
function answerHtml(q){if(q.type==='mcq'||q.type==='truefalse')return (q.options||[]).map(o=>'<label class="choice"><input type="radio" data-q="'+q.id+'" name="q'+q.id+'" value="'+h(o.id)+'" '+(q.answer===o.id?'checked':'')+'> '+h(o.text)+'</label>').join('');if(q.type==='multi')return (q.options||[]).map(o=>'<label class="choice"><input type="checkbox" data-q="'+q.id+'" value="'+h(o.id)+'" '+(Array.isArray(q.answer)&&q.answer.includes(o.id)?'checked':'')+'> '+h(o.text)+'</label>').join('');return '<label class="field"><input data-q="'+q.id+'" value="'+h(q.answer??'')+'" autocomplete="off"></label>'}
init()})();
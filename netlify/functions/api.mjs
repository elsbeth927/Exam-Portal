import crypto from "node:crypto";
import postgres from "postgres";

const sql = postgres(process.env.SUPABASE_DB_URL || "", {
  prepare:false, max:1, idle_timeout:20, connect_timeout:10, ssl:"require"
});

const PERMS = {
  student:["TAKE_EXAM","VIEW_OWN_RESULTS"],
  teacher:["MANAGE_QUESTIONS","CREATE_EXAM","ASSIGN_EXAM","VIEW_RESULTS"],
  academic_admin:["MANAGE_QUESTIONS","CREATE_EXAM","ASSIGN_EXAM","VIEW_RESULTS","MANAGE_USERS","MANAGE_CLASSES","PUBLISH_RESULTS","VIEW_AUDIT_LOG"],
  super_admin:["MANAGE_QUESTIONS","CREATE_EXAM","ASSIGN_EXAM","VIEW_RESULTS","MANAGE_USERS","MANAGE_CLASSES","PUBLISH_RESULTS","VIEW_AUDIT_LOG","MANAGE_SYSTEM"]
};

const enc = new TextEncoder();
const json=(status,body,headers={})=>new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store",...headers}});
const bad=(m,s=400)=>{const e=new Error(m);e.status=s;throw e;};
const id=v=>{const n=Number(v);if(!Number.isInteger(n)||n<1)bad("Invalid ID");return n;};
const text=(v,max=500)=>String(v??"").trim().slice(0,max);
const sha=s=>crypto.createHash("sha256").update(String(s)).digest("hex");
const hashPassword=p=>{const salt=crypto.randomBytes(16);const h=crypto.scryptSync(p,salt,64);return `scrypt$${salt.toString("hex")}$${h.toString("hex")}`;};
const verifyPassword=(p,h)=>{try{const [a,s,x]=h.split("$");if(a!=="scrypt")return false;const got=crypto.scryptSync(p,Buffer.from(s,"hex"),64);return crypto.timingSafeEqual(got,Buffer.from(x,"hex"));}catch{return false;}};
const cookie=(token,age)=>`rb_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${age}${process.env.COOKIE_SECURE==="1"?"; Secure":""}`;
const cookies=h=>Object.fromEntries(String(h||"").split(";").map(x=>x.trim().split("=")).filter(x=>x.length===2));
const originOK=req=>!process.env.SITE_URL||!req.headers.get("origin")||req.headers.get("origin")===process.env.SITE_URL;
const can=(u,p)=>PERMS[u?.role]?.includes(p);
const need=(u,p)=>{if(!can(u,p))bad("You do not have permission to do this.",403);};

async function bootstrap(){
  const [org]=await sql`select * from organisations order by id limit 1`;
  if(org)return org;
  const pw=process.env.ADMIN_PASSWORD;
  if(!pw||pw.length<12)throw new Error("ADMIN_PASSWORD must be configured with at least 12 characters.");
  return sql.begin(async tx=>{
    const [o]=await tx`insert into organisations(name) values(${process.env.ORG_NAME||"Redbridge International School"}) returning *`;
    const [y]=await tx`insert into academic_years(org_id,label,is_current) values(${o.id},${process.env.ACADEMIC_YEAR||"2026-27"},true) returning *`;
    await tx`insert into settings(org_id,key,value) values(${o.id},'grade_boundaries',${tx.json([["A*",90],["A",80],["B",70],["C",60],["D",50],["E",40],["U",0]])})`;
    await tx`insert into users(org_id,email,password_hash,first_name,last_name,role,status,must_change_password)
      values(${o.id},${String(process.env.ADMIN_EMAIL||"admin@redbridge.local").toLowerCase()},${hashPassword(pw)},'System','Administrator','super_admin','active',false)`;
    return o;
  });
}

async function session(req,write=false){
  const token=cookies(req.headers.get("cookie")).rb_session;
  if(!token)bad("Please sign in.",401);
  const [r]=await sql`select s.csrf,s.expires_at,u.* from sessions s join users u on u.id=s.user_id
    where s.token_hash=${sha(token)} and s.expires_at>now() and u.status='active' limit 1`;
  if(!r)bad("Please sign in.",401);
  if(write){
    if(!originOK(req))bad("Invalid request origin.",403);
    if(req.headers.get("x-csrf-token")!==r.csrf)bad("Security token expired. Refresh and try again.",403);
  }
  return {user:r,csrf:r.csrf,token};
}

async function audit(u,action,entity=null,entityId=null,detail=null,req=null){
  await sql`insert into audit_logs(org_id,user_id,user_label,action,entity,entity_id,detail,ip)
    values(${u?.org_id||null},${u?.id||null},${u?`${u.first_name} ${u.last_name} <${u.email}>`:"anonymous"},${action},${entity},${entityId==null?null:String(entityId)},${detail==null?null:sql.json(detail)},${req?.headers.get("x-nf-client-connection-ip")||null})`;
}

const pathOf=req=>new URL(req.url).pathname.replace(/^\/.netlify\/functions\/api/,"").replace(/^\/api/,"")||"/";
const match=(p,re)=>p.match(re);

async function body(req){return ["POST","PUT","PATCH"].includes(req.method)?req.json().catch(()=>({})):{};}

async function assignedStudent(examId,studentId){
  const [e]=await sql`select 1 from exam_assignments ea
    left join student_enrolments se on se.class_id=ea.class_id and se.student_id=${studentId}
    where ea.exam_id=${examId} and (ea.student_id=${studentId} or se.student_id=${studentId}) limit 1`;
  return !!e;
}

function mark(s,a){
  if(a===null||a===undefined||a==="")return {ok:null,marks:0};
  let ok=false;
  if(s.type==="mcq"||s.type==="truefalse")ok=a===s.correct;
  else if(s.type==="multi")ok=Array.isArray(a)&&JSON.stringify([...a].sort())===JSON.stringify([...(s.correct||[])].sort());
  else if(s.type==="short")ok=(s.correct||[]).map(x=>String(x).trim().toLowerCase()).includes(String(a).trim().toLowerCase());
  else if(s.type==="numeric")ok=Math.abs(Number(a)-Number(s.correct?.value))<=Number(s.correct?.tolerance||0);
  return {ok,marks:ok?Number(s.marks||1):-Math.min(Number(s.negative_marks||0),Number(s.marks||1))};
}

async function finalize(attemptId,reason){
  return sql.begin(async tx=>{
    const [a]=await tx`select * from attempts where id=${attemptId} for update`;
    if(!a||a.status!=="IN_PROGRESS")return a;
    const qs=await tx`select id,snapshot_json from exam_questions where exam_id=${a.exam_id} order by position`;
    const ars=await tx`select exam_question_id,answer_json from answers where attempt_id=${a.id}`;
    const map=new Map(ars.map(x=>[Number(x.exam_question_id),x.answer_json]));
    let score=0,total=0;
    for(const q of qs){
      const s=q.snapshot_json; total+=Number(s.marks||1);
      const m=mark(s,map.get(Number(q.id))??null); score+=m.marks;
      await tx`insert into answers(attempt_id,exam_question_id,answer_json,is_correct,marks_awarded)
        values(${a.id},${q.id},${map.has(Number(q.id))?tx.json(map.get(Number(q.id))):null},${m.ok},${m.marks})
        on conflict(attempt_id,exam_question_id) do update set is_correct=excluded.is_correct,marks_awarded=excluded.marks_awarded`;
    }
    score=Math.max(0,Math.round(score*100)/100);
    const pct=total?Math.round(score/total*10000)/100:0;
    const [e]=await tx`select pass_percent from exams where id=${a.exam_id}`;
    const [done]=await tx`update attempts set status='MARKED',submitted_at=now(),submit_reason=${reason},
      score=${score},total=${total},percentage=${pct},passed=${pct>=Number(e.pass_percent)}
      where id=${a.id} returning *`;
    return done;
  });
}

export default async function handler(req){
  try{
    const org=await bootstrap();
    const p=pathOf(req), method=req.method.toUpperCase(), b=await body(req);

    if(method==="GET"&&p==="/health")return json(200,{ok:true,service:"Redbridge Exam Platform",database:"Supabase"});
    if(method==="GET"&&p==="/config"){
      const [y]=await sql`select * from academic_years where org_id=${org.id} and is_current=true limit 1`;
      return json(200,{org:org.name,academic_year:y?.label||""});
    }
    if(method==="POST"&&p==="/login"){
      if(!originOK(req))bad("Invalid request origin.",403);
      const email=text(b.email,200).toLowerCase(),pw=String(b.password||"");
      const [u]=await sql`select * from users where email=${email} limit 1`;
      if(!u||u.status!=="active"||!verifyPassword(pw,u.password_hash)){await new Promise(r=>setTimeout(r,250));bad("Invalid email or password.",401);}
      const token=crypto.randomBytes(32).toString("base64url"),csrf=crypto.randomBytes(24).toString("base64url");
      await sql`insert into sessions(token_hash,user_id,csrf,expires_at,ip,ua)
        values(${sha(token)},${u.id},${csrf},now()+interval '8 hours',${req.headers.get("x-nf-client-connection-ip")||null},${text(req.headers.get("user-agent"),200)})`;
      await sql`update users set last_login=now() where id=${u.id}`;
      await audit(u,"LOGIN","user",u.id,null,req);
      return json(200,{user:{id:Number(u.id),email:u.email,first_name:u.first_name,last_name:u.last_name,role:u.role,permissions:PERMS[u.role]||[]},csrf},{"set-cookie":cookie(token,8*3600)});
    }
    if(method==="POST"&&p==="/logout"){
      const s=await session(req,true); await sql`delete from sessions where token_hash=${sha(s.token)}`;
      return json(200,{ok:true},{"set-cookie":cookie("",0)});
    }

    const write=!["GET","HEAD"].includes(method),s=await session(req,write),u=s.user;

    if(method==="GET"&&p==="/me")return json(200,{user:{id:Number(u.id),email:u.email,first_name:u.first_name,last_name:u.last_name,role:u.role,permissions:PERMS[u.role]||[]},csrf:s.csrf});

    if(method==="GET"&&p==="/dashboard"){
      if(u.role==="student"){
        const [avail]=await sql`select count(*)::int c from exams e where e.org_id=${u.org_id} and e.status='scheduled' and (e.start_time is null or e.start_time<=now()) and (e.end_time is null or e.end_time>=now())`;
        const [done]=await sql`select count(*)::int c from attempts where student_id=${u.id} and status='MARKED'`;
        return json(200,{available_exams:avail.c,completed:done.c});
      }
      const [q]=await sql`select count(*)::int c from questions where org_id=${u.org_id} and status='active'`;
      const [e]=await sql`select count(*)::int c from exams where org_id=${u.org_id}`;
      const [st]=await sql`select count(*)::int c from users where org_id=${u.org_id} and role='student' and status='active'`;
      return json(200,{questions:q.c,exams:e.c,students:st.c});
    }

    if(method==="GET"&&p==="/classes"){
      const rows=await sql`select c.id,c.name,c.grade from classes c join academic_years y on y.id=c.academic_year_id where c.org_id=${u.org_id} and y.is_current=true order by c.grade,c.name`;
      return json(200,rows.map(x=>({...x,id:Number(x.id)})));
    }
    if(method==="POST"&&p==="/classes"){
      need(u,"MANAGE_CLASSES"); const [y]=await sql`select id from academic_years where org_id=${u.org_id} and is_current=true limit 1`;
      const grade=Number(b.grade); if(grade<1||grade>11)bad("Grade must be 1–11.");
      const [r]=await sql`insert into classes(org_id,academic_year_id,name,grade) values(${u.org_id},${y.id},${text(b.name,80)},${grade}) returning id,name,grade`;
      await audit(u,"CREATE_CLASS","class",r.id,r,req); return json(201,{...r,id:Number(r.id)});
    }

    if(method==="GET"&&p==="/subjects"){
      const rows=await sql`select id,name from subjects where org_id=${u.org_id} order by name`;
      return json(200,rows.map(x=>({...x,id:Number(x.id)})));
    }
    if(method==="POST"&&p==="/subjects"){
      need(u,"MANAGE_CLASSES"); const name=text(b.name,120); if(!name)bad("Subject name is required.");
      const [r]=await sql`insert into subjects(org_id,name) values(${u.org_id},${name}) returning id,name`;
      await audit(u,"CREATE_SUBJECT","subject",r.id,r,req); return json(201,{...r,id:Number(r.id)});
    }

    if(method==="GET"&&p==="/users"){
      need(u,"MANAGE_USERS"); const rows=await sql`select id,email,first_name,last_name,role,status,created_at from users where org_id=${u.org_id} order by role,last_name,first_name`;
      return json(200,rows.map(x=>({...x,id:Number(x.id)})));
    }
    if(method==="POST"&&p==="/users"){
      need(u,"MANAGE_USERS");
      const role=["student","teacher","academic_admin"].includes(b.role)?b.role:null;if(!role)bad("Invalid role.");
      const pw=String(b.password||"");if(pw.length<(role==="student"?8:12))bad("Password is too short.");
      const email=text(b.email,200).toLowerCase(); if(!email.includes("@"))bad("Valid email is required.");
      const [r]=await sql`insert into users(org_id,email,password_hash,first_name,last_name,role,status,must_change_password)
        values(${u.org_id},${email},${hashPassword(pw)},${text(b.first_name,80)},${text(b.last_name,80)},${role},'active',true)
        returning id,email,first_name,last_name,role,status`;
      await audit(u,"CREATE_USER","user",r.id,{email:r.email,role:r.role},req); return json(201,{...r,id:Number(r.id)});
    }

    if(method==="GET"&&p==="/questions"){
      need(u,"MANAGE_QUESTIONS"); const rows=await sql`select q.id,q.grade,q.topic,q.difficulty,q.type,q.language,q.text,q.marks,s.name subject from questions q join subjects s on s.id=q.subject_id where q.org_id=${u.org_id} and q.status='active' order by q.id desc limit 500`;
      return json(200,rows.map(x=>({...x,id:Number(x.id),marks:Number(x.marks)})));
    }
    if(method==="POST"&&p==="/questions"){
      need(u,"MANAGE_QUESTIONS");
      const type=["mcq","truefalse","multi","short","numeric"].includes(b.type)?b.type:"mcq";
      let options=null,correct=b.correct;
      if(type==="mcq"||type==="multi")options=Array.isArray(b.options)?b.options.map((x,i)=>({id:String.fromCharCode(97+i),text:text(x,1000)})):null;
      if(type==="truefalse")options=[{id:"true",text:"True"},{id:"false",text:"False"}];
      const [r]=await sql`insert into questions(org_id,subject_id,grade,topic,subtopic,difficulty,type,language,text,options_json,correct_json,marks,negative_marks,explanation,author_id)
        values(${u.org_id},${id(b.subject_id)},${Number(b.grade)},${text(b.topic,120)},'',${["easy","medium","hard","olympiad"].includes(b.difficulty)?b.difficulty:"medium"},${type},${["en","ru","uz"].includes(b.language)?b.language:"en"},${text(b.text,4000)},${options?sql.json(options):null},${sql.json(correct)},${Number(b.marks||1)},${Number(b.negative_marks||0)},${text(b.explanation,4000)},${u.id}) returning id`;
      await audit(u,"CREATE_QUESTION","question",r.id,null,req); return json(201,{id:Number(r.id)});
    }

    if(method==="GET"&&p==="/exams"){
      const rows=await sql`select e.id,e.title,e.grade,e.exam_type,e.duration_min,e.pass_percent,e.status,e.start_time,e.end_time,e.results_published,s.name subject from exams e join subjects s on s.id=e.subject_id where e.org_id=${u.org_id} order by e.id desc`;
      return json(200,rows.map(x=>({...x,id:Number(x.id),duration_min:Number(x.duration_min),pass_percent:Number(x.pass_percent)})));
    }
    if(method==="POST"&&p==="/exams"){
      need(u,"CREATE_EXAM");
      const [e]=await sql`insert into exams(org_id,title,subject_id,grade,exam_type,language,description,instructions,duration_min,pass_percent,attempts_allowed,randomise_questions,randomise_options,allow_review_after,start_time,end_time,status,created_by)
        values(${u.org_id},${text(b.title,200)},${id(b.subject_id)},${Number(b.grade)},${text(b.exam_type,80)||"Exam"},${["en","ru","uz"].includes(b.language)?b.language:"en"},${text(b.description,2000)},${text(b.instructions,3000)},${Number(b.duration_min||45)},${Number(b.pass_percent||50)},1,true,true,true,${b.start_time||null},${b.end_time||null},'draft',${u.id}) returning id`;
      const qids=Array.isArray(b.question_ids)?b.question_ids.map(id):[];
      let pos=1; for(const qid of qids){
        const [q]=await sql`select * from questions where id=${qid} and org_id=${u.org_id}`; if(!q)continue;
        const snap={type:q.type,text:q.text,options:q.options_json,correct:q.correct_json,marks:Number(q.marks),negative_marks:Number(q.negative_marks),explanation:q.explanation,topic:q.topic,difficulty:q.difficulty,language:q.language};
        await sql`insert into exam_questions(exam_id,position,source_question_id,source_version,topic,snapshot_json) values(${e.id},${pos++},${q.id},${q.version},${q.topic},${sql.json(snap)})`;
      }
      await audit(u,"CREATE_EXAM","exam",e.id,{questions:qids.length},req); return json(201,{id:Number(e.id)});
    }

    let m=match(p,/^\/exams\/(\d+)\/schedule$/);
    if(m&&method==="POST"){
      need(u,"ASSIGN_EXAM"); const eid=id(m[1]);
      await sql`delete from exam_assignments where exam_id=${eid}`;
      for(const cid of (b.class_ids||[]))await sql`insert into exam_assignments(exam_id,class_id) values(${eid},${id(cid)})`;
      for(const sid of (b.student_ids||[]))await sql`insert into exam_assignments(exam_id,student_id) values(${eid},${id(sid)})`;
      await sql`update exams set start_time=${b.start_time||null},end_time=${b.end_time||null},status='scheduled',updated_at=now() where id=${eid} and org_id=${u.org_id}`;
      await audit(u,"SCHEDULE_EXAM","exam",eid,b,req); return json(200,{ok:true});
    }
    m=match(p,/^\/exams\/(\d+)\/publish$/);
    if(m&&method==="POST"){
      need(u,"PUBLISH_RESULTS"); const eid=id(m[1]); await sql`update exams set results_published=${!!b.published} where id=${eid} and org_id=${u.org_id}`;
      return json(200,{ok:true});
    }

    if(method==="GET"&&p==="/student/exams"){
      if(u.role!=="student")bad("Students only.",403);
      const rows=await sql`select e.id,e.title,e.grade,e.duration_min,e.start_time,e.end_time,e.status,s.name subject,
        (select a.status from attempts a where a.exam_id=e.id and a.student_id=${u.id} order by a.id desc limit 1) attempt_status
        from exams e join subjects s on s.id=e.subject_id
        where e.org_id=${u.org_id} and e.status='scheduled' order by e.start_time nulls first,e.id desc`;
      const out=[];for(const e of rows)if(await assignedStudent(e.id,u.id))out.push({...e,id:Number(e.id)});
      return json(200,out);
    }
    m=match(p,/^\/student\/exams\/(\d+)\/start$/);
    if(m&&method==="POST"){
      if(u.role!=="student")bad("Students only.",403); const eid=id(m[1]);
      if(!(await assignedStudent(eid,u.id)))bad("This exam is not assigned to you.",403);
      const [e]=await sql`select * from exams where id=${eid} and org_id=${u.org_id} and status='scheduled'`;if(!e)bad("Exam unavailable.",404);
      const now=Date.now();if(e.start_time&&now<new Date(e.start_time).getTime())bad("Exam has not opened yet.");if(e.end_time&&now>new Date(e.end_time).getTime())bad("Exam has closed.");
      const [old]=await sql`select * from attempts where exam_id=${eid} and student_id=${u.id} order by id desc limit 1`;
      if(old?.status==="IN_PROGRESS")return json(200,{attempt_id:Number(old.id)});
      if(old?.status==="MARKED")bad("You have already completed this exam.");
      const qs=await sql`select id,snapshot_json from exam_questions where exam_id=${eid} order by position`;if(!qs.length)bad("Exam has no questions.");
      const order={q:qs.map(x=>Number(x.id)),o:{}};let deadline=now+Number(e.duration_min)*60000;if(e.end_time)deadline=Math.min(deadline,new Date(e.end_time).getTime());
      const [a]=await sql`insert into attempts(exam_id,student_id,attempt_no,status,started_at,deadline_at,order_json) values(${eid},${u.id},1,'IN_PROGRESS',now(),${new Date(deadline).toISOString()},${sql.json(order)}) returning id`;
      return json(201,{attempt_id:Number(a.id)});
    }

    m=match(p,/^\/attempts\/(\d+)$/);
    if(m&&method==="GET"){
      if(u.role!=="student")bad("Students only.",403);const aid=id(m[1]);
      let [a]=await sql`select * from attempts where id=${aid} and student_id=${u.id}`;if(!a)bad("Attempt not found.",404);
      if(a.status==="IN_PROGRESS"&&new Date(a.deadline_at)<=new Date()){await finalize(aid,"timeout");[a]=await sql`select * from attempts where id=${aid}`;}
      if(a.status!=="IN_PROGRESS")return json(200,{id:aid,status:a.status});
      const [e]=await sql`select id,title,instructions,duration_min from exams where id=${a.exam_id}`;
      const qs=await sql`select id,snapshot_json from exam_questions where exam_id=${a.exam_id} order by position`;
      const ars=await sql`select exam_question_id,answer_json from answers where attempt_id=${aid}`;const amap=Object.fromEntries(ars.map(x=>[x.exam_question_id,x.answer_json]));
      return json(200,{id:aid,status:a.status,deadline_at:a.deadline_at,server_now:new Date().toISOString(),exam:e,
        questions:qs.map(q=>({id:Number(q.id),type:q.snapshot_json.type,text:q.snapshot_json.text,options:q.snapshot_json.options,marks:q.snapshot_json.marks,answer:amap[q.id]??null}))});
    }
    if(m&&method==="PUT"){
      if(u.role!=="student")bad("Students only.",403);const aid=id(m[1]),qid=id(b.question_id);
      const [a]=await sql`select * from attempts where id=${aid} and student_id=${u.id}`;if(!a||a.status!=="IN_PROGRESS")bad("Attempt is closed.",409);
      if(new Date(a.deadline_at)<=new Date()){await finalize(aid,"timeout");bad("Time is up.",409);}
      const [q]=await sql`select id from exam_questions where id=${qid} and exam_id=${a.exam_id}`;if(!q)bad("Unknown question.");
      await sql`insert into answers(attempt_id,exam_question_id,answer_json) values(${aid},${qid},${sql.json(b.answer)})
        on conflict(attempt_id,exam_question_id) do update set answer_json=excluded.answer_json,answered_at=now()`;
      return json(200,{saved:true});
    }
    m=match(p,/^\/attempts\/(\d+)\/submit$/);
    if(m&&method==="POST"){
      if(u.role!=="student")bad("Students only.",403);const aid=id(m[1]);const [a]=await sql`select id from attempts where id=${aid} and student_id=${u.id}`;if(!a)bad("Attempt not found.",404);
      await finalize(aid,"student");return json(200,{ok:true});
    }

    if(method==="GET"&&p==="/student/results"){
      if(u.role!=="student")bad("Students only.",403);
      const rows=await sql`select a.id,e.title,s.name subject,a.score,a.total,a.percentage,a.passed,a.submitted_at,e.results_published
        from attempts a join exams e on e.id=a.exam_id join subjects s on s.id=e.subject_id
        where a.student_id=${u.id} and a.status='MARKED' order by a.id desc`;
      return json(200,rows.map(x=>({...x,id:Number(x.id),score:Number(x.score),total:Number(x.total),percentage:Number(x.percentage)})));
    }

    if(method==="GET"&&p==="/audit"){
      need(u,"VIEW_AUDIT_LOG");const rows=await sql`select id,at,user_label,action,entity,entity_id,detail from audit_logs where org_id=${u.org_id} order by id desc limit 300`;
      return json(200,rows.map(x=>({...x,id:Number(x.id)})));
    }

    bad("API endpoint not found.",404);
  }catch(e){console.error(e);return json(e.status||500,{error:e.status?e.message:"Server error."});}
}

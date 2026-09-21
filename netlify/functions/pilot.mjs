import crypto from "node:crypto";
import postgres from "postgres";
const sql=postgres(process.env.SUPABASE_DB_URL||"",{prepare:false,max:1,ssl:"require"});
const json=(s,b)=>new Response(JSON.stringify(b),{status:s,headers:{"content-type":"application/json","cache-control":"no-store"}});
export default async req=>{
 try{
  if(req.method!=="POST")return json(405,{error:"Method not allowed."});
  const b=await req.json().catch(()=>({}));if(b.website)return json(200,{ok:true});
  const name=String(b.name||"").trim().slice(0,120),email=String(b.email||"").trim().toLowerCase().slice(0,200),message=String(b.message||"").trim().slice(0,4000);
  if(!name||!email.includes("@")||message.length<10)return json(400,{error:"Please complete all fields."});
  const ref="RB-"+crypto.randomBytes(4).toString("hex").toUpperCase();
  await sql`insert into pilot_requests(ref,name,email,message) values(${ref},${name},${email},${message})`;
  return json(200,{ok:true,ref});
 }catch(e){return json(500,{error:"Server error."});}
};
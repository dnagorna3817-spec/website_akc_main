"use client";
import { useState } from "react";
import Link from "next/link";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const fields = [
  ["industries.medical.heading", "Медицина — заголовок"],
  ["industries.retail.heading", "Роздрібна торгівля — заголовок"],
  ["industries.manufacturing.heading", "Виробництво — заголовок"],
  ["industries.agribusiness.heading", "Агробізнес — заголовок"],
  ["industries.services.heading", "Послуги — заголовок"],
] as const;
type Item = { key: string; value: string; draft: string | null };
export default function CmsEditor() {
 const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
 const [token,setToken]=useState(""); const [uid,setUid]=useState("");
 const [items,setItems]=useState<Item[]>([]); const [message,setMessage]=useState("");
 const [busy,setBusy]=useState(false);
 async function request(path:string,init:RequestInit={},jwt=token){
  const response=await fetch(url+"/rest/v1/"+path,{...init,headers:{"apikey":key,"Authorization":"Bearer "+(jwt||key),"Content-Type":"application/json",...(init.headers||{})},cache:"no-store"});
  if(!response.ok) throw new Error("Помилка доступу або збереження ("+response.status+")");
  const body=await response.text(); return body?JSON.parse(body):null;
 }
 async function signIn(e:React.FormEvent){e.preventDefault();setBusy(true);setMessage("");
  try {
   const response=await fetch(url+"/auth/v1/token?grant_type=password",{method:"POST",headers:{"apikey":key,"Content-Type":"application/json"},body:JSON.stringify({email,password})});
   if(!response.ok) throw new Error("Невірні дані входу");
   const session=await response.json();
   const membership=await request("cms_admins?select=user_id&user_id=eq."+encodeURIComponent(session.user.id),{},session.access_token);
   if(!membership?.length) throw new Error("Цей акаунт не має прав адміністратора");
   const data=await request("cms_content?select=key,value,draft&order=key",{},session.access_token);
   setUid(session.user.id);setToken(session.access_token);setItems(data||[]);setPassword("");
  }catch(err){setMessage(err instanceof Error?err.message:"Помилка входу");}finally{setBusy(false);}
 }
 function draftFor(k:string){return items.find(x=>x.key===k)?.draft??items.find(x=>x.key===k)?.value??"";}
 function change(k:string,v:string){setItems(old=>old.some(x=>x.key===k)?old.map(x=>x.key===k?{...x,draft:v}:x):[...old,{key:k,value:"",draft:v}]);}
 async function save(k:string,publish:boolean){setBusy(true);setMessage("");
  try {
   const existing=items.find(x=>x.key===k);const draft=draftFor(k);
   const payload={key:k,value:publish?draft:(existing?.value||""),draft:publish?null:draft,updated_by:uid};
   await request("cms_content?on_conflict=key",{method:"POST",headers:{"Prefer":"resolution=merge-duplicates,return=minimal"},body:JSON.stringify(payload)});
   setItems(old=>old.map(x=>x.key===k?{...x,...payload}:x));
   setMessage(publish?"Опубліковано.":"Чернетку збережено.");
  }catch(err){setMessage(err instanceof Error?err.message:"Не вдалося зберегти");}finally{setBusy(false);}
 }
 const style:React.CSSProperties={background:"#0d2235",border:"1px solid #31506a",borderRadius:12,padding:14,color:"#f1f8ff"};
 return <main style={{minHeight:"100vh",background:"#020c15",color:"#edf7ff",padding:"110px max(20px,6vw) 50px",fontFamily:"Arial,sans-serif"}}>
 <div style={{maxWidth:820,margin:"auto"}}>
 <Link href="/" style={{color:"#80caff"}}>← На сайт</Link><h1 style={{fontSize:32,margin:"24px 0 8px"}}>AKC Control</h1><p style={{color:"#a9bfd0",marginBottom:30}}>Редагування контенту без зміни дизайну</p>
 {!url||!key?<p role="alert">CMS ще не підключена. Налаштуйте NEXT_PUBLIC_SUPABASE_URL та NEXT_PUBLIC_SUPABASE_ANON_KEY.</p>:!token?
 <form onSubmit={signIn} style={{display:"grid",gap:14,maxWidth:420}}>
 <label>Email адміністратора<input type="email" required autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} style={{...style,width:"100%",display:"block",marginTop:8}}/></label>
 <label>Пароль<input type="password" required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} style={{...style,width:"100%",display:"block",marginTop:8}}/></label>
 <button disabled={busy} style={{...style,cursor:"pointer",background:"#a6dfff",color:"#041421",fontWeight:700}}>Увійти</button></form>:
 <><button onClick={()=>{setToken("");setUid("");setItems([]);}} style={{...style,cursor:"pointer",marginBottom:22}}>Вийти</button>
 {fields.map(([k,label])=><section key={k} style={{...style,marginBottom:16}}>
 <label htmlFor={k} style={{display:"block",fontWeight:700,marginBottom:10}}>{label}</label>
 <textarea id={k} value={draftFor(k)} onChange={e=>change(k,e.target.value)} rows={3} style={{...style,width:"100%",resize:"vertical"}}/>
 <div style={{display:"flex",gap:10,marginTop:12,flexWrap:"wrap"}}>
 <button disabled={busy} onClick={()=>save(k,false)} style={{...style,cursor:"pointer"}}>Зберегти чернетку</button>
 <button disabled={busy} onClick={()=>save(k,true)} style={{...style,cursor:"pointer",background:"#a6dfff",color:"#041421",fontWeight:700}}>Опублікувати</button>
 </div></section>)}</>}
 {message&&<p role="status" style={{color:"#a6dfff"}}>{message}</p>}
 </div></main>;
}

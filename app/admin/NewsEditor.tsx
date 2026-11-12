"use client";
import {useEffect,useState} from "react";
const url=process.env.NEXT_PUBLIC_SUPABASE_URL||"";const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||"";
type News={id?:string;slug:string;title:string;summary:string;body:string;category:string;image_url:string|null;status:string};
const blank:News={slug:"",title:"",summary:"",body:"",category:"Новини",image_url:null,status:"draft"};
export default function NewsEditor({token,uid}:{token:string;uid:string}){
 const [list,setList]=useState<News[]>([]);const [current,setCurrent]=useState<News|null>(null);const [error,setError]=useState("");const [busy,setBusy]=useState(false);
 async function request(path:string,init:RequestInit={}){const res=await fetch(url+"/rest/v1/"+path,{...init,headers:{"apikey":key,"Authorization":"Bearer "+token,"Content-Type":"application/json",...(init.headers||{})},cache:"no-store"});if(!res.ok)throw new Error("Помилка Supabase: "+res.status+" — перевірте cms_news.sql");const txt=await res.text();return txt?JSON.parse(txt):[];}
 async function load(){try{setList(await request("cms_news?select=*&order=created_at.desc"));}catch(e){setError(String(e));}}
 useEffect(()=>{void load()},[token]);
 async function save(status:string){if(!current?.title.trim()||!current.slug.match(/^[a-z0-9-]+$/)){setError("Вкажіть заголовок і slug латинськими літерами, цифрами або дефісами.");return;}setBusy(true);setError("");try{const payload={...current,status,updated_by:uid,published_at:status==="published"?new Date().toISOString():null};delete payload.id;await request(current.id?"cms_news?id=eq."+current.id:"cms_news",{method:current.id?"PATCH":"POST",headers:{"Prefer":"return=minimal"},body:JSON.stringify(payload)});setCurrent(null);await load();}catch(e){setError(String(e));}finally{setBusy(false);}}
 return <div style={{display:"grid",gap:16}}><button onClick={()=>{setCurrent({...blank});setError("")}} style={{width:"fit-content",background:"#a6dfff",color:"#041421",padding:"12px 18px",borderRadius:9,fontWeight:700}}>＋ Додати новину</button>
 {current?<section style={{display:"grid",gap:12,background:"#10263a",padding:20,borderRadius:12}}>
 <h2>{current.id?"Редагувати новину":"Нова публікація"}</h2>
 {([["title","Заголовок"],["slug","Адреса (slug латиницею)"],["summary","Короткий опис"],["image_url","Посилання на обкладинку (https://)"]] as const).map(([field,label])=><label key={field}>{label}<input value={current[field]||""} onChange={e=>setCurrent({...current,[field]:e.target.value})} style={{display:"block",width:"100%",padding:12,background:"#051626",color:"white",border:"1px solid #547c98",borderRadius:8}}/></label>)}
 <label>Категорія<select value={current.category} onChange={e=>setCurrent({...current,category:e.target.value})}>{["Новини","Статті","План заходів"].map(x=><option key={x}>{x}</option>)}</select></label>
 <label>Текст статті<textarea rows={9} value={current.body} onChange={e=>setCurrent({...current,body:e.target.value})} style={{display:"block",width:"100%",padding:12,background:"#051626",color:"white",border:"1px solid #547c98",borderRadius:8}}/></label>
 <div style={{display:"flex",gap:12,flexWrap:"wrap"}}><button disabled={busy} onClick={()=>save("draft")}>Зберегти чернетку</button><button disabled={busy} onClick={()=>save("published")}>Опублікувати</button><button onClick={()=>setCurrent(null)}>Скасувати</button></div></section>:null}
 {error&&<p role="alert" style={{color:"#ffb5b5"}}>{error}</p>}
 {list.map(n=><button key={n.id} onClick={()=>setCurrent(n)} style={{textAlign:"left",background:"#10263a",border:"1px solid #34536b",padding:15,borderRadius:10,color:"white"}}>{n.title} · {n.status==="published"?"Опубліковано":"Чернетка"}</button>)}
 </div>;
}

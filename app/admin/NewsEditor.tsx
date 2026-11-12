"use client";
import {useEffect,useState} from "react";
const url=process.env.NEXT_PUBLIC_SUPABASE_URL||"";
const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||"";
type News={id?:string;slug:string;title:string;summary:string;body:string;category:string;image_url:string|null;status:string;published_at?:string|null};
const blank:News={slug:"",title:"",summary:"",body:"",category:"Новини",image_url:null,status:"draft"};
const translit:Record<string,string>={а:"a",б:"b",в:"v",г:"h",ґ:"g",д:"d",е:"e",є:"ye",ж:"zh",з:"z",и:"y",і:"i",ї:"yi",й:"i",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"kh",ц:"ts",ч:"ch",ш:"sh",щ:"shch",ь:"",ю:"yu",я:"ya",ы:"y",э:"e",ё:"yo",ъ:""};
function makeSlug(s:string){return Array.from(s.toLowerCase().trim()).map(ch=>translit[ch]??ch).join("").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,90);}
const inputStyle={width:"100%",padding:"14px 16px",border:"1px solid #416580",borderRadius:12,background:"#061a2a",color:"#f2f8ff",fontSize:16,marginTop:8} as const;
const primary={padding:"13px 22px",borderRadius:11,border:"1px solid #9bd7fb",background:"#a6dfff",color:"#041421",fontWeight:700,cursor:"pointer"} as const;
const secondary={...primary,background:"#112a40",color:"#d9efff",border:"1px solid #416580"} as const;
export default function NewsEditor({token,uid}:{token:string;uid:string}){
 const [list,setList]=useState<News[]>([]);
 const [current,setCurrent]=useState<News|null>(null);
 const [error,setError]=useState("");
 const [busy,setBusy]=useState(false);
 const [advanced,setAdvanced]=useState(false);
 async function request(path:string,init:RequestInit={}){
  const res=await fetch(url+"/rest/v1/"+path,{...init,headers:{apikey:key,Authorization:"Bearer "+token,"Content-Type":"application/json",...(init.headers||{})},cache:"no-store"});
  if(!res.ok)throw new Error("Помилка Supabase: "+res.status+" — перевірте налаштування cms_news.");
  const txt=await res.text();return txt?JSON.parse(txt):[];
 }
 async function load(){try{setList(await request("cms_news?select=*&order=created_at.desc"));}catch(e){setError(String(e));}}
 useEffect(()=>{void load()},[token]);
 async function save(status:"draft"|"published"){
  if(!current)return;
  if(!current.title.trim()||!current.body.trim()){setError("Заповніть заголовок і текст новини.");return;}
  const slug=current.slug||makeSlug(current.title);
  if(!slug){setError("Не вдалося сформувати адресу. Введіть інший заголовок.");return;}
  if(current.image_url&&!/^https:\/\//i.test(current.image_url)){setError("Посилання на фото має починатися з https://");return;}
  setBusy(true);setError("");
  try{
   const {id,published_at,...fields}=current;
   const payload={...fields,slug,status,updated_by:uid,published_at:status==="published"?(published_at||new Date().toISOString()):null};
   await request(id?"cms_news?id=eq."+encodeURIComponent(id):"cms_news",{method:id?"PATCH":"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify(payload)});
   setCurrent(null);await load();
  }catch(e){setError(String(e));}finally{setBusy(false);}
 }
 function open(item:News){setCurrent({...item});setError("");setAdvanced(false);}
 return <div style={{display:"grid",gap:20,maxWidth:980}}>
  {!current?<><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,flexWrap:"wrap"}}>
   <div><h2 style={{fontSize:26,margin:0}}>Новини</h2><p style={{color:"#a5bed0",marginTop:6}}>Створюйте та публікуйте новини без технічних налаштувань.</p></div>
   <button style={primary} onClick={()=>open({...blank})}>＋ Додати новину</button>
  </div>
  {list.length===0&&<p style={{color:"#a5bed0"}}>Новин поки немає. Натисніть «Додати новину».</p>}
  {list.map(n=><button key={n.id} onClick={()=>open(n)} style={{...secondary,textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,width:"100%"}}><span>{n.title}</span><span style={{fontSize:13,opacity:.75}}>{n.status==="published"?"Опубліковано":"Чернетка"}</span></button>)}
  </>:<section style={{display:"grid",gap:22,padding:"clamp(18px,3vw,32px)",border:"1px solid #34536b",background:"#10263a",borderRadius:18}}>
   <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
    <div><h2 style={{margin:0,fontSize:26}}>{current.id?"Редагувати новину":"Нова новина"}</h2><p style={{color:"#a5bed0",marginTop:6}}>Заповніть текст і натисніть «Опублікувати».</p></div>
    <button style={secondary} onClick={()=>setCurrent(null)}>Закрити</button>
   </div>
   <label style={{fontWeight:600}}>Заголовок<input autoFocus placeholder="Наприклад: Нові можливості для бізнесу" value={current.title} onChange={e=>setCurrent({...current,title:e.target.value})} style={inputStyle}/></label>
   <label style={{fontWeight:600}}>Короткий опис <span style={{fontWeight:400,color:"#a5bed0"}}>(необов’язково)</span><textarea placeholder="Коротко про що ця новина..." rows={2} value={current.summary} onChange={e=>setCurrent({...current,summary:e.target.value})} style={{...inputStyle,resize:"vertical"}}/></label>
   <label style={{fontWeight:600}}>Текст новини<textarea placeholder="Напишіть новину тут..." rows={12} value={current.body} onChange={e=>setCurrent({...current,body:e.target.value})} style={{...inputStyle,resize:"vertical",lineHeight:1.7}}/></label>
   <details open={advanced} onToggle={e=>setAdvanced(e.currentTarget.open)} style={{borderTop:"1px solid #34536b",paddingTop:16}}>
    <summary style={{cursor:"pointer",color:"#a6dfff"}}>Фото та додаткові налаштування</summary>
    <div style={{display:"grid",gap:16,marginTop:16}}>
     <label>Посилання на фото<input placeholder="https://..." value={current.image_url||""} onChange={e=>setCurrent({...current,image_url:e.target.value||null})} style={inputStyle}/></label>
     {current.image_url&&/^https:\/\//i.test(current.image_url)&&<img src={current.image_url} alt="Попередній перегляд обкладинки" style={{maxWidth:320,width:"100%",borderRadius:10}}/>}
     <label>Категорія<select value={current.category} onChange={e=>setCurrent({...current,category:e.target.value})} style={inputStyle}>{["Новини","Статті","План заходів"].map(x=><option key={x}>{x}</option>)}</select></label>
     <p style={{color:"#a5bed0",fontSize:13}}>Адреса статті створюється автоматично із заголовка.</p>
    </div>
   </details>
   {error&&<p role="alert" style={{color:"#ffb5b5"}}>{error}</p>}
   <div style={{display:"flex",gap:12,flexWrap:"wrap",borderTop:"1px solid #34536b",paddingTop:20}}>
    <button disabled={busy} style={secondary} onClick={()=>save("draft")}>Зберегти чернетку</button>
    <button disabled={busy} style={primary} onClick={()=>save("published")}>{busy?"Збереження...":"Опублікувати"}</button>
   </div>
  </section>}
  {!current&&error&&<p role="alert" style={{color:"#ffb5b5"}}>{error}</p>}
 </div>;
}

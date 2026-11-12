"use client";
import {useEffect,useState} from "react";
const url=process.env.NEXT_PUBLIC_SUPABASE_URL||"";
const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||"";
type News={id?:string;slug:string;title:string;summary:string;body:string;category:string;image_url:string|null;banner_image_url?:string|null;status:string;published_at?:string|null};
const blank:News={slug:"",title:"",summary:"",body:"",category:"Новини",image_url:null,banner_image_url:null,status:"draft"};
const translit:Record<string,string>={а:"a",б:"b",в:"v",г:"h",ґ:"g",д:"d",е:"e",є:"ye",ж:"zh",з:"z",и:"y",і:"i",ї:"yi",й:"i",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"kh",ц:"ts",ч:"ch",ш:"sh",щ:"shch",ь:"",ю:"yu",я:"ya",ы:"y",э:"e",ё:"yo",ъ:""};
function makeSlug(s:string){return Array.from(s.toLowerCase().trim()).map(ch=>translit[ch]??ch).join("").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,90);}
const inputStyle={width:"100%",padding:"14px 16px",border:"1px solid #416580",borderRadius:12,background:"#061a2a",color:"#f2f8ff",fontSize:16,marginTop:8} as const;
const primary={padding:"13px 22px",borderRadius:11,border:"1px solid #9bd7fb",background:"#a6dfff",color:"#041421",fontWeight:700,cursor:"pointer"} as const;
const secondary={...primary,background:"#112a40",color:"#d9efff",border:"1px solid #416580"} as const;
export default function NewsEditor({token,uid,getAccessToken,refreshAccessToken}:{token:string;uid:string;getAccessToken:()=>Promise<string>;refreshAccessToken:()=>Promise<string>}){
 const [list,setList]=useState<News[]>([]);
 const [current,setCurrent]=useState<News|null>(null);
 const [error,setError]=useState("");
 const [busy,setBusy]=useState(false);
 const [confirmDelete,setConfirmDelete]=useState(false);
 const [photos,setPhotos]=useState<{vertical:File|null;horizontal:File|null}>({vertical:null,horizontal:null});
 const [previews,setPreviews]=useState<{vertical:string|null;horizontal:string|null}>({vertical:null,horizontal:null});
 async function request(path:string,init:RequestInit={}){
  const credential=await getAccessToken();
  let res=await fetch(url+"/rest/v1/"+path,{...init,headers:{apikey:key,Authorization:"Bearer "+credential,"Content-Type":"application/json",...(init.headers||{})},cache:"no-store"});
  if(res.status===401){
   const renewed=await refreshAccessToken();
   res=await fetch(url+"/rest/v1/"+path,{...init,headers:{apikey:key,Authorization:"Bearer "+renewed,"Content-Type":"application/json",...(init.headers||{})},cache:"no-store"});
  }
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

  setBusy(true);setError("");
  try{
   const uploadPhoto=async(file:File|null,existing:string|null|undefined)=>{
    if(!file)return existing||null;
    const ext=file.type==="image/png"?"png":file.type==="image/webp"?"webp":"jpg";
    const filename=crypto.randomUUID()+"."+ext;
    const credential=await getAccessToken();
    let upload=await fetch(url+"/storage/v1/object/cms-news/"+filename,{method:"POST",headers:{apikey:key,Authorization:"Bearer "+credential,"Content-Type":file.type,"x-upsert":"false"},body:file});
    if(upload.status===401){
     const renewed=await refreshAccessToken();
     upload=await fetch(url+"/storage/v1/object/cms-news/"+filename,{method:"POST",headers:{apikey:key,Authorization:"Bearer "+renewed,"Content-Type":file.type,"x-upsert":"false"},body:file});
    }
    if(!upload.ok)throw new Error("Не вдалося завантажити фото ("+upload.status+"). Перевірте Storage cms-news.");
    return url+"/storage/v1/object/public/cms-news/"+filename;
   };
   const image_url=await uploadPhoto(photos.vertical,current.image_url);
   const banner_image_url=await uploadPhoto(photos.horizontal,current.banner_image_url);
   const {id,published_at,...fields}=current;
   const payload={...fields,image_url,banner_image_url,slug,status,updated_by:uid,published_at:status==="published"?(published_at||new Date().toISOString()):null};
   await request(id?"cms_news?id=eq."+encodeURIComponent(id):"cms_news",{method:id?"PATCH":"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify(payload)});
   setCurrent(null);await load();
  }catch(e){setError(String(e));}finally{setBusy(false);}
 }
 async function deleteNews(){
  if(!current?.id)return;
  setBusy(true);setError("");
  try{await request("cms_news?id=eq."+encodeURIComponent(current.id),{method:"DELETE"});setCurrent(null);setConfirmDelete(false);setPhotos({vertical:null,horizontal:null});setPreviews({vertical:null,horizontal:null});await load();}
  catch(e){setError(String(e));}finally{setBusy(false);}
 }
 function removePhoto(kind:"vertical"|"horizontal"){
  if(previews[kind])URL.revokeObjectURL(previews[kind]!);
  setPhotos(old=>({...old,[kind]:null}));setPreviews(old=>({...old,[kind]:null}));
  if(current)setCurrent({...current,[kind==="vertical"?"image_url":"banner_image_url"]:null});
 }
 function open(item:News){setCurrent({...item});setError("");setPhotos({vertical:null,horizontal:null});setPreviews({vertical:null,horizontal:null});setConfirmDelete(false);}
 function selectPhoto(kind:"vertical"|"horizontal",file?:File){
  if(!file)return;
  if(!["image/jpeg","image/png","image/webp"].includes(file.type)){setError("Дозволено JPG, PNG або WebP.");return;}
  if(file.size>5*1024*1024){setError("Максимальний розмір фото — 5 МБ.");return;}
  if(previews[kind])URL.revokeObjectURL(previews[kind]!);
  setPhotos(old=>({...old,[kind]:file}));setPreviews(old=>({...old,[kind]:URL.createObjectURL(file)}));setError("");
 }
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
   <div style={{display:"grid",gap:12}}>
    <label style={{fontWeight:600}}>Тип публікації</label>
    <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{["Новини","Статті","План заходів"].map(x=><button type="button" key={x} aria-pressed={current.category===x} onClick={()=>setCurrent({...current,category:x})} style={current.category===x?primary:secondary}>{x==="Новини"?"Новина":x==="Статті"?"Стаття":"План заходу"}</button>)}</div>
   </div>
   {(["horizontal","vertical"] as const).map(kind=>{
    const isWide=kind==="horizontal";const value=previews[kind]||(isWide?current.banner_image_url:current.image_url);
    return <div key={kind} style={{display:"grid",gap:12,padding:18,border:"1px solid #34536b",borderRadius:14}}>
     <strong>{isWide?"Горизонтальне фото — банер і список новин":"Вертикальне фото — сторінка новини"}</strong>
     <span style={{color:"#a5bed0",fontSize:13}}>{isWide?"Рекомендовано 1600 × 900 px (16:9)":"Рекомендовано 900 × 1200 px (3:4)"} · JPG, PNG, WebP · до 5 МБ</span>
     <label style={{...secondary,width:"fit-content",display:"inline-block",cursor:"pointer"}}>＋ {value?"Замінити фото":"Завантажити фото"}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>{selectPhoto(kind,e.target.files?.[0]);e.target.value="";}} style={{position:"absolute",width:1,height:1,opacity:0}}/></label>
     {value&&<div style={{display:"grid",gap:12,justifyItems:"start"}}><img src={value} alt={isWide?"Горизонтальна обкладинка":"Вертикальна обкладинка"} style={{width:"100%",maxWidth:isWide?520:280,aspectRatio:isWide?"16 / 9":"3 / 4",objectFit:"cover",borderRadius:12}}/><button type="button" disabled={busy} style={secondary} onClick={()=>removePhoto(kind)}>Видалити фото</button></div>}
    </div>;
   })}
   {error&&<p role="alert" style={{color:"#ffb5b5"}}>{error}</p>}
   <div style={{display:"flex",gap:12,flexWrap:"wrap",borderTop:"1px solid #34536b",paddingTop:20}}>
    <button disabled={busy} style={secondary} onClick={()=>save("draft")}>Зберегти чернетку</button>
    <button disabled={busy} style={primary} onClick={()=>save("published")}>{busy?"Збереження...":"Опублікувати"}</button>
    {current.id&&<button type="button" disabled={busy} onClick={()=>setConfirmDelete(true)} style={{...secondary,borderColor:"#b85c69",color:"#ffc5cb",marginLeft:"auto"}}>Видалити новину</button>}
   </div>
   {confirmDelete&&<div role="alertdialog" aria-modal="true" aria-labelledby="delete-news-title" style={{padding:20,border:"1px solid #b85c69",borderRadius:14,background:"#271b29",display:"grid",gap:14}}><strong id="delete-news-title">Видалити цю новину назавжди?</strong><p style={{margin:0}}>«{current.title}» зникне із сайту. Цю дію неможливо скасувати.</p><div style={{display:"flex",gap:12,flexWrap:"wrap"}}><button type="button" disabled={busy} style={secondary} onClick={()=>setConfirmDelete(false)}>Скасувати</button><button type="button" disabled={busy} onClick={deleteNews} style={{...primary,background:"#ffb9bf",borderColor:"#ffb9bf"}}>{busy?"Видалення...":"Так, видалити назавжди"}</button></div></div>}
  </section>}
  {!current&&error&&<p role="alert" style={{color:"#ffb5b5"}}>{error}</p>}
 </div>;
}

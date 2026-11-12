"use client";
import { useEffect, useRef, useState } from "react";
const pages = [
 ["Медицина","/industries/medical"],["Роздрібна торгівля","/industries/retail"],["Виробництво","/industries/manufacturing"],["Агробізнес","/industries/agribusiness"],["Послуги","/industries/services"]
] as const;
type Item={key:string;value:string;draft:string|null};
export default function VisualEditor({items,save}:{items:Item[];save:(key:string,value:string,publish:boolean)=>Promise<void>}){
 const [path,setPath]=useState<string>(pages[0][1]);const [selected,setSelected]=useState<{key:string;text:string}|null>(null);
 const [value,setValue]=useState("");const [busy,setBusy]=useState(false);const frame=useRef<HTMLIFrameElement>(null);
 useEffect(()=>{
  const iframe=frame.current;if(!iframe)return;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const attach=()=>{
   const doc=iframe.contentDocument;if(!doc)return;
   // Defer DOM decoration until the embedded Next.js app has hydrated.
   const root=doc.querySelector("main")||doc.body;
   const excluded="nav,header,footer,button,a,input,textarea,select,option,script,style,[contenteditable],[data-cms-ignore],[role=button]";
   const nodes=Array.from(root.querySelectorAll<HTMLElement>("h1,h2,h3,h4,h5,h6,p,li,span,small,strong,em,blockquote,label,figcaption,td,th")).filter(el=>!el.closest(excluded)&&!el.querySelector("h1,h2,h3,h4,h5,h6,p,li,span,small,strong,em,blockquote,label,figcaption,td,th")&&!!el.textContent?.trim());
   nodes.forEach(node=>{
    if(!node.dataset.cmsKey){
     const parts:string[]=[];let n:Element|null=node;
     while(n&&n!==root){const parent:Element|null=n.parentElement;const index=parent?Array.from(parent.children).indexOf(n):0;parts.unshift(n.tagName.toLowerCase()+index);n=parent;}
     node.dataset.cmsKey="page."+path.split("/").filter(Boolean).join(".")+"."+parts.join(".");
    }
    if(node.dataset.cmsEditorAttached==="1")return;
    node.dataset.cmsEditorAttached="1";
    node.style.cursor="text";node.style.outlineOffset="5px";node.title="Двічі натисніть, щоб редагувати";
    node.addEventListener("mouseenter",()=>node.style.outline="2px dashed #71c8ff");
    node.addEventListener("mouseleave",()=>node.style.outline="");
    node.addEventListener("dblclick",event=>{
     event.preventDefault();event.stopPropagation();
     const key=node.dataset.cmsKey||"";const item=items.find(i=>i.key===key);
     setSelected({key,text:node.textContent||""});setValue(item?.draft??item?.value??node.textContent??"");
     node.contentEditable="true";node.focus();
     const selection=doc.getSelection();const range=doc.createRange();range.selectNodeContents(node);range.collapse(false);selection?.removeAllRanges();selection?.addRange(range);
     node.addEventListener("input",()=>setValue(node.innerText),{passive:true});
     node.addEventListener("keydown",e=>{if(e.key==="Escape"){e.preventDefault();node.textContent=item?.value??"";node.contentEditable="false";setSelected(null);}},true);
    },true);
   });
  };
  const schedule=()=>{if(timer)clearTimeout(timer);timer=setTimeout(attach,1800);};
  iframe.addEventListener("load",schedule);schedule();
  return()=>{iframe.removeEventListener("load",schedule);if(timer)clearTimeout(timer);};
 },[path,items]);
 async function submit(publish:boolean){if(!selected)return;setBusy(true);try{await save(selected.key,value,publish);if(publish)frame.current?.contentWindow?.location.reload();setSelected(null);}finally{setBusy(false);}}
 return <div style={{display:"grid",gap:14}}>
 <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}><label htmlFor="cms-page">Сторінка:</label><select id="cms-page" value={path} onChange={e=>{setPath(e.target.value);setSelected(null)}} style={{padding:12,borderRadius:8,background:"#10263a",color:"white",border:"1px solid #3b617a"}}>{pages.map(([name,url])=><option value={url} key={url}>{name}</option>)}</select><span style={{color:"#91b8d0",fontSize:13}}>Двічі натисніть на підсвічений текст, щоб редагувати прямо на сторінці</span></div>
 <iframe ref={frame} title="Попередній перегляд сайту АКЦ" src={path} style={{width:"100%",height:"min(72vh,850px)",background:"#020c15",border:"1px solid #42637b",borderRadius:12}}/>
 {selected&&<section style={{padding:18,border:"1px solid #477394",borderRadius:12,background:"#10263a"}}><strong>Редагування прямо на сторінці</strong><p style={{fontSize:12,color:"#9db9cb"}}>{selected.key}</p><textarea aria-label="Новий текст" value={value} onChange={e=>setValue(e.target.value)} rows={4} style={{width:"100%",padding:12,background:"#051626",color:"white",border:"1px solid #547c98",borderRadius:8}}/><div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:12}}><button disabled={busy} onClick={()=>submit(false)}>Зберегти чернетку</button><button disabled={busy} onClick={()=>submit(true)}>Опублікувати</button><button onClick={()=>setSelected(null)}>Скасувати</button></div></section>}
 </div>;
}

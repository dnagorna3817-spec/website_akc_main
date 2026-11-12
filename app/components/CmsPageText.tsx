"use client";
import {useEffect} from "react";
import {usePathname} from "next/navigation";
const api=process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
/** Stable path-based keys for editable leaf text. Do not edit navigation or interactive controls. */
export function cmsTextNodes(doc:Document,path:string){
 const root=doc.querySelector("main")||doc.body;
 const excluded="nav,header,footer,button,a,input,textarea,select,option,script,style,[contenteditable],[data-cms-ignore],[role=button]";
 const nodes=Array.from(root.querySelectorAll<HTMLElement>("h1,h2,h3,h4,h5,h6,p,li,span,small,strong,em,blockquote,label,figcaption,td,th"));
 return nodes.filter(el=>!el.closest(excluded)&&!el.querySelector("h1,h2,h3,h4,h5,h6,p,li,span,small,strong,em,blockquote,label,figcaption,td,th")&&!!el.textContent?.trim()).map(el=>{
  let key=el.dataset.cmsKey;
  if(!key){const parts:string[]=[];let n:Element|null=el;while(n&&n!==root){const parent:Element|null=n.parentElement;const index=parent?Array.from(parent.children).indexOf(n):0;parts.unshift(n.tagName.toLowerCase()+index);n=parent;}key="page."+path.replace(/^\/+|\/+$/g,"").replaceAll("/",".")+"."+parts.join(".");}
  return {el,key};
 });
}
export default function CmsPageText(){
 const pathname=usePathname();
 useEffect(()=>{
  if(!api||!anon||pathname.startsWith("/admin"))return;
  let cancelled=false;let timer:ReturnType<typeof setTimeout>;
  async function update(){
   const nodes=cmsTextNodes(document,pathname);
   const keys=nodes.map(n=>n.key);
   if(!keys.length)return;
   try{
    const response=await fetch(api+"/rest/v1/cms_published?select=key,value&key=in.("+keys.map(k=>'"'+k+'"').join(",")+")",{headers:{apikey:anon,Authorization:"Bearer "+anon}});
    if(!response.ok)return;
    const rows=await response.json() as {key:string;value:string}[];
    if(cancelled)return;
    const map=new Map(rows.map(x=>[x.key,x.value]));
    nodes.forEach(({el,key})=>{const value=map.get(key);if(value!==undefined&&el.textContent!==value)el.textContent=value;});
   }catch{}
  }
  // Wait until React hydration and page transitions settle before DOM enhancement.
  timer=setTimeout(()=>{void update()},2200);
  return()=>{cancelled=true;clearTimeout(timer)};
 },[pathname]);
 return null;
}

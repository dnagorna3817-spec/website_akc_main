"use client";
import {useState} from "react";
import EventRegistration from "../EventRegistration";
export default function RegistrationAction({title}:{title:string}){
 const [open,setOpen]=useState(false);
 return <><button type="button" onClick={()=>setOpen(true)} style={{marginTop:24,padding:"14px 28px",border:"1px solid #5da8d6",borderRadius:999,background:"#0b3047",color:"#e5f6ff",fontSize:16,fontWeight:600,cursor:"pointer"}}>Зареєструватися ↗</button>{open&&<EventRegistration title={title} onClose={()=>setOpen(false)}/>}</>;
}

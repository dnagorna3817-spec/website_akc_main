"use client";
import { useMemo, useState } from "react";
import { ExpertiseHeader, expertiseFont } from "../ExpertiseView";
import styles from "./calculator.module.css";
type Band = { no: number; yes: number };
type PriceGroup = { ops: boolean; bands: Record<string,Band> };
const books: Record<string,PriceGroup> = {
"ТОВ, єдиний податок без ПДВ": {ops:true,bands:{"10–20":{no:3000,yes:5000},"20–50":{no:4000,yes:7000},"50–100":{no:5000,yes:8000}}},
"СТОВ / ФГ, єдиний податок з ПДВ":{ops:true,bands:{"10–20":{no:5000,yes:8000},"20–50":{no:10000,yes:13000},"50–100":{no:17000,yes:20000},"100–200":{no:27000,yes:30000},"200–300":{no:40000,yes:53000},"400+":{no:55000,yes:70000}}},
"ТОВ, загальна система з ПДВ":{ops:true,bands:{"10–20":{no:5000,yes:8000},"20–50":{no:10000,yes:13000},"50–100":{no:17000,yes:20000},"100–200":{no:27000,yes:30000},"200–300":{no:40000,yes:53000},"400+":{no:55000,yes:70000}}},
"ФОП 1 група":{ops:false,bands:{"Без сплати податків":{no:500,yes:500},"Зі сплатою податків":{no:700,yes:700}}},
"ФОП 2 група":{ops:false,bands:{"Облік":{no:2000,yes:2000}}},
"ФОП 3 група без ПДВ":{ops:false,bands:{"Облік":{no:2000,yes:3500}}},
"ФОП 3 група, загальна система з ПДВ":{ops:true,bands:{"10–20":{no:5000,yes:7000},"20–50":{no:7000,yes:10000},"50–100":{no:10000,yes:14000}}}
};
const staff:Record<string,Record<string,[number,number]>>={
all:{"1":[1500,1000],"2-5":[3000,2500],"5-10":[6000,5000],"10-20":[12000,10000],"20-40":[20000,16000]},
zp:{"1":[1000,600],"2-5":[2500,2000],"5-10":[4000,3500],"10-20":[8000,7000],"20-40":[13500,11000]},
ko:{"1":[500,400],"2-5":[1200,1000],"5-10":[2000,1600],"10-20":[4000,3500],"20-40":[6600,5300]}
};
const military:Record<string,[number,number]>={"1":[500,800],"2-5":[3000,2000],"5-10":[5000,4000],"10-20":[10000,8000],"20-40":[18000,15000]};
const money=(v:number)=>new Intl.NumberFormat("uk-UA").format(v)+" грн";


type PickerOption={value:string;label:string};
function Picker({label,value,options,onChange}:{label:string;value:string;options:PickerOption[];onChange:(v:string)=>void}){
 const [open,setOpen]=useState(false);
 const selected=options.find(o=>o.value===value)?.label??value;
 return <div className={styles.picker}><span className={styles.pickerLabel}>{label}</span><div className={styles.pickerShell}>
  <button type="button" className={styles.pickerTrigger} aria-expanded={open} onClick={()=>setOpen(!open)}><span>{selected}</span><span className={styles.pickerChevron} aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span></button>
  {open&&<div className={styles.pickerMenu} role="group" aria-label={label}>{options.map(option=><button type="button" key={option.value} className={option.value===value?styles.pickerSelected:styles.pickerOption} aria-pressed={option.value===value} onClick={()=>{onChange(option.value);setOpen(false);}}><span>{option.label}</span><span className={styles.pickerCheck} aria-hidden="true">{option.value===value?"✓":""}</span></button>)}</div>}
 </div></div>;
}
const steps=["Ваш бізнес","Обсяг роботи","Додатково"];
export default function Calculator(){
 const [step,setStep]=useState(0);
 const [kind,setKind]=useState("ТОВ, єдиний податок без ПДВ");
 const [band,setBand]=useState("10–20");
 const [primary,setPrimary]=useState(false);
 const [staffMode,setStaffMode]=useState("none");
 const [staffN,setStaffN]=useState("0");
 const [mil,setMil]=useState(false);
 const [land,setLand]=useState("0");
 const [copied,setCopied]=useState(false);
 const group=books[kind], isFop=kind.startsWith("ФОП"), hasStaff=staffMode!=="none"||mil;
 const rows=useMemo(()=>{
  const result:[string,number][]=[["Бухгалтерський супровід",group.bands[band]?.[primary?"yes":"no"]??0]];
  if(staffMode!=="none"&&staffN!=="0"){const pair=staff[staffMode]?.[staffN];if(pair)result.push(["Облік працівників",pair[0]]);}
  if(mil&&staffN!=="0"){const pair=military[staffN];if(pair)result.push(["Військовий облік",pair[0]]);}
  if(Number(land))result.push(["Земельні ділянки",Number(land)]);
  return result;
 },[group,band,primary,staffMode,staffN,mil,land]);
 const total=rows.reduce((sum,row)=>sum+row[1],0);
 function changeKind(value:string){setKind(value);setBand(Object.keys(books[value].bands)[0]);setPrimary(false);setLand("0");setCopied(false);}
 function copy(){
  const details=["Попередній розрахунок АКЦ",kind,band,...rows.map(([label,price])=>label+": "+money(price)),"Разом: "+money(total)+" / місяць"];
  if(navigator.clipboard){void navigator.clipboard.writeText(details.join("\n")).then(()=>setCopied(true)).catch(()=>setCopied(false));}
 }
 return <main className={`${styles.page} ${expertiseFont}`}><ExpertiseHeader /><div className={styles.shell}>
  
  <div className={styles.intro}><p className={styles.eyebrow}>АКЦ / РОЗРАХУНОК ВАРТОСТІ</p><h1>Простий розрахунок.<br/><em>Прозора вартість.</em></h1><p className={styles.lead}>Відповідайте на кілька запитань — і одразу побачите орієнтовну вартість послуг для вашого бізнесу.</p></div>
  <div className={styles.layout}>
   <section className={styles.wizard} aria-label="Калькулятор послуг">
    <div className={styles.progress} aria-label={"Крок "+(step+1)+" з 3"}>{steps.map((name,i)=><button type="button" key={name} className={i===step?styles.current:i<step?styles.completed:""} onClick={()=>setStep(i)}><span className={styles.progressNumber}>{String(i+1).padStart(2,"0")}</span><span>{name}</span></button>)}</div>
    <div className={styles.stepBody} key={step}>
     {step===0&&<><p className={styles.stepEyebrow}>КРОК 01 / 03</p><h2>Який у вас бізнес?</h2><p className={styles.stepLead}>Оберіть тип — ми покажемо відповідні тарифи.</p>
      <div className={styles.choices}>
       <button type="button" className={!isFop?styles.choiceActive:styles.choice} onClick={()=>changeKind("ТОВ, єдиний податок без ПДВ")}><span className={styles.choiceIcon}>01</span><span><strong>Компанія</strong><small>ТОВ, сільськогосподарське підприємство, фермерське господарство</small></span><span className={styles.choiceMark}>{!isFop?"●":"○"}</span></button>
       <button type="button" className={isFop?styles.choiceActive:styles.choice} onClick={()=>changeKind("ФОП 2 група")}><span className={styles.choiceIcon}>02</span><span><strong>Підприємець</strong><small>Фізична особа-підприємець (ФОП)</small></span><span className={styles.choiceMark}>{isFop?"●":"○"}</span></button>
      </div>
      <Picker label="Уточніть систему оподаткування" value={kind} onChange={changeKind} options={Object.keys(books).filter(k=>k.startsWith("ФОП")===isFop).map(k=>({value:k,label:k}))}/>
     </>}
     {step===1&&<><p className={styles.stepEyebrow}>КРОК 02 / 03</p><h2>Який обсяг роботи?</h2><p className={styles.stepLead}>Це допоможе підібрати тариф саме під ваш бізнес.</p>
      {Object.keys(group.bands).length>1?<div className={styles.bandGroup}><p className={styles.fieldHeading}>{group.ops?"Скільки приблизно операцій на місяць?":"Який варіант обслуговування потрібен?"}</p><div className={styles.bandChoices}>{Object.keys(group.bands).map(b=><button key={b} type="button" className={band===b?styles.bandActive:styles.band} onClick={()=>setBand(b)}>{b}{group.ops&&<small>операцій</small>}</button>)}</div>{group.ops&&<p className={styles.hint}>Операція — наприклад, продаж, покупка чи платіж.</p>}</div>:<div className={styles.info}>Для обраного типу бізнесу передбачено один базовий тариф. Можна переходити далі.</div>}
      {group.ops&&<div className={styles.documentQuestion}><div><strong>Потрібна обробка документів?</strong><p>Рахунки, акти, накладні та інша первинна документація</p></div><div className={styles.yesNo}><button type="button" className={!primary?styles.yesActive:styles.yes} onClick={()=>setPrimary(false)}>Ні</button><button type="button" className={primary?styles.yesActive:styles.yes} onClick={()=>setPrimary(true)}>Так</button></div></div>}
     </>}
     {step===2&&<><p className={styles.stepEyebrow}>КРОК 03 / 03</p><h2>Що ще потрібно?</h2><p className={styles.stepLead}>Додаткові послуги необов’язкові. Якщо потрібен лише бухгалтерський облік, залиште все як є.</p>
      <div className={styles.fields}>
       <Picker label="Зарплата та кадровий облік" value={staffMode} onChange={setStaffMode} options={[{value:"none",label:"Не потрібно"},{value:"all",label:"Зарплата + кадровий облік"},{value:"zp",label:"Тільки нарахування зарплати"},{value:"ko",label:"Тільки кадровий облік"}]}/>
       <Picker label="Військовий облік" value={mil?"yes":"no"} onChange={v=>setMil(v==="yes")} options={[{value:"no",label:"Не потрібно"},{value:"yes",label:"Потрібно"}]}/>
       {hasStaff&&<Picker label="Кількість працівників" value={staffN} onChange={setStaffN} options={[{value:"0",label:"Оберіть кількість"},...Object.keys(military).map(n=>({value:n,label:n.replaceAll("-", "–")+" працівників"}))]}/>}
       {kind.startsWith("СТОВ")&&<Picker label="Облік земельних ділянок" value={land} onChange={setLand} options={[{value:"0",label:"Не потрібно"},{value:"9000",label:"До 100 га"},{value:"15000",label:"100–200 га"}]}/>}
      </div>{hasStaff&&staffN==="0"&&<p className={styles.hint}>Вкажіть кількість працівників, щоб включити ці послуги в розрахунок.</p>}
     </>}
    </div>
    <div className={styles.navigation}>{step>0?<button type="button" className={styles.prev} onClick={()=>setStep(step-1)}>← Назад</button>:<span/>}{step<2?<button type="button" className={styles.next} onClick={()=>setStep(step+1)}>Продовжити <span>→</span></button>:<button type="button" className={styles.next} onClick={()=>setStep(0)}>Почати заново <span>↺</span></button>}</div>
   </section>
   <aside className={styles.summary}><div className={styles.summaryHeader}><span>ВАШ РОЗРАХУНОК</span><span className={styles.summaryDot}>●</span></div><p className={styles.totalLabel}>Орієнтовна вартість на місяць</p><div className={styles.total}>{money(total)}</div><p className={styles.summaryNote}>Сума змінюється разом із вашими відповідями</p><div className={styles.rule}/><p className={styles.breakdownTitle}>Деталі розрахунку</p><div className={styles.lines}>{rows.map(([label,value])=><div key={label}><span>{label}</span><strong>{money(value)}</strong></div>)}</div><button type="button" className={styles.copy} onClick={copy}>{copied?"✓ Скопійовано":"Скопіювати розрахунок"} <span aria-hidden="true">↗</span></button><p className={styles.disclaimer}>Попередній розрахунок за базовими тарифами. Остаточну вартість визначає спеціаліст АКЦ після уточнення деталей.</p></aside>
  </div>
 </div></main>;
}

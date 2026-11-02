"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
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

export default function Calculator(){
 const [kind,setKind]=useState("ТОВ, єдиний податок без ПДВ");
 const [band,setBand]=useState("10–20");
 const [primary,setPrimary]=useState(false);
 const [staffMode,setStaffMode]=useState("none");
 const [staffN,setStaffN]=useState("0");
 const [mil,setMil]=useState(false);
 const [land,setLand]=useState("0");
 const [extras,setExtras]=useState(false);
 const [copied,setCopied]=useState(false);
 const group=books[kind];
 const isFop=kind.startsWith("ФОП");
 const hasStaff=staffMode!=="none"||mil;
 const rows=useMemo(()=>{
   const result:[string,number][]=[["Бухгалтерський супровід",group.bands[band]?.[primary?"yes":"no"]??0]];
   if(staffMode!=="none"&&staffN!=="0"){const pair=staff[staffMode]?.[staffN];if(pair)result.push(["Облік працівників",pair[0]]);}
   if(mil&&staffN!=="0"){const pair=military[staffN];if(pair)result.push(["Військовий облік",pair[0]]);}
   if(Number(land))result.push(["Земельні ділянки",Number(land)]);
   return result;
 },[group,band,primary,staffMode,staffN,mil,land]);
 const total=rows.reduce((sum,row)=>sum+row[1],0);
 function changeKind(value:string){setKind(value);setBand(Object.keys(books[value].bands)[0]);setPrimary(false);setLand("0");}
 function copy(){
  const details=["Попередній розрахунок АКЦ",kind,band,...rows.map(([label,price])=>label+": "+money(price)),"Разом: "+money(total)+" / місяць"];
  if(navigator.clipboard){void navigator.clipboard.writeText(details.join("\n")).then(()=>{setCopied(true);}).catch(()=>setCopied(false));}
 }
 return <main className={styles.page}>
  <div className={styles.shell}>
   <header className={styles.top}>
    <Link href="/expertise" className={styles.back}>← <span>Експертиза</span></Link>
    <Link href="/" className={styles.brand}>АКЦ <span>/ Аудит Консалтинг Центр</span></Link>
   </header>
   <div className={styles.intro}>
    <p className={styles.eyebrow}>ОНЛАЙН-КАЛЬКУЛЯТОР <span>— 01 / 03</span></p>
    <h1>Вартість супроводу<br/><em>вашого бізнесу.</em></h1>
    <p className={styles.lead}>Декілька простих відповідей — і ви дізнаєтесь орієнтовну вартість бухгалтерських послуг.</p>
   </div>
   <div className={styles.layout}>
    <div className={styles.form}>
     <section className={styles.section}>
      <div className={styles.sectionTitle}><span className={styles.step}>01</span><div><h2>Розкажіть про свій бізнес</h2><p>Оберіть форму ведення діяльності</p></div></div>
      <div className={styles.segment} role="group" aria-label="Тип бізнесу">
       <button type="button" className={!isFop?styles.selected:""} onClick={()=>changeKind("ТОВ, єдиний податок без ПДВ")}>Компанія <small>ТОВ / ФГ</small></button>
       <button type="button" className={isFop?styles.selected:""} onClick={()=>changeKind("ФОП 2 група")}>Підприємець <small>ФОП</small></button>
      </div>
      <div className={styles.fields}>
       <label>Форма та система оподаткування<select value={kind} onChange={e=>changeKind(e.target.value)}>{Object.keys(books).filter(k=>k.startsWith("ФОП")===isFop).map(k=><option key={k} value={k}>{k}</option>)}</select></label>
       {Object.keys(group.bands).length>1&&<label>{group.ops?"Скільки операцій у вас за місяць?":"Варіант обслуговування"}<select value={band} onChange={e=>setBand(e.target.value)}>{Object.keys(group.bands).map(b=><option key={b} value={b}>{b}{group.ops?" операцій":""}</option>)}</select>{group.ops&&<span className={styles.help}>Операція — наприклад, продаж, покупка або платіж</span>}</label>}
      </div>
      {group.ops&&<div className={styles.question}><div><strong>Потрібна обробка первинних документів?</strong><span>Рахунки, акти, накладні та інші документи</span></div><div className={styles.pills}><button type="button" className={!primary?styles.active:""} onClick={()=>setPrimary(false)}>Ні</button><button type="button" className={primary?styles.active:""} onClick={()=>setPrimary(true)}>Так</button></div></div>}
     </section>
     <section className={styles.section}>
      <div className={styles.sectionTitle}><span className={styles.step}>02</span><div><h2>Чи потрібні додаткові послуги?</h2><p>Можна пропустити, якщо потрібен лише облік</p></div></div>
      <button type="button" className={styles.expand} aria-expanded={extras} onClick={()=>setExtras(!extras)}><span>{extras?"Приховати додаткові послуги":"Додати зарплату, кадровий чи військовий облік"}</span><span className={styles.expandIcon}>{extras?"−":"+"}</span></button>
      {extras&&<div className={styles.extraFields}>
       <div className={styles.fields}>
        <label>Робота з працівниками<select value={staffMode} onChange={e=>setStaffMode(e.target.value)}><option value="none">Не потрібна</option><option value="all">Зарплата та кадровий облік</option><option value="zp">Лише нарахування зарплати</option><option value="ko">Лише кадровий облік</option></select></label>
        <label>Військовий облік<select value={mil?"yes":"no"} onChange={e=>setMil(e.target.value==="yes")}><option value="no">Не потрібен</option><option value="yes">Потрібен</option></select></label>
        {hasStaff&&<label>Скільки працівників?<select value={staffN} onChange={e=>setStaffN(e.target.value)}><option value="0">Оберіть кількість</option><option value="1">1</option><option value="2-5">2–5</option><option value="5-10">5–10</option><option value="10-20">10–20</option><option value="20-40">20–40</option></select></label>}
        {kind.startsWith("СТОВ")&&<label>Облік земельних ділянок<select value={land} onChange={e=>setLand(e.target.value)}><option value="0">Не потрібен</option><option value="9000">До 100 га</option><option value="15000">100–200 га</option></select></label>}
       </div>
       {hasStaff&&staffN==="0"&&<p className={styles.hint}>Вкажіть кількість працівників, щоб додати ці послуги до вартості.</p>}
      </div>}
     </section>
     <p className={styles.footnote}>Розрахунок не є публічною офертою. Фінальну вартість уточнює спеціаліст АКЦ.</p>
    </div>
    <aside className={styles.summary} aria-live="polite">
     <div className={styles.summaryTop}><span>ВАШ РОЗРАХУНОК</span><span className={styles.liveDot}>● Оновлюється автоматично</span></div>
     <p className={styles.totalLabel}>Орієнтовна вартість</p>
     <div className={styles.total}>{money(total)}</div>
     <p className={styles.period}>на місяць</p>
     <div className={styles.rule}/>
     <p className={styles.breakdownTitle}>Що входить у розрахунок</p>
     <div className={styles.lines}>{rows.map(([label,value])=><div key={label}><span>{label}</span><strong>{money(value)}</strong></div>)}</div>
     <button type="button" className={styles.copy} onClick={copy}>{copied?"✓ Розрахунок скопійовано":"Скопіювати розрахунок"} <span aria-hidden="true">↗</span></button>
     <p className={styles.disclaimer}>Це попередня оцінка за базовими тарифами. Остаточна ціна залежить від складності та обсягу робіт.</p>
    </aside>
   </div>
  </div>
 </main>;
}

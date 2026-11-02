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
 const [kind,setKind]=useState(Object.keys(books)[0]); const [band,setBand]=useState(Object.keys(books[Object.keys(books)[0]].bands)[0]);
 const [primary,setPrimary]=useState(false);const [discount,setDiscount]=useState(false);
 const [staffMode,setStaffMode]=useState("none");const [staffN,setStaffN]=useState("0");const [mil,setMil]=useState(false);const [land,setLand]=useState("0");
 const group=books[kind];
 const rows=useMemo(()=>{
 const base=group.bands[band]?.[primary?"yes":"no"]??0;
 const result:[string,number][]=[["Бухгалтерський облік",base]];
 if(staffMode!=="none"&&staffN!=="0"){const pair=staff[staffMode]?.[staffN];if(pair)result.push(["Зарплата та/або кадровий облік",pair[discount?1:0]]);}
 if(mil&&staffN!=="0"){const pair=military[staffN];if(pair)result.push(["Військовий облік",pair[discount?1:0]]);}
 if(Number(land))result.push(["Земельні ділянки",Number(land)]);
 return result;
 },[group,band,primary,discount,staffMode,staffN,mil,land]);
 const total=rows.reduce((s,r)=>s+r[1],0);
 function changeKind(v:string){setKind(v);setBand(Object.keys(books[v].bands)[0]);setPrimary(false);if(!v.startsWith("СТОВ"))setLand("0");}
 return <main className={styles.page}><div className={styles.shell}>
 <nav className={styles.top}><Link href="/expertise">← Назад до експертизи</Link><Link href="/">АКЦ</Link></nav>
 <div className={styles.intro}><p className={styles.eyebrow}>АКЦ / ІНТЕРАКТИВНИЙ РОЗРАХУНОК</p><h1>Розрахуйте вартість <em>послуг</em></h1><p>Оберіть параметри вашого бізнесу — ми покажемо орієнтовну щомісячну вартість бухгалтерського супроводу.</p></div>
 <div className={styles.layout}><section className={styles.form}>
 <div className={styles.section}><div className={styles.sectionTitle}><span>01</span><h2>Ваш бізнес</h2></div>
 <div className={styles.fields}><label>Тип клієнта<select value={kind} onChange={e=>changeKind(e.target.value)}>{Object.keys(books).map(k=><option key={k}>{k}</option>)}</select></label>
 <label>{group.ops?"Кількість операцій на місяць":"Обсяг / група"}<select value={band} onChange={e=>setBand(e.target.value)}>{Object.keys(group.bands).map(b=><option key={b} value={b}>{b}{group.ops?" операцій":""}</option>)}</select></label>
 {group.ops||kind==="ФОП 3 група без ПДВ"?<label>Первинні документи<select value={primary?"yes":"no"} onChange={e=>setPrimary(e.target.value==="yes")}><option value="no">Без первинних документів</option><option value="yes">З первинними документами</option></select></label>:null}
 <label>Варіант тарифу<select value={discount?"disc":"full"} onChange={e=>setDiscount(e.target.value==="disc")}><option value="full">Стандартний</option><option value="disc">Пільговий (за погодженням)</option></select></label></div></div>
 <div className={styles.section}><div className={styles.sectionTitle}><span>02</span><h2>Додаткові послуги</h2></div><div className={styles.fields}>
 <label>Облік працівників<select value={staffMode} onChange={e=>setStaffMode(e.target.value)}><option value="none">Не потрібен</option><option value="all">Зарплата + кадровий облік</option><option value="zp">Лише зарплата</option><option value="ko">Лише кадровий облік</option></select></label>
 <label>Кількість працівників<select value={staffN} onChange={e=>setStaffN(e.target.value)}><option value="0">0</option><option value="1">1</option><option value="2-5">2–5</option><option value="5-10">5–10</option><option value="10-20">10–20</option><option value="20-40">20–40</option></select></label>
 <label>Військовий облік<select value={mil?"yes":"no"} onChange={e=>setMil(e.target.value==="yes")}><option value="no">Не потрібен</option><option value="yes">Потрібен</option></select></label>
 {kind.startsWith("СТОВ")?<label>Земельні ділянки<select value={land} onChange={e=>setLand(e.target.value)}><option value="0">Немає</option><option value="9000">До 100 га — 9 000 грн</option><option value="15000">100–200 га — від 15 000 грн</option></select></label>:null}
 </div>{mil&&staffN==="0"?<p className={styles.hint}>Для розрахунку військового обліку вкажіть кількість працівників.</p>:null}</div>
 </section><aside className={styles.summary}><p className={styles.eyebrow}>ВАШ РОЗРАХУНОК</p><p className={styles.totalLabel}>Орієнтовна вартість на місяць</p><div className={styles.total}>{money(total)}<span> / міс.</span></div><div className={styles.lines}>{rows.map(([name,value])=><div key={name}><span>{name}</span><strong>{money(value)}</strong></div>)}</div><p className={styles.disclaimer}>Розрахунок попередній. Пільговий тариф застосовується лише після погодження. Остаточна вартість залежить від документів, складності та обсягу робіт.</p><button className={styles.copy} type="button" onClick={()=>{const text="Попередній розрахунок АКЦ\n"+kind+"\n"+band+"\n"+rows.map(([n,v])=>n+": "+money(v)).join("\n")+"\nРазом: "+money(total);void navigator.clipboard?.writeText(text);}}>Скопіювати розрахунок ↗</button></aside></div>
 </div></main>
}

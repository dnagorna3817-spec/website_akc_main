"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ExpertiseHeader, expertiseFont } from "../expertise/ExpertiseView";
import styles from "./insights.module.css";
import EventRegistration from "./EventRegistration";

import { articles, categories, type Category } from "./articles";

export default function InsightsPage() {
  const [cmsArticles,setCmsArticles]=useState<typeof articles>([]);
  useEffect(()=>{
   const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
   if(!url||!key)return;
   fetch(url+"/rest/v1/cms_published_news?select=slug,title,summary,category,published_at&order=published_at.desc",{headers:{apikey:key,Authorization:"Bearer "+key}})
    .then(r=>r.ok?r.json():[]).then((rows:{slug:string;title:string;summary:string;category:string;published_at:string}[])=>setCmsArticles(rows.map((n,i)=>({id:1000+i,slug:n.slug,title:n.title,summary:n.summary,category:n.category as typeof articles[number]["category"],date:new Date(n.published_at).toLocaleDateString("uk-UA"),visual:"lines"})))).catch(()=>{});
  },[]);
  const [category, setCategory] = useState<Category>("Усі");
  const [registrationTitle, setRegistrationTitle] = useState<string | null>(null);
  const filtered = useMemo(() => category === "Усі" ? [...cmsArticles,...articles] : [...cmsArticles,...articles].filter(item => item.category === category), [category,cmsArticles]);
  const [lead, ...rest] = filtered;
  return (
    <div className={`${styles.page} ${expertiseFont}`}>
      <ExpertiseHeader />
      <main className={styles.main}>
        <div className={styles.intro}>
          <div>
            <p className={styles.eyebrow}>АКЦ / АНАЛІТИКА ТА ПУБЛІКАЦІЇ</p>
            <h1>Новини</h1>
            <p className={styles.lead}>Аналітика, експертні погляди та матеріали для рішень у бізнесі.</p>
          </div>
          <div className={styles.filters} role="group" aria-label="Категорії публікацій">
            {categories.map(item => <button key={item} type="button" className={category === item ? styles.selected : ""} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
          </div>
        </div>
        
        {lead && <article className={styles.featured}>
          <div className={`${styles.visual} ${styles.featureVisual}`} aria-hidden="true"><Image src="/media/akc-audit-card.jpg" alt="" fill sizes="(max-width: 760px) 100vw, 48vw" /></div>
          <div className={styles.featureText}>
            <div className={styles.meta}><span>{lead.category}</span><span>{lead.date}</span></div>
            <h2><Link href={`/insights/${lead.slug}`} className={styles.titleLink}>{lead.title}</Link></h2>
            <p>{lead.summary}</p>
            {lead.category === "План заходів" ? <button type="button" className={styles.registrationButton} onClick={() => setRegistrationTitle(lead.title)}>Зареєструватися <span aria-hidden="true">↗</span></button> : <Link href={`/insights/${lead.slug}`} className={styles.readMore}>Детальніше <span aria-hidden="true">↗</span></Link>}
          </div>
        </article>}
        {rest.length > 0 && <div className={styles.grid}>
          {rest.map(article => <article key={article.id} className={styles.card}>
            <div className={`${styles.cardVisual} ${styles[article.visual]}`} aria-hidden="true"><span /></div>
            <div className={styles.meta}><span>{article.category}</span><span>{article.date}</span></div>
            <h3><Link href={`/insights/${article.slug}`} className={styles.titleLink}>{article.title}</Link></h3>
            <p>{article.summary}</p>
            {article.category === "План заходів" ? <button type="button" className={styles.registrationButton} onClick={() => setRegistrationTitle(article.title)}>Зареєструватися <span aria-hidden="true">↗</span></button> : <Link href={`/insights/${article.slug}`} className={styles.cardMore}>Детальніше <span aria-hidden="true">↗</span></Link>}
          </article>)}
        </div>}
        <footer className={styles.footer}><span>АКЦ / НОВИНИ</span><Link href="/">На головну <span aria-hidden="true">↗</span></Link></footer>
      </main>
      {registrationTitle && <EventRegistration title={registrationTitle} onClose={() => setRegistrationTitle(null)} />}
    </div>
  );
}

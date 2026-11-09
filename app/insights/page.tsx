"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ExpertiseHeader, expertiseFont } from "../expertise/ExpertiseView";
import styles from "./insights.module.css";

import { articles, categories, type Category } from "./articles";

export default function InsightsPage() {
  const [category, setCategory] = useState<Category>("Усі");
  const filtered = useMemo(() => category === "Усі" ? articles : articles.filter(item => item.category === category), [category]);
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
            <Link href={`/insights/${lead.slug}`} className={styles.readMore}>Детальніше <span aria-hidden="true">↗</span></Link>
          </div>
        </article>}
        {rest.length > 0 && <div className={styles.grid}>
          {rest.map(article => <article key={article.id} className={styles.card}>
            <div className={`${styles.cardVisual} ${styles[article.visual]}`} aria-hidden="true"><span /></div>
            <div className={styles.meta}><span>{article.category}</span><span>{article.date}</span></div>
            <h3><Link href={`/insights/${article.slug}`} className={styles.titleLink}>{article.title}</Link></h3>
            <p>{article.summary}</p>
            <Link href={`/insights/${article.slug}`} className={styles.cardMore}>Детальніше <span aria-hidden="true">↗</span></Link>
          </article>)}
        </div>}
        <footer className={styles.footer}><span>АКЦ / НОВИНИ</span><Link href="/">На головну <span aria-hidden="true">↗</span></Link></footer>
      </main>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ExpertiseHeader, expertiseFont } from "../expertise/ExpertiseView";
import styles from "./insights.module.css";

type Category = "Усі" | "Статті" | "Публікації" | "Новини";
type Article = { id: number; category: Exclude<Category,"Усі">; date: string; title: string; summary: string; visual: string };
const articles: Article[] = [
  { id: 1, category: "Статті", date: "ОГЛЯД · ПРИКЛАД", title: "Як підготувати бізнес до змін у 2027 році", summary: "Ключові питання для планування, фінансової стійкості та управління ризиками.", visual: "feature" },
  { id: 2, category: "Новини", date: "НОВИНИ · ПРИКЛАД", title: "Податкові зміни: на що звернути увагу бізнесу", summary: "Орієнтири для аналізу змін у регулюванні.", visual: "lines" },
  { id: 3, category: "Публікації", date: "ПУБЛІКАЦІЇ · ПРИКЛАД", title: "Оновлення в управлінні податковими ризиками", summary: "Як структурувати перевірку процесів і документів.", visual: "glass" },
  { id: 4, category: "Статті", date: "СТАТТІ · ПРИКЛАД", title: "Трансформація податкової функції в компанії", summary: "Практичні напрями розвитку фінансових процесів.", visual: "arc" },
];
const categories: Category[] = ["Усі", "Статті", "Публікації", "Новини"];

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
            <h1>Insights<span className={styles.period}>.</span></h1>
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
            <h2>{lead.title}</h2>
            <p>{lead.summary}</p>
            <span className={styles.readMore}>Матеріал готується <span aria-hidden="true">↗</span></span>
          </div>
        </article>}
        {rest.length > 0 && <div className={styles.grid}>
          {rest.map(article => <article key={article.id} className={styles.card}>
            <div className={`${styles.cardVisual} ${styles[article.visual]}`} aria-hidden="true"><span /></div>
            <div className={styles.meta}><span>{article.category}</span><span>{article.date}</span></div>
            <h3>{article.title}</h3>
            <p>{article.summary}</p>
            <span className={styles.cardMore}>Матеріал готується <span aria-hidden="true">↗</span></span>
          </article>)}
        </div>}
        <footer className={styles.footer}><span>АКЦ / INSIGHTS</span><Link href="/">На головну <span aria-hidden="true">↗</span></Link></footer>
      </main>
    </div>
  );
}

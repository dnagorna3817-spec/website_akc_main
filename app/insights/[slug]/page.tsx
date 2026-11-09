import Link from "next/link";
import { notFound } from "next/navigation";
import { ExpertiseHeader, expertiseFont } from "../../expertise/ExpertiseView";
import { articles } from "../articles";
import styles from "./article.module.css";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  const index = articles.findIndex((item) => item.slug === slug) + 1;
  return (
    <div className={`${styles.page} ${expertiseFont}`}>
      <ExpertiseHeader />
      <main className={styles.hero}>
        <section className={styles.content}>
          <p className={styles.kicker}>{String(index).padStart(2, "0")} / Новини</p>
          <div className={styles.status}><span className={styles.glow} /> {article.category}</div><p className={styles.index}>0{index} <span>/</span> <strong>АКЦ</strong></p>
          <h1>{article.title}</h1>
          <p className={styles.description}>{article.summary}</p>
          <div className={styles.separator} />
          
          <nav className={styles.links} aria-label="Навігація публікації">
            <Link href="/insights">Усі новини <span aria-hidden="true">⟶</span></Link>
            
          </nav>
        </section>
        <div className={styles.art} aria-hidden="true">
          <div className={styles.geometry}><div className={styles.facetOne} /><div className={styles.facetTwo} /><div className={styles.facetThree} /><div className={styles.edge} /></div>
        </div>
      </main>
    </div>
  );
}

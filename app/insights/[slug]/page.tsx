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
  let article = articles.find((item) => item.slug === slug);
  let body: string | undefined;
  let coverUrl: string | null = null;
  if (!article && /^[a-z0-9-]+$/.test(slug)) {
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if(url&&key) {
      try {
        const response=await fetch(url+"/rest/v1/cms_published_news?select=slug,title,summary,category,body,published_at,image_url&slug=eq."+encodeURIComponent(slug),{headers:{apikey:key,Authorization:"Bearer "+key},cache:"no-store"});
        if(response.ok) {
          const rows=await response.json() as {slug:string;title:string;summary:string;category:string;body:string;published_at:string;image_url:string|null}[];
          const item=rows[0];
          if(item){body=item.body;coverUrl=item.image_url;article={id:9999,slug:item.slug,title:item.title,summary:item.summary,category:item.category as typeof articles[number]["category"],date:new Date(item.published_at).toLocaleDateString("uk-UA"),visual:"lines"};}
        }
      }catch{}
    }
  }
  if (!article) notFound();
  
  return (
    <div className={`${styles.page} ${expertiseFont}`}>
      <ExpertiseHeader />
      <main className={styles.hero}>
        <section className={styles.content}>
          <p className={styles.kicker}>АКЦ / Новини</p>
          <div className={styles.status}><span className={styles.glow} /> {article.category}</div>
          <h1>{article.title}</h1>
          <p className={styles.description}>{article.summary}</p>
          {body&&<div style={{whiteSpace:"pre-wrap",lineHeight:1.8,marginTop:28,maxWidth:760}}>{body}</div>}
          <div className={styles.separator} />
          
          <nav className={styles.links} aria-label="Навігація публікації">
            <Link href="/insights">Усі новини <span aria-hidden="true">⟶</span></Link>
            
          </nav>
        </section>
        <div className={`${styles.art} ${coverUrl ? styles.artWithPhoto : ""}`} aria-hidden="true">
          {coverUrl && <div className={styles.cover} style={{backgroundImage:`url("${coverUrl.replace(/["\\]/g,"")}")`}} />}
          <div className={styles.geometry}><div className={styles.facetOne} /><div className={styles.facetTwo} /><div className={styles.facetThree} /><div className={styles.edge} /></div>
        </div>
      </main>
    </div>
  );
}

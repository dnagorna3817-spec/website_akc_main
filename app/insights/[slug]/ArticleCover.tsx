"use client";
import { useEffect, useState } from "react";
import styles from "./article.module.css";

export default function ArticleCover({ slug, initialUrl }: { slug: string; initialUrl: string | null }) {
  const [photo, setPhoto] = useState(initialUrl);
  useEffect(() => {
    if (initialUrl) return;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) { console.error("CMS photo: missing public Supabase configuration"); return; }
    const controller = new AbortController();
    fetch(url + "/rest/v1/cms_published_news?select=image_url,banner_image_url&slug=eq." + encodeURIComponent(slug), {
      headers: { apikey: key, Authorization: "Bearer " + key }, signal: controller.signal, cache: "no-store"
    }).then(async response => {
      if (!response.ok) throw new Error("CMS photo request failed: HTTP " + response.status);
      return response.json() as Promise<{ image_url: string | null; banner_image_url: string | null }[]>;
    }).then(rows => setPhoto(rows[0]?.image_url || rows[0]?.banner_image_url || null))
      .catch(error => { if (!controller.signal.aborted) console.error(error); });
    return () => controller.abort();
  }, [slug, initialUrl]);
  return <div className={`${styles.art} ${photo ? styles.artWithPhoto : ""}`} aria-hidden="true">
    {photo && <div className={styles.cover} style={{ backgroundImage: `url("${photo.replace(/["\\]/g, "")}")` }} />}
    <div className={styles.geometry}><div className={styles.facetOne} /><div className={styles.facetTwo} /><div className={styles.facetThree} /><div className={styles.edge} /></div>
  </div>;
}

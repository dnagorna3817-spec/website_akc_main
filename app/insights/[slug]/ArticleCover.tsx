"use client";
import { useEffect, useState } from "react";
import styles from "./article.module.css";

type CoverRecord = { image_url: string | null; banner_image_url: string | null };
export default function ArticleCover({ slug, initialUrl }: { slug: string; initialUrl: string | null }) {
  const [photo, setPhoto] = useState<string | null>(initialUrl);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setPhoto(initialUrl);
    setFailed(false);
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      console.error("AKC article photo: Supabase environment variables are missing");
      return;
    }
    const controller = new AbortController();
    const endpoint = url + "/rest/v1/cms_published_news?select=image_url,banner_image_url&slug=eq." + encodeURIComponent(slug);
    fetch(endpoint, { headers: { apikey: key, Authorization: "Bearer " + key }, cache: "no-store", signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error("AKC article photo: Supabase HTTP " + response.status + " " + (await response.text()).slice(0, 250));
        return response.json() as Promise<CoverRecord[]>;
      })
      .then(rows => {
        const next = rows[0]?.image_url || rows[0]?.banner_image_url;
        if (next) setPhoto(next);
        else console.warn("AKC article photo: no published image for slug", slug);
      })
      .catch(error => { if (!controller.signal.aborted) console.error(error); });
    return () => controller.abort();
  }, [slug, initialUrl]);
  return <div className={`${styles.art} ${photo && !failed ? styles.artWithPhoto : ""}`} aria-label="Обкладинка новини" role="img">
    {photo && !failed && <img src={photo} alt="" className={styles.coverImage} onError={() => { setFailed(true); console.error("AKC article photo: image could not load", photo); }} />}
    <div className={styles.geometry}><div className={styles.facetOne} /><div className={styles.facetTwo} /><div className={styles.facetThree} /><div className={styles.edge} /></div>
  </div>;
}

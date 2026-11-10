"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { articles } from "../insights/articles";
import EventRegistration from "../insights/EventRegistration";
import styles from "./LatestEventToast.module.css";

const latestEvent = [...articles].filter((article) => article.category === "План заходів").sort((a, b) => b.id - a.id)[0];

export default function LatestEventToast() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);

  useEffect(() => {
    if (!latestEvent) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onIntroReady = () => {
      timer = setTimeout(() => setVisible(true), 1100);
    };
    window.addEventListener("akc:intro-ready", onIntroReady, { once: true });
    return () => {
      window.removeEventListener("akc:intro-ready", onIntroReady);
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (!latestEvent) return null;

  return (
    <>
      {visible && !dismissed && !registrationOpen && (
        <aside className={styles.toast} aria-label="Актуальний захід АКЦ">
          <button className={styles.close} type="button" onClick={() => setDismissed(true)} aria-label="Закрити сповіщення">×</button>
          <span className={styles.eyebrow}><span className={styles.dot} /> АКЦ / ПЛАН ЗАХОДІВ</span>
          <h2>{latestEvent.title}</h2>
          <p>{latestEvent.summary}</p>
          <div className={styles.actions}>
            <button type="button" className={styles.register} onClick={() => setRegistrationOpen(true)}>Зареєструватися <span aria-hidden="true">↗</span></button>
            <Link href={`/insights/${latestEvent.slug}`} className={styles.details}>Детальніше</Link>
          </div>
        </aside>
      )}
      {registrationOpen && <EventRegistration title={latestEvent.title} onClose={() => { setRegistrationOpen(false); setDismissed(true); }} />}
    </>
  );
}

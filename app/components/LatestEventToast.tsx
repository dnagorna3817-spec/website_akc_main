"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { articles } from "../insights/articles";
import EventRegistration from "../insights/EventRegistration";
import styles from "./LatestEventToast.module.css";

const latestEvent = [...articles]
  .filter((article) => article.category === "План заходів")
  .sort((a, b) => b.id - a.id)[0];

export default function LatestEventToast() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!latestEvent) return;
    let revealTimer: ReturnType<typeof setTimeout> | undefined;
    const reveal = () => {
      if (revealTimer) clearTimeout(revealTimer);
      revealTimer = setTimeout(() => setVisible(true), 1100);
    };
    // Show after the logo intro, including when the video cannot finish.
    const fallbackTimer = setTimeout(() => setVisible(true), 9600);
    const onIntroReady = () => {
      clearTimeout(fallbackTimer);
      reveal();
    };
    window.addEventListener("akc:intro-ready", onIntroReady, { once: true });
    return () => {
      window.removeEventListener("akc:intro-ready", onIntroReady);
      clearTimeout(fallbackTimer);
      if (revealTimer) clearTimeout(revealTimer);
    };
  }, []);

  if (!mounted || !latestEvent) return null;

  // Portal avoids stacking and overflow rules on the animated homepage.
  return createPortal(
    <>
      {visible && !dismissed && !registrationOpen && (
        <aside className={styles.toast} aria-label="Актуальний захід АКЦ" role="status">
          <button className={styles.close} type="button" onClick={() => setDismissed(true)} aria-label="Закрити сповіщення">×</button>
          <span className={styles.eyebrow}><span className={styles.dot} /> АКЦ / ПЛАН ЗАХОДІВ</span>
          <h2>{latestEvent.title}</h2>
          <div className={styles.actions}>
            <button type="button" className={styles.register} onClick={() => setRegistrationOpen(true)}>Зареєструватися <span aria-hidden="true">↗</span></button>
            <Link href={`/insights/${latestEvent.slug}`} className={styles.details}>Детальніше</Link>
          </div>
        </aside>
      )}
      {registrationOpen && <EventRegistration title={latestEvent.title} onClose={() => { setRegistrationOpen(false); setDismissed(true); }} />}
    </>,
    document.body
  );
}

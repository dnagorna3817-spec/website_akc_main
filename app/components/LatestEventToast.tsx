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

    // The existing intro-ready event is emitted when the video ends.
    // The navigation reveal takes about 0.5 seconds, then wait 1 more
    // second before showing the toast. Do not modify the intro or GSAP.
    let timer: number | undefined;
    const showAfterIntro = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setVisible(true), 1500);
    };
    window.addEventListener("akc:intro-ready", showAfterIntro);
    // Handle the event having fired before this component subscribed.
    if (document.querySelector('.logo-intro-layer[data-intro-mode="static"]')) {
      showAfterIntro();
    }
    return () => {
      window.removeEventListener("akc:intro-ready", showAfterIntro);
      window.clearTimeout(timer);
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

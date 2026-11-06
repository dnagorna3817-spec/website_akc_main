"use client";

import { useEffect, useState } from "react";
import styles from "./qualification.module.css";

const certificates = [
  { src: "/media/certificate-front.png", alt: "Зразок сертифіката — лицьова сторона" },
  { src: "/media/certificate-back.png", alt: "Зразок сертифіката — зворотна сторона" },
];

export default function CertificateShowcase() {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") setActive((current) => current === null ? null : 1 - current);
    };
    document.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [active]);

  return (
    <div className={styles.qCertificateShowcase}>
      <div className={styles.qCertificateStack} aria-label="Переглянути зразок сертифіката">
        {certificates.map((certificate, index) => (
          <button
            key={certificate.src}
            type="button"
            className={index === 0 ? styles.qCertificateFront : styles.qCertificateBack}
            onClick={() => setActive(index)}
            aria-label={`Збільшити: ${certificate.alt}`}
          >
            {/* Using img for original certificate proportions and unaltered document artwork. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={certificate.src} alt={certificate.alt} loading="lazy" />
          </button>
        ))}
      </div>
      <p className={styles.qCertificateHint}>Зразок документа · Натисніть на сертифікат, щоб збільшити</p>
      {active !== null && (
        <div className={styles.qCertificateLightbox} role="dialog" aria-modal="true" aria-label="Перегляд зразка сертифіката" onClick={() => setActive(null)}>
          <button type="button" className={styles.qCertificateClose} onClick={() => setActive(null)} aria-label="Закрити перегляд">×</button>
          <button type="button" className={styles.qCertificatePrevious} onClick={(event) => { event.stopPropagation(); setActive(1 - active); }} aria-label="Показати іншу сторону">‹</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={certificates[active].src} alt={certificates[active].alt} onClick={(event) => event.stopPropagation()} />
          <button type="button" className={styles.qCertificateNext} onClick={(event) => { event.stopPropagation(); setActive(1 - active); }} aria-label="Показати іншу сторону">›</button>
          <span className={styles.qCertificateCounter}>{active + 1} / 2</span>
        </div>
      )}
    </div>
  );
}

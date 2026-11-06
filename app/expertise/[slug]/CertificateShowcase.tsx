"use client";

import { useState } from "react";
import styles from "./qualification.module.css";

export default function CertificateShowcase() {
  const [showBack, setShowBack] = useState(false);

  return (
    <div className={styles.qCertificateShowcase}>
      <button
        type="button"
        className={`${styles.qCertificateStack} ${showBack ? styles.qCertificateFlipped : ""}`}
        onClick={() => setShowBack((current) => !current)}
        aria-label={showBack ? "Показати обкладинку сертифіката" : "Показати другу сторінку сертифіката"}
        aria-pressed={showBack}
      >
        <span className={styles.qCertificateBack}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/certificate-back.png" alt="Зворотна сторона сертифіката" loading="lazy" />
        </span>
        <span className={styles.qCertificateFront}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/certificate-front.png" alt="Обкладинка сертифіката" loading="lazy" />
        </span>
      </button>
      <p className={styles.qCertificateHint}>Зразок сертифіката · Наведіть курсор або торкніться документа</p>
    </div>
  );
}

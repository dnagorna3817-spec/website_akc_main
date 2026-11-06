"use client";

import { useState } from "react";
import styles from "./qualification.module.css";

export default function CertificateShowcase() {
  const [showBackOnTouch, setShowBackOnTouch] = useState(false);

  return (
    <div className={styles.qCertificateShowcase}>
      <button
        type="button"
        className={`${styles.qCertificateStack} ${showBackOnTouch ? styles.qCertificateFlipped : ""}`}
        onClick={(event) => {
          // Hover devices reveal the reverse with CSS only; clicks never lock that state.
          if (event.nativeEvent.pointerType === "mouse") return;
          setShowBackOnTouch((value) => !value);
        }}
        aria-label="Переглянути іншу сторону сертифіката"
        aria-pressed={showBackOnTouch}
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

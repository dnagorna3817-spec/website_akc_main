import styles from "./qualification.module.css";

const certificates = [
  { src: "/media/certificate-front.png", alt: "Зразок сертифіката — лицьова сторона" },
  { src: "/media/certificate-back.png", alt: "Зразок сертифіката — зворотна сторона" },
];

export default function CertificateShowcase() {
  return (
    <div className={styles.qCertificateShowcase}>
      <div className={styles.qCertificateStack} aria-label="Зразок сертифіката фахівця">
        {certificates.map((certificate, index) => (
          <div
            key={certificate.src}
            className={index === 0 ? styles.qCertificateFront : styles.qCertificateBack}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={certificate.src} alt={certificate.alt} loading="lazy" />
          </div>
        ))}
      </div>
      <p className={styles.qCertificateHint}>Зразок сертифіката</p>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Roboto } from "next/font/google";
import { services } from "./services";
import styles from "./expertise.module.css";

const roboto = Roboto({ subsets: ["latin", "cyrillic"], display: "swap" });
export const expertiseFont = roboto.className;

export function Arrow() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M4 14h19m-8-8 8 8-8 8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function ExpertiseHeader({ active = "expertise" }: { active?: "expertise" | "industries" }) {
  return (
    <header className={styles.header} data-transition-header>
      <Link href="/" className={styles.brand} style={{ color: "#f5f7f8", textDecoration: "none" }} aria-label="АКЦ — головна">
        <Image src="/akc-brand-white.png" width={57} height={56} alt="" />
        <span>Аудит Консалтинг Центр</span>
      </Link>
      <nav className={styles.nav} aria-label="Основна навігація">
        <Link href="/about" style={{ color: "#f5f7f8", textDecoration: "none" }}>Про АКЦ</Link>
        <span aria-disabled="true" title="Сторінка ще не опублікована">Insights</span>
        <Link href="/expertise/qualification" style={{ color: "#f5f7f8", textDecoration: "none" }}>Кваліфікаційний центр</Link>
        <Link href="/industries" className={active === "industries" ? styles.active : undefined} style={{ color: active === "industries" ? "#64a6d8" : "#f5f7f8", textDecoration: "none" }}>Галузі</Link>
        <Link href="/expertise" className={active === "expertise" ? styles.active : undefined} style={{ color: active === "expertise" ? "#64a6d8" : "#f5f7f8", textDecoration: "none" }}>Експертиза</Link>
      </nav>
      <span className={styles.contacts} aria-disabled="true" title="Контактні дані ще не додано">
        Контакти <Arrow />
      </span>
      <details className={styles.mobileMenu}>
        <summary aria-label="Меню">Меню <span aria-hidden="true">☰</span></summary>
        <nav aria-label="Мобільна навігація">
          <Link href="/">Головна</Link>
          <Link href="/expertise">Експертиза</Link>
          <Link href="/expertise/qualification">Кваліфікаційний центр</Link>
          <Link href="/industries">Галузі</Link>
        </nav>
      </details>
    </header>
  );
}

export function CalculatorPlaceholder({ preview = false }: { preview?: boolean }) {
  return (
    <div className={styles.calculatorWrap}>
      <Link className={styles.calculator} href="/expertise/calculator">
        <span>РОЗРАХУВАТИ ВАРТІСТЬ ПОСЛУГ</span>
        <small>Попередній розрахунок за 1–2 хвилини</small>
        <Arrow />
      </Link>
    </div>
  );
}

export default function ExpertiseView({ preview = false }: { preview?: boolean }) {
  return (
    <div className={`${styles.page} ${styles.overview} ${expertiseFont}`} data-expertise-page={preview ? "preview" : "route"}>
      <ExpertiseHeader />
      <main className={styles.main}>
        <div
          className={styles.geometry}
          data-expertise-art
          aria-hidden="true"
        >
          <span data-scene-fallback>3D-відображення недоступне</span>
        </div>
        <div className={styles.content} data-expertise-content>
          <p className={styles.eyebrow}>02 / Експертиза</p>
          <h1 tabIndex={-1}>Напрями експертизи</h1>
          <ol className={styles.serviceList}>
            {services.map((service, index) => (
              <li key={service.slug}>
                <Link href={`/expertise/${service.slug}`}>
                  <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={styles.serviceLabel}>
                    {service.slug === "qualification" ? <>ПІДВИЩЕННЯ<br />ПРОФЕСІЙНОЇ КВАЛІФІКАЦІЇ</> : service.label}
                  </span>
                  <span className={styles.serviceAction} aria-hidden="true"><Arrow /></span>
                </Link>
              </li>
            ))}
          </ol>
          <CalculatorPlaceholder preview={preview} />
        </div>
      </main>
    </div>
  );
}

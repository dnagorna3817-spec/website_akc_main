import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./about.css";

export const metadata: Metadata = {
  title: "Про АКЦ — Аудит Консалтинг Центр",
  description: "Команда професіоналів АКЦ: аудит, бухгалтерський, податковий і кадровий супровід бізнесу.",
};

const metrics = [
  ["10+", "років на ринку"],
  ["1000+", "клієнтів"],
  ["40+", "експертів"],
  ["20 000+", "консультацій"],
];

const services = [
  { icon: "audit", title: "АУДИТ", lines: ["Фінансова звітність", "Аудиторські завдання"] },
  { icon: "accounting", title: "БУХГАЛТЕРСЬКИЙ ОБЛІК", lines: ["Супровід", "Відновлення обліку"] },
  { icon: "tax", title: "ПОДАТКИ", lines: ["Аналіз ризиків", "Податковий аналіз"] },
  { icon: "ifrs", title: "МСФЗ", lines: ["Консультації", "Підготовка звітностей"] },
];

const qualifications = [
  ["award", "Акредитований кваліфікаційний центр"],
  ["globe", "Професійна організація"],
  ["certificate", "Сертифіковані аудитори та фахівці"],
  ["standards", "Робота відповідно до професійних стандартів"],
];

function AboutIcon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    audit: <><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></>,
    accounting: <><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h3M8 17h3M15 13v4M13 15h4"/></>,
    tax: <><path d="M12 2 4 6v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6l-8-4Z"/><path d="m9 12 2 2 4-4"/></>,
    ifrs: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-3 3-3 15 0 18M12 3c3 3 3 15 0 18"/></>,
    award: <><circle cx="12" cy="9" r="5"/><path d="m8.5 13-1 8 4.5-2 4.5 2-1-8"/></>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-4 4-4 14 0 18M12 3c4 4 4 14 0 18"/></>,
    certificate: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h5M10 17l2 2 4-4"/></>,
    standards: <><path d="m12 3 7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3Z"/><path d="m9 12 2 2 4-4"/></>,
  };
  return <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] ?? paths.audit}</svg>;
}

function DiscussButton() {
  return <Link className="about-discuss" href="/#contacts"><span>Обговорити завдання</span><span className="about-arrow" aria-hidden="true">⟶</span></Link>;
}

export default function AboutPage() {
  return (
    <main className="about-page">
      <header className="about-header"><Link href="/" aria-label="На головну">АКЦ</Link><Link href="/" className="about-back">← ГОЛОВНА</Link></header>
      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-hero-art" aria-hidden="true"><span className="about-light about-light-one" /><span className="about-light about-light-two" /><span className="about-light about-light-three" /><span className="about-light about-light-four" /></div>
        <div className="about-hero-copy">
          <p className="about-eyebrow">01 / Про Аудит Консалтинг Центр</p>
          <h1 id="about-title">АУДИТ КОНСАЛТИНГ<br />ЦЕНТР</h1>
          <p className="about-hero-description">Команда професіоналів АКЦ допоможе вашому бізнесу працювати впевнено та розвиватися. Ми супроводжуємо реєстрацію підприємств, ФОП, ведемо бухгалтерський, податковий і кадровий, військовий облік, проводимо аудит та допомагаємо виявляти фінансові й податкові ризики.</p>
          <DiscussButton />
        </div>
      </section>
      <section className="about-partner about-section">
        <h2>ПРОФЕСІЙНИЙ ПАРТНЕР<br />ДЛЯ РОЗВИТКУ БІЗНЕСУ.</h2>
        <div className="about-vertical-line" />
        <div className="about-partner-description"><p>Ми поєднуємо аудиторську практику, консалтингові рішення та освітні ініціативи, щоб допомагати компаніям вирішувати складні завдання, мінімізувати ризики та впевнено рухатись вперед.</p><p>Працюємо з бізнесом, комунальними та державними підприємствами у різних галузях, забезпечуємо індивідуальний підхід, практичні рішення та високі стандарти по всій території України.</p></div>
      </section>
      <section className="about-metrics about-section" aria-label="АКЦ у цифрах"><div className="about-metrics-light" aria-hidden="true" />{metrics.map(([number,label])=><div className="about-metric" key={label}><strong>{number}</strong><span>{label}</span></div>)}</section>
      <section className="about-services about-section" aria-label="Наші послуги">{services.map((item,index)=><div className={`about-service about-service-${index+1}`} key={item.title}><div className="about-service-ambient" aria-hidden="true" /><span className="about-service-icon" aria-hidden="true"><AboutIcon name={item.icon} /></span><h3>{item.title}</h3><p>{item.lines[0]}<br />{item.lines[1]}</p></div>)}</section>
      <section className="about-qualification about-section"><h2>ПРОФЕСІЙНА<br />ЕКСПЕРТИЗА<br />ПІДТВЕРДЖЕННЯ<br />ОФІЦІЙНО.</h2><div className="about-vertical-line" /><div className="about-qualification-grid">{qualifications.map(([icon,label])=><div className="about-qualification-item" key={label}><span aria-hidden="true"><AboutIcon name={icon} /></span><p>{label}</p></div>)}</div></section>
      <section className="about-contact about-section"><div className="about-contact-art" aria-hidden="true"><span/><span/><span/></div><div className="about-contact-content"><h2>ПОТРІБНА КОНСУЛЬТАЦІЯ<br />ЩОДО ВАШОГО БІЗНЕСУ?</h2><DiscussButton /></div></section>
    </main>
  );
}

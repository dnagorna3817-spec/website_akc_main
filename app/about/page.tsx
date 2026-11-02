import type { Metadata } from "next";
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
  { icon: "▤", title: "АУДИТ", lines: ["Фінансова звітність", "Аудиторські завдання"] },
  { icon: "✎", title: "БУХГАЛТЕРСЬКИЙ ОБЛІК", lines: ["Супровід", "Відновлення обліку"] },
  { icon: "▣", title: "ПОДАТКИ", lines: ["Аналіз ризиків", "Податковий аналіз"] },
  { icon: "◎", title: "МСФЗ", lines: ["Консультації", "Підготовка звітностей"] },
];

const qualifications = [
  ["▧", "Акредитований кваліфікаційний центр"],
  ["◎", "Професійна організація"],
  ["✉", "Сертифіковані аудитори та фахівці"],
  ["♡", "Робота відповідно до професійних стандартів"],
];

function DiscussButton() {
  return <Link className="about-discuss" href="/#contacts"><span>Обговорити завдання</span><span className="about-arrow" aria-hidden="true">⟶</span></Link>;
}

export default function AboutPage() {
  return (
    <main className="about-page">
      <header className="about-header"><Link href="/" aria-label="На головну">АКЦ</Link><Link href="/" className="about-back">← ГОЛОВНА</Link></header>
      <section className="about-hero">
        <div className="about-hero-art" aria-hidden="true" />
        <div className="about-hero-copy">
          <p className="about-eyebrow">01 / Про Аудит Консалтинг Центр</p>
          <h1>АУДИТ КОНСАЛТИНГ<br />ЦЕНТР</h1>
          <p className="about-hero-description">Команда професіоналів АКЦ допоможе вашому бізнесу працювати впевнено та розвиватися. Ми супроводжуємо реєстрацію підприємств, ФОП, ведемо бухгалтерський, податковий і кадровий, військовий облік, проводимо аудит та допомагаємо виявляти фінансові й податкові ризики.</p>
          <DiscussButton />
        </div>
      </section>
      <section className="about-partner about-section">
        <h2>ПРОФЕСІЙНИЙ ПАРТНЕР<br />ДЛЯ РОЗВИТКУ БІЗНЕСУ.</h2>
        <div className="about-vertical-line" />
        <div className="about-partner-description"><p>Ми поєднуємо аудиторську практику, консалтингові рішення та освітні ініціативи, щоб допомагати компаніям вирішувати складні завдання, мінімізувати ризики та впевнено рухатись вперед.</p><p>Працюємо з бізнесом, комунальними та державними підприємствами у різних галузях, забезпечуємо індивідуальний підхід, практичні рішення та високі стандарти по всій території України.</p></div>
      </section>
      <section className="about-metrics about-section" aria-label="АКЦ у цифрах">{metrics.map(([number,label])=><div className="about-metric" key={label}><strong>{number}</strong><span>{label}</span></div>)}</section>
      <section className="about-services about-section" aria-label="Наші послуги">{services.map(item=><div className="about-service" key={item.title}><span className="about-service-icon" aria-hidden="true">{item.icon}</span><h3>{item.title}</h3><p>{item.lines[0]}<br />{item.lines[1]}</p></div>)}</section>
      <section className="about-qualification about-section"><h2>ПРОФЕСІЙНА<br />ЕКСПЕРТИЗА<br />ПІДТВЕРДЖЕННЯ<br />ОФІЦІЙНО.</h2><div className="about-vertical-line" /><div className="about-qualification-grid">{qualifications.map(([icon,label])=><div className="about-qualification-item" key={label}><span aria-hidden="true">{icon}</span><p>{label}</p></div>)}</div></section>
      <section className="about-contact about-section"><div className="about-contact-art" aria-hidden="true"/><div className="about-contact-content"><h2>ПОТРІБНА КОНСУЛЬТАЦІЯ<br />ЩОДО ВАШОГО БІЗНЕСУ?</h2><DiscussButton /></div></section>
    </main>
  );
}

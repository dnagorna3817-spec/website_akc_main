import "../about/about.css";
import "./contacts.css";

function SocialIcon({ kind }: { kind: "facebook" | "instagram" }) {
  return (
    <svg aria-hidden="true" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {kind === "facebook" ? <path fill="currentColor" stroke="none" d="M14.2 21v-7.9h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.7V3.7c-.3 0-1.3-.1-2.5-.1-2.6 0-4.3 1.6-4.3 4.5V10H8v3.1h2.7V21h3.5Z" /> : <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></>}
    </svg>
  );
}

function ContactIcon({ kind }: { kind: "map" | "phone" | "mail" | "clock" }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg aria-hidden="true" width="25" height="25" viewBox="0 0 24 24" {...common}>
      {kind === "map" && <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.7" /></>}
      {kind === "phone" && <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.7L7.1 10a16 16 0 0 0 6.9 6.9l1.6-1.9a2 2 0 0 1 1.7-.6l3 .5a2 2 0 0 1 1.7 2Z" />}
      {kind === "mail" && <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 6 10 7 10-7" /></>}
      {kind === "clock" && <><circle cx="12" cy="12" r="9" /><path d="M12 6v6l4 2" /></>}
    </svg>
  );
}

export default function ContactsPage() {
  return (
    <div className="akc-about-figma akc-contacts-page page">
      <header className="nav">
        <a className="nav__brand" href="/" aria-label="Аудит Консалтинг Центр — головна">
          <img className="nav__logo" src="/akc-brand-white.png" alt="" width="48" height="48" />
          <span>Аудит Консалтинг Центр</span>
        </a>
        <nav className="nav__links" aria-label="Основна навігація">
          <a href="/about">Про АКЦ</a>
          <a href="/insights">Новини</a>
          <a href="/expertise/qualification">Кваліфікаційний центр</a>
          <a href="/industries">Галузі</a>
          <a href="/expertise">Експертиза</a>
        </nav>
        <a className="nav__contact" href="/contacts" aria-current="page">Контакти <span aria-hidden="true">→</span></a>
      </header>
      <section className="akc-contact-section" id="contacts" aria-labelledby="akc-contact-title">
        <div className="akc-contact-section__glow" aria-hidden="true" />
        <div className="akc-contact-section__intro">
          <p className="akc-contact-section__eyebrow"><span /> КОНТАКТИ</p>
          <h2 id="akc-contact-title">Зв’яжіться з нами</h2>
          <p>Ми відкриті до співпраці та готові відповісти на ваші запитання.</p>
        </div>
        <div className="akc-contact-section__grid">
          <div className="akc-contact-section__column">
            <h3><span className="akc-contact-icon"><ContactIcon kind="map" /></span> Наша адреса</h3>
            <address>18000, м. Черкаси,<br />вул. Гоголя, 224</address>
            <div className="akc-contact-section__socials" aria-label="Соціальні мережі АКЦ">
              <a className="akc-contact-section__social" href="https://www.facebook.com/auditkonsaltingcentr/" target="_blank" rel="noopener noreferrer" aria-label="Facebook АКЦ — відкрити сторінку"><SocialIcon kind="facebook" /></a>
              <a className="akc-contact-section__social" href="https://www.instagram.com/audit_konsalting_centr/" target="_blank" rel="noopener noreferrer" aria-label="Instagram АКЦ — відкрити профіль"><SocialIcon kind="instagram" /></a>
            </div>
          </div>
          <div className="akc-contact-section__column">
            <h3><span className="akc-contact-icon"><ContactIcon kind="phone" /></span> Телефон</h3>
            <ul className="akc-contact-section__phones">
              {["068 165 80 33", "068 556 81 44", "068 760 09 55", "096 037 86 77", "096 400 95 40", "096 779 61 77", "097 215 33 30"].map((number) => (
                <li key={number}><a href={`tel:+38${number.replace(/\s/g, "")}`}>{number}</a></li>
              ))}
            </ul>
          </div>
          <div className="akc-contact-section__column">
            <h3><span className="akc-contact-icon"><ContactIcon kind="mail" /></span> Email</h3>
            <a href="mailto:akc@audit-centr.com.ua">akc@audit-centr.com.ua</a>
          </div>
          <div className="akc-contact-section__column">
            <h3><span className="akc-contact-icon"><ContactIcon kind="clock" /></span> Графік роботи</h3>
            <p>Пн. – Пт. 09:00 – 17:05</p>
            <p>Сб. – Нд. — вихідний</p>
          </div>
        </div>
      </section>
    </div>
  );
}

import "../about/about.css";

export default function ContactsPage() {
  return (
    <div className="akc-about-figma page">
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
      <section className="akc-contact-section" id="contacts" aria-labelledby="akc-contact-title" data-enter>
        <div className="akc-contact-section__glow" aria-hidden="true" />
        <div className="akc-contact-section__intro">
          <p className="akc-contact-section__eyebrow"><span /> КОНТАКТИ</p>
          <h2 id="akc-contact-title">Зв’яжіться з нами</h2>
          <p>Ми відкриті до співпраці та готові відповісти на ваші запитання.</p>
        </div>
        <div className="akc-contact-section__grid">
          <div className="akc-contact-section__column">
            <h3><span aria-hidden="true">⌖</span> Наша адреса</h3>
            <address>18000, м. Черкаси,<br />вул. Гоголя, 224</address>
          </div>
          <div className="akc-contact-section__column">
            <h3><span aria-hidden="true">↗</span> Телефон</h3>
            <ul className="akc-contact-section__phones">
              {["068 165 80 33", "068 556 81 44", "068 760 09 55", "096 037 86 77", "096 400 95 40", "096 779 61 77", "097 215 33 30"].map((number) => (
                <li key={number}><a href={`tel:+38${number.replace(/\s/g, "")}`}>{number}</a></li>
              ))}
            </ul>
          </div>
          <div className="akc-contact-section__column">
            <h3><span aria-hidden="true">✉</span> Email</h3>
            <a href="mailto:akc@audit-centr.com.ua">akc@audit-centr.com.ua</a>
          </div>
          <div className="akc-contact-section__column">
            <h3><span aria-hidden="true">◷</span> Графік роботи</h3>
            <p>Пн. – Пт. 09:00 – 17:05</p>
            <p>Сб. – Нд. — вихідний</p>
          </div>
        </div>
        <footer className="akc-contact-section__footer">© 2026 Аудит Консалтинг Центр. Всі права збережено.</footer>
      </section>
    </div>
  );
}

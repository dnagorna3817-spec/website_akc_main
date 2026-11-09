import Link from "next/link";
import "./SiteFooter.css";

const phones = ["068 165 80 33", "068 556 81 44", "068 760 09 55", "096 037 86 77", "096 400 95 40", "096 779 61 77", "097 215 33 30"];

export default function SiteFooter() {
  return (
    <footer className="akc-site-footer" aria-label="Контактна інформація АКЦ">
      <div className="akc-site-footer__inner">
        <div className="akc-site-footer__brand">
          <Link href="/" aria-label="Аудит Консалтинг Центр — головна">
            <img src="/akc-brand-white.png" alt="" width="58" height="58" />
            <span>Аудит<br />Консалтинг<br />Центр</span>
          </Link>
          <div className="akc-site-footer__socials">
            <a href="https://www.facebook.com/auditkonsaltingcentr/" target="_blank" rel="noopener noreferrer" aria-label="Facebook АКЦ">f</a>
            <a href="https://www.instagram.com/audit_konsalting_centr/" target="_blank" rel="noopener noreferrer" aria-label="Instagram АКЦ">◎</a>
          </div>
        </div>
        <div className="akc-site-footer__column">
          <h2>Наша адреса</h2>
          <address>18000, м. Черкаси,<br />вул. Гоголя, 224</address>
          <p>Пн. – Пт. 09:00 – 17:05<br />Сб. – Нд. — вихідний</p>
        </div>
        <div className="akc-site-footer__column">
          <h2>Телефон</h2>
          <ul>{phones.map((number) => <li key={number}><a href={`tel:+38${number.replace(/\s/g, "")}`}>+38 {number}</a></li>)}</ul>
        </div>
        <div className="akc-site-footer__column">
          <h2>Email</h2>
          <a href="mailto:akc@audit-centr.com.ua">akc@audit-centr.com.ua</a>
        </div>
      </div>
      <div className="akc-site-footer__bottom">© 2026 Аудит Консалтинг Центр. Всі права збережено.</div>
    </footer>
  );
}

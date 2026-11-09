import Link from "next/link";
import "./SiteFooter.css";

function SocialIcon({ kind }: { kind: "facebook" | "instagram" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {kind === "facebook"
        ? <path d="M14.2 21v-7.9h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.7V3.7c-.3 0-1.3-.1-2.5-.1-2.6 0-4.3 1.6-4.3 4.5V10H8v3.1h2.7V21h3.5Z" fill="currentColor" stroke="none" />
        : <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></>}
    </svg>
  );
}

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
            <a href="https://www.facebook.com/auditkonsaltingcentr/" target="_blank" rel="noopener noreferrer" aria-label="Facebook АКЦ"><SocialIcon kind="facebook" /></a>
            <a href="https://www.instagram.com/audit_konsalting_centr/" target="_blank" rel="noopener noreferrer" aria-label="Instagram АКЦ"><SocialIcon kind="instagram" /></a>
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

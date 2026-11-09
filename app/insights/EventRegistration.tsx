"use client";

import { useEffect, useState, type FormEvent } from "react";
import styles from "./EventRegistration.module.css";

export default function EventRegistration({ title, onClose }: { title: string; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [consent, setConsent] = useState(false);
  const [prepared, setPrepared] = useState(false);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", onKeyDown); };
  }, [onClose]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent) return;
    const subject = encodeURIComponent(`Заявка на захід: ${title}`);
    const body = encodeURIComponent(`Захід: ${title}\nПІБ: ${name}\nEmail: ${email}\nКомпанія: ${company || "Не вказано"}\nЗгода на обробку персональних даних: так`);
    window.location.href = `mailto:akc@audit-centr.com.ua?subject=${subject}&body=${body}`;
    setPrepared(true);
  }

  return (
    <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="registration-title">
        <button className={styles.close} onClick={onClose} type="button" aria-label="Закрити"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19"/></svg></button>
        <div className={styles.header}>
          <span className={styles.eyebrow}><span className={styles.eyebrowLine} /> АКЦ / ПЛАН ЗАХОДІВ</span>
          <h2 id="registration-title">Реєстрація<br/><span>на захід</span></h2>
          <div className={styles.eventBlock}><span className={styles.eventTag}>ОБРАНИЙ ЗАХІД</span><p className={styles.eventTitle}>{title}</p></div>
          <p className={styles.description}>Залиште свої контактні дані, щоб оформити заявку на участь.</p>
        </div>
        <form onSubmit={submit}>
          <label>Ім’я та прізвище<input autoFocus required maxLength={120} autoComplete="name" placeholder="Наприклад, Олена Коваленко" value={name} onChange={e => setName(e.target.value)} /></label>
          <label>Email<input required type="email" maxLength={200} autoComplete="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} /></label>
          <label>Компанія<input maxLength={160} autoComplete="organization" placeholder="Назва компанії" value={company} onChange={e => setCompany(e.target.value)} /></label>
          <label className={styles.consent}><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} required /><span>Я погоджуюсь на обробку персональних даних для розгляду заявки на участь у заході.</span></label>
          <button className={styles.submit} type="submit">Подати заявку</button>
        </form>
        {prepared ? <p className={styles.notice} role="status">Лист із заявкою підготовлено у вашій поштовій програмі. Для завершення реєстрації натисніть «Надіслати» в листі. Підтвердження надійде після опрацювання заявки.</p> : <p className={styles.note}>Відкриється ваша поштова програма. Заявка не надсилається автоматично.</p>}
      </section>
    </div>
  );
}

"use client";

import { useEffect, useState, type FormEvent } from "react";
import styles from "./EventRegistration.module.css";

export default function EventRegistration({ title, onClose, mode = "event" }: { title: string; onClose: () => void; mode?: "event" | "lead" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", onKeyDown); };
  }, [onClose]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent || status === "sending") return;
    setStatus("sending");
    setErrorMessage("");
    try {
      const response = await fetch("/api/send-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, eventTitle: title, consent, requestType: mode }),
      });
      const result: { ok?: boolean; message?: string } = await response.json().catch(() => ({}));
      if (!response.ok || result.ok !== true) {
        throw new Error(result.message || "Не вдалося надіслати заявку. Спробуйте ще раз.");
      }
      setStatus("success");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Не вдалося надіслати заявку. Спробуйте ще раз.");
      setStatus("error");
    }
  }

  return (
    <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="registration-title">
        <button className={styles.close} onClick={onClose} type="button" aria-label="Закрити"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19"/></svg></button>
        {status === "success" ? <div className={styles.success} role="status"><div className={styles.successIcon} aria-hidden="true">✓</div><span className={styles.eyebrow}>{mode === "event" ? "АКЦ / ПЛАН ЗАХОДІВ" : "АКЦ / ЗВОРОТНИЙ ЗВ’ЯЗОК"}</span><h2 id="registration-title">Заявку<br/><span>отримано</span></h2><p>{mode === "event" ? `Дякуємо за реєстрацію на захід «${title}».` : "Дякуємо за звернення до АКЦ."}</p><p>Заявку успішно передано організаторам. Ми зв’яжемося з вами найближчим часом.</p><button type="button" className={styles.submit} onClick={onClose}>Закрити</button></div> : <><div className={styles.header}>
          <span className={styles.eyebrow}><span className={styles.eyebrowLine} /> АКЦ / ПЛАН ЗАХОДІВ</span>
          <h2 id="registration-title">{mode === "event" ? <>Реєстрація<br/><span>на захід</span></> : <>Залишити<br/><span>заявку</span></>}</h2>
          <div className={styles.eventBlock}><span className={styles.eventTag}>{mode === "event" ? "ОБРАНИЙ ЗАХІД" : "ТЕМА ЗВЕРНЕННЯ"}</span><p className={styles.eventTitle}>{title}</p></div>
          <p className={styles.description}>{mode === "event" ? "Залиште свої контактні дані, щоб оформити заявку на участь." : "Залиште свої контакти, і наш фахівець зв’яжеться з вами."}</p>
        </div>
        <form onSubmit={submit}>
          <label>Ім’я та прізвище<input autoFocus required maxLength={120} autoComplete="name" placeholder="Наприклад, Олена Коваленко" value={name} onChange={e => setName(e.target.value)} /></label>
          <label>Email<input required type="email" maxLength={200} autoComplete="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} /></label>
          <label>Номер телефону<input required type="tel" inputMode="tel" maxLength={24} autoComplete="tel" placeholder="+380 XX XXX XX XX" value={phone} onChange={e => setPhone(e.target.value)} /></label>
          <label className={styles.consent}><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} required /><span>Я погоджуюсь на обробку персональних даних для опрацювання мого звернення.</span></label>
          <button className={styles.submit} type="submit" disabled={status === "sending"}>{status === "sending" ? "Надсилання..." : "Подати заявку"}</button>
        </form>
        {status === "error" && <p className={styles.notice} role="alert">{errorMessage}</p>}
        <p className={styles.note}>Після надсилання заявки організатори отримають повідомлення та зв’яжуться з вами.</p></>}
      </section>
    </div>
  );
}

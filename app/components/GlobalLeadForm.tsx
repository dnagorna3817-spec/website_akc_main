"use client";

import { useEffect, useState } from "react";
import EventRegistration from "../insights/EventRegistration";

/** Explicit CTA labels only: navigation, downloads, event signups and contact links keep their behavior. */
const CTA = /(?:обговорити (?:завдання|проєкт|проект|співпрацю)|отримати (?:консультацію|пропозицію)|замовити (?:консультацію|послугу|дзвінок)|залишити (?:заявку|запит)|подати заявку|надіслати заявку|зв'язатися з нами|зв’язатися з нами|зв'язатись з нами|зв’язатись з нами|записатися на консультацію|проконсультуватися|обговорити деталі)/i;

export default function GlobalLeadForm() {
  const [source, setSource] = useState<string | null>(null);
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const control = target.closest<HTMLAnchorElement | HTMLButtonElement>("a,button");
      if (!control || control.closest('[role="dialog"],[data-no-lead-form]')) return;
      if (control instanceof HTMLButtonElement && (control.type === "submit" || control.closest("form"))) return;
      if (control instanceof HTMLAnchorElement) {
        const href = control.getAttribute("href") || "";
        if (/^(mailto:|tel:|https?:|#)/i.test(href) || control.hasAttribute("download") || control.target === "_blank") return;
      }
      const label = (control.textContent || control.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim();
      if (!CTA.test(label) && !control.hasAttribute("data-lead-cta")) return;
      event.preventDefault();
      setSource(`${label.slice(0, 90) || "Заявка"} — ${window.location.pathname}`);
    }
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);
  return source ? <EventRegistration title={source} onClose={() => setSource(null)} mode="lead" /> : null;
}

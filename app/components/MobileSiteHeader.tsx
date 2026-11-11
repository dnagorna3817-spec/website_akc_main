"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const links = [
  ["/", "Головна"],
  ["/about", "Про АКЦ"],
  ["/insights", "Новини"],
  ["/expertise/qualification", "Кваліфікаційний центр"],
  ["/industries", "Галузі"],
  ["/expertise", "Експертиза"],
  ["/contacts", "Контакти"],
] as const;

export default function MobileSiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLElement>(null);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onOutside = (event: PointerEvent) => {
      if (root.current && !root.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onOutside);
    };
  }, [open]);

  return (
    <header className="akc-global-mobile-header" ref={root}>
      <Link href="/" className="akc-global-mobile-brand" onClick={() => setOpen(false)} aria-label="АКЦ — головна">
        <Image src="/akc-brand-white.png" width={40} height={40} alt="" priority />
        <span>Аудит Консалтинг<br />Центр</span>
      </Link>
      <button type="button" className="akc-global-mobile-toggle" aria-label={open ? "Закрити меню" : "Відкрити меню"} aria-controls="akc-global-mobile-nav" aria-expanded={open} onClick={() => setOpen(v => !v)}>
        <span className={open ? "is-open" : ""}><i /><i /><i /></span>
      </button>
      <nav id="akc-global-mobile-nav" className={"akc-global-mobile-nav" + (open ? " is-open" : "")} aria-label="Мобільна навігація" inert={!open}>
        {links.map(([href, label]) => (
          <Link key={href} href={href} className={pathname === href || (href !== "/" && href !== "/expertise" && pathname.startsWith(href + "/")) ? "is-current" : ""} aria-current={pathname === href ? "page" : undefined} onClick={() => setOpen(false)}>
            {label}<span aria-hidden="true">↗</span>
          </Link>
        ))}
      </nav>
    </header>
  );
}

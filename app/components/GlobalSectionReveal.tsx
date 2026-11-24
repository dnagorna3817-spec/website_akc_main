"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Matches the About page's 850ms upward reveal across the rest of the site.
 * Uses WAAPI so content stays visible when JavaScript is unavailable.
 */
export default function GlobalSectionReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/about" || pathname === "/" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const main = document.querySelector("main");
    if (!main) return;

    const candidates = Array.from(
      main.querySelectorAll<HTMLElement>("h1, h2, article, section, footer")
    ).filter((element) =>
      !element.closest("[data-enter], [data-expertise-art], [data-transition-header]") &&
      !element.matches("[data-expertise-art]") &&
      !element.closest("article")?.isSameNode(element.parentElement)
    );

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const element = entry.target as HTMLElement;
        element.animate(
          [{ opacity: 0, transform: "translateY(26px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 850, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "none" }
        );
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -25px 0px" });

    candidates.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}

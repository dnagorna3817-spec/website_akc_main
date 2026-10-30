"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import type { LiveScene } from "./live-scene";
import styles from "./transition.module.css";

type Phase = "home" | "transitioning" | "expertise" | "inactive";
type Request = { root: HTMLElement; freeze: () => () => void };
const Context = createContext<{ start: (request: Request) => void; prepare: () => void }>({ start: () => {}, prepare: () => {} });
export const useExpertiseTransition = () => useContext(Context);

export default function ExpertiseTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<LiveScene | null>(null);
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<Phase>("home");
  const busy = useRef(false);
  const outgoing = useRef<gsap.Context | null>(null);
  const resume = useRef<(() => void) | null>(null);
  const watchdog = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelOutgoing = useCallback(() => {
    outgoing.current?.revert(); outgoing.current = null;
    resume.current?.(); resume.current = null;
    if (watchdog.current) clearTimeout(watchdog.current);
    watchdog.current = null;
  }, []);

  useEffect(() => {
    let disposed = false;
    const fallback = () => {
      if (disposed) return;
      document.documentElement.dataset.akcWebgl = "unavailable";
      document.documentElement.dataset.akcSceneReady = "true";
      window.dispatchEvent(new Event("akc:scene-ready"));
    };
    // The root layout owns this browser-only instance, not either route.
    void import("./live-scene").then(({ LiveScene }) => {
      if (disposed || !canvas.current) return;
      try {
        scene.current = new LiveScene(canvas.current, fallback);
        document.documentElement.dataset.akcWebgl = "ready";
        document.documentElement.dataset.akcSceneReady = "true";
        setReady(true);
        window.dispatchEvent(new Event("akc:scene-ready"));
      } catch {
        fallback();
      }
    }).catch(fallback);
    return () => {
      disposed = true;
      scene.current?.dispose(); scene.current = null;
      delete document.documentElement.dataset.akcWebgl;
      delete document.documentElement.dataset.akcSceneReady;
    };
  }, []);

  const prepare = useCallback(() => router.prefetch("/expertise"), [router]);
  const start = useCallback((request: Request) => {
    if (busy.current) return;
    if (!scene.current || document.documentElement.dataset.akcWebgl !== "ready" || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push("/expertise");
      return;
    }
    busy.current = true;
    setPhase("transitioning");
    resume.current = request.freeze();
    outgoing.current = gsap.context(() => {
      gsap.to(request.root.querySelectorAll(".nav-list, .hero-bottom, .logo-glow"), {
        opacity: 0, duration: .2, ease: "power2.out",
        onComplete: () => router.push("/expertise", { scroll: false }),
      });
    }, request.root);
    watchdog.current = setTimeout(() => {
      busy.current = false;
      cancelOutgoing();
      setPhase("home");
    }, 8000);
  }, [router, cancelOutgoing]);

  useEffect(() => {
    const mode = pathname === "/" ? "home" : pathname === "/expertise" ? "expertise" : "inactive";
    let ctx: gsap.Context | undefined;
    const frame = requestAnimationFrame(() => {
      const animate = mode === "expertise" && busy.current && !matchMedia("(prefers-reduced-motion: reduce)").matches;
      cancelOutgoing();
      scene.current?.setMode(mode, animate, () => {
        busy.current = false;
        setPhase(mode);
      });
      if (!animate) { busy.current = false; setPhase(mode); }
      if (animate) {
        const content = document.querySelector("[data-expertise-content]");
        if (content) ctx = gsap.context(() => {
          gsap.fromTo(content, { autoAlpha: 0, y: 14 }, {
            autoAlpha: 1, y: 0, delay: .95, duration: .6, ease: "power2.out",
            onComplete: () => document.querySelector<HTMLElement>("[data-expertise-content] h1")?.focus({ preventScroll: true }),
          });
        });
      }
    });
    return () => { cancelAnimationFrame(frame); ctx?.revert(); };
  }, [pathname, ready, cancelOutgoing]);

  useEffect(() => {
    const cancel = () => {
      cancelOutgoing();
      busy.current = false;
      const mode = location.pathname === "/" ? "home" : location.pathname === "/expertise" ? "expertise" : "inactive";
      scene.current?.setMode(mode);
      setPhase(mode);
    };
    window.addEventListener("popstate", cancel);
    return () => { window.removeEventListener("popstate", cancel); cancelOutgoing(); };
  }, [cancelOutgoing]);

  return (
    <Context.Provider value={{ start, prepare }}>
      <div className={styles.root} data-scene-state={phase}>
        {children}
        <canvas ref={canvas} className={styles.canvas} aria-hidden="true" data-akc-canvas />
        <span role="status" className={styles.status}>{phase === "transitioning" ? "Відкриваємо напрями експертизи" : ""}</span>
      </div>
    </Context.Provider>
  );
}

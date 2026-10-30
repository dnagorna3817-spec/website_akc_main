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
    // Start the camera move before routing, just as the Claude prototype does.
    // Keep the same persistent WebGL scene throughout the Next.js navigation.
    scene.current.setMode("expertise", true, () => {
      busy.current = false;
      setPhase("expertise");
      const content = document.querySelector<HTMLElement>("[data-expertise-content]");
      if (content) {
        gsap.fromTo(content, { autoAlpha: 0, y: 14 }, {
          autoAlpha: 1, y: 0, duration: .6, ease: "power2.out",
          onComplete: () => content.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true }),
        });
      }
    });
    outgoing.current = gsap.context(() => {
      const timeline = gsap.timeline();
      timeline.to(request.root.querySelectorAll(".nav-list, .hero-bottom, .logo-glow"), {
        opacity: 0, duration: .38, ease: "power2.out",
      }, 0);
      // The destination mounts during the camera move, not before it starts.
      timeline.call(() => router.push("/expertise", { scroll: false }), [], .95);
    }, request.root);
    watchdog.current = setTimeout(() => {
      busy.current = false;
      cancelOutgoing();
      setPhase("home");
    }, 8000);
  }, [router, cancelOutgoing]);

  useEffect(() => {
    const mode = pathname === "/" ? "home" : pathname === "/expertise" ? "expertise" : "inactive";
    const frame = requestAnimationFrame(() => {
      // A click-driven transition already owns the GSAP camera timeline.
      // Route mounting must not restart it or reveal content prematurely.
      if (mode === "expertise" && busy.current) return;
      cancelOutgoing();
      scene.current?.setMode(mode, false, () => setPhase(mode));
      busy.current = false;
      setPhase(mode);
    });
    return () => { cancelAnimationFrame(frame); };
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

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
  const loadingScene = useRef<Promise<LiveScene | null> | null>(null);
  const [phase, setPhase] = useState<Phase>(pathname === "/" ? "home" : pathname === "/expertise" ? "expertise" : "inactive");
  const busy = useRef(false);
  const outgoing = useRef<gsap.Context | null>(null);
  const resume = useRef<(() => void) | null>(null);
  const watchdog = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelOutgoing = useCallback(() => {
    outgoing.current?.revert();
    outgoing.current = null;
    resume.current?.();
    resume.current = null;
    if (watchdog.current) clearTimeout(watchdog.current);
    watchdog.current = null;
  }, []);

  const ensureScene = useCallback(async () => {
    if (scene.current) return scene.current;
    if (loadingScene.current) return loadingScene.current;

    loadingScene.current = import("./live-scene")
      .then(({ LiveScene }) => {
        if (!canvas.current) return null;
        const fallback = () => {
          document.documentElement.dataset.akcWebgl = "unavailable";
          document.documentElement.dataset.akcSceneReady = "true";
          window.dispatchEvent(new Event("akc:scene-ready"));
        };
        try {
          const instance = new LiveScene(canvas.current, fallback);
          scene.current = instance;
          document.documentElement.dataset.akcWebgl = "ready";
          document.documentElement.dataset.akcSceneReady = "true";
          window.dispatchEvent(new Event("akc:scene-ready"));
          return instance;
        } catch {
          fallback();
          return null;
        }
      })
      .catch(() => {
        document.documentElement.dataset.akcWebgl = "unavailable";
        document.documentElement.dataset.akcSceneReady = "true";
        window.dispatchEvent(new Event("akc:scene-ready"));
        return null;
      })
      .finally(() => {
        loadingScene.current = null;
      });

    return loadingScene.current;
  }, []);

  const prepare = useCallback(() => router.prefetch("/expertise"), [router]);

  const start = useCallback((request: Request) => {
    if (busy.current) return;
    busy.current = true;
    setPhase("transitioning");
    resume.current = request.freeze();

    outgoing.current = gsap.context(() => {
      const timeline = gsap.timeline();
      timeline.to(request.root.querySelectorAll(".nav-list, .hero-bottom, .logo-intro-layer"), {
        opacity: 0,
        duration: 0.38,
        ease: "power2.out",
      }, 0);
      timeline.call(() => router.push("/expertise", { scroll: false }), [], 0.38);
    }, request.root);

    watchdog.current = setTimeout(() => {
      busy.current = false;
      cancelOutgoing();
      router.push("/expertise", { scroll: false });
    }, 3000);
  }, [router, cancelOutgoing]);

  useEffect(() => {
    let disposed = false;
    const mode: Phase = pathname === "/" ? "home" : pathname === "/expertise" ? "expertise" : "inactive";

    if (mode !== "expertise") {
      const frame = requestAnimationFrame(() => {
        cancelOutgoing();
        busy.current = false;
        setPhase(mode);
      });
      return () => cancelAnimationFrame(frame);
    }

    const content = document.querySelector<HTMLElement>("[data-expertise-content]");
    void ensureScene().then((instance) => {
      if (disposed) return;
      cancelOutgoing();
      busy.current = false;
      instance?.setMode("expertise", false);
      setPhase("expertise");
      if (content) {
        gsap.fromTo(content, { autoAlpha: 0, y: 14 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => content.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true }),
        });
      }
    });

    return () => {
      disposed = true;
    };
  }, [pathname, ensureScene, cancelOutgoing]);

  useEffect(() => () => {
    cancelOutgoing();
    scene.current?.dispose();
    scene.current = null;
    delete document.documentElement.dataset.akcWebgl;
    delete document.documentElement.dataset.akcSceneReady;
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

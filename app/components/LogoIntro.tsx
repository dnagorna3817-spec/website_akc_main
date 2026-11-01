"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SESSION_KEY = "akc-logo-intro-seen";
type IntroMode = "checking" | "playing" | "static";

function rememberIntro() {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // Storage can be unavailable in privacy modes. The visual fallback still works.
  }
}

function wasIntroSeen() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export default function LogoIntro() {
  const [mode, setMode] = useState<IntroMode>("checking");
  const [videoSource, setVideoSource] = useState<string | null>(null);
  const finished = useRef(false);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finish = useCallback((animateMenu: boolean) => {
    if (finished.current) return;
    finished.current = true;
    if (safetyTimer.current) clearTimeout(safetyTimer.current);
    rememberIntro();
    setMode("static");
    window.dispatchEvent(new CustomEvent("akc:intro-ready", {
      detail: { animateMenu },
    }));
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const skipIntro = reducedMotion || wasIntroSeen();
    const frame = requestAnimationFrame(() => {
      if (skipIntro) {
        finished.current = true;
        setMode("static");
        window.dispatchEvent(new CustomEvent("akc:intro-ready", {
          detail: { animateMenu: false },
        }));
        return;
      }

      setVideoSource(window.matchMedia("(max-width: 767px)").matches
        ? "/media/akc-intro/mobile.mp4"
        : "/media/akc-intro/desktop.mp4");
      setMode("playing");
      safetyTimer.current = setTimeout(() => finish(true), 6000);
    });
    return () => {
      cancelAnimationFrame(frame);
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
    };
  }, [finish]);

  return (
    <div className="logo-intro-layer" data-intro-mode={mode} role="img" aria-label="Металевий знак АКЦ">
      <picture className="logo-intro-poster">
        <source media="(max-width: 767px)" srcSet="/media/akc-intro/mobile-poster.png" />
        <img
          src="/media/akc-intro/desktop-poster.png"
          alt=""
          width={1920}
          height={1080}
          fetchPriority="high"
          draggable={false}
        />
      </picture>

      {mode === "playing" && videoSource && (
        <video
          className="logo-intro-video"
          src={videoSource}
          muted
          autoPlay
          playsInline
          preload="auto"
          aria-hidden="true"
          onEnded={() => finish(true)}
          onError={() => finish(true)}
        />
      )}
    </div>
  );
}

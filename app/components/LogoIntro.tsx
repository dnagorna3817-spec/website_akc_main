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
  const [videoReady, setVideoReady] = useState(false);
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
    const skipIntro = reducedMotion;
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
        ? "https://d2ol7oe51mr4n9.cloudfront.net/user_3LVD6Gemet7eA8hG9ab86TDoslj/79db2113-6d35-489f-8156-382666afd0d3.mp4"
        : "https://d2ol7oe51mr4n9.cloudfront.net/user_3LVD6Gemet7eA8hG9ab86TDoslj/e2cd2649-88b7-4782-b936-70055d6b5c1d.mp4");
      setMode("playing");
      safetyTimer.current = setTimeout(() => finish(true), 8000);
    });
    return () => {
      cancelAnimationFrame(frame);
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
    };
  }, [finish]);

  return (
    <div className="logo-intro-layer" data-intro-mode={mode} role="img" aria-label="Металевий знак АКЦ">
      <picture className="logo-intro-poster">
        <source media="(max-width: 767px)" srcSet="https://d2ol7oe51mr4n9.cloudfront.net/user_3LVD6Gemet7eA8hG9ab86TDoslj/56e9b386-1869-49ea-9167-84568b64e7a7.png" />
        <img
          src="https://d2ol7oe51mr4n9.cloudfront.net/user_3LVD6Gemet7eA8hG9ab86TDoslj/56e9b386-1869-49ea-9167-84568b64e7a7.png"
          alt=""
          width={1920}
          height={1080}
          fetchPriority="high"
          draggable={false}
        />
      </picture>

      {videoSource && (
        <video
          className="logo-intro-video"
          src={videoSource}
          muted
          autoPlay
          playsInline
          preload="auto"
          aria-hidden="true"
          onCanPlay={(event) => {
            setVideoReady(true);
            const video = event.currentTarget;
            if (mode === "playing" && video.paused && !video.ended) video.play().catch(() => finish(false));
          }}
          onEnded={() => finish(true)}
          onError={() => { setVideoReady(false); setVideoSource(null); finish(false); }}
        />
      )}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type IntroMode = "checking" | "playing" | "static";
const MOBILE_VIDEO = "https://d2ol7oe51mr4n9.cloudfront.net/user_3LVD6Gemet7eA8hG9ab86TDoslj/79db2113-6d35-489f-8156-382666afd0d3.mp4";
const DESKTOP_VIDEO = "https://d2ol7oe51mr4n9.cloudfront.net/user_3LVD6Gemet7eA8hG9ab86TDoslj/e2cd2649-88b7-4782-b936-70055d6b5c1d.mp4";

export default function LogoIntro() {
  const [mode, setMode] = useState<IntroMode>("checking");
  const [videoError, setVideoError] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const finished = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finish = useCallback((animateMenu: boolean) => {
    if (finished.current) return;
    finished.current = true;
    if (safetyTimer.current) clearTimeout(safetyTimer.current);
    setMode("static");
    window.dispatchEvent(new CustomEvent("akc:intro-ready", {
      detail: { animateMenu },
    }));
  }, []);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const updateVideo = () => setVideoSrc(mobileQuery.matches ? MOBILE_VIDEO : DESKTOP_VIDEO);
    updateVideo();
    mobileQuery.addEventListener("change", updateVideo);
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


      setMode("playing");
      safetyTimer.current = setTimeout(() => finish(true), 8000);
    });
    return () => {
      mobileQuery.removeEventListener("change", updateVideo);
      cancelAnimationFrame(frame);
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
    };
  }, [finish]);

  const replay = () => {
    const video = videoRef.current;
    if (!video) return;
    finished.current = false;
    setMode("playing");
    video.pause();
    video.currentTime = 0;
    video.play().catch(() => finish(false));
  };

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

      {!videoError && videoSrc && (
        <video
          key={videoSrc}
          ref={videoRef}
          src={videoSrc}
          className="logo-intro-video"
          muted
          autoPlay
          playsInline
          preload="auto"
          aria-hidden="true"
          onLoadedMetadata={(event) => { event.currentTarget.currentTime = 0; }}
          onCanPlay={(event) => {
            const video = event.currentTarget;
            if (mode === "playing" && video.paused && !video.ended) video.play().catch(() => finish(false));
          }}
          onEnded={() => finish(true)}
          onError={() => { setVideoError(true); finish(false); }}
        />
      )}
      {!videoError && videoSrc && <button type="button" className="akc-intro-replay" onClick={replay} aria-label="Повторити анімацію логотипа">↻ <span>Повторити анімацію</span></button>}
    </div>
  );
}

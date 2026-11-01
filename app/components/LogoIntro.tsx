"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DESKTOP_VIDEO = "https://d2ol7oe51mr4n9.cloudfront.net/user_3LVD6Gemet7eA8hG9ab86TDoslj/e2cd2649-88b7-4782-b936-70055d6b5c1d.mp4";
const MOBILE_LOGO_IMAGE = "https://d2ol7oe51mr4n9.cloudfront.net/user_3LVD6Gemet7eA8hG9ab86TDoslj/99e60122-094c-44fd-8aaf-3c97990035d3.png";

export default function LogoIntro() {
  const desktopRef = useRef<HTMLVideoElement>(null);
  const finished = useRef(false);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(true);
  const [mobileReplayKey, setMobileReplayKey] = useState(0);

  const finish = useCallback((animateMenu: boolean) => {
    if (finished.current) return;
    finished.current = true;
    setPlaying(false);
    window.dispatchEvent(new CustomEvent("akc:intro-ready", { detail: { animateMenu } }));
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    const timer = window.setTimeout(() => finish(false), 8500);
    return () => {
      window.clearTimeout(timer);
      media.removeEventListener("change", update);
    };
  }, [finish]);

  useEffect(() => {
    if (isMobile !== false) return;
    const video = desktopRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => finish(false));
  }, [isMobile, finish]);

  const replay = () => {
    finished.current = false;
    setPlaying(true);
    if (isMobile) {
      setMobileReplayKey((key) => key + 1);
      return;
    }
    const video = desktopRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    video.play().catch(() => finish(false));
  };

  return (
    <div className="logo-intro-layer" data-intro-mode={playing ? "playing" : "static"} aria-label="Анімований логотип АКЦ">
      <div className="akc-mobile-still" aria-hidden="true">
        <img
          key={mobileReplayKey}
          className={playing ? "akc-mobile-logo-animate" : "akc-mobile-logo-static"}
          src={MOBILE_LOGO_IMAGE}
          alt=""
          onAnimationEnd={() => finish(true)}
        />
      </div>
      <video
        ref={desktopRef}
        className="logo-intro-video logo-intro-video--desktop"
        src={DESKTOP_VIDEO}
        muted
        autoPlay
        playsInline
        preload="auto"
        onEnded={() => finish(true)}
        aria-hidden="true"
      />
      <button type="button" className="akc-intro-replay" onClick={replay} aria-label="Повторити анімацію логотипа">
        ↻ <span>Повторити анімацію</span>
      </button>
    </div>
  );
}

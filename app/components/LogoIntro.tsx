"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DESKTOP_VIDEO = "https://d2ol7oe51mr4n9.cloudfront.net/user_3LVD6Gemet7eA8hG9ab86TDoslj/e2cd2649-88b7-4782-b936-70055d6b5c1d.mp4";
const MOBILE_VIDEO = "https://d8j0ntlcm91z4.cloudfront.net/user_3LVD6Gemet7eA8hG9ab86TDoslj/hf_20261101_181035_39aca5a7-7e89-425b-89a0-cd6337ced634.mp4";

export default function LogoIntro() {
  const desktopRef = useRef<HTMLVideoElement>(null);
  const mobileRef = useRef<HTMLVideoElement>(null);
  const finished = useRef(false);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(true);

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
    if (isMobile === null) return;
    const video = isMobile ? mobileRef.current : desktopRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => finish(false));
  }, [isMobile, finish]);

  const replay = () => {
    finished.current = false;
    setPlaying(true);
    const video = isMobile ? mobileRef.current : desktopRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    video.play().catch(() => finish(false));
  };

  return (
    <div className="logo-intro-layer" data-intro-mode={playing ? "playing" : "static"} aria-label="Анімований логотип АКЦ">
      <video
        ref={mobileRef}
        className="logo-intro-video logo-intro-video--mobile"
        src={MOBILE_VIDEO}
        muted
        autoPlay
        playsInline
        preload="auto"
        onEnded={() => finish(true)}
        onError={() => finish(false)}
        aria-hidden="true"
      />
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

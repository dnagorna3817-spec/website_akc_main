"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DESKTOP_VIDEO = "/media/desktop.mp4";
const MOBILE_VIDEO = "/media/mobile.mp4";

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


  return (
    <div className="logo-intro-layer" data-intro-mode={playing ? "playing" : "static"} aria-label="Анімований логотип АКЦ">
      {isMobile === true && (
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
      )}
      {isMobile === false && (
        <video
          ref={desktopRef}
          className="logo-intro-video logo-intro-video--desktop"
          src={DESKTOP_VIDEO}
          muted
          autoPlay
          playsInline
          preload="auto"
          onEnded={() => finish(true)}
          onError={() => finish(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

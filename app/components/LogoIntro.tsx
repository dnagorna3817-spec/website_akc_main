"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const DESKTOP_VIDEO = "/media/desktop.mp4";
const MOBILE_VIDEO = "/media/mobile.mp4";
const DESKTOP_POSTER = "/media/akc-intro/desktop-poster.png";
const MOBILE_POSTER = "/media/akc-intro/mobile-poster.png";

export default function LogoIntro() {
  const desktopRef = useRef<HTMLVideoElement>(null);
  const mobileRef = useRef<HTMLVideoElement>(null);
  const finished = useRef(false);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [crossfading, setCrossfading] = useState(false);

  const finish = useCallback((animateMenu: boolean) => {
    if (finished.current) return;
    finished.current = true;
    setPlaying(false);
    window.dispatchEvent(new CustomEvent("akc:intro-ready", { detail: { animateMenu } }));
  }, []);

  const failPlayback = useCallback((video?: HTMLVideoElement | null) => {
    if (finished.current) return;
    video?.pause();
    finish(false);
  }, [finish]);

  const completePlayback = useCallback(() => {
    setCrossfading(true);
    finish(true);
  }, [finish]);

  useEffect(() => {
    if (!crossfading) return;
    const timer = window.setTimeout(() => setCrossfading(false), 850);
    return () => window.clearTimeout(timer);
  }, [crossfading]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setIsMobile(media.matches);
      setReducedMotion(motion.matches);
    };

    update();
    media.addEventListener("change", update);
    motion.addEventListener("change", update);

    const timer = window.setTimeout(() => {
      if (finished.current) return;
      finish(false);
    }, 8500);

    return () => {
      window.clearTimeout(timer);
      media.removeEventListener("change", update);
      motion.removeEventListener("change", update);
    };
  }, [finish]);

  useEffect(() => {
    if (isMobile === null) return;
    if (reducedMotion) {
      finish(false);
      return;
    }

    const video = isMobile ? mobileRef.current : desktopRef.current;
    if (!video) return;

    // Set iOS autoplay requirements before requesting playback.
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.autoplay = true;
    try {
      void video.play().catch(() => failPlayback(video));
    } catch {
      failPlayback(video);
    }
  }, [isMobile, reducedMotion, failPlayback, finish]);

  return (
    <div
      className="logo-intro-layer"
      data-intro-mode={crossfading ? "crossfading" : playing && !reducedMotion ? "playing" : "static"}
      aria-label="Анімований логотип АКЦ"
    >
      {isMobile !== null && (
        <div className="logo-intro-poster" aria-hidden="true">
          <Image
            className={isMobile ? "logo-intro-poster--mobile" : "logo-intro-poster--desktop"}
            src={isMobile ? MOBILE_POSTER : DESKTOP_POSTER}
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, 960px"
            priority
          />
        </div>
      )}
      {!reducedMotion && (playing || crossfading) && isMobile === true && (
        <video
          ref={mobileRef}
          className="logo-intro-video logo-intro-video--mobile"
          src={MOBILE_VIDEO}
          muted
          autoPlay
          playsInline
          controls={false}
          preload="auto"
          onEnded={completePlayback}
          onError={(event) => failPlayback(event.currentTarget)}
          aria-hidden="true"
        />
      )}
      {!reducedMotion && (playing || crossfading) && isMobile === false && (
        <video
          ref={desktopRef}
          className="logo-intro-video logo-intro-video--desktop"
          src={DESKTOP_VIDEO}
          muted
          autoPlay
          playsInline
          controls={false}
          preload="auto"
          onEnded={completePlayback}
          onError={(event) => failPlayback(event.currentTarget)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

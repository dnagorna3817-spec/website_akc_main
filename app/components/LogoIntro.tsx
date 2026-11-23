"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const DESKTOP_VIDEO = "/media/desktop.mp4";
const MOBILE_VIDEO = "/media/mobile.mp4";
const DESKTOP_POSTER = "/media/akc-intro/desktop-poster.png";
const MOBILE_POSTER = "/media/akc-intro/mobile-poster.png";
const INTRO_DIAGNOSTIC_PARAM = "akcIntroDebug";

function logIntroDiagnostic(
  event: string,
  video?: HTMLVideoElement | null,
  details: Record<string, unknown> = {},
) {
  if (
    typeof window === "undefined" ||
    new URLSearchParams(window.location.search).get(INTRO_DIAGNOSTIC_PARAM) !== "1"
  ) return;

  let videoPath: string | null = null;
  const source = video?.currentSrc || video?.getAttribute("src");
  if (source) {
    try {
      videoPath = new URL(source, window.location.href).pathname;
    } catch {
      videoPath = source.split("?")[0];
    }
  }

  console.info("[AKC Intro diagnostic]", event, {
    videoPath,
    mediaErrorCode: video?.error?.code ?? null,
    mediaErrorMessage: video?.error?.message ?? null,
    readyState: video?.readyState ?? null,
    networkState: video?.networkState ?? null,
    currentTime: video ? Number(video.currentTime.toFixed(3)) : null,
    ...details,
  });
}

function describePlayError(error: unknown) {
  if (typeof error === "object" && error !== null) {
    const value = error as { name?: unknown; message?: unknown };
    return {
      ...(value.name === undefined ? {} : { errorName: String(value.name) }),
      errorMessage: value.message === undefined ? String(error) : String(value.message),
    };
  }
  return { errorMessage: String(error) };
}

function getPlayErrorName(error: unknown) {
  if (typeof error !== "object" || error === null || !("name" in error)) return "";
  return String(error.name);
}

export default function LogoIntro() {
  const desktopRef = useRef<HTMLVideoElement>(null);
  const mobileRef = useRef<HTMLVideoElement>(null);
  const finishState = useRef<"pending" | "fallback" | "success">("pending");
  const awaitingManualPlay = useRef(false);
  const manualPlaybackSucceeded = useRef(false);
  const manualPlayPending = useRef(false);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [crossfading, setCrossfading] = useState(false);
  const [retainMobileVideo, setRetainMobileVideo] = useState(false);
  const [showMobilePlayPrompt, setShowMobilePlayPrompt] = useState(false);
  const [manualPlayError, setManualPlayError] = useState<string | null>(null);
  const [manualPlaybackStarted, setManualPlaybackStarted] = useState(false);

  const finish = useCallback((animateMenu: boolean, allowFallbackPromotion = false) => {
    if (animateMenu) {
      if (finishState.current === "success" || (finishState.current === "fallback" && !allowFallbackPromotion)) return;
      finishState.current = "success";
    } else {
      if (finishState.current !== "pending") return;
      finishState.current = "fallback";
    }
    setPlaying(false);
    window.dispatchEvent(new CustomEvent("akc:intro-ready", { detail: { animateMenu } }));
  }, []);

  const failPlayback = useCallback((
    video: HTMLVideoElement | null | undefined,
    reason: "autoplay-rejection" | "media-error" | "play-exception",
    error?: unknown,
  ) => {
    if (finishState.current !== "pending") return;
    logIntroDiagnostic("poster-fallback", video, {
      reason,
      ...(error === undefined ? {} : describePlayError(error)),
    });
    video?.pause();
    finish(false);
  }, [finish]);

  const completePlayback = useCallback((video?: HTMLVideoElement | null) => {
    logIntroDiagnostic("video-ended", video, { duration: video?.duration ?? null });
    setCrossfading(true);
    finish(true, manualPlaybackSucceeded.current);
  }, [finish]);

  useEffect(() => {
    if (!crossfading) return;
    const timer = window.setTimeout(() => {
      setCrossfading(false);
      setRetainMobileVideo(false);
      setManualPlaybackStarted(false);
      manualPlaybackSucceeded.current = false;
    }, 850);
    return () => window.clearTimeout(timer);
  }, [crossfading]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get(INTRO_DIAGNOSTIC_PARAM) !== "1") return;

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.removedNodes) {
          if (!(node instanceof Element)) continue;
          const videos = node.matches("video") ? [node] : Array.from(node.querySelectorAll("video"));
          for (const removedVideo of videos) {
            logIntroDiagnostic("video-removed-from-dom", removedVideo as HTMLVideoElement, {
              isConnected: removedVideo.isConnected,
            });
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setIsMobile(media.matches);
      setReducedMotion(motion.matches);
      logIntroDiagnostic("device-preferences", null, {
        isMobile: media.matches,
        prefersReducedMotion: motion.matches,
        userAgent: navigator.userAgent,
        visibilityState: document.visibilityState,
      });
    };

    update();
    media.addEventListener("change", update);
    motion.addEventListener("change", update);

    const timer = window.setTimeout(() => {
      if (finishState.current !== "pending" || awaitingManualPlay.current) return;
      logIntroDiagnostic("poster-fallback", mobileRef.current ?? desktopRef.current, {
        reason: "timeout",
        timeoutMs: 8500,
      });
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
      awaitingManualPlay.current = false;
      logIntroDiagnostic("poster-fallback", null, { reason: "prefers-reduced-motion" });
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
    logIntroDiagnostic("play-request", video, {
      muted: video.muted,
      defaultMuted: video.defaultMuted,
      playsInline: video.playsInline,
      autoplay: video.autoplay,
    });
    try {
      void video.play().then(
        () => logIntroDiagnostic("play-resolved", video),
        (error: unknown) => {
          if (isMobile && getPlayErrorName(error) === "NotAllowedError") {
            if (finishState.current !== "pending") return;
            awaitingManualPlay.current = true;
            setRetainMobileVideo(true);
            setShowMobilePlayPrompt(true);
            setManualPlayError(null);
            logIntroDiagnostic("poster-fallback", video, {
              reason: "autoplay-rejection",
              ...describePlayError(error),
              manualPlaybackAvailable: true,
            });
            finish(false);
            return;
          }
          failPlayback(video, "autoplay-rejection", error);
        },
      );
    } catch (error) {
      failPlayback(video, "play-exception", error);
    }
  }, [isMobile, reducedMotion, failPlayback, finish]);

  const playMobileVideoFromClick = useCallback(() => {
    const video = mobileRef.current;
    if (!video) {
      setManualPlayError("Відео недоступне. Спробуйте оновити сторінку.");
      return;
    }

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    if (manualPlayPending.current) return;

    let playPromise: Promise<void>;
    try {
      manualPlayPending.current = true;
      playPromise = video.play();
    } catch (error) {
      manualPlayPending.current = false;
      video.pause();
      awaitingManualPlay.current = true;
      setManualPlayError("Не вдалося запустити інтро. Спробуйте ще раз.");
      setManualPlaybackStarted(false);
      logIntroDiagnostic("manual-play-rejected", video, describePlayError(error));
      return;
    }

    setManualPlayError(null);
    logIntroDiagnostic("manual-play-request", video, {
      muted: video.muted,
      defaultMuted: video.defaultMuted,
      playsInline: video.playsInline,
    });
    void playPromise.then(
      () => {
        manualPlayPending.current = false;
        awaitingManualPlay.current = false;
        manualPlaybackSucceeded.current = true;
        setShowMobilePlayPrompt(false);
        setManualPlaybackStarted(true);
        logIntroDiagnostic("manual-play-resolved", video);
      },
      (error: unknown) => {
        manualPlayPending.current = false;
        video.pause();
        awaitingManualPlay.current = true;
        setShowMobilePlayPrompt(true);
        setManualPlaybackStarted(false);
        setManualPlayError("Не вдалося запустити інтро. Спробуйте ще раз.");
        logIntroDiagnostic("manual-play-rejected", video, describePlayError(error));
      },
    );
  }, []);

  const introMode = showMobilePlayPrompt && isMobile === true
    ? "manual-prompt"
    : crossfading
      ? "crossfading"
      : manualPlaybackStarted
        ? "manual-playing"
        : playing && !reducedMotion
          ? "playing"
          : "static";

  return (
    <div
      className="logo-intro-layer"
      data-intro-mode={introMode}
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
      {!reducedMotion && (playing || crossfading || (isMobile === true && retainMobileVideo)) && isMobile === true && (
        <video
          ref={mobileRef}
          className="logo-intro-video logo-intro-video--mobile"
          src={MOBILE_VIDEO}
          muted
          autoPlay
          playsInline
          controls={false}
          preload="auto"
          onLoadedMetadata={(event) => logIntroDiagnostic("loadedmetadata", event.currentTarget, { duration: event.currentTarget.duration })}
          onCanPlay={(event) => logIntroDiagnostic("canplay", event.currentTarget)}
          onPlaying={(event) => logIntroDiagnostic("playing", event.currentTarget)}
          onStalled={(event) => logIntroDiagnostic("stalled", event.currentTarget)}
          onWaiting={(event) => logIntroDiagnostic("waiting", event.currentTarget)}
          onEnded={(event) => completePlayback(event.currentTarget)}
          onError={(event) => {
            logIntroDiagnostic("error", event.currentTarget);
            if (retainMobileVideo) {
              event.currentTarget.pause();
              awaitingManualPlay.current = true;
              manualPlaybackSucceeded.current = false;
              setManualPlaybackStarted(false);
              setShowMobilePlayPrompt(true);
              setManualPlayError("Не вдалося відтворити інтро. Спробуйте ще раз.");
              return;
            }
            failPlayback(event.currentTarget, "media-error");
          }}
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
          onLoadedMetadata={(event) => logIntroDiagnostic("loadedmetadata", event.currentTarget, { duration: event.currentTarget.duration })}
          onCanPlay={(event) => logIntroDiagnostic("canplay", event.currentTarget)}
          onPlaying={(event) => logIntroDiagnostic("playing", event.currentTarget)}
          onStalled={(event) => logIntroDiagnostic("stalled", event.currentTarget)}
          onWaiting={(event) => logIntroDiagnostic("waiting", event.currentTarget)}
          onEnded={(event) => completePlayback(event.currentTarget)}
          onError={(event) => {
            logIntroDiagnostic("error", event.currentTarget);
            failPlayback(event.currentTarget, "media-error");
          }}
          aria-hidden="true"
        />
      )}
      {!reducedMotion && isMobile === true && showMobilePlayPrompt && (
        <div className="logo-intro-play-control">
          <button
            className="logo-intro-play-button"
            type="button"
            aria-label="Відтворити інтро"
            onClick={playMobileVideoFromClick}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
              <path d="M6 3.8a.8.8 0 0 1 1.2-.7l10 6.2a.8.8 0 0 1 0 1.4l-10 6.2a.8.8 0 0 1-1.2-.7z" fill="currentColor" />
            </svg>
            <span>Відтворити інтро</span>
          </button>
          {manualPlayError && <p className="logo-intro-play-error" role="status" aria-live="polite">{manualPlayError}</p>}
        </div>
      )}
    </div>
  );
}

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
            logIntroDiagnostic("autoplay-waiting-for-user-gesture", video, {
              reason: "autoplay-rejection",
              ...describePlayError(error),
            });
            return;
          }
          failPlayback(video, "autoplay-rejection", error);
        },
      );
    } catch (error) {
      failPlayback(video, "play-exception", error);
    }
  }, [isMobile, reducedMotion, failPlayback, finish]);

  // iOS Safari may reject autoplay even for muted inline video.
  // Keep the poster visible and start the film on the first natural page touch,
  // without adding a visible play button over the triangle.
  useEffect(() => {
    if (!isMobile || !awaitingManualPlay.current || reducedMotion) return;

    const startFromGesture = () => {
      const video = mobileRef.current;
      if (!video || !awaitingManualPlay.current || manualPlayPending.current) return;

      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      try {
        manualPlayPending.current = true;
        const promise = video.play();
        logIntroDiagnostic("page-gesture-play-request", video);
        void promise.then(
          () => {
            manualPlayPending.current = false;
            awaitingManualPlay.current = false;
            manualPlaybackSucceeded.current = true;
            setManualPlaybackStarted(true);
            logIntroDiagnostic("page-gesture-play-resolved", video);
          },
          (error: unknown) => {
            manualPlayPending.current = false;
            video.pause();
            awaitingManualPlay.current = true;
            setManualPlaybackStarted(false);
            logIntroDiagnostic("page-gesture-play-rejected", video, describePlayError(error));
          },
        );
      } catch (error) {
        manualPlayPending.current = false;
        awaitingManualPlay.current = true;
        logIntroDiagnostic("page-gesture-play-exception", video, describePlayError(error));
      }
    };

    document.addEventListener("touchstart", startFromGesture, { passive: true });
    document.addEventListener("pointerdown", startFromGesture, { passive: true });
    return () => {
      document.removeEventListener("touchstart", startFromGesture);
      document.removeEventListener("pointerdown", startFromGesture);
    };
  }, [isMobile, reducedMotion, retainMobileVideo]);

  const introMode = awaitingManualPlay.current && isMobile === true
    ? "tap-to-play"
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
      {/* Mount the mobile video before matchMedia resolves so Safari can
          begin fetching it during hydration instead of waiting for the effect. */}
      {!reducedMotion && (playing || crossfading || (isMobile !== false && retainMobileVideo)) && isMobile !== false && (
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

    </div>
  );
}

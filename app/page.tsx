
"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { useExpertiseTransition } from "./components/ExpertiseTransition";

const directions = [
  { id: "about", label: "ПРО АКЦ", href: "#about", x: 50, y: 8, lineX: 50, lineY: 19, angle: -90, length: "clamp(46px, 5vw, 72px)" },
  { id: "expertise", label: "ЕКСПЕРТИЗА", href: "/expertise", x: 11, y: 27, lineX: 25, lineY: 36, angle: -160, length: "clamp(78px, 9vw, 130px)" },
  { id: "qualification", label: "КВАЛІФІКАЦІЙНИЙ ЦЕНТР", href: "#qualification", x: 87, y: 27, lineX: 75, lineY: 36, angle: -20, length: "clamp(78px, 9vw, 130px)", wide: true },
  { id: "industries", label: "ГАЛУЗІ", href: "#industries", x: 11, y: 78, lineX: 25, lineY: 64, angle: 160, length: "clamp(78px, 9vw, 130px)" },
  { id: "insights", label: "INSIGHTS", href: "#insights", x: 89, y: 78, lineX: 75, lineY: 64, angle: 20, length: "clamp(78px, 9vw, 130px)" },
];

export default function Home() {
  const scene = useRef<HTMLElement>(null);
  const hero = useRef<HTMLElement>(null);
  const sceneFrame = useRef<HTMLDivElement>(null);
  const network = useRef<HTMLDivElement>(null);
  const heroBottom = useRef<HTMLDivElement>(null);
  const intro = useRef<gsap.core.Timeline | null>(null);
  const transitioning = useRef(false);
  const expertiseTransition = useExpertiseTransition();

  useEffect(() => {
    const frame = sceneFrame.current;
    const heroElement = hero.current;
    const networkElement = network.current;
    const bottom = heroBottom.current;
    if (!frame || !heroElement || !networkElement || !bottom) return;

    let frameId = 0;
    const updateScale = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        const sceneTop = isMobile
          ? Math.min(24, Math.max(16, window.innerWidth * 0.04))
          : 0;
        const horizontalSpace = Math.max(0, heroElement.clientWidth - (isMobile ? 28 : 48));
        const verticalSpace = Math.max(0, heroElement.clientHeight - bottom.offsetHeight - sceneTop);
        const naturalWidth = networkElement.offsetWidth;
        const naturalHeight = networkElement.offsetHeight;
        const scale = Math.min(1, horizontalSpace / naturalWidth, verticalSpace / naturalHeight);

        frame.style.setProperty("--scene-scale", Math.max(0, scale).toFixed(3));
        frame.style.setProperty("--scene-top", `${Math.round(sceneTop)}px`);
        frame.style.setProperty("--scene-height", `${Math.round(naturalHeight * scale + sceneTop)}px`);
      });
    };
    const observer = new ResizeObserver(updateScale);

    observer.observe(heroElement);
    observer.observe(networkElement);
    observer.observe(bottom);
    window.visualViewport?.addEventListener("resize", updateScale);
    window.addEventListener("load", updateScale);
    document.fonts?.ready.then(updateScale);
    updateScale();

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.visualViewport?.removeEventListener("resize", updateScale);
      window.removeEventListener("load", updateScale);
    };
  }, []);

  useLayoutEffect(() => {
    const root = scene.current;
    if (!root) return;

    const motion = gsap.matchMedia();
    motion.add("(prefers-reduced-motion: no-preference)", () => {
      let removeImageListeners = () => {};

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
        intro.current = tl;

        tl.from(".brand", { opacity: 0, y: -12, duration: 0.8 })
          .from(".logo-stage", {
            opacity: 0,
            scale: 0.86,
            duration: 1.15,
          }, 0.25)
          .set(".logo-light-pulse", {
            autoAlpha: 0,
            backgroundPosition: "110% 0%",
          })
          .to(".logo-light-pulse", {
            autoAlpha: 0.78,
            backgroundPosition: "-110% 0%",
            duration: 1.15,
            ease: "power2.inOut",
          })
          .to(".logo-light-pulse", {
            autoAlpha: 0,
            duration: 0.35,
            ease: "power1.out",
          })
          .from(".nav-line", {
            scaleX: 0,
            opacity: 0,
            duration: 0.65,
            stagger: 0.12,
            transformOrigin: "left center",
          })
          .from(".nav-dot", {
            scale: 0,
            opacity: 0,
            duration: 0.35,
            stagger: 0.1,
          })
          .from(".nav-label", {
            opacity: 0,
            y: 10,
            duration: 0.6,
            stagger: 0.1,
          })
          .from(".hero-bottom", {
            opacity: 0,
            y: 15,
            duration: 0.7,
          }, "-=0.25");

        // Wait for the shared WebGL scene (or its accessible fallback) before revealing.
        const startReveal = () => { if (!transitioning.current) tl.play(0); };
        if (document.documentElement.dataset.akcSceneReady === "true") {
          startReveal();
        } else {
          window.addEventListener("akc:scene-ready", startReveal, { once: true });
          removeImageListeners = () => {
            window.removeEventListener("akc:scene-ready", startReveal);
          };
        }

        gsap.to(".logo-glow-core", {
          opacity: 0.56,
          scale: 1.025,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

      }, root);

      return () => {
        removeImageListeners();
        ctx.revert();
        intro.current = null;
      };
    }, root);

    // Revert to the CSS final state when reduced motion is enabled, including mid-reveal.
    return () => motion.revert();
  }, []);

  return (
    <main className="akc-page" ref={scene}>
      <header className="brand">
        <a className="brand-symbol" href="#home" aria-label="АКЦ">
          △
        </a>
        <span>Аудит Консалтинг Центр</span>
        <button className="menu-button" type="button" aria-label="Відкрити меню">
          <span />
          <span />
          <span />
        </button>
      </header>

      <section className="hero" id="home" ref={hero}>
        <div className="network-frame" ref={sceneFrame}>
          <div className="network-scale">
            <div className="network" ref={network} aria-label="Напрями Аудит Консалтинг Центру">
            <div className="logo-glow" aria-hidden="true">
              <div className="logo-glow-motion">
                <div className="logo-glow-core" />
              </div>
            </div>

            <div className="nav-list">
              {directions.map((item) => (
                <div
                  key={item.label}
                  className={`nav-node nav-node--${item.id}`}
                >
                  <span
                    className="nav-line"
                    style={{
                      left: `${item.lineX}%`,
                      top: `${item.lineY}%`,
                      width: item.length,
                      transform: `rotate(${item.angle}deg)`,
                    }}
                    aria-hidden="true"
                  />
                  <span
                    className="nav-dot"
                    style={{ left: `${item.lineX}%`, top: `${item.lineY}%` }}
                    aria-hidden="true"
                  />
                  <Link
                    className={`nav-label${item.wide ? " nav-label-wide" : ""}`}
                    href={item.href}
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                    onPointerEnter={item.id === "expertise" ? expertiseTransition.prepare : undefined}
                    onFocus={item.id === "expertise" ? expertiseTransition.prepare : undefined}
                    onClick={(event) => {
                      if (item.id !== "expertise" || !scene.current || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
                      event.preventDefault();
                      expertiseTransition.start({
                        root: scene.current,
                        freeze: () => {
                          transitioning.current = true;
                          const wasPaused = intro.current?.paused();
                          intro.current?.pause();
                          return () => {
                            transitioning.current = false;
                            if (!wasPaused) intro.current?.resume();
                          };
                        },
                      });
                    }}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>

            <div className="logo-position" role="img" aria-label="Тривимірний знак АКЦ">
              <div className="logo-tilt">
                <div className="logo-stage">
                  <span data-scene-fallback>3D-відображення недоступне</span>
                  <div className="logo-light-pulse" aria-hidden="true" />
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>

        <div className="hero-bottom" ref={heroBottom}>
          <h1>
            Бізнес —
            <br />
            це система рішень
          </h1>
          <a href="#about" className="scroll-cue" aria-label="Прокрутити вниз">
            ↓
          </a>
          <span className="hero-index">01 / 06</span>
        </div>
      </section>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
          background: #020810;
        }

        body {
          margin: 0;
          background: #020810;
          color: #f3f7fc;
          font-family: Arial, Helvetica, sans-serif;
        }

        .akc-page {
          --header-height: 82px;
          height: 100dvh;
          min-height: 100svh;
          overflow: clip;
          position: relative;
          background:
            radial-gradient(ellipse at 50% 43%, #09294a 0%, #041525 35%, #020810 74%);
        }

        .akc-page::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.18;
          background-image: linear-gradient(
            rgba(65, 143, 213, 0.06) 1px,
            transparent 1px
          );
          background-size: 100% 5px;
        }

        .brand {
          position: relative;
          z-index: 2;
          height: var(--header-height);
          padding: 0 5.5%;
          display: flex;
          align-items: center;
          gap: 13px;
          color: #d7e0e9;
          font-size: 14px;
          letter-spacing: 0.04em;
        }

        .brand-symbol {
          color: #d9f2ff;
          font-size: 31px;
          text-decoration: none;
          line-height: 1;
        }

        .menu-button {
          margin-left: auto;
          display: flex;
          flex-direction: column;
          gap: 5px;
          border: 0;
          background: transparent;
          padding: 10px 0 10px 10px;
          cursor: pointer;
        }

        .menu-button span {
          width: 27px;
          height: 2px;
          background: #dce8f3;
          display: block;
        }

        .hero {
          height: calc(100dvh - var(--header-height));
          min-height: calc(100svh - var(--header-height));
          position: relative;
          display: grid;
          grid-template-rows: minmax(0, 1fr) auto;
          overflow: visible;
        }

        .network {
          width: min(100%, 960px);
          height: clamp(480px, 56vw, 580px);
          min-height: 480px;
          position: relative;
          margin: 0 auto;
        }

        .network-frame {
          --scene-scale: 1;
          --scene-height: 0px;
          --scene-top: 0px;
          min-height: 0;
          width: 100%;
          height: var(--scene-height);
          position: relative;
          align-self: start;
        }

        .network-scale {
          position: absolute;
          top: var(--scene-top);
          left: 50%;
          width: 100%;
          transform: translateX(-50%) scale(var(--scene-scale));
          transform-origin: top center;
          will-change: transform;
        }

        .logo-glow {
          position: absolute;
          z-index: 0;
          top: 50%;
          left: 50%;
          width: clamp(360px, 50vw, 530px);
          aspect-ratio: 1;
          transform: translate(-50%, -50%);
          pointer-events: none;
          will-change: transform;
        }

        .logo-glow-core {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          opacity: 0.46;
          background: radial-gradient(circle, rgba(0, 137, 255, 0.28), rgba(0, 86, 187, 0.1) 43%, transparent 72%);
          filter: blur(12px);
        }

        .logo-glow-motion {
          width: 100%;
          height: 100%;
          will-change: transform;
        }

        .logo-position {
          position: absolute;
          z-index: 2;
          top: 50%;
          left: 50%;
          width: clamp(310px, 40vw, 440px);
          aspect-ratio: 1270 / 1239;
          transform: translate(-50%, -50%);
        }

        .logo-tilt {
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          will-change: transform;
        }

        .logo-stage {
          position: relative;
          width: 100%;
          height: 100%;
          background: transparent;
          transform-style: preserve-3d;
        }

        /* Timeline driver only: the sweep itself is a light in the shared 3D scene. */
        .logo-light-pulse {
          position: absolute;
          z-index: 1;
          inset: 0;
          pointer-events: none;
          opacity: 0;
        }

        .nav-node {
          position: absolute;
          inset: 0;
          color: #d8e5f2;
          pointer-events: none;
        }

        .nav-list {
          position: absolute;
          z-index: 3;
          inset: 0;
          pointer-events: none;
        }

        .nav-line {
          position: absolute;
          height: 1px;
          transform-origin: left center;
          background: linear-gradient(90deg, rgba(29, 139, 234, 0.14), #4bb4ff 78%, #b8ecff);
          box-shadow: 0 0 10px rgba(29, 139, 234, 0.38);
          transition: background 220ms ease, box-shadow 220ms ease;
        }

        .nav-dot {
          position: absolute;
          width: 8px;
          height: 8px;
          margin: -4px 0 0 -4px;
          border: 1px solid #d4f3ff;
          border-radius: 50%;
          background: #39aaff;
          box-shadow: 0 0 14px 4px rgba(57, 170, 255, 0.58);
          transition: background 220ms ease, box-shadow 220ms ease;
        }

        .nav-label {
          position: absolute;
          transform: translate(-50%, -50%);
          color: inherit;
          text-align: center;
          text-decoration: none;
          white-space: nowrap;
          font-size: clamp(11px, 1.45vw, 16px);
          font-weight: 500;
          letter-spacing: 0.02em;
          text-shadow: 0 0 18px rgba(60, 151, 255, 0.2);
          transition: color 220ms ease, text-shadow 220ms ease;
          pointer-events: auto;
        }

        .nav-label-wide {
          width: min(220px, 24vw);
          white-space: normal;
          line-height: 1.3;
        }

        .nav-node:hover .nav-label,
        .nav-node:focus-visible .nav-label {
          color: #78caff;
          text-shadow: 0 0 18px rgba(36, 144, 255, 0.9), 0 0 36px rgba(36, 144, 255, 0.55);
        }

        .nav-node:hover .nav-line,
        .nav-node:focus-visible .nav-line {
          background: linear-gradient(90deg, #2c9eff, #bcefff);
          box-shadow: 0 0 16px 2px rgba(73, 179, 255, 0.78);
        }

        .nav-node:hover .nav-dot,
        .nav-node:focus-visible .nav-dot {
          background: #d7f5ff;
          box-shadow: 0 0 18px 6px rgba(57, 170, 255, 0.86);
        }

        .hero-bottom {
          width: 100%;
          margin-top: 0;
          padding: 0 5.5% 28px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
        }

        .hero-bottom h1 {
          margin: 0;
          color: #dbe4ee;
          font-size: clamp(25px, 3vw, 42px);
          line-height: 1.22;
          font-weight: 300;
          letter-spacing: -0.035em;
        }

        .scroll-cue {
          color: #a9c5df;
          font-size: 34px;
          line-height: 1;
          text-decoration: none;
          transition: transform 200ms ease;
        }

        .scroll-cue:hover {
          transform: translateY(5px);
        }

        .hero-index {
          color: #67819a;
          font-size: 11px;
          letter-spacing: 0.12em;
        }

        @media (min-width: 1200px) {
          .network {
            width: min(100%, 1160px);
            height: clamp(580px, 52vw, 650px);
            min-height: 580px;
          }

          .logo-position {
            width: clamp(567px, 48.6vw, 729px);
            top: 54%;
          }

          .logo-glow {
            width: clamp(575px, 51.75vw, 736px);
            top: 54%;
          }

          .nav-node--about .nav-line,
          .nav-node--about .nav-dot {
            top: 13% !important;
          }

          .nav-node--about .nav-line {
            width: 34px !important;
          }

          .nav-node--about .nav-label {
            top: 5% !important;
          }

          .nav-label-wide {
            width: 240px;
          }
        }

        @media (min-width: 768px) and (max-width: 1199px) {
          .network {
            width: min(calc(100% - 48px), 960px);
            height: clamp(500px, 58vw, 580px);
            min-height: 500px;
          }

          .logo-position {
            width: clamp(340px, calc(58vw - 113px), 583px);
          }

          .logo-glow {
            width: clamp(390px, 50vw, 520px);
          }
        }

        @media (max-width: 767px) {
          .akc-page {
            --header-height: 68px;
          }

          .brand {
            padding: 0 22px;
            font-size: 12px;
          }

          .network {
            width: 500px;
            height: 430px;
            min-height: 0;
          }

          .network-scale {
            width: 500px;
          }

          .network-frame {
            align-self: center;
          }

          .logo-glow {
            width: 330px;
          }

          .logo-position {
            width: 250px;
          }

          .nav-label {
            font-size: 18px;
            line-height: 1.35;
          }

          .nav-label-wide {
            width: 180px;
          }

          .nav-node {
            width: 0;
            height: 0;
            inset: auto;
          }

          .nav-line,
          .nav-dot {
            left: 0 !important;
            top: 0 !important;
          }

          .nav-label {
            top: auto !important;
            transform: translateX(-50%);
          }

          .nav-node--about {
            left: 50%;
            top: 19%;
          }

          .nav-node--about .nav-label {
            left: 0 !important;
            bottom: 60px;
          }

          .nav-node--expertise {
            left: 25%;
            top: 36%;
          }

          .nav-node--expertise .nav-label {
            left: -42px !important;
            bottom: 40px;
          }

          .nav-node--qualification {
            left: 75%;
            top: 36%;
          }

          .nav-node--qualification .nav-label {
            left: 35px !important;
            bottom: 40px;
          }

          .nav-node--industries {
            left: 25%;
            top: 64%;
          }

          .nav-node--industries .nav-label {
            left: -42px !important;
            bottom: 18px;
          }

          .nav-node--insights {
            left: 75%;
            top: 64%;
          }

          .nav-node--insights .nav-label {
            left: 42px !important;
            bottom: 18px;
          }

          .hero-bottom {
            padding: 0 22px 24px;
          }

          .hero-bottom h1 {
            font-size: 25px;
          }

          .hero-index {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
          *,
          *::before,
          *::after {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}


"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { useExpertiseTransition } from "./components/ExpertiseTransition";
import LogoIntro from "./components/LogoIntro";

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
      let removeIntroListener = () => {};
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
        intro.current = tl;

        tl.from(".nav-line", {
            scaleX: 0,
            opacity: 0,
            duration: 0.4,
            stagger: 0.035,
            transformOrigin: "left center",
          }, 0)
          .from(".nav-dot", {
            scale: 0,
            opacity: 0,
            duration: 0.2,
            stagger: 0.035,
          }, 0.15)
          .from(".nav-label", {
            opacity: 0,
            y: 8,
            duration: 0.35,
            stagger: 0.035,
          }, 0.18)
          .from(".hero-bottom", {
            opacity: 0,
            y: 12,
            duration: 0.4,
          }, 0.2);

        const revealNavigation = (event: Event) => {
          if (transitioning.current) return;
          const animateMenu = (event as CustomEvent<{ animateMenu?: boolean }>).detail?.animateMenu;
          if (animateMenu) tl.play(0);
          else tl.progress(1).pause();
        };
        window.addEventListener("akc:intro-ready", revealNavigation);
        removeIntroListener = () => window.removeEventListener("akc:intro-ready", revealNavigation);

      }, root);

      return () => {
        removeIntroListener();
        ctx.revert();
        intro.current = null;
      };
    }, root);

    // Revert to the CSS final state when reduced motion is enabled, including mid-reveal.
    return () => motion.revert();
  }, []);

  return (
    <main className="akc-page" ref={scene}>
      <LogoIntro />
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

        .logo-intro-layer {
          position: absolute;
          z-index: 0;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          background: #010411;
        }

        .logo-intro-poster,
        .logo-intro-poster img,
        .logo-intro-video {
          position: absolute;
          inset: 0;
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .logo-intro-video {
          z-index: 1;
          background: transparent;
        }

        /* Keep the logo tip clear of the top navigation marker on desktop. */
        @media (min-width: 768px) {
          .logo-intro-poster img,
          .logo-intro-video {
            transform: translateY(4%) scale(1.045);
            transform-origin: center center;
          }
        }

        .hero {
          height: calc(100dvh - var(--header-height));
          min-height: calc(100svh - var(--header-height));
          position: relative;
          display: grid;
          grid-template-rows: minmax(0, 1fr) auto;
          overflow: visible;
          z-index: 1;
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

          .nav-node--about .nav-line,
          .nav-node--about .nav-dot {
            top: 12% !important;
          }

          .nav-node--about .nav-line {
            width: 40px !important;
            transform: rotate(-90deg) !important;
          }

          .nav-node--about .nav-label {
            top: 3% !important;
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

          .nav-label {
            font-size: 18px;
            line-height: 1.35;
          }

          .nav-label-wide {
            width: 180px;
          }

          /* Compact navigation for narrow screens: keep links clear of the logo. */
          .network {
            width: min(100vw - 32px, 500px);
            height: min(56vh, 430px);
          }

          .network-scale {
            width: 100%;
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

          .nav-line {
            width: clamp(18px, 5vw, 30px) !important;
          }

          .nav-label {
            top: auto !important;
            transform: translateX(-50%);
            font-size: clamp(12px, 3.1vw, 16px);
          }

          .nav-node--about {
            left: 50%;
            top: 6%;
          }

          .nav-node--about .nav-line {
            transform: rotate(-90deg) !important;
          }

          .nav-node--about .nav-label {
            left: 0 !important;
            bottom: 39px;
          }

          .nav-node--expertise {
            left: 12%;
            top: 38%;
          }

          .nav-node--expertise .nav-line {
            transform: rotate(0deg) !important;
          }

          .nav-node--expertise .nav-label {
            left: 0 !important;
            bottom: 20px;
          }

          .nav-node--qualification {
            left: 88%;
            top: 38%;
          }

          .nav-node--qualification .nav-line {
            transform: rotate(180deg) !important;
          }

          .nav-node--qualification .nav-label {
            left: 0 !important;
            bottom: 20px;
          }

          .nav-node--industries {
            left: 12%;
            top: 83%;
          }

          .nav-node--industries .nav-line {
            transform: rotate(0deg) !important;
          }

          .nav-node--industries .nav-label {
            left: 0 !important;
            bottom: 20px;
          }

          .nav-node--insights {
            left: 88%;
            top: 83%;
          }

          .nav-node--insights .nav-line {
            transform: rotate(180deg) !important;
          }

          .nav-node--insights .nav-label {
            left: 0 !important;
            bottom: 20px;
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

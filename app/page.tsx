
"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import Image from "next/image";
import { useExpertiseTransition } from "./components/ExpertiseTransition";
import LogoIntro from "./components/LogoIntro";
import "./home.css";

const directions = [
  { id: "about", label: "ПРО АКЦ", href: "#about", x: 50, y: 8, lineX: 50, lineY: 19, angle: -90, length: "clamp(46px, 5vw, 72px)" },
  { id: "expertise", label: "ЕКСПЕРТИЗА", href: "/expertise", x: 11, y: 27, lineX: 25, lineY: 36, angle: -160, length: "clamp(78px, 9vw, 130px)" },
  { id: "qualification", label: "КВАЛІФІКАЦІЙНИЙ ЦЕНТР", href: "#qualification", x: 84, y: 27, lineX: 75, lineY: 36, angle: -20, length: "clamp(78px, 9vw, 130px)", wide: true },
  { id: "industries", label: "ГАЛУЗІ", href: "#industries", x: 11, y: 78, lineX: 25, lineY: 64, angle: 160, length: "clamp(78px, 9vw, 130px)" },
  { id: "insights", label: "НОВИНИ", href: "#insights", x: 89, y: 78, lineX: 75, lineY: 64, angle: 20, length: "clamp(78px, 9vw, 130px)" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavReady, setMobileNavReady] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuPanel = useRef<HTMLElement>(null);
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

  useEffect(() => {
    // The video event is primary. A fallback ensures links never stay hidden
    // if Safari drops an ended/error event or the media is already complete.
    const ready = () => setMobileNavReady(true);
    window.addEventListener("akc:intro-ready", ready);
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const fallback = mobile ? window.setTimeout(ready, 5200) : null;
    return () => {
      window.removeEventListener("akc:intro-ready", ready);
      if (fallback !== null) window.clearTimeout(fallback);
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

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setShowContacts(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    menuPanel.current?.querySelector<HTMLAnchorElement>("a, button")?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <main className="akc-page" ref={scene}>
      <LogoIntro />
      <header className="brand">
        <a className="brand-symbol" href="#home" aria-label="АКЦ">
          <Image src="/akc-brand-white.png" width={40} height={40} alt="" priority />
        </a>
        <span>Аудит Консалтинг Центр</span>
        <button
          ref={menuButton}
          className={`menu-button${menuOpen ? " is-open" : ""}`}
          type="button"
          aria-label={menuOpen ? "Закрити меню" : "Відкрити меню"}
          aria-expanded={menuOpen}
          aria-controls="akc-navigation-menu"
          onClick={() => { setMenuOpen((open) => !open); setShowContacts(false); }}
        >
          <span />
          <span />
          <span />
        </button>
      </header>
      {menuOpen && (
        <>
          <button className="menu-backdrop" type="button" aria-label="Закрити меню" onClick={() => { setMenuOpen(false); setShowContacts(false); }} />
          <nav ref={menuPanel} id="akc-navigation-menu" className="menu-panel" aria-label="Меню сайту">
            
            {directions.map((item) => (
              <Link
                key={item.id}
                className="menu-link"
                href={item.href}
                onClick={() => { setMenuOpen(false); setShowContacts(false); }}
              >
                <span>{item.label}</span>
              </Link>
            ))}
            <button
              className="menu-link menu-contact-link"
              type="button"
              aria-expanded={showContacts}
              onClick={() => setShowContacts((value) => !value)}
            >
              <span>НАШІ КОНТАКТИ</span>
            </button>
            {showContacts && (
              <div className="menu-contact-info">
                Контактні дані будуть опубліковані тут після підтвердження.
              </div>
            )}
          </nav>
        </>
      )}

      <section className="hero" id="home" ref={hero}>
        <div className="network-frame" ref={sceneFrame}>
          <div className="network-scale">
            <div className="network" ref={network} aria-label="Напрями Аудит Консалтинг Центру">
            <div className="nav-list" data-mobile-intro-ready={mobileNavReady ? "true" : "false"}>
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
      <div className="akc-sections">
        <section id="about" className="akc-content-section">
          <p className="akc-eyebrow">01 / ПРО АКЦ</p>
          <h2>Аудит Консалтинг Центр</h2>
          <p>Аудит, облік і консалтинг — напрями, у яких важливі точність, відповідальність і зрозумілі рішення.</p>
          <a href="#expertise-section" className="akc-section-link">Переглянути напрями діяльності <span aria-hidden="true">↗</span></a>
        </section>
        <section id="expertise-section" className="akc-content-section">
          <p className="akc-eyebrow">02 / ЕКСПЕРТИЗА</p>
          <h2>Наші напрями</h2>
          <p>Ознайомтеся з послугами та професійними напрямами АКЦ.</p>
          <Link href="/expertise" className="akc-section-link">Перейти до експертизи <span aria-hidden="true">↗</span></Link>
        </section>
        <section id="qualification" className="akc-content-section">
          <p className="akc-eyebrow">03 / КВАЛІФІКАЦІЙНИЙ ЦЕНТР</p>
          <h2>Професійна кваліфікація</h2>
          <p>Інформація про кваліфікаційний напрям та відповідні матеріали.</p>
          <a href="#contacts" className="akc-section-link">Перейти до контактного розділу <span aria-hidden="true">↗</span></a>
        </section>
        <section id="industries" className="akc-content-section">
          <p className="akc-eyebrow">04 / ГАЛУЗІ</p>
          <h2>Рішення для різних сфер</h2>
          <p>Підхід до роботи залежить від задач організації, галузі та нормативних вимог.</p>
          <a href="#contacts" className="akc-section-link">Обговорити вашу задачу <span aria-hidden="true">↗</span></a>
        </section>
        <section id="insights" className="akc-content-section">
          <p className="akc-eyebrow">05 / НОВИНИ</p>
          <h2>Новини та матеріали</h2>
          <p>Тут з’являтимуться оновлення та корисні матеріали АКЦ.</p>
        </section>
        <footer id="contacts" className="akc-footer">
          <span>АКЦ · Аудит Консалтинг Центр</span>
          <a href="#home">Повернутися нагору ↑</a>
        </footer>
      </div>
    </main>
  );
}

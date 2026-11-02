"use client";

import { useEffect, type ReactNode } from "react"
import "./about.css"

const metrics = [
  ["10+", "років на ринку"],
  ["1000+", "клієнтів"],
  ["40+", "експертів"],
  ["20 000+", "консультацій"],
]

const services = [
  ["АУДИТ", "Фінансова звітність", "Аудиторські завдання", "ribbons"],
  ["БУХГАЛТЕРСЬКИЙ ОБЛІК", "Супровід", "Відновлення обліку", "lens"],
  ["ПОДАТКИ", "Аналіз ризиків", "Податковий аналіз", "wave"],
  ["МСФЗ", "Консультації", "Підготовка звітностей", "orbit"],
]

const qualifications = [
  "Акредитований кваліфікаційний центр",
  "Професійна організація",
  "Сертифіковані аудитори та фахівці",
  "Робота відповідно до професійних стандартів",
]

function Arrow() {
  return (
    <svg viewBox="0 0 40 20" fill="none" aria-hidden="true">
      <path d="M1 10h36M29 2l8 8-8 8" />
    </svg>
  )
}

function DiscussButton() {
  return (
    <a className="action" href="#contacts">
      <span>Обговорити завдання</span>
      <Arrow />
    </a>
  )
}

function GlassSculpture({ compact = false }: { compact?: boolean }) {
  return (
    <svg
      className={
        compact ? "glass-sculpture glass-sculpture--compact" : "glass-sculpture"
      }
      viewBox="0 0 680 790"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="glass-edge" x1="78" y1="62" x2="607" y2="701">
          <stop stopColor="#70D9FF" stopOpacity=".12" />
          <stop offset=".32" stopColor="#147BFF" stopOpacity=".95" />
          <stop offset=".63" stopColor="#63E4FF" stopOpacity=".7" />
          <stop offset="1" stopColor="#4634FF" stopOpacity=".12" />
        </linearGradient>
        <linearGradient id="glass-core" x1="109" y1="58" x2="559" y2="728">
          <stop stopColor="#050A19" stopOpacity=".2" />
          <stop offset=".35" stopColor="#1553D1" stopOpacity=".35" />
          <stop offset=".56" stopColor="#27C6FF" stopOpacity=".6" />
          <stop offset=".76" stopColor="#2538B6" stopOpacity=".28" />
          <stop offset="1" stopColor="#02050C" stopOpacity=".1" />
        </linearGradient>
        <linearGradient id="white-cut" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="white" stopOpacity="0" />
          <stop offset=".5" stopColor="white" stopOpacity=".72" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <filter id="soft-glow" x="-80%" y="-40%" width="260%" height="180%">
          <feGaussianBlur stdDeviation="24" />
        </filter>
        <filter id="liquid" x="-40%" y="-20%" width="180%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency=".006 .018"
            numOctaves="2"
            seed="8"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="32" />
          <feGaussianBlur stdDeviation=".5" />
        </filter>
        <filter id="inner-shadow" x="-30%" y="-20%" width="160%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="9" result="blur" />
          <feOffset dx="-5" dy="2" />
          <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix values="0 0 0 0 0.24 0 0 0 0 0.75 0 0 0 0 1 0 0 0 .8 0" />
          <feComposite in2="SourceGraphic" operator="over" />
        </filter>
      </defs>
      <path
        className="sculpture-glow"
        d="M383 21C529 45 623 157 591 282c-20 76-85 116-73 204 10 73-22 193-154 251-111 48-246-1-270-112-20-94 78-153 74-248-4-101-63-160-6-252C207 52 298 7 383 21Z"
        stroke="#176FFF"
        strokeWidth="86"
        opacity=".62"
        filter="url(#soft-glow)"
      />
      <g filter="url(#liquid)">
        <path
          d="M377 28C519 50 608 160 579 277c-19 74-79 114-68 202 10 78-26 184-150 246-106 52-231 5-258-101-24-93 70-151 69-245-2-101-56-159-3-248C211 60 293 15 377 28Z"
          fill="url(#glass-core)"
          stroke="url(#glass-edge)"
          strokeWidth="5"
          filter="url(#inner-shadow)"
        />
        <path
          d="M376 64C489 81 558 168 537 267c-16 76-70 111-62 203 6 65-31 154-129 204-72 36-155 12-187-53-39-80 54-153 51-245-2-92-44-141-4-215 34-62 102-107 170-97Z"
          stroke="url(#glass-edge)"
          strokeWidth="22"
          opacity=".72"
        />
        <path
          d="M378 111c72 12 116 75 102 147-15 80-66 117-55 220 8 72-35 130-96 154-46 18-96 0-113-41-27-65 39-133 35-220-4-81-30-116 0-174 27-51 79-94 127-86Z"
          stroke="#57CFFF"
          strokeWidth="4"
          opacity=".6"
        />
      </g>
      <path
        d="M214 119C301 69 446 68 524 167"
        stroke="url(#white-cut)"
        strokeWidth="2"
        opacity=".45"
      />
      <path
        d="M142 551c86 113 245 119 347 16"
        stroke="url(#white-cut)"
        strokeWidth="2"
        opacity=".3"
      />
      <path
        d="M211 119c-28 116 49 132 29 258-19 117-72 183 2 263"
        stroke="#A6EDFF"
        strokeWidth="1.5"
        opacity=".48"
      />
      <path
        d="M456 90c-3 91 64 117 23 211-38 87 23 168-27 266"
        stroke="#6A83FF"
        strokeWidth="1"
        opacity=".66"
      />
      <ellipse
        cx="352"
        cy="384"
        rx="241"
        ry="306"
        stroke="#7BCAFF"
        opacity=".13"
      />
      <circle cx="493" cy="138" r="4" fill="#C4F3FF" />
      <circle
        cx="493"
        cy="138"
        r="16"
        fill="#75CFFF"
        opacity=".35"
        filter="url(#soft-glow)"
      />
    </svg>
  )
}

function ServiceArtwork({ variant }: { variant: string }) {
  const commonDefs = (
    <defs>
      <linearGradient id={`line-${variant}`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#6EE6FF" stopOpacity=".08" />
        <stop offset=".48" stopColor="#2778FF" stopOpacity=".95" />
        <stop offset="1" stopColor="#7859FF" stopOpacity=".12" />
      </linearGradient>
      <filter
        id={`glow-${variant}`}
        x="-100%"
        y="-100%"
        width="300%"
        height="300%"
      >
        <feGaussianBlur stdDeviation="15" />
      </filter>
      <filter
        id={`bend-${variant}`}
        x="-30%"
        y="-20%"
        width="160%"
        height="140%"
      >
        <feTurbulence
          baseFrequency=".009 .025"
          numOctaves="2"
          seed={variant.length * 4}
          result="n"
        />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="24" />
      </filter>
    </defs>
  )

  if (variant === "ribbons") {
    return (
      <svg viewBox="0 0 720 520" fill="none" aria-hidden="true">
        {commonDefs}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
          <path
            key={item}
            d={`M${70 + item * 58} -30V${128 + ((item * 67) % 210)}c0 54 ${
              item % 2 ? -35 : 35
            } 72 ${item % 3 ? 16 : -24} 126v260`}
            stroke={`url(#line-${variant})`}
            strokeWidth={item % 3 === 0 ? 34 : 17}
            opacity={0.25 + (item % 4) * 0.16}
            filter={`url(#bend-${variant})`}
          />
        ))}
        <path
          d="M66 204c141-81 218 135 363 22 95-75 168-28 247 19"
          stroke="#8DE9FF"
          strokeWidth="2"
          opacity=".6"
        />
        <path
          d="M66 204c141-81 218 135 363 22 95-75 168-28 247 19"
          stroke="#237AFF"
          strokeWidth="36"
          opacity=".28"
          filter={`url(#glow-${variant})`}
        />
      </svg>
    )
  }

  if (variant === "lens") {
    return (
      <svg viewBox="0 0 520 520" fill="none" aria-hidden="true">
        {commonDefs}
        <circle
          cx="283"
          cy="236"
          r="151"
          stroke={`url(#line-${variant})`}
          strokeWidth="49"
          opacity=".62"
          filter={`url(#bend-${variant})`}
        />
        <circle
          cx="283"
          cy="236"
          r="89"
          stroke="#65D8FF"
          strokeWidth="2"
          opacity=".52"
        />
        <circle
          cx="283"
          cy="236"
          r="172"
          stroke="#786CFF"
          strokeWidth="1"
          opacity=".35"
        />
        <path d="M83 334 427 125" stroke="#C6F3FF" opacity=".32" />
        <ellipse
          cx="272"
          cy="248"
          rx="93"
          ry="67"
          fill="#147BFF"
          opacity=".18"
          filter={`url(#glow-${variant})`}
        />
      </svg>
    )
  }

  if (variant === "wave") {
    return (
      <svg viewBox="0 0 720 420" fill="none" aria-hidden="true">
        {commonDefs}
        <path
          d="M-40 290C87 242 122 56 267 105c122 41 146 213 287 135 74-41 119-135 206-147"
          stroke="#2378FF"
          strokeWidth="68"
          opacity=".34"
          filter={`url(#glow-${variant})`}
        />
        <path
          d="M-40 290C87 242 122 56 267 105c122 41 146 213 287 135 74-41 119-135 206-147"
          stroke={`url(#line-${variant})`}
          strokeWidth="25"
          filter={`url(#bend-${variant})`}
        />
        <path
          d="M-40 290C87 242 122 56 267 105c122 41 146 213 287 135 74-41 119-135 206-147"
          stroke="#B1F1FF"
          strokeWidth="1.5"
          opacity=".75"
        />
        {[126, 267, 433, 584].map((x, index) => (
          <g key={x}>
            <circle
              cx={x}
              cy={[190, 105, 245, 220][index]}
              r="5"
              fill="#CFF7FF"
            />
            <path
              d={`M${x} ${[190, 105, 245, 220][index] + 7}v160`}
              stroke="#8CDFFF"
              opacity=".18"
            />
          </g>
        ))}
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 520 520" fill="none" aria-hidden="true">
      {commonDefs}
      <ellipse
        cx="265"
        cy="260"
        rx="172"
        ry="92"
        stroke={`url(#line-${variant})`}
        strokeWidth="18"
        transform="rotate(-21 265 260)"
        filter={`url(#bend-${variant})`}
      />
      <ellipse
        cx="265"
        cy="260"
        rx="83"
        ry="184"
        stroke="#449CFF"
        strokeWidth="3"
        opacity=".55"
        transform="rotate(32 265 260)"
      />
      <circle cx="265" cy="260" r="134" stroke="#86E5FF" opacity=".2" />
      <path d="M123 139 405 380M96 299l345-79" stroke="#8FDFFF" opacity=".2" />
      <circle cx="386" cy="166" r="8" fill="#D5F8FF" />
      <circle
        cx="386"
        cy="166"
        r="35"
        fill="#247DFF"
        opacity=".48"
        filter={`url(#glow-${variant})`}
      />
    </svg>
  )
}

function AboutPage() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-enter]")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ isIntersecting, target }) => {
          if (isIntersecting) {
            target.classList.add("entered")
            observer.unobserve(target)
          }
        })
      },
      { threshold: 0.08 },
    )
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return (
    <main className="akc-about-figma page">
      <header className="nav">
        <a className="nav__brand" href="/" aria-label="На головну">
          АКЦ
        </a>
        <span className="nav__rule" />
        <a className="nav__back" href="/">
          ← ГОЛОВНА
        </a>
      </header>

      <section className="hero" aria-labelledby="page-title">
        <div className="hero__copy">
          <p className="kicker">01 / Про Аудит Консалтинг Центр</p>
          <h1 id="page-title">
            АУДИТ КОНСАЛТИНГ
            <br />
            ЦЕНТР
          </h1>
          <p className="hero__body">
            Команда професіоналів АКЦ допоможе вашому бізнесу працювати впевнено
            та розвиватися. Ми супроводжуємо реєстрацію підприємств, ФОП, ведемо
            бухгалтерський, податковий і кадровий, військовий облік, проводимо
            аудит та допомагаємо виявляти фінансові й податкові ризики.
          </p>
          <DiscussButton />
        </div>
      </section>

      <section className="manifesto" data-enter>
        <div className="manifesto__headline">
          <h2>
            ПРОФЕСІЙНИЙ ПАРТНЕР
            <br />
            ДЛЯ РОЗВИТКУ БІЗНЕСУ.
          </h2>
        </div>
        <div className="manifesto__spine" aria-hidden="true">
          <span />
        </div>
        <div className="manifesto__copy">
          <p>
            Ми поєднуємо аудиторську практику, консалтингові рішення та освітні
            ініціативи, щоб допомагати компаніям вирішувати складні завдання,
            мінімізувати ризики та впевнено рухатись вперед.
          </p>
          <p>
            Працюємо з бізнесом, комунальними та державними підприємствами у
            різних галузях, забезпечуємо індивідуальний підхід, практичні
            рішення та високі стандарти по всій території України.
          </p>
        </div>
      </section>

      <section className="numbers" aria-label="АКЦ у цифрах" data-enter>
        <div className="numbers__line" aria-hidden="true" />
        {metrics.map(([value, label], index) => (
          <div className={`number number--${index + 1}`} key={label}>
            <span className="number__pin" aria-hidden="true" />
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="services" aria-label="Наші послуги">
        <div className="services__frame">
          <h2 className="services__heading">Наші <span>напрями роботи</span></h2>
          <div className="services__grid">
            {services.map(([title, lineOne, lineTwo], index) => (
              <article className={`service service--${index + 1}`} key={title}>
                <div className="service__glow service__glow--primary" aria-hidden="true" />
                <div className="service__glow service__glow--secondary" aria-hidden="true" />
                <div className="service__content">
                  <h3>{title}</h3>
                  <p>{lineOne}<br />{lineTwo}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="credentials" data-enter>
        <div className="credentials__heading">
          <h2>
            ПРОФЕСІЙНА
            <br />
            ЕКСПЕРТИЗА
            <br />
            ПІДТВЕРДЖЕННЯ
            <br />
            ОФІЦІЙНО.
          </h2>
          <span className="credentials__trace" aria-hidden="true" />
        </div>
        <div className="credentials__list">
          {qualifications.map((qualification, index) => (
            <div className="credential" key={qualification}>
              <span className="credential__index" aria-hidden="true">
                0{index + 1}
              </span>
              <p>{qualification}</p>
              <svg viewBox="0 0 44 44" fill="none" aria-hidden="true">
                <circle cx="22" cy="22" r="20" />
                <path d="m14 22 5 5 11-12" />
              </svg>
            </div>
          ))}
        </div>
      </section>

      <section className="closing" id="contacts" data-enter>
        <div className="closing__installation">
          <GlassSculpture compact />
        </div>
        <div className="closing__copy">
          <h2>
            ПОТРІБНА КОНСУЛЬТАЦІЯ
            <br />
            ЩОДО ВАШОГО БІЗНЕСУ?
          </h2>
          <DiscussButton />
        </div>
      </section>
    </main>
  )
}

export default AboutPage
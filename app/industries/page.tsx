"use client";

import Link from "next/link";
import { useState } from "react";
import "./industries.css";

const sectors = [
  { name: "ПОСЛУГИ", heading: "Сфера послуг", description: "Фінансовий контроль, облік і консультаційна підтримка сервісних компаній." },
  { name: "МЕДИЦИНА", heading: "Медичний бізнес", description: "Підтримка медичних закладів з урахуванням галузевих вимог і процесів." },
  { name: "РОЗДРІБНА ТОРГІВЛЯ", heading: "Роздрібна торгівля", description: "Контроль товарних операцій, обліку, звітності та фінансових ризиків." },
  { name: "ВИРОБНИЦТВО", heading: "Виробництво", description: "Аналіз витрат, виробничих процесів та управлінських рішень." },
  { name: "АГРОБІЗНЕС", heading: "Агробізнес", description: "Регуляторні вимоги, фінансовий контроль та супровід бізнес-процесів." },
];

export default function IndustriesPage() {
  const [active, setActive] = useState(4);
  return (
    <main className="industries-page">
      <header className="industries-header">
        <Link href="/" className="industries-brand">△ <span>Аудит Консалтинг Центр</span></Link>
        <nav aria-label="Головна навігація">
          <Link href="/">Головна</Link>
          <Link href="/expertise">Експертиза</Link>
          <span aria-current="page">Галузі</span>
          <Link href="/#contacts">Контакти ↗</Link>
        </nav>
      </header>
      <section className="industries-stage" aria-labelledby="industries-title">
        <div className="industries-image" aria-hidden="true" />
        <div className="industries-panel">
          <p className="industries-kicker">03 / ГАЛУЗІ</p>
          <h1 id="industries-title">РОЗУМІЄМО<br /><em>КОНТЕКСТ БІЗНЕСУ.</em></h1>
          <p className="industries-intro">Рішення АКЦ враховують специфіку галузі, регулювання та бізнес-процесів.</p>
          <div className="industries-diagram">
            <div className="industries-line" aria-hidden="true" />
            {sectors.map((sector, i) => (
              <button type="button" key={sector.name}
                className={`industries-node industries-node-${i + 1}${active === i ? " selected" : ""}`}
                aria-pressed={active === i} onClick={() => setActive(i)}>
                <span>{sector.name}</span><i aria-hidden="true" />
              </button>
            ))}
            <div className="industries-detail" aria-live="polite">
              <strong>{sectors[active].heading}</strong>
              <p>{sectors[active].description}</p>
              <Link href="/#contacts">Обговорити співпрацю ↗</Link>
            </div>
          </div>
          <Link className="industries-bottom-link" href="/#contacts">ЗВ'ЯЗАТИСЯ З АКЦ ↗</Link>
        </div>
      </section>
    </main>
  );
}

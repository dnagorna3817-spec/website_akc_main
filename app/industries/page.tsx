"use client";

import Link from "next/link";
import { useState } from "react";
import "./industries.css";
import { ExpertiseHeader, expertiseFont } from "../expertise/ExpertiseView";
import expertiseStyles from "../expertise/expertise.module.css";

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
    <main className={`industries-page ${expertiseStyles.page} ${expertiseFont}`}>
      <ExpertiseHeader active="industries" />
      <section className="industries-stage" aria-labelledby="industries-title">
        <div className="industries-panel">
          <p className="industries-kicker">03 / ГАЛУЗІ</p>
          <h1 id="industries-title">РОЗУМІЄМО<br /><em>КОНТЕКСТ БІЗНЕСУ.</em></h1>
          <p className="industries-intro">Рішення АКЦ враховують специфіку галузі, регулювання та бізнес-процесів.</p>
          <div className="industries-diagram">
            <div className="industries-plot">
              <svg className="industries-line-svg" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true"><path d="M 42 128 C 200 128 262 152 330 165 S 485 194 525 202 S 700 239 720 243 S 850 261 910 264" /></svg>
            {sectors.map((sector, i) => (
              <button type="button" key={sector.name}
                className={`industries-node industries-node-${i + 1}${active === i ? " selected" : ""}`}
                aria-pressed={active === i} onClick={() => setActive(i)}>
                <span>{sector.name}</span><i aria-hidden="true" />
              </button>
            ))}
            </div>
            <div className="industries-detail" aria-live="polite">
              <strong>{sectors[active].heading}</strong>
              <p>{sectors[active].description}</p>
              <Link href="/#contacts">Обговорити співпрацю ↗</Link>
            </div>
          </div>
        </div>
        <div className="industries-image" aria-hidden="true" />
      </section>
    </main>
  );
}

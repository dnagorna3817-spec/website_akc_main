import Link from "next/link";
import { ExpertiseHeader, expertiseFont } from "../../expertise/ExpertiseView";
import styles from "../agribusiness/agro.module.css";
import retail from "./retail.module.css";

const groups = [
  "Магазини та торговельні мережі",
  "Інтернет-магазини та маркетплейс-продавці",
  "Аптеки, АЗС та торгові точки з РРО/ПРРО",
  "Франшизи й торговельні мережі, що масштабуються",
];

const offerings = [
  { title: "Бухгалтерський аутсорсинг", items: [
    "Ведення бухгалтерського та податкового обліку з урахуванням специфіки роздрібної торгівлі",
    "Облік товарних запасів, закупівель, переоцінок, націнок і списань",
    "Облік касових операцій, РРО/ПРРО, еквайрингу та денних виручок по точках",
    "Облік продажів через маркетплейси, інтернет-магазини та інтеграції з обліковими системами",
    "Облік імпорту товарів та розрахунків із постачальниками",
    "Розрахунок зарплати продавців і касирів, супровід кадрового діловодства",
    "Підготовка та подання податкової, фінансової та статистичної звітності",
  ]},
  { title: "Податковий супровід", items: [
    "Вибір та оптимізація системи оподаткування в межах законодавства",
    "Консультації з ПДВ, ПРРО, ліцензій та патентів на окремі види товарів",
    "Підготовка до перевірок, відповіді на запити контролюючих органів",
  ]},
  { title: "Консалтинг та разові послуги", items: [
    "Постановка та відновлення обліку, налагодження товарного та касового обліку",
    "Аналіз рентабельності товарних груп і торгових точок, бюджетування, фінансова модель",
    "Розробка внутрішніх регламентів та оптимізація бізнес-процесів",
    "Реєстрація, зміни, відкриття нових точок, реорганізація бізнесу",
  ]},
  { title: "Аудит", items: [
    "Ініціативний аудит фінансової звітності",
    "Підтвердження прозорості обліку для банків, інвесторів і партнерів",
  ]},
];

export default function RetailPage() {
  return <div className={`${styles.page} ${expertiseFont}`}>
    <ExpertiseHeader active="industries" />
    <main>
      <section className={styles.hero}>
        <div className={`${styles.art} ${retail.retailArt}`} aria-hidden="true">
          <div className={`${styles.photo} ${retail.retailPhoto}`} />
        </div>
        <div className={styles.heroCopy}>
          <span>РОЗДРІБНА ТОРГІВЛЯ</span>
          <h1>Бухгалтерський та<br/>консалтинговий супровід<br/><em>роздрібної торгівлі</em></h1>
        </div>
        <div className={styles.audience}>
          <h2>ДЛЯ КОГО<br/>МИ ПРАЦЮЄМО</h2>
          {groups.map(group => <p key={group}>{group}</p>)}
        </div>
      </section>

      <section className={styles.services} id="services">
        <h2>Що ми <span>пропонуємо</span></h2>
        <p className={styles.lead}>
          Комплексний підхід до бухгалтерського обліку, податків,
          <br/> управління та розвитку роздрібної торгівлі.
        </p>
        <div className={styles.offerings}>
          {offerings.map(offer => <article className={styles.offer} key={offer.title}>
            <div className={styles.offerHeading}><h3>{offer.title}</h3></div>
            <ul>{offer.items.map(item => <li key={item}>{item}</li>)}</ul>
          </article>)}
        </div>
      </section>

      <section className={`${styles.cta} ${retail.retailCta}`}>
        <div className={styles.ctaCopy}>
          <h2>Залиште заявку</h2>
          <Link href="/#contacts" data-lead-cta>ЗАЛИШИТИ ЗАЯВКУ ↗</Link>
        </div>
      </section>
    </main>
  </div>;
}

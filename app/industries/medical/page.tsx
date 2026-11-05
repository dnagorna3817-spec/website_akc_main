import Link from "next/link";
import { ExpertiseHeader, expertiseFont } from "../../expertise/ExpertiseView";
import styles from "./medical.module.css";
import agro from "../agribusiness/agro.module.css";

const audiences = [
  { icon: "✚", title: "Приватні клініки, медичні центри та поліклініки" },
  { icon: "♡", title: "Стоматологічні клініки та кабінети" },
  { icon: "⚕", title: "Лабораторії та діагностичні центри" },
  { icon: "◇", title: "Аптеки та аптечні мережі" },
  { icon: "♙", title: "ФОП-лікарі, косметологічні та реабілітаційні центри" },
  { icon: "▤", title: "Заклади, що співпрацюють із НСЗУ за програмою медичних гарантій" },
];
const services = [
  { icon: "%", title: "Податковий супровід", items: [
    "Вибір та оптимізація системи оподаткування в межах законодавства",
    "Консультації з ПДВ, пільг для медичних послуг та податкової знижки для пацієнтів",
    "Консультації щодо роботи з РРО/ПРРО та еквайрингом",
    "Підготовка до перевірок, відповіді на запити контролюючих органів",
  ], note: "ОПТИМАЛЬНЕ ОПОДАТКУВАННЯ ДЛЯ МЕДИЧНИХ ЗАКЛАДІВ" },
  { icon: "▥", title: "Консалтинг та разові послуги", items: [
    "Постановка та відновлення обліку, налагодження документообігу",
    "Аналіз рентабельності послуг, лікарів і напрямків, бюджетування, фінансова модель",
    "Розробка внутрішніх регламентів та оптимізація бізнес-процесів",
    "Розробка систем оплати праці лікарів і медперсоналу, у тому числі відсоткової та змішаної",
    "Реєстрація, зміни, відкриття нових філій, реорганізація бізнесу",
  ], note: "КОНСАЛТИНГ ДЛЯ СТАЛОГО РОЗВИТКУ КЛІНІКИ" },
];
const reasons = [
  { icon: "♧", title: "Команда фахівців", text: "За вашим питанням працює не одна людина, а відділ, тому результат не залежить від відпустки чи хвороби одного спеціаліста." },
  { icon: "◎", title: "Координація й контроль", text: "Кожен клієнт має закріпленого спеціаліста та координатора, а робота ведеться за чіткими регламентами." },
  { icon: "⬡", title: "Розуміння медичної специфіки", text: "Ми знаємо особливості податкового режиму медичних послуг, оплати праці лікарів і вимог до закладів охорони здоров’я." },
  { icon: "⚙", title: "Практичні рішення", text: "Ми не обмежуємося порадами, а допомагаємо впровадити зміни у ваших процесах." },
];

export default function MedicalPage() {
  const groups = audiences.slice(0, 4).map(({ title }) => title);
  const offerings = [
    { title: "Бухгалтерський аутсорсинг", items: [
      "Бухгалтерський та податковий облік медичних закладів і приватних практик",
      "Облік медичних послуг, витратних матеріалів, медикаментів і обладнання",
      "Облік розрахунків із пацієнтами, страхуванням та НСЗУ",
      "Розрахунок заробітної плати лікарів і медичного персоналу",
      "Підготовка фінансової, податкової та статистичної звітності",
    ] },
    ...services.map(({ title, items }) => ({ title, items })),
    { title: "Аудит", items: [
      "Ініціативний аудит фінансової звітності медичного закладу",
      "Перевірка правильності обліку та підготовка до контролюючих перевірок",
    ] },
  ];
  return <div className={`${agro.page} ${expertiseFont} ${styles.medicalPage}`}>
    <ExpertiseHeader active="industries" />
    <main>
      <section className={agro.hero}>
        <div className={agro.art} aria-hidden="true"><div className={`${agro.photo} ${styles.medicalPhoto}`} /></div>
        <div className={agro.heroCopy}>
          <span>МЕДИЦИНА</span>
          <h1>Бухгалтерський та<br/>консалтинговий супровід<br/><em>медичного бізнесу</em></h1>
        </div>
        <div className={agro.audience}>
          <h2>ДЛЯ КОГО<br/>МИ ПРАЦЮЄМО</h2>
          {groups.map(group => <p key={group}>{group}</p>)}
        </div>
      </section>
      <section className={agro.services} id="services">
        <h2>Що ми <span>пропонуємо</span></h2>
        <p className={agro.lead}>Комплексний підхід до бухгалтерського обліку, податків,<br/> управління та розвитку медичного бізнесу.</p>
        <div className={agro.offerings}>
          {offerings.map(offer => <article className={`${agro.offer} ${styles.medicalOffer}`} key={offer.title}>
            <div className={agro.offerHeading}><h3>{offer.title}</h3></div>
            <ul>{offer.items.map(item => <li key={item}>{item}</li>)}</ul>
          </article>)}
        </div>
      </section>
      <section className={`${agro.cta} ${styles.medicalCta}`}>
        <div className={agro.ctaCopy}>
          <h2>Залиште заявку</h2>
          <Link href="/#contacts">ЗАЛИШИТИ ЗАЯВКУ ↗</Link>
        </div>
      </section>
    </main>
  </div>;
}

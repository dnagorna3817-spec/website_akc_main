import Link from "next/link";
import { ExpertiseHeader, expertiseFont } from "../../expertise/ExpertiseView";
import styles from "./agro.module.css";

const groups = [
  "Фермерські господарства та соло-аграрії",
  "Сільськогосподарські підприємства (ТОВ, ПП, СВГ)",
  "Переробні та агросервісні компанії",
  "Зернотрейдери, елеватори, виробники та постачальники ресурсів для АПК",
];
const offerings = [
  { title: "Бухгалтерський аутсорсинг", items: [
    "Ведення бухгалтерського та податкового обліку з урахуванням специфіки агровиробництва",
    "Облік землі, оренди та орендних виплат власникам паїв",
    "Облік врожаю, зберігання, давальницької сировини, ТМЦ, пального та техніки",
    "Розрахунок зарплати, у тому числі сезонних працівників",
    "Підготовка та подання податкової, фінансової та статистичної звітності",
  ]},
  { title: "Податковий супровід", items: [
    "Вибір та оптимізація системи оподаткування в межах законодавства",
    "Розрахунок податків, супровід перевірок, підготовка відповідей на запити контролюючих органів",
    "Консультації з питань ПДВ, земельного податку, оренди та експортних операцій",
  ]},
  { title: "Консалтинг та разові послуги", items: [
    "Постановка та відновлення обліку, приведення його до ладу після змін або перевірок",
    "Фінансова модель, бюджетування, аналіз рентабельності культур і напрямів",
    "Супровід залучення фінансування, участі в державних програмах підтримки аграріїв та грантах",
    "Розробка внутрішніх регламентів та оптимізація бізнес-процесів",
    "Реєстрація, зміни та реорганізація бізнесу",
  ]},
  { title: "Аудит", items: [
    "Ініціативний аудит фінансової звітності",
    "Підтвердження прозорості обліку для банків, інвесторів і партнерів",
  ]},
];
export default function AgribusinessPage() {
  return <div className={`${styles.page} ${expertiseFont}`}>
    <ExpertiseHeader active="industries" />
    <main>
      <section className={styles.hero}>
        <div className={styles.art} aria-hidden="true"><div className={styles.photo} /></div>
        <div className={styles.heroCopy}><span>АГРОБІЗНЕС</span><h1>Бухгалтерський та<br/>консалтинговий супровід<br/><em>агробізнесу</em></h1></div>
        <div className={styles.audience}><h2>ДЛЯ КОГО<br/>МИ ПРАЦЮЄМО</h2>{groups.map(g=><p key={g}>{g}</p>)}</div>
      </section>
      <section className={styles.services} id="services">
        <h2>Що ми <span>пропонуємо</span></h2>
        <p className={styles.lead}>Комплексний підхід до бухгалтерського обліку, податків,<br/> управління та розвитку агробізнесу.</p>
        <div className={styles.offerings}>{offerings.map(o=><article className={styles.offer} key={o.title}><div className={styles.offerHeading}><h3>{o.title}</h3></div><ul>{o.items.map(item=><li key={item}>{item}</li>)}</ul></article>)}</div>
      </section>
      <section className={styles.cta}><div className={styles.ctaCopy}><h2>Залиште заявку</h2><Link href="/#contacts">ЗАЛИШИТИ ЗАЯВКУ ↗</Link></div></section>
    </main>
  </div>;
}

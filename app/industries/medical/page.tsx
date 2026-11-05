import Link from "next/link";
import { ExpertiseHeader, expertiseFont } from "../../expertise/ExpertiseView";
import styles from "./medical.module.css";

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
  return <div className={`${styles.page} ${expertiseFont}`}>
    <ExpertiseHeader active="industries" />
    <main>
      <section className={styles.hero}>
        <div className={styles.heroArt} aria-hidden="true"><div className={styles.heroPhoto}/></div>
        <div className={styles.heroCopy}>
          <p className={styles.breadcrumb}>03 / Галузі / Медицина</p>
          <p className={styles.eyebrow}>МЕДИЦИНА</p>
          <h1>Податковий та консалтинговий супровід <em>медичного бізнесу</em></h1>
          <p className={styles.description}>АКЦ допомагає медичним закладам зосередитися на пацієнтах, а не на податках і організаційних питаннях. Ми допомагаємо обрати оптимальну модель оподаткування, налагодити фінансову аналітику та процеси, щоб ви бачили, які напрямки й послуги приносять прибуток, і спокійно розвивали клініку.</p>
          <div className={styles.heroBottom}><Link href="/#contacts" className={styles.button}>Залишити заявку <span aria-hidden="true">→</span></Link><div className={styles.keywords}><span>ФІНАНСИ</span><span>ПОДАТКИ</span><span>АНАЛІТИКА</span><span>РОЗВИТОК</span></div></div>
        </div>
      </section>
      <div className={styles.benefits}>{["РОЗУМІННЯ МЕДИЧНОЇ СПЕЦИФІКИ","КОМПЛЕКСНИЙ СУПРОВІД","ПРОЗОРІСТЬ ТА КОНТРОЛЬ","ФОКУС НА РОЗВИТОК ВАШОГО БІЗНЕСУ"].map((x,i)=><div className={styles.benefit} key={x}><span>{String(i+1).padStart(2,"0")}</span><p>{x}</p></div>)}</div>
      <section className={styles.section}>
        <div className={styles.sectionIntro}><h2>Для кого <em>ми працюємо</em></h2><p>Розуміємо специфіку кожного медичного напрямку — від приватних кабінетів до мережевих клінік.</p></div>
        <div className={styles.audiences}>{audiences.map(x=><article className={styles.audienceCard} key={x.title}><span className={styles.audienceIcon} aria-hidden="true">{x.icon}</span><p>{x.title}</p><span className={styles.circleArrow} aria-hidden="true">→</span></article>)}</div>
      </section>
      <section className={styles.section}>
        <div className={styles.sectionIntro}><h2>Що ми <em>пропонуємо</em></h2><p>Комплексний підхід до податкового супроводу, обліку та розвитку медичних закладів.</p></div>
        <div className={styles.services}>{services.map((s,i)=><article className={styles.serviceCard} key={s.title}><div className={styles.serviceTitle}><span className={styles.number}>{String(i+1).padStart(2,"0")}</span><span className={styles.serviceIcon} aria-hidden="true">{s.icon}</span><h3>{s.title}</h3></div><ul>{s.items.map(x=><li key={x}>{x}</li>)}</ul><div className={styles.serviceVisual}><span>{s.note}</span></div></article>)}</div>
      </section>
      <section className={styles.section}>
        <div className={styles.sectionIntro}><h2>Чому <em>обирають АКЦ</em></h2><p>Ми не просто ведемо облік, а стаємо надійним партнером для розвитку вашого медичного бізнесу.</p></div>
        <div className={styles.reasons}>{reasons.map(x=><article className={styles.reason} key={x.title}><span aria-hidden="true">{x.icon}</span><h3>{x.title}</h3><p>{x.text}</p></article>)}</div>
      </section>
      <section className={styles.cta}><div className={styles.ctaCopy}><p className={styles.eyebrow}>ПОЧИНАЄМО СПІВПРАЦЮ</p><h2><em>Залиште заявку,</em> і ми безкоштовно проаналізуємо ваш поточний стан обліку та запропонуємо оптимальний формат супроводу.</h2><Link href="/#contacts" className={styles.button}>Залишити заявку <span aria-hidden="true">→</span></Link></div><div className={styles.ctaFeatures}>{["ШВИДКА КОНСУЛЬТАЦІЯ","ІНДИВІДУАЛЬНИЙ ПІДХІД","КОНФІДЕНЦІЙНІСТЬ","РЕЗУЛЬТАТ ДЛЯ ВАШОГО БІЗНЕСУ"].map((x,i)=><p key={x}><span aria-hidden="true">{["◷","▥","◇","⚙"][i]}</span>{x}</p>)}</div></section>
    </main>
  </div>;
}

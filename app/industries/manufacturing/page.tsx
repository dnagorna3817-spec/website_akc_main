import { cmsText } from "../../lib/cms";
import Link from "next/link";
import { ExpertiseHeader, expertiseFont } from "../../expertise/ExpertiseView";
import styles from "./manufacturing.module.css";

const audiences = [
  { icon: "▥", title: "Промислові та виробничі підприємства (ТОВ, ПП)" },
  { icon: "♧", title: "Харчові, переробні та деревообробні виробництва" },
  { icon: "⚙", title: "Металообробка, машинобудування, виробництво будматеріалів" },
  { icon: "⬡", title: "Невеликі цехи та виробництва, що масштабуються" },
  { icon: "▣", title: "Підприємства з власною торгівлею та складською логістикою" },
];
const services = [
  { title: "Бухгалтерський аутсорсинг", items: [
    "Ведення бухгалтерського та податкового обліку з урахуванням специфіки виробництва",
    "Облік сировини, матеріалів, напівфабрикатів та готової продукції",
    "Калькуляція та облік собівартості, розподіл виробничих витрат",
    "Облік основних засобів, амортизації, ремонтів і давальницької сировини",
    "Розрахунок зарплати, у тому числі відрядної та за нормами виробітку",
    "Підготовка та подання податкової, фінансової та статистичної звітності",
  ]},
  { title: "Податковий супровід", items: [
    "Вибір та оптимізація системи оподаткування в межах законодавства",
    "Супровід питань ПДВ, імпорту сировини та експортних поставок",
    "Підготовка до перевірок, відповіді на запити контролюючих органів",
  ]},
  { title: "Консалтинг та разові послуги", items: [
    "Постановка та відновлення обліку, налагодження складського й виробничого обліку",
    "Аналіз собівартості та рентабельності продукції, бюджетування, фінансова модель",
    "Супровід залучення фінансування та участі в державних програмах підтримки виробників",
    "Розробка внутрішніх регламентів та оптимізація бізнес-процесів",
    "Реєстрація, зміни та реорганізація бізнесу",
  ]},
  { title: "Аудит", items: [
    "Ініціативний аудит фінансової звітності",
    "Підтвердження прозорості обліку для банків, інвесторів і партнерів",
  ]},
];

export default async function ManufacturingPage() {
  const cmsHeading = await cmsText("industries.manufacturing.heading", "виробничих підприємств");
  return <div className={`${styles.page} ${expertiseFont}`}>
    <ExpertiseHeader active="industries" />
    <nav aria-label="Навігація галузями" style={{position:"relative",zIndex:5,background:"#020c15",padding:"8px clamp(20px, 5vw, 64px) 4px"}}><Link href="/industries" style={{display:"inline-flex",alignItems:"center",gap:10,minHeight:44,color:"#9bd0f5",fontSize:11,fontWeight:600,letterSpacing:".12em",textDecoration:"none"}}><span aria-hidden="true" style={{display:"grid",placeItems:"center",width:30,height:30,border:"1px solid rgba(112,190,243,.55)",borderRadius:"50%",fontSize:20}}>←</span>УСІ ГАЛУЗІ</Link></nav>
    <main>
      <section className={styles.hero}>
        <div className={styles.heroArt} aria-hidden="true"><div className={styles.heroPhoto}/><div className={styles.triangle}/></div>
        <div className={styles.heroContent}>
          <p className={styles.kicker}>03 / Галузі / Виробництво</p>
          <p className={styles.eyebrow}>ВИРОБНИЦТВО</p>
          <h1>Бухгалтерський та<br/>консалтинговий супровід<br/><em data-cms-key="industries.manufacturing.heading">{cmsHeading}</em></h1>
          <p className={styles.heroDescription}>АКЦ забезпечує виробництву точний облік собівартості та прозорі фінанси. Ми беремо на себе облік, податки, звітність та управлінську аналітику, щоб ви бачили реальну рентабельність кожного виробу та приймали рішення на основі цифр.</p>
          <div className={styles.heroActions}><Link className={styles.primary} href="/#contacts" data-lead-cta>Залишити заявку <span aria-hidden="true">→</span></Link><span className={styles.heroKeywords}>ОБЛІК СОБІВАРТОСТІ<br/>АНАЛІТИКА<br/>СТАБІЛЬНИЙ РОЗВИТОК</span></div>
        </div>
      </section>
      <div className={styles.benefits}>{["ГЛИБОКЕ РОЗУМІННЯ ВИРОБНИЧИХ ПРОЦЕСІВ","КОМПЛЕКСНИЙ СУПРОВІД","ПРОЗОРІСТЬ І КОНТРОЛЬ","ФОКУС НА РОЗВИТОК ВАШОГО БІЗНЕСУ"].map((t,i)=><div className={styles.benefit} key={t}><span>{String(i+1).padStart(2,"0")}</span><p>{t}</p></div>)}</div>
      <section className={styles.audience}>
        <div className={styles.sectionIntro}><h2>Для кого <em>ми працюємо</em></h2><p>Розуміємо специфіку кожного етапу виробництва — від закупівлі сировини до готової продукції.</p></div>
        <div className={styles.audienceGrid}>{audiences.map(a=><article className={styles.audienceCard} key={a.title}><span className={styles.audienceIcon} aria-hidden="true">{a.icon}</span><p>{a.title}</p><span className={styles.circleArrow} aria-hidden="true">→</span></article>)}</div>
      </section>
      <section className={styles.services}>
        <div className={styles.sectionIntro}><h2>Що ми <em>пропонуємо</em></h2><p>Комплексний підхід до бухгалтерського обліку, податків, управління та розвитку виробничих підприємств.</p></div>
        <div className={styles.serviceList}>{services.map((s,i)=><article className={styles.serviceCard} key={s.title}><div className={styles.serviceHeading}><span className={styles.serviceNumber}>{String(i+1).padStart(2,"0")}</span><h3>{s.title}</h3></div><ul>{s.items.map(item=><li key={item}>{item}</li>)}</ul>{(i===0||i===2)&&<div className={styles.serviceImage} aria-hidden="true"/>}</article>)}</div>
      </section>
      <section className={styles.cta}><div className={styles.ctaContent}><p className={styles.eyebrow}>ПОЧНІМО СПІВПРАЦЮ</p><h2><em>Залиште заявку,</em> і ми безкоштовно проаналізуємо ваш поточний стан обліку та запропонуємо оптимальний формат супроводу.</h2><Link className={styles.primary} href="/#contacts" data-lead-cta>Залишити заявку <span aria-hidden="true">→</span></Link></div></section>
    </main>
  </div>;
}

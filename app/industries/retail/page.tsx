import Link from "next/link";
import { ExpertiseHeader, expertiseFont } from "../../expertise/ExpertiseView";
import styles from "./retail.module.css";

const audiences = [
  {icon:"🛒",title:"Магазини та мережі магазинів (продукти, одяг, побутова техніка, непродовольчі товари)"},
  {icon:"▱",title:"Інтернет-магазини та маркетплейс-продавці"},
  {icon:"▥",title:"Аптеки, АЗС, торгові точки з касовими апаратами та РРО"},
  {icon:"▣",title:"ФОП та ТОВ, що поєднують роздріб, опт та онлайн-продажі"},
  {icon:"♧",title:"Франшизи та локальні торгові мережі, що масштабуються"}
];
const services = [
  {icon:"▤",title:"Бухгалтерський аутсорсинг",items:[
    "Ведення бухгалтерського та податкового обліку з урахуванням специфіки роздрібної торгівлі",
    "Облік товарних запасів, закупівель, переоцінок, націнок і списань",
    "Облік касових операцій, РРО/ПРРО, еквайрингу та денних виручок по точках",
    "Облік продажів через маркетплейси, інтернет-магазини та інтеграції з обліковими системами",
    "Облік імпорту товарів та розрахунків із постачальниками",
    "Розрахунок зарплати продавців і касирів, супровід кадрового діловодства",
    "Підготовка та подання податкової, фінансової та статистичної звітності"]},
  {icon:"%",title:"Податковий супровід",items:[
    "Вибір та оптимізація системи оподаткування в межах законодавства",
    "Консультації з ПДВ, ПРРО, ліцензій та патентів на окремі види товарів",
    "Підготовка до перевірок, відповіді на запити контролюючих органів"]},
  {icon:"▥",title:"Консалтинг та разові послуги",items:[
    "Постановка та відновлення обліку, налагодження товарного та касового обліку",
    "Аналіз рентабельності товарних груп і торгових точок, бюджетування, фінансова модель",
    "Розробка внутрішніх регламентів та оптимізація бізнес-процесів",
    "Реєстрація, зміни, відкриття нових точок, реорганізація бізнесу"]},
  {icon:"◇",title:"Аудит",items:[
    "Ініціативний аудит фінансової звітності",
    "Підтвердження прозорості обліку для банків, інвесторів і партнерів"]}
];
const reasons=[
  {icon:"♧",title:"Команда фахівців",text:"За вашим бізнесом стоїть не одна людина, а відділ: облік не зупиняється через відпустку чи хворобу."},
  {icon:"◎",title:"Координація й контроль",text:"Кожен клієнт має закріпленого спеціаліста та координатора, а робота ведеться за чіткими регламентами."},
  {icon:"▣",title:"Розуміння специфіки роздрібу",text:"Ми працюємо з великою кількістю дрібних операцій, сезонними піками та інвентаризаціями, а не лише зі звітністю."},
  {icon:"▢",title:"Повний спектр послуг в одному місці",text:"Облік, податки та консалтинг: не потрібно шукати кількох підрядників."}
];
export default function RetailPage(){
 return <div className={`${styles.page} ${expertiseFont}`}>
  <ExpertiseHeader active="industries"/>
  <main>
   <section className={styles.agroStyleHero}>
    <div className={styles.agroStyleArt} aria-hidden="true"><img src="/media/retail-hero-triangle.png" alt="" className={styles.agroStyleImage} /></div>
    <div className={styles.agroStyleCopy}>
     <span>РОЗДРІБНА ТОРГІВЛЯ</span>
     <h1>Бухгалтерський та<br/>консалтинговий супровід<br/><em>роздрібної торгівлі</em></h1>
    </div>
    <div className={styles.agroStyleAudience}>
     <h2>ДЛЯ КОГО<br/>МИ ПРАЦЮЄМО</h2>
     <p>Магазини та торговельні мережі</p>
     <p>Інтернет-магазини та маркетплейси</p>
     <p>Аптеки, АЗС та торгові точки з РРО</p>
     <p>Франшизи й мережі, що масштабуються</p>
    </div>
   </section>
   <div className={styles.benefits}>{["ГЛИБОКЕ РОЗУМІННЯ РИТЕЙЛУ","КОМПЛЕКСНИЙ СУПРОВІД","ПРОЗОРІСТЬ ТА КОНТРОЛЬ","ФОКУС НА РОЗВИТОК ВАШОГО БІЗНЕСУ"].map((x,i)=><div className={styles.benefit} key={x}><span>{String(i+1).padStart(2,"0")}</span><p>{x}</p></div>)}</div>
   <section className={styles.section}><div className={styles.sectionIntro}><h2>Для кого <em>ми працюємо</em></h2><p>Розуміємо специфіку роздрібної торгівлі — від локальних магазинів до масштабних мереж.</p></div><div className={styles.audienceGrid}>{audiences.map(x=><article className={styles.audienceCard} key={x.title}><span className={styles.audienceIcon} aria-hidden="true">{x.icon}</span><p>{x.title}</p><span className={styles.circleArrow} aria-hidden="true">→</span></article>)}</div></section>
   <section className={styles.section}><div className={styles.sectionIntro}><h2>Що ми <em>пропонуємо</em></h2><p>Комплексний підхід до бухгалтерського обліку, податків та розвитку роздрібної торгівлі.</p></div><div className={styles.serviceList}>{services.map((s,i)=><article className={styles.serviceCard} key={s.title}><div className={styles.serviceHeading}><span className={styles.number}>{String(i+1).padStart(2,"0")}</span><span className={styles.serviceIcon} aria-hidden="true">{s.icon}</span><h3>{s.title}</h3></div><ul>{s.items.map(x=><li key={x}>{x}</li>)}</ul></article>)}</div></section>
   <section className={styles.section}><div className={styles.sectionIntro}><h2>Чому <em>обирають АКЦ</em></h2><p>Ми не просто ведемо облік, а стаємо надійним партнером для зростання вашого ритейл-бізнесу.</p></div><div className={styles.reasons}>{reasons.map(x=><article className={styles.reason} key={x.title}><span aria-hidden="true">{x.icon}</span><h3>{x.title}</h3><p>{x.text}</p></article>)}</div></section>
   <section className={styles.cta}><div><p className={styles.eyebrow}>ПОЧНІМО СПІВПРАЦЮ</p><h2><em>Залиште заявку,</em> і ми безкоштовно проаналізуємо ваш поточний стан обліку та запропонуємо оптимальний формат супроводу.</h2><Link className={styles.primary} href="/#contacts">Залишити заявку <span aria-hidden="true">→</span></Link></div><div className={styles.ctaRight}><p>◷ &nbsp; ШВИДКА КОНСУЛЬТАЦІЯ</p><p>▥ &nbsp; ІНДИВІДУАЛЬНИЙ ПІДХІД</p><p>◇ &nbsp; КОНФІДЕНЦІЙНІСТЬ</p><p>⚙ &nbsp; РЕЗУЛЬТАТ ДЛЯ ВАШОГО БІЗНЕСУ</p></div></section>
  </main>
 </div>
}
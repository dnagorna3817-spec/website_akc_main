import Link from "next/link";
import { ExpertiseHeader, expertiseFont } from "../../expertise/ExpertiseView";
import styles from "./retail.module.css";

const audience = [
  {icon:"▤",title:"Магазини та мережі роздрібної торгівлі"},
  {icon:"♙",title:"Інтернет-магазини та e-commerce"},
  {icon:"▣",title:"Дистриб’ютори та торговельні компанії"},
  {icon:"⌑",title:"Магазини одягу, косметики та товарів для дому"},
  {icon:"▧",title:"ФОП і ТОВ із власними торговими точками"}
];
const services = [
 {icon:"▤",title:"Бухгалтерський аутсорсинг",items:["Ведення бухгалтерського та податкового обліку торговельних підприємств","Облік товарних залишків, закупівель, продажів і повернень","Облік доходів за касовими операціями, РРО та ПРРО","Контроль взаєморозрахунків із постачальниками й покупцями","Розрахунок зарплати та кадровий супровід","Підготовка фінансової, податкової та статистичної звітності"]},
 {icon:"%",title:"Податковий супровід",items:["Вибір та оптимізація системи оподаткування в межах законодавства","Консультації з ПДВ, імпорту товарів та онлайн-продажів","Підготовка до перевірок і відповіді на запити контролюючих органів"]},
 {icon:"▥",title:"Консалтинг та разові послуги",items:["Постановка та відновлення обліку, налагодження товарного обліку","Аналіз маржинальності, рентабельності й оборотності запасів","Фінансове планування та управлінська звітність","Оптимізація внутрішніх процесів і документообігу"]},
 {icon:"⬡",title:"Аудит",items:["Ініціативний аудит фінансової звітності","Перевірка товарних операцій, обліку та внутрішнього контролю"]}
];
export default function RetailPage(){
return <div className={`${styles.page} ${expertiseFont}`}>
 <ExpertiseHeader active="industries"/>
 <main>
 <section className={styles.hero}>
 <div className={styles.heroArt} aria-hidden="true"><div className={styles.trianglePhoto}/><div className={styles.triangleEdge}/></div>
 <div className={styles.heroCopy}>
 <p className={styles.kicker}>03 / Галузі / Роздрібна торгівля</p>
 <p className={styles.eyebrow}>РОЗДРІБНА ТОРГІВЛЯ</p>
 <h1>Бухгалтерський та<br/>консалтинговий супровід<br/>компаній у сфері <em>торгівлі</em></h1>
 <p className={styles.lead}>АКЦ допомагає торговельному бізнесу працювати без зайвого навантаження. Ми беремо на себе облік, податки, звітність та фінансову аналітику, щоб ви могли контролювати товарні залишки, бачити прибутковість і масштабувати продажі.</p>
 <div className={styles.actions}><Link className={styles.button} href="/#contacts">Залишити заявку <span>→</span></Link><p className={styles.keywords}>ТОВАРНИЙ ОБЛІК<br/>ПОДАТКИ<br/>ФІНАНСОВА АНАЛІТИКА<br/>РОЗВИТОК</p></div>
 </div></section>
 <div className={styles.benefits}>{["РОЗУМІННЯ СПЕЦИФІКИ ТОРГОВЕЛЬНОГО БІЗНЕСУ","КОМПЛЕКСНИЙ СУПРОВІД","ПРОЗОРІСТЬ ТА КОНТРОЛЬ","ФОКУС НА РОЗВИТОК ВАШОГО БІЗНЕСУ"].map((v,i)=><div key={v}><span>{String(i+1).padStart(2,"0")}</span><p>{v}</p></div>)}</div>
 <section className={styles.section}><div className={styles.intro}><h2>Для кого <em>ми працюємо</em></h2><p>Розуміємо специфіку торгівлі — від закупівель і складського обліку до продажів та роботи з клієнтами.</p></div>
 <div className={styles.audience}>{audience.map(a=><article key={a.title}><span className={styles.audienceIcon}>{a.icon}</span><p>{a.title}</p><span className={styles.arrow}>→</span></article>)}</div></section>
 <section className={styles.section}><div className={styles.intro}><h2>Що ми <em>пропонуємо</em></h2><p>Комплексний підхід до бухгалтерського обліку, податків та розвитку торговельних компаній.</p></div>
 <div className={styles.serviceList}>{services.map((s,i)=><article key={s.title} className={styles.service}><span className={styles.number}>{String(i+1).padStart(2,"0")}</span><span className={styles.serviceIcon}>{s.icon}</span><h3>{s.title}</h3><ul>{s.items.map(t=><li key={t}>{t}</li>)}</ul></article>)}</div></section>
 <section className={styles.cta}><div className={styles.ctaArt} aria-hidden="true"/><div className={styles.ctaContent}><p className={styles.eyebrow}>ПОЧНІМО СПІВПРАЦЮ</p><h2><em>Залиште заявку,</em> і ми безкоштовно проаналізуємо ваш поточний стан обліку та запропонуємо оптимальний формат супроводу.</h2><Link className={styles.button} href="/#contacts">Залишити заявку <span>→</span></Link></div><div className={styles.ctaBenefits}>{["◷|ШВИДКА КОНСУЛЬТАЦІЯ","▥|ІНДИВІДУАЛЬНИЙ ПІДХІД","⬡|КОНФІДЕНЦІЙНІСТЬ","⚙|РЕЗУЛЬТАТ ДЛЯ ВАШОГО БІЗНЕСУ"].map(t=><div key={t}><b>{t.split("|")[0]}</b><span>{t.split("|")[1]}</span></div>)}</div></section>
 </main></div>
}
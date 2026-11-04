import Link from "next/link";
import { ExpertiseHeader, expertiseFont } from "../../expertise/ExpertiseView";
import styles from "./services.module.css";

const audiences = [
  { icon: "laptop", title: "IT-компанії, маркетингові та креативні агенції" },
  { icon: "users", title: "Консалтингові, юридичні та освітні компанії" },
  { icon: "truck", title: "Логістичні, транспортні та туристичні компанії" },
  { icon: "coffee", title: "Медичні, б’юті та HoReCa-бізнеси" },
  { icon: "file", title: "ФОП та ТОВ, що надають послуги за договорами з постійними та разовими клієнтами" },
];
const services = [
  {icon:"file",title:"Бухгалтерський аутсорсинг",items:["Ведення бухгалтерського та податкового обліку з урахуванням специфіки сфери послуг","Облік доходів за договорами, актами виконаних робіт та підписками","Облік розрахунків із клієнтами, підрядниками та фрилансерами","Облік роботи з нерезидентами, валютних надходжень і міжнародних платежів","Розрахунок зарплати та супровід кадрового діловодства","Підготовка та подання податкової, фінансової та статистичної звітності"]},
  {icon:"percent",title:"Податковий супровід",items:["Вибір та оптимізація системи оподаткування (спрощена система, загальна система, зміна статусу) в межах законодавства","Консультації з ПДВ, роботи з іноземними замовниками та ліцензійних і авторських платежів","Підготовка до перевірок, відповіді на запити контролюючих органів"]},
  {icon:"chart",title:"Консалтинг та разові послуги",items:["Постановка та відновлення обліку, налагодження документообігу з клієнтами","Аналіз рентабельності послуг і клієнтів, бюджетування, фінансова модель","Розробка внутрішніх регламентів та оптимізація бізнес-процесів","Реєстрація, зміни, реорганізація та ліквідація бізнесу"]},
  {icon:"shield",title:"Аудит",items:["Ініціативний аудит фінансової звітності","Підтвердження прозорості обліку для банків, інвесторів і партнерів"]},
];
function Icon({name}:{name:string}) {
  const common={fill:"none",stroke:"currentColor",strokeWidth:1.7,strokeLinecap:"round" as const,strokeLinejoin:"round" as const};
  const shapes:Record<string,React.ReactNode>={
    laptop:<><rect x="4" y="5" width="24" height="17" rx="1"/><path d="M2 26h28l-2-4H4z"/></>,
    users:<><circle cx="16" cy="8" r="4"/><path d="M8 25v-4c0-5 3-7 8-7s8 2 8 7v4zM5 12a4 4 0 0 1 4-6M4 17c-2 1-3 3-3 6v2h5M27 12a4 4 0 0 0-4-6M28 17c2 1 3 3 3 6v2h-5"/></>,
    truck:<><path d="M2 7h18v17H2zM20 13h6l4 5v6H20z"/><circle cx="8" cy="25" r="3"/><circle cx="25" cy="25" r="3"/></>,
    coffee:<><path d="M5 12h19v8a9 9 0 0 1-18 0v-8zM24 14h3a4 4 0 0 1 0 8h-4M4 29h22M10 3c-3 3 3 4 0 7M17 3c-3 3 3 4 0 7"/></>,
    file:<><path d="M7 2h12l7 7v21H7zM19 2v8h7M11 16h11M11 21h11M11 26h8"/></>,
    percent:<><circle cx="9" cy="9" r="4"/><circle cx="23" cy="23" r="4"/><path d="M26 6 6 26"/></>,
    chart:<><path d="M3 29h27M6 25V15h5v10M14 25V9h5v16M22 25V3h5v22"/></>,
    shield:<><path d="M16 2 28 7v9c0 8-5 12-12 15C9 28 4 24 4 16V7zM10 16l4 4 8-9"/></>,
    clock:<><circle cx="16" cy="16" r="13"/><path d="M16 7v10l6 4"/></>,
    gear:<><circle cx="16" cy="16" r="5"/><path d="M13 2h6l1 4 3 1 4-2 4 5-3 4v4l3 4-4 5-4-2-3 1-1 4h-6l-1-4-3-1-4 2-4-5 3-4v-4l-3-4 4-5 4 2 3-1z"/></>,
  };
  return <svg viewBox="0 0 32 32" width="36" height="36" aria-hidden="true" {...common}>{shapes[name]}</svg>;
}
export default function ServicesIndustryPage(){
 return <div className={`${styles.page} ${expertiseFont}`}>
  <ExpertiseHeader active="industries"/>
  <main>
   <section className={styles.hero}>
    <div className={styles.heroVisual} aria-hidden="true"><div className={styles.heroPhoto}/><div className={styles.heroOutline}/></div>
    <div className={styles.heroText}>
     <p className={styles.breadcrumb}>03 / Галузі / Послуги</p>
     <p className={styles.eyebrow}>ПОСЛУГИ</p>
     <h1>Бухгалтерський та<br/>консалтинговий супровід<br/>компаній у сфері <em>послуг</em></h1>
     <p className={styles.lead}>АКЦ допомагає сервісному бізнесу працювати без паперового навантаження. Ми беремо на себе облік, податки, звітність та фінансову аналітику, щоб ви бачили, які послуги й клієнти приносять прибуток, і могли масштабувати бізнес.</p>
     <div className={styles.heroBottom}><Link className={styles.button} href="/#contacts">Залишити заявку <span>→</span></Link><p className={styles.keywords}>ОБЛІК<br/>ПОДАТКИ<br/>ФІНАНСОВА АНАЛІТИКА<br/>РОЗВИТОК</p></div>
    </div>
   </section>
   <div className={styles.benefits}>{["РОЗУМІННЯ СПЕЦИФІКИ СЕРВІСНОГО БІЗНЕСУ","КОМПЛЕКСНИЙ СУПРОВІД","ПРОЗОРІСТЬ ТА КОНТРОЛЬ","ФОКУС НА РОЗВИТОК ВАШОГО БІЗНЕСУ"].map((b,i)=><div key={b}><span>{String(i+1).padStart(2,"0")}</span><p>{b}</p></div>)}</div>
   <section className={styles.contentSection}><div className={styles.sectionTitle}><h2>Для кого <em>ми працюємо</em></h2><p>Розуміємо специфіку сервісного бізнесу —<br/>від локальних компаній до міжнародних команд.</p></div><div className={styles.audienceGrid}>{audiences.map(a=><article key={a.title} className={styles.audienceCard}><Icon name={a.icon}/><p>{a.title}</p><span className={styles.circleArrow}>→</span></article>)}</div></section>
   <section className={styles.contentSection}><div className={styles.sectionTitle}><h2>Що ми <em>пропонуємо</em></h2><p>Комплексний підхід до бухгалтерського обліку, податків<br/>та розвитку компаній у сфері послуг.</p></div><div className={styles.servicesList}>{services.map((s,i)=><article key={s.title} className={styles.serviceRow}><span className={styles.serviceNumber}>{String(i+1).padStart(2,"0")}</span><span className={styles.serviceIcon}><Icon name={s.icon}/></span><h3>{s.title}</h3><ul>{s.items.map(t=><li key={t}>{t}</li>)}</ul></article>)}</div></section>
   <section className={styles.cta}><div className={styles.ctaGeometry} aria-hidden="true"/><div className={styles.ctaCopy}><p className={styles.eyebrow}>ПОЧНІМО СПІВПРАЦЮ</p><h2><em>Залиште заявку,</em> і ми безкоштовно проаналізуємо ваш поточний стан обліку та запропонуємо оптимальний формат супроводу.</h2><Link className={styles.button} href="/#contacts">Залишити заявку <span>→</span></Link></div><div className={styles.ctaAside}>{[{icon:"clock",text:"ШВИДКА КОНСУЛЬТАЦІЯ"},{icon:"chart",text:"ІНДИВІДУАЛЬНИЙ ПІДХІД"},{icon:"shield",text:"КОНФІДЕНЦІЙНІСТЬ"},{icon:"gear",text:"РЕЗУЛЬТАТ ДЛЯ ВАШОГО БІЗНЕСУ"}].map(x=><div key={x.text}><Icon name={x.icon}/><span>{x.text}</span></div>)}</div></section>
  </main>
 </div>
}
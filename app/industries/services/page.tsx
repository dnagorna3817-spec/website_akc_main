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
export default function ServicesIndustryPage() {
 return <div className={`${styles.page} ${expertiseFont}`}>
  <ExpertiseHeader active="industries"/>
  <main>
   <section className={styles.hero}>
    <div className={styles.art} aria-hidden="true"/>
    <div className={styles.heroCopy}>
     <span>ПОСЛУГИ</span>
     <h1>Бухгалтерський та{" "}консалтинговий супровід{" "}<em>компаній у сфері послуг</em></h1>
     <p className={styles.heroDescription}>АКЦ допомагає сервісному бізнесу працювати без паперового навантаження. Ми беремо на себе облік, податки, звітність та фінансову аналітику, щоб ви могли зосередитися на розвитку бізнесу.</p>
    </div>
    <div className={styles.audience}>
     <h2 style={{fontSize:"14px",fontWeight:600,margin:0,padding:"14px 12px",alignSelf:"center"}}>ДЛЯ КОГО<br/>МИ ПРАЦЮЄМО</h2>
     {audiences.map(a=><p key={a.title} style={{fontSize:"12px",lineHeight:1.45,color:"#c5d1de",margin:0,padding:"14px 12px",borderLeft:"1px solid rgba(106,165,211,.3)",display:"flex",alignItems:"center",overflowWrap:"anywhere"}}>{a.title}</p>)}
    </div>
   </section>
   <section className={styles.services} id="services" style={{width:"min(1180px,88%)",margin:"20px auto 100px",paddingTop:"42px",borderTop:"1px solid rgba(109,173,219,.28)"}}>
    <h2>Що ми <span>пропонуємо</span></h2>
    <p className={styles.lead}>Комплексний підхід до бухгалтерського обліку, податків,<br/>управління та розвитку компаній у сфері послуг.</p>
    <div className={styles.offerings} style={{display:"grid",gap:"16px"}}>{services.map(o=><article className={styles.offer} key={o.title} >
     <div className={styles.offerHeading}><h3>{o.title}</h3></div>
     <ul>{o.items.map(item=><li key={item}>{item}</li>)}</ul>
    </article>)}</div>
   </section>
   <section className={styles.cta}><div className={styles.ctaArt} aria-hidden="true"><span className={styles.ribbonOne}/><span className={styles.ribbonTwo}/></div><div className={styles.ctaCopy}><span className={styles.ctaEyebrow}>ПОЧНІМО СПІВПРАЦЮ</span><h2><span>Залиште заявку,</span> і ми безкоштовно проаналізуємо ваш поточний стан обліку та запропонуємо оптимальний формат супроводу.</h2><Link href="/#contacts" data-lead-cta>Залишити заявку <span aria-hidden="true">⟶</span></Link></div></section>
  </main>
 </div>;
}

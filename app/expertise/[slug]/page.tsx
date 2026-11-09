import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow, expertiseFont, ExpertiseHeader } from "../ExpertiseView";
import { services } from "../services";
import styles from "../expertise.module.css";
import audit from "./audit.module.css";
import qualification from "./qualification.module.css";
import CertificateShowcase from "./CertificateShowcase";

export const dynamicParams = false;
export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  return { title: `${service?.name ?? "Послуга"} — АКЦ`, description: service?.intro };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();

  if (slug === "audit") {
    const cases = [
      ["01","Розширення бізнесу","Оцініть фінансові ризики перед масштабуванням."],
      ["02","Зміна партнерів","Отримайте незалежний погляд на стан компанії."],
      ["03","Кредит або грант","Підготуйтеся до розмови з фінансовими партнерами."],
      ["04","Контроль ризиків","Виявляйте помилки обліку й слабкі місця."],
    ];
    const stages = [
      ["01","Знайомство","Обговорюємо запит та цілі."],
      ["02","Планування","Узгоджуємо обсяг, строки й документи."],
      ["03","Перевірка","Аналізуємо фінансову інформацію."],
      ["04","Результати","Представляємо висновки та рекомендації."],
    ];
    return <div className={styles.page + " " + expertiseFont + " " + audit.page}>
      <ExpertiseHeader />
      <main>
        <section className={audit.hero}>
          <div className={audit.heroText}>
            
            <p className={audit.kicker}>НЕЗАЛЕЖНА ФІНАНСОВА ЕКСПЕРТИЗА</p>
            <h1>Аудит, що дає <span>впевненість у рішеннях.</span></h1>
            <p className={audit.lead}>{service.intro}</p>
            <div className={audit.actions}><a href="#consultation" className={audit.primary}>Обговорити аудит <Arrow /></a><a href="#process" className={audit.secondary}>Як ми працюємо <Arrow /></a></div>
          </div>
          <div className={audit.visual} aria-hidden="true"><div className={audit.halo}/><Image src="/akc-expertise-geometry.png" alt="" width={793} height={816} priority className={audit.geometry}/><span>АКЦ / AUDIT EXPERTISE</span></div>
        </section>
        <div className={audit.values}><span>01 / Незалежна оцінка</span><span>02 / Контроль ризиків</span><span>03 / Рекомендації для рішень</span></div>
        <section className={audit.section}>
          <p className={audit.kicker}>01 / НАПРЯМ АУДИТУ</p><h2>Ясність у фінансах. <span>Впевненість у діях.</span></h2>
          <article className={audit.feature}><div className={audit.featureCopy}><p className={audit.kicker}>ІНІЦІАТИВНИЙ АУДИТ</p><h3>Незалежний погляд на ваш бізнес</h3><p>{service.description}</p><div className={audit.featureActions}><a className={audit.featurePrimary} href="#consultation">Обговорити завдання <Arrow /></a><a className={audit.featureMore} href="#process">Детальніше</a></div></div><div className={audit.featureSymbol} aria-hidden="true" /></article>
        </section>
        <section className={audit.section}><p className={audit.kicker}>02 / КОЛИ ПОТРІБЕН АУДИТ</p><h2>Важливі рішення<br /><span>потребують ясності.</span></h2><div className={audit.cards}>{cases.map(([n,title,desc])=><article className={audit.card} key={n}><h3>{title}</h3><p>{desc}</p></article>)}</div></section>
        <section className={audit.section} id="process"><p className={audit.kicker}>03 / ПРОЦЕС</p><h2>Від запиту <span>до конкретних висновків.</span></h2><div className={audit.timeline}>{stages.map(([n,title,desc])=><article key={n}><span>{n}</span><h3>{title}</h3><p>{desc}</p></article>)}</div></section>
        <section className={audit.section}><p className={audit.kicker}>04 / РЕЗУЛЬТАТ</p><h2>Не просто перевірка. <span>Основа для рішень.</span></h2><div className={audit.result}><div><h3>Зрозумілі висновки та наступні кроки</h3><p>Допомагаємо побачити фінансову картину, визначити ризики та сформувати практичні рекомендації.</p></div><ul><li>Незалежна оцінка фінансової інформації</li><li>Виявлені ризики та проблемні ділянки</li><li>Практичні рекомендації для бізнесу</li></ul></div></section>
        <section className={audit.cta} id="consultation" aria-labelledby="audit-contact-title">
          <div className={audit.ctaTopline}><span>АКЦ / ПЕРШИЙ КРОК</span></div>
          <div className={audit.ctaBody}>
            <div className={audit.ctaCopy}>
              <h2 id="audit-contact-title">За кожним рішенням <span>стоїть впевненість.</span></h2>
              <p>Допоможемо побачити повну фінансову картину, оцінити ризики та визначити наступний крок для вашого бізнесу.</p>
            </div>

          </div>
          <div className={audit.ctaBottom}>
            <div><strong>Почнімо з вашого завдання</strong><p>Обговоримо можливості співпраці</p></div>
            <Link href="/about" className={audit.ctaButton}>Зв’язатися з АКЦ <Arrow /></Link>
          </div>
        </section>
        <footer className={audit.footer}><Link href="/expertise">← Усі напрями експертизи</Link></footer>
      </main>
    </div>;
  }
  if (slug === "accounting") {
    const accountingAreas = [
      ["Юридичні особи", "Облік, звітність і супровід діяльності компанії."],
      ["ФОП", "Ведення обліку та звітності для підприємців."],
      ["Зарплатний проєкт", "Розрахунки, нарахування та супровід виплат."],
      ["Кадровий і військовий облік", "Організація та ведення необхідної документації."],
    ];
    const accountingSteps = [
      ["01", "Знайомство", "Вивчаємо ваш бізнес, задачі та поточні процеси."],
      ["02", "Аналіз", "Оцінюємо обсяг обліку, документи та потреби."],
      ["03", "Супровід", "Організовуємо регулярний облік і звітність."],
      ["04", "Контроль", "Допомагаємо підтримувати порядок у фінансових процесах."],
    ];
    return <div className={styles.page + " " + expertiseFont + " " + audit.page + " " + audit.accountingPage}>
      <ExpertiseHeader />
      <main>
        <section className={audit.hero}>
          <div className={audit.heroText}>
            <p className={audit.kicker}>БУХГАЛТЕРСЬКИЙ СУПРОВІД / АКЦ</p>
            <h1>Облік без <span>зайвої складності.</span></h1>
            <p className={audit.lead}>{service.intro}</p>
            <div className={audit.actions}>
              <a href="#consultation" className={audit.primary}>Обговорити співпрацю <Arrow /></a>
              <a href="#services" className={audit.secondary}>Наші послуги <Arrow /></a>
            </div>
          </div>
        </section>
        <div className={audit.values}>
          <span>01 / Точність обліку</span><span>02 / Своєчасна звітність</span><span>03 / Менше рутини</span>
        </div>
        <section className={audit.section} id="services">
          <p className={audit.kicker}>01 / БУХГАЛТЕРСЬКИЙ СУПРОВІД</p>
          <h2>Порядок у цифрах. <span>Свобода для бізнесу.</span></h2>
          <article className={audit.feature}>
            <div className={audit.featureCopy}>
              <p className={audit.kicker}>КОМПЛЕКСНИЙ СУПРОВІД</p>
              <h3>{service.section}</h3>
              <p>{service.description}</p>
              <div className={audit.featureActions}>
                <a className={audit.featurePrimary} href="#consultation">Обговорити завдання <Arrow /></a>
                <a className={audit.featureMore} href="#areas">Напрями роботи</a>
              </div>
            </div>
          </article>
        </section>
        <section className={audit.section} id="areas">
          <p className={audit.kicker}>02 / НАПРЯМИ РОБОТИ</p>
          <h2>Ваші процеси <span>під контролем.</span></h2>
          <div className={audit.cards}>
            {accountingAreas.map(([title, description]) => <article className={audit.card} key={title}><h3>{title}</h3><p>{description}</p></article>)}
          </div>
        </section>
        <section className={audit.section} id="process">
          <p className={audit.kicker}>03 / ЯК МИ ПРАЦЮЄМО</p>
          <h2>Від першої розмови <span>до системної роботи.</span></h2>
          <div className={audit.timeline}>
            {accountingSteps.map(([number, title, description]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}
          </div>
        </section>
        <section className={audit.section}>
          <p className={audit.kicker}>04 / РЕЗУЛЬТАТ</p>
          <h2>Менше рутини. <span>Більше контролю.</span></h2>
          <div className={audit.result}>
            <div><h3>Облік, на який можна покластися</h3><p>Допомагаємо впорядкувати бухгалтерські процеси, своєчасно готувати звітність і зосередитися на розвитку бізнесу.</p></div>
            <ul>{service.details.map(item => <li key={item}>{item}</li>)}</ul>
          </div>
        </section>
        <section className={audit.cta} id="consultation" aria-labelledby="accounting-contact-title">
          <div className={audit.ctaTopline}><span>АКЦ / ПЕРШИЙ КРОК</span></div>
          <div className={audit.ctaBody}><div className={audit.ctaCopy}>
            <h2 id="accounting-contact-title">Ваш бізнес заслуговує <span>на простий облік.</span></h2>
            <p>Розкажіть про свої задачі — допоможемо визначити відповідний формат бухгалтерського супроводу.</p>
          </div></div>
          <div className={audit.ctaBottom}>
            <div><strong>Почнімо з вашого завдання</strong><p>Обговоримо можливості співпраці</p></div>
            <Link href="/about" className={audit.ctaButton}>Зв’язатися з АКЦ <Arrow /></Link>
          </div>
        </section>
        <footer className={audit.footer}><Link href="/expertise">← Усі напрями експертизи</Link></footer>
      </main>
    </div>;
  }
  if (slug === "consulting") {
    const consultingAreas = [
      [
            "Бухгалтерський консалтинг",
            "Експертні рішення щодо обліку та звітності."
      ],
      [
            "Податковий консалтинг",
            "Аналіз податкових питань та можливих ризиків."
      ],
      [
            "Фінансове планування",
            "Допомога з бюджетуванням та фінансовими рішеннями."
      ],
      [
            "Супровід змін",
            "Підтримка під час трансформації бізнес-процесів."
      ]
];
    const consultingSteps = [
      [
            "01",
            "Запит",
            "Визначаємо бізнес-задачу та очікуваний результат."
      ],
      [
            "02",
            "Діагностика",
            "Аналізуємо дані, процеси й обмеження."
      ],
      [
            "03",
            "Рішення",
            "Формуємо рекомендації та план дій."
      ],
      [
            "04",
            "Впровадження",
            "Супроводжуємо зміни та оцінюємо результат."
      ]
];
    return <div className={styles.page + " " + expertiseFont + " " + audit.page + " " + audit.accountingPage}>
      <ExpertiseHeader />
      <main>
        <section className={audit.hero}>
          <div className={audit.heroText}>
            <p className={audit.kicker}>КОНСАЛТИНГ / АКЦ</p>
            <h1>Від питання <span>до рішення.</span></h1>
            <p className={audit.lead}>{service.intro}</p>
            <div className={audit.actions}>
              <a href="#consultation" className={audit.primary}>Обговорити завдання <Arrow /></a>
              <a href="#services" className={audit.secondary}>Наші послуги <Arrow /></a>
            </div>
          </div>
        </section>
        <div className={audit.values}>
          <span>01 / Експертний аналіз</span><span>02 / Практичні рішення</span><span>03 / Супровід змін</span>
        </div>
        <section className={audit.section} id="services">
          <p className={audit.kicker}>01 / БІЗНЕС-КОНСАЛТИНГ</p>
          <h2>Складні питання. <span>Чіткі відповіді.</span></h2>
          <article className={audit.feature}>
            <div className={audit.featureCopy}>
              <p className={audit.kicker}>ЕКСПЕРТНА ПІДТРИМКА</p>
              <h3>{service.section}</h3>
              <p>{service.description}</p>
              <div className={audit.featureActions}>
                <a className={audit.featurePrimary} href="#consultation">Обговорити завдання <Arrow /></a>
                <a className={audit.featureMore} href="#areas">Напрями роботи</a>
              </div>
            </div>
          </article>
        </section>
        <section className={audit.section} id="areas">
          <p className={audit.kicker}>02 / НАПРЯМИ РОБОТИ</p>
          <h2>Ваші рішення <span>мають основу.</span></h2>
          <div className={audit.cards}>
            {consultingAreas.map(([title, description]) => <article className={audit.card} key={title}><h3>{title}</h3><p>{description}</p></article>)}
          </div>
        </section>
        <section className={audit.section} id="process">
          <p className={audit.kicker}>03 / ЯК МИ ПРАЦЮЄМО</p>
          <h2>Від аналізу <span>до впровадження.</span></h2>
          <div className={audit.timeline}>
            {consultingSteps.map(([number, title, description]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}
          </div>
        </section>
        <section className={audit.section}>
          <p className={audit.kicker}>04 / РЕЗУЛЬТАТ</p>
          <h2>Менше невизначеності. <span>Більше ясності.</span></h2>
          <div className={audit.result}>
            <div><h3>Рекомендації, які можна застосувати</h3><p>Допомагаємо оцінити ситуацію, обрати обґрунтовані рішення та впровадити зміни у бізнесі.</p></div>
            <ul>{service.details.map(item => <li key={item}>{item}</li>)}</ul>
          </div>
        </section>
        <section className={audit.cta} id="consultation" aria-labelledby="consulting-contact-title">
          <div className={audit.ctaTopline}><span>АКЦ / ПЕРШИЙ КРОК</span></div>
          <div className={audit.ctaBody}><div className={audit.ctaCopy}>
            <h2 id="consulting-contact-title">Ваш бізнес заслуговує <span>на сильні рішення.</span></h2>
            <p>Розкажіть про вашу задачу — допоможемо визначити формат консультації та наступні кроки.</p>
          </div></div>
          <div className={audit.ctaBottom}>
            <div><strong>Почнімо з вашого завдання</strong><p>Обговоримо можливості співпраці</p></div>
            <Link href="/about" className={audit.ctaButton}>Зв’язатися з АКЦ <Arrow /></Link>
          </div>
        </section>
        <footer className={audit.footer}><Link href="/expertise">← Усі напрями експертизи</Link></footer>
      </main>
    </div>;
  }
  if (slug === "digital") {
    const digitalAreas = [
      [
            "M.E.DOC",
            "Налаштування та супровід електронної звітності."
      ],
      [
            "BAS",
            "Впровадження програмних продуктів для обліку."
      ],
      [
            "ПРРО",
            "Рішення для реєстрації розрахункових операцій."
      ],
      [
            "Електронний документообіг",
            "Обмін, підписання та організація цифрових документів."
      ]
];
    const digitalSteps = [
      [
            "01",
            "Аналіз",
            "Вивчаємо процеси та наявні системи."
      ],
      [
            "02",
            "Планування",
            "Підбираємо інструменти та сценарій інтеграції."
      ],
      [
            "03",
            "Впровадження",
            "Налаштовуємо рішення під бізнес-процеси."
      ],
      [
            "04",
            "Підтримка",
            "Допомагаємо команді працювати з інструментами."
      ]
];
    return <div className={styles.page + " " + expertiseFont + " " + audit.page + " " + audit.accountingPage}>
      <ExpertiseHeader />
      <main>
        <section className={audit.hero}>
          <div className={audit.heroText}>
            <p className={audit.kicker}>ЦИФРОВІ РІШЕННЯ / АКЦ</p>
            <h1>Технології, що <span>спрощують роботу.</span></h1>
            <p className={audit.lead}>{service.intro}</p>
            <div className={audit.actions}>
              <a href="#consultation" className={audit.primary}>Обговорити рішення <Arrow /></a>
              <a href="#services" className={audit.secondary}>Наші послуги <Arrow /></a>
            </div>
          </div>
        </section>
        <div className={audit.values}>
          <span>01 / Автоматизація</span><span>02 / Інтеграції</span><span>03 / Ефективні процеси</span>
        </div>
        <section className={audit.section} id="services">
          <p className={audit.kicker}>01 / ТЕХНОЛОГІЇ ДЛЯ БІЗНЕСУ</p>
          <h2>Менше ручної роботи. <span>Більше можливостей.</span></h2>
          <article className={audit.feature}>
            <div className={audit.featureCopy}>
              <p className={audit.kicker}>ЦИФРОВІ ІНСТРУМЕНТИ</p>
              <h3>{service.section}</h3>
              <p>{service.description}</p>
              <div className={audit.featureActions}>
                <a className={audit.featurePrimary} href="#consultation">Обговорити завдання <Arrow /></a>
                <a className={audit.featureMore} href="#areas">Напрями роботи</a>
              </div>
            </div>
          </article>
        </section>
        <section className={audit.section} id="areas">
          <p className={audit.kicker}>02 / НАПРЯМИ РОБОТИ</p>
          <h2>Ваші інструменти <span>працюють разом.</span></h2>
          <div className={audit.cards}>
            {digitalAreas.map(([title, description]) => <article className={audit.card} key={title}><h3>{title}</h3><p>{description}</p></article>)}
          </div>
        </section>
        <section className={audit.section} id="process">
          <p className={audit.kicker}>03 / ЯК МИ ПРАЦЮЄМО</p>
          <h2>Від потреби <span>до працюючого рішення.</span></h2>
          <div className={audit.timeline}>
            {digitalSteps.map(([number, title, description]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}
          </div>
        </section>
        <section className={audit.section}>
          <p className={audit.kicker}>04 / РЕЗУЛЬТАТ</p>
          <h2>Менше операцій. <span>Більше часу для бізнесу.</span></h2>
          <div className={audit.result}>
            <div><h3>Цифрові процеси без зайвої складності</h3><p>Допомагаємо налаштувати цифрові інструменти, зменшити ручну роботу та впорядкувати документообіг.</p></div>
            <ul>{service.details.map(item => <li key={item}>{item}</li>)}</ul>
          </div>
        </section>
        <section className={audit.cta} id="consultation" aria-labelledby="digital-contact-title">
          <div className={audit.ctaTopline}><span>АКЦ / ПЕРШИЙ КРОК</span></div>
          <div className={audit.ctaBody}><div className={audit.ctaCopy}>
            <h2 id="digital-contact-title">Ваш бізнес готовий <span>до цифрових змін.</span></h2>
            <p>Розкажіть про ваші процеси — допоможемо підібрати відповідні цифрові інструменти.</p>
          </div></div>
          <div className={audit.ctaBottom}>
            <div><strong>Почнімо з вашого завдання</strong><p>Обговоримо можливості співпраці</p></div>
            <Link href="/about" className={audit.ctaButton}>Зв’язатися з АКЦ <Arrow /></Link>
          </div>
        </section>
        <footer className={audit.footer}><Link href="/expertise">← Усі напрями експертизи</Link></footer>
      </main>
    </div>;
  }
  if (slug === "legal") {
    const legalAreas = [
      ["Договори", "Розробка, перевірка та супровід угод."],
      ["Судовий захист", "Представництво інтересів у судах і контролюючих органах."],
      ["Реєстрація бізнесу", "Юридичне оформлення та супровід запуску."],
      ["Корпоративні питання", "Правові рішення для поточної діяльності компанії."],
    ];
    const legalSteps = [
      ["01", "Звернення", "З’ясовуємо ситуацію та цілі бізнесу."],
      ["02", "Аналіз", "Оцінюємо документи й юридичні ризики."],
      ["03", "Рішення", "Готуємо правову позицію та план дій."],
      ["04", "Супровід", "Допомагаємо реалізувати узгоджені рішення."],
    ];
    return <div className={styles.page + " " + expertiseFont + " " + audit.page + " " + audit.legalPage}>
      <ExpertiseHeader />
      <main>
        <section className={audit.hero}>
          <div className={audit.heroText}>
            <p className={audit.kicker}>ЮРИДИЧНИЙ СУПРОВІД / АКЦ</p>
            <h1>Юридичний захист <span>для вашого бізнесу.</span></h1>
            <p className={audit.lead}>{service.intro}</p>
            <div className={audit.actions}>
              <a href="#consultation" className={audit.primary}>Обговорити питання <Arrow /></a>
              <a href="#services" className={audit.secondary}>Наші послуги <Arrow /></a>
            </div>
          </div>
        </section>
        <div className={audit.values}>
          <span>01 / Захист інтересів</span><span>02 / Правова визначеність</span><span>03 / Контроль ризиків</span>
        </div>
        <section className={audit.section} id="services">
          <p className={audit.kicker}>01 / ЮРИДИЧНА ПІДТРИМКА</p>
          <h2>Правові рішення. <span>Впевненість у діях.</span></h2>
          <article className={audit.feature}>
            <div className={audit.featureCopy}>
              <p className={audit.kicker}>ДОГОВОРИ ТА ПРАВОВИЙ ЗАХИСТ</p>
              <h3>{service.section}</h3>
              <p>{service.description}</p>
              <div className={audit.featureActions}>
                <a className={audit.featurePrimary} href="#consultation">Обговорити завдання <Arrow /></a>
                <a className={audit.featureMore} href="#areas">Напрями роботи</a>
              </div>
            </div>
          </article>
        </section>
        <section className={audit.section} id="areas">
          <p className={audit.kicker}>02 / НАПРЯМИ ПІДТРИМКИ</p>
          <h2>Ваші інтереси <span>під захистом.</span></h2>
          <div className={audit.cards}>
            {legalAreas.map(([title, description]) => <article className={audit.card} key={title}><h3>{title}</h3><p>{description}</p></article>)}
          </div>
        </section>
        <section className={audit.section} id="process">
          <p className={audit.kicker}>03 / ЯК МИ ПРАЦЮЄМО</p>
          <h2>Від запиту <span>до правового рішення.</span></h2>
          <div className={audit.timeline}>
            {legalSteps.map(([number, title, description]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}
          </div>
        </section>
        <section className={audit.section}>
          <p className={audit.kicker}>04 / РЕЗУЛЬТАТ</p>
          <h2>Менше ризиків. <span>Більше впевненості.</span></h2>
          <div className={audit.result}>
            <div><h3>Юридична підтримка, на яку можна покластися</h3><p>Допомагаємо оцінити правові ризики, підготувати документи та захистити інтереси бізнесу.</p></div>
            <ul>{service.details.map(item => <li key={item}>{item}</li>)}</ul>
          </div>
        </section>
        <section className={audit.cta} id="consultation" aria-labelledby="legal-contact-title">
          <div className={audit.ctaTopline}><span>АКЦ / ПЕРШИЙ КРОК</span></div>
          <div className={audit.ctaBody}><div className={audit.ctaCopy}>
            <h2 id="legal-contact-title">Ваш бізнес заслуговує <span>на надійний захист.</span></h2>
            <p>Розкажіть про ваше питання — допоможемо визначити наступні юридичні кроки.</p>
          </div></div>
          <div className={audit.ctaBottom}>
            <div><strong>Почнімо з вашого завдання</strong><p>Обговоримо можливості співпраці</p></div>
            <Link href="/about" className={audit.ctaButton}>Зв’язатися з АКЦ <Arrow /></Link>
          </div>
        </section>
        <footer className={audit.footer}><Link href="/expertise">← Усі напрями експертизи</Link></footer>
      </main>
    </div>;
  }
  if (slug === "qualification") {
    const stages = [
      ["01", "Заявка", "Звернення до центру та отримання інформації про процедуру."],
      ["02", "Документи", "Подання документів для перевірки відповідності вимогам."],
      ["03", "Оцінювання", "Перевірка професійних компетентностей за встановленими критеріями."],
      ["04", "Результат", "Повідомлення про результат і видача документа в разі успішного проходження."],
    ];
    const documentGroups = [
      { title: "Документи кваліфікаційного центру", items: [
        ["Наказ про створення кваліфікаційного центру", "nakaz-pro-stvorennya.pdf"],
        ["Положення про кваліфікаційний центр ТОВ «АКЦ»", "polozhennya-kc.pdf"],
        ["Матеріально-технічна база", "materialno-tehnichna-baza.pdf"],
        ["Бланк сертифіката кваліфікаційного центру", "blank-sertyfikata.pdf"],
        ["Сертифікат про акредитацію — «Бухгалтер дипломований»", "akredytaciya-buhgalter.pdf"],
        ["Сертифікат про акредитацію — «Головний бухгалтер бюджетної установи»", "akredytaciya-golovnyi-buhgalter.pdf"],
      ] },
      { title: "Бухгалтер дипломований", items: [
        ["Професійний стандарт", "buh-standart.pdf"],
        ["Порядок присвоєння та підтвердження кваліфікації", "buh-poryadok.pdf"],
        ["Умови допуску до професійної сертифікації", "buh-umovy.pdf"],
        ["Професійні компетентності, що підлягають оцінюванню", "buh-kompetentnosti.pdf"],
        ["Структура контрольних та оцінювальних матеріалів", "buh-oczinyuvannya.pdf"],
        ["Склад комісії та інформація про екзаменаторів", "buh-komisiya.pdf"],
        ["Перелік питань для підготовки до іспиту", "buh-pytannya.pdf"],
      ] },
      { title: "Головний бухгалтер бюджетної установи", items: [
        ["Професійний стандарт", "golbuh-standart.pdf"],
        ["Порядок присвоєння та підтвердження кваліфікації", "golbuh-poryadok.pdf"],
        ["Професійні компетентності, що підлягають оцінюванню", "golbuh-kompetentnosti.pdf"],
        ["Склад комісії та інформація про екзаменаторів", "golbuh-komisiya.pdf"],
        ["Умови допуску до професійної сертифікації", "golbuh-umovy.pdf"],
        ["Структура контрольних та оцінювальних матеріалів", "golbuh-oczinyuvannya.pdf"],
      ] },
      { title: "Процедури та документи для заявників", items: [
        ["Процедура присвоєння та підтвердження професійної кваліфікації", "procedura-sertyfikaciyi.pdf"],
        ["Контрольні терміни процедури сертифікації", "terminy-sertyfikaciyi.pdf"],
        ["Порядок оскарження результатів сертифікації", "oskarzhennya-rezultativ.pdf"],
        ["Договір про надання інформаційно-консультаційних послуг (01.09.2026)", "zayava.pdf"],
        ["Публічний договір про надання послуг (01.06.2026)", "publichnyi-dogovir.pdf"],
      ] },
    ] as const;
    return <div className={`${styles.page} ${expertiseFont} ${qualification.qualificationPage}`}>
      <ExpertiseHeader active="qualification" />
      <main className={qualification.qualificationMain}>
        <section className={qualification.qHero}>
          <div className={qualification.qHeroText}>
            <p className={qualification.qEyebrow}>АУДИТ КОНСАЛТИНГ ЦЕНТР / КВАЛІФІКАЦІЙНИЙ ЦЕНТР</p>
            <h1>ОЦІНЮВАННЯ ТА<br/>ПІДТВЕРДЖЕННЯ<br/><span>ПРОФЕСІЙНОЇ КВАЛІФІКАЦІЇ</span></h1>
            <p>«Бухгалтер дипломований» — професійна сертифікація для бухгалтерів від кваліфікаційного центру, акредитованого Національним агентством кваліфікацій. Вимоги, іспит, комісія, вартість і документи — на цій сторінці.</p>
            <div className={qualification.qStatus}>● АКРЕДИТОВАНИЙ КВАЛІФІКАЦІЙНИЙ ЦЕНТР</div>

          </div>
          <div className={qualification.qHeroArt}><Image src="/akc-expertise-geometry.png" alt="" width={793} height={816} priority /></div>
        </section>
        <section className={qualification.qMetricsSection} aria-label="Основні характеристики оцінювання">
          <div className={qualification.qTimeline}>
            <svg className={qualification.qTimelineTrack} viewBox="0 0 1000 720" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <defs>
                <linearGradient id="qualificationPathGradient" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#6db9ee" />
                  <stop offset="52%" stopColor="#2580c9" />
                  <stop offset="100%" stopColor="#82c8f5" />
                </linearGradient>
              </defs>
              <path className={qualification.qTimelineStroke} pathLength={100} d="M 125 90 H 825 Q 945 90 945 180 Q 945 270 825 270 H 175 Q 55 270 55 360 Q 55 450 175 450 H 825 Q 945 450 945 540 Q 945 630 825 630 H 125" fill="none" stroke="url(#qualificationPathGradient)" strokeWidth="5" strokeLinecap="round" />
              <circle className={qualification.qTimelineDot} cx="620" cy="90" r="9" fill="#74bdec" />
              <circle className={qualification.qTimelineDot} cx="370" cy="270" r="9" fill="#74bdec" />
              <circle className={qualification.qTimelineDot} cx="620" cy="450" r="9" fill="#74bdec" />
              <circle className={qualification.qTimelineDot} cx="370" cy="630" r="9" fill="#74bdec" />
            </svg>
            {[
              ["01", "◷", "5 ГОДИН"],
              ["02", "✎", "6 ПРАКТИЧНИХ ЗАВДАНЬ"],
              ["03", "◎", "70 ТЕСТІВ"],
              ["04", "✧", "СЕРТИФІКАТ ПІСЛЯ УСПІШНОГО ІСПИТУ"],
            ].map(([number, icon, label]) => (
              <div className={qualification.qTimelineStep} key={number}>
                <span className={qualification.qTimelineNumber}>{number}</span>
                <div className={qualification.qTimelineContent}>
                  <span className={qualification.qTimelineIcon} aria-hidden="true">{icon}</span>
                  <strong>{label}</strong>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className={qualification.qIntroCards}>
          {[
            ["01","Про кваліфікаційний центр","Ми організовуємо професійне оцінювання бухгалтерів, допомагаємо підготувати документи та пройти шлях від консультації до отримання сертифіката."],
            ["02","Наш статус","Кваліфікаційний центр акредитовано Національним агентством кваліфікацій. Сертифікат №787 від 06.04.2026."],
            ["03","НАК","Національне агентство кваліфікацій забезпечує формування та реалізацію державної політики у сфері професійних кваліфікацій."],
          ].map(([n,title,description])=><article key={n}><span>{n}</span><h2>{title}</h2><p>{description}</p></article>)}
        </section>
        <section className={qualification.qSection} id="process">
          <p className={qualification.qEyebrow}>ПРОЦЕДУРА</p><h2>Як проходить сертифікація?</h2>
          <div className={qualification.qSteps}>{stages.map(([n,title,description])=><article key={n}><span>{n}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
        </section>
        <section className={qualification.qSection}>
          <p className={qualification.qEyebrow}>ІНФОРМАЦІЯ ДЛЯ ЗАЯВНИКА</p><h2>Усе, що потрібно знати перед іспитом</h2>
          <div className={qualification.qInfoGrid}>
            {[
              ["Вимоги до кандидатів", "Одна з умов: кваліфікація «Бухгалтер» і стаж у бухгалтерському обліку від 5 років; або бакалаврський рівень у галузі «Бізнес, адміністрування та право» та 2 роки практичного досвіду; або магістерський рівень у цій галузі."],
              ["Для яких професій актуально?", "Головні бухгалтери та бухгалтери."],
              ["Який сертифікат видається?", "Сертифікат фахівця (кваліфікаційний) про присвоєння / підтвердження професійної кваліфікації «Бухгалтер дипломований»."],
              ["Форма іспиту", "Офлайн або онлайн. Актуальні умови участі уточнюються перед реєстрацією."],
            ].map(([title, description], index) => (
              <details key={title} className={qualification.qAccordion}>
                <summary className={qualification.qAccordionTrigger}>
                  <span className={qualification.qAccordionHeading}><span className={qualification.qAccordionNumber}>{String(index + 1).padStart(2, "0")}</span><span>{title}</span></span>
                  <svg className={qualification.qAccordionArrow} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                </summary>
                <div className={qualification.qAccordionContent}><p>{description}</p></div>
              </details>
            ))}
          </div>
        </section>
        <section className={qualification.qBand}>
          <div className={qualification.qInner}>
            <p className={qualification.qEyebrow}>ПЕРЕВАГИ</p><h2>Що ви отримаєте після сертифікації?</h2>
            <div className={qualification.qBenefitList}>
              {[
                ["Підтвердження кваліфікації", "Офіційний документ за результатами успішного оцінювання."],
                ["Визнання роботодавців", "Додаткове підтвердження професійних компетентностей."],
                ["Актуальні знання", "Підготовка з урахуванням професійних стандартів і змін законодавства."],
                ["Кар’єрні переваги", "Підсилення професійного профілю на ринку праці."],
              ].map(([title, description], index) => (
                <div className={qualification.qBenefitRow} key={title}>
                  <span className={qualification.qBenefitIndex}>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              ))}
            </div>
            <div className={qualification.qCertificateResult}><div className={qualification.qResult}><p className={qualification.qEyebrow}>РЕЗУЛЬТАТ ОЦІНЮВАННЯ</p><h2>Після успішного іспиту ви отримаєте сертифікат</h2><p>Сертифікат фахівця про присвоєння або підтвердження професійної кваліфікації. Точна назва документа залежить від обраної кваліфікації.</p></div><CertificateShowcase /></div>
          </div>
        </section>
        <section className={qualification.qSection}>
          <p className={qualification.qEyebrow}>ДОСВІД УЧАСНИКІВ</p><h2>Відгуки учасників</h2>
          <div className={qualification.qReviewGrid}>
            {[
              ["«Дуже професійний підхід та супровід сертифікації, після якої отримала підвищення та матеріальну мотивацію»","Ірина К."],
              ["«Крутий виклик для перевірки рівня знань, після чого став впевненіше працювати зі звітністю, обліком та змінами законодавства»","Сергій С."],
              ["«Зручно, сучасно та швидко — саме те, що потрібно для отримання сертифіката.»","Анна Т."],
            ].map(([quote,author])=><blockquote key={author}><span>★★★★★</span><p>{quote}</p><footer>{author}</footer></blockquote>)}
          </div>
        </section>
        <section className={qualification.qSection} id="documents">
          <p className={qualification.qEyebrow}>ОФІЦІЙНІ ДОКУМЕНТИ</p><h2>Документи кваліфікаційного центру</h2><p>Офіційні документи, положення та матеріали кваліфікаційного центру. Натисніть на назву, щоб відкрити PDF. Зверніть увагу: посилання «Заява» на попередньому сайті веде до договору, а не до бланка заяви.</p>
          <div className={qualification.qDocumentGroups}>{documentGroups.map((group, index)=><details key={group.title} className={qualification.qDocumentGroup} open={index===0}><summary><span className={qualification.qDocumentIndex}>{String(index+1).padStart(2,"0")}</span><span className={qualification.qDocumentGroupTitle}>{group.title}</span><span className={qualification.qDocumentCount}>{group.items.length} PDF</span><span className={qualification.qDocumentChevron} aria-hidden="true">⌄</span></summary><div className={qualification.qDocumentGrid}>{group.items.map(([title,file])=><a key={file} href={`/documents/${file}`} target="_blank" rel="noopener noreferrer" aria-label={`Відкрити PDF: ${title}`}><span className={qualification.qDocumentFileName}>{title}</span><span className={qualification.qDocumentFileArrow} aria-hidden="true">↗</span></a>)}</div></details>)}</div>
        </section>
        <section className={qualification.qSection}>
          <p className={qualification.qEyebrow}>НОРМАТИВНА ОСНОВА</p><h2>Професійні стандарти та акредитація</h2>
          <div className={qualification.qNormative}><div className={qualification.qNormativeIntro}><span className={qualification.qNormativeOverline}>ПРАВОВА ОСНОВА ОЦІНЮВАННЯ</span><h3>Стандарти, на які можна спиратися</h3><p>Оцінювання проводиться відповідно до вимог професійного стандарту для обраної кваліфікації та затверджених документів кваліфікаційного центру.</p></div><div className={qualification.qNormativeReference}><span className={qualification.qNormativeReferenceNumber}>01 / ПРОФЕСІЙНИЙ СТАНДАРТ</span><h3>Головний бухгалтер бюджетної установи</h3><p>Наказ Міністерства фінансів України № 364 від 21.07.2025</p></div></div>
          <div className={qualification.qDocumentGroups}>
            <details className={qualification.qDocumentGroup}>
              <summary><span className={qualification.qDocumentIndex}>05</span><span className={qualification.qDocumentGroupTitle}>Нормативно-правові акти України</span><span className={qualification.qDocumentCount}>6 посилань</span><span className={qualification.qDocumentChevron} aria-hidden="true">⌄</span></summary>
              <div className={qualification.qDocumentGrid}>
                {([
                  ["Закон України № 2179-IX про функціонування національної системи кваліфікацій", "https://zakon.rada.gov.ua/laws/show/2179-20"],
                  ["Постанова КМУ № 956 — порядок присвоєння та підтвердження кваліфікацій", "https://zakon.rada.gov.ua/laws/show/956-2021-%D0%BF"],
                  ["Постанова КМУ № 620 — Реєстр кваліфікацій", "https://zakon.rada.gov.ua/laws/show/620-2021-%D0%BF"],
                  ["Постанова КМУ № 576 — визнання іноземних професійних кваліфікацій", "https://zakon.rada.gov.ua/laws/show/576-2021-%D0%BF"],
                  ["Постанова КМУ № 1341 — Національна рамка кваліфікацій", "https://zakon.rada.gov.ua/laws/show/1341-2011-%D0%BF"],
                  ["Постанова КМУ № 986 — порядок визнання результатів навчання", "https://zakon.rada.gov.ua/laws/show/986-2021-%D0%BF"],
                ] as const).map(([title,url])=><a key={url} href={url} target="_blank" rel="noopener noreferrer"><span aria-hidden="true">↗</span>{title}</a>)}
              </div>
            </details>
          </div>
        </section>
        <section className={qualification.qFinal} id="next-step"><div className={qualification.qFinalContent}><p className={qualification.qEyebrow}>НАСТУПНИЙ КРОК</p><h2>Готові підтвердити професійну кваліфікацію?</h2><p>Зареєструйтеся на іспит або зверніться до центру, щоб уточнити порядок сертифікації, вимоги й документи.</p><a href="#documents">ПЕРЕГЛЯНУТИ ДОКУМЕНТИ ↗</a></div><div className={qualification.qFinalArt} aria-hidden="true"><span className={qualification.qFinalOrbitOne}></span><span className={qualification.qFinalOrbitTwo}></span><span className={qualification.qFinalOrbitThree}></span><span className={qualification.qFinalArtCore}><span></span></span><span className={qualification.qFinalArtCaption}>АКЦ / КВАЛІФІКАЦІЯ</span></div></section>
      </main>
    </div>;
  }
  return (
    <div className={`${styles.page} ${expertiseFont}`}>
      <ExpertiseHeader active={slug === "qualification" ? "qualification" : "expertise"} />
      <main className={styles.serviceMain}>
        <div className={styles.serviceColumns}>
          <div className={styles.serviceIntro}>
            <p className={styles.eyebrow}><Link href="/expertise">02 / Експертиза</Link> / {service.name}</p>
            <h1>{service.title}</h1>
            <p>{service.intro}</p>
            <section className={styles.serviceCard}>
              <h2>{service.section}</h2>
              <p>{service.description}</p>
            </section>
            <section className={styles.details} id="details">
              <h2>{service.detailTitle}</h2>
              <ol className={styles.detailList}>
                {service.details.map((text, index) => (
                  <li key={text}><span>{String(index + 1).padStart(2, "0")}</span>{text}</li>
                ))}
              </ol>
            </section>
          </div>
          <aside className={styles.serviceAside} aria-label={`Напрям ${service.name}`}>
            <Image className={styles.serviceArt} src="/akc-expertise-geometry.png" width={793} height={816} alt="" priority />
            <p className={styles.asideCaption}>{service.section}</p>
            <ol className={styles.serviceItems}>
              {service.items.map((text, index) => (
                <li key={text}><span>{String(index + 1).padStart(2, "0")}</span>{text}</li>
              ))}
            </ol>
            <div className={styles.outcome}>
              <h2>{service.outcome}</h2>
              <a href="#details">Дізнатися більше <Arrow /></a>
            </div>
          </aside>
        </div>
        <footer className={styles.serviceFooter}>
          <Link href="/expertise">Усі напрями експертизи <Arrow /></Link>
        </footer>
      </main>
    </div>
  );
}

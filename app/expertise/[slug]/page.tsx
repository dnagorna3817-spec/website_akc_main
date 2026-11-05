import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow, expertiseFont, ExpertiseHeader } from "../ExpertiseView";
import { services } from "../services";
import styles from "../expertise.module.css";
import audit from "./audit.module.css";

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

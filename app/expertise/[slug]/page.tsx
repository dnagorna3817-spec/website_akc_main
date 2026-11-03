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
  return (
    <div className={`${styles.page} ${expertiseFont}`}>
      <ExpertiseHeader />
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

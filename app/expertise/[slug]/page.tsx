import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow, expertiseFont, ExpertiseHeader } from "../ExpertiseView";
import { services } from "../services";
import styles from "../expertise.module.css";

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
  return (
    <div className={`${styles.page} ${expertiseFont}`}>
      <ExpertiseHeader />
      <main className={styles.serviceMain}>
        {slug === "audit" && (
          <section className={styles.auditEditorialHero} aria-labelledby="audit-editorial-title">
            <Image className={styles.auditEditorialArtwork} src="/akc-audit-wave.jpg" width={793} height={816} alt="" priority />
            <div className={styles.auditEditorialCopy}>
              <h1 id="audit-editorial-title">Аудит, що дає впевненість<br className={styles.auditDesktopBreak} /> у рішеннях</h1>
              <p className={styles.auditEditorialDescription}>{service.intro}</p>
              <div className={styles.auditEditorialActions}>
                <a href="#details" className={styles.auditEditorialPrimary}>Дізнатися більше <Arrow /></a>
                <Link href="/expertise" className={styles.auditEditorialSecondary}>Усі послуги <Arrow /></Link>
              </div>
            </div>
          </section>
        )}
        <div className={styles.serviceColumns}>
          <div className={styles.serviceIntro}>
            {slug !== "audit" && (
              <>
                <p className={styles.eyebrow}><Link href="/expertise">02 / Експертиза</Link> / {service.name}</p>
                <h1>{service.title}</h1>
                <p>{service.intro}</p>
              </>
            )}
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

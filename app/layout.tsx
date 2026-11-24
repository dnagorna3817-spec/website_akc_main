import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ExpertiseTransition from "./components/ExpertiseTransition";
import GlobalSectionReveal from "./components/GlobalSectionReveal";
import SiteFooter from "./components/SiteFooter";
import GlobalLeadForm from "./components/GlobalLeadForm";
import CmsPageText from "./components/CmsPageText";
import MobileSiteHeader from "./components/MobileSiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://audit-centr.com.ua";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  title: {
    default: "Аудит Консалтинг Центр — аудит, консалтинг і бухгалтерський супровід",
    template: "%s | Аудит Консалтинг Центр",
  },
  description:
    "Аудит, бухгалтерський супровід, юридичний консалтинг і цифрові рішення для бізнесу. Аудит Консалтинг Центр — професійна підтримка компаній в Україні.",
  applicationName: "Аудит Консалтинг Центр",
  icons: {
    icon: "/favicon.svg?v=4",
    shortcut: "/favicon.svg?v=4",
    apple: "/akc-logo.png?v=4",
  },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: siteUrl,
    siteName: "Аудит Консалтинг Центр",
    title: "Аудит Консалтинг Центр — аудит, консалтинг і бухгалтерський супровід",
    description:
      "Аудит, бухгалтерський супровід, юридичний консалтинг і цифрові рішення для бізнесу в Україні.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Аудит Консалтинг Центр",
    description: "Аудит, консалтинг і бухгалтерський супровід для бізнесу.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="uk"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": "https://audit-centr.com.ua/#organization",
            name: "Аудит Консалтинг Центр",
            url: "https://audit-centr.com.ua/",
            email: "akc@audit-centr.com.ua",
            address: {
              "@type": "PostalAddress",
              streetAddress: "вул. Гоголя, 224",
              addressLocality: "Черкаси",
              postalCode: "18000",
              addressCountry: "UA"
            },
            sameAs: [
              "https://www.facebook.com/auditkonsaltingcentr/",
              "https://www.instagram.com/audit_konsalting_centr/"
            ]
          })
        }}
      />
      <MobileSiteHeader /><ExpertiseTransition>{children}</ExpertiseTransition><GlobalSectionReveal /><SiteFooter /><GlobalLeadForm /><CmsPageText />
    </body>
    </html>
  );
}

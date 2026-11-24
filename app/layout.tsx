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
  title: {
    default: "Аудит Консалтинг Центр — аудит, консалтинг і бухгалтерський супровід",
    template: "%s | Аудит Консалтинг Центр",
  },
  description:
    "Аудит, бухгалтерський супровід, юридичний консалтинг і цифрові рішення для бізнесу. Аудит Консалтинг Центр — професійна підтримка компаній в Україні.",
  applicationName: "Аудит Консалтинг Центр",
  alternates: { canonical: "/" },
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
      <body className="min-h-full flex flex-col"><MobileSiteHeader /><ExpertiseTransition>{children}</ExpertiseTransition><GlobalSectionReveal /><SiteFooter /><GlobalLeadForm /><CmsPageText /></body>
    </html>
  );
}

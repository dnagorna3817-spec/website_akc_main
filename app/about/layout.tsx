import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Про компанію",
  description: "Дізнайтеся про Аудит Консалтинг Центр, команду експертів, досвід і підхід до аудиту, консалтингу та підтримки бізнесу.",
  alternates: { canonical: "/about" },
  openGraph: { title: "Про компанію", description: "Команда, досвід і підхід Аудит Консалтинг Центр.", url: "/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

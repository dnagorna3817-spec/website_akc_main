import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Новини та аналітика",
  description: "Новини, експертна аналітика, практичні матеріали та заходи для бізнесу від Аудит Консалтинг Центр.",
  alternates: { canonical: "/insights" },
  openGraph: { title: "Новини та аналітика", description: "Експертні матеріали Аудит Консалтинг Центр.", url: "/insights" },
};

export default function InsightsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

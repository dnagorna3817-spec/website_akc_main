import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Послуги та експертиза",
  description: "Аудит, бухгалтерський облік, юридичний супровід, консалтинг і цифрові рішення для компаній та підприємців.",
  alternates: { canonical: "/expertise" },
  openGraph: { title: "Послуги та експертиза", description: "Професійні послуги Аудит Консалтинг Центр.", url: "/expertise" },
};

export default function ExpertiseLayout({ children }: { children: React.ReactNode }) {
  return children;
}

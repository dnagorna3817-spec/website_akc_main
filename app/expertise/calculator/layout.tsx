import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Калькулятор вартості послуг",
  description: "Оцініть орієнтовну вартість послуг Аудит Консалтинг Центр за допомогою онлайн-калькулятора.",
  alternates: { canonical: "/expertise/calculator" },
};

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}

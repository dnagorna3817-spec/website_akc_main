import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Галузеві рішення для бізнесу",
  description: "Аудиторський, бухгалтерський і консультаційний супровід для сфери послуг, медицини, торгівлі, виробництва та агробізнесу.",
  alternates: { canonical: "/industries" },
  openGraph: { title: "Галузеві рішення для бізнесу", description: "Рішення АКЦ з урахуванням специфіки різних галузей.", url: "/industries" },
};

export default function IndustriesLayout({ children }: { children: React.ReactNode }) {
  return children;
}

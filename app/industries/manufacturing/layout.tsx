import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Послуги для виробництва",
  description: "Фінансовий контроль, бухгалтерський супровід та аналіз виробничих витрат і бізнес-процесів.",
  alternates: { canonical: "/industries/manufacturing" },
};

export default function ManufacturingLayout({ children }: { children: React.ReactNode }) {
  return children;
}

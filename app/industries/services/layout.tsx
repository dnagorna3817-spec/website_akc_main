import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Послуги для сервісного бізнесу",
  description: "Бухгалтерський облік, фінансовий контроль і консультаційна підтримка компаній сфери послуг.",
  alternates: { canonical: "/industries/services" },
};

export default function ServicesIndustryLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Послуги для медичного бізнесу",
  description: "Бухгалтерський і консультаційний супровід медичних закладів з урахуванням галузевих вимог.",
  alternates: { canonical: "/industries/medical" },
};

export default function MedicalLayout({ children }: { children: React.ReactNode }) {
  return children;
}

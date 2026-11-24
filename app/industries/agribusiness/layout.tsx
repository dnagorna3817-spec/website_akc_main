import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Послуги для агробізнесу",
  description: "Аудит, бухгалтерський супровід і консалтинг для аграрних підприємств з урахуванням галузевих процесів і ризиків.",
  alternates: { canonical: "/industries/agribusiness" },
};

export default function AgribusinessLayout({ children }: { children: React.ReactNode }) {
  return children;
}

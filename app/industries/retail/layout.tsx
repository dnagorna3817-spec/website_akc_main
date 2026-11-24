import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Послуги для роздрібної торгівлі",
  description: "Облік, контроль товарних операцій, звітність та управління фінансовими ризиками у роздрібній торгівлі.",
  alternates: { canonical: "/industries/retail" },
};

export default function RetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}

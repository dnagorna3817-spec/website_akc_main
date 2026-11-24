import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Контакти",
  description: "Контакти Аудит Консалтинг Центр у Черкасах: адреса, телефони, електронна пошта та графік роботи.",
  alternates: { canonical: "/contacts" },
  openGraph: { title: "Контакти", description: "Зв’яжіться з Аудит Консалтинг Центр.", url: "/contacts" },
};

export default function ContactsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

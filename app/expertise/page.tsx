import type { Metadata } from "next";
import ExpertiseView from "./ExpertiseView";

export const metadata: Metadata = {
  title: "Напрями експертизи — АКЦ",
  description: "Аудит, бухгалтерський облік, юридичний супровід, консалтинг, цифрові рішення та підвищення професійної кваліфікації.",
};

export default function ExpertisePage() {
  return <ExpertiseView />;
}

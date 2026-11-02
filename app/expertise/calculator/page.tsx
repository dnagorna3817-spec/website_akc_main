import type { Metadata } from "next";
import Calculator from "./Calculator";
export const metadata: Metadata = { title: "Калькулятор вартості послуг — АКЦ", description: "Попередній розрахунок бухгалтерського аутсорсингу та супутніх послуг АКЦ." };
export default function Page(){return <Calculator/>}

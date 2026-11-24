export type Category = "Усі" | "Статті" | "План заходів" | "Новини";
export type Article = { id: number; slug: string; category: Exclude<Category, "Усі">; date: string; title: string; summary: string; visual: string };
export const articles: Article[] = [
  { id: 1, slug: "business-changes-2027", category: "Статті", date: "ОГЛЯД · ПРИКЛАД", title: "Як підготувати бізнес до змін у 2027 році", summary: "Ключові питання для планування, фінансової стійкості та управління ризиками.", visual: "feature" },
  { id: 2, slug: "tax-changes", category: "Новини", date: "НОВИНИ · ПРИКЛАД", title: "Податкові зміни: на що звернути увагу бізнесу", summary: "Орієнтири для аналізу змін у регулюванні.", visual: "lines" },
  { id: 3, slug: "tax-risk-management", category: "План заходів", date: "ПЛАН ЗАХОДІВ · ПРИКЛАД", title: "Оновлення в управлінні податковими ризиками", summary: "Як структурувати перевірку процесів і документів.", visual: "glass" },
  { id: 4, slug: "tax-function-transformation", category: "Статті", date: "СТАТТІ · ПРИКЛАД", title: "Трансформація податкової функції в компанії", summary: "Практичні напрями розвитку фінансових процесів.", visual: "arc" },
];
export const categories: Category[] = ["Усі", "Статті", "План заходів", "Новини"];

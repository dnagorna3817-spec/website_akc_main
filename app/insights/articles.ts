export type Category = "Усі" | "Статті" | "План заходів" | "Новини";
export type Article = { id: number; slug: string; category: Exclude<Category, "Усі">; date: string; title: string; summary: string; visual: string; image_url?: string | null };
export const articles: Article[] = [];
export const categories: Category[] = ["Усі", "Статті", "План заходів", "Новини"];

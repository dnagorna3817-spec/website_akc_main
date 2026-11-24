import type { MetadataRoute } from "next";
import { services } from "./expertise/services";
import { articles } from "./insights/articles";

const siteUrl = "https://audit-centr.com.ua";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = [
    "",
    "/about",
    "/expertise",
    "/industries",
    "/insights",
    "/contacts",
    "/expertise/calculator",
    "/industries/agribusiness",
    "/industries/manufacturing",
    "/industries/medical",
    "/industries/retail",
    "/industries/services",
  ];

  const entries: MetadataRoute.Sitemap = [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: now,
      changeFrequency: route === "" ? "weekly" as const : "monthly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...services.map((service) => ({
      url: `${siteUrl}/expertise/${service.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: service.slug === "qualification" ? 0.85 : 0.75,
    })),
    ...articles.map((article) => ({
      url: `${siteUrl}/insights/${article.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseKey) {
    try {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/cms_published_news?select=slug,published_at&order=published_at.desc`,
        {
          headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
          next: { revalidate: 3600 },
        },
      );
      if (response.ok) {
        const rows = (await response.json()) as { slug: string; published_at?: string }[];
        const known = new Set(articles.map((article) => article.slug));
        for (const row of rows) {
          if (!/^[a-z0-9-]+$/.test(row.slug) || known.has(row.slug)) continue;
          entries.push({
            url: `${siteUrl}/insights/${row.slug}`,
            lastModified: row.published_at ? new Date(row.published_at) : now,
            changeFrequency: "monthly",
            priority: 0.6,
          });
        }
      }
    } catch {
      // Keep the static sitemap available if the CMS is temporarily unreachable.
    }
  }

  return entries;
}

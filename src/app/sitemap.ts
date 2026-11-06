import type { MetadataRoute } from "next";
import { getTechs, getTechPages } from "@/lib/content";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://myanmar-fullstack-docs.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/docs`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/roadmap`, changeFrequency: "monthly", priority: 0.5 },
  ];

  for (const tech of getTechs()) {
    routes.push({
      url: `${BASE}/docs/${tech.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    });

    for (const page of getTechPages(tech.slug)) {
      routes.push({
        url: `${BASE}/docs/${tech.slug}/${page.slug}`,
        lastModified: page.updated ? new Date(page.updated) : undefined,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return routes;
}

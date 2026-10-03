import type { MetadataRoute } from "next";
import { DEFAULT_PORTFOLIO_CONTENT, type PortfolioContent } from "@/lib/portfolio-content";

function siteBase() {
  return (process.env.URL || process.env.DEPLOY_PRIME_URL || "https://vthish.dev").replace(/\/$/, "");
}

async function getLiveContent(): Promise<PortfolioContent> {
  try {
    const response = await fetch(`${siteBase()}/.netlify/functions/portfolio-content`, { cache: "no-store" });
    if (response.ok) return await response.json() as PortfolioContent;
  } catch {
    // Fall back to source defaults if the public content function is unavailable.
  }
  return DEFAULT_PORTFOLIO_CONTENT;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getLiveContent();
  const base = siteBase();
  return [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    ...content.projects.map((project) => ({
      url: `${base}/projects/${encodeURIComponent(project.id)}`,
      lastModified: content.updatedAt ? new Date(content.updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];
}

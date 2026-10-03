import type { Metadata } from "next";
import Portfolio from "@/components/Portfolio";
import { DEFAULT_PORTFOLIO_CONTENT, type PortfolioContent } from "@/lib/portfolio-content";

export const dynamic = "force-dynamic";

function siteBase() {
  return (process.env.URL || process.env.DEPLOY_PRIME_URL || "https://vthish.dev").replace(/\/$/, "");
}

async function getLiveContent(): Promise<PortfolioContent> {
  try {
    const response = await fetch(`${siteBase()}/.netlify/functions/portfolio-content`, { cache: "no-store" });
    if (response.ok) return await response.json() as PortfolioContent;
  } catch {
    // Metadata falls back to code defaults if live content is temporarily unavailable.
  }
  return DEFAULT_PORTFOLIO_CONTENT;
}

function absoluteMedia(url?: string) {
  if (!url) return `${siteBase()}/images/profile-main.webp`;
  if (/^https?:\/\//i.test(url)) return url;
  return `${siteBase()}${url.startsWith("/") ? "" : "/"}${url}`;
}

type ProjectPageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const content = await getLiveContent();
  const project = content.projects.find((item) => item.id === id);
  if (!project) return { title: "Project | Venusha Thishan", robots: { index: false, follow: true } };
  const image = absoluteMedia(project.imageUrls?.[0] || project.imageUrl);
  const url = `${siteBase()}/projects/${encodeURIComponent(project.id)}`;
  const title = `${project.title} | Venusha Thishan`;
  return {
    title,
    description: project.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description: project.description,
      siteName: "Venusha Thishan Portfolio",
      images: [{ url: image, alt: `${project.title} project` }],
    },
    twitter: { card: "summary_large_image", title, description: project.description, images: [image] },
  };
}

export default async function ProjectSharePage({ params }: ProjectPageProps) {
  const { id } = await params;
  return <Portfolio focusProjectId={id} />;
}

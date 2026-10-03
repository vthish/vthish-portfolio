import type { MetadataRoute } from "next";

function siteBase() {
  return (process.env.URL || process.env.DEPLOY_PRIME_URL || "https://vthish.dev").replace(/\/$/, "");
}

export default function robots(): MetadataRoute.Robots {
  const base = siteBase();
  return {
    rules: [{
      userAgent: "*",
      allow: ["/", "/projects/", "/.netlify/functions/portfolio-media"],
      disallow: [
        "/admin/",
        "/.netlify/functions/admin-auth",
        "/.netlify/functions/analytics-admin",
        "/.netlify/functions/portfolio-content-admin",
        "/.netlify/functions/portfolio-media-admin",
      ],
    }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}

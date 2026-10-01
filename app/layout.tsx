import type { Metadata } from "next";
import type { ReactNode } from "react";
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://vthish.dev"),
  title: "Venusha Thishan | Software Engineer",
  description:
    "Portfolio of Venusha Thishan — software engineer building modern web, mobile, cloud and automation products.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  keywords: [
    "Venusha Thishan",
    "Software Engineer",
    "Full Stack Developer",
    "Next.js Developer",
    "Node.js Developer",
    "Nest.js Developer",
    "Flutter Developer",
    "DevOps",
    "Docker",
    "Sri Lanka",
  ],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body><AnalyticsTracker />{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Venusha Thishan | Software Engineer",
  description:
    "Portfolio of Venusha Thishan — software engineer building modern web, mobile, cloud and automation products.",
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
      <body>{children}</body>
    </html>
  );
}

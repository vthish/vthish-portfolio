import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Venusha Thishan | Software Engineer",
  description:
    "Portfolio of Venusha Thishan — software engineer building web, mobile, AI and automation experiences.",
  keywords: [
    "Venusha Thishan",
    "Software Engineer",
    "Full Stack Developer",
    "Flutter Developer",
    "AI Developer",
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

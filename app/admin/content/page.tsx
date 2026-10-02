import type { Metadata } from "next";
import ContentManager from "./ContentManager";

export const metadata: Metadata = {
  title: "Portfolio Content | Venusha Thishan",
  robots: { index: false, follow: false, nocache: true },
};

export default function ContentAdminPage() {
  return <ContentManager />;
}

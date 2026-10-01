import type { Metadata } from "next";
import AnalyticsDashboard from "./AnalyticsDashboard";

export const metadata: Metadata = {
  title: "Private Analytics | Venusha Thishan",
  robots: { index: false, follow: false, nocache: true },
};

export default function AnalyticsPage() {
  return <AnalyticsDashboard />;
}

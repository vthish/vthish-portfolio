import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private Admin | Venusha Thishan",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminPage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#050814", color: "#eef4ff", fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div style={{ width: "min(720px, 100%)" }}>
        <span style={{ color: "#73a8ff", fontSize: 11, letterSpacing: ".18em", fontWeight: 800 }}>VTHISH.DEV · PRIVATE</span>
        <h1 style={{ fontSize: "clamp(34px, 7vw, 62px)", margin: "10px 0 16px", letterSpacing: "-.05em" }}>Admin</h1>
        <p style={{ color: "#9ba9bf", lineHeight: 1.7, maxWidth: 580 }}>Use one admin password for private analytics and portfolio content management.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginTop: 30 }}>
          <a href="/admin/analytics" style={{ padding: 24, borderRadius: 20, border: "1px solid rgba(133,162,240,.18)", background: "rgba(18,27,52,.72)", color: "#eef4ff", textDecoration: "none" }}><strong style={{ display: "block", fontSize: 20 }}>Analytics</strong><span style={{ display: "block", color: "#8f9db5", marginTop: 8, lineHeight: 1.5 }}>Views, unique visitors, countries, devices and browsers.</span></a>
          <a href="/admin/content" style={{ padding: 24, borderRadius: 20, border: "1px solid rgba(133,162,240,.18)", background: "rgba(18,27,52,.72)", color: "#eef4ff", textDecoration: "none" }}><strong style={{ display: "block", fontSize: 20 }}>Portfolio content</strong><span style={{ display: "block", color: "#8f9db5", marginTop: 8, lineHeight: 1.5 }}>Manage the full portfolio: CV, hero, about, skills, projects, screenshots, education, experience, certificates and contact content.</span></a>
        </div>
        <a href="/" style={{ display: "inline-block", marginTop: 24, color: "#a9c9ff", textDecoration: "none" }}>← Back to portfolio</a>
      </div>
    </main>
  );
}

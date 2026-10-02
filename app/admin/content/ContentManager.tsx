"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import {
  CONTENT_ICON_KEYS,
  DEFAULT_PORTFOLIO_CONTENT,
  itemNumber,
  projectNumber,
  type CertificateItem,
  type ContentIconKey,
  type EducationItem,
  type ExperienceItem,
  type PortfolioContent,
  type PortfolioProject,
  type ServiceItem,
  type SkillGroup,
  type SocialLink,
} from "@/lib/portfolio-content";
import { resolveVideoSource } from "@/lib/video";
import styles from "./content.module.css";

const iconLabels: Record<ContentIconKey, string> = {
  database: "Database",
  phone: "Mobile",
  sparkles: "AI / Sparkles",
  brain: "AI / Brain",
  cloud: "Cloud",
  layers: "Layers",
  code: "Code",
  graduation: "Graduation",
  certificate: "Certificate",
};

const socialIconLabels: Record<SocialLink["icon"], string> = {
  github: "GitHub",
  gitlab: "GitLab",
  linkedin: "LinkedIn",
  link: "External link",
};

const stamp = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const toCsv = (items: string[]) => items.join(", ");
const fromCsv = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean);

function newProject(): PortfolioProject {
  return { id: `project-${stamp()}`, title: "New Project", category: "Software / Project", description: "Add a concise description of what this project does and the problem it solves.", href: "https://github.com/vthish", chips: ["Project"], stack: ["TypeScript"], icon: "code", imageUrl: "", imageUrls: [], videoUrl: "" };
}
function newSkillGroup(): SkillGroup {
  return { id: `skill-${stamp()}`, title: "New Skill Group", summary: "Describe this capability area.", items: ["Skill"], icon: "code" };
}
function newService(): ServiceItem {
  return { id: `service-${stamp()}`, title: "New Service", text: "Describe the service you can provide.", icon: "code" };
}
function newEducation(): EducationItem {
  return { id: `education-${stamp()}`, period: "Year / Institution", title: "New Education", place: "Program / Stream", text: "Describe this education milestone.", icon: "graduation" };
}
function newCertificate(): CertificateItem {
  return { id: `certificate-${stamp()}`, title: "New Certificate", issuer: "Issuer", date: "Year", description: "Describe what this certificate validates.", credentialUrl: "", imageUrl: "", imageUrls: [] };
}
function newExperience(): ExperienceItem {
  return { id: `experience-${stamp()}`, role: "Role title", company: "Company", period: "Start – End", location: "Location", description: "Describe your role and impact.", highlights: ["Key responsibility"], imageUrl: "", imageUrls: [] };
}
function newSocial(): SocialLink {
  return { id: `social-${stamp()}`, label: "Profile", href: "https://", icon: "link" };
}

function SectionHead({ kicker, title, text, action }: { kicker: string; title: string; text?: string; action?: ReactNode }) {
  return <div className={styles.sectionHead}><div><span className={styles.kicker}>{kicker}</span><h2>{title}</h2>{text ? <p>{text}</p> : null}</div>{action}</div>;
}

function Field({ label, children, full = false, hint }: { label: string; children: ReactNode; full?: boolean; hint?: string }) {
  return <label className={`${styles.field} ${full ? styles.full : ""}`}><span>{label}</span>{children}{hint ? <small>{hint}</small> : null}</label>;
}

function HeadingFields({ value, onChange }: { value: { eyebrow: string; title: string; text: string }; onChange: (next: { eyebrow: string; title: string; text: string }) => void }) {
  return <div className={styles.formGrid}>
    <Field label="Eyebrow"><input value={value.eyebrow} onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}/></Field>
    <Field label="Section title"><input value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })}/></Field>
    <Field label="Section description" full><textarea rows={2} value={value.text} onChange={(e) => onChange({ ...value, text: e.target.value })}/></Field>
  </div>;
}

function MediaField({ label, value, onChange, hint }: { label: string; value?: string; onChange: (url: string) => void; hint?: string }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file?: File) {
    if (!file) return;
    setUploading(true); setError("");
    try {
      const body = new FormData(); body.append("file", file);
      const response = await fetch("/.netlify/functions/portfolio-media-admin", { method: "POST", body, credentials: "same-origin" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Upload failed.");
      onChange(payload.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally { setUploading(false); }
  }

  return <div className={`${styles.field} ${styles.full}`}>
    <span>{label}</span>
    <div className={styles.mediaRow}>
      <input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="/images/example.webp or https://..." />
      <label className={styles.uploadButton}>{uploading ? "Uploading…" : "Upload image"}<input type="file" accept="image/png,image/jpeg,image/webp" disabled={uploading} onChange={(e) => { void upload(e.target.files?.[0]); e.currentTarget.value = ""; }}/></label>
      {value ? <button className={styles.removeMedia} type="button" onClick={() => onChange("")}>Remove</button> : null}
    </div>
    {hint ? <small>{hint}</small> : null}
    {error ? <small className={styles.errorInline}>{error}</small> : null}
    {value ? <div className={styles.mediaPreview}><img src={value} alt="Preview"/></div> : null}
  </div>;
}


function ProjectVideoField({ value, onChange }: { value?: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const source = resolveVideoSource(value);

  async function upload(file?: File) {
    if (!file) return;
    setUploading(true); setError("");
    try {
      const body = new FormData(); body.append("file", file);
      const response = await fetch("/.netlify/functions/portfolio-media-admin", { method: "POST", body, credentials: "same-origin" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Video upload failed.");
      onChange(payload.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Video upload failed.");
    } finally { setUploading(false); }
  }

  return <div className={`${styles.field} ${styles.full}`}>
    <span>Project demo video <small className={styles.optionalLabel}>optional</small></span>
    <div className={styles.mediaRow}>
      <input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="YouTube, Vimeo, Loom, Drive, TikTok, direct MP4/WebM, or another video link" />
      <label className={styles.uploadButton}>{uploading ? "Uploading…" : value ? "Replace upload" : "Upload video"}<input type="file" accept="video/mp4,video/webm" disabled={uploading} onChange={(e) => { void upload(e.target.files?.[0]); e.currentTarget.value = ""; }}/></label>
      {value ? <button className={styles.removeMedia} type="button" onClick={() => onChange("")}>Remove</button> : null}
    </div>
    <small>Paste a YouTube / YouTube Shorts / Vimeo / Loom / Google Drive / Dailymotion / Streamable / TikTok link, a direct MP4/WebM URL, or upload an MP4/WebM (max 4 MB). Unknown providers are kept as a safe “Watch demo” link.</small>
    {error ? <small className={styles.errorInline}>{error}</small> : null}
    {source ? <div className={`${styles.mediaPreview} ${styles.videoPreview}`}>
      {source.kind === "direct" ? <video src={source.src} controls muted playsInline preload="metadata" /> : source.kind === "embed" ? <iframe src={source.src} title={`${source.provider} preview`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /> : <a href={source.src} target="_blank" rel="noreferrer">Open {source.provider} video ↗</a>}
    </div> : null}
  </div>;
}


function MediaGalleryField({ label, values, legacyValue, onChange, max = 10, hint, emptyText }: { label: string; values?: string[]; legacyValue?: string; onChange: (urls: string[]) => void; max?: number; hint?: string; emptyText?: string }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const current = (values && values.length ? values : legacyValue ? [legacyValue] : []).filter(Boolean).slice(0, max);

  async function upload(files?: FileList | null) {
    if (!files?.length) return;
    setUploading(true); setError("");
    try {
      const room = Math.max(0, max - current.length);
      const selected = Array.from(files).slice(0, room);
      const uploaded: string[] = [];
      for (const file of selected) {
        const body = new FormData(); body.append("file", file);
        const response = await fetch("/.netlify/functions/portfolio-media-admin", { method: "POST", body, credentials: "same-origin" });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || `Upload failed for ${file.name}.`);
        if (payload.url) uploaded.push(payload.url);
      }
      onChange([...current, ...uploaded].slice(0, max));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally { setUploading(false); }
  }

  function move(index: number, direction: -1 | 1) {
    const next = [...current]; const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function remove(index: number) { onChange(current.filter((_, i) => i !== index)); }

  return <div className={`${styles.field} ${styles.full}`}>
    <span>{label}</span>
    <div className={styles.galleryToolbar}>
      <label className={styles.uploadButton}>{uploading ? "Uploading…" : current.length ? "Add more images" : "Upload images"}<input type="file" multiple accept="image/png,image/jpeg,image/webp" disabled={uploading || current.length >= max} onChange={(e) => { void upload(e.target.files); e.currentTarget.value = ""; }}/></label>
      <small>{current.length}/{max} images · JPG/PNG/WebP · max 4 MB each. First image is shown first.</small>
    </div>
    {hint ? <small>{hint}</small> : null}
    {error ? <small className={styles.errorInline}>{error}</small> : null}
    {current.length ? <div className={styles.projectGalleryAdmin}>{current.map((url, index) => <div className={styles.projectGalleryItem} key={`${url}-${index}`}>
      <div className={styles.projectGalleryImage}><img src={url} alt={`${label} ${index + 1}`}/>{index === 0 ? <span>First</span> : null}</div>
      <div className={styles.projectGalleryActions}><button type="button" disabled={index === 0} onClick={() => move(index, -1)}>←</button><button type="button" disabled={index === current.length - 1} onClick={() => move(index, 1)}>→</button><button type="button" onClick={() => remove(index)}>Remove</button></div>
    </div>)}</div> : <div className={styles.emptyState}>{emptyText || "No images yet."}</div>}
  </div>;
}


function OrderButtons({ index, total, onMove, onDelete, label = "item" }: { index: number; total: number; onMove: (direction: -1 | 1) => void; onDelete: () => void; label?: string }) {
  return <div className={styles.orderButtons}><button type="button" disabled={index === 0} onClick={() => onMove(-1)} aria-label={`Move ${label} up`}>↑</button><button type="button" disabled={index === total - 1} onClick={() => onMove(1)} aria-label={`Move ${label} down`}>↓</button><button className={styles.deleteButton} type="button" onClick={onDelete}>Delete</button></div>;
}

export default function ContentManager() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [content, setContent] = useState<PortfolioContent>(DEFAULT_PORTFOLIO_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadContent() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/.netlify/functions/portfolio-content-admin", { cache: "no-store", credentials: "same-origin" });
      if (response.status === 401) { setAuthenticated(false); return; }
      if (!response.ok) throw new Error("Could not load portfolio content.");
      setContent((await response.json()) as PortfolioContent); setAuthenticated(true);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not load portfolio content."); }
    finally { setLoading(false); }
  }

  useEffect(() => { void loadContent(); }, []);

  async function login(event: FormEvent) {
    event.preventDefault(); if (!password) return;
    setLoading(true); setError("");
    try {
      const response = await fetch("/.netlify/functions/admin-auth", { method: "POST", headers: { "content-type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ password }) });
      if (!response.ok) { setError(response.status === 401 ? "Wrong password." : "Could not sign in."); return; }
      setPassword(""); await loadContent();
    } catch { setError("Could not connect to the admin service."); }
    finally { setLoading(false); }
  }

  async function logout() {
    await fetch("/.netlify/functions/admin-auth", { method: "DELETE", credentials: "same-origin" }).catch(() => undefined);
    setAuthenticated(false); setNotice("");
  }

  type EditableArrayKey = "socialLinks" | "projects" | "education" | "experiences" | "certificates";
  function patchArray(key: EditableArrayKey, index: number, patch: Record<string, unknown>) {
    setContent((current) => ({ ...current, [key]: (current[key] as unknown as Record<string, unknown>[]).map((item, i) => i === index ? { ...item, ...patch } : item) } as PortfolioContent)); setNotice("");
  }
  function moveArray(key: EditableArrayKey, index: number, direction: -1 | 1) {
    setContent((current) => { const next = [...(current[key] as unknown as Record<string, unknown>[])]; const target = index + direction; if (target < 0 || target >= next.length) return current; [next[index], next[target]] = [next[target], next[index]]; return { ...current, [key]: next } as PortfolioContent; }); setNotice("");
  }
  function removeArray(key: EditableArrayKey, index: number, label: string) {
    if (!window.confirm(`Remove this ${label} from the portfolio?`)) return;
    setContent((current) => ({ ...current, [key]: (current[key] as unknown as Record<string, unknown>[]).filter((_, i) => i !== index) } as PortfolioContent)); setNotice("");
  }

  function patchSkillGroup(index: number, patch: Partial<SkillGroup>) {
    setContent((current) => ({ ...current, skills: { ...current.skills, groups: current.skills.groups.map((item, i) => i === index ? { ...item, ...patch } : item) } })); setNotice("");
  }
  function moveSkillGroup(index: number, direction: -1 | 1) {
    setContent((current) => { const next = [...current.skills.groups]; const target = index + direction; if (target < 0 || target >= next.length) return current; [next[index], next[target]] = [next[target], next[index]]; return { ...current, skills: { ...current.skills, groups: next } }; }); setNotice("");
  }
  function removeSkillGroup(index: number) { if (!window.confirm("Remove this skill group?")) return; setContent((current) => ({ ...current, skills: { ...current.skills, groups: current.skills.groups.filter((_, i) => i !== index) } })); }
  function patchService(index: number, patch: Partial<ServiceItem>) { setContent((current) => ({ ...current, skills: { ...current.skills, services: current.skills.services.map((item, i) => i === index ? { ...item, ...patch } : item) } })); setNotice(""); }
  function moveService(index: number, direction: -1 | 1) { setContent((current) => { const next = [...current.skills.services]; const target = index + direction; if (target < 0 || target >= next.length) return current; [next[index], next[target]] = [next[target], next[index]]; return { ...current, skills: { ...current.skills, services: next } }; }); setNotice(""); }
  function removeService(index: number) { if (!window.confirm("Remove this service?")) return; setContent((current) => ({ ...current, skills: { ...current.skills, services: current.skills.services.filter((_, i) => i !== index) } })); }

  async function save() {
    if (saving) return; setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch("/.netlify/functions/portfolio-content-admin", { method: "PUT", headers: { "content-type": "application/json" }, credentials: "same-origin", body: JSON.stringify(content) });
      const payload = await response.json().catch(() => ({}));
      if (response.status === 401) { setAuthenticated(false); setError("Your admin session expired. Sign in again."); return; }
      if (!response.ok) throw new Error(payload.error || "Could not save changes.");
      setContent(payload as PortfolioContent); setNotice("Saved. Refresh the live portfolio to see the updated content.");
    } catch (err) { setError(err instanceof Error ? err.message : "Could not save changes."); }
    finally { setSaving(false); }
  }

  const counts = useMemo(() => `${content.projects.length} projects · ${content.education.length} education · ${content.experiences.length} experience · ${content.certificates.length} certificates`, [content]);

  if (loading && authenticated === null) return <main className={styles.page}><div className={styles.loading}>Loading admin…</div></main>;
  if (!authenticated) return <main className={styles.page}><form className={styles.loginCard} onSubmit={login}><div className={styles.mark}>VT</div><span className={styles.eyebrow}>PRIVATE ADMIN</span><h1>Portfolio content</h1><p>Manage the live portfolio with the same password as your private analytics dashboard.</p><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Admin password" autoComplete="current-password" autoFocus/><button type="submit" disabled={loading}>{loading ? "Signing in…" : "Open content manager"}</button>{error ? <div className={styles.error}>{error}</div> : null}<div className={styles.loginLinks}><a href="/admin/analytics">Analytics</a><a href="/">Portfolio</a></div></form></main>;

  return <main className={styles.page}><div className={styles.dashboard}>
    <header className={styles.header}><div><span className={styles.eyebrow}>VTHISH.DEV · PRIVATE ADMIN</span><h1>Portfolio content</h1><p>Full content manager · {counts}</p></div><div className={styles.headerActions}><a href="/admin/analytics">Analytics</a><a href="/" target="_blank" rel="noreferrer">Open portfolio ↗</a><button type="button" onClick={logout}>Lock</button></div></header>

    <section className={styles.panel}>
      <SectionHead kicker="SITE" title="Identity, contact & CV" text="Core details used across the hero, footer, WhatsApp, email and CV buttons."/>
      <div className={styles.formGrid}>
        <Field label="Full name"><input value={content.identity.name} onChange={(e) => setContent((c) => ({ ...c, identity: { ...c.identity, name: e.target.value } }))}/></Field>
        <Field label="Brand initials"><input value={content.identity.brandInitials} onChange={(e) => setContent((c) => ({ ...c, identity: { ...c.identity, brandInitials: e.target.value } }))}/></Field>
        <Field label="First name"><input value={content.identity.firstName} onChange={(e) => setContent((c) => ({ ...c, identity: { ...c.identity, firstName: e.target.value } }))}/></Field>
        <Field label="Last name"><input value={content.identity.lastName} onChange={(e) => setContent((c) => ({ ...c, identity: { ...c.identity, lastName: e.target.value } }))}/></Field>
        <Field label="Location"><input value={content.identity.location} onChange={(e) => setContent((c) => ({ ...c, identity: { ...c.identity, location: e.target.value } }))}/></Field>
        <Field label="Email"><input type="email" value={content.identity.email} onChange={(e) => setContent((c) => ({ ...c, identity: { ...c.identity, email: e.target.value } }))}/></Field>
        <Field label="Phone"><input value={content.identity.phone} onChange={(e) => setContent((c) => ({ ...c, identity: { ...c.identity, phone: e.target.value } }))}/></Field>
        <Field label="WhatsApp number" hint="Digits only, including country code. Example: 9471..."><input value={content.identity.whatsappNumber} onChange={(e) => setContent((c) => ({ ...c, identity: { ...c.identity, whatsappNumber: e.target.value } }))}/></Field>
        <Field label="WhatsApp pre-filled message" full><textarea rows={2} value={content.identity.whatsappMessage} onChange={(e) => setContent((c) => ({ ...c, identity: { ...c.identity, whatsappMessage: e.target.value } }))}/></Field>
        <Field label="GitHub profile URL"><input value={content.identity.githubUrl} onChange={(e) => setContent((c) => ({ ...c, identity: { ...c.identity, githubUrl: e.target.value } }))}/></Field>
        <Field label="Footer tagline"><input value={content.identity.footerTagline} onChange={(e) => setContent((c) => ({ ...c, identity: { ...c.identity, footerTagline: e.target.value } }))}/></Field>
        <Field label="CV URL" full hint="Google Drive URL or /cv/your-file.pdf"><input value={content.cvUrl} onChange={(e) => setContent((c) => ({ ...c, cvUrl: e.target.value }))}/></Field>
      </div>
      <div className={styles.inlineActions}><a href={content.cvUrl || "#"} target="_blank" rel="noreferrer">Test CV link ↗</a></div>
    </section>

    <section className={styles.panel}>
      <SectionHead kicker="SOCIAL" title="Social links" text="Add, edit, delete or reorder the profile links shown in the hero and footer." action={<button className={styles.addButton} type="button" onClick={() => setContent((c) => ({ ...c, socialLinks: [...c.socialLinks, newSocial()] }))}>+ Add social</button>}/>
      <div className={styles.compactList}>{content.socialLinks.map((item, index) => <article className={styles.compactCard} key={item.id}><div className={styles.projectTop}><div className={styles.projectIndex}>{itemNumber(index)}</div><div className={styles.projectTopCopy}><strong>{item.label}</strong><span>{item.href}</span></div><OrderButtons index={index} total={content.socialLinks.length} label="social link" onMove={(d) => moveArray("socialLinks", index, d)} onDelete={() => removeArray("socialLinks", index, "social link")}/></div><div className={styles.formGrid}><Field label="Label"><input value={item.label} onChange={(e) => patchArray("socialLinks", index, { label: e.target.value })}/></Field><Field label="Icon"><select value={item.icon} onChange={(e) => patchArray("socialLinks", index, { icon: e.target.value as SocialLink["icon"] })}>{Object.entries(socialIconLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></Field><Field label="URL" full><input value={item.href} onChange={(e) => patchArray("socialLinks", index, { href: e.target.value })}/></Field></div></article>)}</div>
    </section>

    <section className={styles.panel}>
      <SectionHead kicker="HERO" title="Hero content" text="Edit the first screen without changing its animation or layout."/>
      <div className={styles.formGrid}>
        <Field label="Status"><input value={content.hero.status} onChange={(e) => setContent((c) => ({ ...c, hero: { ...c.hero, status: e.target.value } }))}/></Field>
        <Field label="Kicker"><input value={content.hero.kicker} onChange={(e) => setContent((c) => ({ ...c, hero: { ...c.hero, kicker: e.target.value } }))}/></Field>
        <Field label="Rotating roles · comma separated" full><input value={toCsv(content.hero.roles)} onChange={(e) => setContent((c) => ({ ...c, hero: { ...c.hero, roles: fromCsv(e.target.value) } }))}/></Field>
        <Field label="Hero description" full><textarea rows={3} value={content.hero.text} onChange={(e) => setContent((c) => ({ ...c, hero: { ...c.hero, text: e.target.value } }))}/></Field>
        <Field label="Focus areas"><input value={content.hero.focusAreas} onChange={(e) => setContent((c) => ({ ...c, hero: { ...c.hero, focusAreas: e.target.value } }))}/></Field>
        <Field label="Core stack"><input value={content.hero.coreStack} onChange={(e) => setContent((c) => ({ ...c, hero: { ...c.hero, coreStack: e.target.value } }))}/></Field>
        <MediaGalleryField label="Hero portraits" values={content.hero.profileImageUrls} legacyValue={content.hero.profileImageUrl} onChange={(urls) => setContent((c) => ({ ...c, hero: { ...c.hero, profileImageUrls: urls, profileImageUrl: urls[0] || c.hero.profileImageUrl } }))} max={10} hint="Upload multiple portraits. They rotate smoothly in the same hero frame; with one image the current design stays unchanged."/>
        <Field label="Tech marquee · comma separated" full><input value={toCsv(content.marquee)} onChange={(e) => setContent((c) => ({ ...c, marquee: fromCsv(e.target.value) }))}/></Field>
      </div>
    </section>

    <section className={styles.panel}>
      <SectionHead kicker="ABOUT" title="About section" text="Use **double asterisks** around words you want to keep bold in the paragraph text."/>
      <HeadingFields value={content.about.heading} onChange={(heading) => setContent((c) => ({ ...c, about: { ...c.about, heading } }))}/>
      <div className={styles.subHead}><strong>About paragraphs</strong><button className={styles.addButton} type="button" onClick={() => setContent((c) => ({ ...c, about: { ...c.about, paragraphs: [...c.about.paragraphs, "New paragraph"] } }))}>+ Add paragraph</button></div>
      <div className={styles.compactList}>{content.about.paragraphs.map((paragraph, index) => <article className={styles.compactCard} key={`about-${index}`}><div className={styles.projectTop}><div className={styles.projectIndex}>{itemNumber(index)}</div><div className={styles.projectTopCopy}><strong>Paragraph {index + 1}</strong></div><div className={styles.orderButtons}><button type="button" disabled={index === 0} onClick={() => setContent((c) => { const next=[...c.about.paragraphs]; [next[index-1],next[index]]=[next[index],next[index-1]]; return {...c,about:{...c.about,paragraphs:next}}; })}>↑</button><button type="button" disabled={index === content.about.paragraphs.length - 1} onClick={() => setContent((c) => { const next=[...c.about.paragraphs]; [next[index+1],next[index]]=[next[index],next[index+1]]; return {...c,about:{...c.about,paragraphs:next}}; })}>↓</button><button className={styles.deleteButton} type="button" onClick={() => setContent((c) => ({ ...c, about: { ...c.about, paragraphs: c.about.paragraphs.filter((_, i) => i !== index) } }))}>Delete</button></div></div><Field label="Text" full><textarea rows={3} value={paragraph} onChange={(e) => setContent((c) => ({ ...c, about: { ...c.about, paragraphs: c.about.paragraphs.map((item, i) => i === index ? e.target.value : item) } }))}/></Field></article>)}</div>
      <div className={styles.formGrid}>
        <Field label="Curiosity value"><input value={content.about.curiosityValue} onChange={(e) => setContent((c) => ({ ...c, about: { ...c.about, curiosityValue: e.target.value } }))}/></Field>
        <Field label="Curiosity label"><input value={content.about.curiosityLabel} onChange={(e) => setContent((c) => ({ ...c, about: { ...c.about, curiosityLabel: e.target.value } }))}/></Field>
        <MediaGalleryField label="About photos" values={content.about.imageUrls} legacyValue={content.about.imageUrl} onChange={(urls) => setContent((c) => ({ ...c, about: { ...c.about, imageUrls: urls, imageUrl: urls[0] || c.about.imageUrl } }))} max={10} hint="Multiple photos rotate inside the existing About image frame."/>
      </div>
    </section>

    <section className={styles.panel}>
      <SectionHead kicker="SKILLS" title="Skills & services" text="Everything in the capabilities section is editable here."/>
      <HeadingFields value={content.skills.heading} onChange={(heading) => setContent((c) => ({ ...c, skills: { ...c.skills, heading } }))}/>
      <Field label="Featured skills · comma separated" full><input value={toCsv(content.skills.featured)} onChange={(e) => setContent((c) => ({ ...c, skills: { ...c.skills, featured: fromCsv(e.target.value) } }))}/></Field>
      <div className={styles.subHead}><strong>Skill groups</strong><button className={styles.addButton} type="button" onClick={() => setContent((c) => ({ ...c, skills: { ...c.skills, groups: [...c.skills.groups, newSkillGroup()] } }))}>+ Add group</button></div>
      <div className={styles.compactList}>{content.skills.groups.map((group, index) => <article className={styles.compactCard} key={group.id}><div className={styles.projectTop}><div className={styles.projectIndex}>{itemNumber(index)}</div><div className={styles.projectTopCopy}><strong>{group.title}</strong><span>{group.items.length} skills</span></div><OrderButtons index={index} total={content.skills.groups.length} onMove={(d) => moveSkillGroup(index, d)} onDelete={() => removeSkillGroup(index)}/></div><div className={styles.formGrid}><Field label="Title"><input value={group.title} onChange={(e) => patchSkillGroup(index, { title: e.target.value })}/></Field><Field label="Icon"><select value={group.icon} onChange={(e) => patchSkillGroup(index, { icon: e.target.value as ContentIconKey })}>{CONTENT_ICON_KEYS.map((key) => <option value={key} key={key}>{iconLabels[key]}</option>)}</select></Field><Field label="Summary" full><textarea rows={2} value={group.summary} onChange={(e) => patchSkillGroup(index, { summary: e.target.value })}/></Field><Field label="Skills · comma separated" full><input value={toCsv(group.items)} onChange={(e) => patchSkillGroup(index, { items: fromCsv(e.target.value) })}/></Field></div></article>)}</div>
      <div className={styles.subHead}><strong>Services</strong><button className={styles.addButton} type="button" onClick={() => setContent((c) => ({ ...c, skills: { ...c.skills, services: [...c.skills.services, newService()] } }))}>+ Add service</button></div>
      <div className={styles.compactList}>{content.skills.services.map((service, index) => <article className={styles.compactCard} key={service.id}><div className={styles.projectTop}><div className={styles.projectIndex}>{itemNumber(index)}</div><div className={styles.projectTopCopy}><strong>{service.title}</strong></div><OrderButtons index={index} total={content.skills.services.length} onMove={(d) => moveService(index, d)} onDelete={() => removeService(index)}/></div><div className={styles.formGrid}><Field label="Title"><input value={service.title} onChange={(e) => patchService(index, { title: e.target.value })}/></Field><Field label="Icon"><select value={service.icon} onChange={(e) => patchService(index, { icon: e.target.value as ContentIconKey })}>{CONTENT_ICON_KEYS.map((key) => <option value={key} key={key}>{iconLabels[key]}</option>)}</select></Field><Field label="Description" full><textarea rows={2} value={service.text} onChange={(e) => patchService(index, { text: e.target.value })}/></Field></div></article>)}</div>
    </section>

    <section className={styles.projectsSection}>
      <SectionHead kicker="PROJECTS" title={`${content.projects.length} project${content.projects.length === 1 ? "" : "s"}`} text="Add real screenshots when you have them. If Image is empty, the original developer-console visual stays exactly as the fallback." action={<button className={styles.addButton} type="button" onClick={() => setContent((c) => ({ ...c, projects: [...c.projects, newProject()] }))}>+ Add project</button>}/>
      <div className={styles.panel}><HeadingFields value={content.projectsHeading} onChange={(projectsHeading) => setContent((c) => ({ ...c, projectsHeading }))}/></div>
      <div className={styles.projectList}>{content.projects.map((project, index) => <article className={styles.projectCard} key={project.id}><div className={styles.projectTop}><div className={styles.projectIndex}>{projectNumber(index)}</div><div className={styles.projectTopCopy}><strong>{project.title || "Untitled project"}</strong><span>{project.category || "No category"}</span></div><OrderButtons index={index} total={content.projects.length} label="project" onMove={(d) => moveArray("projects", index, d)} onDelete={() => removeArray("projects", index, "project")}/></div><div className={styles.formGrid}><Field label="Project title"><input value={project.title} onChange={(e) => patchArray("projects", index, { title: e.target.value })}/></Field><Field label="Category"><input value={project.category} onChange={(e) => patchArray("projects", index, { category: e.target.value })}/></Field><Field label="Repository / project URL" full><input value={project.href} onChange={(e) => patchArray("projects", index, { href: e.target.value })}/></Field><Field label="Description" full><textarea rows={4} value={project.description} onChange={(e) => patchArray("projects", index, { description: e.target.value })}/></Field><Field label="Highlight chips · comma separated"><input value={toCsv(project.chips)} onChange={(e) => patchArray("projects", index, { chips: fromCsv(e.target.value) })}/></Field><Field label="Tech stack · comma separated"><input value={toCsv(project.stack)} onChange={(e) => patchArray("projects", index, { stack: fromCsv(e.target.value) })}/></Field><Field label="Card icon"><select value={project.icon} onChange={(e) => patchArray("projects", index, { icon: e.target.value as ContentIconKey })}>{CONTENT_ICON_KEYS.map((key) => <option value={key} key={key}>{iconLabels[key]}</option>)}</select></Field><Field label="Internal ID"><input value={project.id} onChange={(e) => patchArray("projects", index, { id: e.target.value })}/></Field><MediaGalleryField label="Project screenshots" values={project.imageUrls} legacyValue={project.imageUrl} onChange={(urls) => patchArray("projects", index, { imageUrls: urls, imageUrl: urls[0] || "" })} max={12} emptyText="No screenshots yet. The portfolio keeps the current default developer-console graphic until you upload one."/><ProjectVideoField value={project.videoUrl} onChange={(url) => patchArray("projects", index, { videoUrl: url })}/></div></article>)}</div>
    </section>

    <section className={styles.panel}>
      <SectionHead kicker="EDUCATION" title="Education" text="Add, edit, delete and reorder formal education milestones." action={<button className={styles.addButton} type="button" onClick={() => setContent((c) => ({ ...c, education: [...c.education, newEducation()] }))}>+ Add education</button>}/>
      <HeadingFields value={content.educationHeading} onChange={(educationHeading) => setContent((c) => ({ ...c, educationHeading }))}/>
      <div className={styles.compactList}>{content.education.map((item, index) => <article className={styles.compactCard} key={item.id}><div className={styles.projectTop}><div className={styles.projectIndex}>{itemNumber(index)}</div><div className={styles.projectTopCopy}><strong>{item.title}</strong><span>{item.period}</span></div><OrderButtons index={index} total={content.education.length} label="education item" onMove={(d) => moveArray("education", index, d)} onDelete={() => removeArray("education", index, "education item")}/></div><div className={styles.formGrid}><Field label="Period / institution"><input value={item.period} onChange={(e) => patchArray("education", index, { period: e.target.value })}/></Field><Field label="Icon"><select value={item.icon} onChange={(e) => patchArray("education", index, { icon: e.target.value as ContentIconKey })}>{CONTENT_ICON_KEYS.map((key) => <option value={key} key={key}>{iconLabels[key]}</option>)}</select></Field><Field label="Title"><input value={item.title} onChange={(e) => patchArray("education", index, { title: e.target.value })}/></Field><Field label="Place / stream"><input value={item.place} onChange={(e) => patchArray("education", index, { place: e.target.value })}/></Field><Field label="Description" full><textarea rows={3} value={item.text} onChange={(e) => patchArray("education", index, { text: e.target.value })}/></Field></div></article>)}</div>
    </section>

    <section className={styles.panel}>
      <SectionHead kicker="EXPERIENCE" title="Experience" text="This section stays completely hidden on the public portfolio while there are no entries. Add one later and it appears automatically with matching styling." action={<button className={styles.addButton} type="button" onClick={() => setContent((c) => ({ ...c, experiences: [...c.experiences, newExperience()] }))}>+ Add experience</button>}/>
      <HeadingFields value={content.experienceHeading} onChange={(experienceHeading) => setContent((c) => ({ ...c, experienceHeading }))}/>
      {content.experiences.length === 0 ? <div className={styles.emptyState}>No experience entries yet · public section is hidden.</div> : null}
      <div className={styles.compactList}>{content.experiences.map((item, index) => <article className={styles.compactCard} key={item.id}><div className={styles.projectTop}><div className={styles.projectIndex}>{itemNumber(index)}</div><div className={styles.projectTopCopy}><strong>{item.role}</strong><span>{item.company}</span></div><OrderButtons index={index} total={content.experiences.length} label="experience" onMove={(d) => moveArray("experiences", index, d)} onDelete={() => removeArray("experiences", index, "experience")}/></div><div className={styles.formGrid}><Field label="Role"><input value={item.role} onChange={(e) => patchArray("experiences", index, { role: e.target.value })}/></Field><Field label="Company"><input value={item.company} onChange={(e) => patchArray("experiences", index, { company: e.target.value })}/></Field><Field label="Period"><input value={item.period} onChange={(e) => patchArray("experiences", index, { period: e.target.value })}/></Field><Field label="Location"><input value={item.location} onChange={(e) => patchArray("experiences", index, { location: e.target.value })}/></Field><Field label="Description" full><textarea rows={3} value={item.description} onChange={(e) => patchArray("experiences", index, { description: e.target.value })}/></Field><Field label="Highlights · comma separated" full><input value={toCsv(item.highlights)} onChange={(e) => patchArray("experiences", index, { highlights: fromCsv(e.target.value) })}/></Field><MediaGalleryField label="Company / work images" values={item.imageUrls} legacyValue={item.imageUrl} onChange={(urls) => patchArray("experiences", index, { imageUrls: urls, imageUrl: urls[0] || "" })} max={10} hint="Add several work/company images. They rotate inside the existing experience card."/></div></article>)}</div>
    </section>

    <section className={styles.panel}>
      <SectionHead kicker="CERTIFICATES" title="Certificates" text="No certificate section is shown publicly until you add a certificate. Each item supports an image, content and optional credential link." action={<button className={styles.addButton} type="button" onClick={() => setContent((c) => ({ ...c, certificates: [...c.certificates, newCertificate()] }))}>+ Add certificate</button>}/>
      <HeadingFields value={content.certificatesHeading} onChange={(certificatesHeading) => setContent((c) => ({ ...c, certificatesHeading }))}/>
      {content.certificates.length === 0 ? <div className={styles.emptyState}>No certificates yet · public section is hidden.</div> : null}
      <div className={styles.compactList}>{content.certificates.map((item, index) => <article className={styles.compactCard} key={item.id}><div className={styles.projectTop}><div className={styles.projectIndex}>{itemNumber(index)}</div><div className={styles.projectTopCopy}><strong>{item.title}</strong><span>{item.issuer}</span></div><OrderButtons index={index} total={content.certificates.length} label="certificate" onMove={(d) => moveArray("certificates", index, d)} onDelete={() => removeArray("certificates", index, "certificate")}/></div><div className={styles.formGrid}><Field label="Certificate title"><input value={item.title} onChange={(e) => patchArray("certificates", index, { title: e.target.value })}/></Field><Field label="Issuer"><input value={item.issuer} onChange={(e) => patchArray("certificates", index, { issuer: e.target.value })}/></Field><Field label="Date"><input value={item.date} onChange={(e) => patchArray("certificates", index, { date: e.target.value })}/></Field><Field label="Credential URL"><input value={item.credentialUrl || ""} onChange={(e) => patchArray("certificates", index, { credentialUrl: e.target.value })}/></Field><Field label="Description" full><textarea rows={3} value={item.description} onChange={(e) => patchArray("certificates", index, { description: e.target.value })}/></Field><MediaGalleryField label="Certificate images" values={item.imageUrls} legacyValue={item.imageUrl} onChange={(urls) => patchArray("certificates", index, { imageUrls: urls, imageUrl: urls[0] || "" })} max={10} hint="Upload one or more certificate images/scans. They rotate inside the existing certificate card without stretching."/></div></article>)}</div>
    </section>

    <section className={styles.panel}>
      <SectionHead kicker="FINAL SECTIONS" title="Photo break & contact" text="Edit the final visual statement and contact CTA."/>
      <div className={styles.subHead}><strong>Photo break</strong></div>
      <div className={styles.formGrid}><Field label="Eyebrow"><input value={content.photoBreak.eyebrow} onChange={(e) => setContent((c) => ({ ...c, photoBreak: { ...c.photoBreak, eyebrow: e.target.value } }))}/></Field><Field label="Title" hint="Press Enter in this field to create a line break."><textarea rows={2} value={content.photoBreak.title} onChange={(e) => setContent((c) => ({ ...c, photoBreak: { ...c.photoBreak, title: e.target.value } }))}/></Field><MediaGalleryField label="Photo break images" values={content.photoBreak.imageUrls} legacyValue={content.photoBreak.imageUrl} onChange={(urls) => setContent((c) => ({ ...c, photoBreak: { ...c.photoBreak, imageUrls: urls, imageUrl: urls[0] || c.photoBreak.imageUrl } }))} max={10}/></div>
      <div className={styles.subHead}><strong>Contact</strong></div>
      <div className={styles.formGrid}><Field label="Eyebrow"><input value={content.contact.eyebrow} onChange={(e) => setContent((c) => ({ ...c, contact: { ...c.contact, eyebrow: e.target.value } }))}/></Field><Field label="Heading"><input value={content.contact.title} onChange={(e) => setContent((c) => ({ ...c, contact: { ...c.contact, title: e.target.value } }))}/></Field><Field label="Accent text"><input value={content.contact.accent} onChange={(e) => setContent((c) => ({ ...c, contact: { ...c.contact, accent: e.target.value } }))}/></Field><Field label="WhatsApp button"><input value={content.contact.whatsappButton} onChange={(e) => setContent((c) => ({ ...c, contact: { ...c.contact, whatsappButton: e.target.value } }))}/></Field><Field label="Contact description" full><textarea rows={3} value={content.contact.text} onChange={(e) => setContent((c) => ({ ...c, contact: { ...c.contact, text: e.target.value } }))}/></Field><Field label="Email button"><input value={content.contact.emailButton} onChange={(e) => setContent((c) => ({ ...c, contact: { ...c.contact, emailButton: e.target.value } }))}/></Field><MediaGalleryField label="Contact photos" values={content.contact.imageUrls} legacyValue={content.contact.imageUrl} onChange={(urls) => setContent((c) => ({ ...c, contact: { ...c.contact, imageUrls: urls, imageUrl: urls[0] || c.contact.imageUrl } }))} max={10}/></div>
    </section>

    <div className={styles.saveBar}><div>{error ? <span className={styles.errorInline}>{error}</span> : notice ? <span className={styles.success}>{notice}</span> : <span>Changes stay private until you press Save.</span>}</div><button type="button" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save portfolio changes"}</button></div>
  </div></main>;
}

"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_PORTFOLIO_CONTENT,
  PROJECT_ICON_KEYS,
  projectNumber,
  type PortfolioContent,
  type PortfolioProject,
  type ProjectIconKey,
} from "@/lib/portfolio-content";
import styles from "./content.module.css";

const iconLabels: Record<ProjectIconKey, string> = {
  database: "Database",
  phone: "Mobile",
  sparkles: "AI / Sparkles",
  brain: "AI / Brain",
  cloud: "Cloud",
  layers: "Layers",
  code: "Code",
};

function newProject(): PortfolioProject {
  const stamp = Date.now().toString(36);
  return {
    id: `project-${stamp}`,
    title: "New Project",
    category: "Software / Project",
    description: "Add a concise description of what this project does and the problem it solves.",
    href: "https://github.com/vthish",
    chips: ["Project"],
    stack: ["TypeScript"],
    icon: "code",
  };
}

function toCsv(items: string[]) {
  return items.join(", ");
}

function fromCsv(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
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
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/.netlify/functions/portfolio-content-admin", {
        cache: "no-store",
        credentials: "same-origin",
      });
      if (response.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (!response.ok) throw new Error("Could not load portfolio content.");
      setContent((await response.json()) as PortfolioContent);
      setAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load portfolio content.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContent();
  }, []);

  async function login(event: FormEvent) {
    event.preventDefault();
    if (!password) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/.netlify/functions/admin-auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        setError(response.status === 401 ? "Wrong password." : "Could not sign in.");
        return;
      }
      setPassword("");
      await loadContent();
    } catch {
      setError("Could not connect to the admin service.");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await fetch("/.netlify/functions/admin-auth", {
      method: "DELETE",
      credentials: "same-origin",
    }).catch(() => undefined);
    setAuthenticated(false);
    setNotice("");
  }

  function patchProject(index: number, patch: Partial<PortfolioProject>) {
    setContent((current) => ({
      ...current,
      projects: current.projects.map((project, projectIndex) => projectIndex === index ? { ...project, ...patch } : project),
    }));
    setNotice("");
  }

  function moveProject(index: number, direction: -1 | 1) {
    setContent((current) => {
      const next = [...current.projects];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...current, projects: next };
    });
    setNotice("");
  }

  function removeProject(index: number) {
    if (!window.confirm("Remove this project from the portfolio?")) return;
    setContent((current) => ({ ...current, projects: current.projects.filter((_, i) => i !== index) }));
    setNotice("");
  }

  async function save() {
    if (saving) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/.netlify/functions/portfolio-content-admin", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(content),
      });
      const payload = await response.json().catch(() => ({}));
      if (response.status === 401) {
        setAuthenticated(false);
        setError("Your admin session expired. Sign in again.");
        return;
      }
      if (!response.ok) throw new Error(payload.error || "Could not save changes.");
      setContent(payload as PortfolioContent);
      setNotice("Saved. The live portfolio will use these values on the next page load.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save changes.");
    } finally {
      setSaving(false);
    }
  }

  const projectCountLabel = useMemo(
    () => `${content.projects.length} project${content.projects.length === 1 ? "" : "s"}`,
    [content.projects.length]
  );

  if (loading && authenticated === null) {
    return <main className={styles.page}><div className={styles.loading}>Loading admin…</div></main>;
  }

  if (!authenticated) {
    return (
      <main className={styles.page}>
        <form className={styles.loginCard} onSubmit={login}>
          <div className={styles.mark}>VT</div>
          <span className={styles.eyebrow}>PRIVATE ADMIN</span>
          <h1>Portfolio content</h1>
          <p>Use the same admin password as your private analytics dashboard.</p>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Admin password"
            autoComplete="current-password"
            autoFocus
          />
          <button type="submit" disabled={loading}>{loading ? "Signing in…" : "Open content manager"}</button>
          {error ? <div className={styles.error}>{error}</div> : null}
          <div className={styles.loginLinks}><a href="/admin/analytics">Analytics</a><a href="/">Portfolio</a></div>
        </form>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>VTHISH.DEV · PRIVATE ADMIN</span>
            <h1>Portfolio content</h1>
            <p>Update your CV link and manage projects without editing source code.</p>
          </div>
          <div className={styles.headerActions}>
            <a href="/admin/analytics">Analytics</a>
            <a href="/" target="_blank" rel="noreferrer">Open portfolio ↗</a>
            <button type="button" onClick={logout}>Lock</button>
          </div>
        </header>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div><span className={styles.kicker}>CV</span><h2>CV link</h2></div>
            <span className={styles.hint}>Google Drive or a direct /cv/file.pdf path</span>
          </div>
          <label className={styles.field}>
            <span>CV URL</span>
            <input
              type="text"
              value={content.cvUrl}
              onChange={(event) => setContent((current) => ({ ...current, cvUrl: event.target.value }))}
              placeholder="https://drive.google.com/file/d/.../view"
            />
          </label>
          <div className={styles.inlineActions}>
            <a href={content.cvUrl || "#"} target="_blank" rel="noreferrer">Test CV link ↗</a>
          </div>
        </section>

        <section className={styles.projectsSection}>
          <div className={styles.sectionHead}>
            <div><span className={styles.kicker}>PROJECTS</span><h2>{projectCountLabel}</h2><p>Add, edit, remove or reorder the cards shown on your portfolio.</p></div>
            <button className={styles.addButton} type="button" onClick={() => setContent((current) => ({ ...current, projects: [...current.projects, newProject()] }))}>+ Add project</button>
          </div>

          <div className={styles.projectList}>
            {content.projects.map((project, index) => (
              <article className={styles.projectCard} key={project.id}>
                <div className={styles.projectTop}>
                  <div className={styles.projectIndex}>{projectNumber(index)}</div>
                  <div className={styles.projectTopCopy}><strong>{project.title || "Untitled project"}</strong><span>{project.category || "No category"}</span></div>
                  <div className={styles.orderButtons}>
                    <button type="button" disabled={index === 0} onClick={() => moveProject(index, -1)} aria-label="Move project up">↑</button>
                    <button type="button" disabled={index === content.projects.length - 1} onClick={() => moveProject(index, 1)} aria-label="Move project down">↓</button>
                    <button className={styles.deleteButton} type="button" onClick={() => removeProject(index)}>Delete</button>
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <label className={styles.field}><span>Project title</span><input value={project.title} onChange={(e) => patchProject(index, { title: e.target.value })} /></label>
                  <label className={styles.field}><span>Category</span><input value={project.category} onChange={(e) => patchProject(index, { category: e.target.value })} /></label>
                  <label className={`${styles.field} ${styles.full}`}><span>Repository / project URL</span><input type="url" value={project.href} onChange={(e) => patchProject(index, { href: e.target.value })} /></label>
                  <label className={`${styles.field} ${styles.full}`}><span>Description</span><textarea rows={4} value={project.description} onChange={(e) => patchProject(index, { description: e.target.value })} /></label>
                  <label className={styles.field}><span>Highlight chips · comma separated</span><input value={toCsv(project.chips)} onChange={(e) => patchProject(index, { chips: fromCsv(e.target.value) })} placeholder="AI, Real-time, AWS" /></label>
                  <label className={styles.field}><span>Tech stack · comma separated</span><input value={toCsv(project.stack)} onChange={(e) => patchProject(index, { stack: fromCsv(e.target.value) })} placeholder="Next.js, TypeScript, PostgreSQL" /></label>
                  <label className={styles.field}><span>Card icon</span><select value={project.icon} onChange={(e) => patchProject(index, { icon: e.target.value as ProjectIconKey })}>{PROJECT_ICON_KEYS.map((icon) => <option value={icon} key={icon}>{iconLabels[icon]}</option>)}</select></label>
                  <label className={styles.field}><span>Internal ID</span><input value={project.id} onChange={(e) => patchProject(index, { id: e.target.value })} /></label>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className={styles.saveBar}>
          <div>{error ? <span className={styles.errorInline}>{error}</span> : notice ? <span className={styles.success}>{notice}</span> : <span>Changes are private until you press Save.</span>}</div>
          <button type="button" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save portfolio changes"}</button>
        </div>
      </div>
    </main>
  );
}

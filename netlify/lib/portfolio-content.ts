import { getStore } from "@netlify/blobs";
import {
  DEFAULT_PORTFOLIO_CONTENT,
  PROJECT_ICON_KEYS,
  type PortfolioContent,
  type PortfolioProject,
  type ProjectIconKey,
} from "../../lib/portfolio-content";

const STORE_NAME = "portfolio-content-v1";
const CONTENT_KEY = "content.json";
const iconKeys = new Set<string>(PROJECT_ICON_KEYS);

function contentStore() {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function safeId(value: unknown, fallback: string) {
  const raw = text(value, 80).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  return raw || fallback;
}

function validLink(value: string, allowRelative = false) {
  if (allowRelative && value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function stringList(value: unknown, maxItems: number, maxLength: number) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim().slice(0, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

function normalizeProject(value: unknown, index: number): PortfolioProject | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  const title = text(source.title, 90);
  const category = text(source.category, 90);
  const description = text(source.description, 900);
  const href = text(source.href, 500);
  const iconCandidate = text(source.icon, 30);
  const icon: ProjectIconKey = iconKeys.has(iconCandidate) ? (iconCandidate as ProjectIconKey) : "code";

  if (!title || !category || !description || !validLink(href)) return null;

  return {
    id: safeId(source.id, `project-${index + 1}`),
    title,
    category,
    description,
    href,
    chips: stringList(source.chips, 8, 45),
    stack: stringList(source.stack, 18, 55),
    icon,
  };
}

export function normalizePortfolioContent(value: unknown): PortfolioContent {
  if (!value || typeof value !== "object") throw new Error("Invalid content payload");
  const source = value as Record<string, unknown>;
  const cvUrl = text(source.cvUrl, 500);
  if (!validLink(cvUrl, true)) throw new Error("CV link must be an http(s) URL or a /public path");

  if (!Array.isArray(source.projects)) throw new Error("Projects must be an array");
  const projects = source.projects
    .slice(0, 30)
    .map((project, index) => normalizeProject(project, index))
    .filter((project): project is PortfolioProject => Boolean(project));

  if (projects.length !== source.projects.slice(0, 30).length) {
    throw new Error("One or more projects are incomplete or contain an invalid repository URL");
  }

  const uniqueIds = new Set<string>();
  for (const project of projects) {
    let candidate = project.id;
    let suffix = 2;
    while (uniqueIds.has(candidate)) candidate = `${project.id}-${suffix++}`;
    project.id = candidate;
    uniqueIds.add(candidate);
  }

  return { cvUrl, projects, updatedAt: new Date().toISOString() };
}

export async function getPortfolioContent() {
  try {
    const stored = await contentStore().get(CONTENT_KEY, { type: "json", consistency: "strong" });
    if (!stored || typeof stored !== "object") return DEFAULT_PORTFOLIO_CONTENT;
    return stored as PortfolioContent;
  } catch {
    return DEFAULT_PORTFOLIO_CONTENT;
  }
}

export async function savePortfolioContent(content: PortfolioContent) {
  await contentStore().setJSON(CONTENT_KEY, content);
}

import { getStore } from "@netlify/blobs";
import {
  CONTENT_ICON_KEYS,
  DEFAULT_PORTFOLIO_CONTENT,
  type CertificateItem,
  type ContentIconKey,
  type EducationItem,
  type ExperienceItem,
  type PortfolioContent,
  type PortfolioProject,
  type ServiceItem,
  type SkillGroup,
  type SocialLink,
  type TestimonialItem,
} from "../../lib/portfolio-content";

const STORE_NAME = "portfolio-content-v2";
const LEGACY_STORE_NAME = "portfolio-content-v1";
const CONTENT_KEY = "content.json";
const iconKeys = new Set<string>(CONTENT_ICON_KEYS);

function contentStore(name = STORE_NAME) {
  return getStore({ name, consistency: "strong" });
}

function text(value: unknown, max: number, fallback = "") {
  return typeof value === "string" ? value.trim().slice(0, max) : fallback;
}

function safeId(value: unknown, fallback: string) {
  const raw = text(value, 80).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  return raw || fallback;
}

function validLink(value: string, allowRelative = false) {
  if (!value) return false;
  if (allowRelative && value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function optionalLink(value: unknown, max = 800) {
  const link = text(value, max);
  return !link || validLink(link, true) ? link : "";
}

function requiredLink(value: unknown, fallback: string, allowRelative = true) {
  const link = text(value, 800);
  return validLink(link, allowRelative) ? link : fallback;
}

function stringList(value: unknown, maxItems: number, maxLength: number, fallback: string[] = []) {
  if (!Array.isArray(value)) return [...fallback];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim().slice(0, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}


function mediaUrls(value: unknown, legacyValue: unknown, fallbackLegacy = "", maxItems = 10) {
  const list = stringList(value, maxItems, 800).map((url) => optionalLink(url)).filter(Boolean);
  if (list.length) return list;
  const legacy = optionalLink(legacyValue) || fallbackLegacy;
  return legacy ? [legacy] : [];
}

function icon(value: unknown, fallback: ContentIconKey = "code") {
  const candidate = text(value, 30);
  return iconKeys.has(candidate) ? (candidate as ContentIconKey) : fallback;
}

function uniqueIds<T extends { id: string }>(items: T[]) {
  const used = new Set<string>();
  return items.map((item) => {
    let candidate = item.id;
    let suffix = 2;
    while (used.has(candidate)) candidate = `${item.id}-${suffix++}`;
    used.add(candidate);
    return { ...item, id: candidate };
  });
}

function section(value: unknown, fallback: { eyebrow: string; title: string; text: string }) {
  const source = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return {
    eyebrow: text(source.eyebrow, 80, fallback.eyebrow),
    title: text(source.title, 180, fallback.title),
    text: text(source.text, 700, fallback.text),
  };
}

function normalizeProject(value: unknown, index: number, fallback?: PortfolioProject): PortfolioProject | null {
  if (!value || typeof value !== "object") return fallback ?? null;
  const source = value as Record<string, unknown>;
  const title = text(source.title, 100, fallback?.title || "");
  const category = text(source.category, 100, fallback?.category || "");
  const description = text(source.description, 1200, fallback?.description || "");
  const href = requiredLink(source.href, fallback?.href || DEFAULT_PORTFOLIO_CONTENT.identity.githubUrl, true);
  if (!title || !category || !description) return null;
  return {
    id: safeId(source.id, fallback?.id || `project-${index + 1}`),
    title,
    category,
    description,
    href,
    liveDemoUrl: optionalLink(source.liveDemoUrl) || fallback?.liveDemoUrl || "",
    status: text(source.status, 50, fallback?.status || ""),
    chips: stringList(source.chips, 10, 55, fallback?.chips),
    stack: stringList(source.stack, 24, 65, fallback?.stack),
    icon: icon(source.icon, fallback?.icon || "code"),
    imageUrl: optionalLink(source.imageUrl) || fallback?.imageUrl || "",
    imageUrls: mediaUrls(source.imageUrls, source.imageUrl, fallback?.imageUrl || "", 12),
    videoUrl: optionalLink(source.videoUrl) || fallback?.videoUrl || "",
    caseStudy: {
      problem: text((source.caseStudy as Record<string, unknown> | undefined)?.problem, 900, fallback?.caseStudy?.problem || ""),
      role: text((source.caseStudy as Record<string, unknown> | undefined)?.role, 500, fallback?.caseStudy?.role || ""),
      solution: text((source.caseStudy as Record<string, unknown> | undefined)?.solution, 1200, fallback?.caseStudy?.solution || ""),
      outcome: text((source.caseStudy as Record<string, unknown> | undefined)?.outcome, 900, fallback?.caseStudy?.outcome || ""),
    },
  };
}

function normalizeSkillGroup(value: unknown, index: number, fallback?: SkillGroup): SkillGroup | null {
  if (!value || typeof value !== "object") return fallback ?? null;
  const source = value as Record<string, unknown>;
  const title = text(source.title, 100, fallback?.title || "");
  if (!title) return null;
  return {
    id: safeId(source.id, fallback?.id || `skill-group-${index + 1}`),
    title,
    summary: text(source.summary, 600, fallback?.summary || ""),
    items: stringList(source.items, 30, 60, fallback?.items),
    icon: icon(source.icon, fallback?.icon || "code"),
  };
}

function normalizeService(value: unknown, index: number, fallback?: ServiceItem): ServiceItem | null {
  if (!value || typeof value !== "object") return fallback ?? null;
  const source = value as Record<string, unknown>;
  const title = text(source.title, 100, fallback?.title || "");
  if (!title) return null;
  return {
    id: safeId(source.id, fallback?.id || `service-${index + 1}`),
    title,
    text: text(source.text, 700, fallback?.text || ""),
    icon: icon(source.icon, fallback?.icon || "code"),
  };
}

function normalizeEducation(value: unknown, index: number, fallback?: EducationItem): EducationItem | null {
  if (!value || typeof value !== "object") return fallback ?? null;
  const source = value as Record<string, unknown>;
  const title = text(source.title, 140, fallback?.title || "");
  if (!title) return null;
  return {
    id: safeId(source.id, fallback?.id || `education-${index + 1}`),
    period: text(source.period ?? source.year, 100, fallback?.period || ""),
    title,
    place: text(source.place, 140, fallback?.place || ""),
    text: text(source.text, 800, fallback?.text || ""),
    icon: icon(source.icon, fallback?.icon || "graduation"),
  };
}

function normalizeCertificate(value: unknown, index: number): CertificateItem | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  const title = text(source.title, 160);
  if (!title) return null;
  return {
    id: safeId(source.id, `certificate-${index + 1}`),
    title,
    issuer: text(source.issuer, 130),
    date: text(source.date, 100),
    description: text(source.description, 900),
    credentialUrl: optionalLink(source.credentialUrl),
    imageUrl: optionalLink(source.imageUrl),
    imageUrls: mediaUrls(source.imageUrls, source.imageUrl, "", 10),
  };
}

function normalizeExperience(value: unknown, index: number): ExperienceItem | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  const role = text(source.role, 150);
  const company = text(source.company, 140);
  if (!role || !company) return null;
  return {
    id: safeId(source.id, `experience-${index + 1}`),
    role,
    company,
    period: text(source.period, 110),
    location: text(source.location, 130),
    description: text(source.description, 1000),
    highlights: stringList(source.highlights, 14, 140),
    imageUrl: optionalLink(source.imageUrl),
    imageUrls: mediaUrls(source.imageUrls, source.imageUrl, "", 10),
  };
}


function normalizeTestimonial(value: unknown, index: number): TestimonialItem | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  const name = text(source.name, 120);
  const quote = text(source.quote, 1400);
  if (!name || !quote) return null;
  return {
    id: safeId(source.id, `testimonial-${index + 1}`),
    name,
    role: text(source.role, 120),
    company: text(source.company, 140),
    quote,
    profileUrl: optionalLink(source.profileUrl),
  };
}

function normalizeSocial(value: unknown, index: number, fallback?: SocialLink): SocialLink | null {
  if (!value || typeof value !== "object") return fallback ?? null;
  const source = value as Record<string, unknown>;
  const label = text(source.label, 50, fallback?.label || "");
  const href = requiredLink(source.href, fallback?.href || DEFAULT_PORTFOLIO_CONTENT.identity.githubUrl, false);
  const iconValue = text(source.icon, 20, fallback?.icon || "link");
  const socialIcon: SocialLink["icon"] = ["github", "gitlab", "linkedin", "link"].includes(iconValue)
    ? iconValue as SocialLink["icon"]
    : "link";
  if (!label) return null;
  return { id: safeId(source.id, fallback?.id || `social-${index + 1}`), label, href, icon: socialIcon };
}



export function normalizePortfolioContent(value: unknown): PortfolioContent {
  const defaults = DEFAULT_PORTFOLIO_CONTENT;
  const source = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const identitySource = source.identity && typeof source.identity === "object" ? source.identity as Record<string, unknown> : {};
  const heroSource = source.hero && typeof source.hero === "object" ? source.hero as Record<string, unknown> : {};
  const aboutSource = source.about && typeof source.about === "object" ? source.about as Record<string, unknown> : {};
  const skillsSource = source.skills && typeof source.skills === "object" ? source.skills as Record<string, unknown> : {};
  const photoBreakSource = source.photoBreak && typeof source.photoBreak === "object" ? source.photoBreak as Record<string, unknown> : {};
  const contactSource = source.contact && typeof source.contact === "object" ? source.contact as Record<string, unknown> : {};

  // Old v1 blobs only had cvUrl + projects. This preserves those values and
  // fills all new editable sections from the current visual defaults.
  const projectsRaw = Array.isArray(source.projects) ? source.projects : defaults.projects;
  const projects = uniqueIds(projectsRaw.slice(0, 40).map((item, index) => normalizeProject(item, index, defaults.projects[index])).filter((item): item is PortfolioProject => Boolean(item)));

  const educationRaw = Array.isArray(source.education) ? source.education : defaults.education;
  const education = uniqueIds(educationRaw.slice(0, 20).map((item, index) => normalizeEducation(item, index, defaults.education[index])).filter((item): item is EducationItem => Boolean(item)));

  const groupsRaw = Array.isArray(skillsSource.groups) ? skillsSource.groups : defaults.skills.groups;
  const groups = uniqueIds(groupsRaw.slice(0, 20).map((item, index) => normalizeSkillGroup(item, index, defaults.skills.groups[index])).filter((item): item is SkillGroup => Boolean(item)));

  const servicesRaw = Array.isArray(skillsSource.services) ? skillsSource.services : defaults.skills.services;
  const services = uniqueIds(servicesRaw.slice(0, 20).map((item, index) => normalizeService(item, index, defaults.skills.services[index])).filter((item): item is ServiceItem => Boolean(item)));

  const socialRaw = Array.isArray(source.socialLinks) ? source.socialLinks : defaults.socialLinks;
  const socialLinks = uniqueIds(socialRaw.slice(0, 12).map((item, index) => normalizeSocial(item, index, defaults.socialLinks[index])).filter((item): item is SocialLink => Boolean(item)));

  const certRaw = Array.isArray(source.certificates) ? source.certificates : [];
  const certificates = uniqueIds(certRaw.slice(0, 30).map(normalizeCertificate).filter((item): item is CertificateItem => Boolean(item)));

  const expRaw = Array.isArray(source.experiences) ? source.experiences : [];
  const experiences = uniqueIds(expRaw.slice(0, 30).map(normalizeExperience).filter((item): item is ExperienceItem => Boolean(item)));

  const testimonialRaw = Array.isArray(source.testimonials) ? source.testimonials : [];
  const testimonials = uniqueIds(testimonialRaw.slice(0, 30).map(normalizeTestimonial).filter((item): item is TestimonialItem => Boolean(item)));

  return {
    cvUrl: requiredLink(source.cvUrl, defaults.cvUrl, true),
    identity: {
      name: text(identitySource.name, 100, defaults.identity.name),
      firstName: text(identitySource.firstName, 60, defaults.identity.firstName),
      lastName: text(identitySource.lastName, 60, defaults.identity.lastName),
      brandInitials: text(identitySource.brandInitials, 6, defaults.identity.brandInitials),
      location: text(identitySource.location, 120, defaults.identity.location),
      email: text(identitySource.email, 180, defaults.identity.email),
      phone: text(identitySource.phone, 60, defaults.identity.phone),
      whatsappNumber: text(identitySource.whatsappNumber, 30, defaults.identity.whatsappNumber).replace(/[^0-9]/g, "") || defaults.identity.whatsappNumber,
      whatsappMessage: text(identitySource.whatsappMessage, 500, defaults.identity.whatsappMessage),
      footerTagline: text(identitySource.footerTagline, 180, defaults.identity.footerTagline),
      githubUrl: requiredLink(identitySource.githubUrl, defaults.identity.githubUrl, false),
    },
    socialLinks,
    hero: {
      status: text(heroSource.status, 120, defaults.hero.status),
      kicker: text(heroSource.kicker, 80, defaults.hero.kicker),
      roles: stringList(heroSource.roles, 12, 90, defaults.hero.roles),
      text: text(heroSource.text, 800, defaults.hero.text),
      profileImageUrl: optionalLink(heroSource.profileImageUrl) || defaults.hero.profileImageUrl,
      profileImageUrls: mediaUrls(heroSource.profileImageUrls, heroSource.profileImageUrl, defaults.hero.profileImageUrl, 10),
      focusAreas: text(heroSource.focusAreas, 160, defaults.hero.focusAreas),
      coreStack: text(heroSource.coreStack, 160, defaults.hero.coreStack),
    },
    marquee: stringList(source.marquee, 30, 60, defaults.marquee),
    about: {
      heading: section(aboutSource.heading, defaults.about.heading),
      imageUrl: optionalLink(aboutSource.imageUrl) || defaults.about.imageUrl,
      imageUrls: mediaUrls(aboutSource.imageUrls, aboutSource.imageUrl, defaults.about.imageUrl, 10),
      paragraphs: stringList(aboutSource.paragraphs, 8, 1200, defaults.about.paragraphs),
      curiosityValue: text(aboutSource.curiosityValue, 20, defaults.about.curiosityValue),
      curiosityLabel: text(aboutSource.curiosityLabel, 100, defaults.about.curiosityLabel),
    },
    skills: {
      heading: section(skillsSource.heading, defaults.skills.heading),
      featured: stringList(skillsSource.featured, 30, 60, defaults.skills.featured),
      groups,
      services,
    },
    projectsHeading: section(source.projectsHeading, defaults.projectsHeading),
    projects,
    educationHeading: section(source.educationHeading, defaults.educationHeading),
    education,
    experienceHeading: section(source.experienceHeading, defaults.experienceHeading),
    experiences,
    certificatesHeading: section(source.certificatesHeading, defaults.certificatesHeading),
    certificates,
    testimonialsHeading: section(source.testimonialsHeading, defaults.testimonialsHeading),
    testimonials,
    photoBreak: {
      imageUrl: optionalLink(photoBreakSource.imageUrl) || defaults.photoBreak.imageUrl,
      imageUrls: mediaUrls(photoBreakSource.imageUrls, photoBreakSource.imageUrl, defaults.photoBreak.imageUrl, 10),
      eyebrow: text(photoBreakSource.eyebrow, 80, defaults.photoBreak.eyebrow),
      title: text(photoBreakSource.title, 240, defaults.photoBreak.title),
    },
    contact: {
      eyebrow: text(contactSource.eyebrow, 80, defaults.contact.eyebrow),
      title: text(contactSource.title, 140, defaults.contact.title),
      accent: text(contactSource.accent, 100, defaults.contact.accent),
      text: text(contactSource.text, 800, defaults.contact.text),
      imageUrl: optionalLink(contactSource.imageUrl) || defaults.contact.imageUrl,
      imageUrls: mediaUrls(contactSource.imageUrls, contactSource.imageUrl, defaults.contact.imageUrl, 10),
      whatsappButton: text(contactSource.whatsappButton, 80, defaults.contact.whatsappButton),
      emailButton: text(contactSource.emailButton, 80, defaults.contact.emailButton),
      phoneButton: text(contactSource.phoneButton, 80, defaults.contact.phoneButton),
    },
    updatedAt: text(source.updatedAt, 48) || undefined,
  };
}

export async function getPortfolioContent() {
  try {
    const stored = await contentStore().get(CONTENT_KEY, { type: "json", consistency: "strong" });
    if (stored && typeof stored === "object") return normalizePortfolioContent(stored);
  } catch {
    // Try the previous store so existing CV/project edits survive this upgrade.
  }

  try {
    const legacy = await contentStore(LEGACY_STORE_NAME).get(CONTENT_KEY, { type: "json", consistency: "strong" });
    if (legacy && typeof legacy === "object") return normalizePortfolioContent(legacy);
  } catch {
    // Use code defaults below.
  }

  return normalizePortfolioContent(DEFAULT_PORTFOLIO_CONTENT);
}

export async function savePortfolioContent(content: PortfolioContent) {
  await contentStore().setJSON(CONTENT_KEY, content);
}

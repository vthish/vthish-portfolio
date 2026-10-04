"use client";

import Image from "next/image";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
} from "motion/react";
import { FormEvent, ReactNode, useEffect, useRef, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import { DEFAULT_PORTFOLIO_CONTENT, itemNumber, projectNumber, type ContentIconKey, type PortfolioContent, type ProjectIconKey, type SocialLink } from "@/lib/portfolio-content";
import { resolveVideoSource } from "@/lib/video";
import { trackPortfolioEvent } from "@/lib/analytics-client";

type IconProps = { size?: number; className?: string };

const Icon = ({ children, size = 20, className = "" }: IconProps & { children?: ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    {children}
  </svg>
);

const Icons = {
  arrow: (p: IconProps) => (
    <Icon {...p}><path d="M7 17 17 7"/><path d="M7 7h10v10"/></Icon>
  ),
  github: (p: IconProps) => (
    <Icon {...p}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.2-.36 6.5-1.57 6.5-7A5.5 5.5 0 0 0 19 3.7 5.1 5.1 0 0 0 18.9.2S17.7-.2 15 1.7a13.4 13.4 0 0 0-7 0C5.3-.2 4.1.2 4.1.2A5.1 5.1 0 0 0 4 3.7a5.5 5.5 0 0 0-1.5 3.8c0 5.4 3.3 6.6 6.5 7A4.8 4.8 0 0 0 8 18v4"/><path d="M8 19c-3 .9-3-1.5-4-2"/></Icon>
  ),
  gitlab: (p: IconProps) => (
    <Icon {...p}><path d="M12 21 4.8 13.7l2.3-7.1h1.9L12 1l3 5.6h1.9l2.3 7.1Z"/><path d="M4.8 13.7 12 21l-4.3-7.3M19.2 13.7 12 21l4.3-7.3M7.7 13.7H16.3M7.1 6.6l.6 7.1M16.9 6.6l-.6 7.1"/></Icon>
  ),
  linkedin: (p: IconProps) => (
    <Icon {...p}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V9h4v2"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></Icon>
  ),
  x: (p: IconProps) => (
    <svg width={p.size || 20} height={p.size || 20} viewBox="0 0 24 24" aria-hidden="true" className={p.className || ""} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/>
    </svg>
  ),
  mail: (p: IconProps) => (
    <Icon {...p}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-10 6L2 7"/></Icon>
  ),
  pin: (p: IconProps) => (
    <Icon {...p}><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></Icon>
  ),
  message: (p: IconProps) => (
    <Icon {...p}><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/></Icon>
  ),
  download: (p: IconProps) => (
    <Icon {...p}><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></Icon>
  ),
  menu: (p: IconProps) => (
    <Icon {...p}><path d="M4 7h16M4 12h16M4 17h16"/></Icon>
  ),
  close: (p: IconProps) => (
    <Icon {...p}><path d="m6 6 12 12M18 6 6 18"/></Icon>
  ),
  bot: (p: IconProps) => (
    <Icon {...p}><rect x="3" y="7" width="18" height="13" rx="3"/><path d="M12 3v4M8 12h.01M16 12h.01M8 16h8"/></Icon>
  ),
  send: (p: IconProps) => (
    <Icon {...p}><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></Icon>
  ),
  code: (p: IconProps) => (
    <Icon {...p}><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></Icon>
  ),
  cloud: (p: IconProps) => (
    <Icon {...p}><path d="M17.5 19H9a7 7 0 1 1 6.7-9H17.5a4.5 4.5 0 1 1 0 9Z"/></Icon>
  ),
  database: (p: IconProps) => (
    <Icon {...p}><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></Icon>
  ),
  phone: (p: IconProps) => (
    <Icon {...p}><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 18h4"/></Icon>
  ),
  brain: (p: IconProps) => (
    <Icon {...p}><path d="M9.5 4A2.5 2.5 0 0 0 7 6.5V7a3 3 0 0 0-2 5.7V14a3 3 0 0 0 3 3h1.5M14.5 4A2.5 2.5 0 0 1 17 6.5V7a3 3 0 0 1 2 5.7V14a3 3 0 0 1-3 3h-1.5M12 3v18M8 10h4M12 14h4"/></Icon>
  ),
  sparkles: (p: IconProps) => (
    <Icon {...p}><path d="m12 3-1.2 3.2L8 7.4l2.8 1.2L12 12l1.2-3.4L16 7.4l-2.8-1.2Z"/><path d="m18 13-.8 2.2L15 16l2.2.8L18 19l.8-2.2L21 16l-2.2-.8Z"/><path d="m5 14-.6 1.5L3 16l1.4.5L5 18l.6-1.5L7 16l-1.4-.5Z"/></Icon>
  ),
  chevron: (p: IconProps) => (
    <Icon {...p}><path d="m6 9 6 6 6-6"/></Icon>
  ),
  previous: (p: IconProps) => (
    <Icon {...p}><path d="m15 18-6-6 6-6"/></Icon>
  ),
  next: (p: IconProps) => (
    <Icon {...p}><path d="m9 18 6-6-6-6"/></Icon>
  ),
  graduation: (p: IconProps) => (
    <Icon {...p}><path d="m2 10 10-5 10 5-10 5Z"/><path d="M6 12.5V17c2.8 2.5 9.2 2.5 12 0v-4.5"/><path d="M22 10v6"/></Icon>
  ),
  certificate: (p: IconProps) => (
    <Icon {...p}><circle cx="12" cy="8" r="5"/><path d="m9 12-2 9 5-3 5 3-2-9"/><path d="m10.5 8 1 1 2-2"/></Icon>
  ),
  layers: (p: IconProps) => (
    <Icon {...p}><path d="m12 2 9 5-9 5-9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></Icon>
  ),
  external: (p: IconProps) => (
    <Icon {...p}><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></Icon>
  ),
};

const contentIconMap: Record<ContentIconKey, ComponentType<IconProps>> = {
  database: Icons.database,
  phone: Icons.phone,
  sparkles: Icons.sparkles,
  brain: Icons.brain,
  cloud: Icons.cloud,
  layers: Icons.layers,
  code: Icons.code,
  graduation: Icons.graduation,
  certificate: Icons.certificate,
};

const projectIconMap: Record<ProjectIconKey, ComponentType<IconProps>> = contentIconMap;

const socialIconMap: Record<SocialLink["icon"], ComponentType<IconProps>> = {
  github: Icons.github,
  gitlab: Icons.gitlab,
  linkedin: Icons.linkedin,
  x: Icons.x,
  link: Icons.external,
};

function ManagedImage({ src, alt, className = "", eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  const managedClass = `managed-fill-image ${className}`.trim();
  if (/^https?:\/\//i.test(src)) {
    return <img src={src} alt={alt} className={managedClass} loading={eager ? "eager" : "lazy"} />;
  }
  return <Image src={src} alt={alt} fill priority={eager} unoptimized={src.startsWith("/.netlify/functions/")} className={managedClass} sizes="(max-width: 900px) 100vw, 50vw" />;
}

function galleryImages(values?: string[], legacy?: string) {
  const list = (values || []).filter(Boolean);
  if (list.length) return list;
  return legacy ? [legacy] : [];
}

function RotatingImage({ images, alt, className = "", eager = false, interval = 6200 }: { images: string[]; alt: string; className?: string; eager?: boolean; interval?: number }) {
  const clean = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const move = (direction: -1 | 1) => {
    if (clean.length <= 1) return;
    setActive((current) => (current + direction + clean.length) % clean.length);
  };

  const handleNav = (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>, direction: -1 | 1) => {
    event.preventDefault();
    event.stopPropagation();
    move(direction);
  };

  useEffect(() => {
    setActive(0);
  }, [clean.join("|")]);

  useEffect(() => {
    if (clean.length <= 1) return;
    const timer = window.setTimeout(() => setActive((current) => (current + 1) % clean.length), interval);
    return () => window.clearTimeout(timer);
  }, [clean.join("|"), active, interval]);

  if (!clean.length) return null;
  if (clean.length === 1) return <ManagedImage src={clean[0]} alt={alt} className={className} eager={eager}/>;
  const safeActive = Math.min(active, clean.length - 1);
  const src = clean[safeActive];

  return <div
    className="rotating-image-shell"
    onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }}
    onTouchEnd={(event) => {
      const startX = touchStartX.current;
      const endX = event.changedTouches[0]?.clientX;
      touchStartX.current = null;
      if (startX == null || endX == null) return;
      const delta = endX - startX;
      if (Math.abs(delta) < 42) return;
      event.preventDefault();
      event.stopPropagation();
      move(delta < 0 ? 1 : -1);
    }}
  >
    <AnimatePresence mode="sync" initial={false}>
      <motion.div className="rotating-image-slide" key={`${src}-${safeActive}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.65, ease: [0.22,1,0.36,1] }}>
        <ManagedImage src={src} alt={`${alt} ${safeActive + 1}`} className={className} eager={eager && safeActive === 0}/>
      </motion.div>
    </AnimatePresence>
    <div className="media-gallery-nav media-gallery-nav-generic" aria-label={`${alt} gallery navigation`}>
      <div role="button" tabIndex={0} className="media-nav-btn media-nav-prev" aria-label="Previous image" onClick={(event) => handleNav(event, -1)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") handleNav(event, -1); }}><Icons.previous size={16}/></div>
      <div role="button" tabIndex={0} className="media-nav-btn media-nav-next" aria-label="Next image" onClick={(event) => handleNav(event, 1)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") handleNav(event, 1); }}><Icons.next size={16}/></div>
    </div>
    <div className="media-gallery-dots" aria-hidden="true">{clean.map((_, index) => <i key={index} className={index === safeActive ? "active" : ""}/>)}</div>
  </div>;
}

function ProjectVideoPlayer({ open, videoUrl, title, onClose }: { open: boolean; videoUrl?: string; title: string; onClose: () => void }) {
  const source = resolveVideoSource(videoUrl, "player");

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined" || !source) return null;

  return createPortal(
    <motion.div
      className="project-player-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} video player`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
    >
      <motion.div
        className="project-player-modal"
        initial={{ opacity: 0, y: 22, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.99 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="project-player-head">
          <div>
            <span>PROJECT DEMO</span>
            <strong>{title}</strong>
          </div>
          <button type="button" onClick={onClose} aria-label="Close video player"><Icons.close size={18}/></button>
        </div>
        <div className="project-player-stage">
          {source.kind === "direct" ? (
            <video className="project-player-video" src={source.src} autoPlay controls playsInline preload="metadata" />
          ) : source.kind === "embed" ? (
            <iframe className="project-player-embed" src={source.src} title={`${title} ${source.provider} player`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
          ) : (
            <div className="project-player-external">
              <Icons.external size={34}/>
              <strong>This provider opens in its own player.</strong>
              <span>{source.provider}</span>
              <a href={source.src} target="_blank" rel="noreferrer">Open video <Icons.external size={15}/></a>
            </div>
          )}
        </div>
        <div className="project-player-foot"><span>{source.provider}</span><span>Press Esc to close</span></div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

function ProjectMediaShowcase({ images, videoUrl, title, number }: { images: string[]; videoUrl?: string; title: string; number: string }) {
  const [active, setActive] = useState(0);
  const [playerOpen, setPlayerOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const video = resolveVideoSource(videoUrl);
  const imageItems = images.filter(Boolean).slice(0, 12).map((src) => ({ type: "image" as const, src }));
  const media = [
    ...(video ? [{ type: "video" as const, source: video }] : []),
    ...imageItems,
  ].slice(0, 13);
  const mediaKey = media.map((item) => item.type === "video" ? `video:${item.source.src}` : `image:${item.src}`).join("|");

  useEffect(() => {
    setActive(0);
  }, [mediaKey]);

  useEffect(() => {
    if (media.length <= 1) return;
    const current = media[Math.min(active, media.length - 1)];

    // Never auto-skip a video. It remains active until the visitor chooses
    // Next/Skip or swipes manually. Once on screenshots, only screenshots
    // auto-rotate; automatic rotation never jumps back to the video.
    if (current?.type === "video") return;
    if (imageItems.length <= 1) return;

    const firstImageIndex = video ? 1 : 0;
    const lastImageIndex = firstImageIndex + imageItems.length - 1;
    const timer = window.setTimeout(() => {
      setActive((currentIndex) => {
        if (currentIndex < firstImageIndex || currentIndex >= lastImageIndex) return firstImageIndex;
        return currentIndex + 1;
      });
    }, 5600);
    return () => window.clearTimeout(timer);
  }, [mediaKey, active]);

  if (!media.length) return null;
  const safeActive = Math.min(active, media.length - 1);
  const current = media[safeActive];
  const videoLabel = current.type === "video" ? current.source.provider.toUpperCase() : "PROJECT PREVIEW";
  const canSkipVideo = Boolean(video && imageItems.length && current.type === "video");

  const move = (direction: -1 | 1) => {
    if (media.length <= 1) return;
    setActive((currentIndex) => (currentIndex + direction + media.length) % media.length);
  };

  const handleNav = (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>, direction: -1 | 1) => {
    event.preventDefault();
    event.stopPropagation();
    move(direction);
  };

  const skipVideo = (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!canSkipVideo) return;
    setActive(1);
  };

  return <div
    className="project-media-shell"
    onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }}
    onTouchEnd={(event) => {
      const startX = touchStartX.current;
      const endX = event.changedTouches[0]?.clientX;
      touchStartX.current = null;
      if (startX == null || endX == null) return;
      const delta = endX - startX;
      if (Math.abs(delta) < 42) return;
      event.preventDefault();
      event.stopPropagation();
      move(delta < 0 ? 1 : -1);
    }}
  >
    <AnimatePresence mode="sync" initial={false}>
      <motion.div key={current.type === "video" ? `video:${current.source.src}` : `image:${current.src}`} className="project-gallery-frame" initial={{ opacity: 0.18, scale: 1.018 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.55, ease: [0.22,1,0.36,1] }}>
        {current.type === "image" ? <ManagedImage src={current.src} alt={`${title} screenshot ${safeActive + 1}`} className="project-screenshot"/> : current.source.kind === "direct" ? <video className="project-demo-video" src={current.source.src} poster={imageItems[0]?.src || undefined} autoPlay muted loop playsInline preload="auto" aria-label={`${title} demo video`} /> : current.source.kind === "embed" ? <iframe className="project-demo-embed" src={current.source.src} title={`${title} ${current.source.provider} demo`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen loading="eager"/> : <div className="project-external-video"><Icons.external size={28}/><strong>Watch project demo</strong><span>{current.source.provider}</span></div>}
        {current.type === "video" ? <button type="button" className="project-video-click-layer" aria-label={`Open ${title} video player`} onClick={(event) => { event.preventDefault(); event.stopPropagation(); setPlayerOpen(true); }} /> : null}
      </motion.div>
    </AnimatePresence>
    <div className="project-screenshot-overlay"/>
    <div className="project-visual-top project-visual-top-image"><span>PROJECT {number}</span><span><i /> {videoLabel}</span></div>
    {current.type === "video" ? <button type="button" className="project-video-open" aria-label="Open video player" title="Open video player" onClick={(event) => { event.preventDefault(); event.stopPropagation(); setPlayerOpen(true); }}><Icons.external size={14}/></button> : null}
    {canSkipVideo ? <div className="project-video-skip" role="button" tabIndex={0} onClick={skipVideo} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") skipVideo(event); }} aria-label="Skip project video and show screenshots"><span>Skip video</span><Icons.next size={14}/></div> : null}
    {media.length > 1 ? <>
      <div className="media-gallery-nav project-gallery-nav" aria-label={`${title} media navigation`}>
        <div role="button" tabIndex={0} className="media-nav-btn media-nav-prev" aria-label="Previous media" onClick={(event) => handleNav(event, -1)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") handleNav(event, -1); }}><Icons.previous size={17}/></div>
        <div role="button" tabIndex={0} className="media-nav-btn media-nav-next" aria-label="Next media" onClick={(event) => handleNav(event, 1)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") handleNav(event, 1); }}><Icons.next size={17}/></div>
      </div>
      <div className="project-gallery-status"><span>{String(safeActive + 1).padStart(2, "0")} / {String(media.length).padStart(2, "0")}</span><div>{media.map((item, i) => <i key={`${item.type}-${i}`} className={i === safeActive ? "active" : ""}/>)}</div></div>
    </> : null}
    <AnimatePresence>{playerOpen ? <ProjectVideoPlayer open={playerOpen} videoUrl={videoUrl} title={title} onClose={() => setPlayerOpen(false)} /> : null}</AnimatePresence>
  </div>;
}


const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <motion.div
      className="section-heading"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeUp}
      transition={{ duration: 0.65 }}
    >
      <span className="eyebrow"><span />{eyebrow}</span>
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </motion.div>
  );
}

function MagneticLink({ href, children, className = "", external = false, onClick }: { href: string; children?: ReactNode; className?: string; external?: boolean; onClick?: () => void }) {
  return (
    <motion.a
      href={href}
      className={className}
      whileHover={{ y: -3, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      onClick={onClick}
    >
      {children}
    </motion.a>
  );
}

function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: -1000, y: -1000 };
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    type Particle = { x: number; y: number; vx: number; vy: number; radius: number; phase: number };
    let particles: Particle[] = [];

    const makeParticles = () => {
      const count = Math.max(28, Math.min(72, Math.floor(width / 22)));
      particles = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (index % 4 === 0 ? 0.22 : 0.12),
        vy: (Math.random() - 0.5) * (index % 5 === 0 ? 0.18 : 0.1),
        radius: 0.8 + Math.random() * 1.45,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeParticles();
    };

    const pointerMove = (event: PointerEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const pointerLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);

      const maxDistance = width < 700 ? 122 : 158;
      for (let i = 0; i < particles.length; i += 1) {
        const a = particles[i];

        if (!reduceMotion) {
          a.x += a.vx;
          a.y += a.vy;
          if (a.x < -30) a.x = width + 30;
          if (a.x > width + 30) a.x = -30;
          if (a.y < -30) a.y = height + 30;
          if (a.y > height + 30) a.y = -30;
        }

        for (let j = i + 1; j < particles.length; j += 1) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.hypot(dx, dy);
          if (distance > maxDistance) continue;

          const opacity = (1 - distance / maxDistance) * 0.28;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.strokeStyle = `rgba(90, 139, 255, ${opacity})`;
          context.lineWidth = 0.7;
          context.stroke();
        }

        const mouseDistance = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (mouseDistance < 180) {
          const glow = (1 - mouseDistance / 180) * 0.28;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(mouse.x, mouse.y);
          context.strokeStyle = `rgba(125, 171, 255, ${glow})`;
          context.lineWidth = 0.75;
          context.stroke();
        }

        const pulse = reduceMotion ? 1 : 0.78 + Math.sin(time * 0.0015 + a.phase) * 0.2;
        context.beginPath();
        context.arc(a.x, a.y, a.radius * 3.8, 0, Math.PI * 2);
        context.fillStyle = `rgba(74, 111, 255, ${0.045 * pulse})`;
        context.fill();

        context.beginPath();
        context.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(155, 189, 255, ${0.42 + 0.32 * pulse})`;
        context.fill();
      }

      if (!reduceMotion) animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", pointerMove, { passive: true });
    window.addEventListener("pointerleave", pointerLeave);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", pointerMove);
      window.removeEventListener("pointerleave", pointerLeave);
    };
  }, []);

  return (
    <div className="network-bg" aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="network-vignette" />
    </div>
  );
}

function InitialLoader() {
  const bootSteps = ["core", "interface", "experience"];

  return (
    <motion.div
      className="initial-loader"
      initial={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      role="status"
      aria-live="polite"
      aria-label="Loading Venusha Thishan portfolio"
    >
      <div className="loader-vignette" aria-hidden="true" />
      <div className="loader-grid" aria-hidden="true" />
      <div className="loader-glow loader-glow-a" aria-hidden="true" />
      <div className="loader-glow loader-glow-b" aria-hidden="true" />

      <motion.div
        className="loader-stage"
        initial={{ opacity: 0, y: 16, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="loader-topline" aria-hidden="true">
          <span><i /> SYSTEM ONLINE</span>
          <span>VTHISH.DEV / BOOT</span>
        </div>

        <div className="loader-symbol" aria-hidden="true">
          <span className="loader-arc arc-one" />
          <span className="loader-arc arc-two" />
          <span className="loader-scan" />
          <motion.div
            className="loader-vt"
            initial={{ opacity: 0, scale: 0.72, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.16, duration: 0.62, type: "spring", stiffness: 170, damping: 18 }}
          >
            <span>&lt;</span><strong>VT</strong><span>/&gt;</span>
          </motion.div>
        </div>

        <motion.div
          className="loader-copy"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.38 }}
        >
          <span>VENUSHA THISHAN · SOFTWARE ENGINEER</span>
          <strong>Crafting the experience.</strong>
        </motion.div>

        <motion.div
          className="loader-terminal"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.6 }}
          aria-hidden="true"
        >
          <div className="loader-terminal-head">
            <span className="terminal-dots"><i /><i /><i /></span>
            <span>portfolio.init</span>
            <span>01</span>
          </div>
          <div className="loader-command"><b>›</b><code> initialize --portfolio</code><i className="loader-caret" /></div>
          <div className="loader-steps">
            {bootSteps.map((step, index) => (
              <motion.span
                key={step}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.24, delay: 0.92 + index * 0.28 }}
              >
                <i>✓</i>{step}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="loader-progress-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.72 }}
          aria-hidden="true"
        >
          <div className="loader-progress-copy"><span>LOADING EXPERIENCE</span><span>READY</span></div>
          <div className="loader-progress-line">
            <motion.i
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.62, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function Chatbot({ content }: { content: PortfolioContent }) {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const chatBodyRef = useRef<HTMLDivElement | null>(null);
  const name = content.identity.firstName || content.identity.name;
  const whatsappHref = `https://wa.me/${content.identity.whatsappNumber}?text=${encodeURIComponent(content.identity.whatsappMessage)}`;
  const phoneHref = `tel:${content.identity.phone.replace(/[^+\d]/g, "")}`;
  const [messages, setMessages] = useState([
    { from: "bot", text: `Hi! I’m VT Assistant. Ask me about ${name}’s services, tech stack, projects, education, experience, certificates or contact details.` },
  ]);

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => {
      const body = chatBodyRef.current;
      if (body) body.scrollTo({ top: body.scrollHeight, behavior: "smooth" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [messages, typing, open]);

  const fallbackReply = (text: string) => {
    const q = text.toLowerCase();
    const allSkills = content.skills.groups.flatMap((group) => group.items).slice(0, 18).join(", ");
    const services = content.skills.services.map((service) => service.title).join(", ");
    const projectNames = content.projects.map((project) => project.title).join(", ");
    const education = content.education.map((item) => `${item.title}${item.place ? ` — ${item.place}` : ""}`).join("; ");

    if (q.includes("phone") || q.includes("number") || q.includes("call") || q.includes("mobile") || q.includes("telephone") || q.includes("contact no") || q.includes("phone no")) return `${name}’s phone number is ${content.identity.phone}. Tap Call me to open your phone app, or use WhatsApp if you prefer messaging.`;
    if (q.includes("email") || q.includes("mail")) return `You can email ${name} at ${content.identity.email}.`;
    if (q.includes("service") || q.includes("offer") || q.includes("what do you do")) return services ? `${name} currently highlights these services: ${services}.` : "Open the Skills section to see current capabilities.";
    if (q.includes("skill") || q.includes("stack") || q.includes("language") || q.includes("framework")) return allSkills ? `Current portfolio skills include ${allSkills}.` : "Open the Skills section to see the current stack.";
    if (q.includes("project") || q.includes("github") || q.includes("repository") || q.includes("repo")) return content.projects.length ? `This portfolio currently highlights ${content.projects.length} project${content.projects.length === 1 ? "" : "s"}: ${projectNames}. Open Projects to see screenshots, stacks and links.` : "There are no public projects listed right now.";
    if (q.includes("education") || q.includes("study")) return education ? `Education currently listed: ${education}.` : "There are no education entries listed right now.";
    if (q.includes("experience") || q.includes("work history") || q.includes("intern")) return content.experiences.length ? `Current experience includes ${content.experiences.map((item) => `${item.role} at ${item.company}`).join("; ")}.` : "No professional experience entries are published on the portfolio yet.";
    if (q.includes("certificate") || q.includes("certification") || q.includes("credential")) return content.certificates.length ? `Certificates currently published: ${content.certificates.map((item) => `${item.title}${item.issuer ? ` — ${item.issuer}` : ""}`).join("; ")}.` : "No certificates are published on the portfolio yet.";
    if (q.includes("testimonial") || q.includes("recommendation") || q.includes("review")) return content.testimonials.length ? `Recommendations currently published: ${content.testimonials.map((item) => `${item.name}${item.company ? ` — ${item.company}` : ""}`).join("; ")}.` : "No testimonials or recommendations are published on the portfolio yet.";
    if (q.includes("hire") || q.includes("contact") || q.includes("whatsapp") || q.includes("available")) return `For work opportunities, use WhatsApp, tap Call me to call ${content.identity.phone}, or email ${content.identity.email}.`;
    if (q.includes("cv") || q.includes("resume")) return `Use the View CV button near the top of the portfolio to open ${name}’s current CV.`;
    if (q.includes("location") || q.includes("where")) return `${name} is based in ${content.identity.location}.`;
    return `I can help with ${name}’s services, skills, projects, education, experience, certificates, recommendations, CV or contact details.`;
  };

  const send = async (text: string) => {
    const clean = text.trim();
    if (!clean || typing) return;

    const history = messages.slice(1).slice(-8).map((message) => ({
      role: message.from === "user" ? "user" : "model",
      text: message.text,
    }));

    setMessages((m) => [...m, { from: "user", text: clean }]);
    setInput("");
    setTyping(true);

    try {
      const response = await fetch("/.netlify/functions/chatbot-gemini", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: clean, history }),
      });
      const data = await response.json().catch(() => ({})) as { reply?: string; error?: string };
      const answer = response.ok && typeof data.reply === "string" && data.reply.trim()
        ? data.reply.trim()
        : fallbackReply(clean);
      setMessages((m) => [...m, { from: "bot", text: answer }]);
    } catch {
      setMessages((m) => [...m, { from: "bot", text: fallbackReply(clean) }]);
    } finally {
      setTyping(false);
    }
  };

  const submit = (e: FormEvent) => { e.preventDefault(); void send(input); };
  const quickQuestions = [
    { label: "Services", prompt: "What services do you offer?", Icon: Icons.layers },
    { label: "Projects", prompt: "Show projects", Icon: Icons.code },
    { label: "Skills", prompt: "Show skills", Icon: Icons.sparkles },
    { label: "Contact", prompt: `How can I contact ${name}?`, Icon: Icons.message },
  ];

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.aside className="chat-panel" initial={{ opacity: 0, y: 28, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.96 }} transition={{ type: "spring", stiffness: 350, damping: 28 }} aria-label="VT portfolio assistant">
            <div className="chat-head">
              <div className="chat-avatar"><Icons.bot size={19}/><span className="chat-avatar-orbit" /></div>
              <div className="chat-head-copy"><strong>VT Assistant</strong><span><i /> Online · Portfolio guide</span></div>
              <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close chatbot"><Icons.close size={18}/></button>
            </div>
            <div className="chat-intro"><div className="chat-intro-icon"><Icons.sparkles size={16}/></div><div><strong>Ask anything about {name}</strong><span>Ask in English, Sinhala, Singlish or your preferred language.</span></div></div>
            <div className="chat-body" ref={chatBodyRef}>
              {messages.map((message, index) => (
                <motion.div key={`${message.from}-${index}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`chat-message ${message.from}`}>
                  {message.from === "bot" && <span className="message-avatar"><Icons.bot size={13}/></span>}
                  <span>{message.text}</span>
                </motion.div>
              ))}
              {typing && <div className="typing"><span/><span/><span/></div>}
            </div>
            <div className="quick-actions">{quickQuestions.map(({ label, prompt, Icon: QuickIcon }) => <button key={label} onClick={() => void send(prompt)}><QuickIcon size={14}/><span>{label}</span></button>)}</div>
            <div className="chat-contact-row"><a href={whatsappHref} target="_blank" rel="noreferrer" onClick={() => trackPortfolioEvent("whatsapp_click", "Chatbot")}><Icons.message size={14}/> WhatsApp</a><a href={`mailto:${content.identity.email}`} onClick={() => trackPortfolioEvent("email_open", "Chatbot mailto")}><Icons.mail size={14}/> Email</a><a href={phoneHref} onClick={() => trackPortfolioEvent("call_click", "Chatbot")}><Icons.phone size={14}/> Call me</a></div>
            <form className="chat-input" onSubmit={submit}><div className="chat-input-shell"><Icons.message size={15}/><input value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Ask about ${name}...`} aria-label="Chat message" /></div><button type="submit" aria-label="Send message"><Icons.send size={17}/></button></form>
          </motion.aside>
        )}
      </AnimatePresence>
      <motion.button className="chat-launcher" onClick={() => setOpen((v) => !v)} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} aria-label={open ? "Close chatbot" : "Open chatbot"}>
        <span className="chat-ping" />{open ? <Icons.close size={21}/> : <Icons.bot size={22}/>}
      </motion.button>
    </>
  );
}

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return <>{parts.map((part, index) => part.startsWith("**") && part.endsWith("**") ? <strong key={index}>{part.slice(2, -2)}</strong> : <span key={index}>{part}</span>)}</>;
}

function ContactEmailModal({ open, onClose, ownerName }: { open: boolean; onClose: () => void; ownerName: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [successCanClose, setSuccessCanClose] = useState(true);
  const statusRef = useRef(status);
  const successCanCloseRef = useRef(successCanClose);

  useEffect(() => { statusRef.current = status; }, [status]);
  useEffect(() => { successCanCloseRef.current = successCanClose; }, [successCanClose]);

  function requestClose() {
    if (statusRef.current === "sent" && !successCanCloseRef.current) return;
    onClose();
  }

  useEffect(() => {
    if (!open) return;
    setStatus("idle");
    setError("");
    setSuccessCanClose(true);
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") requestClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (status !== "sent") return;
    setSuccessCanClose(false);
    const timer = window.setTimeout(() => setSuccessCanClose(true), 3000);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending"); setError("");
    try {
      const response = await fetch("/.netlify/functions/contact-email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, website }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Could not send your message.");
      setStatus("sent");
      trackPortfolioEvent("email_sent", subject || "Portfolio contact form");
      setName(""); setEmail(""); setSubject(""); setMessage(""); setWebsite("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not send your message.");
    }
  }

  const modalEase = [0.22, 1, 0.36, 1] as const;

  return <AnimatePresence>
    {open ? <motion.div className="email-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.24, ease: "easeOut" }} onMouseDown={(event) => { if (event.target === event.currentTarget) requestClose(); }}>
      <motion.div className="email-modal" initial={{ opacity: 0, y: 14, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.99 }} transition={{ duration: 0.34, ease: modalEase }} role="dialog" aria-modal="true" aria-label={`Send ${ownerName} an email`}>
        <div className="email-modal-head"><div><span>SEND A MESSAGE</span><h3>Email {ownerName}</h3><p>Write your own subject and message. Your email address is used as the reply-to address.</p></div><button type="button" onClick={requestClose} aria-label="Close email form" disabled={status === "sent" && !successCanClose}><Icons.close size={19}/></button></div>
        <AnimatePresence mode="wait" initial={false}>
          {status === "sent" ? <motion.div key="success" className="email-success" initial={{ opacity: 0, y: 12, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.32, ease: modalEase }}><motion.div className="email-success-icon" initial={{ scale: 0.82, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.06, duration: 0.28, ease: modalEase }}><Icons.mail size={28}/></motion.div><strong>Message sent.</strong><span>Thanks — your email was delivered successfully.</span><button type="button" onClick={requestClose} disabled={!successCanClose}>{successCanClose ? "Close" : "Sent successfully"}</button></motion.div> : <motion.form key="form" className="email-form" onSubmit={submit} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22, ease: "easeOut" }}>
            <div className="email-form-grid"><label><span>Your name</span><input required maxLength={100} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"/></label><label><span>Your email</span><input required type="email" maxLength={180} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"/></label></div>
            <label><span>Subject</span><input required maxLength={180} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="What would you like to discuss?"/></label>
            <label><span>Message</span><textarea required minLength={5} maxLength={5000} rows={7} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message here…"/></label>
            <label className="email-honeypot" aria-hidden="true"><span>Website</span><input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)}/></label>
            {error ? <motion.div className="email-form-error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>{error}</motion.div> : null}
            <div className="email-form-actions"><button type="button" onClick={requestClose}>Cancel</button><button className="email-send-btn" type="submit" disabled={status === "sending"}><Icons.send size={16}/>{status === "sending" ? "Sending…" : "Send email"}</button></div>
          </motion.form>}
        </AnimatePresence>
      </motion.div>
    </motion.div> : null}
  </AnimatePresence>;
}

export default function Portfolio({ focusProjectId }: { focusProjectId?: string } = {}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [portfolioContent, setPortfolioContent] = useState<PortfolioContent>(DEFAULT_PORTFOLIO_CONTENT);
  const [showLoader, setShowLoader] = useState(true);
  const [pageVisible, setPageVisible] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const projectFocusDone = useRef(false);
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const smoothX = useSpring(mouseX, { stiffness: 180, damping: 28, mass: 0.25 });
  const smoothY = useSpring(mouseY, { stiffness: 180, damping: 28, mass: 0.25 });
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  useEffect(() => {
    setMounted(true);
    const roleTimer = window.setInterval(() => {
      setRoleIndex((i) => {
        const roleCount = Math.max(1, portfolioContent.hero.roles.length);
        return (i + 1) % roleCount;
      });
    }, 2600);
    const move = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener("mousemove", move, { passive: true });
    return () => { window.clearInterval(roleTimer); window.removeEventListener("mousemove", move); };
  }, [mouseX, mouseY, portfolioContent.hero.roles.length]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) { setPageVisible(true); setShowLoader(false); return; }
    document.documentElement.classList.add("portfolio-loading");
    const revealTimer = window.setTimeout(() => setPageVisible(true), 2180);
    const exitTimer = window.setTimeout(() => setShowLoader(false), 2580);
    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(exitTimer);
      document.documentElement.classList.remove("portfolio-loading");
    };
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/.netlify/functions/portfolio-content", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("content unavailable")))
      .then((content: PortfolioContent) => { if (active && content?.cvUrl && Array.isArray(content.projects)) setPortfolioContent(content); })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (roleIndex >= portfolioContent.hero.roles.length) setRoleIndex(0);
  }, [portfolioContent.hero.roles.length, roleIndex]);

  useEffect(() => {
    if (!focusProjectId || projectFocusDone.current || !pageVisible || showLoader) return;
    if (!portfolioContent.projects.some((project) => project.id === focusProjectId)) return;
    const timer = window.setTimeout(() => {
      const target = document.getElementById(`project-${focusProjectId}`);
      if (target) {
        projectFocusDone.current = true;
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 220);
    return () => window.clearTimeout(timer);
  }, [focusProjectId, pageVisible, showLoader, portfolioContent.projects]);

  const content = portfolioContent;
  const projects = content.projects;
  const roles = content.hero.roles.length ? content.hero.roles : ["Software Engineer"];
  const cvUrl = content.cvUrl;
  const whatsappHref = `https://wa.me/${content.identity.whatsappNumber}?text=${encodeURIComponent(content.identity.whatsappMessage)}`;
  const phoneHref = `tel:${content.identity.phone.replace(/[^+\d]/g, "")}`;
  const socialLinks = content.socialLinks;
  const navItems = [
    ["About", "#about"],
    ["Skills", "#skills"],
    ["Projects", "#projects"],
    ["Education", "#education"],
    ...(content.experiences.length ? [["Experience", "#experience"]] : []),
    ...(content.certificates.length ? [["Certificates", "#certificates"]] : []),
    ...(content.testimonials.length ? [["Recommendations", "#testimonials"]] : []),
  ];
  const mobileNavItems = [...navItems, ["Contact", "#contact"]];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: content.identity.name,
    url: "https://vthish.dev",
    email: `mailto:${content.identity.email}`,
    telephone: content.identity.phone,
    address: { "@type": "PostalAddress", addressLocality: content.identity.location },
    jobTitle: content.hero.roles[0] || "Software Engineer",
    sameAs: content.socialLinks.map((item) => item.href),
    knowsAbout: [...content.skills.featured, ...content.skills.groups.flatMap((group) => group.items)].slice(0, 40),
    subjectOf: content.projects.map((project) => ({
      "@type": "SoftwareSourceCode",
      name: project.title,
      description: project.description,
      codeRepository: project.href,
      url: project.liveDemoUrl || project.href,
      programmingLanguage: project.stack.slice(0, 8),
    })),
    hasCredential: content.certificates.map((item) => ({
      "@type": "EducationalOccupationalCredential",
      name: item.title,
      recognizedBy: item.issuer ? { "@type": "Organization", name: item.issuer } : undefined,
      url: item.credentialUrl || undefined,
    })),
  };

  return (
    <MotionConfig reducedMotion="user">
      <main className="site-shell">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
        <AnimatePresence onExitComplete={() => document.documentElement.classList.remove("portfolio-loading")}>
          {showLoader ? <InitialLoader /> : null}
        </AnimatePresence>
        <motion.div className="scroll-progress" style={{ scaleX }} />
        {mounted && <motion.div className="cursor-glow" style={{ x: smoothX, y: smoothY }} aria-hidden="true" />}
        <div className="noise" aria-hidden="true" />
        <NetworkBackground />
        <div className="ambient ambient-one" aria-hidden="true" />
        <div className="ambient ambient-two" aria-hidden="true" />

        <motion.header className="nav-wrap" initial={false} animate={pageVisible ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}>
          <a className="brand" href="#top" aria-label={`${content.identity.name} home`}>
            <span className="brand-mark">{content.identity.brandInitials}</span>
            <span className="brand-copy">{content.identity.firstName.toUpperCase()}<br/><small>{content.identity.lastName.toUpperCase()}</small></span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navItems.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
          </nav>
          <div className="nav-actions">
            <MagneticLink className="nav-hire" href={whatsappHref} external onClick={() => trackPortfolioEvent("whatsapp_click", "Header hire me")}><Icons.message size={16}/> Hire me</MagneticLink>
            <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Icons.menu/></button>
          </div>
        </motion.header>

        <AnimatePresence>
          {menuOpen && (
            <motion.div className="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button className="mobile-menu-close" onClick={() => setMenuOpen(false)} aria-label="Close menu"><Icons.close size={26}/></button>
              <div className="mobile-menu-links">
                {mobileNavItems.map(([label, href], i) => (
                  <motion.a key={href} href={href} onClick={() => setMenuOpen(false)} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                    <span>{itemNumber(i)}</span>{label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="hero" id="top">
          <div className="hero-grid" aria-hidden="true" />
          <motion.div className="hero-copy" initial={false} animate={pageVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <div className="status-pill"><span /> {content.hero.status}</div>
            <p className="hero-kicker">{content.hero.kicker}</p>
            <h1>{content.identity.firstName}<br/><span>{content.identity.lastName}.</span></h1>
            <div className="role-line">
              <span>I build as a</span>
              <div className="role-window">
                <AnimatePresence mode="wait">
                  <motion.strong key={roles[roleIndex] || roles[0]} initial={{ y: 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -22, opacity: 0 }} transition={{ duration: 0.35 }}>
                    {roles[roleIndex] || roles[0]}
                  </motion.strong>
                </AnimatePresence>
              </div>
            </div>
            <p className="hero-text">{content.hero.text}</p>
            <div className="hero-actions">
              <MagneticLink href="#projects" className="primary-btn">Explore my work <Icons.arrow size={18}/></MagneticLink>
              <MagneticLink href={cvUrl} className="ghost-btn" external onClick={() => trackPortfolioEvent("cv_click", "Hero View CV")}><Icons.download size={18}/> View CV</MagneticLink>
            </div>
            <div className="hero-socials">
              {socialLinks.map((item) => {
                const SocialIcon = socialIconMap[item.icon] || Icons.external;
                return <a key={item.id} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label} onClick={() => trackPortfolioEvent("social_click", item.label)}><SocialIcon size={18}/><span>{item.label}</span></a>;
              })}
              <small>{content.identity.location}</small>
            </div>
          </motion.div>

          <motion.div className="hero-visual" initial={false} animate={pageVisible ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.975, x: 16 }} transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}>
            <div className="portrait-orbit orbit-one" /><div className="portrait-orbit orbit-two" />
            <motion.div className="portrait-card" whileHover={{ rotate: 0, y: -6 }} transition={{ type: "spring", stiffness: 180, damping: 18 }}>
              <div className="portrait-frame"><RotatingImage images={galleryImages(content.hero.profileImageUrls, content.hero.profileImageUrl)} alt={content.identity.name} eager /><div className="portrait-overlay" /></div>
              <div className="portrait-caption"><span>Based in</span><strong><Icons.pin size={14}/> {content.identity.location.replace(", ", " / ")}</strong></div>
            </motion.div>
            <motion.div className="floating-badge badge-one" animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
              <Icons.sparkles size={17}/><span><small>FOCUS AREAS</small>{content.hero.focusAreas}</span>
            </motion.div>
            <motion.div className="floating-badge badge-two" animate={{ y: [0, 9, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
              <span className="terminal-dot">&lt;/&gt;</span><span><small>CORE STACK</small>{content.hero.coreStack}</span>
            </motion.div>
          </motion.div>

          <a className="scroll-cue" href="#about"><span>SCROLL TO DISCOVER</span><Icons.chevron size={18}/></a>
        </section>

        <div className="marquee-wrap" aria-label="Technology stack">
          <motion.div className="marquee-track" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 26, repeat: Infinity, ease: "linear" }}>
            {[...content.marquee, ...content.marquee].map((item, i) => <span key={`${item}-${i}`}><i>✦</i>{item}</span>)}
          </motion.div>
        </div>

        <section className="section about-section" id="about">
          <SectionTitle {...content.about.heading} />
          <div className="about-grid">
            <motion.div className="about-photo" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <RotatingImage images={galleryImages(content.about.imageUrls, content.about.imageUrl)} alt={`Portrait of ${content.identity.name}`} />
              <div className="photo-index">/ {String(galleryImages(content.about.imageUrls, content.about.imageUrl).length).padStart(2, "0")}</div>
            </motion.div>
            <div className="about-copy">
              {content.about.paragraphs.map((paragraph, index) => (
                <motion.p key={`${paragraph.slice(0, 30)}-${index}`} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6, delay: index * 0.08 }}><RichText text={paragraph}/></motion.p>
              ))}
              <div className="metric-grid">
                <div><strong>{String(projects.length).padStart(2, "0")}</strong><span>GitHub projects<br/>featured</span></div>
                <div><strong>{String(content.education.length).padStart(2, "0")}</strong><span>Education<br/>milestones</span></div>
                <div><strong>{content.about.curiosityValue}</strong><span>{content.about.curiosityLabel}</span></div>
              </div>
              <div className="about-contact-strip">
                <a href={`mailto:${content.identity.email}`} onClick={() => trackPortfolioEvent("email_open", "About mailto")}><Icons.mail size={16}/> {content.identity.email}</a>
                <a href={whatsappHref} target="_blank" rel="noreferrer" onClick={() => trackPortfolioEvent("whatsapp_click", "About")}><Icons.message size={16}/> WhatsApp</a>
                <a href={phoneHref} onClick={() => trackPortfolioEvent("call_click", "About")}><Icons.phone size={16}/> Call me</a>
              </div>
            </div>
          </div>
        </section>

        <section className="section skills-section" id="skills">
          <SectionTitle {...content.skills.heading} />
          <div className="skills-spotlight">{content.skills.featured.map((item) => <span key={item}>{item}</span>)}</div>
          <div className="skill-grid">
            {content.skills.groups.map((group, i) => {
              const SkillIcon = contentIconMap[group.icon] || Icons.code;
              return (
                <motion.article className="skill-card" key={group.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5, delay: i * 0.06 }} whileHover={{ y: -6 }}>
                  <div className="skill-icon"><SkillIcon size={22}/></div><h3>{group.title}</h3><p className="skill-summary">{group.summary}</p><div className="skill-tags">{group.items.map((item) => <span key={item}>{item}</span>)}</div>
                </motion.article>
              );
            })}
          </div>
          <div className="service-grid">
            {content.skills.services.map((service, index) => {
              const ServiceIcon = contentIconMap[service.icon] || Icons.code;
              return <motion.article className="service-card" key={service.id} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5, delay: index * 0.07 }}><div className="service-icon"><ServiceIcon size={20} /></div><h3>{service.title}</h3><p>{service.text}</p></motion.article>;
            })}
          </div>
        </section>

        <section className="section projects-section" id="projects">
          <div className="projects-heading-row">
            <SectionTitle {...content.projectsHeading} />
            <a className="text-link" href={content.identity.githubUrl} target="_blank" rel="noreferrer" onClick={() => trackPortfolioEvent("social_click", "All GitHub projects")}>All GitHub projects <Icons.arrow size={16}/></a>
          </div>
          <div className="projects-list">
            {projects.map((project, index) => {
              const ProjectIcon = projectIconMap[project.icon] || Icons.code;
              const number = projectNumber(index);
              const projectImages = project.imageUrls?.length ? project.imageUrls : project.imageUrl ? [project.imageUrl] : [];
              const hasProjectMedia = Boolean(project.videoUrl || projectImages.length);
              return (
                <motion.article id={`project-${project.id}`} className={`project-card${hasProjectMedia ? " has-project-image" : ""}`} key={project.id} role="link" tabIndex={0} aria-label={`Open ${project.title} repository`} onClick={(event) => { if ((event.target as HTMLElement).closest("a,button,video,iframe,input")) return; trackPortfolioEvent("project_repository_click", project.title); window.open(project.href, "_blank", "noopener,noreferrer"); }} onKeyDown={(event) => { if (event.key !== "Enter" && event.key !== " ") return; if ((event.target as HTMLElement).closest("a,button,input")) return; event.preventDefault(); trackPortfolioEvent("project_repository_click", project.title); window.open(project.href, "_blank", "noopener,noreferrer"); }} initial={{ opacity: 0, y: 26, scale: 0.985 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: "-70px" }} transition={{ duration: 0.5, delay: Math.min(index * 0.045, 0.22) }} whileHover={{ y: -8 }}>
                  <div className="project-visual">
                    {hasProjectMedia ? (
                      <ProjectMediaShowcase images={projectImages} videoUrl={project.videoUrl} title={project.title} number={number}/>
                    ) : (
                      <>
                        <div className="project-visual-top"><span>PROJECT {number}</span><span><i /> PUBLIC REPOSITORY</span></div>
                        <div className="project-visual-grid" /><div className="project-orb project-orb-a"/><div className="project-orb project-orb-b"/>
                        <div className="project-console"><div className="console-head"><span/><span/><span/><small>vthish / {project.title.toLowerCase().replaceAll(" ", "-")}</small></div><div className="console-body"><div className="project-icon-box"><ProjectIcon size={30}/></div><div className="console-copy"><small>{project.category}</small><strong>{project.title}</strong></div></div><div className="console-stack">{project.stack.slice(0, 3).map((item) => <span key={item}>{item}</span>)}</div></div>
                        <div className="project-code-lines"><span/><span/><span/><span/></div>
                      </>
                    )}
                  </div>
                  <div className="project-content">
                    <div className="project-meta-row"><div className="project-meta-label"><small>{project.category}</small>{project.status ? <span className="project-status">{project.status}</span> : null}</div><div className="project-links"><a className="project-open" href={project.href} target="_blank" rel="noreferrer" onClick={() => trackPortfolioEvent("project_repository_click", project.title)}><Icons.github size={16}/> View repository <Icons.external size={14}/></a>{project.liveDemoUrl ? <a className="project-open project-live" href={project.liveDemoUrl} target="_blank" rel="noreferrer" onClick={() => trackPortfolioEvent("project_live_demo_click", project.title)}><Icons.external size={15}/> Live demo</a> : null}</div></div>
                    <h3>{project.title}</h3><p>{project.description}</p>
                    <div className="project-stack-title"><Icons.code size={14}/> Tech stack</div>
                    <div className="project-tech-stack">{project.stack.map((item) => <span key={item}><i />{item}</span>)}</div>
                    <div className="project-chips">{project.chips.map((chip) => <span key={chip}>{chip}</span>)}</div>
                    {project.caseStudy && Object.values(project.caseStudy).some(Boolean) ? <div className="project-case-study">{project.caseStudy.problem ? <div><small>Problem</small><span>{project.caseStudy.problem}</span></div> : null}{project.caseStudy.role ? <div><small>My role</small><span>{project.caseStudy.role}</span></div> : null}{project.caseStudy.solution ? <div><small>Solution</small><span>{project.caseStudy.solution}</span></div> : null}{project.caseStudy.outcome ? <div><small>Outcome</small><span>{project.caseStudy.outcome}</span></div> : null}</div> : null}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="section education-section" id="education">
          <SectionTitle {...content.educationHeading} />
          <div className="education-wrap">
            <div className="education-rail">{content.education.map((item, index) => <span key={item.id} style={{ top: `${content.education.length <= 1 ? 50 : 10 + (index * 80) / (content.education.length - 1)}%` }}/>)}</div>
            {content.education.map((item, i) => {
              const EducationIcon = contentIconMap[item.icon] || Icons.graduation;
              return (
                <motion.article className="education-card" key={item.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-70px" }} transition={{ duration: 0.55, delay: i * 0.08 }}>
                  <div className="education-index">{itemNumber(i)}</div><div className="education-icon"><EducationIcon size={24}/></div><div className="education-content"><div className="education-meta"><span>{item.period}</span><i>EDUCATION</i></div><h3>{item.title}</h3><strong>{item.place}</strong><p>{item.text}</p></div>
                </motion.article>
              );
            })}
          </div>
        </section>

        {content.experiences.length > 0 && (
          <section className="section experience-section" id="experience">
            <SectionTitle {...content.experienceHeading} />
            <div className="experience-grid">
              {content.experiences.map((item, index) => (
                <motion.article className="experience-card" key={item.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-70px" }} transition={{ duration: 0.55, delay: Math.min(index * 0.07, 0.25) }}>
                  {galleryImages(item.imageUrls, item.imageUrl).length ? <div className="experience-image"><RotatingImage images={galleryImages(item.imageUrls, item.imageUrl)} alt={`${item.company} visual`}/></div> : <div className="experience-icon"><Icons.code size={24}/></div>}
                  <div className="experience-meta"><span>{item.period}</span>{item.location ? <i>{item.location}</i> : null}</div>
                  <h3>{item.role}</h3><strong>{item.company}</strong><p>{item.description}</p>
                  {item.highlights.length ? <div className="experience-highlights">{item.highlights.map((highlight) => <span key={highlight}>{highlight}</span>)}</div> : null}
                </motion.article>
              ))}
            </div>
          </section>
        )}

        {content.certificates.length > 0 && (
          <section className="section certificates-section" id="certificates">
            <SectionTitle {...content.certificatesHeading} />
            <div className="certificate-grid">
              {content.certificates.map((item, index) => {
                const inner = <><div className="certificate-visual">{galleryImages(item.imageUrls, item.imageUrl).length ? <RotatingImage images={galleryImages(item.imageUrls, item.imageUrl)} alt={`${item.title} certificate`}/> : <div className="certificate-placeholder"><Icons.certificate size={42}/><span>CERTIFICATE</span></div>}<div className="certificate-number">{itemNumber(index)}</div></div><div className="certificate-copy"><div className="certificate-meta"><span>{item.issuer || "Certificate"}</span><i>{item.date}</i></div><h3>{item.title}</h3>{item.description ? <p>{item.description}</p> : null}{item.credentialUrl ? <span className="certificate-link">View credential <Icons.external size={14}/></span> : null}</div></>;
                return item.credentialUrl ? <motion.a className="certificate-card" href={item.credentialUrl} target="_blank" rel="noreferrer" onClick={() => trackPortfolioEvent("certificate_click", item.title)} key={item.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-70px" }} transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.24) }} whileHover={{ y: -6 }}>{inner}</motion.a> : <motion.article className="certificate-card" key={item.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-70px" }} transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.24) }} whileHover={{ y: -6 }}>{inner}</motion.article>;
              })}
            </div>
          </section>
        )}

        {content.testimonials.length > 0 && (
          <section className="section testimonials-section" id="testimonials">
            <SectionTitle {...content.testimonialsHeading} />
            <div className="testimonial-grid">
              {content.testimonials.map((item, index) => {
                const inner = <><span className="testimonial-quote-mark">“</span><p>{item.quote}</p><div className="testimonial-person"><strong>{item.name}</strong><span>{[item.role, item.company].filter(Boolean).join(" · ")}</span></div></>;
                return item.profileUrl ? <motion.a className="testimonial-card" href={item.profileUrl} target="_blank" rel="noreferrer" key={item.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-70px" }} transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.24) }} whileHover={{ y: -5 }}>{inner}</motion.a> : <motion.article className="testimonial-card" key={item.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-70px" }} transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.24) }} whileHover={{ y: -5 }}>{inner}</motion.article>;
              })}
            </div>
          </section>
        )}

        <section className="photo-break">
          <div className="photo-break-image"><RotatingImage images={galleryImages(content.photoBreak.imageUrls, content.photoBreak.imageUrl)} alt={`${content.identity.name} portfolio feature`} interval={7000}/></div>
          <div className="photo-break-overlay" />
          <div className="photo-break-copy">
            <motion.div className="photo-break-copy-inner" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span>{content.photoBreak.eyebrow}</span><h2>{content.photoBreak.title.split("\n").map((line, index) => <span key={`${line}-${index}`}>{line}{index < content.photoBreak.title.split("\n").length - 1 ? <br/> : null}</span>)}</h2>
            </motion.div>
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="contact-card">
            <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="eyebrow"><span />{content.contact.eyebrow}</span><h2>{content.contact.title}<br/><em>{content.contact.accent}</em></h2><p>{content.contact.text}</p>
              <div className="contact-actions"><MagneticLink className="whatsapp-btn" href={whatsappHref} external onClick={() => trackPortfolioEvent("whatsapp_click", "Contact")}><Icons.message size={20}/> {content.contact.whatsappButton} <Icons.arrow size={18}/></MagneticLink><button className="mail-btn" type="button" onClick={() => { trackPortfolioEvent("email_open", "Contact form"); setEmailOpen(true); }}><Icons.mail size={18}/> {content.contact.emailButton}</button><a className="phone-btn" href={phoneHref} onClick={() => trackPortfolioEvent("call_click", "Contact")}><Icons.phone size={18}/> {content.contact.phoneButton}</a></div>
            </motion.div>
            <motion.div className="contact-portrait" initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <RotatingImage images={galleryImages(content.contact.imageUrls, content.contact.imageUrl)} alt={content.identity.name} interval={6800}/><div className="contact-ring ring-one"/><div className="contact-ring ring-two"/>
            </motion.div>
          </div>
        </section>

        <footer>
          <div className="footer-top">
            <a className="brand footer-brand" href="#top"><span className="brand-mark">{content.identity.brandInitials}</span><span className="brand-copy">{content.identity.firstName.toUpperCase()}<br/><small>{content.identity.lastName.toUpperCase()}</small></span></a>
            <div className="footer-links footer-icon-links">
              {socialLinks.map((item) => { const SocialIcon = socialIconMap[item.icon] || Icons.external; return <a key={item.id} href={item.href} target="_blank" rel="noreferrer" onClick={() => trackPortfolioEvent("social_click", `Footer ${item.label}`)}><SocialIcon size={18}/><span>{item.label}</span></a>; })}
              <a href={`mailto:${content.identity.email}`} onClick={() => trackPortfolioEvent("email_open", "Footer mailto")}><Icons.mail size={18}/><span>Email</span></a><a href={whatsappHref} target="_blank" rel="noreferrer" onClick={() => trackPortfolioEvent("whatsapp_click", "Footer")}><Icons.message size={18}/><span>WhatsApp</span></a><a href={phoneHref} onClick={() => trackPortfolioEvent("call_click", "Footer")}><Icons.phone size={18}/><span>Call me</span></a>
            </div>
          </div>
          <div className="footer-bottom"><span>© {new Date().getFullYear()} {content.identity.name}. All rights reserved.</span><span>{content.identity.footerTagline}</span></div>
        </footer>

        <ContactEmailModal open={emailOpen} onClose={() => setEmailOpen(false)} ownerName={content.identity.firstName || content.identity.name}/>
        <Chatbot content={content} />
      </main>
    </MotionConfig>
  );
}

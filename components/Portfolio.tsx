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
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";

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
  linkedin: (p: IconProps) => (
    <Icon {...p}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V9h4v2"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></Icon>
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
};

const socialLinks = [
  { label: "GitHub", href: "https://github.com/vthish", Icon: Icons.github },
  { label: "GitLab", href: "https://gitlab.com/vthish-dev", Icon: Icons.code },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/venusha-thishan", Icon: Icons.linkedin },
];

const projects = [
  {
    number: "01",
    title: "Auto Ledger",
    category: "Automation / Finance",
    description: "A ledger-focused automation project built around cleaner and faster financial workflows.",
    href: "https://github.com/vthish/Auto-Ledger",
    chips: ["Automation", "Finance"],
  },
  {
    number: "02",
    title: "PulseAid Android",
    category: "Mobile / Utility",
    description: "An Android-focused application project exploring mobile-first assistance and practical utility flows.",
    href: "https://github.com/vthish/PulseAid-Android",
    chips: ["Android", "Mobile"],
  },
  {
    number: "03",
    title: "Smart Expense Categorizer",
    category: "AI / Finance",
    description: "A smart expense workflow centered on categorizing financial records with automation in mind.",
    href: "https://github.com/vthish/Smart-Expense-Categorizer",
    chips: ["AI", "Expenses"],
  },
  {
    number: "04",
    title: "HVTM Care",
    category: "AI / Healthcare",
    description: "An AI-driven drug forecasting system project focused on healthcare-oriented prediction workflows.",
    href: "https://github.com/vthish/HVTM_Care_AI-Driven_Drug_Forecasting_System",
    chips: ["AI", "Forecasting", "Healthcare"],
  },
  {
    number: "05",
    title: "Sentry Gas App",
    category: "Safety / Application",
    description: "An application project centered on gas-related monitoring and safety-focused experiences.",
    href: "https://github.com/vthish/sentry-gas-app",
    chips: ["Safety", "App"],
  },
  {
    number: "06",
    title: "Synapse AI Notes",
    category: "AI / Productivity",
    description: "An AI notes and summarization system designed around faster knowledge capture and review.",
    href: "https://github.com/vthish/Synapse-AI-Notes-Summarize-System",
    chips: ["AI", "Notes", "Summarization"],
  },
  {
    number: "07",
    title: "Smart File Automator",
    category: "Automation / Productivity",
    description: "A file-automation project focused on reducing repetitive organization and file-handling work.",
    href: "https://github.com/vthish/smart-file-automator",
    chips: ["Automation", "Files"],
  },
];

const skillGroups = [
  {
    title: "Languages",
    Icon: Icons.code,
    items: ["TypeScript", "JavaScript", "Java", "Python", "PHP", "C++", "C"],
  },
  {
    title: "Backend & Data",
    Icon: Icons.database,
    items: ["Spring Boot", "PostgreSQL", "Oracle", "Prisma ORM"],
  },
  {
    title: "Mobile",
    Icon: Icons.phone,
    items: ["Flutter", "Dart", "Android Development"],
  },
  {
    title: "Cloud & Delivery",
    Icon: Icons.cloud,
    items: ["AWS", "GitHub", "GitLab", "CI/CD"],
  },
  {
    title: "AI Workflow",
    Icon: Icons.brain,
    items: ["Gemini", "ChatGPT", "Claude", "Antigravity"],
  },
];

const roles = [
  "Software Engineer",
  "Full-Stack Developer",
  "Mobile App Developer",
  "AI-Driven Builder",
];

const whatsappHref =
  "https://wa.me/94717135237?text=" +
  encodeURIComponent("Hi Venusha, I found your portfolio and I'd like to discuss a software opportunity with you.");

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

function MagneticLink({ href, children, className = "", external = false }: { href: string; children?: ReactNode; className?: string; external?: boolean }) {
  return (
    <motion.a
      href={href}
      className={className}
      whileHover={{ y: -3, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      {children}
    </motion.a>
  );
}

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I’m VT Assistant — a demo chatbot for Venusha’s portfolio. What would you like to know?" },
  ]);

  const reply = (text: string) => {
    const q = text.toLowerCase();
    if (q.includes("skill") || q.includes("stack")) {
      return "Venusha works across TypeScript, JavaScript, Java, Spring Boot, Flutter, Dart, Python, PostgreSQL, Oracle, AWS and CI/CD workflows.";
    }
    if (q.includes("project") || q.includes("github")) {
      return "There are 7 highlighted GitHub projects here. Scroll to the Projects section or use the GitHub button to explore the source code.";
    }
    if (q.includes("hire") || q.includes("contact") || q.includes("whatsapp")) {
      return "Great — use the green Hire Me button to open a pre-filled WhatsApp conversation with Venusha.";
    }
    if (q.includes("cv") || q.includes("resume")) {
      return "Use the Download CV button in the hero or contact section to open Venusha’s CV.";
    }
    return "I’m only a demo for now. Try asking about skills, projects, CV, or how to hire Venusha.";
  };

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean || typing) return;
    setMessages((m) => [...m, { from: "user", text: clean }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: reply(clean) }]);
      setTyping(false);
    }, 650);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.aside
            className="chat-panel"
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            aria-label="VT Assistant demo chatbot"
          >
            <div className="chat-head">
              <div className="chat-avatar"><Icons.bot size={18}/></div>
              <div>
                <strong>VT Assistant</strong>
                <span><i /> Demo mode</span>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chatbot"><Icons.close size={18}/></button>
            </div>
            <div className="chat-body">
              {messages.map((message, index) => (
                <motion.div
                  key={`${message.from}-${index}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`chat-message ${message.from}`}
                >
                  {message.text}
                </motion.div>
              ))}
              {typing && <div className="typing"><span/><span/><span/></div>}
            </div>
            <div className="quick-actions">
              {["Show projects", "What are your skills?", "Hire Venusha"].map((item) => (
                <button key={item} onClick={() => send(item)}>{item}</button>
              ))}
            </div>
            <form className="chat-input" onSubmit={submit}>
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask something..." aria-label="Chat message" />
              <button type="submit" aria-label="Send message"><Icons.send size={17}/></button>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>

      <motion.button
        className="chat-launcher"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label={open ? "Close chatbot" : "Open chatbot"}
      >
        <span className="chat-ping" />
        {open ? <Icons.close size={21}/> : <Icons.bot size={22}/>}      
      </motion.button>
    </>
  );
}

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const smoothX = useSpring(mouseX, { stiffness: 180, damping: 28, mass: 0.25 });
  const smoothY = useSpring(mouseY, { stiffness: 180, damping: 28, mass: 0.25 });
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  useEffect(() => {
    setMounted(true);
    const roleTimer = window.setInterval(() => setRoleIndex((i) => (i + 1) % roles.length), 2600);
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      window.clearInterval(roleTimer);
      window.removeEventListener("mousemove", move);
    };
  }, [mouseX, mouseY]);

  const marquee = useMemo(
    () => ["TypeScript", "Next.js", "Java", "Spring Boot", "Flutter", "Python", "PostgreSQL", "AWS", "AI", "CI/CD"],
    []
  );

  return (
    <MotionConfig reducedMotion="user">
      <main className="site-shell">
        <motion.div className="scroll-progress" style={{ scaleX }} />
        {mounted && (
          <motion.div className="cursor-glow" style={{ x: smoothX, y: smoothY }} aria-hidden="true" />
        )}
        <div className="noise" aria-hidden="true" />
        <div className="ambient ambient-one" aria-hidden="true" />
        <div className="ambient ambient-two" aria-hidden="true" />

        <header className="nav-wrap">
          <a className="brand" href="#top" aria-label="Venusha Thishan home">
            <span className="brand-mark">VT</span>
            <span className="brand-copy">VENUSHA<br/><small>THISHAN</small></span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {[
              ["About", "#about"],
              ["Skills", "#skills"],
              ["Projects", "#projects"],
              ["Education", "#education"],
            ].map(([label, href]) => <a key={href} href={href}>{label}</a>)}
          </nav>
          <div className="nav-actions">
            <MagneticLink className="nav-hire" href={whatsappHref} external>
              <Icons.message size={16}/> Hire me
            </MagneticLink>
            <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Icons.menu/></button>
          </div>
        </header>

        <AnimatePresence>
          {menuOpen && (
            <motion.div className="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button className="mobile-menu-close" onClick={() => setMenuOpen(false)} aria-label="Close menu"><Icons.close size={26}/></button>
              <div className="mobile-menu-links">
                {[
                  ["01", "About", "#about"],
                  ["02", "Skills", "#skills"],
                  ["03", "Projects", "#projects"],
                  ["04", "Education", "#education"],
                  ["05", "Contact", "#contact"],
                ].map(([n, label, href], i) => (
                  <motion.a key={href} href={href} onClick={() => setMenuOpen(false)} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                    <span>{n}</span>{label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="hero" id="top">
          <div className="hero-grid" aria-hidden="true" />
          <motion.div className="hero-copy" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}>
            <div className="status-pill"><span /> OPEN TO SOFTWARE OPPORTUNITIES</div>
            <p className="hero-kicker">Hello, I’m</p>
            <h1>Venusha<br/><span>Thishan.</span></h1>
            <div className="role-line">
              <span>I build as a</span>
              <div className="role-window">
                <AnimatePresence mode="wait">
                  <motion.strong key={roles[roleIndex]} initial={{ y: 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -22, opacity: 0 }} transition={{ duration: 0.35 }}>
                    {roles[roleIndex]}
                  </motion.strong>
                </AnimatePresence>
              </div>
            </div>
            <p className="hero-text">
              I build practical digital products across web, mobile, AI and automation — with a focus on clean engineering and experiences people actually enjoy using.
            </p>
            <div className="hero-actions">
              <MagneticLink href="#projects" className="primary-btn">Explore my work <Icons.arrow size={18}/></MagneticLink>
              <MagneticLink href="https://drive.google.com/file/d/1Mi9rKwP5plZMO8qltgGDapabKt1fj0gu/view?usp=drivesdk" className="ghost-btn" external>
                <Icons.download size={18}/> View CV
              </MagneticLink>
            </div>
            <div className="hero-socials">
              {socialLinks.map(({ label, href, Icon: SocialIcon }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}><SocialIcon size={18}/></a>
              ))}
              <span className="social-line" />
              <small>Galle, Sri Lanka</small>
            </div>
          </motion.div>

          <motion.div className="hero-visual" initial={{ opacity: 0, scale: 0.92, x: 30 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 1, delay: 0.12 }}>
            <div className="portrait-orbit orbit-one" />
            <div className="portrait-orbit orbit-two" />
            <motion.div className="portrait-card" whileHover={{ rotate: 0, y: -6 }} transition={{ type: "spring", stiffness: 180, damping: 18 }}>
              <div className="portrait-frame">
                <Image src="/images/profile-main.webp" alt="Venusha Thishan" fill priority sizes="(max-width: 900px) 80vw, 42vw" />
                <div className="portrait-overlay" />
              </div>
              <div className="portrait-caption">
                <span>Based in</span>
                <strong><Icons.pin size={14}/> Galle / Sri Lanka</strong>
              </div>
            </motion.div>
            <motion.div className="floating-badge badge-one" animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
              <Icons.sparkles size={17}/><span><small>BUILDING WITH</small>AI + Automation</span>
            </motion.div>
            <motion.div className="floating-badge badge-two" animate={{ y: [0, 9, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
              <span className="terminal-dot">$</span><span><small>PRIMARY MODE</small>Ship. Learn. Repeat.</span>
            </motion.div>
          </motion.div>

          <a className="scroll-cue" href="#about"><span>SCROLL TO DISCOVER</span><Icons.chevron size={18}/></a>
        </section>

        <div className="marquee-wrap" aria-label="Technology stack">
          <motion.div className="marquee-track" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 26, repeat: Infinity, ease: "linear" }}>
            {[...marquee, ...marquee].map((item, i) => <span key={`${item}-${i}`}><i>✦</i>{item}</span>)}
          </motion.div>
        </div>

        <section className="section about-section" id="about">
          <SectionTitle eyebrow="About me" title="Engineering ideas into real products." text="I enjoy moving from an idea to a working product — combining software engineering, design awareness, automation and AI tooling to solve useful problems." />
          <div className="about-grid">
            <motion.div className="about-photo" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <Image src="/images/profile-mono.webp" alt="Black and white portrait of Venusha Thishan" fill sizes="(max-width: 900px) 100vw, 36vw" />
              <div className="photo-index">/ 01</div>
            </motion.div>
            <div className="about-copy">
              <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }}>
                My toolkit spans <strong>TypeScript, JavaScript, Java, Spring Boot, Flutter, Dart, Python, PostgreSQL, Oracle, Prisma, AWS and CI/CD</strong>. I also work with modern AI assistants as part of my development workflow.
              </motion.p>
              <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6, delay: 0.08 }}>
                I’m especially interested in web development, Android/mobile applications, smart automation and AI-enhanced software — with an emphasis on building systems that feel clear, fast and intentional.
              </motion.p>
              <div className="metric-grid">
                <div><strong>07</strong><span>GitHub projects<br/>featured</span></div>
                <div><strong>03</strong><span>Education<br/>milestones</span></div>
                <div><strong>∞</strong><span>Curiosity for<br/>building</span></div>
              </div>
              <div className="about-contact-strip">
                <a href="mailto:devthish17@gmail.com"><Icons.mail size={16}/> devthish17@gmail.com</a>
                <a href={whatsappHref} target="_blank" rel="noreferrer"><Icons.message size={16}/> WhatsApp</a>
              </div>
            </div>
          </div>
        </section>

        <section className="section skills-section" id="skills">
          <SectionTitle eyebrow="Capabilities" title="A stack built for shipping." text="From interface code to data, mobile, cloud and automation — these are the tools I currently work with." />
          <div className="skill-grid">
            {skillGroups.map(({ title, Icon: SkillIcon, items }, i) => (
              <motion.article
                className="skill-card"
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                whileHover={{ y: -6 }}
              >
                <div className="skill-icon"><SkillIcon size={22}/></div>
                <h3>{title}</h3>
                <div className="skill-tags">{items.map((item) => <span key={item}>{item}</span>)}</div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="section projects-section" id="projects">
          <div className="projects-heading-row">
            <SectionTitle eyebrow="Selected work" title="Projects that show the range." text="A selection of my public repositories across AI, mobile, automation, safety and productivity." />
            <a className="text-link" href="https://github.com/vthish" target="_blank" rel="noreferrer">All GitHub projects <Icons.arrow size={16}/></a>
          </div>
          <div className="projects-list">
            {projects.map((project, index) => (
              <motion.a
                className="project-row"
                href={project.href}
                target="_blank"
                rel="noreferrer"
                key={project.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.2) }}
              >
                <span className="project-number">{project.number}</span>
                <div className="project-main">
                  <small>{project.category}</small>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
                <div className="project-chips">{project.chips.map((chip) => <span key={chip}>{chip}</span>)}</div>
                <div className="project-arrow"><Icons.arrow size={22}/></div>
              </motion.a>
            ))}
          </div>
        </section>

        <section className="section education-section" id="education">
          <SectionTitle eyebrow="Education" title="Foundation + continuous learning." text="Formal software engineering study supported by continuous project-based learning." />
          <div className="education-wrap">
            <div className="timeline-line" />
            {[
              { year: "2021 / 2022", title: "G.C.E. A/L", place: "Technology", text: "Built the academic foundation that led into software engineering." },
              { year: "NIBM — Galle", title: "Diploma in Software Engineering", place: "Software Engineering", text: "Developed practical software engineering fundamentals and project experience." },
              { year: "NIBM — Galle", title: "Higher National Diploma in Software Engineering", place: "Advanced Software Engineering", text: "Extended software engineering knowledge through higher-level study and applied development." },
            ].map((item, i) => (
              <motion.div className="timeline-item" key={item.title} initial={{ opacity: 0, x: i % 2 ? 24 : -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
                <span className="timeline-dot" />
                <small>{item.year}</small>
                <h3>{item.title}</h3>
                <strong>{item.place}</strong>
                <p>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="photo-break">
          <div className="photo-break-image"><Image src="/images/city.webp" alt="Venusha Thishan standing outdoors in an urban setting" fill sizes="100vw" /></div>
          <div className="photo-break-overlay" />
          <motion.div className="photo-break-copy" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span>THE NEXT BUILD</span>
            <h2>Good software should feel<br/>simple after the hard work.</h2>
          </motion.div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="contact-card">
            <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="eyebrow"><span />Let’s work together</span>
              <h2>Have a role, product or<br/><em>wild idea?</em></h2>
              <p>If you think I could be a fit for your team or project, the fastest way to start a conversation is WhatsApp.</p>
              <div className="contact-actions">
                <MagneticLink className="whatsapp-btn" href={whatsappHref} external><Icons.message size={20}/> Start on WhatsApp <Icons.arrow size={18}/></MagneticLink>
                <a className="mail-btn" href="mailto:devthish17@gmail.com"><Icons.mail size={18}/> Email me</a>
              </div>
            </motion.div>
            <motion.div className="contact-portrait" initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <Image src="/images/contact.webp" alt="Venusha Thishan" fill sizes="(max-width: 900px) 100vw, 38vw" />
              <div className="contact-ring ring-one"/><div className="contact-ring ring-two"/>
            </motion.div>
          </div>
        </section>

        <footer>
          <div className="footer-top">
            <a className="brand footer-brand" href="#top"><span className="brand-mark">VT</span><span className="brand-copy">VENUSHA<br/><small>THISHAN</small></span></a>
            <div className="footer-links">
              {socialLinks.map(({ label, href }) => <a key={label} href={href} target="_blank" rel="noreferrer">{label}</a>)}
              <a href="mailto:devthish17@gmail.com">Email</a>
            </div>
          </div>
          <div className="footer-bottom"><span>© {new Date().getFullYear()} Venusha Thishan.</span><span>Designed to build. Built to evolve.</span></div>
        </footer>

        <Chatbot />
      </main>
    </MotionConfig>
  );
}

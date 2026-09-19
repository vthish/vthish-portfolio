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
import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";

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

const socialLinks = [
  { label: "GitHub", href: "https://github.com/vthish", Icon: Icons.github },
  { label: "GitLab", href: "https://gitlab.com/vthish-dev", Icon: Icons.gitlab },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/venusha-thishan", Icon: Icons.linkedin },
];

const projects = [
  {
    number: "01",
    title: "Auto Ledger",
    category: "Full-Stack / GovTech",
    description: "A secure multi-role digital driving-licence, traffic-fine and penalty-points platform with two Flutter apps, a Next.js admin portal and a NestJS REST API deployed on AWS.",
    href: "https://github.com/vthish/Auto-Ledger",
    chips: ["5 Roles", "QR Verification", "AWS Deployment"],
    stack: ["Flutter", "Dart", "Next.js 16", "React 19", "NestJS 11", "TypeScript", "PostgreSQL", "Prisma ORM", "AWS", "Docker", "GitLab CI/CD"],
    Icon: Icons.database,
  },
  {
    number: "02",
    title: "PulseAid Android",
    category: "Android / Healthcare",
    description: "A real-time blood donation management app connecting donors, hospitals, blood banks and admins through role-specific dashboards, emergency alerts and Firebase-backed data syncing.",
    href: "https://github.com/vthish/PulseAid-Android",
    chips: ["Blood Donation", "Real-time", "Multi-role"],
    stack: ["Java", "Firebase Firestore", "Firebase Auth", "Material Design", "XML", "MVVM"],
    Icon: Icons.phone,
  },
  {
    number: "03",
    title: "Smart Expense AI",
    category: "Mobile / FinTech / ML",
    description: "A Flutter expense tracker that understands natural-language entries, extracts amounts, predicts categories and supports a self-learning workflow through a FastAPI machine-learning backend.",
    href: "https://github.com/vthish/Smart-Expense-Categorizer",
    chips: ["NLP", "Self-learning", "Finance"],
    stack: ["Flutter", "Dart", "FastAPI", "Python", "Firebase Firestore", "Firebase Auth", "Scikit-learn", "Pandas", "Docker"],
    Icon: Icons.sparkles,
  },
  {
    number: "04",
    title: "HVTM Care",
    category: "AI/ML / Healthcare",
    description: "A pharmaceutical inventory forecasting platform that combines classical ML, BiLSTM/GRU deep learning and ensemble methods to predict demand and identify shortage risk.",
    href: "https://github.com/vthish/HVTM_Care_AI-Driven_Drug_Forecasting_System",
    chips: ["Forecasting", "Deep Learning", "Healthcare"],
    stack: ["Python", "FastAPI", "TensorFlow/Keras", "Scikit-learn", "XGBoost", "Pandas/NumPy", "HTML/CSS/JS", "Joblib"],
    Icon: Icons.brain,
  },
  {
    number: "05",
    title: "Sentry Gas App",
    category: "Safety / Application",
    description: "A safety-related application concept focused on gas monitoring, alert-oriented experiences and user-friendly interaction patterns.",
    href: "https://github.com/vthish/sentry-gas-app",
    chips: ["Safety", "App"],
    stack: ["Flutter", "Mobile", "Monitoring"],
    Icon: Icons.cloud,
  },
  {
    number: "06",
    title: "Synapse AI Notes",
    category: "Full-Stack / Productivity",
    description: "A secure note-taking web app with CRUD, search and subject filtering plus Hugging Face-powered summarization and assisted categorization, backed by Spring Boot and MySQL.",
    href: "https://github.com/vthish/Synapse-AI-Notes-Summarize-System",
    chips: ["Summarization", "Authentication", "Search"],
    stack: ["Java 17", "Spring Boot 3", "MySQL", "Spring Security", "Maven", "Tailwind CSS", "Vanilla JS", "Hugging Face API", "Spring Data JPA"],
    Icon: Icons.layers,
  },
  {
    number: "07",
    title: "Smart File Automator",
    category: "Automation / Productivity",
    description: "A file-automation project built to reduce repetitive manual work and improve how files are organized and processed.",
    href: "https://github.com/vthish/smart-file-automator",
    chips: ["Automation", "Files"],
    stack: ["Node.js", "Automation", "Utility"],
    Icon: Icons.code,
  },
];

const skillGroups = [
  {
    title: "Programming Languages",
    summary: "Languages I use to build practical applications across web, mobile and backend work.",
    Icon: Icons.code,
    items: ["TypeScript", "JavaScript", "Java", "Python", "Dart", "PHP", "C++", "C"],
  },
  {
    title: "Web Development",
    summary: "Frontend and full-stack technologies for modern, responsive and scalable web products.",
    Icon: Icons.sparkles,
    items: ["Next.js", "Node.js", "Nest.js", "HTML", "CSS", "Tailwind CSS", "Responsive UI"],
  },
  {
    title: "Backend & Data",
    summary: "Backend frameworks, databases and APIs used for structured, reliable application delivery.",
    Icon: Icons.database,
    items: ["Spring Boot", "FastAPI", "PostgreSQL", "MySQL", "Oracle", "Firebase Firestore", "Prisma ORM", "REST APIs"],
  },
  {
    title: "Mobile App Development",
    summary: "Cross-platform and Android-oriented mobile development for useful real-world products.",
    Icon: Icons.phone,
    items: ["Flutter", "Dart", "Java Android", "Firebase Auth", "Material Design", "MVVM", "Cross-platform Apps"],
  },
  {
    title: "DevOps & Cloud",
    summary: "Delivery-focused tooling that helps move projects from development into release and deployment.",
    Icon: Icons.cloud,
    items: ["AWS", "EC2", "S3", "AWS Amplify", "Docker", "Docker Compose", "GitLab CI/CD", "GitHub", "GitLab"],
  },
  {
    title: "Tools & Workflow",
    summary: "Day-to-day workflow strengths that improve collaboration, speed and product quality.",
    Icon: Icons.brain,
    items: ["Git", "UI Thinking", "Automation", "Problem Solving", "Team Collaboration"],
  },
];

const featuredSkills = [
  "Next.js",
  "Node.js",
  "Nest.js",
  "Spring Boot",
  "Flutter",
  "Docker",
  "AWS",
  "PostgreSQL",
  "TypeScript",
  "Java",
];

const serviceCards = [
  {
    title: "Web Development",
    text: "Modern responsive websites, dashboards and full-stack web apps using Next.js, Node.js, Nest.js and backend integrations.",
    Icon: Icons.code,
  },
  {
    title: "Mobile App Development",
    text: "Cross-platform and Android-focused mobile application development with Flutter and practical product thinking.",
    Icon: Icons.phone,
  },
  {
    title: "DevOps & Deployment",
    text: "Dockerized workflows, cloud deployment, CI/CD pipelines and release support for web and mobile products.",
    Icon: Icons.cloud,
  },
];

const roles = [
  "Software Engineer",
  "Full-Stack Developer",
  "Web Developer",
  "Mobile App Developer",
  "DevOps-ready Builder",
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

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const chatBodyRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi! I’m VT Assistant. Ask me about Venusha’s services, tech stack, projects, education or how to contact him.",
    },
  ]);

  useEffect(() => {
    if (!open) return;

    const frame = window.requestAnimationFrame(() => {
      const body = chatBodyRef.current;
      if (!body) return;

      body.scrollTo({
        top: body.scrollHeight,
        behavior: "smooth",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [messages, typing, open]);

  const reply = (text: string) => {
    const q = text.toLowerCase();

    if (q.includes("phone") || q.includes("number") || q.includes("call") || q.includes("contact no")) {
      return "Venusha’s contact number is +94 71 713 5237. You can also use the Hire Me button to open WhatsApp with a ready-to-send message.";
    }
    if (q.includes("email") || q.includes("mail")) {
      return "You can email Venusha at devthish17@gmail.com.";
    }
    if (q.includes("auto ledger") || q.includes("driving licence") || q.includes("traffic fine")) {
      return "Auto Ledger is a full-stack digital driving-licence and traffic-fine platform. Its stack includes Flutter/Dart mobile apps, Next.js 16 + React 19 for the admin portal, NestJS 11 + TypeScript for the REST API, PostgreSQL + Prisma, AWS EC2/Amplify/S3, Docker and GitLab CI/CD.";
    }
    if (q.includes("pulseaid") || q.includes("blood donation")) {
      return "PulseAid is an Android blood-donation management system built with Java, Firebase Firestore, Firebase Auth, Material Design XML components and MVVM architecture.";
    }
    if (q.includes("smart expense") || q.includes("expense categor")) {
      return "Smart Expense AI uses Flutter/Dart on mobile, Firebase Firestore and Firebase Auth, plus a FastAPI/Python ML backend with Scikit-learn, Pandas and Docker.";
    }
    if (q.includes("hvtm") || q.includes("drug forecast") || q.includes("pharmaceutical")) {
      return "HVTM Care is a pharmaceutical forecasting platform using Python, FastAPI, TensorFlow/Keras, Scikit-learn, XGBoost, Pandas/NumPy and a responsive HTML/CSS/JavaScript dashboard.";
    }
    if (q.includes("synapse") || q.includes("ai notes") || q.includes("note summar")) {
      return "Synapse AI Notes uses Java 17, Spring Boot 3, MySQL, Spring Security, Maven, HTML/CSS/Tailwind CSS, Vanilla JavaScript and the Hugging Face Inference API.";
    }
    if (q.includes("web") || q.includes("website") || q.includes("frontend") || q.includes("backend")) {
      return "Yes. Venusha builds responsive websites, dashboards and full-stack applications using Next.js, Node.js, Nest.js, Spring Boot, FastAPI, TypeScript/JavaScript and relational or Firebase-backed data layers.";
    }
    if (q.includes("mobile") || q.includes("android") || q.includes("flutter") || q.includes("app")) {
      return "Venusha develops mobile applications with Flutter/Dart and Java Android, including Firebase authentication/data integration, Material Design and MVVM-style architecture where appropriate.";
    }
    if (q.includes("devops") || q.includes("docker") || q.includes("deploy") || q.includes("aws") || q.includes("ci/cd")) {
      return "Venusha can help with Docker and Docker Compose, AWS EC2/S3/Amplify, GitLab CI/CD, GitHub/GitLab workflows and application deployment.";
    }
    if (q.includes("service") || q.includes("offer") || q.includes("do you do") || q.includes("what do you do")) {
      return "Venusha offers web development, mobile app development, backend/API development and DevOps/deployment support. His stack covers modern JavaScript/TypeScript, Java, Python, Flutter, databases and cloud tooling.";
    }
    if (q.includes("skill") || q.includes("stack") || q.includes("language") || q.includes("framework")) {
      return "Core skills include TypeScript, JavaScript, Java, Python, Dart, PHP, C++, C, Next.js, Node.js, Nest.js, Spring Boot, FastAPI, Flutter, Firebase, Docker, PostgreSQL, MySQL, Oracle, Prisma ORM, AWS, GitHub/GitLab and CI/CD.";
    }
    if (q.includes("ai") || q.includes("artificial intelligence")) {
      return "Venusha uses modern AI tools as a helpful part of his development workflow and has also built projects that integrate AI/ML services, while his broader focus remains software engineering across web, mobile and DevOps delivery.";
    }
    if (q.includes("project") || q.includes("github") || q.includes("repository") || q.includes("repo")) {
      return "This portfolio highlights 7 public GitHub projects across full-stack web, Android, Flutter, machine learning, healthcare, safety and automation. Open the Projects section to see each project’s verified tech stack and repository.";
    }
    if (q.includes("education") || q.includes("nibm") || q.includes("study")) {
      return "Venusha studied Software Engineering at NIBM Galle, including a Diploma and Higher National Diploma, after completing G.C.E. A/L in the Technology stream.";
    }
    if (q.includes("hire") || q.includes("contact") || q.includes("whatsapp") || q.includes("available")) {
      return "For work opportunities, use the Hire Me / WhatsApp button, call +94 71 713 5237, or email devthish17@gmail.com.";
    }
    if (q.includes("cv") || q.includes("resume")) {
      return "Use the View CV button near the top of the portfolio to open Venusha’s CV.";
    }
    if (q.includes("location") || q.includes("where") || q.includes("galle")) {
      return "Venusha is based in Galle, Sri Lanka.";
    }
    return "I can help with Venusha’s services, skills, project tech stacks, education, phone number, email, CV or WhatsApp contact. Try asking ‘What stack does Auto Ledger use?’";
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
    }, 520);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const quickQuestions = [
    { label: "Services", prompt: "What services do you offer?", Icon: Icons.layers },
    { label: "Mobile apps", prompt: "Can you build a mobile app?", Icon: Icons.phone },
    { label: "Skills", prompt: "Show skills", Icon: Icons.code },
    { label: "Contact", prompt: "How can I contact Venusha?", Icon: Icons.message },
  ];

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
            aria-label="VT portfolio assistant"
          >
            <div className="chat-head">
              <div className="chat-avatar"><Icons.bot size={19}/><span className="chat-avatar-orbit" /></div>
              <div className="chat-head-copy">
                <strong>VT Assistant</strong>
                <span><i /> Online · Portfolio guide</span>
              </div>
              <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close chatbot"><Icons.close size={18}/></button>
            </div>
            <div className="chat-intro">
              <div className="chat-intro-icon"><Icons.sparkles size={16}/></div>
              <div><strong>Ask anything about Venusha</strong><span>Services, skills, projects, education or contact details.</span></div>
            </div>
            <div className="chat-body" ref={chatBodyRef}>
              {messages.map((message, index) => (
                <motion.div
                  key={`${message.from}-${index}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`chat-message ${message.from}`}
                >
                  {message.from === "bot" && <span className="message-avatar"><Icons.bot size={13}/></span>}
                  <span>{message.text}</span>
                </motion.div>
              ))}
              {typing && <div className="typing"><span/><span/><span/></div>}
            </div>
            <div className="quick-actions">
              {quickQuestions.map(({ label, prompt, Icon: QuickIcon }) => (
                <button key={label} onClick={() => send(prompt)}><QuickIcon size={14}/><span>{label}</span></button>
              ))}
            </div>
            <div className="chat-contact-row">
              <a href={whatsappHref} target="_blank" rel="noreferrer"><Icons.message size={14}/> WhatsApp</a>
              <a href="mailto:devthish17@gmail.com"><Icons.mail size={14}/> Email</a>
            </div>
            <form className="chat-input" onSubmit={submit}>
              <div className="chat-input-shell"><Icons.message size={15}/><input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about Venusha..." aria-label="Chat message" /></div>
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
    () => ["TypeScript", "Next.js", "Node.js", "Nest.js", "Java", "Spring Boot", "Flutter", "Docker", "PostgreSQL", "AWS", "CI/CD"],
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
        <NetworkBackground />
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
              I build practical digital products across web, mobile and DevOps — combining clean engineering, polished interfaces and reliable delivery for real-world use.
            </p>
            <div className="hero-actions">
              <MagneticLink href="#projects" className="primary-btn">Explore my work <Icons.arrow size={18}/></MagneticLink>
              <MagneticLink href="https://drive.google.com/file/d/1Mi9rKwP5plZMO8qltgGDapabKt1fj0gu/view?usp=drivesdk" className="ghost-btn" external>
                <Icons.download size={18}/> View CV
              </MagneticLink>
            </div>
            <div className="hero-socials">
              {socialLinks.map(({ label, href, Icon: SocialIcon }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}>
                  <SocialIcon size={18}/><span>{label}</span>
                </a>
              ))}
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
              <Icons.sparkles size={17}/><span><small>FOCUS AREAS</small>Web • Mobile • DevOps</span>
            </motion.div>
            <motion.div className="floating-badge badge-two" animate={{ y: [0, 9, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
              <span className="terminal-dot">&lt;/&gt;</span><span><small>CORE STACK</small>Node.js • Nest.js • Next.js</span>
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
          <SectionTitle eyebrow="About me" title="Engineering ideas into real products." text="I enjoy moving from an idea to a working product — combining software engineering, design awareness and practical automation to solve useful problems." />
          <div className="about-grid">
            <motion.div className="about-photo" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <Image src="/images/profile-mono.webp" alt="Black and white portrait of Venusha Thishan" fill sizes="(max-width: 900px) 100vw, 36vw" />
              <div className="photo-index">/ 01</div>
            </motion.div>
            <div className="about-copy">
              <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }}>
                My toolkit spans <strong>TypeScript, JavaScript, Java, Python, Dart, Next.js, Node.js, Nest.js, Spring Boot, Flutter, Docker, PostgreSQL, Oracle, Prisma, AWS and CI/CD</strong>.
              </motion.p>
              <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6, delay: 0.08 }}>
                I build for <strong>web development, mobile app development and DevOps delivery</strong> — focusing on software that is clean, modern, scalable and useful in day-to-day business or product environments. I also use modern AI tools when they are useful for research, debugging, documentation and faster iteration.
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
          <SectionTitle eyebrow="Capabilities" title="Skills that cover build, launch and scale." text="A clearer view of the technologies, frameworks and services I work with across web, mobile and DevOps." />
          <div className="skills-spotlight">
            {featuredSkills.map((item) => <span key={item}>{item}</span>)}
          </div>
          <div className="skill-grid">
            {skillGroups.map(({ title, summary, Icon: SkillIcon, items }, i) => (
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
                <p className="skill-summary">{summary}</p>
                <div className="skill-tags">{items.map((item) => <span key={item}>{item}</span>)}</div>
              </motion.article>
            ))}
          </div>
          <div className="service-grid">
            {serviceCards.map(({ title, text, Icon: ServiceIcon }, index) => (
              <motion.article
                className="service-card"
                key={title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
              >
                <div className="service-icon"><ServiceIcon size={20} /></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="section projects-section" id="projects">
          <div className="projects-heading-row">
            <SectionTitle eyebrow="Selected work" title="Projects that show the range." text="A selection of public repositories across mobile, automation, finance, healthcare, safety and productivity." />
            <a className="text-link" href="https://github.com/vthish" target="_blank" rel="noreferrer">All GitHub projects <Icons.arrow size={16}/></a>
          </div>
          <div className="projects-list">
            {projects.map((project, index) => {
              const ProjectIcon = project.Icon;
              return (
              <motion.a
                className="project-card"
                href={project.href}
                target="_blank"
                rel="noreferrer"
                key={project.title}
                initial={{ opacity: 0, y: 26, scale: 0.985 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.045, 0.22) }}
                whileHover={{ y: -8 }}
              >
                <div className="project-visual">
                  <div className="project-visual-top"><span>PROJECT {project.number}</span><span><i /> PUBLIC REPOSITORY</span></div>
                  <div className="project-visual-grid" />
                  <div className="project-orb project-orb-a" /><div className="project-orb project-orb-b" />
                  <div className="project-console">
                    <div className="console-head"><span/><span/><span/><small>vthish / {project.title.toLowerCase().replaceAll(" ", "-")}</small></div>
                    <div className="console-body">
                      <div className="project-icon-box"><ProjectIcon size={30}/></div>
                      <div className="console-copy"><small>{project.category}</small><strong>{project.title}</strong></div>
                    </div>
                    <div className="console-stack">{project.stack.slice(0, 3).map((item) => <span key={item}>{item}</span>)}</div>
                  </div>
                  <div className="project-code-lines"><span/><span/><span/><span/></div>
                </div>
                <div className="project-content">
                  <div className="project-meta-row">
                    <small>{project.category}</small>
                    <span className="project-open"><Icons.github size={16}/> View repository <Icons.external size={14}/></span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-stack-title"><Icons.code size={14}/> Tech stack</div>
                  <div className="project-tech-stack">{project.stack.map((item) => <span key={item}><i />{item}</span>)}</div>
                  <div className="project-chips">{project.chips.map((chip) => <span key={chip}>{chip}</span>)}</div>
                </div>
              </motion.a>
              );
            })}
          </div>
        </section>

        <section className="section education-section" id="education">
          <SectionTitle eyebrow="Education" title="Foundation + continuous learning." text="Formal software engineering study supported by continuous project-based learning." />
          <div className="education-wrap">
            <div className="education-rail"><span/><span/><span/></div>
            {[
              { year: "2021 / 2022", index: "01", title: "G.C.E. A/L", place: "Technology Stream", text: "Built the academic foundation that opened the path toward software engineering and product development.", Icon: Icons.graduation },
              { year: "NIBM · Galle", index: "02", title: "Diploma in Software Engineering", place: "Software Engineering", text: "Strengthened practical software engineering fundamentals through structured study and hands-on project work.", Icon: Icons.certificate },
              { year: "NIBM · Galle", index: "03", title: "Higher National Diploma in Software Engineering", place: "Advanced Software Engineering", text: "Expanded software engineering knowledge with higher-level study, applied development and continuous learning.", Icon: Icons.layers },
            ].map((item, i) => {
              const EducationIcon = item.Icon;
              return (
              <motion.article className="education-card" key={item.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-70px" }} transition={{ duration: 0.55, delay: i * 0.08 }}>
                <div className="education-index">{item.index}</div>
                <div className="education-icon"><EducationIcon size={24}/></div>
                <div className="education-content">
                  <div className="education-meta"><span>{item.year}</span><i>EDUCATION</i></div>
                  <h3>{item.title}</h3>
                  <strong>{item.place}</strong>
                  <p>{item.text}</p>
                </div>
              </motion.article>
              );
            })}
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
              <p>If you need help with web development, mobile app development or DevOps-related delivery, the fastest way to start a conversation is WhatsApp.</p>
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
            <div className="footer-links footer-icon-links">
              {socialLinks.map(({ label, href, Icon: SocialIcon }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer"><SocialIcon size={18}/><span>{label}</span></a>
              ))}
              <a href="mailto:devthish17@gmail.com"><Icons.mail size={18}/><span>Email</span></a>
              <a href={whatsappHref} target="_blank" rel="noreferrer"><Icons.message size={18}/><span>WhatsApp</span></a>
            </div>
          </div>
          <div className="footer-bottom"><span>© {new Date().getFullYear()} Venusha Thishan. All rights reserved.</span><span>Software Engineer · Web · Mobile · DevOps</span></div>
        </footer>

        <Chatbot />
      </main>
    </MotionConfig>
  );
}

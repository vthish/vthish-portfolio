export const CONTENT_ICON_KEYS = [
  "database",
  "phone",
  "sparkles",
  "brain",
  "cloud",
  "layers",
  "code",
  "graduation",
  "certificate",
] as const;

export type ContentIconKey = (typeof CONTENT_ICON_KEYS)[number];
export type ProjectIconKey = ContentIconKey;

export type SectionCopy = {
  eyebrow: string;
  title: string;
  text: string;
};

export type SocialLink = {
  id: string;
  label: string;
  href: string;
  icon: "github" | "gitlab" | "linkedin" | "link";
};

export type PortfolioProject = {
  id: string;
  title: string;
  category: string;
  description: string;
  href: string;
  chips: string[];
  stack: string[];
  icon: ProjectIconKey;
  imageUrl?: string;
  imageUrls?: string[];
  videoUrl?: string;
};

export type SkillGroup = {
  id: string;
  title: string;
  summary: string;
  items: string[];
  icon: ContentIconKey;
};

export type ServiceItem = {
  id: string;
  title: string;
  text: string;
  icon: ContentIconKey;
};

export type EducationItem = {
  id: string;
  period: string;
  title: string;
  place: string;
  text: string;
  icon: ContentIconKey;
};

export type CertificateItem = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  credentialUrl?: string;
  imageUrl?: string;
  imageUrls?: string[];
};

export type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  imageUrl?: string;
  imageUrls?: string[];
};

export type PortfolioContent = {
  cvUrl: string;
  identity: {
    name: string;
    firstName: string;
    lastName: string;
    brandInitials: string;
    location: string;
    email: string;
    phone: string;
    whatsappNumber: string;
    whatsappMessage: string;
    footerTagline: string;
    githubUrl: string;
  };
  socialLinks: SocialLink[];
  hero: {
    status: string;
    kicker: string;
    roles: string[];
    text: string;
    profileImageUrl: string;
    profileImageUrls?: string[];
    focusAreas: string;
    coreStack: string;
  };
  marquee: string[];
  about: {
    heading: SectionCopy;
    imageUrl: string;
    imageUrls?: string[];
    paragraphs: string[];
    curiosityValue: string;
    curiosityLabel: string;
  };
  skills: {
    heading: SectionCopy;
    featured: string[];
    groups: SkillGroup[];
    services: ServiceItem[];
  };
  projectsHeading: SectionCopy;
  projects: PortfolioProject[];
  educationHeading: SectionCopy;
  education: EducationItem[];
  experienceHeading: SectionCopy;
  experiences: ExperienceItem[];
  certificatesHeading: SectionCopy;
  certificates: CertificateItem[];
  photoBreak: {
    imageUrl: string;
    imageUrls?: string[];
    eyebrow: string;
    title: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    accent: string;
    text: string;
    imageUrl: string;
    imageUrls?: string[];
    whatsappButton: string;
    emailButton: string;
  };
  updatedAt?: string;
};

export const DEFAULT_PORTFOLIO_CONTENT: PortfolioContent = {
  cvUrl: "https://drive.google.com/file/d/1Mi9rKwP5plZMO8qltgGDapabKt1fj0gu/view?usp=drivesdk",
  identity: {
    name: "Venusha Thishan",
    firstName: "Venusha",
    lastName: "Thishan",
    brandInitials: "VT",
    location: "Galle, Sri Lanka",
    email: "devthish17@gmail.com",
    phone: "+94 71 713 5237",
    whatsappNumber: "94717135237",
    whatsappMessage: "Hi Venusha, I found your portfolio and I'd like to discuss a software opportunity with you.",
    footerTagline: "Software Engineer · Web · Mobile · DevOps",
    githubUrl: "https://github.com/vthish",
  },
  socialLinks: [
    { id: "github", label: "GitHub", href: "https://github.com/vthish", icon: "github" },
    { id: "gitlab", label: "GitLab", href: "https://gitlab.com/vthish-dev", icon: "gitlab" },
    { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/venusha-thishan", icon: "linkedin" },
  ],
  hero: {
    status: "OPEN TO SOFTWARE OPPORTUNITIES",
    kicker: "Hello, I’m",
    roles: ["Software Engineer", "Full-Stack Developer", "Web Developer", "Mobile App Developer", "DevOps-ready Builder"],
    text: "I build practical digital products across web, mobile and DevOps — combining clean engineering, polished interfaces and reliable delivery for real-world use.",
    profileImageUrl: "/images/profile-main.webp",
    profileImageUrls: ["/images/profile-main.webp"],
    focusAreas: "Web • Mobile • DevOps",
    coreStack: "Node.js • Nest.js • Next.js",
  },
  marquee: ["TypeScript", "Next.js", "Node.js", "Nest.js", "Java", "Spring Boot", "Flutter", "Docker", "PostgreSQL", "AWS", "CI/CD"],
  about: {
    heading: {
      eyebrow: "About me",
      title: "Engineering ideas into real products.",
      text: "I enjoy moving from an idea to a working product — combining software engineering, design awareness and practical automation to solve useful problems.",
    },
    imageUrl: "/images/profile-mono.webp",
    imageUrls: ["/images/profile-mono.webp"],
    paragraphs: [
      "My toolkit spans **TypeScript, JavaScript, Java, Python, Dart, Next.js, Node.js, Nest.js, Spring Boot, Flutter, Docker, PostgreSQL, Oracle, Prisma, AWS and CI/CD**.",
      "I build for **web development, mobile app development and DevOps delivery** — focusing on software that is clean, modern, scalable and useful in day-to-day business or product environments. I also use modern AI tools when they are useful for research, debugging, documentation and faster iteration.",
    ],
    curiosityValue: "∞",
    curiosityLabel: "Curiosity for building",
  },
  skills: {
    heading: {
      eyebrow: "Capabilities",
      title: "Skills that cover build, launch and scale.",
      text: "A clearer view of the technologies, frameworks and services I work with across web, mobile and DevOps.",
    },
    featured: ["Next.js", "Node.js", "Nest.js", "Spring Boot", "Flutter", "Docker", "AWS", "PostgreSQL", "TypeScript", "Java"],
    groups: [
      { id: "programming-languages", title: "Programming Languages", summary: "Languages I use to build practical applications across web, mobile and backend work.", icon: "code", items: ["TypeScript", "JavaScript", "Java", "Python", "Dart", "PHP", "C++", "C"] },
      { id: "web-development", title: "Web Development", summary: "Frontend and full-stack technologies for modern, responsive and scalable web products.", icon: "sparkles", items: ["Next.js", "Node.js", "Nest.js", "HTML", "CSS", "Tailwind CSS", "Responsive UI"] },
      { id: "backend-data", title: "Backend & Data", summary: "Backend frameworks, databases and APIs used for structured, reliable application delivery.", icon: "database", items: ["Spring Boot", "FastAPI", "PostgreSQL", "MySQL", "Oracle", "Firebase Firestore", "Prisma ORM", "REST APIs"] },
      { id: "mobile-development", title: "Mobile App Development", summary: "Cross-platform and Android-oriented mobile development for useful real-world products.", icon: "phone", items: ["Flutter", "Dart", "Java Android", "Firebase Auth", "Material Design", "MVVM", "Cross-platform Apps"] },
      { id: "devops-cloud", title: "DevOps & Cloud", summary: "Delivery-focused tooling that helps move projects from development into release and deployment.", icon: "cloud", items: ["AWS", "EC2", "S3", "AWS Amplify", "Docker", "Docker Compose", "GitLab CI/CD", "GitHub", "GitLab"] },
      { id: "tools-workflow", title: "Tools & Workflow", summary: "Day-to-day workflow strengths that improve collaboration, speed and product quality.", icon: "brain", items: ["Git", "UI Thinking", "Automation", "Problem Solving", "Team Collaboration"] },
    ],
    services: [
      { id: "web-development", title: "Web Development", text: "Modern responsive websites, dashboards and full-stack web apps using Next.js, Node.js, Nest.js and backend integrations.", icon: "code" },
      { id: "mobile-development", title: "Mobile App Development", text: "Cross-platform and Android-focused mobile application development with Flutter and practical product thinking.", icon: "phone" },
      { id: "devops-deployment", title: "DevOps & Deployment", text: "Dockerized workflows, cloud deployment, CI/CD pipelines and release support for web and mobile products.", icon: "cloud" },
    ],
  },
  projectsHeading: {
    eyebrow: "Selected work",
    title: "Projects that show the range.",
    text: "A selection of public repositories across mobile, automation, finance, healthcare, safety and productivity.",
  },
  projects: [
    { id: "auto-ledger", title: "Auto Ledger", category: "Full-Stack / GovTech", description: "A secure multi-role digital driving-licence, traffic-fine and penalty-points platform with two Flutter apps, a Next.js admin portal and a NestJS REST API deployed on AWS.", href: "https://github.com/vthish/Auto-Ledger", chips: ["5 Roles", "QR Verification", "AWS Deployment"], stack: ["Flutter", "Dart", "Next.js 16", "React 19", "NestJS 11", "TypeScript", "PostgreSQL", "Prisma ORM", "AWS", "Docker", "GitLab CI/CD"], icon: "database", imageUrl: "", imageUrls: [], videoUrl: "" },
    { id: "pulsaid-android", title: "PulseAid Android", category: "Android / Healthcare", description: "A real-time blood donation management app connecting donors, hospitals, blood banks and admins through role-specific dashboards, emergency alerts and Firebase-backed data syncing.", href: "https://github.com/vthish/PulseAid-Android", chips: ["Blood Donation", "Real-time", "Multi-role"], stack: ["Java", "Firebase Firestore", "Firebase Auth", "Material Design", "XML", "MVVM"], icon: "phone", imageUrl: "", imageUrls: [], videoUrl: "" },
    { id: "smart-expense-ai", title: "Smart Expense AI", category: "Mobile / FinTech / ML", description: "A Flutter expense tracker that understands natural-language entries, extracts amounts, predicts categories and supports a self-learning workflow through a FastAPI machine-learning backend.", href: "https://github.com/vthish/Smart-Expense-Categorizer", chips: ["NLP", "Self-learning", "Finance"], stack: ["Flutter", "Dart", "FastAPI", "Python", "Firebase Firestore", "Firebase Auth", "Scikit-learn", "Pandas", "Docker"], icon: "sparkles", imageUrl: "", imageUrls: [], videoUrl: "" },
    { id: "hvtm-care", title: "HVTM Care", category: "AI/ML / Healthcare", description: "A pharmaceutical inventory forecasting platform that combines classical ML, BiLSTM/GRU deep learning and ensemble methods to predict demand and identify shortage risk.", href: "https://github.com/vthish/HVTM_Care_AI-Driven_Drug_Forecasting_System", chips: ["Forecasting", "Deep Learning", "Healthcare"], stack: ["Python", "FastAPI", "TensorFlow/Keras", "Scikit-learn", "XGBoost", "Pandas/NumPy", "HTML/CSS/JS", "Joblib"], icon: "brain", imageUrl: "", imageUrls: [], videoUrl: "" },
    { id: "sentry-gas-app", title: "Sentry Gas App", category: "Safety / Application", description: "A safety-related application concept focused on gas monitoring, alert-oriented experiences and user-friendly interaction patterns.", href: "https://github.com/vthish/sentry-gas-app", chips: ["Safety", "App"], stack: ["Flutter", "Mobile", "Monitoring"], icon: "cloud", imageUrl: "", imageUrls: [], videoUrl: "" },
    { id: "synapse-ai-notes", title: "Synapse AI Notes", category: "Full-Stack / Productivity", description: "A secure note-taking web app with CRUD, search and subject filtering plus Hugging Face-powered summarization and assisted categorization, backed by Spring Boot and MySQL.", href: "https://github.com/vthish/Synapse-AI-Notes-Summarize-System", chips: ["Summarization", "Authentication", "Search"], stack: ["Java 17", "Spring Boot 3", "MySQL", "Spring Security", "Maven", "Tailwind CSS", "Vanilla JS", "Hugging Face API", "Spring Data JPA"], icon: "layers", imageUrl: "", imageUrls: [], videoUrl: "" },
    { id: "smart-file-automator", title: "Smart File Automator", category: "Automation / Productivity", description: "A file-automation project built to reduce repetitive manual work and improve how files are organized and processed.", href: "https://github.com/vthish/smart-file-automator", chips: ["Automation", "Files"], stack: ["Node.js", "Automation", "Utility"], icon: "code", imageUrl: "", imageUrls: [], videoUrl: "" },
  ],
  educationHeading: {
    eyebrow: "Education",
    title: "Foundation + continuous learning.",
    text: "Formal software engineering study supported by continuous project-based learning.",
  },
  education: [
    { id: "al", period: "2021 / 2022", title: "G.C.E. A/L", place: "Technology Stream", text: "Built the academic foundation that opened the path toward software engineering and product development.", icon: "graduation" },
    { id: "diploma", period: "NIBM · Galle", title: "Diploma in Software Engineering", place: "Software Engineering", text: "Strengthened practical software engineering fundamentals through structured study and hands-on project work.", icon: "certificate" },
    { id: "hnd", period: "NIBM · Galle", title: "Higher National Diploma in Software Engineering", place: "Advanced Software Engineering", text: "Expanded software engineering knowledge with higher-level study, applied development and continuous learning.", icon: "layers" },
  ],
  experienceHeading: {
    eyebrow: "Experience",
    title: "Experience built through real work.",
    text: "Professional roles, internships and practical experience across software delivery.",
  },
  experiences: [],
  certificatesHeading: {
    eyebrow: "Certificates",
    title: "Credentials earned along the way.",
    text: "Certifications and recognised learning milestones that support my engineering journey.",
  },
  certificates: [],
  photoBreak: {
    imageUrl: "/images/city.webp",
    imageUrls: ["/images/city.webp"],
    eyebrow: "THE NEXT BUILD",
    title: "Good software should feel\nsimple after the hard work.",
  },
  contact: {
    eyebrow: "Let’s work together",
    title: "Have a role, product or",
    accent: "wild idea?",
    text: "If you need help with web development, mobile app development or DevOps-related delivery, the fastest way to start a conversation is WhatsApp.",
    imageUrl: "/images/contact.webp",
    imageUrls: ["/images/contact.webp"],
    whatsappButton: "Start on WhatsApp",
    emailButton: "Email me",
  },
};

export function projectNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function itemNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

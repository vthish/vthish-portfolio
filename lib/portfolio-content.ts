export const PROJECT_ICON_KEYS = [
  "database",
  "phone",
  "sparkles",
  "brain",
  "cloud",
  "layers",
  "code",
] as const;

export type ProjectIconKey = (typeof PROJECT_ICON_KEYS)[number];

export type PortfolioProject = {
  id: string;
  title: string;
  category: string;
  description: string;
  href: string;
  chips: string[];
  stack: string[];
  icon: ProjectIconKey;
};

export type PortfolioContent = {
  cvUrl: string;
  projects: PortfolioProject[];
  updatedAt?: string;
};

export const DEFAULT_PORTFOLIO_CONTENT: PortfolioContent = {
  cvUrl: "https://drive.google.com/file/d/1Mi9rKwP5plZMO8qltgGDapabKt1fj0gu/view?usp=drivesdk",
  projects: [
    {
      id: "auto-ledger",
      title: "Auto Ledger",
      category: "Full-Stack / GovTech",
      description:
        "A secure multi-role digital driving-licence, traffic-fine and penalty-points platform with two Flutter apps, a Next.js admin portal and a NestJS REST API deployed on AWS.",
      href: "https://github.com/vthish/Auto-Ledger",
      chips: ["5 Roles", "QR Verification", "AWS Deployment"],
      stack: ["Flutter", "Dart", "Next.js 16", "React 19", "NestJS 11", "TypeScript", "PostgreSQL", "Prisma ORM", "AWS", "Docker", "GitLab CI/CD"],
      icon: "database",
    },
    {
      id: "pulsaid-android",
      title: "PulseAid Android",
      category: "Android / Healthcare",
      description:
        "A real-time blood donation management app connecting donors, hospitals, blood banks and admins through role-specific dashboards, emergency alerts and Firebase-backed data syncing.",
      href: "https://github.com/vthish/PulseAid-Android",
      chips: ["Blood Donation", "Real-time", "Multi-role"],
      stack: ["Java", "Firebase Firestore", "Firebase Auth", "Material Design", "XML", "MVVM"],
      icon: "phone",
    },
    {
      id: "smart-expense-ai",
      title: "Smart Expense AI",
      category: "Mobile / FinTech / ML",
      description:
        "A Flutter expense tracker that understands natural-language entries, extracts amounts, predicts categories and supports a self-learning workflow through a FastAPI machine-learning backend.",
      href: "https://github.com/vthish/Smart-Expense-Categorizer",
      chips: ["NLP", "Self-learning", "Finance"],
      stack: ["Flutter", "Dart", "FastAPI", "Python", "Firebase Firestore", "Firebase Auth", "Scikit-learn", "Pandas", "Docker"],
      icon: "sparkles",
    },
    {
      id: "hvtm-care",
      title: "HVTM Care",
      category: "AI/ML / Healthcare",
      description:
        "A pharmaceutical inventory forecasting platform that combines classical ML, BiLSTM/GRU deep learning and ensemble methods to predict demand and identify shortage risk.",
      href: "https://github.com/vthish/HVTM_Care_AI-Driven_Drug_Forecasting_System",
      chips: ["Forecasting", "Deep Learning", "Healthcare"],
      stack: ["Python", "FastAPI", "TensorFlow/Keras", "Scikit-learn", "XGBoost", "Pandas/NumPy", "HTML/CSS/JS", "Joblib"],
      icon: "brain",
    },
    {
      id: "sentry-gas-app",
      title: "Sentry Gas App",
      category: "Safety / Application",
      description:
        "A safety-related application concept focused on gas monitoring, alert-oriented experiences and user-friendly interaction patterns.",
      href: "https://github.com/vthish/sentry-gas-app",
      chips: ["Safety", "App"],
      stack: ["Flutter", "Mobile", "Monitoring"],
      icon: "cloud",
    },
    {
      id: "synapse-ai-notes",
      title: "Synapse AI Notes",
      category: "Full-Stack / Productivity",
      description:
        "A secure note-taking web app with CRUD, search and subject filtering plus Hugging Face-powered summarization and assisted categorization, backed by Spring Boot and MySQL.",
      href: "https://github.com/vthish/Synapse-AI-Notes-Summarize-System",
      chips: ["Summarization", "Authentication", "Search"],
      stack: ["Java 17", "Spring Boot 3", "MySQL", "Spring Security", "Maven", "Tailwind CSS", "Vanilla JS", "Hugging Face API", "Spring Data JPA"],
      icon: "layers",
    },
    {
      id: "smart-file-automator",
      title: "Smart File Automator",
      category: "Automation / Productivity",
      description:
        "A file-automation project built to reduce repetitive manual work and improve how files are organized and processed.",
      href: "https://github.com/vthish/smart-file-automator",
      chips: ["Automation", "Files"],
      stack: ["Node.js", "Automation", "Utility"],
      icon: "code",
    },
  ],
};

export function projectNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

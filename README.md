<div align="center">

# Venusha Thishan — Developer Portfolio

### Software Engineer · Full-Stack Developer · Mobile App Developer · DevOps

[![Portfolio](https://img.shields.io/badge/Live_Portfolio-vthish.dev-5B8CFF?style=for-the-badge&logo=googlechrome&logoColor=white)](https://vthish.dev)
[![GitHub](https://img.shields.io/badge/GitHub-vthish-181717?style=for-the-badge&logo=github)](https://github.com/vthish)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Venusha_Thishan-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/venusha-thishan)
[![GitLab](https://img.shields.io/badge/GitLab-vthish--dev-FC6D26?style=for-the-badge&logo=gitlab&logoColor=white)](https://gitlab.com/vthish-dev)

**Live:** [https://vthish.dev](https://vthish.dev)

A modern, animated and responsive personal portfolio built to showcase my software engineering work across **web development, mobile applications, backend systems and DevOps**.

</div>

---

## ✨ Overview

This portfolio is designed as more than a static profile page. It combines a premium dark interface, interactive animations, a connected-node background, project showcases, direct recruiter contact options and a built-in portfolio assistant.

The site is fully responsive and is deployed on **Netlify** with the custom domain **[vthish.dev](https://vthish.dev)**.

---

## 🚀 Features

- Modern blue / violet dark UI
- Animated connected-node background
- Responsive desktop, tablet and mobile design
- Animated hero section with rotating developer roles
- Detailed skills and technology sections
- Premium project showcase cards
- Project-specific technology stacks
- Education timeline
- GitHub, GitLab and LinkedIn integration
- Download / view CV action
- **Hire Me** button with direct WhatsApp contact
- Built-in portfolio chatbot / assistant
- Smooth animations and micro-interactions
- Accessibility support for reduced motion
- Custom domain with HTTPS
- Continuous deployment through GitHub + Netlify
- Private full-content CMS at `/admin/content`
- Project screenshot uploads with automatic fallback visuals
- Conditional Experience and Certificates sections managed from admin
- Netlify Blobs-backed content and media storage

---

## 🛠️ Portfolio Tech Stack

| Area | Technologies |
| --- | --- |
| Framework | Next.js |
| UI | React, TypeScript |
| Styling | Tailwind CSS |
| Animation | Motion for React |
| Images | Next.js Image Optimization |
| Deployment | Netlify |
| Domain | `vthish.dev` |
| Version Control | Git, GitHub |

---

## 💻 Skills Highlighted

### Languages
`TypeScript` · `JavaScript` · `Java` · `Python` · `Dart` · `PHP` · `C++` · `C`

### Web & Backend
`Next.js` · `Node.js` · `NestJS` · `Spring Boot` · `FastAPI` · `REST APIs` · `Prisma ORM`

### Mobile
`Flutter` · `Android Development` · `Java` · `Firebase`

### Databases
`PostgreSQL` · `MySQL` · `Oracle` · `Firebase Firestore`

### DevOps & Cloud
`Docker` · `Docker Compose` · `AWS` · `EC2` · `S3` · `AWS Amplify` · `GitLab CI/CD`

### Workflow
`Git` · `GitHub` · `GitLab` · `CI/CD` · `Automation` · `Problem Solving` · `Team Collaboration`

---

## 📂 Featured Projects

| Project | Description | Main Technologies |
| --- | --- | --- |
| [Auto Ledger](https://github.com/vthish/Auto-Ledger) | Digital driving licence, traffic fine and penalty-points management platform | Flutter, Dart, Next.js, React, NestJS, TypeScript, PostgreSQL, Prisma, AWS, Docker, GitLab CI/CD |
| [PulseAid Android](https://github.com/vthish/PulseAid-Android) | Blood donation management system connecting donors, hospitals and blood banks | Java, Firebase Firestore, Firebase Auth, Material Design, XML, MVVM |
| [Smart Expense Categorizer](https://github.com/vthish/Smart-Expense-Categorizer) | Intelligent expense tracker with natural-language categorization | Flutter, Dart, FastAPI, Python, Firebase, Scikit-learn, Pandas, Docker |
| [HVTM Care](https://github.com/vthish/HVTM_Care_AI-Driven_Drug_Forecasting_System) | Pharmaceutical inventory forecasting and shortage-risk platform | Python, FastAPI, TensorFlow, Keras, Scikit-learn, XGBoost, Pandas, NumPy |
| [Synapse AI Notes](https://github.com/vthish/Synapse-AI-Notes-Summarize-System) | Note-taking, summarization and categorization platform | Java 17, Spring Boot, MySQL, Spring Security, Maven, Tailwind CSS, JavaScript, Hugging Face API |
| [Sentry Gas App](https://github.com/vthish/sentry-gas-app) | Safety-focused gas monitoring application | Mobile Application · Monitoring · Safety |
| [Smart File Automator](https://github.com/vthish/smart-file-automator) | Utility project for reducing repetitive file-management work | Automation · File Processing · Productivity |

---

## 🤖 Portfolio Assistant

The portfolio includes a lightweight assistant that can answer questions about:

- My skills and technology stack
- Web development services
- Mobile application development
- Backend development
- DevOps and deployment
- Featured projects
- Education
- Email and WhatsApp contact information
- CV and availability

The current assistant is implemented locally in the frontend and can later be upgraded to a full API-powered conversational assistant.

---

## 📱 Services

I work on software projects across:

- **Web Development** — responsive websites, dashboards and full-stack applications
- **Backend Development** — APIs, authentication, databases and application services
- **Mobile App Development** — Flutter and Android applications
- **DevOps & Deployment** — Docker, CI/CD and cloud deployment workflows

I also use modern AI tools where useful for research, debugging, documentation and faster development iteration.

---

## ⚙️ Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/vthish/vthish-portfolio.git
cd vthish-portfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 4. Create a production build

```bash
npm run build
npm start
```

---

## 📊 Private Portfolio Analytics

The portfolio includes a private, password-protected analytics dashboard at:

```text
https://vthish.dev/admin/analytics
```

The public site does **not** display a view counter. Page views are written server-side to **Netlify Blobs**. The tracker stores a hashed browser identifier, page path, coarse device/browser type and Netlify country metadata. It does not store IP addresses. Detectable bots are ignored.

### Netlify environment variables

Add these values in **Netlify → Project configuration → Environment variables**:

```text
ANALYTICS_ADMIN_PASSWORD=<a long private password>
RESEND_API_KEY=<your Resend API key>
ANALYTICS_EMAIL_TO=devthish17@gmail.com
ANALYTICS_EMAIL_FROM=Portfolio Analytics <analytics@vthish.dev>
```

For the monthly email, verify `vthish.dev` as a sending domain in Resend and create the `RESEND_API_KEY`. Keep all secrets in Netlify environment variables; do not commit them.

### Monthly email report

`netlify/functions/analytics-monthly-email.mts` is a Netlify Scheduled Function. It runs on the **first day of each month at 00:05 UTC** and emails the previous month's page views, unique-browser count, top pages and top countries to `devthish17@gmail.com`.

You can test it after deployment from **Netlify → Functions → analytics-monthly-email → Run now**.

For local testing of Netlify Functions and Blobs, use Netlify Dev instead of plain `next dev` when you need the analytics backend.

---

## 🧩 Private Portfolio Content Manager

The private content manager is available at:

```text
https://vthish.dev/admin/content
```

It uses the same `ANALYTICS_ADMIN_PASSWORD` session as the analytics dashboard. Normal portfolio content can be updated without editing code: identity/contact details, CV, social links, hero, About, skills, services, projects, screenshots, education, experience, certificates, photo-break content and the contact section.

Projects can optionally use a real uploaded screenshot. When no screenshot is configured, the original developer-console project visual is kept. Experience and Certificates are empty by default and remain hidden on the public site until an admin item is added. Uploaded images are stored in Netlify Blobs. See `ADMIN-CONTENT-SETUP.md` for details.

---

## 🌐 Deployment

The portfolio is deployed with **Netlify** and connected to the `main` branch of this GitHub repository.

Every push to `main` can trigger a new production deployment.

```bash
git add .
git commit -m "update portfolio"
git push origin main
```

### Production URL

**[https://vthish.dev](https://vthish.dev)**

### Hosting

**Netlify**

### SSL / HTTPS

HTTPS is enabled for the custom `.dev` domain through Netlify's managed TLS certificate.

---

## 📁 Project Structure

```text
vthish-portfolio/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── Portfolio.tsx
├── public/
│   └── images/
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

## 📬 Contact

<div align="center">

[![Website](https://img.shields.io/badge/Website-vthish.dev-5B8CFF?style=for-the-badge&logo=googlechrome&logoColor=white)](https://vthish.dev)
[![Email](https://img.shields.io/badge/Email-devthish17%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:devthish17@gmail.com)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Contact_Me-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/94717135237)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/venusha-thishan)

</div>

---

## 👨‍💻 Developer

**Venusha Thishan**  
Software Engineer · Full-Stack Developer · Mobile App Developer · DevOps

📍 Galle, Sri Lanka  
🌐 [vthish.dev](https://vthish.dev)  
💻 [github.com/vthish](https://github.com/vthish)

---

<div align="center">

### Built with code, curiosity and continuous improvement.

⭐ If you like this portfolio, feel free to star the repository.

**© 2026 Venusha Thishan**

</div>

## Private portfolio content manager

This build also includes a private content manager at `https://vthish.dev/admin/content`. It uses the same `ANALYTICS_ADMIN_PASSWORD` as the analytics dashboard, so no additional environment variable is required.

The manager can update the CV URL and add, edit, delete or reorder portfolio projects. Saved content is stored in Netlify Blobs and is loaded by the public portfolio at runtime. See `ADMIN-CONTENT-SETUP.md` for details.


### Project media
Projects can be managed from the private CMS with up to 8 screenshots plus one optional short MP4/WebM demo video (4 MB maximum through the current Netlify Function upload path).

### CMS media + contact upgrades

The private portfolio CMS supports multi-image galleries across the main portfolio visuals, up to 12 project screenshots, universal project demo links (YouTube/Vimeo/Loom/Drive/TikTok and more, with a safe external fallback), and a public on-site email form powered by the existing Resend configuration.

## 2026 professional maintenance upgrades

This build keeps the existing public layout and animation system intact while adding maintenance/security/measurement features around it:

- local admin draft autosave and recovery
- JSON content backup/import with Netlify-media manifest
- project status, live-demo URL and optional Problem / Role / Solution / Outcome case-study fields
- hidden-until-used Recommendations/Testimonial CRUD
- project-specific `/projects/<id>` share pages with dynamic Open Graph/Twitter metadata
- JSON-LD Person/project/credential structured data, sitemap and robots metadata
- failed-login throttling in addition to the admin inactivity/hard-expiry lock
- analytics period filters, referrers and anonymous interaction events for CV/contact/project/social actions
- client-side WebP/downscale optimization for larger admin image uploads when supported

Optional fields/sections are conditional, so existing public content keeps its current visual presentation until those fields are populated in the admin.

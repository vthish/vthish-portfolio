# vthish-portfolio

A modern animated developer portfolio for Venusha Thishan, built with Next.js, React, TypeScript, Tailwind CSS and Motion.

## Included

- Blue / violet premium dark UI
- Animated constellation / network background inspired by a connected-node visual
- Hero with rotating developer roles
- Rich bento-style project cards for 7 GitHub repositories
- Expanded skills for TypeScript, JavaScript, Java, Python, Dart, Next.js, Node.js, Nest.js, Spring Boot, Flutter, Docker, AWS, databases and CI/CD
- Web development, mobile app development and DevOps service cards
- WhatsApp **Hire Me** CTA with a pre-filled recruiter message
- CV, GitHub, GitLab and LinkedIn links
- Rule-based portfolio assistant that can answer about services, skills, projects, education, phone number, email, CV and WhatsApp
- Responsive mobile/tablet/desktop layout
- Reduced-motion accessibility support

## Run in VS Code

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Build check

```bash
npm run typecheck
npm run build
```

## Push to your repo

If the remote is not configured yet:

```bash
git init
git add .
git commit -m "redesign portfolio"
git branch -M main
git remote add origin https://github.com/vthish/vthish-portfolio.git
git push -u origin main
```

If the remote already exists:

```bash
git remote set-url origin https://github.com/vthish/vthish-portfolio.git
git add .
git commit -m "redesign portfolio"
git push -u origin main
```

## WhatsApp behavior

The portfolio uses a `wa.me` deep link. When a recruiter clicks **Hire Me**, WhatsApp opens with a pre-filled message for Venusha. The recruiter still taps **Send**.

## Portfolio assistant

`components/Portfolio.tsx` currently contains a local rule-based assistant. It does not need an API key. Later, the `reply()` logic can be replaced with a real chatbot API while keeping the same UI.

# vthish-portfolio

A modern animated developer portfolio for Venusha Thishan, built with Next.js, React, TypeScript, Tailwind CSS and Motion.

## Included

- Animated premium dark UI / responsive layout
- Hero with rotating developer roles
- Project showcase for 7 GitHub repositories
- Skills and education sections
- WhatsApp "Hire Me" CTA with a pre-filled recruiter message
- CV link
- GitHub, GitLab and LinkedIn links
- Dummy portfolio chatbot (front-end only)
- Motion-based scroll, hover and reveal effects
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

If you are starting from this generated folder:

```bash
git init
git add .
git commit -m "build modern portfolio"
git branch -M main
git remote add origin https://github.com/vthish/vthish-portfolio.git
git push -u origin main
```

If the remote already exists:

```bash
git remote set-url origin https://github.com/vthish/vthish-portfolio.git
git add .
git commit -m "build modern portfolio"
git push -u origin main
```

## WhatsApp behavior

The current portfolio uses a `wa.me` deep link. A recruiter clicks **Hire Me**, WhatsApp opens with a pre-filled message, and the recruiter taps **Send**. A website cannot silently send a WhatsApp message from another person's account without an authenticated WhatsApp Business/Cloud API backend.

## Dummy chatbot

`components/Portfolio.tsx` contains a front-end demo chatbot with canned replies. Later, replace its reply function with an API route backed by your preferred model/provider.

## Project descriptions

The displayed descriptions are short portfolio-friendly summaries inferred from the public repository names. Replace them with exact README-derived descriptions whenever you want more technical detail.

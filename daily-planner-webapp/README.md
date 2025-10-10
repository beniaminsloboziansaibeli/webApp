# Daily Planner — Telegram WebApp (MVP)

This is a Vite + React + TypeScript Telegram WebApp MVP. It focuses on a dopamine-boosting daily planner UI with task management, quick add, simple goals, and Telegram WebApp integration.

Quick start

1. Install dependencies

```bash
npm install
```

2. Run dev server

```bash
npm run dev
```

3. Open the app in a browser (for Telegram testing use the Web App URL inside a bot). Vite dev server will show the local URL.

Notes
- The app auto-detects Telegram WebApp if present and will call expand/ready.
- Persistence is via localStorage (keys: dp_tasks_v1, dp_goals_v1).
- i18n: English and Romanian included. Language detection falls back to browser settings.

Deploy
- Build: `npm run build`
- Upload to a static host (Vercel, Netlify).

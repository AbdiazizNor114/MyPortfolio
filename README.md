# Abdiaziz Nor - Portfolio

Personal portfolio website for Abdiaziz Nor, System Developer & AI Enthusiast.

**Live site:** [aziz.smartdo.app](https://aziz.smartdo.app)

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Supabase (database, authentication, media storage)
- EmailJS (contact form)
- React Router v7

## Features

- Projects showcase
- Blog section (powered by Supabase)
- Contact form
- Admin panel for content management

## Getting Started

```bash
npm install
npm run dev
```

## Deployment

Deployed on Vercel at aziz.smartdo.app.

## Supabase configuration

Paste your Project URL and publishable key into `.env.local`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Restart the development server after changing these values. For Vercel, add the same two variables in the project environment settings and redeploy. Never use a secret or service-role key in these variables. See [Supabase setup](supabase/README.md) for database migrations and admin access.

## Portfolio assistant

The chat uses Groq’s `openai/gpt-oss-20b` model to classify questions about Abdiaziz.
It only returns answers from curated portfolio facts and published Supabase
projects; it never displays arbitrary model-written answers. Unrelated topics
receive a portfolio-only response. The model’s Free plan has usage limits.

Set `GROQ_API_KEY` in `.env.local` for local development, and as a server-only
Vercel environment variable for deployment. Never use a `VITE_` prefix for this
key. If the key is absent or Groq is unavailable, the chat uses local portfolio
answers and shows its fallback status. No paid OpenAI API is used.

`api/chat.js` serves the Vercel endpoint and the local server uses the same handler.
Inputs are bounded, calls time out, and a basic per-instance limit restricts chat
requests to 15 per IP per minute (this is not a global distributed rate limiter).
Run `node --test` for backend validation and scope tests.

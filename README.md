# Abdiaziz Nor - Portfolio

Personal portfolio website for Abdiaziz Nor, System Developer & AI Enthusiast.

**Live site:** [aziz.smidify.se](https://aziz.smidify.se)

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

Deployed on Vercel with a custom domain via smidify.se.

## Supabase configuration

Paste your Project URL and publishable key into `.env.local`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Restart the development server after changing these values. For Vercel, add the same two variables in the project environment settings and redeploy. Never use a secret or service-role key in these variables. See [Supabase setup](supabase/README.md) for database migrations and admin access.

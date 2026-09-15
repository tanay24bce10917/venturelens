# VentureLens

A frontend-only Next.js/Vercel demo for an AI-assisted entrepreneurship platform.

## What works without a backend

- Responsive landing page
- Interactive problem/opportunity scanner
- Category examples
- Heuristic "AI-style" analysis generated in the browser
- Opportunity scoring
- Market, risk/ethics and business tabs
- Save opportunity interaction
- Smooth navigation and polished responsive UI

The analysis is intentionally demo logic. It does not call an AI API yet, so there are no API keys or backend requirements.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

1. Upload this folder to a GitHub repository, or import the project folder into Vercel.
2. Vercel detects Next.js automatically.
3. Build command: `next build`
4. No environment variables are required.

## Later, if needed

Replace `analyzeProblem()` in `app/page.tsx` with a server/API call to an LLM and add Supabase for authentication and saved workspaces.

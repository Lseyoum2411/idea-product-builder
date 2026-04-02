# Product Buddy (`idea-product-builder`)

Next.js 14 app that turns a short product brief into a structured solo build plan (PRD, prompts, roadmap, tech stack, code snippets, checklist) via the Anthropic API.

## Prerequisites

- Node.js 20+
- An [Anthropic API key](https://console.anthropic.com/)

## Setup

```bash
cp .env.example .env.local
# Set ANTHROPIC_API_KEY in .env.local
npm install
```

## Scripts

| Command        | Purpose                          |
| -------------- | -------------------------------- |
| `npm run dev`  | Local dev at http://localhost:3000 |
| `npm run build`| Production build                 |
| `npm run start`| Run production build locally     |
| `npm run lint` | ESLint                           |
| `npm run verify` | Lint + production build (CI-style) |

## End-to-end checks (manual)

Run `npm run dev`, then repeat with **three different ideas** (change timeline/platform between runs):

1. **Tight timeline** — Timeline **1 week**, platform **web**. Confirm the checklist phases and hours feel small; roadmap is short.
2. **Medium** — **1 month**, **mobile**. Confirm tabs (PRD, prompts, roadmap, tech, code, checklist) all populate.
3. **Relaxed** — **3 months**, **hybrid**. Confirm scope is broader than the 1-week run.

On `/result`, confirm **Copy full plan**, section copies, and **Download** `.md` / `.csv` work. Refresh `/result` after a full page reload: data is kept in `sessionStorage` for that tab only.

### API-only smoke test (optional)

With `npm run dev` running and `.env.local` set:

```powershell
$body = @{
  productIdea = "A habit tracker for night-shift workers"
  timeline = "1-week"
  platform = "web"
  targetAudience = "Nurses and warehouse staff on rotating shifts"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/generate" -Method POST -Body $body -ContentType "application/json"
```

Expect JSON with `outputs` and `inputs`. A missing or invalid key returns `500` with a clear error message.

## Deploy on Vercel

1. Push this folder to a Git repository (GitHub, GitLab, or Bitbucket).
2. In [Vercel](https://vercel.com/new), import the repo and set the **Root Directory** to `idea-product-builder` if the repo contains other projects.
3. Under **Settings → Environment Variables**, add:
   - `ANTHROPIC_API_KEY` — your secret (Production and Preview as needed).
4. Deploy. No custom `vercel.json` is required for this App Router project.

After deploy, run the same manual E2E checks on the production URL.

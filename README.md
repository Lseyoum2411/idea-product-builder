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

## Push to GitHub (first time)

Signing into **Vercel** does not log in the **GitHub CLI** on your machine. The repo is already committed locally on `main`. Do this once in **PowerShell** (GitHub CLI was installed as `gh`):

If you see **`gh` is not recognized**, either **close and reopen** the terminal (so PATH reloads) or run this once in that window:

```powershell
$env:Path = "$env:ProgramFiles\GitHub CLI;$env:Path"
```

```powershell
cd C:\Users\lksey\idea-product-builder
gh auth login -h github.com -p https -w
```

Complete the browser/device flow, then either run the helper script:

```powershell
.\scripts\push-to-github.ps1
```

Or create the remote and push in one step:

```powershell
gh repo create idea-product-builder --public --source=. --remote=origin --push
```

The script also accepts a **classic PAT** for non-interactive use: set `$env:GITHUB_TOKEN` (with `repo` scope), then run `.\scripts\push-to-github.ps1`.

Use a different name with `gh repo create my-repo-name ...` if `idea-product-builder` is already taken on your account.

**Without `gh`:** create an empty repo at [github.com/new](https://github.com/new), then:

```powershell
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
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

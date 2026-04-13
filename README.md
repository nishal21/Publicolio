# Publicolio

Publicolio is a zero-config GitHub portfolio generator.
It lets you fetch a GitHub profile, select repositories, style the page with theme controls, and generate a shareable link.

![Animated Demo](demo.gif)

## What It Does

- Fetches profile and repo data from GitHub.
- Supports optional personal token input in builder mode for private/owner repos.
- Provides 6 visual themes.
- Provides editor controls for layout and styling.
- Generates shareable portfolio URLs with selected repositories and style options encoded in query params.
- Optionally shortens links through a Cloudflare Worker.
- Supports short link domain choice between workers.dev and custom domain.
- Caches builder state so returning users can continue editing after refresh.
- Supports `Update Link` flow to keep the same short URL when the backend supports slug updates.

## How It Works

Publicolio has two runtime modes.

1. Builder mode
- If no `user` and `theme` query params are present, the app renders the interactive builder UI.
- User enters GitHub username, picks repos, theme, and options, then clicks Deploy.

2. Renderer mode
- If `user` and `theme` query params exist, the app renders the final portfolio page directly.
- The renderer fetches live GitHub data and filters repos based on the `repos` query param.

### Data Flow

1. Builder calls `fetchDeveloperData(username, token?)`.
2. GitHub profile and repos are requested via proxy-aware fetch logic.
3. Builder generates a long URL from selected options.
4. Builder calls shortener endpoint (if configured).
5. `Deploy Portfolio` creates a new short link.
6. `Update Link` tries to preserve the same short code.
7. If backend does not support same-code updates, UI shows a clear message instead of silently replacing with another code.
8. If shortener fails, app falls back to the full long URL.

## Returning User Cache

Builder state is cached in `localStorage` so users can continue from where they left off.

Cached items:

- Username
- Selected theme
- Theme options
- Short-link domain mode
- Last generated short URL
- Per-user repository selections
- Cached profile snapshot for faster restore on refresh

Not cached:

- GitHub token (excluded for safety)

## Themes and Controls

Themes:
- Aurora
- Liquid Glass
- Bento Grid
- Minimalism
- Neubrutalism
- Terminal

Controls:
- Show Avatar
- Show Bio
- Show Stats
- Layout density: compact or comfortable
- Repository sort: featured, stars, name
- Card style: soft or sharp
- Text scale: sm, md, lg
- Accent color
- Short-link domain mode: auto, workers.dev, custom

## Stack

- React 19
- TypeScript
- Vite 8
- Tailwind CSS 4
- Lucide React icons

## Project Structure

- `src/App.tsx`: mode switch between builder and renderer.
- `src/components/LandingBuilder.tsx`: editor UI, fetch, selection, deploy flow.
- `src/components/PortfolioRenderer.tsx`: final portfolio page loader.
- `src/services/api.ts`: GitHub and shortener network logic.
- `src/components/themes/*`: theme implementations.

## Environment Variables

Create `.env` from `.env.example` and configure these values.

| Variable | Required | Description |
|---|---|---|
| `VITE_CORS_PROXY_URL` | Yes | Proxy endpoint prefix for GitHub calls. Expected format: `https://your-proxy.workers.dev/?url=` |
| `VITE_SHORTENER_URL` | Recommended | Primary shortener endpoint, usually `https://your-shortener.workers.dev/api/shorten` |
| `VITE_SHORTENER_API_URL` | Optional | Backward-compatible alias for shortener endpoint |
| `VITE_SHORTENER_WORKERS_DOMAIN` | Optional | Domain used when user selects `workers.dev` mode |
| `VITE_SHORTENER_CUSTOM_DOMAIN` | Optional | Domain used when user selects `custom` mode |

Notes:
- `VITE_SHORTENER_URL` and `VITE_SHORTENER_API_URL` are both supported.
- If shortener endpoint is missing or failing, deploy still returns a usable full URL.

## Cloudflare Worker Contracts

Reference implementations:

- Shortener worker gist: [https://gist.github.com/nishal21/ba187199cd00ea6623b6cf4407e3a48d](https://gist.github.com/nishal21/ba187199cd00ea6623b6cf4407e3a48d)
- CORS proxy repository: [https://github.com/nishal21/portfolio-cors-proxy](https://github.com/nishal21/portfolio-cors-proxy)

### CORS Proxy Worker

Expected request shape from frontend:

- `GET {VITE_CORS_PROXY_URL}{encodeURIComponent(targetUrl)}` where proxy base ends with `?url=`
- Optional request header from builder: `X-Custom-GitHub-Token`

Expected behavior:

- Returns `400` when `?url=` is missing.
- For GitHub API targets, forwards either:
  - user token from `X-Custom-GitHub-Token`, or
  - fallback token from worker secret `GITHUB_TOKEN`.
- Includes CORS headers that allow `X-Custom-GitHub-Token`.

### Shortener Worker

Expected endpoint:

- `POST /api/shorten`

Frontend payload sent:

```json
{
  "longUrl": "https://...",
  "url": "https://...",
  "shortCode": "existing-code-when-updating",
  "code": "existing-code-when-updating",
  "slug": "existing-code-when-updating"
}
```

Update-link behavior requirement:

- To support `Update Link` without creating a new URL, worker must reuse the provided code and overwrite existing KV value.
- If worker always generates random codes, frontend will show an explicit update-unsupported message.

Frontend accepts response fields:

- `shortUrl`
- `shortened_url`
- `short_url`
- `url`

Redirect behavior should be:

- `GET /:code` -> HTTP 302 to original long URL

KV requirement:

- Bind KV namespace as `URL_DB` in the shortener worker.

## Local Development

1. Install dependencies.

```bash
npm install
```

2. Create env file.

```bash
cp .env.example .env
```

PowerShell alternative:

```powershell
Copy-Item .env.example .env
```

3. Start dev server.

```bash
npm run dev
```

4. Build production bundle.

```bash
npm run build
```

5. Preview production bundle locally.

```bash
npm run preview
```

## Deployment

Publicolio is a static frontend and can be deployed to any static host.

Required for production:

1. Set all required VITE env vars in your hosting provider.
2. Ensure CORS proxy worker is deployed and reachable.
3. Ensure shortener worker is deployed and reachable.
4. Ensure custom short-link domain points to shortener worker if using custom mode.

## GitHub Auto Deploy (Included)

This repository now includes a GitHub Actions workflow:

- `.github/workflows/deploy-pages.yml`

Workflow behavior:

1. Runs on every push to `main`.
2. Installs dependencies and builds the Vite app.
3. Uploads `dist/` as a GitHub Pages artifact.
4. Deploys automatically to GitHub Pages.

Build-time environment values are read from repository variables:

- `VITE_CORS_PROXY_URL`
- `VITE_SHORTENER_URL`
- `VITE_SHORTENER_API_URL`
- `VITE_SHORTENER_WORKERS_DOMAIN`
- `VITE_SHORTENER_CUSTOM_DOMAIN`

Set these in:

- GitHub repo -> Settings -> Secrets and variables -> Actions
  - Preferred: Variables
  - Also supported: Secrets (same key names)

## Domain Setup (Template)

If your shortener uses one hostname, keep the main app on a different subdomain.

- Shortener domain (example): `short.example.com`
- Main app domain (example): `app.example.com`

### GitHub Pages Custom Domain Setup

1. In GitHub repo Settings -> Pages, set Source to `GitHub Actions`.
2. In Pages -> Custom domain, set `app.example.com`.
3. Enable `Enforce HTTPS` after DNS is verified.
4. In your DNS dashboard, add:
  - Type: `CNAME`
  - Name: `app`
  - Target: `username.github.io`
5. Keep `public/CNAME` in this repo as `app.example.com`.

Important:

- DNS target must be `nishal21.github.io` only (no `/Publicolio` path).
- Paths are not valid in CNAME targets.

### If You Keep Default GitHub URL

- Without custom domain, site URL is `https://nishal21.github.io/Publicolio/`.
- No DNS change is needed for this mode.
- With custom domain enabled, your primary URL becomes `https://app.example.com/`.

### GitHub Hosting Notes

- If hosted at root domain, generated long links work out of the box.
- If hosted under a subpath, verify generated links include your base path.
- A custom domain for the shortener can still be used independently.

## SEO and GEO Baseline (Included)

The project now ships with technical SEO and GEO essentials:

- `index.html` includes canonical, robots directives, Open Graph, Twitter tags, global geo tags, and JSON-LD structured data.
- `public/robots.txt` includes sitemap reference and explicit allowance for key AI crawlers.
- `public/sitemap.xml` includes your canonical homepage URL.
- `public/llms.txt` provides machine-readable guidance for LLM crawlers and AI search tools.
- `public/og-cover.png` provides social preview media for sharing (crawler-friendly image format).

This gives a strong global discoverability baseline for both classic search and AI answer engines.

## URL Parameters Used by Renderer

- `user`: GitHub username
- `theme`: theme key
- `repos`: comma-separated repo names
- `stats`: `1` or `0`
- `avatar`: `1` or `0`
- `bio`: `1` or `0`
- `accent`: hex without `#`
- `layout`: `compact` or `comfortable`
- `sort`: `featured`, `stars`, or `name`
- `card`: `soft` or `sharp`
- `text`: `sm`, `md`, or `lg`

## Troubleshooting

`Deploy failed` or no short link:

1. Check shortener endpoint URL in env.
2. Check worker route includes `/api/shorten`.
3. Check worker accepts `longUrl` payload.
4. Check browser network tab for CORS/400/500 responses.
5. If shortener fails, copy and use the full fallback URL shown by the app.

`Update Link` does not keep same short URL:

1. Ensure worker accepts `shortCode` / `code` / `slug` fields.
2. Ensure worker overwrites existing KV mapping for that code.
3. Ensure worker redirect path returns `302 Location: <updated-long-url>`.
4. If you still see update-unsupported message, backend is returning a different code.

GitHub fetch issues:

1. Verify `VITE_CORS_PROXY_URL` is valid.
2. Verify proxy worker forwards GitHub API status and body.
3. For private repos, provide a valid personal token in builder UI.

## 🧑‍💻 Author
Created by **Nishal K** (Malappuram, Kerala).

- GitHub: [@nishal21](https://github.com/nishal21)
- Instagram: [@demonking.___](https://instagram.com/demonking.___)

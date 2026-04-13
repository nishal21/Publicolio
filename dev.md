# Portfolio Builder - Dev Progress

## Project Overview
Publicolio is a high-end, editorial-grade portfolio generator for developers. It converts GitHub profiles into stunning, responsive single-page applications with zero configuration.

## Roadmap & Progress

### ✅ Phase 1: Foundation (Completed)
- [x] Technical Discovery & Socratic Gate
- [x] Infrastructure Setup (Vite + React + Tailwind v4 + Lucide)
- [x] GitHub API Integration with CORS proxy
- [x] Global Reset & Design Tokens (index.css)

### ✅ Phase 2: Core Components (Completed)
- [x] Theme Barrel Export System
- [x] Base Theme Props and Types
- [x] Initial Theme Set: Liquid Glass, Bento Grid, Minimalism, Neubrutalism

### ✅ Phase 3: Builder Interface (Completed)
- [x] Fixed 360px Sidebar with real-time preview
- [x] Repository search and filtering
- [x] Multi-repo selection (All/None toggles)
- [x] Short URL generation & Deployment pipeline

### ✅ Phase 4: Premium Redesign & Editor Controls (Completed)
- [x] **Theme Options Schema**: Added `ThemeOptions` for Stats, Avatar, Color, and Layout.
- [x] **LandingBuilder Redesign**: Premium editor controls integrated into the sidebar.
- [x] **Theme Overhaul**: All themes upgraded to support option-driven, premium layouts.
- [x] **Interactive Preview**: Real-time feedback wired for all editor options.

## Change Log

### 2026-04-13 — Open Source Docs: License + Contributing
- Added `LICENSE` with MIT license text (`Nishal K and contributors`).
- Added `CONTRIBUTING.md` with setup, quality checks, branch/PR guidance, and issue reporting template.
- Updated `package.json` with `"license": "MIT"` metadata.

### 2026-04-13 — README Updated For Cache + Update Link Behavior
- Documented returning-user builder cache behavior (restored profile snapshot, selections, and generated short URL).
- Documented `Update Link` flow and shortener backend requirement to preserve same code (`shortCode`/`code`/`slug`).
- Added troubleshooting guidance for update-link cases where backend still returns a different slug.
- Corrected DNS custom-domain target example to host-only (`username.github.io`).

### 2026-04-13 — Same-Link Update Flow With Backend Capability Check
- Updated deploy service to support `preserveSlug` mode when user clicks `Update Link`.
- Frontend now sends existing short code hints (`shortCode`, `code`, `slug`) to shortener worker during update.
- Added explicit guard: if backend returns a different slug, UI now shows a clear error instead of silently generating a new link.
- `Deploy Portfolio` still creates new links as normal; `Update Link` now enforces same-link behavior.

### 2026-04-13 — Returning User Builder Cache
- Added local cache for builder preferences in `localStorage` (`username`, selected theme, theme options, short-link domain mode).
- Added persistence for last generated `shortUrl` so returning users can continue with the same link flow after refresh.
- Added cached profile snapshot restoration so returning users see repos/themes/link panel immediately after reload (not just username).
- Added per-user repository selection memory and restore logic so previous repo picks are kept when data is fetched again.
- Cache intentionally excludes GitHub token for safety.

### 2026-04-13 — Added Update Link Action In Deployed State
- Added an `Update Link` button to the deployed-link panel so users can regenerate a link after editing theme/repo settings without clicking reset first.
- Kept `Reset` as a secondary action and improved deployed-state controls for faster iteration.
- Update action reuses existing deploy flow and auto-copy behavior.

### 2026-04-13 — Social Link Preview Image Fix
- Added a crawler-friendly Open Graph image at `public/og-cover.png` with `1200x630` dimensions.
- Updated `index.html` social metadata to use PNG (`og:image` and `twitter:image`) instead of SVG for better platform compatibility.
- Added explicit OG image metadata (`og:image:type`, width, height, alt, secure_url) to improve preview detection.

### 2026-04-13 — Auto Copy URL On Deploy
- Updated builder deploy flow so the generated portfolio URL is copied to clipboard automatically after clicking `Deploy Portfolio`.
- Added success alert message: `Link copied` immediately after successful copy.
- Wired the existing manual copy button to the same clipboard helper and added a fallback path for environments without Clipboard API support.

### 2026-04-13 — GitHub Pages Env Injection Fix (Variables or Secrets)
- Diagnosed live fetch failure on `app.publicolio.qzz.io`: deployed bundle was missing `VITE_CORS_PROXY_URL`, causing GitHub profile fetch to fail in production.
- Updated `.github/workflows/deploy-pages.yml` to read VITE values from either Actions Variables or Secrets.
- Added workflow guard step to fail fast when `VITE_CORS_PROXY_URL` is empty, preventing silent broken deployments.
- Updated README deployment notes to mention both Variables and Secrets are supported.

### 2026-04-13 — GitHub Repository Initialized and Pushed
- Initialized local git repository with `main` branch and pushed project to `https://github.com/nishal21/Publicolio.git`.
- Added `.env` and `.env.*` to `.gitignore`, kept `.env.example` tracked, and removed local `.env` from version control before push.
- Confirmed branch tracking is set (`origin/main`) and working tree is clean after push.

### 2026-04-13 — README Domain Instructions Generalized
- Replaced personal domain examples in README with template domains (`app.example.com` and `short.example.com`).
- Clarified DNS target for GitHub Pages custom domain must be `nishal21.github.io` (no `/Publicolio` path).
- Added explicit fallback guidance for default project URL: `https://nishal21.github.io/Publicolio/`.

### 2026-04-13 — Worker Source Links Added To README
- Added direct links to the live worker sources in README:
	- Shortener gist: `nishal21/ba187199cd00ea6623b6cf4407e3a48d`
	- CORS proxy repo: `nishal21/portfolio-cors-proxy`
- Updated worker contract notes to match real behavior (`?url=` requirement, custom token header, `URL_DB` KV binding).

### 2026-04-13 — README Overhaul (How It Works + Deploy Guide)
- Replaced default Vite template README with a complete Publicolio project README.
- Added architecture and runtime flow explanation for builder mode vs renderer mode.
- Added full setup steps, environment variable documentation, and Cloudflare worker contracts.
- Added deployment guidance for static hosts and GitHub hosting notes.
- Added troubleshooting section for shortener and GitHub fetch issues.

### 2026-04-13 — Shortener 400 Payload Contract Fix
- Fixed shortener POST payload mismatch causing `400 Missing longUrl` against Cloudflare Worker `/api/shorten`.
- Updated frontend shortener request body to send both `longUrl` and `url` keys for compatibility across worker versions.
- This preserves current fail-safe behavior: if shortener still fails, deployment falls back to full portfolio URL.

### 2026-04-13 — Deploy Fail-safe When Shortener Is Down
- Fixed deploy flow so shortener request failures no longer block portfolio deployment.
- Updated `generateShortUrl` to fall back to the original full portfolio URL when the shortener endpoint errors, times out, or fails CORS.
- Cleared stale builder error state at deploy start to prevent outdated shortener errors from lingering in the UI.

### 2026-04-12 — Short Link Domain Selector (workers.dev vs custom)
- Added a new builder control to choose short-link domain mode: `Auto`, `workers.dev`, or `Custom`.
- Added support for `VITE_SHORTENER_WORKERS_DOMAIN` and `VITE_SHORTENER_CUSTOM_DOMAIN` so users can explicitly choose which hostname appears in generated short links.
- Updated `generateShortUrl` to optionally rewrite the returned short URL hostname while preserving path/slug.
- Added `VITE_SHORTENER_URL` to local `.env` and expanded `.env.example` for GitHub hosting configuration.

### 2026-04-12 — Shortener Env Compatibility Fix
- Fixed short URL generation config mismatch by supporting both `VITE_SHORTENER_URL` and `VITE_SHORTENER_API_URL` in `generateShortUrl`.
- Updated deploy error messaging in the builder to reference both supported variable names.
- Updated `.env.example` to include the canonical `VITE_SHORTENER_URL` entry while keeping backward compatibility.

### 2026-04-12 — Aurora Preview Scroll Reset Fix
- Fixed builder preview state where clicking Fetch could keep the preview pane at a stale scroll position, making Aurora appear cut off with a large empty area.
- Added a preview scroll container ref in `LandingBuilder` and forced scroll-to-top on fetch start/success and on theme switch.
- Verified `LandingBuilder.tsx` has no TypeScript errors after the change.

### 2026-04-12 — GitHub Token Endpoint Switch Fix
- Updated `fetchDeveloperData` to switch repo endpoint dynamically:
	- With token: `GET /user/repos?type=owner&sort=updated&per_page=100`
	- Without token: `GET /users/{username}/repos?sort=updated&per_page=100`
- Forced GitHub API calls through the CORS proxy so the worker token (`env.GITHUB_TOKEN`) is consistently applied when no custom token is provided.
- Kept custom token usage builder-only and excluded from deploy URLs.
- Resolved editor diagnostics by switching `LandingBuilder` to direct theme imports.

### 2026-04-12 — Frontend Repo Truncation Fix
- Removed builder-side hard limit that auto-selected only the first 8 repos after fetch.
- Simplified `api.ts` repo mapping to use raw GitHub repo API results directly (no smart-pool dedupe merge side effects).
- Verified no fork exclusion and no hardcoded repo slicing remains in frontend fetch/render flow.

### 2026-04-12 — Sidebar Repo Picker Accessibility Fix
- Made editor controls collapsible so the repository picker remains reachable on shorter viewport heights.
- Stabilized repo selector layout by removing collapsing flex constraints and giving the repo list an explicit scrollable max height.

### 2026-04-12 — Liquid Glass Content Cleanup
- Removed static marketing copy from Liquid Glass hero (`Liquid Lens Mode` and scrolling `frosted pane / bevel edge / specular highlights / liquid lens` text).
- Replaced that section with fetched-user data chips (top languages and repository names) so the theme reflects live profile data.

### 2026-04-12 — Aurora Full Rebuild
- Rebuilt Aurora theme from scratch with a distinct visual language (matte aurora-poster style), avoiding Liquid Glass lookalike styling.
- Added new structure: atmospheric hero, language chip rail, optional avatar insight block, stat rail, and `Aurora Atlas` project cards.
- Preserved all editor controls (`showStats`, `showAvatar`, `showBio`, `layout`, `repoSort`, `cardStyle`, `textScale`, `accentColor`).
- Resolved lingering editor diagnostics by switching `LandingBuilder` theme imports to explicit `.tsx` paths.
- Fixed sidebar disappearance by changing Aurora background layers from viewport-fixed to container-scoped absolute positioning.

### 2026-04-12 — UI Bugfix Sweep
- Fixed Aurora hero heading rendering issue that produced a full-width gradient block instead of readable name text.
- Improved sidebar repo panel scrolling with explicit flex shrink boundaries and contained vertical overflow behavior.

### 2026-04-12 — Full Builder + Theme Redesign Pass
- Rebuilt all 6 themes with top-first composition and tighter vertical rhythm to remove large empty zones.
- Added useful editor controls: Avatar/Bio/Stats toggles, Layout density, Repo sort, Card style, Text scale, and Accent color.
- Wired editor state to live preview and deployment links so shared portfolios preserve chosen settings.
- Extended deployed portfolio renderer to parse and apply editor options from URL query params.
- Cleaned CSS and module import warnings; verified production build passes.

### 2026-04-12 — The "Pure Visuals" Overhaul
- **Liquid Glass**: Redesigned with spinning conic avatar rings, deep ambient orbs, and glassmorphism cards.
- **Bento Grid**: Upgraded with frosted stat boxes and language chip tracks.
- **Minimalism**: Converted to a massive magazine-style layout with brutalist shadows.
- **Neubrutalism**: Added rainbow accent bars and watermark index numbers.
- **Terminal**: Created a high-fidelity "hacker" theme with mac-styled window chrome.
- **Aurora**: Introduced animated gradient typography and glowing avatar orbs.

### 2026-04-12 — Functional Enhancements
- Fixed OXC transform errors in LiquidGlass.
- Increased repo fetch limit to 30.
- Implemented real-time repo search in the builder sidebar.
- Added All / None repo selection logic.

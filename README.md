# Rupinder Kaur — Portfolio

Personal site for an Ottawa-based Software Engineer in Test. Built with **Next.js 14** (App Router), deployed on **Vercel**.
No UI or animation libraries: motion is CSS-first with one small client component.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

## Quality gate

Every pull request runs [`.github/workflows/quality-gate.yml`](.github/workflows/quality-gate.yml):

| Command | What it proves |
| --- | --- |
| `npm run test:static` | Structure, SEO assets, reduced-motion and no-JS safety rules, no unverified statistics |
| `npm run build` | Production build succeeds (including the generated PNG social preview) |
| `npm run test:e2e` | Playwright on desktop + mobile: no console errors or 404s, navigation and scrollspy, mobile menu, theme persistence, copy-email, JS-disabled and reduced-motion rendering, axe WCAG 2.1 AA scans in light and dark |

Run the browser tests locally after a build:

```bash
npm run build
npx playwright install chromium   # or: CHROME_PATH=/path/to/chrome npm run test:e2e
npm run test:e2e
```

## Where things live

- `data/content.js` — all copy. Edit facts here, not in JSX. No numbers or claims without evidence.
- `app/page.js` — page structure.
- `app/globals.css` — design tokens (top of file), layout, then the motion layer at the bottom.
- `components/Motion.js` — scroll reveal, scrollspy, progress bar, timeline fill, mobile-menu behaviour.
- `components/ProjectDiagram.js` — the animated SVG diagram for each case study.
- `app/opengraph-image.js` / `app/icon.svg` — link-preview image and favicon.

## Motion principles

1. Every animation explains something (a test run, parity checks, a pipeline, a load curve) or orients the reader (progress, active section).
2. Content is never hidden unless JavaScript is running to reveal it.
3. `prefers-reduced-motion` collapses everything to its final state.

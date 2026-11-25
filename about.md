# Cordelli Realty — Website Architecture & Documentation

## Overview
Cordelli Realty (`https://cordellirealty.com`) is a Connecticut commercial and residential real estate brokerage founded and owned by licensed broker **Jake Cordelli** (`REB.0793614`, established 2021, headquartered at `282 Main Street, Wethersfield, CT`).

The site combines a low-observable **Lockheed SR-71 Blackbird** structural language with private-client luxury materiality — deeper obsidian black (`#030304`) and warm carbon titanium (`#08080A`, `#0E0E10`) surfaces, angular chine-cut chamfers, ultra-fine warm titanium hairlines, sculptural editorial display typography (`Cormorant Garamond`, `Inter`, `JetBrains Mono`), brushed champagne gold (`#C4A775`) accents, and gallery-matted offering-memorandum photography — tailored for discreet commercial investment sales, off-market dispositions, and multifamily representation across Connecticut.

## Deployment & Architecture
The repository remains **100% compatible with zero-build GitHub Pages deployment** from the repository root (`CNAME` = `www.cordellirealty.com`, entry point `index.html`) while also providing a zero-dependency hardened Node HTTP server (`server.mjs`) for local verification and full-stack deployments.

### File Structure
- `index.html` — Semantic HTML5 entry document with strict Content Security Policy (`<meta http-equiv="Content-Security-Policy">`), Open Graph / Twitter metadata, `RealEstateAgent` JSON-LD structured data, and custom SR-71 delta-chine schematic SVG backdrop.
- `assets/styles.css` — Modular SR-71 Blackbird design system with responsive breakpoints (desktop, tablet, mobile), WCAG AA+ dark-mode contrast, `:focus-visible` keyboard indicators, and `prefers-reduced-motion` support.
- `assets/data.js` — Authentic Cordelli Realty data module grounded directly in live `cordellirealty.com` records: firm credentials, featured executions (`6448 Main Street, Trumbull` $1.8M off-market commercial healthcare sale, `19-29 Chestnut Street, Willimantic` $1.2M 11-unit compound, active Greater New Haven multifamily portfolio), full transaction & leasing ledger, leadership credentials, and verbatim Google/Zillow client reviews.
- `assets/validation.js` — Shared client-side and server-side inquiry payload validator, control-character sanitizer, enum allowlist checker, and honeypot spam detector.
- `assets/app.js` — Strictly typed (`// @ts-check`) ES module powering dynamic telemetry aggregation, hero tactical execution switcher, filterable deal ledger, interactive Asset Dossier `<dialog>` modal, verified client reviews carousel, mobile navigation drawer, and the Confidential Inquiry Desk form (submitting to `POST /api/inquiry` with automatic static-host `mailto:` + copyable brief fallback on GitHub Pages).
- `assets/media/*.webp` — Web-optimized WebP derivatives of verified property photography and Jake Cordelli's portrait (originating from existing repository assets in `Property Photos/` and `me55.png`, preserved untouched).
- `server.mjs` — Zero-dependency Node HTTP server enforcing security headers, static path-traversal protection, hidden/config file blocking, `GET /api/health`, and `POST /api/inquiry`.
- `_headers` — Static edge security headers manifest (Cloudflare Pages / Netlify compatible).
- `scripts/validate.mjs` — Automated syntax, lint, security, asset-integrity, and HTTP/API integration verification suite.
- `package.json` — Standard npm scripts (`start`, `dev`, `lint`, `typecheck`, `build`, `test`) with zero external runtime dependencies.

## Database Schema & API Contract
This brokerage website is intentionally stateless with no relational database required. All verified property records, credentials, and reviews are stored version-controlled in `assets/data.js`.

### API Endpoints (Node runtime via `server.mjs`)
- `GET /api/health` — Returns `{ ok: true, service: "cordellirealty", timestamp }` (`200 OK`).
- `POST /api/inquiry` — Accepts `application/json` (max 16 KB, per-IP rate limited to 10 requests per 15 minutes):
  - Required fields: `fullName` (2–100 chars), `email` (valid email, max 160 chars), `mandateType` (allowlist), `assetClass` (allowlist), `brief` (15–2000 chars).
  - Optional fields: `phone` (validated pattern), `market` (max 100 chars), `valueBand` (allowlist, defaults to `"Undisclosed"`), `requestNda` (boolean), `assetReference` (max 140 chars).
  - Honeypot field: `companyWebsite` (must remain empty; populated values return silent `200` without processing).
  - Success response: `200 OK` `{ ok: true, referenceId: "CR-YYYY-XXXXXX", receivedAt, recipient: "Jake@CordelliRealty.com" }`.
  - Error responses: `400` field errors, `413` payload too large, `415` unsupported media type, `429` rate limited.

## Security & Production Readiness Controls
- **Content Security Policy**: Strict `script-src 'self'` with zero `unsafe-inline` or `unsafe-eval`, zero inline JS event handlers, and `frame-ancestors 'none'` on HTTP responses.
- **Security Headers**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Resource-Policy: same-origin`.
- **XSS Prevention**: All dynamically rendered strings pass through `escapeHtml()`, and external listing URLs are verified via `isSafeHttpUrl()` (`http:`/`https:` only) with `rel="noopener noreferrer"`.
- **Input Validation & Abuse Controls**: Shared validation schema in `assets/validation.js`, bounded request body reading (16 KB cap), sliding-window per-IP rate limiting, and honeypot spam trap.
- **Static Serving Hardening**: Path containment via `path.resolve`, explicit denylist for server/config/dotfiles, and zero debug `console.*` statements in production code.

## Verification Commands
```bash
npm run typecheck
npm run lint
npm run build
npm start
```

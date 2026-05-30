# DepositLetter

A stateless, client-side React utility that generates professional security deposit deduction letters for self-managing landlords.

**Live:** [depositletter.com](https://depositletter.com/)

---

## The Problem

Mishandling security deposits is the #1 way landlords lose small claims disputes. Itemizing damages correctly, doing the math accurately, and presenting it professionally is stressful — especially on a deadline. Existing solutions are either heavy property-management SaaS platforms (overkill for small landlords) or unformatted Word templates (no calculation, no structure).

## The Solution

DepositLetter is a 1-page web app built for speed and trust. It provides dynamic deduction itemization, live balance math, and an instant print-to-PDF flow — with no user accounts, no data storage, and no backend.

---

## Architecture

This project is intentionally constrained to a zero-backend model.

| Concern | Decision |
|---|---|
| Framework | React 19 + Vite |
| State | 100% local React state — no database, no sessions |
| PDF export | `@media print` CSS + `window.print()` — no PDF library |
| Analytics | PostHog (manual events only, no autocapture) |
| Lead capture | Formspree (no backend required) |
| Persistence | None by design — all data stays in-browser |
| Hosting | Vercel (static build + security headers via `vercel.json`) |

### Why no PDF library?

`@react-pdf/renderer` and `jspdf` both add significant bundle weight and require server-side infrastructure for reliable cross-browser output. The browser's native print engine is more consistent, zero-dependency, and produces system-native PDFs that respect the user's OS print settings.

---

## Project Structure

```
src/
├── components/
│   ├── FormPanel.jsx       # Input form, deduction repeater, validation UI
│   ├── LetterPreview.jsx   # Reactive letter surface, renders from form state
│   ├── LeadModal.jsx       # Post-print email capture modal (Formspree)
│   └── SeoContent.jsx      # Below-fold educational content for SEO
├── utils/
│   └── helpers.js          # parseNum, formatCurrency, formatDate, makeId, validateData
├── App.jsx                 # App shell, useDepositLetterState hook, layout
├── App.css                 # All styles including @media print overrides
└── main.jsx                # Vite entry, PostHog init
public/
├── privacy.html            # Standalone privacy policy
├── robots.txt
└── sitemap.xml
vercel.json                 # CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy
```

---

## Getting Started

```bash
npm install
npm run dev
```

### Configuration

Both integrations are optional — the app degrades gracefully when their env vars are absent (analytics no-ops, email modal hides). Set them in a local `.env.local` file (gitignored) or your hosting provider's environment settings.

```env
VITE_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_POSTHOG_HOST=https://us.i.posthog.com   # optional, defaults to US cloud
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/xxxxxxxx
```

- PostHog: get a project key at [app.posthog.com](https://app.posthog.com).
- Formspree: create a free form at [formspree.io](https://formspree.io).

These keys are `VITE_*` prefixed because they ship in the browser bundle — both providers issue them as public-by-design client keys. No server-side secrets exist in this project.

---

## Analytics Events

| Event | Trigger |
|---|---|
| `form_started` | First input focus (fires once per session) |
| `validation_failed` | Print clicked with incomplete/invalid form |
| `pdf_download_clicked` | Successful print trigger, includes deduction count and balance |
| `form_reset` | Reset button clicked |

---

## Security & Privacy

- **No backend, no database** — letter contents never leave the browser. Only an opt-in email (Formspree) and aggregate analytics events (PostHog) are transmitted.
- **Security headers** are applied at the edge via [`vercel.json`](./vercel.json): strict CSP, HSTS preload, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, restrictive `Permissions-Policy`.
- **Spam protection** on both email forms via honeypot fields plus Formspree's per-endpoint rate limiting.
- **Privacy policy** lives at [/privacy.html](./public/privacy.html) and discloses both vendors and the data-deletion contact.

---

## Deployment

This is a static Vite build — deploy anywhere that serves static files:

```bash
npm run build
# Deploy the dist/ folder
```

Vercel is recommended because [`vercel.json`](./vercel.json) ships security headers as part of the deploy. On other hosts (Cloudflare Pages, Netlify, S3+CloudFront), translate those headers to the equivalent host config.

---

## Disclaimer

This repository contains software for formatting documents. It does not provide legal advice, guarantee state-specific compliance, or determine whether any deduction is legally permitted. Landlords are responsible for understanding and complying with their state and local laws.

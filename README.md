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
| Framework | React + Vite |
| State | 100% local React state — no database, no sessions |
| PDF export | `@media print` CSS + `window.print()` — no PDF library |
| Analytics | PostHog (manual events only, no autocapture) |
| Lead capture | Formspree (no backend required) |
| Persistence | None by design — all data stays in-browser |

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
```

---

## Getting Started

```bash
npm install
npm run dev
```

### Configuration

Before deploying, replace the two placeholder values:

**PostHog** (`src/main.jsx`):
```js
posthog.init('YOUR_POSTHOG_PROJECT_API_KEY', { ... })
```
Get your key at [app.posthog.com](https://app.posthog.com).

**Formspree** (`src/components/LeadModal.jsx`):
```js
await fetch('https://formspree.io/f/YOUR_ENDPOINT_HERE', { ... })
```
Create a free form at [formspree.io](https://formspree.io).

---

## Analytics Events

| Event | Trigger |
|---|---|
| `form_started` | First input focus (fires once per session) |
| `validation_failed` | Print clicked with incomplete/invalid form |
| `pdf_download_clicked` | Successful print trigger, includes deduction count and balance |
| `form_reset` | Reset button clicked |

---

## Deployment

This is a static Vite build — deploy anywhere that serves static files:

```bash
npm run build
# Deploy the dist/ folder
```

Recommended: [Vercel](https://vercel.com) or [Cloudflare Pages](https://pages.cloudflare.com) — both have free tiers and zero-config Vite support.

---

## Disclaimer

This repository contains software for formatting documents. It does not provide legal advice, guarantee state-specific compliance, or determine whether any deduction is legally permitted. Landlords are responsible for understanding and complying with their state and local laws.

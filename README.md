# GeniriFlow — Landing Page

A premium, dark-futuristic landing page for **GeniriFlow** — a technology studio
that designs and builds **smart business systems & custom software** (with AI,
automation, CRM, WhatsApp flows and dashboards as part of the solution). The
promise is order, control, efficiency and growth — turning scattered, manual
operations into one organized, growth-ready operating system.

**Fully bilingual** — English (default, LTR) + Hebrew (RTL) — with a global
language switcher in the navbar that flips copy *and* layout direction across the
whole site.

The hero is an **Apple-style, scroll-controlled cinematic reveal**: a 240-frame
image sequence (`public/frames/geniriflow-reveal/`) painted to a `<canvas>` and
driven entirely by scroll progress, with the headline + CTAs pinned and readable
over a directional gradient. No Three.js, no video playback.

### Page structure

`Hero → Problem → Transformation → What We Build → Example Business Flow →
Why GeniriFlow (founder) → Process → Smart Business Audit CTA → Final CTA (lead
form) → Footer`

---

## Tech stack

| Concern    | Choice |
| ---------- | ------ |
| Framework  | **Next.js 14** (App Router) |
| Language   | **TypeScript** (strict) |
| Styling    | **Tailwind CSS 3.4** (custom design tokens, RTL-aware) |
| Animation  | **Framer Motion 11** (scroll reveals, staggers, transitions) |
| Hero       | **HTML Canvas** scroll-driven frame sequence (`ScrollFrameSequence`) — no 3D, no video |
| Fonts      | **Heebo** (body) + **Rubik** (display) via `next/font` — both cover Hebrew + Latin |
| Images     | `next/image` (brand logo + poster) |

> GSAP / Three.js were not needed — Framer Motion + a plain canvas cover everything.

---

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
# production:
npm run build && npm run start

npm run lint         # eslint
npm run typecheck    # tsc --noEmit
```

Requires Node 18.17+ (tested on Node 22).

---

## Bilingual (i18n) & RTL

- **All copy lives in `src/lib/content.ts`** as `CONTENT.en` / `CONTENT.he` —
  one bilingual file, the single source of truth.
- `src/lib/i18n.tsx` provides a `LanguageProvider` (default **English**),
  `useContent()` (active language slice), `useLang()`, and the
  `LanguageSwitcher`. Switching language updates the `<html>` `lang`/`dir`
  attributes, so the whole site flips.
- Layout direction is driven by `dir` via Tailwind **logical utilities**
  (`text-start`, `start-*`, `me-*`, `-end-*` …) and **`rtl:` / `ltr:` variants**
  (e.g. gradients and arrows), so components stay direction-agnostic.
- To add a language: add a `CONTENT.<lang>` block and extend the `Lang` type.

---

## Folder structure

```
public/
├── logo.jpeg                        # brand logo (navbar mark + footer)
├── brand-poster.jpeg                # OG/social image
└── frames/geniriflow-reveal/        # 240 hero frames: frame_0001.jpg … frame_0240.jpg

src/
├── app/
│   ├── layout.tsx          # fonts, default lang/dir, LanguageProvider, SEO + OG
│   ├── page.tsx            # section composition (10 sections)
│   └── globals.css         # Tailwind layers, base styles
│
├── components/
│   ├── layout/
│   │   ├── Background.tsx   # fixed ambient backdrop (gradient, grid, auroras)
│   │   └── Navbar.tsx       # sticky nav, glass-on-scroll, logo, language switcher
│   │
│   ├── media/
│   │   └── ScrollFrameSequence.tsx  # reusable scroll-driven canvas frame player
│   │
│   ├── sections/           # one file per page section
│   │   ├── Hero.tsx            # 1 · scroll-frame hero + bilingual copy
│   │   ├── Problem.tsx         # 2 · the operational mess (6 pains)
│   │   ├── Transformation.tsx  # 3 · before → after comparison
│   │   ├── WhatWeBuild.tsx     # 4 · 6 capability cards
│   │   ├── ExampleFlow.tsx     # 5 · one lead, 9-step connected journey
│   │   ├── WhyGeniriFlow.tsx   # 6 · proof points + founder (Nir) card
│   │   ├── Process.tsx         # 7 · Diagnose → Design → Build → Launch → Improve
│   │   ├── AuditCTA.tsx        # 8 · smart business audit CTA band
│   │   ├── Contact.tsx         # 9 · final CTA + lead-capture form
│   │   └── Footer.tsx          # 10 · footer
│   │
│   └── ui/                 # reusable primitives
│       ├── Button.tsx · Container.tsx · GlassCard.tsx · Icon.tsx
│       ├── Reveal.tsx · Section.tsx · SectionHeading.tsx
│
└── lib/
    ├── content.ts          # ALL bilingual copy & data (CONTENT.en / CONTENT.he)
    ├── i18n.tsx            # LanguageProvider, useContent, useLang, LanguageSwitcher
    ├── motion.ts           # shared Framer Motion variants
    ├── hooks.ts            # useMediaQuery / useIsMobile / usePrefersReducedMotion
    └── utils.ts            # cn() classname helper
```

---

## Hero — `ScrollFrameSequence`

The hero (`src/components/sections/Hero.tsx`) wraps the reveal in a tall scroll
**track** (`h-[280vh]`) with a `sticky` full-screen stage. `ScrollFrameSequence`
maps the track's scroll progress (0 → 1) to a frame index (0 → 239) and paints
it onto a `<canvas>`.

Reusable component API:

```tsx
<ScrollFrameSequence
  framesPath="/frames/geniriflow-reveal"
  frameCount={240}
  poster="/frames/geniriflow-reveal/frame_0240.jpg"
  trackRef={trackRef}   // element whose scroll drives the sequence
  pad={4}               // frame_0001 → 4 digits
  ext="jpg"
/>
```

How it stays fast & smooth:
- **First frame loads + paints immediately**; the rest preload in the background
  with limited concurrency (6 at a time) — never blocking.
- While a target frame isn't loaded yet, the **nearest loaded frame** is shown.
- `requestAnimationFrame` smooths toward the scroll target; redraws only on
  frame change. Frames are drawn **cover-style** (aspect-correct) and the canvas
  resizes via `ResizeObserver` (DPR-capped at 2).
- **Fallback poster** is rendered instead of the canvas on mobile,
  `prefers-reduced-motion`, and data-saver / 2G connections.

To swap the footage, drop a new `frame_0001…frame_NNNN.jpg` set into
`public/frames/<name>/` and update `HERO_FRAMES` in `content.ts`.

---

## Connecting the lead form ⚠️

The contact form (`src/components/sections/Contact.tsx`) is **wired on the UI
side only** — it currently fakes the request and shows the success state.
To go live, replace the body of `handleSubmit`:

```ts
const form = e.currentTarget;            // capture BEFORE await (React nulls currentTarget)
const data = Object.fromEntries(new FormData(form));
await fetch("/api/lead", { method: "POST", body: JSON.stringify(data) });
```

Point it at an email service, a Next.js API route, or a **Make / Zapier**
webhook. Submissions include: name, phone, business, message.

---

## Performance & accessibility

- **Code-split 3D** via `next/dynamic({ ssr: false })` — three.js loads as a
  separate on-demand chunk, never on the server.
- **Mobile fallback** — screens `< 768px` (and `prefers-reduced-motion` users)
  get a lightweight animated CSS hero instead of WebGL.
- **Capped DPR + adaptive quality** on the `<Canvas>`; additive-sprite glow
  instead of a heavy postprocessing pipeline.
- Semantic landmarks, Hebrew metadata, `og:image` (the brand poster), favicon.

---

## Contact details (live on the page)

- ✉️ nirsa11@gmail.com
- 📞 053-289-8849 (also used for the WhatsApp `wa.me` link)
- 📍 תל אביב

To change them, edit the `BRAND` object in `src/lib/content.ts`.

---

## Suggestions for future improvements

1. **Connect the form** to a real endpoint / CRM (see above).
2. **Postprocessing bloom** (`@react-three/postprocessing`) for an even more
   cinematic hero, gated behind a high-performance check.
3. **Scroll-linked 3D** — assemble the engine as the user scrolls.
4. **Social proof** — logos strip + testimonials (structure supports a new section).
5. **Real domain** — set `metadataBase` in `layout.tsx` to the production URL.
6. **Analytics & A/B testing** on the CTAs and headline variants.
7. **Optimize the poster** — export a web-optimized / cropped variant and add an
   English locale if needed (copy is already centralized).
8. **Testing** — Playwright smoke tests + a Lighthouse CI budget.

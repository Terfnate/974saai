# 974 Pavilions: product site

Product website for the CMPS307 Group 03 concept: Stadium 974 containers refitted as solar-powered, themed event pavilions for Darb Al Saai. It sells the product to organisers, vendors, sponsors and visitors. Project-management material (PERT, canvas, schedule) is intentionally not on the site.

Stack: Next.js 16 (Pages Router), GSAP 3 + ScrollTrigger, Lenis smooth scroll. No CMS; static pages, ready for Vercel.

## Run

```bash
npm install
npm run dev                  # http://localhost:3100
npm run build && npm start   # production build on :3100
```

## Structure

| Path | What |
|---|---|
| `src/content/content.ts` | All copy: brand name, hero, spaces, features, audiences, steps, offers, FAQ, form |
| `src/lib/motion.ts` | Every animation (Lenis + ScrollTrigger). Sections only carry `data-*` hooks |
| `src/components/sections/*.tsx` | One file per section |
| `src/pages/index.tsx` | Home page (product showcase), section order |
| `src/pages/reservations.tsx` | Container reservations: unit counters, event details, live summary |
| `src/pages/sponsorships.tsx` | Sponsor pitch and enquiry form |
| `src/pages/visitors.tsx` | Visitor info, plus the complaints and feedback form |
| `src/pages/performance.tsx` | Dashboard comparing containers across events |
| `src/content/performance-sample.ts` | **Sample** performance data; replace with real figures |
| `src/components/Layout.tsx` | Shared header/footer/motion + inner-page hero |
| `src/components/PreviewForm.tsx` | Form shell (validation, honeypot, preview notice) |
| `src/styles/globals.css` | Design tokens and all styles |

## Adding a section

1. Put its copy in `content.ts`.
2. Create `src/components/sections/<Name>.tsx`. Reuse `SectionHead`, `Box` and the `sec--concrete / sec--white / sec--steel / sec--red` grounds, and tag elements with `data-rise` to fade them in.
3. Add it to `src/pages/index.tsx`, plus a `NAV` entry in `content.ts` if it belongs in the header.

## Design

- Grounds: steel navy `#13202a` (yard) and concrete `#e8e8e4`. Container red `#b8321c` for calls to action and the sustainability band; amber `#e5a823` for small highlights on dark grounds.
- Type: Big Shoulders (display), Big Shoulders Stencil (the 974 mark), IBM Plex Sans (text), IBM Plex Mono (drawing labels).
- Signature: CSS shipping containers with corrugated ribs and door bars. The hero stack comes apart as you scroll, the four pavilion types ride past as a container train, the "Inside" drawing assembles itself, and a container rides the How-it-works rail.
- Motion: desktop pins (hero, train). Mobile uses simple reveals. With reduced motion, nothing animates.

## Placeholders

- Product name "974 Pavilions" is a working name (`BRAND.name`).
- No inbox yet: every form (enquiry, reservation, sponsor, complaint) validates, then shows a preview notice instead of sending. To go live, post the form data to an API route in `PreviewForm`.
- Performance numbers are sample data, and the page says so.
- No prices or partners are shown, because none are confirmed.

All claims come from the group's business model (value propositions, segments, relationships, channels, revenue streams).

# Ali Fahim — portfolio

A single-page portfolio plus case study pages, built with [Astro](https://astro.build). Terminal
design language: everything monospaced on phosphor-dark, sections framed as windows, restrained
motion (a typing effect, a blinking caret, fast state changes). No client-side framework — the
pages are static HTML and CSS, with ~50 lines of JavaScript for scroll reveals.

```sh
pnpm dev      # dev server on localhost:4321
pnpm build    # static output to ./dist
pnpm preview  # preview the build
```

## Where things live

| What | Where |
| --- | --- |
| Name, hero copy, sections | `src/components/*.astro` |
| Projects, case study copy, work history | `src/data/projects.ts` |
| Case study pages | `src/pages/work/[slug].astro` (one per project, generated from the data file) |
| Colours, type scale, motion tokens, shell theme | `src/styles/global.css` (`:root`, plus `html[data-theme='shell']`) |
| Project cover art | `public/covers/*.svg` |

The homepage runs the `shell` theme (`<Base theme="shell">`). The four case studies are leftover
placeholder copy — they're unlinked from the homepage and still carry fictional projects, so
either rewrite them from real work or delete `src/pages/work/` and the `projects` array. Fonts
(Instrument Serif, Inter, JetBrains Mono) are self-hosted from `@fontsource` packages, so nothing
is fetched from a third party.

## Craft notes

- **Motion is a progressive enhancement.** Content is visible without JavaScript; `html.js` opts
  into the reveal animation. A scroll sweep (not an IntersectionObserver) reveals sections, so a
  fast flick can never leave a section stuck invisible. `prefers-reduced-motion` reduces rather
  than removes motion.
- **Contrast is checked.** Every text colour meets WCAG AA for small text on the dark background
  (muted green-grey sits at ~5.3:1, the accent at ~13:1).
- **Layouts hold from 320px up**, with no horizontal overflow.

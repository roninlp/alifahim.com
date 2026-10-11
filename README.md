# Ali Fahim portfolio

A single-page portfolio plus case study pages, built with [Astro](https://astro.build). Warm dark
design language: an espresso-black surface, paper-warm text and one clay accent. Instrument Serif
headlines over Inter body copy, with JetBrains Mono reserved for the terminal-flavoured microcopy
(prompt lines, command names, window frames) kept as a voice rather than a full shell. Motion is
restrained (a typing effect, a blinking caret, fast state changes). No client-side framework: the
pages are static HTML and CSS, with ~50 lines of JavaScript for scroll reveals.

```sh
pnpm dev      # dev server on localhost:4321
pnpm build    # static output to ./dist, plus Cloudflare Build Output in .cloudflare/output
pnpm preview  # preview the build
pnpm deploy   # build and deploy to Cloudflare with the cf CLI
```

## Where things live

| What | Where |
| --- | --- |
| Name, hero copy, sections | `src/components/*.astro` |
| Projects, case study copy, work history | `src/data/projects.ts` |
| Case study pages | `src/pages/work/[slug].astro` (one per project, generated from the data file) |
| Colours, type scale, motion tokens, shell theme | `src/styles/global.css` (`:root`, plus `html[data-theme='shell']`) |
| Project cover art | `public/covers/*.svg` |
| Favicon and header mark (AF monogram) | `public/favicon.svg`, rasterized into `public/favicon.ico` |
| Worker name, custom domain, compat date | `cloudflare.config.ts` |
| Static assets directory | `wrangler.config.ts` |

The homepage runs the `shell` theme (`<Base theme="shell">`). The four case studies are leftover
placeholder copy: they're unlinked from the homepage and still carry fictional projects, so
either rewrite them from real work or delete `src/pages/work/` and the `projects` array. Fonts
(Instrument Serif, Inter, JetBrains Mono) are self-hosted from `@fontsource` packages, so nothing
is fetched from a third party.

## Deployment

The site is a static Worker: every route is prerendered, so there is no server code and
Cloudflare serves `dist/` through [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/).
`alifahim.com` is attached as a custom domain.

`cloudflare.config.ts` is the Worker's source of truth (name, compatibility date, custom domain,
observability). `wrangler.config.ts` only names the static assets directory, and Wrangler reads it
alongside `cloudflare.config.ts` behind `--experimental-new-config`. There is no `wrangler.jsonc`.

`cf build` and `cf deploy` run `astro build` and then read the Build Output Specification tree in
`.cloudflare/output/v0/`. Astro does not write that tree itself, so `astro.config.mjs` carries a
small `cloudflareBuildOutput` integration that emits it at the end of every build. It is glue for a
gap between `cf` and `@astrojs/cloudflare`; delete it once the adapter emits Build Output on its own.

### Continuous delivery

`.github/workflows/deploy.yml` builds and dry-runs the deploy on every pull request, and deploys on
every push to `main`. It authenticates with two repository secrets:

| Secret | Value |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | An API token with **Workers Admin** on the account and **DNS Read/Write** on `alifahim.com` |
| `CLOUDFLARE_ACCOUNT_ID` | The Cloudflare account ID |

Create the token with `cf user tokens create`, and set the secrets with `gh secret set`.

## Craft notes

- **Motion is a progressive enhancement.** Content is visible without JavaScript; `html.js` opts
  into the reveal animation. A scroll sweep (not an IntersectionObserver) reveals sections, so a
  fast flick can never leave a section stuck invisible. `prefers-reduced-motion` reduces rather
  than removes motion.
- **Contrast is checked.** Every text colour meets WCAG AA for small text on the dark background
  (muted warm grey sits at ~5.5:1, the clay accent at ~7:1, headline ink at ~16:1).
- **Layouts hold from 320px up**, with no horizontal overflow.

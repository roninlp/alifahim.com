# 008 — Carry the row → case-study seam with cross-document view transitions

- **Status**: DONE (executed with 009 applied; optional step included, plus a clearing loop so only one element carries `case-cover` per page — duplicate names would make Chrome skip the whole transition)
- **Commit**: cdf9ed1
- **Severity**: LOW (missed opportunity — additive)
- **Category**: Missed opportunities (spatially-connected UI)
- **Estimated scope**: 1 file required (~25 lines CSS), optional step adds 2 more files

## Problem

Clicking a work row (`src/components/WorkList.astro:22`) navigates to that project's case study with a hard cut — a full white flash between pages, despite an obvious spatial connection: the row (and its preview cover, same image) *becomes* the case study. The same seam exists at the bottom of every case study via `.case__next` (`src/pages/work/[slug].astro:265`). The site is static multi-page Astro; cross-document View Transitions (standards CSS, no JS) turn each navigation into one continuous move and degrade to a plain load where unsupported (Firefox — instant navigation, which is the current behavior; nothing breaks).

## Target

### Required — in `src/styles/global.css`, add a new section at the end of the file (after the reduced-motion block at 389-400):

```css
/* View transitions --------------------------------------------------------
   Cross-document: works on plain multi-page navigation. Browsers without
   support simply load the page instantly — the current behavior. */
@view-transition {
	navigation: auto;
}

::view-transition-old(root) {
	animation: page-out 180ms var(--ease-out) both;
}

::view-transition-new(root) {
	animation: page-in 300ms var(--ease-out) both;
}

@keyframes page-out {
	to {
		opacity: 0;
	}
}

@keyframes page-in {
	from {
		opacity: 0;
		transform: translateY(10px);
	}
}

@media (prefers-reduced-motion: reduce) {
	::view-transition-group(*),
	::view-transition-old(*),
	::view-transition-new(*) {
		animation: none !important;
	}
}
```

The outgoing page fades over 180ms while the incoming page fades up 10px over 300ms with `var(--ease-out)` (`cubic-bezier(0.23, 1, 0.32, 1)`, from `src/styles/global.css:56`). The asymmetry (out faster than in) is deliberate: the destination is what the user is watching.

### Optional (skip if in doubt) — shared cover element

The preview rail's covers are the **same images** as the case-study covers (`project.cover`), so the active preview can morph into the case cover instead of crossfading. Names must be unique per page, so the name is assigned only at click time (one element max carries it on the index page):

1. `src/components/WorkList.astro` — in the existing script (lines 258-283), add to the `rows.forEach` block (after line 275):

   ```ts
   		row.addEventListener('pointerdown', () => {
   			const img = work.querySelector<HTMLImageElement>(
   				`.preview[data-slug="${slug}"] img`
   			);
   			if (img) img.style.viewTransitionName = 'case-cover';
   		});
   ```

2. `src/pages/work/[slug].astro` — on the cover image (line 66), add the matching name:

   ```astro
   				<img
   				src={project.cover}
   				alt={project.alt}
   				width="1200"
   				height="800"
   				style="view-transition-name: case-cover"
   			/>
   ```

   (If plan 009 has been applied, this img sits inside `.case__cover-mask` — apply the style to the same `<img>`, do not restructure.)

## Repo conventions to follow

- Easing/duration tokens only (`var(--ease-out)`, raw ms values are acceptable in the view-transition pseudo layer since custom properties do not cross into `::view-transition-*` pseudo-elements reliably — the 180/300ms literals above are intentional).
- Reduced-motion is handled at the CSS layer everywhere in this repo (see `src/styles/global.css:389-400`) — the `animation: none !important` kill above follows that pattern.
- Progressive enhancement ethos (`src/layouts/Base.astro:24-28`): the site must work identically without the feature.

## Steps

1. Add the required block above to the end of `src/styles/global.css`.
2. (Optional) Apply the two shared-cover edits above.
3. Do not add `<ClientRouter />` or any Astro transitions API — this is the CSS-only path and works with the existing plain multi-page architecture.

## Boundaries

- Do NOT add JavaScript navigation interception or any new dependencies.
- Do NOT change any existing animation or transition (the in-page motion is out of scope).
- Do NOT add `view-transition-name` anywhere except the optional step's two elements.
- If the installed Astro version's build rejects `@view-transition` in CSS (it should not — it is plain CSS), STOP and report.
- If a step doesn't match the code you find (drift since the commit stamp), STOP and report instead of improvising.

## Verification

- **Mechanical**: `pnpm build` completes with no errors; the built CSS in `dist/` contains `@view-transition`.
- **Feel check** — `pnpm dev`, Chromium:
  - Click a work row: the index page fades out while the case study fades up 10px — one continuous move, **no white flash**.
  - Browser back: same treatment in reverse.
  - Click "Next case study" at the bottom of a case: same seam, continuous.
  - If the optional step is applied: the hovered preview cover **morphs** into the case-study cover (grows from the rail into place) while the rest of the page crossfades.
  - Rapid double-click on a row: navigation is not delayed or double-fired.
  - Emulate `prefers-reduced-motion`: navigation is instant (no transition animations recorded in the Animations panel).
  - In Firefox (or DevTools device emulation with reduced support): pages simply load instantly — identical to today, no errors in the console.
- **Done when**: `pnpm build` passes, the crossfade-and-rise is visible on Chromium for all three seams (row, back, next), and reduced motion yields instant navigation.

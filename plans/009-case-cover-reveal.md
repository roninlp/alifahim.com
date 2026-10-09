# 009 — Give the case-study cover an image-appropriate reveal

- **Status**: DONE (executed with 001-007 applied; RM block already extended by 003, rule appended there)
- **Commit**: cdf9ed1
- **Severity**: LOW (missed opportunity — additive)
- **Category**: Missed opportunities (rare delight moment)
- **Estimated scope**: 2 files, ~25 lines (CSS variant + keyframes + 2 markup attributes)

## Problem

The case-study cover (`src/pages/work/[slug].astro:65-69`) is the one large, rare image surface in the site — a first impression of the project — and it enters with the generic text treatment: a 12px rise and 420ms fade (`reveal-in` at `src/styles/global.css:369-378`), identical to a paragraph. An image of this size deserves the site's rare-delight budget: a slower, image-appropriate settle, masked so it reads as depth rather than as text sliding.

Current markup (`src/pages/work/[slug].astro:65-69`):

```astro
		<figure class="case__cover" data-reveal>
			<div class="shell">
				<img src={project.cover} alt={project.alt} width="1200" height="800" />
			</div>
		</figure>
```

Current relevant CSS (`src/pages/work/[slug].astro:163-171`):

```css
	.case__cover {
		margin: 0;
	}

	.case__cover img {
		width: 100%;
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		background: var(--paper-sunk);
	}
```

## Target

A `data-reveal="cover"` variant of the existing reveal system: the figure fades (no rise), while the image settles from `scale(1.02)` to `scale(1)` **inside an overflow mask**, over 760ms — matching the hero entrance's deliberate scale (`src/components/Hero.astro:104` uses 760ms) since both are once-per-view impression moments. The 1.02 → 1 zoom is clipped by the rounded mask, so the image never bleeds past its column.

### 1. `src/styles/global.css` — extend the reveal system. Insert after the `@keyframes reveal-fade` block (ends line 387) and **before** the `@media (prefers-reduced-motion: reduce)` block at 389 (source order lets the existing reduced-motion rules keep winning):

```css
/* Cover reveal — variant for large, rare image surfaces. The figure fades,
   the image settles from 1.02 inside an overflow mask. */
.js [data-reveal='cover'].is-visible {
	animation-name: cover-fade;
	animation-duration: 760ms;
}

.js [data-reveal='cover'].is-visible img {
	animation: cover-zoom 760ms var(--ease-out) backwards;
}

@keyframes cover-fade {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes cover-zoom {
	from {
		transform: scale(1.02);
	}
	to {
		transform: none;
	}
}
```

### 2. `src/styles/global.css` — inside the existing reduced-motion block (389-400), append:

```css
	.js [data-reveal='cover'].is-visible img {
		animation: none;
	}
```

(The block's existing `animation-name: reveal-fade; animation-duration: 200ms;` at 390-394 already covers the figure selector `[data-reveal='cover']` and keeps a plain 200ms fade under reduced motion. Source order: this block comes after the variant rule, so it wins. Verify that holds after your edit.)

### 3. `src/pages/work/[slug].astro` — markup (lines 65-69):

```astro
		<figure class="case__cover" data-reveal="cover">
			<div class="shell case__cover-mask">
				<img src={project.cover} alt={project.alt} width="1200" height="800" />
			</div>
		</figure>
```

### 4. `src/pages/work/[slug].astro` — style, add next to the `.case__cover` rules (after line 165):

```css
	.case__cover-mask {
		overflow: hidden;
		border-radius: var(--radius-lg);
	}
```

The mask's radius matches the img's existing `border-radius: var(--radius-lg)` (line 168), so clipping is invisible at rest.

## Repo conventions to follow

- The reveal system is extended, not replaced: attribute selector + `is-visible` class driven by the scroll sweep in `src/layouts/Base.astro:40-81`. `data-reveal="cover"` is just `data-reveal` with a variant value — the sweep matches `[data-reveal]` (attribute presence), so it keeps working with zero JS changes. **Do not change `Base.astro`.**
- Entrance duration and easing tokens: 760ms matches the hero entrance (`src/components/Hero.astro:104`); easing is `var(--ease-out)` throughout.
- No hardcoded pixel offsets anywhere — the zoom is a scale ratio, per the repo's translate/scale-only motion practice.

## Steps

1. Apply the `global.css` insert (target 1) — double-check it lands between `@keyframes reveal-fade` and the reduced-motion block.
2. Append the reduced-motion rule (target 2).
3. Apply the markup change (target 3): `data-reveal` → `data-reveal="cover"` and add `case__cover-mask` to the inner div.
4. Add the `.case__cover-mask` rule (target 4).

## Boundaries

- Do NOT touch any other `[data-reveal]` element — every other reveal keeps the generic `reveal-in`.
- Do NOT modify `reveal-in`, `reveal-fade`, or the scroll sweep in `src/layouts/Base.astro`.
- Do NOT change `.case__cover img`'s border/radius/background (lines 167-172).
- Do NOT add `will-change` or JS for this — it is CSS keyframes on a once-per-page element.
- If a step doesn't match the code you find (drift since the commit stamp), STOP and report instead of improvising.

## Verification

- **Mechanical**: `pnpm build` completes with no errors; `grep -n "data-reveal" src/pages/work/\[slug\].astro` shows exactly one `data-reveal="cover"` (the figure) and unchanged generic `data-reveal` on the body sections.
- **Feel check**: `pnpm dev`, open a case study and scroll the cover into view:
  - The image **settles** — fading in while easing from a hair oversized (1.02) down to rest, clipped cleanly by its rounded corners. No 12px text-rise.
  - At 10% Animations playback: `cover-fade` (figure, opacity) and `cover-zoom` (img, transform) run 760ms together; the zoom's edges never poke outside the rounded mask.
  - The body sections below still use the quick generic rise (420ms) — the cover is distinctly calmer than the text, not slower everywhere.
  - The cover still reveals on **scroll** (it is below the fold on load) — the scroll sweep triggers it exactly as before, and a fast flick never leaves it hidden.
  - Emulate `prefers-reduced-motion`: the cover does a plain 200ms fade, zero zoom.
- **Done when**: the cover uses the masked 1.02 → 1 settle at 760ms, reduced motion degrades to fade-only, all other reveals are untouched, and `pnpm build` passes.

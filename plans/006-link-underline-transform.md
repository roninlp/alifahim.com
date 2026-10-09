# 006 — Rebuild the `.link` underline as a transform, not a painted gradient

- **Status**: DONE (executed with plan 002's gating already applied, merged per its Step 4; line references shifted)
- **Commit**: cdf9ed1
- **Severity**: LOW
- **Category**: Performance (paint property animated on the highest-frequency hover target)
- **Estimated scope**: 1 file, ~1 rule rewritten (~12 lines)

## Problem

Text links are the most frequently hovered elements on the site, and their underline animation animates `background-size` — a paint property that rasterizes the element every frame instead of compositing. `src/styles/global.css:223-239`:

```css
/* src/styles/global.css:223-239 — current */
.link {
	position: relative;
	color: var(--ink);
	background-image: linear-gradient(currentColor, currentColor);
	background-repeat: no-repeat;
	background-position: 0 100%;
	background-size: 0% 1px;
	transition:
		background-size var(--duration) var(--ease-out),
		color var(--duration-fast) var(--ease-out);
}

.link:hover,
.link:focus-visible {
	background-size: 100% 1px;
	color: var(--accent-deep);
}
```

The standard-composited version of the identical effect is a pseudo-element scaled on X — and this repo already uses exactly that technique for the nav underline: `src/components/SiteHeader.astro:101-112`. Note also that `background-size: 1px` inherits the border-box; a pseudo line at the text baseline matches the visual position of `background-position: 0 100%` on an inline link.

## Target

```css
/* target — src/styles/global.css */
.link {
	position: relative;
	color: var(--ink);
	transition: color var(--duration-fast) var(--ease-out);
}

.link::after {
	content: '';
	position: absolute;
	left: 0;
	bottom: 0;
	width: 100%;
	height: 1px;
	background: currentColor;
	transform: scaleX(0);
	transform-origin: left;
	transition: transform var(--duration) var(--ease-out);
}

.link:hover::after,
.link:focus-visible::after {
	transform: scaleX(1);
}

.link:hover,
.link:focus-visible {
	color: var(--accent-deep);
}
```

Visual result is identical: a 1px `currentColor` underline grows left-to-right over `var(--duration)` with `var(--ease-out)`, and the text color shifts over `var(--duration-fast)`. `bottom: 0` on an absolutely-positioned pseudo of an inline element sits at the bottom of the inline box — the same place `background-position: 0 100%` painted the gradient. If, in the feel check, the line sits visibly lower than the old one (inline box descender space varies by font metrics), adjust `bottom` only — never the motion values.

## Repo conventions to follow

- The exact idiom to imitate — `src/components/SiteHeader.astro:101-112`:
  ```css
  .site-nav__link::after {
  	content: '';
  	position: absolute;
  	left: 0;
  	bottom: 0.1rem;
  	width: 100%;
  	height: 1px;
  	background: var(--accent);
  	transform: scaleX(0);
  	transform-origin: left;
  	transition: transform var(--duration) var(--ease-out);
  }
  ```
- Tokens only: `var(--duration)`, `var(--duration-fast)`, `var(--ease-out)` — no raw values.

## Steps

1. In `src/styles/global.css`, rewrite the `.link` rule (223-233): remove `background-image`, `background-repeat`, `background-position`, `background-size`; keep `position: relative`, `color: var(--ink)`; keep the `color` transition only.
2. Add the `.link::after` rule (target block above) immediately after `.link`.
3. Rewrite the `.link:hover, .link:focus-visible` rule (235-239) as the two target rules above (color on the element, `transform: scaleX(1)` on `::after`).
4. If plan 002 has been applied, its hover-gating structure stays: the `:hover::after` / `:hover` selectors go inside the `@media (hover: hover) and (pointer: fine)` block and `:focus-visible` variants stay outside. If plan 002 has NOT been applied, do not create the media block yourself — write the rules ungated exactly as shown.

## Boundaries

- Do NOT touch `.link--quiet` (241-243), the `.btn` rules, or any component-scoped styles.
- Do NOT change easing tokens or durations anywhere (plans 003/004 may edit nearby blocks — do not reformat their content).
- The `::after` underline replaces the background-image underline; do not leave both.
- If a step doesn't match the code you find (drift since the commit stamp), STOP and report instead of improvising.

## Verification

- **Mechanical**: `pnpm build` completes with no errors; `grep -n "background-size\|linear-gradient" src/styles/global.css` finds nothing in `.link`.
- **Feel check** — `pnpm dev`, hover the hero email link and a nav link:
  - The underline grows **left to right** at the same speed and curve as before (compare against `git stash` if unsure).
  - Its vertical position hugs the text baseline exactly as the old gradient underline did — no visible jump.
  - The underline is `currentColor`-derived (goes accent when the text goes accent on hover).
  - At 10% Animations playback: only a `transform` bar for the underline, no `background-size` bar. In the Performance panel, hovering repeatedly shows no paint flashes on the link itself (compositing only).
  - Multi-line links (e.g. wrapping text in the Contact aside): the underline behaves like the old one (spans the last line box the way the background did). If it looks broken on a wrapping link, STOP and report — that is the one edge case this plan can't fully predict.
  - Emulate `prefers-reduced-motion`: per plan 003 the underline appears instantly; confirm that still holds with the new `::after`.
- **Done when**: `.link` underlines are driven by `transform: scaleX` on a pseudo-element, visual parity holds, and `pnpm build` passes.

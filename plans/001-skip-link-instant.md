# 001 — Make the skip-link appear instantly on keyboard focus

- **Status**: DONE (executed against working tree; line references shifted by −1 after the deletion)
- **Commit**: cdf9ed1
- **Severity**: HIGH
- **Category**: Purpose & frequency (keyboard-initiated action)
- **Estimated scope**: 1 file, ~3 lines

## Problem

The skip-link — the very first thing a keyboard user reaches on every page load — slides in over 160ms when focused. `src/styles/global.css:164-182`:

```css
/* src/styles/global.css:176-177 — current */
	transform: translateY(-200%);
	transition: transform var(--duration-fast) var(--ease-out);
}

/* src/styles/global.css:180-182 — current */
.skip-link:focus-visible {
	transform: translateY(0);
}
```

Keyboard-initiated actions must not animate. The user has already committed to the action (pressing Tab); the only thing the transition buys is 160ms of delay on the single most accessibility-critical affordance on the page. The severity bar calls animation on keyboard actions HIGH.

## Target

The link is hidden off-canvas at rest and snaps into place the instant it receives focus. No transition of any kind on this element:

```css
/* target */
.skip-link {
	/* …existing declarations unchanged… */
	transform: translateY(-200%);
}

.skip-link:focus-visible {
	transform: translateY(0);
}
```

The `transition: transform var(--duration-fast) var(--ease-out);` line at `src/styles/global.css:177` is deleted outright. Do not replace it with a shorter duration — there must be no transition.

## Repo conventions to follow

- Motion tokens and durations live in `src/styles/global.css:53-60`. This plan removes a transition rather than retargeting it, so no token work is needed.
- The progressive-enhancement ethos in this repo (see `src/layouts/Base.astro:24-28`) favors things that work instantly and correctly; a focus affordance is exactly that class of thing.

## Steps

1. In `src/styles/global.css`, delete line 177 (`transition: transform var(--duration-fast) var(--ease-out);`) from the `.skip-link` rule (lines 176-178). Keep `transform: translateY(-200%);`.
2. Leave `.skip-link:focus-visible { transform: translateY(0); }` (lines 180-182) exactly as is.

Resulting rule:

```css
.skip-link {
	position: absolute;
	left: var(--gutter);
	top: 0.75rem;
	z-index: 100;
	padding: 0.6rem 1rem;
	background: var(--ink);
	color: var(--paper);
	font-family: var(--font-mono);
	font-size: var(--step--2);
	letter-spacing: 0.02em;
	border-radius: var(--radius);
	transform: translateY(-200%);
}
```

## Boundaries

- Do NOT touch any other rule in `src/styles/global.css` (in particular the reduced-motion block at 389-400 — a separate plan handles it).
- Do NOT change the skip-link markup in `src/layouts/Base.astro:33`.
- Do NOT add a `transition: none` fallback or any other transition property — the point is that the line is gone.
- If a step doesn't match the code you find (drift since the commit stamp), STOP and report instead of improvising.

## Verification

- **Mechanical**: `pnpm build` completes with no errors (static Astro build; no typecheck script exists in `package.json`, the build is the check).
- **Feel check**: run `pnpm dev`, load the homepage, press **Tab** once:
  - The skip-link is fully visible **immediately** — no slide, no fade, not even one frame of motion.
  - With DevTools → Animations panel open and playback slowed to 10%, pressing Tab still shows zero animation events.
  - Focus styling (`:focus-visible` outline from `src/styles/global.css:137-141`) still appears — instant, not removed.
  - Shift+Tab back out and Tab back in: identical instant behavior both times.
- **Done when**: no CSS `transition` remains on `.skip-link`, and the first Tab press reveals it with zero animation frames.

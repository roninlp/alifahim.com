# 007 — Make press feedback snap: asymmetric press/release timing

- **Status**: DONE (executed with 003 applied; RM `:active` rules left as-is per boundary)
- **Commit**: cdf9ed1
- **Severity**: LOW
- **Category**: Interruptibility (symmetric press-and-release timing)
- **Estimated scope**: 3 files, 1 declaration added per rule (~3 lines)

## Problem

Press feedback is symmetric: the press-down scale and the release-back take the same duration. The press is a deliberate, user-initiated phase and should snap; the release back to rest is the system relaxing and can be the softer duration. Current state:

```css
/* src/styles/global.css:259-273 — current (excerpt) */
.btn {
	transition:
		transform var(--duration-fast) var(--ease-out),   /* 160ms both directions */
		/* …color props… */
}

.btn:active {
	transform: scale(0.97);
}
```

```css
/* src/components/WorkList.astro:94-97, 166-169 — current (excerpt) */
.work-row {
	transition:
		background-color var(--duration) var(--ease-out),
		transform var(--duration-fast) var(--ease-out);   /* 160ms both directions */
}
.work-row:active {
	background-color: color-mix(in srgb, var(--ink) 7%, transparent);
	transform: scale(0.995);
}
```

```css
/* src/pages/work/[slug].astro:271-273, 318-321 — current (excerpt) */
.case__next {
	transition:
		background-color var(--duration) var(--ease-out),
		transform var(--duration-fast) var(--ease-out);
}
.case__next:active {
	background-color: color-mix(in srgb, var(--ink) 7%, transparent);
	transform: scale(0.995);
}
```

## Target

The press phase shortens to 100ms (inside the 100–160ms press-feedback budget); the release keeps the base 160ms. Scale values do **not** change. Add `transition-duration: 100ms;` to each `:active` rule (it shortens the whole transition list for the press phase — background/border/color snapping at 100ms on press is intended; everything relaxes at base duration on release):

```css
/* target */
.btn:active {
	transform: scale(0.97);
	transition-duration: 100ms;
}

.work-row:active {
	background-color: color-mix(in srgb, var(--ink) 7%, transparent);
	transform: scale(0.995);
	transition-duration: 100ms;
}

.case__next:active {
	background-color: color-mix(in srgb, var(--ink) 7%, transparent);
	transform: scale(0.995);
	transition-duration: 100ms;
}
```

The 100ms literal is deliberate (there is no token below `--duration-fast: 160ms`, and this is the one value below the scale — do not add a new token for it).

## Repo conventions to follow

- Press feedback uses `transform: scale(...)` on `:active` with the shared easing `var(--ease-out)` — unchanged here; exemplars at `src/styles/global.css:271-273`, `src/components/WorkList.astro:166-169`.
- Multi-property transitions live on the base rule; this plan only overrides the duration for the `:active` phase.

## Steps

1. `src/styles/global.css:271-273` — add `transition-duration: 100ms;` to `.btn:active`.
2. `src/components/WorkList.astro:166-169` — add `transition-duration: 100ms;` to `.work-row:active`.
3. `src/pages/work/[slug].astro:318-321` — add `transition-duration: 100ms;` to `.case__next:active`.

## Boundaries

- Do NOT change the scale values (`0.97`, `0.995`) or the base transition durations.
- Do NOT add or edit tokens in `src/styles/global.css:53-60`.
- If plan 003 has been applied, its reduced-motion rules (`transform: none; transition: none;` on `:active`) stay as written — do not reconcile them into this plan's rules.
- If a step doesn't match the code you find (drift since the commit stamp), STOP and report instead of improvising.

## Verification

- **Mechanical**: `pnpm build` completes with no errors.
- **Feel check**: `pnpm dev`, press and release the hero button, a work row, and the case-study "next" block:
  - The press-down scale is noticeably quicker than the spring-back: press snaps (~100ms), release relaxes (~160ms). It should read as "instant acknowledgment, gentle return."
  - At 10% Animations playback: the `transform` bar while entering `:active` is shorter than the bar when leaving it.
  - Rapid click-click-click: no stuck pressed state, no accumulated lag.
  - Emulate `prefers-reduced-motion`: press shows no scale (plan 003's rules) — confirm no regression.
- **Done when**: all three `:active` rules carry `transition-duration: 100ms;`, the asymmetry is perceptible in slow motion, and `pnpm build` passes.

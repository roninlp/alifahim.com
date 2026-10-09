# 005 — Retarget the preview crossfade to motion tokens

- **Status**: DONE
- **Commit**: cdf9ed1
- **Severity**: LOW
- **Category**: Cohesion & tokens
- **Estimated scope**: 1 file, ~3 lines (values only)

## Problem

The work-preview crossfade hand-types its durations instead of using the token scale defined in `src/styles/global.css:58-60` (`--duration-fast: 160ms; --duration: 240ms; --duration-slow: 420ms;`). `src/components/WorkList.astro:193-196`:

```css
/* src/components/WorkList.astro:193-196 — current */
	transition:
		opacity 320ms var(--ease-out),
		transform 420ms var(--ease-out),
		filter 320ms var(--ease-out);
```

`420ms` is literally `--duration-slow`; `320ms` matches no token. Every other transition in the codebase references the duration tokens (e.g. `src/components/SiteHeader.astro:111`, `src/styles/global.css:259-263`). This is the one orphan, and any future retiming of the scale will silently skip the site's most prominent hover effect.

## Target

Same feel — opacity and blur finish before the scale, so the image settles slightly after it becomes visible (an intentional settle-lag) — but expressed in tokens:

```css
/* target — src/components/WorkList.astro:193-196 */
	transition:
		opacity var(--duration) var(--ease-out),
		transform var(--duration-slow) var(--ease-out),
		filter var(--duration) var(--ease-out);
```

Values after substitution are identical to today (`240ms / 420ms / 240ms`… no — verify carefully): the current `320ms` becomes `var(--duration)` = **240ms** and `420ms` becomes `var(--duration-slow)` = **420ms**. This intentionally makes opacity/filter slightly faster (320 → 240ms): the crossfade becomes marginally crisper, still well inside the "occasional UI" budget (< 300ms), while the scale keeps its 420ms settle. That timing change is desired, not an accident.

## Repo conventions to follow

- Durations and easings come from `src/styles/global.css:53-60` and are referenced as `var(--duration-fast|duration|duration-slow)` + `var(--ease-out|ease-in-out)` — exemplar: `src/styles/global.css:259-263` (the `.btn` transition list).
- Multi-property transitions are written as a wrapped, indented list (see `src/styles/global.css:259-263`) — preserve the existing formatting.

## Steps

1. In `src/components/WorkList.astro`, replace the transition list at lines 193-196 with the target block above. No other declaration in the `.preview` rule (186-197) changes.
2. Scan the rest of the file for other hand-typed durations — there are none expected; if you find one, STOP and report rather than extending scope.

## Boundaries

- Do NOT change the `.preview` end states (`.preview[data-rest], .preview.is-active` at 205-210 or `.work.has-active …` at 212-216).
- Do NOT touch the reduced-motion block at 244-255 (its `transition: opacity 200ms ease` stays).
- Do NOT change `--duration`/`--duration-slow` values in `global.css` — this plan changes what the component references, not the scale.
- If a step doesn't match the code you find (drift since the commit stamp), STOP and report instead of improvising.

## Verification

- **Mechanical**: `pnpm build` completes with no errors; `grep -nE "[0-9]+ms" src/components/WorkList.astro` returns no transition durations (only the reduced-motion `200ms` is acceptable).
- **Feel check**: `pnpm dev`, desktop width (the rail is hidden below 62rem):
  - Hover down the four work rows: each cover crossfades in, and the image **settles** (scale completes just after the fade) — the same choreography as before, slightly snappier on the fade.
  - At 10% Animations playback: the opacity/filter bars end before the transform bar; no pop, no double-exposure flash beyond the intended brief overlap (blur masks it).
  - Rapidly move between rows and back to rest: transitions retarget smoothly, no restart-from-zero jump.
  - Emulate `prefers-reduced-motion`: preview swaps stay opacity-only (existing rule intact).
- **Done when**: all three durations in `.preview`'s transition reference tokens, `pnpm build` passes, and the settle-lag choreography is preserved.

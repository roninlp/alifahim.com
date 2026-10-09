# 003 — Complete `prefers-reduced-motion` coverage for surviving movement

- **Status**: DONE (executed with 001/002/006 applied; `.site-nav__link::after` rule placed in `SiteHeader.astro` instead of global.css — scoped selectors cannot match from a global sheet)
- **Commit**: cdf9ed1
- **Severity**: MEDIUM
- **Category**: Accessibility (incomplete reduced-motion handling)
- **Estimated scope**: 3 files, ~1 block added + 2 blocks extended
- **Depends on**: plans/006 (the `.link` target below matches 006's rebuilt underline; a fallback for the pre-006 shape is included)

## Problem

Reduced-motion handling in this repo is partial. The rule is: under `prefers-reduced-motion: reduce`, **keep opacity/color feedback, drop movement**. Today, only the reveal system and the hand-underline respect it (`src/styles/global.css:389-400`, `src/components/WorkList.astro:244-255`, `src/components/Hero.astro:138-147`). The following movement still plays for users who asked for less motion:

1. `src/styles/global.css:287-293` — `.btn__arrow` nudge on hover:
   ```css
   .btn__arrow {
   	transition: transform var(--duration) var(--ease-out);
   }
   /* … */
   .btn:hover .btn__arrow {
   	transform: translate(2px, -2px);
   }
   ```
2. `src/styles/global.css:223-239` — `.link` underline grows left-to-right on hover/focus (via `background-size` today, via `::after` `scaleX` after plan 006 — see Target).
3. `src/styles/global.css:101-112` — `.site-nav__link::after` underline animates `transform: scaleX(0 → 1)`.
4. `src/styles/global.css:271-273` — `.btn:active` press `scale(0.97)`.
5. `src/components/WorkList.astro:142-169` — `.work-row__arrow` nudge (`translate(3px, -3px)`) and `.work-row:active` `scale(0.995)`.
6. `src/pages/work/[slug].astro:288-321` — `.case__next-arrow` slide (`translateX(6px)`) and `.case__next:active` `scale(0.995)`. This file has **no** reduced-motion block at all.

## Target

Under reduced motion these elements still show *state* (colors change, underlines appear instantly) but no element changes position or scales, and no transition runs for movement.

### `src/styles/global.css` — extend the existing block at lines 389-400 (keep its current two rules):

```css
@media (prefers-reduced-motion: reduce) {
	.js [data-reveal].is-visible {
		animation-name: reveal-fade;
		animation-duration: 200ms;
		animation-delay: 0ms;
	}

	.hand-underline path {
		animation: none;
		stroke-dashoffset: 0;
	}

	/* drop movement, keep state feedback */
	.btn__arrow,
	.site-nav__link::after {
		transition: none;
	}

	.btn:hover .btn__arrow {
		transform: none;
	}

	.btn:active {
		transform: none;
		transition: none;
	}

	/* .link underline: appears instantly, no growth */
	.link::after {
		transition: none;
	}

	.link:hover::after,
	.link:focus-visible::after {
		transform: scaleX(1);
	}
}
```

**Implementation note for `.link`**: the rules above assume plan 006 has already been applied (per `plans/README.md` execution order, it has). If the code you find still uses the `background-size` underline (`.link` with `background-image: linear-gradient(...)` at `src/styles/global.css:226-229`), use this equivalent instead and report the deviation:

```css
	.link {
		transition: none;
	}

	.link:hover,
	.link:focus-visible {
		background-size: 100% 1px; /* snaps instantly, no growth */
	}
```

Either way, the underline **appears instantly** and the color change remains as state feedback.

### `src/components/WorkList.astro` — extend the existing block at lines 244-255 (keep its current rules), appending:

```css
	.work-row__arrow {
		transition: none;
	}

	.work-row:hover .work-row__arrow {
		transform: none;
	}

	.work-row:active {
		transform: none;
		transition: none;
	}
```

### `src/pages/work/[slug].astro` — add a new block at the end of the component's `<style>` (after the `@media (hover: hover) and (pointer: fine)` block at 307-317 and the `:active` rule at 318-321):

```css
	@media (prefers-reduced-motion: reduce) {
		.case__next-arrow {
			transition: none;
		}

		.case__next:hover .case__next-arrow {
			transform: none;
		}

		.case__next:active {
			transform: none;
			transition: none;
		}
	}
```

## Repo conventions to follow

- Reduced-motion blocks live at the **end** of each stylesheet, grouped with the other media queries — see the existing pattern at `src/styles/global.css:389-400` and `src/components/WorkList.astro:244-255`.
- Keep existing reduced-motion rules intact; this plan only adds to them.
- Source order matters: the `transform: none` overrides must come **after** the `@media (hover: hover) and (pointer: fine)` blocks so they win the cascade (equal specificity). In `global.css` append to the block at 389 (after the hover block created by plan 002); in `WorkList.astro` append to the block at 244 (after the hover block at 151); in `[slug].astro` place the new block last in the style.

## Steps

1. `src/styles/global.css`: in the `@media (prefers-reduced-motion: reduce)` block at lines 389-400, append the rules shown above (existing two rules stay).
2. `src/components/WorkList.astro`: in the `@media (prefers-reduced-motion: reduce)` block at lines 244-255, append the rules shown above (existing rules stay).
3. `src/pages/work/[slug].astro`: add the new `@media (prefers-reduced-motion: reduce)` block shown above as the last block of the `<style>` section.

## Boundaries

- Do NOT remove or weaken any existing reduced-motion rule (including `WorkList.astro:244-255`'s preview handling and `Hero.astro:138-147`).
- Do NOT touch the skip-link — plan 001 removes its transition entirely; if `plans/001` is already applied, the skip-link needs nothing here. If it is NOT applied, leave the skip-link alone anyway.
- Do NOT change any animation/transition values outside reduced-motion blocks.
- Do NOT change markup.
- If a step doesn't match the code you find (drift since the commit stamp), STOP and report instead of improvising.

## Verification

- **Mechanical**: `pnpm build` completes with no errors.
- **Feel check**: `pnpm dev`, open DevTools → Rendering panel → Emulate `prefers-reduced-motion: reduce`, then on the homepage and a case-study page:
  - Hovering a work row: the arrow **color still turns accent** (state feedback kept) but does not move; the row background still tints.
  - Hovering the hero button: arrow color/position unchanged; the button border/background hover state still appears.
  - Pressing any button/row: no scale dip; the darker `:active` background tint remains.
  - Hovering the email link: the underline **appears instantly** (no left-to-right growth).
  - Nav links: the accent underline **appears instantly** on hover/focus (no scaleX slide).
  - Scroll reveals still fade (existing behavior, 200ms) — not fully disabled.
- **Done when**: with reduced motion emulated, DevTools → Animations panel records zero transform/keyframe animations for the interactions above (opacity-only reveal fades are expected and correct), and every check in the feel list passes.

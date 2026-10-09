# 002 — Gate hover-driven motion behind `@media (hover: hover) and (pointer: fine)`

- **Status**: DONE (executed against working tree; line references shifted by −1 after plan 001)
- **Commit**: cdf9ed1
- **Severity**: MEDIUM
- **Category**: Accessibility (ungated `:hover` motion)
- **Estimated scope**: 1 file, ~2 rule restructures

## Problem

Hover-triggered **motion** in `src/styles/global.css` fires unconditionally, so on touch devices a tap latches it on: the `.btn` arrow slides up-right and the `.link` underline stays drawn after the finger lifts. The repo already knows the fix — two components gate hover motion behind the correct media query:

- `src/components/WorkList.astro:151` — `@media (hover: hover) and (pointer: fine) { … }`
- `src/pages/work/[slug].astro:307` — `@media (hover: hover) and (pointer: fine) { … }`

Global CSS is the outlier. Affected rules (current):

```css
/* src/styles/global.css:235-239 — current */
.link:hover,
.link:focus-visible {
	background-size: 100% 1px;
	color: var(--accent-deep);
}

/* src/styles/global.css:266-269 — current */
.btn:hover {
	border-color: var(--ink);
	background: color-mix(in srgb, var(--ink) 4%, transparent);
}

/* src/styles/global.css:281-285 — current */
.btn--solid:hover {
	background: color-mix(in srgb, var(--ink) 88%, var(--accent));
	border-color: transparent;
	color: var(--paper);
}

/* src/styles/global.css:291-293 — current */
.btn:hover .btn__arrow {
	transform: translate(2px, -2px);
}
```

## Target

All `:hover` rules move inside the media query the repo already uses; `:focus-visible` rules stay outside it so keyboard feedback is untouched:

```css
/* target — src/styles/global.css */
.link:focus-visible {
	background-size: 100% 1px;
	color: var(--accent-deep);
}

@media (hover: hover) and (pointer: fine) {
	.link:hover {
		background-size: 100% 1px;
		color: var(--accent-deep);
	}

	.btn:hover {
		border-color: var(--ink);
		background: color-mix(in srgb, var(--ink) 4%, transparent);
	}

	.btn--solid:hover {
		background: color-mix(in srgb, var(--ink) 88%, var(--accent));
		border-color: transparent;
		color: var(--paper);
	}

	.btn:hover .btn__arrow {
		transform: translate(2px, -2px);
	}
}
```

`transition` declarations on the base rules (`.link` at 230-233, `.btn` at 259-264, `.btn__arrow` at 288) stay where they are — they are state-change timing, not hover triggers.

## Repo conventions to follow

- The gating idiom, verbatim from `src/components/WorkList.astro:151`:
  ```css
  @media (hover: hover) and (pointer: fine) {
  	.work-row:hover {
  		background-color: color-mix(in srgb, var(--ink) 4%, transparent);
  	}
  	/* … */
  }
  ```
- Split the current combined selectors (`:hover, :focus-visible`) into one `:focus-visible` rule outside the query and one `:hover` rule inside it.

## Steps

1. In `src/styles/global.css`, split `.link:hover, .link:focus-visible { … }` (lines 235-239): keep `.link:focus-visible` as a standalone rule in place; move the `.link:hover` selector into a new `@media (hover: hover) and (pointer: fine)` block placed immediately after it.
2. Into that same media block, move the `.btn:hover` rule (266-269) unchanged.
3. Into that same media block, move the `.btn--solid:hover` rule (281-285) unchanged.
4. Into that same media block, move the `.btn:hover .btn__arrow` rule (291-293) unchanged.
5. There must be exactly one `@media (hover: hover) and (pointer: fine)` block in `global.css`; do not create one block per rule.

## Boundaries

- Do NOT touch `src/components/WorkList.astro` or `src/pages/work/[slug].astro` — they already gate correctly.
- Do NOT gate the color-only `:hover` rules in `src/components/SiteHeader.astro:72-75` (`.brand:hover .brand__mark`) — this plan covers motion and the global outliers; color-only hover on touch degrades gracefully. (If you also gate it, that is out of scope and will be reverted.)
- Do NOT change `:focus-visible` behavior anywhere.
- Do NOT modify transitions, easings, or durations.
- If a step doesn't match the code you find (drift since the commit stamp), STOP and report instead of improvising.

## Verification

- **Mechanical**: `pnpm build` completes with no errors.
- **Feel check** — desktop (`pnpm dev`, normal Chrome window):
  - Hovering the hero's "Selected work" button still slides its arrow up-right; hovering the email link still draws its underline.
  - Keyboard-only path unchanged: Tab to the email link — the underline appears on focus without hover.
- **Feel check** — touch (DevTools device toolbar, pick iPhone, or a real phone):
  - Tapping the email link **once** no longer leaves its underline drawn; the underline behavior is absent on touch entirely.
  - Tapping "Selected work" no longer leaves the arrow displaced.
- **Done when**: `grep -n "hover" src/styles/global.css` shows every `:hover` selector inside the single `(hover: hover) and (pointer: fine)` block, and only `:focus-visible` rules outside it.

# 004 — Make the hero button's down-arrow move down on hover, not up-right

- **Status**: DONE (executed with 002/003 applied)
- **Commit**: cdf9ed1
- **Severity**: LOW
- **Category**: Physicality & origin (direction of micro-motion)
- **Estimated scope**: 2 files, ~4 lines

## Problem

One shared hover motion serves both button arrows in the codebase, but the glyphs point in different directions:

- `src/components/Contact.astro:30` — `<span class="btn__arrow" aria-hidden="true">↗</span>` (up-right)
- `src/components/Hero.astro:30` — `<span class="btn__arrow" aria-hidden="true">↓</span>` (down)

`src/styles/global.css:291-293`:

```css
/* src/styles/global.css:291-293 — current */
.btn:hover .btn__arrow {
	transform: translate(2px, -2px);
}
```

The hero's **down** arrow slides **up-right** on hover — directionally wrong. The repo gets this right everywhere else: the diagonal `↗` in `src/components/WorkList.astro:161-163` moves `translate(3px, -3px)` (along its own diagonal) and the horizontal `→` in `src/pages/work/[slug].astro:312-314` moves `translateX(6px)` (along its axis). The hero button is the only mis-aimed motion on the site.

## Target

The default diagonal motion stays for up-right arrows; a modifier moves the down arrow along its own axis (down, on hover — the button scrolls to `#work`):

```css
/* target — src/styles/global.css, inside the hover media block from plan 002 */
.btn:hover .btn__arrow {
	transform: translate(2px, -2px);
}

.btn:hover .btn__arrow--down {
	transform: translateY(2px);
}
```

```astro
<!-- target — src/components/Hero.astro:30 -->
<span class="btn__arrow btn__arrow--down" aria-hidden="true">↓</span>
```

The travel distance is 2px, matching the existing `translate(2px, -2px)` magnitude. No easing or duration changes: `src/styles/global.css:288` (`transition: transform var(--duration) var(--ease-out);`) already covers the modifier since it animates the same property on the same element.

## Repo conventions to follow

- Arrow micro-motion follows the glyph's own direction — exemplars: `src/components/WorkList.astro:161-163` (diagonal) and `src/pages/work/[slug].astro:312-314` (horizontal).
- BEM-style modifier classes on component parts (same pattern as `.btn--solid` in `src/styles/global.css:275-279`): double underscore for the part, double dash for the modifier.

## Steps

1. `src/components/Hero.astro:30`: change `class="btn__arrow"` to `class="btn__arrow btn__arrow--down"`.
2. `src/styles/global.css`: immediately after the `.btn:hover .btn__arrow` rule (291-293), add:
   ```css
   .btn:hover .btn__arrow--down {
   	transform: translateY(2px);
   }
   ```
   (If plan 002 has been applied, both rules live inside the `@media (hover: hover) and (pointer: fine)` block — keep it that way. If plan 002 has NOT been applied, place the new rule directly after line 293 and do not create the media block yourself.)

## Boundaries

- Do NOT change the Contact button (`src/components/Contact.astro:30`) — its `↗` + `translate(2px, -2px)` is correct.
- Do NOT change arrow motion in `WorkList.astro` or `[slug].astro`.
- Do NOT change the easing token or transition duration on `.btn__arrow`.
- If a step doesn't match the code you find (drift since the commit stamp), STOP and report instead of improvising.

## Verification

- **Mechanical**: `pnpm build` completes with no errors.
- **Feel check**: `pnpm dev`, hover the hero's "Selected work" button:
  - The `↓` slides **downward** 2px and back — it points at the work section below and moves the way it points.
  - At 10% Animations playback it is a single clean downward nudge, no diagonal component.
  - Hover the Contact section's email button: its `↗` still slides up-right along its diagonal.
  - Keyboard focus does not displace either arrow (motion is hover-only; focus feedback is the outline).
- **Done when**: the hero arrow translates only on the Y axis on hover, the contact arrow behavior is unchanged, and `pnpm build` passes.

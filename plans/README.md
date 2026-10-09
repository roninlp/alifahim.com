# Animation improvement plans

Plans produced by `improve-animations` against commit `cdf9ed1` ("Initial commit from Astro"). Each plan is self-contained: an executor with zero context needs nothing beyond the plan file itself. Execute with `improve-animations execute <plan>`, or hand any plan to any agent.

## Plans

| # | Title | Severity | Status |
|---|-------|----------|--------|
| 001 | Make the skip-link appear instantly on keyboard focus | HIGH | DONE |
| 002 | Gate hover-driven motion behind `@media (hover: hover) and (pointer: fine)` | MEDIUM | DONE |
| 003 | Complete `prefers-reduced-motion` coverage for surviving movement | MEDIUM | DONE |
| 004 | Make the hero button's down-arrow move down on hover, not up-right | LOW | DONE |
| 005 | Retarget the preview crossfade to motion tokens | LOW | DONE |
| 006 | Rebuild the `.link` underline as a transform, not a painted gradient | LOW | DONE |
| 007 | Make press feedback snap: asymmetric press/release timing | LOW | DONE |
| 008 | Carry the row → case-study seam with cross-document view transitions | LOW (opportunity) | DONE |
| 009 | Give the case-study cover an image-appropriate reveal | LOW (opportunity) | DONE |

## Recommended execution order

`001 → 002 → 006 → 003 → 004 → 005 → 007 → 009 → 008`

## Dependencies

| Plan | Depends on | Why |
|------|------------|-----|
| 003 | 001, 002, **006** | Its `.link` reduced-motion rules target 006's rebuilt `::after` underline (a fallback for the pre-006 shape is included in the plan). It also appends to the same hover/reduced-motion blocks 001 and 002 restructure — run it after them. |
| 004 | 002 | The new `.btn:hover .btn__arrow--down` rule must land inside 002's hover media block. |
| 006 | 002 | Its hover selectors must land inside 002's hover media block. |
| 008 | 009 *(optional step only)* | Both touch the case-study `<img>`; 008's optional shared-cover step assumes 009's markup may already be applied and says how to merge. |
| 001, 002, 005, 007, 009 | — | Independent; 005 can run any time. |

Conflicts to watch: 001/002/003/006 all edit `src/styles/global.css`. They were written against the same commit and are order-compatible **in the sequence above**; if executed out of order, re-check the merged CSS against each plan's Target block.

## Verification

Each plan carries its own mechanical (`pnpm build`) and feel-check steps. After the whole set, one combined pass is worth doing:

- Reduced motion emulated: no movement anywhere, all state feedback (colors, instant underlines) intact.
- Touch emulation: no latched hover states.
- Keyboard-only pass: skip-link instant, focus underlines instant, arrow motion absent.
- 10% Animations playback on the work list: preview crossfade settles, arrows move along their glyph direction, press snaps and releases.

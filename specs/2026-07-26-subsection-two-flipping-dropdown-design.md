# Subsection Two Flipping Dropdown — Design Spec

**Date:** 2026-07-26
**Status:** Approved

## Overview

Section Three Tab Two's Subsection Two list sits inside a scrollable
container (`.section-three__scroll-list`, `max-height: 180px;
overflow-y: auto`). The existing `Dropdown` component's options menu opens
downward and gets clipped by that container's boundary when the trigger is
near the bottom of the visible scroll window. This adds a new component,
`FlippingDropdown`, used only in Subsection Two's list, that opens its menu
upward instead of downward when there isn't enough room below — without
using a React portal.

## Goals

- A dropdown near the bottom of Subsection Two's scrollable list opens its
  menu upward (above the trigger) instead of being clipped.
- A dropdown with enough room below still opens downward, as today.
- Subsection Three's list (which uses the original `Dropdown`) is
  completely unaffected — same clipping behavior as before this change.

## Non-Goals

- Pixel-perfect positioning — the "is there enough room" check is a
  heuristic based on `options.length`, not a measurement of the
  already-rendered menu (the menu isn't rendered until it opens).
- Using a React portal — explicitly ruled out.
- Changing the original `Dropdown` component in any way — it continues to
  serve Subsection Three exactly as before.
- Handling the case where there's insufficient room in *both* directions
  (e.g. a very short scroll window) — flipping up is a best-effort
  improvement, not a guarantee against all clipping.

## New Component: `FlippingDropdown`

New component at `src/components/FlippingDropdown/`
(`FlippingDropdown.js` + `FlippingDropdown.scss`) — a fork of `Dropdown`
with the same public API and appearance, plus flip-on-open behavior.

**API:** `<FlippingDropdown options={string[]} />` — identical to
`Dropdown`.

**State:** same `isOpen`/`selected` as `Dropdown`, plus `openUpward`
(boolean, default `false`).

**Flip decision (runs when the trigger is clicked to open the menu):**

1. Starting from the trigger's DOM node, walk up through `parentElement`
   looking for the nearest ancestor whose computed `overflow-y` is `auto`
   or `scroll` and whose `scrollHeight > clientHeight` (i.e. it's actually
   scrolling). In this app, that ancestor is `.section-three__scroll-list`.
   If no such ancestor is found, use the browser viewport
   (`window.innerHeight`) as the boundary instead.
2. Measure the space available below the trigger within that boundary:
   `boundaryBottom - triggerRect.bottom` (via `getBoundingClientRect()`).
3. Estimate the menu's height from the option count: `options.length * 36
   + 10` (36px per option row, 10px for the menu's border/margin — sized to
   match `Dropdown.scss`'s existing option padding/border values).
4. If available space is less than the estimated height, set
   `openUpward = true` for this open; otherwise `false`.

This recomputes on every open (not just once on mount), since the list's
scroll position can change between opens.

**Rendering:** when `openUpward` is `true`, the menu gets an additional
`flipping-dropdown__menu--upward` class that switches its positioning from
`top: 100%; margin-top: 4px` to `bottom: 100%; margin-bottom: 4px`, so it
renders directly above the trigger instead of below it. All other markup,
ARIA attributes (`aria-haspopup`, `aria-expanded`, `role="listbox"`/
`"option"`), outside-click-to-close behavior, and styling are identical to
`Dropdown`.

## Wiring

`SectionThree.js`'s Subsection Two list block switches its import from
`Dropdown` to `FlippingDropdown` and uses it in place of `Dropdown` for
each list item. Subsection Three's list block is untouched, still using
`Dropdown`.

## Testing

No new test coverage — consistent with the existing specs' stance that this
is a layout scaffold, not a feature requiring thorough testing.

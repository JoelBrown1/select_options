# Subsection Three Portal Dropdown — Design Spec

**Date:** 2026-07-27
**Status:** Approved

## Overview

Section Three Tab Two's Subsection Three list sits inside a scrollable
container (`.section-three__scroll-list`, `max-height: 180px;
overflow-y: auto`) — the same setup as Subsection Two. The existing
`Dropdown` component's options menu opens downward and gets clipped by
that container's boundary when the trigger is near the bottom of the
visible scroll window, exactly like Subsection Two's problem before it
switched to `FlippingDropdown`. This adds a new component,
`PortalDropdown`, used only in Subsection Three's list, that renders its
options menu via `ReactDOM.createPortal` into `document.body` — escaping
the scrollable container's clipping entirely, rather than flipping
direction.

## Goals

- Subsection Three's dropdown menu is never clipped by the list's
  `overflow-y: auto` boundary, regardless of where the trigger sits in the
  scroll window.
- Subsection Two (`FlippingDropdown`) and the original `Dropdown` component
  are completely unaffected.
- Scroll behavior while the menu is open is controlled by a module-level
  constant, `REPOSITION_ON_SCROLL` (default `false`), so a developer can
  flip one line to switch between "close on scroll" and "reposition live
  on scroll" without touching any other code.

## Non-Goals

- Pixel-perfect placement in all edge cases (e.g. a trigger near the very
  bottom of the browser viewport) — same heuristic-not-guarantee stance as
  `FlippingDropdown`.
- Flip-upward behavior — the portal already solves the clipping problem
  this app cares about, so `PortalDropdown` always opens downward.
- Changing `Dropdown.js`/`Dropdown.scss`, `FlippingDropdown.js`/
  `FlippingDropdown.scss`, `Tabs.js`/`Tabs.scss`, or `SectionThree.scss`.
- Handling window resize/scroll edge cases beyond the two toggleable
  behaviors described below (e.g. no debouncing/throttling of handlers).

## New Component: `PortalDropdown`

New component at `src/components/PortalDropdown/`
(`PortalDropdown.js` + `PortalDropdown.scss`) — a fork of `Dropdown` with
the same public API and appearance, plus portal rendering and
position tracking.

**API:** `<PortalDropdown options={string[]} />` — identical to
`Dropdown`.

**State:** `isOpen`, `selected` (same as `Dropdown`), plus `menuPosition`
(`{ top, left, minWidth } | null`) used to position the portaled menu.

**Refs:** `rootRef` (wraps the trigger button, same role as in `Dropdown`)
and `menuRef` (the portaled menu element itself). A portal moves the menu
to a different location in the real DOM (`document.body`), so the
existing outside-click check (`rootRef.current.contains(event.target)`)
would incorrectly treat a click on a menu option as "outside" and close
the menu before the option's own click handler runs. Fix: the
outside-click handler closes the menu only when the click target is
contained in **neither** `rootRef` **nor** `menuRef`.

**Opening (trigger click):**

1. Compute `rootRef.current.getBoundingClientRect()`.
2. Set `menuPosition` to `{ top: rect.bottom + 4, left: rect.left,
   minWidth: rect.width }`.
3. Set `isOpen = true`.

Always opens downward — no flip logic, per Non-Goals.

**Scroll/resize behavior while open**, gated by a module-level constant:

```js
const REPOSITION_ON_SCROLL = false;
```

While `isOpen`, attach:
- `window.addEventListener('scroll', handler, true)` — capture phase, so
  it fires for scroll events on the inner scrollable list too, not just
  window-level scroll (scroll events don't bubble, but capture-phase
  listeners on an ancestor still see them).
- `window.addEventListener('resize', handler)`

Both removed on close/unmount.

- **`REPOSITION_ON_SCROLL = false`** (default): `handler` calls
  `setIsOpen(false)` — same effect as an outside click.
- **`REPOSITION_ON_SCROLL = true`**: `handler` recomputes
  `rootRef.current.getBoundingClientRect()` and updates `menuPosition`, so
  the menu tracks the trigger live.

**Rendering:** the trigger button renders inline as usual. The menu
(when `isOpen`) is rendered via
`ReactDOM.createPortal(<div ref={menuRef} className="portal-dropdown__menu" style={{ position: 'fixed', top: menuPosition.top, left: menuPosition.left, minWidth: menuPosition.minWidth }}>...</div>, document.body)`.
All ARIA attributes (`aria-haspopup`, `aria-expanded`, `role="listbox"`/
`"option"`) and option click behavior are identical to `Dropdown`.

**Styling:** `PortalDropdown.scss` defines `portal-dropdown__trigger`,
`portal-dropdown__menu`, and `portal-dropdown__option` classes matching
the existing neutral palette (`#1f2937` text, `#e5e7eb` hover, `#d1d5db`
border) copied from `Dropdown.scss`. Unlike the other two dropdowns, the
menu's position comes from inline styles (computed rect), not
`top: 100%` CSS, since it's no longer positioned relative to its trigger
in the DOM.

## Wiring

`SectionThree.js`'s Subsection Three list block switches its import from
`Dropdown` to `PortalDropdown` and uses it in place of `Dropdown` for each
list item. Subsection Two's list block (`FlippingDropdown`) is untouched.

## Testing

No new permanent test coverage — consistent with the existing specs'
stance that this is a layout scaffold, not a feature requiring thorough
testing. A throwaway verification test during implementation is
acceptable but must be deleted before committing.

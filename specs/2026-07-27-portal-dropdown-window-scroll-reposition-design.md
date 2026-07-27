# PortalDropdown Window-Scroll Reposition — Design Spec

**Date:** 2026-07-27
**Status:** Approved

## Overview

`MainContent`'s `overflow-y: auto` has been removed (its own scrollbar no
longer exists), so the browser window/page itself now scrolls whenever
content overflows the viewport, instead of `MainContent` scrolling
internally. Previously, `PortalDropdown`'s scroll handler treated a
window/page-level scroll (`event.target === document`) as a no-op,
because in the old layout that case rarely mattered — `MainContent`'s own
scroll container absorbed almost all scrolling. Now that page scroll is
the primary way users scroll this app, that no-op leaves the portaled
menu visually stuck in place while its trigger button moves underneath
it as the page scrolls. This change makes window/page-level scroll
reposition the menu instead, keeping it visually attached to its trigger.

## Goals

- While a `PortalDropdown` menu is open, scrolling the page (window-level
  scroll, `event.target === document`) recomputes and updates the menu's
  position so it stays in the same relative position under/against its
  trigger button.
- This reposition-on-window-scroll behavior is unconditional — it does
  not depend on the `REPOSITION_ON_SCROLL` module constant.
- The existing scrollable-ancestor-list behavior (e.g. Subsection Two/
  Three's internal 180px scroll lists) is unchanged: still governed by
  `REPOSITION_ON_SCROLL` (currently `false`, i.e. closes the menu).
- `handleResize`'s behavior is unchanged.

## Non-Goals

- No change to `REPOSITION_ON_SCROLL`'s meaning or value for the
  scrollable-ancestor case.
- No throttling/debouncing of the scroll handler — matches this
  component's existing unthrottled approach.
- No removal of the existing debug `console.log` statements currently in
  `PortalDropdown.js`'s working tree (kept intentionally, per explicit
  instruction) — the implementation diff only changes the no-op `return`
  inside the `event.target === document` branch into a reposition call.
- No change to `Dropdown.js`, `FlippingDropdown.js`, `Tabs.js`/`.scss`, or
  `SectionThree.js`/`.scss`.

## Preexisting Working-Tree State

Two changes already exist, uncommitted, ahead of this work and are the
premise for it:
- `MainContent.scss`: `overflow-y: auto` commented out (the condition
  this spec responds to).
- `PortalDropdown.js`: several debug `console.log` statements added
  (`isOpen changed`, `scroll event`, `trigger clicked`, etc.), kept
  intentionally per instruction.

Both are committed as part of this task's setup, since the fix here only
makes sense given the `MainContent.scss` change, and the console logs are
to be preserved rather than stripped.

## Implementation

In `src/components/PortalDropdown/PortalDropdown.js`'s `handleScroll`,
the `event.target === document` branch changes from a no-op `return` to
repositioning before returning:

```js
function handleScroll(event) {
  console.log('scroll event', event.target);
  if (event.target === document) {
    console.log('scrolling on the window');
    setMenuPosition(computeMenuPosition(rootRef.current));
    return;
  }

  if (REPOSITION_ON_SCROLL) {
    setMenuPosition(computeMenuPosition(rootRef.current));
  } else {
    setIsOpen(false);
  }
}
```

`computeMenuPosition` already derives its coordinates from
`rootElement.getBoundingClientRect()`, which the browser recomputes
relative to the current viewport/scroll position on every call — so
recomputing it on each window scroll event correctly keeps the
`position: fixed` menu aligned with the trigger's current on-screen
location. No other part of `computeMenuPosition`, the outside-click
handler, or `handleResize` changes.

## Testing

No new permanent test coverage. A throwaway verification test during
implementation should cover: dispatching a scroll event with
`target: document` while the menu is open results in `setMenuPosition`
being invoked with an updated position (observable via the menu's inline
`style.top`/`style.left` reflecting a new `getBoundingClientRect()` mock),
and that the menu stays open (not closed) in this case. Delete the test
file before committing, per this codebase's existing convention.

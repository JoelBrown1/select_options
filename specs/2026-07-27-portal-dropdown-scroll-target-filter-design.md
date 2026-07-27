# PortalDropdown Scroll Target Filter — Design Spec

**Date:** 2026-07-27
**Status:** Approved

## Overview

`PortalDropdown`'s scroll/resize effect currently attaches a single
`window.addEventListener('scroll', handler, true)` (capture phase) that
fires for both window/page-level scroll and scroll on any inner
scrollable ancestor (e.g. `.section-three__scroll-list`), and treats them
identically — closing the menu (or repositioning it, if
`REPOSITION_ON_SCROLL` is `true`). This change makes the handler ignore
window/page-level scroll entirely, while still acting on scroll of the
scrollable ancestor (or any other scrollable element).

## Goals

- Scrolling the trigger's scrollable ancestor (or any other scrollable
  element on the page) still closes the menu by default, or repositions
  it if `REPOSITION_ON_SCROLL` is flipped to `true` — unchanged from
  today.
- Scrolling the window/page itself no longer closes or repositions the
  open menu.
- No change to click-outside behavior, `computeMenuPosition`, the
  `resize` listener, or anything else in `PortalDropdown.js`.
- No changes to `Dropdown.js`/`.scss`, `FlippingDropdown.js`/`.scss`,
  `SectionThree.js`/`.scss`, or any other file — this is a single
  targeted change inside the existing scroll handler in
  `PortalDropdown.js`.

## Non-Goals

- No new component, prop, or additional toggle — this refines the
  existing scroll handler, it doesn't add new configuration surface.
- No change to `resize` handling — window resize continues to use
  `REPOSITION_ON_SCROLL` exactly as before; resize doesn't have a
  window-vs-element ambiguity to resolve.
- No attempt to distinguish "scrollable ancestor of this specific
  trigger" from "some other unrelated scrollable element on the page" —
  any non-window scroll target still triggers the existing behavior,
  matching the codebase's existing heuristic-not-guarantee stance (e.g.
  `FlippingDropdown`'s scrollable-ancestor detection is similarly
  approximate).

## Detection Method

A window/page-level scroll event's `target` is `document`; a scroll
event dispatched by an inner `overflow: auto`/`scroll` element has that
element as its `target`. The handler checks `event.target === document`
and returns early (no-op) in that case; any other target proceeds with
the existing `REPOSITION_ON_SCROLL` branch.

## Implementation

In `src/components/PortalDropdown/PortalDropdown.js`, `handleScrollOrResize`
becomes scroll-event-aware:

```js
function handleScroll(event) {
  if (event.target === document) {
    return;
  }

  if (REPOSITION_ON_SCROLL) {
    setMenuPosition(computeMenuPosition(rootRef.current));
  } else {
    setIsOpen(false);
  }
}

function handleResize() {
  if (REPOSITION_ON_SCROLL) {
    setMenuPosition(computeMenuPosition(rootRef.current));
  } else {
    setIsOpen(false);
  }
}

window.addEventListener('scroll', handleScroll, true);
window.addEventListener('resize', handleResize);
return () => {
  window.removeEventListener('scroll', handleScroll, true);
  window.removeEventListener('resize', handleResize);
};
```

(The shared `REPOSITION_ON_SCROLL` branch is duplicated between
`handleScroll` and `handleResize` rather than kept as one function taking
an event, since `handleResize`'s `Event` has no meaningful `target` to
check — this keeps each handler's intent explicit rather than passing an
unused parameter through a shared function just to satisfy one caller.)

## Testing

No new permanent test coverage. A throwaway verification test during
implementation should cover: (1) scrolling a nested scrollable container
closes the open menu (default `REPOSITION_ON_SCROLL = false`), and (2)
dispatching a scroll event with `target: document` does NOT close the
open menu. Delete the test file before committing, per this codebase's
existing convention.

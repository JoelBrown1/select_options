# Section Three List Item Dropdown — Design Spec

**Date:** 2026-07-26
**Status:** Approved

## Overview

Add an interactive dropdown menu (3 options) and a small button to each of
the 20 items in Section Three's Tab Two, Subsection Two scrollable list
(introduced in `2026-07-26-section-three-subsection-two-scroll-list-design.md`).

## Goals

- Each of the 20 `<li>` items shows: its "List Item N" label, a custom
  dropdown with 3 options ("Option A", "Option B", "Option C"), and a small
  button ("Go") to the dropdown's right.
- The dropdown is a custom-built component (not a native `<select>`): a
  trigger button that toggles a visible options menu, with its own
  open/closed state, closes on outside click, and shows the selected option
  once one is picked.
- The button is purely visual — no `onClick` handler, consistent with this
  app's placeholder/no-backend scope.

## Non-Goals

- Any real action on dropdown selection or button click — both are visual
  only, no console logging, no state lifted outside each list item.
- Preventing dropdown-menu clipping by the scroll list's `overflow-y: auto`
  boundary. Menus on items near the bottom of the visible 180px window may
  be visually clipped; this is an accepted tradeoff for this placeholder
  app (see "Known Limitation" below), not a bug to fix here.
- Changes to Subsections One, Three, Four, Five, or Tab One.
- Changes to the `Tabs` component (`src/components/Tabs/`).

## New Component: `Dropdown`

New component at `src/components/Dropdown/` (`Dropdown.js` + `Dropdown.scss`),
following the same pattern as the existing `Tabs` component.

**API:**

```jsx
<Dropdown options={['Option A', 'Option B', 'Option C']} />
```

- `options`: array of option label strings.
- Internal `useState`: `isOpen` (boolean, default `false`), `selected`
  (string, default `null`).
- Renders a trigger `<button>` showing `selected` if set, otherwise
  "Select...". Clicking the trigger toggles `isOpen`.
- When `isOpen`, renders a menu (`role="listbox"`) of `options` as
  `role="option"` buttons below the trigger. Clicking an option sets it as
  `selected` and closes the menu (`isOpen` → `false`).
- A `ref` on the component's root plus a `document` click-listener effect
  closes the menu when a click occurs outside the dropdown (standard
  outside-click pattern; naturally also closes it when a different
  dropdown's trigger is clicked, since that click is outside this
  instance's ref).
- ARIA: trigger button has `aria-haspopup="listbox"` and
  `aria-expanded={isOpen}`.

## List Item Structure

Subsection Two's content switches from 20 literal `<li>` tags to a
data-driven list: an array of 20 items (e.g. via
`Array.from({ length: 20 }, (_, i) => i + 1)`) mapped to `<li>` elements.
Each `<li>` renders, as a flex row:

```jsx
<li key={n} className="section-three__scroll-list-item">
  <span className="section-three__scroll-list-item-label">List Item {n}</span>
  <div className="section-three__scroll-list-item-actions">
    <Dropdown options={['Option A', 'Option B', 'Option C']} />
    <button type="button" className="section-three__scroll-list-item-button">Go</button>
  </div>
</li>
```

This is a deliberate switch from the file's existing convention of literal
JSX blocks: 20 hand-written copies of an interactive component instance
would be error-prone to keep in sync, unlike the plain-text content used
elsewhere in this file.

## Styling

**`Dropdown.scss`:** trigger button styled consistently with the app's
existing neutral gray palette (`#1f2937` text, `#e5e7eb` hover, `#d1d5db`
border — matching `Tabs.scss`/`Sidebar.scss`). The options menu is
absolutely positioned directly below the trigger, with the same border/
background treatment, each option a full-width button with hover
highlighting.

**`SectionThree.scss` additions:** `.section-three__scroll-list-item`
becomes a flex row (`justify-content: space-between`, `align-items: center`)
replacing the existing plain `<li>` padding rule's block layout.
`.section-three__scroll-list-item-actions` is a flex row (small `gap`)
grouping the dropdown and button on the right. The button is styled smaller
than the dropdown trigger (reduced padding/font-size) to read as secondary.

## Known Limitation

Because `.section-three__scroll-list` clips overflow (`overflow-y: auto`)
to enforce the ~5-item visible window, an open dropdown menu on a list item
near the bottom of that visible window may be partially or fully clipped,
since the menu is a normal absolutely-positioned child and gets clipped by
the same ancestor. Working around this (e.g. via a React portal rendering
the menu into `document.body`) was explicitly considered and rejected as
unnecessary complexity for this placeholder/demo app — scrolling the item
into better view before opening its dropdown is an acceptable workaround.

## Testing

No new test coverage — consistent with the existing specs' stance that this
is a layout scaffold, not a feature requiring thorough testing.

# Section Three Subsection Two Scroll List — Design Spec

**Date:** 2026-07-26
**Status:** Approved

## Overview

Replace Section Three Tab Two's "Subsection Two" placeholder paragraphs
(introduced in `2026-07-26-section-three-tab-two-subsections-design.md`)
with a 20-item unordered list rendered inside a fixed-height container that
shows roughly 5 items at a time, scrolling internally via `overflow-y: auto`.

## Goals

- Subsection Two (inside Tab Two) renders a `<ul>` with 20 `<li>` items,
  labeled "List Item 1" through "List Item 20".
- The `<ul>` has a fixed `max-height` sized to show ~5 items before
  scrolling, with `overflow-y: auto` so it scrolls independently of the
  page.
- The list is visually distinct as a bounded, scrollable box (border +
  per-item dividers), not just plain running text.

## Non-Goals

- Changes to Subsections One, Three, Four, or Five — only Subsection Two's
  content changes.
- Changes to the generic `Tabs` component (`src/components/Tabs/`) or
  `Tabs.scss`.
- Changes to `MainContent`'s page-level scroll behavior — this is a
  separate, nested scroll container, not a replacement for it.
- Real list content — items are placeholder labels, consistent with the
  rest of the app.

## Content

Subsection Two's existing 3 `<p>` paragraphs are removed and replaced by:

```jsx
<ul className="section-three__scroll-list">
  <li>List Item 1</li>
  ...
  <li>List Item 20</li>
</ul>
```

## Styling

Added to the existing `SectionThree.scss`:

- `.section-three__scroll-list`: `list-style: none`, no default `<ul>`
  margin/padding, `max-height: 180px` (tuned to show ~5 items given the
  per-item padding below), `overflow-y: auto`, `border: 1px solid #d1d5db`
  (matches the border color already used in `Tabs.scss`) so the container
  reads as a distinct bounded box.
- List items: `padding: 8px 12px`, `border-bottom: 1px solid #e5e7eb`
  (matches the existing hover/divider color used in `Sidebar.scss`), with
  the last item's border removed so the box doesn't end on a double border.

## Testing

No new test coverage — consistent with the existing specs' stance that this
is a layout scaffold, not a feature requiring thorough testing.

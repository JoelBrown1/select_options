# Subsection Four Item List — Design Spec

**Date:** 2026-07-27
**Status:** Approved

## Overview

Section Three Tab Two's Subsection Four currently has only paragraph
placeholder text. This adds a small, non-scrolling unordered list of 3
items below that text, distinct in style and purpose from Subsections
Two and Three's 20-item scrollable lists. Each item has a name and a
container holding two `PortalDropdown` components, each offering 3
options — one dropdown reuses the existing shared option set, the other
uses a new, distinct option set, so the two are visually distinguishable.

## Goals

- Subsection Four's existing paragraphs remain unchanged; the new list is
  added below them.
- The new list has exactly 3 items, each with a name and a container of 2
  `PortalDropdown`s.
- The list's styling is new and distinct from `.section-three__scroll-list`
  — no outer border, no `max-height`/`overflow-y: auto` (unnecessary for
  3 items).
- Both `Dropdown`, `FlippingDropdown`, existing `PortalDropdown` component
  code, and Subsections One/Two/Three/Five are untouched — `PortalDropdown`
  is reused as-is, not modified.

## Non-Goals

- No new dropdown component or variant — this reuses `PortalDropdown`
  exactly as built for Subsection Three.
- No scrolling behavior for the new list.
- No interactivity beyond what `PortalDropdown` already provides (no
  "Go" button, unlike Subsections Two/Three's list items).

## Data

Two new constants in `SectionThree.js`, alongside the existing
`DROPDOWN_OPTIONS`:

```js
const SUBSECTION_FOUR_ITEM_NAMES = ['Item One', 'Item Two', 'Item Three'];
const SECONDARY_DROPDOWN_OPTIONS = ['Choice X', 'Choice Y', 'Choice Z'];
```

Each list item renders one `PortalDropdown` with `DROPDOWN_OPTIONS` and
one with `SECONDARY_DROPDOWN_OPTIONS`.

## Markup

Added inside `TAB_TWO_CONTENT`, directly below Subsection Four's existing
three `<p>` tags:

```jsx
<ul className="section-three__item-list">
  {SUBSECTION_FOUR_ITEM_NAMES.map((name) => (
    <li key={name} className="section-three__item-list-row">
      <span className="section-three__item-list-name">{name}</span>
      <div className="section-three__item-list-dropdowns">
        <PortalDropdown options={DROPDOWN_OPTIONS} />
        <PortalDropdown options={SECONDARY_DROPDOWN_OPTIONS} />
      </div>
    </li>
  ))}
</ul>
```

## Styling

New classes in `SectionThree.scss`, following the file's existing BEM-ish
naming and neutral palette conventions:

- `.section-three__item-list`: `list-style: none; margin: 0; padding: 0;`
  — no border (unlike `.section-three__scroll-list`).
- `.section-three__item-list-row`: `display: flex; align-items: center;
  justify-content: space-between; padding: 8px 12px; border-bottom: 1px
  solid #e5e7eb;` with `&:last-child { border-bottom: none; }` — same row
  look as `.section-three__scroll-list-item` minus the outer scroll
  container.
- `.section-three__item-list-name`: no special styling needed beyond
  inheriting body text.
- `.section-three__item-list-dropdowns`: `display: flex; align-items:
  center; gap: 8px;` — holds the two `PortalDropdown`s side by side.

## Testing

No new permanent test coverage — consistent with the existing specs'
stance that this is a layout scaffold. A throwaway verification test
during implementation is acceptable but must be deleted before
committing.

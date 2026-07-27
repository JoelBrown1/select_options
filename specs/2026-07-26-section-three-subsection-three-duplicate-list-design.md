# Section Three Subsection Three Duplicate List — Design Spec

**Date:** 2026-07-26
**Status:** Approved

## Overview

Duplicate Section Three Tab Two's Subsection Two scrollable list (20 items,
each with a dropdown and "Go" button) into Subsection Three, replacing its
existing 3 lorem ipsum paragraphs.

## Goals

- Subsection Three renders the same list structure as Subsection Two: a
  `<ul className="section-three__scroll-list">` of 20 `<li>` items, each
  with a "List Item N" label, a `Dropdown` (3 options), and a "Go" button.
- The two lists (Subsection Two's and Subsection Three's) are fully
  independent component instances — opening/selecting in one has no effect
  on the other.
- Subsection Three's existing 3 paragraphs are removed.

## Non-Goals

- Any new styling — reuses the existing `.section-three__scroll-list`,
  `.section-three__scroll-list-item`, `.section-three__scroll-list-item-actions`,
  and `.section-three__scroll-list-item-button` classes as-is.
- Changes to the `Dropdown` or `Tabs` components.
- Changes to Subsections One, Four, or Five, or Tab One.
- Differentiating the two lists' content (item labels, dropdown options) —
  both are exact duplicates of the same 20 items and 3 options.

## Content

Subsection Three's 3 `<p>` paragraphs are replaced by a second
`<ul className="section-three__scroll-list">`, structurally identical to
Subsection Two's, reusing the already-defined `LIST_ITEM_NUMBERS` and
`DROPDOWN_OPTIONS` constants in `SectionThree.js` (no new data needed since
both lists show the same 20 numbered items and the same 3 dropdown
options).

## Testing

No new test coverage — consistent with the existing specs' stance that this
is a layout scaffold, not a feature requiring thorough testing.

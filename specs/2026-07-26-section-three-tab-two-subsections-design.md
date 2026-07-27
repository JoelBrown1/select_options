# Section Three Tab Two Subsections — Design Spec

**Date:** 2026-07-26
**Status:** Approved

## Overview

Expand Section Three's "Tab Two" content (introduced in
`2026-07-26-section-three-tabs-design.md`) from 3 flat paragraphs into 5
subsections, each with its own heading and placeholder text, with enough
total content that the page visibly overflows and scrolls.

## Goals

- Tab Two shows 5 subsections, each with an `<h2>` subheading followed by
  2-3 lorem ipsum paragraphs.
- Combined content is long enough that `MainContent`'s existing scroll
  behavior (`overflow-y: auto`) is visibly triggered when Tab Two is active.
- Tab One is unchanged.

## Non-Goals

- Changes to the generic `Tabs` component (`src/components/Tabs/`) — this
  is purely additional content inside `SectionThree`'s existing
  `TAB_TWO_CONTENT` constant.
- A new or independent scroll container for the tab panel — scrolling
  continues to rely on `MainContent`'s existing `overflow-y: auto`, the
  same mechanism every other section already uses.
- Real content — subsections use placeholder (lorem ipsum) text, consistent
  with the rest of the app.

## Content

`TAB_TWO_CONTENT` becomes 5 subsections, each:
- An `<h2>` heading: "Subsection One" through "Subsection Five".
- 2-3 `<p>` paragraphs of lorem ipsum text.

Total length is enough to make `MainContent` scroll when Tab Two is active
(comparable in length to one of the existing flat section pages like
`SectionOne`).

## Styling

Add a new `SectionThree.scss` (following the app's one-scss-per-component
pattern — `SectionThree.js` currently has no dedicated stylesheet since it
only used plain `<p>` tags before), with a small top margin on subsection
`<h2>` elements so consecutive subsections are visually separated. No
changes to `Tabs.scss`.

## Testing

No new test coverage — consistent with the existing specs' stance that this
is a layout scaffold, not a feature requiring thorough testing.

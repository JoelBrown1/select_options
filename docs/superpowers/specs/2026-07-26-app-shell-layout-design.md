# App Shell Layout — Design Spec

**Date:** 2026-07-26
**Status:** Approved

## Overview

A single-page React application with a fixed header, a fixed left-hand navigation
sidebar, and a scrollable main content area. The left nav contains 5 flat links
that route to different content sections. This is phase 1 (basic layout shell);
a future phase will add dropdown menu functionality (the project's working name,
"scrolling_dropdowns", refers to that upcoming feature — it is out of scope here).

## Goals

- Header stays pinned at the top of the browser window at all times.
- Left nav sits directly under the header, stays fixed (does not scroll away).
- Main content area scrolls independently when its content overflows.
- Navigating between the 5 sections updates the browser URL (shareable/bookmarkable,
  back/forward button support).

## Non-Goals

- Dropdown menus / expandable nav items (future phase).
- Nested or grouped navigation (nav is a flat list of 5 links).
- Real content — sections use placeholder (lorem ipsum) text.
- Elaborate test coverage — this is a layout scaffold.

## Tech Stack

- **Scaffolding:** Create React App (`react-scripts`)
- **React version:** 16
- **Routing:** `react-router-dom` v5 (`BrowserRouter`, `Switch`, `Route`, `NavLink`, `Redirect`)
- **Styling:** SCSS. One `.scss` file per component, imported directly into that
  component's `.js` file (no CSS Modules, no styled-components).
- **Testing:** Default CRA Jest + React Testing Library smoke test.

## Layout Approach: Nested Flexbox

The outer app wrapper is a flex column filling the viewport (`height: 100vh`):

1. `<Header />` — fixed height (e.g. `60px`), full width, top of the column.
2. A flex row below it, filling remaining vertical space (`flex: 1`, `display: flex`),
   containing:
   - `<Sidebar />` — fixed width (e.g. `220px`), `overflow: hidden` (does not scroll).
   - `<MainContent />` — `flex: 1`, `overflow-y: auto` (scrolls independently).

This avoids `position: fixed` + manual `margin`/`calc()` offsets. If header height
or sidebar width change later, no other component needs updating — the flexbox
sizing adapts automatically. This also keeps things simple for the future dropdown
work, since header/sidebar dimensions won't be hardcoded elsewhere.

Rejected alternatives:
- **CSS Grid (`grid-template-areas`):** clean for a 2×2 region layout, but adds
  ceremony for only 3 regions, and mixing `position: sticky` header inside a grid
  is fiddlier than plain flex nesting.
- **`position: fixed` + margin offsets:** simple to reason about at first, but every
  future header/sidebar size change requires updating offsets in two places —
  fragile as the app grows.

## Component Structure

```
src/
  App.js                        — BrowserRouter setup, renders layout shell
  App.scss
  components/
    Header/
      Header.js                 — top bar, fixed height
      Header.scss
    Sidebar/
      Sidebar.js                — left nav, 5 flat NavLinks
      Sidebar.scss
    MainContent/
      MainContent.js            — flex:1, overflow-y:auto, renders <Switch> of routes
      MainContent.scss
    pages/
      SectionOne.js ... SectionFive.js   — each renders a heading + lorem ipsum
```

## Routing

- Five routes: `/section-one` through `/section-five`.
- `/` redirects to `/section-one`.
- Unmatched paths redirect to `/section-one` (simple fallback, no dedicated 404 page
  needed for this phase).
- Sidebar links use `NavLink` so the active route is styleable (groundwork for later,
  not a hard requirement now).

## Content

Each of the 5 page components renders a heading and several paragraphs of lorem
ipsum — enough text that `MainContent` visibly overflows and scrolls, demonstrating
the layout behavior.

## Testing

Keep the default CRA smoke test (`App.test.js` — renders without crashing). No
additional test coverage planned for this layout scaffold.

## Future Work (explicitly out of scope)

- Dropdown menu functionality (the feature this project is ultimately named for).

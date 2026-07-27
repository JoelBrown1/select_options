# Section Three Tabs — Design Spec

**Date:** 2026-07-26
**Status:** Approved

## Overview

Replace the flat lorem-ipsum content in `SectionThree` with a 2-tab system: two
tabs, each showing a different block of placeholder content, switched via a
new reusable `Tabs` component.

## Goals

- `SectionThree` shows two tabs ("Tab One" / "Tab Two"), each with distinct
  placeholder (lorem ipsum) content.
- Clicking a tab switches the visible content without navigating the page.
- The tab UI is a reusable component, not one-off markup scoped to
  `SectionThree`.

## Non-Goals

- URL/route-based tab state (no deep-linking to a specific tab). Active tab
  is local component state and resets on reload or navigating away and back.
- Elaborate test coverage — consistent with the rest of this layout scaffold.
- Using `Tabs` anywhere else yet — it's introduced generically but only wired
  into `SectionThree` for now.

## Component: `Tabs`

New component at `src/components/Tabs/` (`Tabs.js` + `Tabs.scss`), following
the app's existing one-scss-per-component pattern.

**API:**

```jsx
<Tabs
  tabs={[
    { label: 'Tab One', content: <SomeContent /> },
    { label: 'Tab Two', content: <OtherContent /> },
  ]}
/>
```

- `tabs`: array of `{ label: string, content: ReactNode }`.
- Internal `useState` holds the active tab index, defaulting to `0`.
- Renders a row of tab-header buttons followed by the active tab's `content`
  in a panel below.
- Basic ARIA wiring: `role="tablist"` on the header row, `role="tab"` +
  `aria-selected` on each button, `role="tabpanel"` on the content panel.

## Content

`SectionThree.js` keeps its `<h1>Section Three</h1>` heading. The lorem ipsum
body is replaced by `<Tabs tabs={[...]} />` with two entries — "Tab One" and
"Tab Two" — each holding a distinct block of the existing lorem ipsum
paragraphs, split so the two tabs are visibly different from each other.

## Styling

`Tabs.scss`: horizontal tab-header row (flex row, bottom border), with the
active tab styled distinctly (bold/underline/accent color), mirroring the
`sidebar__link--active` treatment already used in `Sidebar.scss` for visual
consistency with the rest of the app.

## Testing

No new test coverage planned — consistent with the existing app shell spec's
stance that this is a layout scaffold, not a feature requiring thorough
testing.

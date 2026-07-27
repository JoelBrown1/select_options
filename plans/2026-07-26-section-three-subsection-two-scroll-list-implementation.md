# Section Three Subsection Two Scroll List Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Section Three Tab Two's "Subsection Two" paragraphs with a
20-item `<ul>` inside a fixed-height, internally-scrolling container that
shows roughly 5 items at a time.

**Architecture:** `SectionThree.js`'s `TAB_TWO_CONTENT` constant has
Subsection Two's 3 `<p>` tags replaced with a `<ul className="section-three__scroll-list">`
containing 20 literal `<li>` items. `SectionThree.scss` gains new rules for
that class: `max-height: 180px` + `overflow-y: auto` for the internal
scroll, plus a border and per-item dividers for visual boundedness. This is
a nested scroll container — independent of `MainContent`'s existing
page-level `overflow-y: auto`, which is untouched.

**Tech Stack:** React 16 (function components), SCSS (one file per
component, imported directly into the component's `.js` file) — same
conventions as the rest of the app.

## Global Constraints

- Only Subsection Two's content changes — Subsections One, Three, Four, and
  Five are untouched, as is Tab One.
- No changes to `src/components/Tabs/Tabs.js` or `Tabs.scss`.
- No changes to `MainContent`'s page-level scroll behavior — this is an
  additional, nested scroll container, not a replacement.
- Styling pattern: one `.scss` file per component, imported directly into
  that component's `.js` file (already the case for `SectionThree.scss`).
  No CSS Modules, no styled-components.
- List items are placeholder labels ("List Item 1" through "List Item 20")
  — no real content required.
- No new permanent automated test coverage — a throwaway verification test
  is allowed during development but must be deleted before committing.

---

### Task 1: Replace Subsection Two with a 20-item scrollable list

**Files:**
- Modify: `src/components/pages/SectionThree.js`
- Modify: `src/components/pages/SectionThree.scss`

**Interfaces:**
- No new exports or props — `SectionThree` remains a no-prop default-export
  function component consumed by `MainContent`'s existing route table
  (unchanged).

- [ ] **Step 1: Replace Subsection Two's content in `SectionThree.js`**

Replace the full contents of `src/components/pages/SectionThree.js` with:

```jsx
import React from 'react';
import Tabs from '../Tabs/Tabs';
import './SectionThree.scss';

const TAB_ONE_CONTENT = (
  <>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
  </>
);

const TAB_TWO_CONTENT = (
  <>
    <h2 className="section-three__subsection-heading">Subsection One</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>

    <h2 className="section-three__subsection-heading">Subsection Two</h2>
    <ul className="section-three__scroll-list">
      <li>List Item 1</li>
      <li>List Item 2</li>
      <li>List Item 3</li>
      <li>List Item 4</li>
      <li>List Item 5</li>
      <li>List Item 6</li>
      <li>List Item 7</li>
      <li>List Item 8</li>
      <li>List Item 9</li>
      <li>List Item 10</li>
      <li>List Item 11</li>
      <li>List Item 12</li>
      <li>List Item 13</li>
      <li>List Item 14</li>
      <li>List Item 15</li>
      <li>List Item 16</li>
      <li>List Item 17</li>
      <li>List Item 18</li>
      <li>List Item 19</li>
      <li>List Item 20</li>
    </ul>

    <h2 className="section-three__subsection-heading">Subsection Three</h2>
    <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
    <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?</p>
    <p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>

    <h2 className="section-three__subsection-heading">Subsection Four</h2>
    <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>
    <p>Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.</p>
    <p>Et harum quidem rerum facilis est et expedita distinctio.</p>

    <h2 className="section-three__subsection-heading">Subsection Five</h2>
    <p>Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.</p>
    <p>Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.</p>
    <p>Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendi doloribus asperiores repellat.</p>
  </>
);

function SectionThree() {
  return (
    <div>
      <h1>Section Three</h1>
      <Tabs
        tabs={[
          { label: 'Tab One', content: TAB_ONE_CONTENT },
          { label: 'Tab Two', content: TAB_TWO_CONTENT },
        ]}
      />
    </div>
  );
}

export default SectionThree;
```

- [ ] **Step 2: Add the scroll-list styles to `SectionThree.scss`**

Replace the full contents of `src/components/pages/SectionThree.scss` with:

```scss
.section-three__subsection-heading {
  margin-top: 32px;

  &:first-of-type {
    margin-top: 16px;
  }
}

.section-three__scroll-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 180px;
  overflow-y: auto;
  border: 1px solid #d1d5db;

  li {
    padding: 8px 12px;
    border-bottom: 1px solid #e5e7eb;

    &:last-child {
      border-bottom: none;
    }
  }
}
```

- [ ] **Step 3: Verify the app compiles**

Run: `CI=true npm run build`
Expected: "Compiled successfully."

- [ ] **Step 4: Verify the list renders correctly**

This environment has no interactive browser tool, so substitute a
throwaway automated check for a manual click-through. Write a temporary
test file `src/components/pages/SectionThree.verify.test.js`:

```jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SectionThree from './SectionThree';

test('subsection two renders a 20-item scrollable list', () => {
  render(<SectionThree />);

  userEvent.click(screen.getByRole('tab', { name: 'Tab Two' }));

  const list = screen.getByRole('list');
  expect(list).toHaveClass('section-three__scroll-list');

  const items = screen.getAllByRole('listitem');
  expect(items).toHaveLength(20);
  expect(items[0]).toHaveTextContent('List Item 1');
  expect(items[19]).toHaveTextContent('List Item 20');
});
```

Run: `CI=true npx react-scripts test src/components/pages/SectionThree.verify.test.js --watchAll=false`
Expected: 1 test passes.

Then **delete `src/components/pages/SectionThree.verify.test.js`** — it is
a one-time verification aid, not a permanent deliverable. Confirm
`git status` shows no test file before committing.

Note: jsdom (used by this test runner) does not compute real layout, so the
`max-height`/`overflow-y` scroll-clipping behavior itself can't be asserted
programmatically — this test only confirms the list structure, item count,
and that the styled class is applied. The visual "shows ~5 of 20 items,
scrolls for the rest" behavior should be sanity-checked by inspecting the
compiled CSS or, if available, a real browser.

- [ ] **Step 5: Commit**

```bash
git add src/components/pages/SectionThree.js src/components/pages/SectionThree.scss
git commit -m "Add scrollable 20-item list to Section Three Subsection Two"
```

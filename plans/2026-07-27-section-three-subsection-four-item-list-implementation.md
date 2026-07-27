# Subsection Four Item List Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new, non-scrolling 3-item unordered list to Section Three
Tab Two's Subsection Four, where each item has a name and a container
holding two `PortalDropdown` components (one per option set), below
Subsection Four's existing paragraph text.

**Architecture:** `SectionThree.js` gains two new constants
(`SUBSECTION_FOUR_ITEM_NAMES`, `SECONDARY_DROPDOWN_OPTIONS`) and a new
`<ul>`/`<li>` block rendered inside `TAB_TWO_CONTENT`, directly below
Subsection Four's existing `<p>` tags, reusing the already-imported
`PortalDropdown` component (no new component). `SectionThree.scss` gains
four new classes for the list's layout — distinct from
`.section-three__scroll-list` (no border, no `max-height`/
`overflow-y: auto`).

**Tech Stack:** React 16 (function components), SCSS — same conventions
as the rest of the app.

## Global Constraints

- No changes to `Dropdown.js`, `Dropdown.scss`, `FlippingDropdown.js`,
  `FlippingDropdown.scss`, `PortalDropdown.js`, `PortalDropdown.scss`, or
  `Tabs.js`/`Tabs.scss`.
- Subsections One, Two, Three, and Five's existing content in
  `SectionThree.js` are untouched — only Subsection Four's section (still
  keeping its existing 3 `<p>` tags) gains the new list below them.
- The new list has exactly 3 items: names `Item One`, `Item Two`,
  `Item Three` (in that order).
- Each item's container holds exactly 2 `PortalDropdown`s: the first with
  `DROPDOWN_OPTIONS` (`['Option A', 'Option B', 'Option C']`, already
  defined in the file), the second with a new
  `SECONDARY_DROPDOWN_OPTIONS = ['Choice X', 'Choice Y', 'Choice Z']`.
- The new list's styling must NOT reuse `.section-three__scroll-list`'s
  border/`max-height`/`overflow-y` — it needs its own classes.
- No new permanent automated test coverage — a throwaway verification
  test is allowed during development but must be deleted before
  committing.

---

### Task 1: Add Subsection Four's item list markup and styles

**Files:**
- Modify: `src/components/pages/SectionThree.js`
- Modify: `src/components/pages/SectionThree.scss`

**Interfaces:**
- Consumes: `PortalDropdown` default export from
  `../PortalDropdown/PortalDropdown` (already imported in
  `SectionThree.js`; signature `<PortalDropdown options={string[]} />`).

- [ ] **Step 1: Add the new constants**

In `src/components/pages/SectionThree.js`, directly below the existing
`const DROPDOWN_OPTIONS = ['Option A', 'Option B', 'Option C'];` line, add:

```jsx
const SECONDARY_DROPDOWN_OPTIONS = ['Choice X', 'Choice Y', 'Choice Z'];
const SUBSECTION_FOUR_ITEM_NAMES = ['Item One', 'Item Two', 'Item Three'];
```

- [ ] **Step 2: Add the new list markup to Subsection Four**

In `src/components/pages/SectionThree.js`, inside `TAB_TWO_CONTENT`,
directly below Subsection Four's existing three `<p>` tags (and above the
`<h2>` for Subsection Five), add:

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

The full Subsection Four block should now read:

```jsx
    <h2 className="section-three__subsection-heading">Subsection Four</h2>
    <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>
    <p>Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.</p>
    <p>Et harum quidem rerum facilis est et expedita distinctio.</p>
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

- [ ] **Step 3: Add the new styles**

Append to `src/components/pages/SectionThree.scss`:

```scss
.section-three__item-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.section-three__item-list-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
}

.section-three__item-list-name {
  color: #1f2937;
}

.section-three__item-list-dropdowns {
  display: flex;
  align-items: center;
  gap: 8px;
}
```

- [ ] **Step 4: Verify the app compiles**

Run: `CI=true npm run build`
Expected: "Compiled successfully."

- [ ] **Step 5: Verify the list renders correctly**

Write a temporary test file
`src/components/pages/SectionThreeItemList.verify.test.js`:

```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SectionThree from './SectionThree';

test('subsection four renders 3 items, each with a name and 2 portal dropdowns', () => {
  render(<SectionThree />);

  fireEvent.click(screen.getByRole('tab', { name: 'Tab Two' }));

  const rows = document.querySelectorAll('.section-three__item-list-row');
  expect(rows).toHaveLength(3);

  expect(screen.getByText('Item One')).toBeInTheDocument();
  expect(screen.getByText('Item Two')).toBeInTheDocument();
  expect(screen.getByText('Item Three')).toBeInTheDocument();

  rows.forEach((row) => {
    const dropdowns = row.querySelectorAll('.portal-dropdown');
    expect(dropdowns).toHaveLength(2);
  });

  // First dropdown in the first row opens with DROPDOWN_OPTIONS
  const firstRowTriggers = rows[0].querySelectorAll('.portal-dropdown__trigger');
  fireEvent.click(firstRowTriggers[0]);
  expect(screen.getByRole('option', { name: 'Option A' })).toBeInTheDocument();

  // Second dropdown in the first row opens with SECONDARY_DROPDOWN_OPTIONS
  fireEvent.click(firstRowTriggers[1]);
  expect(screen.getByRole('option', { name: 'Choice X' })).toBeInTheDocument();
});
```

Run: `CI=true npx react-scripts test src/components/pages/SectionThreeItemList.verify.test.js --watchAll=false`
Expected: 1 test passes.

Then **delete `src/components/pages/SectionThreeItemList.verify.test.js`**
— it is a one-time verification aid, not a permanent deliverable. Confirm
`git status` shows no test file before committing.

- [ ] **Step 6: Commit**

```bash
git add src/components/pages/SectionThree.js src/components/pages/SectionThree.scss
git commit -m "Add item list with dual portal dropdowns to Subsection Four"
```

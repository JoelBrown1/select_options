# Section Three Subsection Three Duplicate List Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Section Three Tab Two's Subsection Three paragraphs with
a duplicate of Subsection Two's 20-item scrollable list (dropdown + "Go"
button per item).

**Architecture:** `SectionThree.js`'s `TAB_TWO_CONTENT` gets a second
`<ul className="section-three__scroll-list">` block, structurally identical
to Subsection Two's, placed under the "Subsection Three" heading in place
of its 3 paragraphs. Both lists reuse the same existing `LIST_ITEM_NUMBERS`
and `DROPDOWN_OPTIONS` constants and the same existing CSS classes — no new
component code, no new styles.

**Tech Stack:** React 16 (function components), SCSS (unchanged in this
plan) — same conventions as the rest of the app.

## Global Constraints

- No changes to `Dropdown.js`/`Dropdown.scss`, `Tabs.js`/`Tabs.scss`, or
  `SectionThree.scss` — this plan only adds JSX to `SectionThree.js`
  reusing existing classes and constants.
- Only Subsection Three's content changes — Subsections One, Two, Four,
  and Five, and Tab One, are untouched.
- The two lists (Subsection Two's and Subsection Three's) must be
  independent component instances — each `Dropdown` manages its own state,
  unaffected by the other list.
- No new permanent automated test coverage — a throwaway verification test
  is allowed during development but must be deleted before committing.

---

### Task 1: Duplicate the scrollable list into Subsection Three

**Files:**
- Modify: `src/components/pages/SectionThree.js`

**Interfaces:**
- No new exports or props — `SectionThree` remains a no-prop default-export
  function component consumed by `MainContent`'s existing route table
  (unchanged). Reuses `Dropdown` (from Task work already merged:
  `<Dropdown options={string[]} />`), and the existing module-level
  `DROPDOWN_OPTIONS` / `LIST_ITEM_NUMBERS` constants already defined in this
  file.

- [ ] **Step 1: Replace Subsection Three's paragraphs with a duplicate list**

Replace the full contents of `src/components/pages/SectionThree.js` with:

```jsx
import React from 'react';
import Tabs from '../Tabs/Tabs';
import Dropdown from '../Dropdown/Dropdown';
import './SectionThree.scss';

const TAB_ONE_CONTENT = (
  <>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
  </>
);

const DROPDOWN_OPTIONS = ['Option A', 'Option B', 'Option C'];
const LIST_ITEM_NUMBERS = Array.from({ length: 20 }, (_, index) => index + 1);

const TAB_TWO_CONTENT = (
  <>
    <h2 className="section-three__subsection-heading">Subsection One</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>

    <h2 className="section-three__subsection-heading">Subsection Two</h2>
    <ul className="section-three__scroll-list">
      {LIST_ITEM_NUMBERS.map((n) => (
        <li key={n} className="section-three__scroll-list-item">
          <span className="section-three__scroll-list-item-label">List Item {n}</span>
          <div className="section-three__scroll-list-item-actions">
            <Dropdown options={DROPDOWN_OPTIONS} />
            <button type="button" className="section-three__scroll-list-item-button">Go</button>
          </div>
        </li>
      ))}
    </ul>

    <h2 className="section-three__subsection-heading">Subsection Three</h2>
    <ul className="section-three__scroll-list">
      {LIST_ITEM_NUMBERS.map((n) => (
        <li key={n} className="section-three__scroll-list-item">
          <span className="section-three__scroll-list-item-label">List Item {n}</span>
          <div className="section-three__scroll-list-item-actions">
            <Dropdown options={DROPDOWN_OPTIONS} />
            <button type="button" className="section-three__scroll-list-item-button">Go</button>
          </div>
        </li>
      ))}
    </ul>

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

- [ ] **Step 2: Verify the app compiles**

Run: `CI=true npm run build`
Expected: "Compiled successfully."

- [ ] **Step 3: Verify both lists render independently**

This environment has no interactive browser tool, so substitute a
throwaway automated check for a manual click-through. Write a temporary
test file `src/components/pages/SectionThree.verify.test.js`:

```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SectionThree from './SectionThree';

test('subsection three duplicates subsection two\'s list independently', () => {
  render(<SectionThree />);

  fireEvent.click(screen.getByRole('tab', { name: 'Tab Two' }));

  const lists = document.querySelectorAll('.section-three__scroll-list');
  expect(lists).toHaveLength(2);

  const allLabels = screen.getAllByText(/^List Item \d+$/);
  expect(allLabels).toHaveLength(40);

  const triggers = screen.getAllByRole('button', { name: 'Select...' });
  expect(triggers).toHaveLength(40);

  const goButtons = screen.getAllByRole('button', { name: 'Go' });
  expect(goButtons).toHaveLength(40);

  fireEvent.click(triggers[0]);
  fireEvent.click(screen.getAllByRole('option', { name: 'Option A' })[0]);
  expect(triggers[0]).toHaveTextContent('Option A');
  expect(triggers[20]).toHaveTextContent('Select...');
});
```

Run: `CI=true npx react-scripts test src/components/pages/SectionThree.verify.test.js --watchAll=false`
Expected: 1 test passes.

Then **delete `src/components/pages/SectionThree.verify.test.js`** — it is
a one-time verification aid, not a permanent deliverable. Confirm
`git status` shows no test file before committing.

- [ ] **Step 4: Commit**

```bash
git add src/components/pages/SectionThree.js
git commit -m "Duplicate Subsection Two's list into Subsection Three"
```

# Section Three List Item Dropdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give each of the 20 items in Section Three Tab Two Subsection
Two's scrollable list its own custom dropdown (3 options) and a small
button to its right.

**Architecture:** A new reusable `Dropdown` component
(`src/components/Dropdown/`) manages its own open/closed and selected-option
state, closing on outside click via a ref + `document` click listener.
Subsection Two's `<ul>` switches from 20 literal `<li>` tags to a
data-driven `.map()` over a 20-element array, each rendering a label, a
`<Dropdown>`, and a small no-op "Go" button in a flex row.

**Tech Stack:** React 16 (function components, hooks: `useState`, `useRef`,
`useEffect`), SCSS (one file per component, imported directly into the
component's `.js` file) — same conventions as the rest of the app.

## Global Constraints

- The dropdown is custom-built (not a native `<select>`): trigger button +
  toggled options menu, own open/closed state.
- Selecting an option or clicking the "Go" button is purely visual — no
  `onClick` on the button, no console logging, no state lifted outside each
  list item.
- Dropdown menu clipping by `.section-three__scroll-list`'s
  `overflow-y: auto` is an accepted, out-of-scope tradeoff — do not add
  portal-based rendering or other clipping workarounds.
- Only Subsection Two's list markup and styling change — Subsections
  One/Three/Four/Five, Tab One, and the `Tabs` component
  (`src/components/Tabs/`) are untouched.
- Styling pattern: one `.scss` file per component, imported directly into
  that component's `.js` file. No CSS Modules, no styled-components.
- Match the existing neutral gray palette (`#1f2937` text, `#e5e7eb` hover,
  `#d1d5db` border) used throughout `Tabs.scss`/`Sidebar.scss`.
- No new permanent automated test coverage — a throwaway verification test
  is allowed during development but must be deleted before committing.

---

### Task 1: Build the reusable `Dropdown` component

**Files:**
- Create: `src/components/Dropdown/Dropdown.js`
- Create: `src/components/Dropdown/Dropdown.scss`

**Interfaces:**
- Produces: `Dropdown` (default export from
  `src/components/Dropdown/Dropdown.js`), a component accepting a single
  prop `options: string[]`. Renders a trigger button (text: the selected
  option, or `"Select..."` if none) and, when open, a `role="listbox"` menu
  of `role="option"` buttons for each entry in `options`. Clicking the
  trigger toggles the menu; clicking an option selects it and closes the
  menu; clicking anywhere outside the component closes the menu.

- [ ] **Step 1: Create the `Dropdown` component**

```jsx
import React, { useEffect, useRef, useState } from 'react';
import './Dropdown.scss';

function Dropdown({ options }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const rootRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  function handleOptionClick(option) {
    setSelected(option);
    setIsOpen(false);
  }

  return (
    <div className="dropdown" ref={rootRef}>
      <button
        type="button"
        className="dropdown__trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        {selected || 'Select...'}
      </button>
      {isOpen && (
        <div className="dropdown__menu" role="listbox">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={option === selected}
              className="dropdown__option"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
```

- [ ] **Step 2: Create the `Dropdown` stylesheet**

```scss
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown__trigger {
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #fff;
  color: #1f2937;
  cursor: pointer;
  font: inherit;

  &:hover {
    background-color: #e5e7eb;
  }
}

.dropdown__menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1;
  min-width: 100%;
  margin-top: 4px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dropdown__option {
  display: block;
  width: 100%;
  padding: 6px 10px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font: inherit;
  color: #1f2937;
  white-space: nowrap;

  &:hover {
    background-color: #e5e7eb;
  }
}
```

- [ ] **Step 3: Verify the app still compiles**

Run: `CI=true npm run build`
Expected: "Compiled successfully." (`Dropdown` isn't imported anywhere yet,
so this just confirms no syntax errors were introduced.)

- [ ] **Step 4: Verify the component's behavior**

This environment has no interactive browser tool, so substitute a
throwaway automated check for a manual click-through. Write a temporary
test file `src/components/Dropdown/Dropdown.verify.test.js`:

```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dropdown from './Dropdown';

test('dropdown opens, selects an option, and closes on outside click', () => {
  render(
    <div>
      <Dropdown options={['Option A', 'Option B', 'Option C']} />
      <div data-testid="outside">Outside</div>
    </div>
  );

  const trigger = screen.getByRole('button', { name: 'Select...' });
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

  fireEvent.click(trigger);
  expect(screen.getByRole('listbox')).toBeInTheDocument();
  expect(screen.getAllByRole('option')).toHaveLength(3);

  fireEvent.click(screen.getByRole('option', { name: 'Option B' }));
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Option B' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Option B' }));
  expect(screen.getByRole('listbox')).toBeInTheDocument();

  fireEvent.click(screen.getByTestId('outside'));
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
});
```

Run: `CI=true npx react-scripts test src/components/Dropdown/Dropdown.verify.test.js --watchAll=false`
Expected: 1 test passes.

Then **delete `src/components/Dropdown/Dropdown.verify.test.js`** — it is a
one-time verification aid, not a permanent deliverable. Confirm
`git status` shows no test file before committing.

- [ ] **Step 5: Commit**

```bash
git add src/components/Dropdown/Dropdown.js src/components/Dropdown/Dropdown.scss
git commit -m "Add reusable Dropdown component"
```

---

### Task 2: Wire `Dropdown` + button into each Subsection Two list item

**Files:**
- Modify: `src/components/pages/SectionThree.js`
- Modify: `src/components/pages/SectionThree.scss`

**Interfaces:**
- Consumes: `Dropdown` default export from `../Dropdown/Dropdown`
  (signature from Task 1: `<Dropdown options={string[]} />`).

- [ ] **Step 1: Replace Subsection Two's list markup with a data-driven map**

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

- [ ] **Step 2: Update `SectionThree.scss` for the new list item layout**

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
}

.section-three__scroll-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
}

.section-three__scroll-list-item-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-three__scroll-list-item-button {
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #fff;
  color: #1f2937;
  font-size: 0.85em;
  cursor: pointer;

  &:hover {
    background-color: #e5e7eb;
  }
}
```

- [ ] **Step 3: Verify the app compiles**

Run: `CI=true npm run build`
Expected: "Compiled successfully."

- [ ] **Step 4: Verify the wired-up list renders correctly**

This environment has no interactive browser tool, so substitute a
throwaway automated check for a manual click-through. Write a temporary
test file `src/components/pages/SectionThree.verify.test.js`:

```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SectionThree from './SectionThree';

test('subsection two list items each have a dropdown and a Go button', () => {
  render(<SectionThree />);

  fireEvent.click(screen.getByRole('tab', { name: 'Tab Two' }));

  const items = screen.getAllByText(/^List Item \d+$/);
  expect(items).toHaveLength(20);

  const triggers = screen.getAllByRole('button', { name: 'Select...' });
  expect(triggers).toHaveLength(20);

  const goButtons = screen.getAllByRole('button', { name: 'Go' });
  expect(goButtons).toHaveLength(20);

  fireEvent.click(triggers[0]);
  const options = screen.getAllByRole('option');
  expect(options.map((o) => o.textContent)).toEqual([
    'Option A',
    'Option B',
    'Option C',
  ]);

  fireEvent.click(options[2]);
  expect(triggers[0]).toHaveTextContent('Option C');
});
```

Run: `CI=true npx react-scripts test src/components/pages/SectionThree.verify.test.js --watchAll=false`
Expected: 1 test passes.

Then **delete `src/components/pages/SectionThree.verify.test.js`** — it is
a one-time verification aid, not a permanent deliverable. Confirm
`git status` shows no test file before committing.

Note: jsdom (used by this test runner) does not compute real layout or
clipping, so the "menu may be visually clipped near the bottom of the
scroll window" tradeoff from the spec can't be (and doesn't need to be)
asserted here — it's an accepted, out-of-scope visual limitation.

- [ ] **Step 5: Commit**

```bash
git add src/components/pages/SectionThree.js src/components/pages/SectionThree.scss
git commit -m "Add dropdown and button to each Subsection Two list item"
```

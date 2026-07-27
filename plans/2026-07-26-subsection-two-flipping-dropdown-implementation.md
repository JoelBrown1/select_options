# Subsection Two Flipping Dropdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give Subsection Two's list a dropdown that opens its menu upward
instead of downward when there isn't enough room below, without using a
React portal, while leaving Subsection Three's identical-looking list and
the original `Dropdown` component completely untouched.

**Architecture:** A new component, `FlippingDropdown`
(`src/components/FlippingDropdown/`), forks `Dropdown`'s markup and
behavior and adds a flip decision computed on open: it walks up the DOM
from its root to find the nearest scrolling ancestor, measures the space
below the trigger within that ancestor (or the viewport if none is found),
and compares it to an estimate of the menu's height based on option count.
`SectionThree.js`'s Subsection Two list switches to `FlippingDropdown`;
Subsection Three's list keeps using `Dropdown`.

**Tech Stack:** React 16 (function components, hooks: `useState`, `useRef`,
`useEffect`), SCSS (one file per component, imported directly into the
component's `.js` file) — same conventions as the rest of the app.

## Global Constraints

- No changes to `Dropdown.js`, `Dropdown.scss`, `Tabs.js`, `Tabs.scss`, or
  `SectionThree.scss`.
- Only Subsection Two's list wiring in `SectionThree.js` changes to use
  `FlippingDropdown` — Subsection Three's list block, Subsections One/Four/
  Five, and Tab One are untouched.
- No React portal.
- Flip estimate: `options.length * 36 + 10` (px), compared against space
  below the trigger within the nearest scrolling ancestor (or viewport if
  none found).
- Match the existing neutral gray palette (`#1f2937` text, `#e5e7eb`
  hover, `#d1d5db` border) already used in `Dropdown.scss`.
- No new permanent automated test coverage — a throwaway verification test
  is allowed during development but must be deleted before committing.

---

### Task 1: Build the `FlippingDropdown` component

**Files:**
- Create: `src/components/FlippingDropdown/FlippingDropdown.js`
- Create: `src/components/FlippingDropdown/FlippingDropdown.scss`

**Interfaces:**
- Produces: `FlippingDropdown` (default export from
  `src/components/FlippingDropdown/FlippingDropdown.js`), a component
  accepting a single prop `options: string[]`. Same rendered structure,
  ARIA, and outside-click-to-close behavior as the existing `Dropdown`
  component, plus: on open, adds class `flipping-dropdown__menu--upward`
  to the menu when there isn't enough room below the trigger.

- [ ] **Step 1: Create the `FlippingDropdown` component**

```jsx
import React, { useEffect, useRef, useState } from 'react';
import './FlippingDropdown.scss';

const OPTION_ROW_HEIGHT_PX = 36;
const MENU_CHROME_PX = 10;

function findScrollableAncestor(element) {
  let current = element ? element.parentElement : null;

  while (current) {
    const overflowY = window.getComputedStyle(current).overflowY;
    if (
      (overflowY === 'auto' || overflowY === 'scroll') &&
      current.scrollHeight > current.clientHeight
    ) {
      return current;
    }
    current = current.parentElement;
  }

  return null;
}

function FlippingDropdown({ options }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openUpward, setOpenUpward] = useState(false);
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

  function handleTriggerClick() {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    const triggerRect = rootRef.current.getBoundingClientRect();
    const scrollableAncestor = findScrollableAncestor(rootRef.current);
    const boundaryBottom = scrollableAncestor
      ? scrollableAncestor.getBoundingClientRect().bottom
      : window.innerHeight;
    const spaceBelow = boundaryBottom - triggerRect.bottom;
    const estimatedMenuHeight = options.length * OPTION_ROW_HEIGHT_PX + MENU_CHROME_PX;

    setOpenUpward(spaceBelow < estimatedMenuHeight);
    setIsOpen(true);
  }

  function handleOptionClick(option) {
    setSelected(option);
    setIsOpen(false);
  }

  return (
    <div className="flipping-dropdown" ref={rootRef}>
      <button
        type="button"
        className="flipping-dropdown__trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={handleTriggerClick}
      >
        {selected || 'Select...'}
      </button>
      {isOpen && (
        <div
          className={
            openUpward
              ? 'flipping-dropdown__menu flipping-dropdown__menu--upward'
              : 'flipping-dropdown__menu'
          }
          role="listbox"
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={option === selected}
              className="flipping-dropdown__option"
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

export default FlippingDropdown;
```

- [ ] **Step 2: Create the `FlippingDropdown` stylesheet**

```scss
.flipping-dropdown {
  position: relative;
  display: inline-block;
}

.flipping-dropdown__trigger {
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

.flipping-dropdown__menu {
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

  &--upward {
    top: auto;
    bottom: 100%;
    margin-top: 0;
    margin-bottom: 4px;
  }
}

.flipping-dropdown__option {
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
Expected: "Compiled successfully." (`FlippingDropdown` isn't imported
anywhere yet, so this just confirms no syntax errors were introduced.)

- [ ] **Step 4: Verify the component's behavior**

This environment has no interactive browser tool, and jsdom (used by this
test runner) doesn't compute real layout — `getBoundingClientRect()`
returns all-zero rects by default and `scrollHeight`/`clientHeight` both
read `0`. To meaningfully verify the flip logic, the test below mocks
`getBoundingClientRect` and `getComputedStyle` to simulate a constrained
scrollable ancestor. Write a temporary test file
`src/components/FlippingDropdown/FlippingDropdown.verify.test.js`:

```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FlippingDropdown from './FlippingDropdown';

test('opens downward by default when there is no constrained scrollable ancestor', () => {
  render(<FlippingDropdown options={['Option A', 'Option B', 'Option C']} />);

  fireEvent.click(screen.getByRole('button', { name: 'Select...' }));

  const menu = screen.getByRole('listbox');
  expect(menu).toHaveClass('flipping-dropdown__menu');
  expect(menu).not.toHaveClass('flipping-dropdown__menu--upward');
});

test('flips upward when nested in a constrained scrollable ancestor', () => {
  const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
  const originalGetComputedStyle = window.getComputedStyle;

  HTMLElement.prototype.getBoundingClientRect = function mockRect() {
    if (this.classList.contains('scroll-container')) {
      return { bottom: 150 };
    }
    if (this.classList.contains('flipping-dropdown')) {
      return { bottom: 145 };
    }
    return { bottom: 0 };
  };

  window.getComputedStyle = (el) => {
    if (el.classList && el.classList.contains('scroll-container')) {
      return { overflowY: 'auto' };
    }
    return originalGetComputedStyle(el);
  };

  render(
    <div className="scroll-container">
      <FlippingDropdown options={['Option A', 'Option B', 'Option C']} />
    </div>
  );

  const container = document.querySelector('.scroll-container');
  Object.defineProperty(container, 'scrollHeight', { value: 200, configurable: true });
  Object.defineProperty(container, 'clientHeight', { value: 100, configurable: true });

  fireEvent.click(screen.getByRole('button', { name: 'Select...' }));

  expect(screen.getByRole('listbox')).toHaveClass('flipping-dropdown__menu--upward');

  HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  window.getComputedStyle = originalGetComputedStyle;
});

test('selects an option and closes on outside click', () => {
  render(
    <div>
      <FlippingDropdown options={['Option A', 'Option B', 'Option C']} />
      <div data-testid="outside">Outside</div>
    </div>
  );

  fireEvent.click(screen.getByRole('button', { name: 'Select...' }));
  fireEvent.click(screen.getByRole('option', { name: 'Option B' }));
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Option B' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Option B' }));
  expect(screen.getByRole('listbox')).toBeInTheDocument();

  fireEvent.click(screen.getByTestId('outside'));
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
});
```

Run: `CI=true npx react-scripts test src/components/FlippingDropdown/FlippingDropdown.verify.test.js --watchAll=false`
Expected: 3 tests pass.

Then **delete `src/components/FlippingDropdown/FlippingDropdown.verify.test.js`**
— it is a one-time verification aid, not a permanent deliverable. Confirm
`git status` shows no test file before committing.

- [ ] **Step 5: Commit**

```bash
git add src/components/FlippingDropdown/FlippingDropdown.js src/components/FlippingDropdown/FlippingDropdown.scss
git commit -m "Add FlippingDropdown component"
```

---

### Task 2: Wire `FlippingDropdown` into Subsection Two's list only

**Files:**
- Modify: `src/components/pages/SectionThree.js`

**Interfaces:**
- Consumes: `FlippingDropdown` default export from
  `../FlippingDropdown/FlippingDropdown` (signature from Task 1:
  `<FlippingDropdown options={string[]} />`).

- [ ] **Step 1: Use `FlippingDropdown` in Subsection Two's list, keep `Dropdown` in Subsection Three's**

Replace the full contents of `src/components/pages/SectionThree.js` with:

```jsx
import React from 'react';
import Tabs from '../Tabs/Tabs';
import Dropdown from '../Dropdown/Dropdown';
import FlippingDropdown from '../FlippingDropdown/FlippingDropdown';
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
            <FlippingDropdown options={DROPDOWN_OPTIONS} />
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

- [ ] **Step 3: Verify Subsection Two uses `FlippingDropdown` and Subsection Three still uses `Dropdown`**

This environment has no interactive browser tool, so substitute a
throwaway automated check for a manual click-through. Write a temporary
test file `src/components/pages/SectionThree.verify.test.js`:

```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SectionThree from './SectionThree';

test('subsection two uses flipping-dropdown class, subsection three uses dropdown class', () => {
  render(<SectionThree />);

  fireEvent.click(screen.getByRole('tab', { name: 'Tab Two' }));

  const flippingDropdowns = document.querySelectorAll('.flipping-dropdown');
  const plainDropdowns = document.querySelectorAll('.dropdown');

  expect(flippingDropdowns).toHaveLength(20);
  expect(plainDropdowns).toHaveLength(20);
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
git commit -m "Use FlippingDropdown in Subsection Two only"
```

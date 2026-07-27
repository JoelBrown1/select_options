# Subsection Three Portal Dropdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give Subsection Three's list a dropdown whose options menu is
rendered via a React portal into `document.body`, so it's never clipped by
the list's scrollable container, while leaving Subsection Two's
`FlippingDropdown`, the original `Dropdown` component, and Subsection
Three's list markup otherwise untouched.

**Architecture:** A new component, `PortalDropdown`
(`src/components/PortalDropdown/`), forks `Dropdown`'s markup and behavior.
On open, it computes the trigger's position via `getBoundingClientRect()`
and renders its menu through `ReactDOM.createPortal` into `document.body`,
positioned with `position: fixed` inline styles. Because the menu now
lives outside the trigger's DOM subtree, the outside-click handler must
also check a second ref (`menuRef`) so clicks on menu options aren't
mistaken for outside clicks. A module-level constant,
`REPOSITION_ON_SCROLL` (default `false`), gates whether scroll/resize
while open closes the menu or repositions it live.
`SectionThree.js`'s Subsection Three list switches to `PortalDropdown`;
Subsection Two's list keeps using `FlippingDropdown`.

**Tech Stack:** React 16 (function components, hooks: `useState`,
`useRef`, `useEffect`; `ReactDOM.createPortal`), SCSS (one file per
component, imported directly into the component's `.js` file) — same
conventions as the rest of the app.

## Global Constraints

- No changes to `Dropdown.js`, `Dropdown.scss`, `FlippingDropdown.js`,
  `FlippingDropdown.scss`, `Tabs.js`, `Tabs.scss`, or `SectionThree.scss`.
- Only Subsection Three's list wiring in `SectionThree.js` changes to use
  `PortalDropdown` — Subsection Two's list block, Subsections One/Four/
  Five, and Tab One are untouched.
- `PortalDropdown` always opens downward — no flip-upward logic.
- Scroll/resize behavior while open is controlled by
  `const REPOSITION_ON_SCROLL = false;` at the top of `PortalDropdown.js`.
- Match the existing neutral gray palette (`#1f2937` text, `#e5e7eb`
  hover, `#d1d5db` border) already used in `Dropdown.scss`.
- No new permanent automated test coverage — a throwaway verification test
  is allowed during development but must be deleted before committing.

---

### Task 1: Build the `PortalDropdown` component

**Files:**
- Create: `src/components/PortalDropdown/PortalDropdown.js`
- Create: `src/components/PortalDropdown/PortalDropdown.scss`

**Interfaces:**
- Produces: `PortalDropdown` (default export from
  `src/components/PortalDropdown/PortalDropdown.js`), a component
  accepting a single prop `options: string[]`. Same ARIA and
  outside-click-to-close behavior as `Dropdown`, but its menu is rendered
  via `ReactDOM.createPortal` into `document.body`, positioned with
  `position: fixed` based on the trigger's `getBoundingClientRect()`.

- [ ] **Step 1: Create the `PortalDropdown` component**

```jsx
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './PortalDropdown.scss';

const MENU_GAP_PX = 4;
const REPOSITION_ON_SCROLL = false;

function computeMenuPosition(rootElement) {
  const rect = rootElement.getBoundingClientRect();
  return {
    top: rect.bottom + MENU_GAP_PX,
    left: rect.left,
    minWidth: rect.width,
  };
}

function PortalDropdown({ options }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const rootRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(event) {
      const clickedRoot = rootRef.current && rootRef.current.contains(event.target);
      const clickedMenu = menuRef.current && menuRef.current.contains(event.target);
      if (!clickedRoot && !clickedMenu) {
        setIsOpen(false);
      }
    }

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleScrollOrResize() {
      if (REPOSITION_ON_SCROLL) {
        setMenuPosition(computeMenuPosition(rootRef.current));
      } else {
        setIsOpen(false);
      }
    }

    // capture: true so this also fires for scroll events on the
    // scrollable list ancestor, not just window-level scroll.
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen]);

  function handleTriggerClick() {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    setMenuPosition(computeMenuPosition(rootRef.current));
    setIsOpen(true);
  }

  function handleOptionClick(option) {
    setSelected(option);
    setIsOpen(false);
  }

  return (
    <div className="portal-dropdown" ref={rootRef}>
      <button
        type="button"
        className="portal-dropdown__trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={handleTriggerClick}
      >
        {selected || 'Select...'}
      </button>
      {isOpen && menuPosition &&
        ReactDOM.createPortal(
          <div
            ref={menuRef}
            className="portal-dropdown__menu"
            role="listbox"
            style={{
              position: 'fixed',
              top: menuPosition.top,
              left: menuPosition.left,
              minWidth: menuPosition.minWidth,
            }}
          >
            {options.map((option) => (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={option === selected}
                className="portal-dropdown__option"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}

export default PortalDropdown;
```

- [ ] **Step 2: Create the `PortalDropdown` stylesheet**

```scss
.portal-dropdown {
  position: relative;
  display: inline-block;
}

.portal-dropdown__trigger {
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

.portal-dropdown__menu {
  z-index: 1;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.portal-dropdown__option {
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
Expected: "Compiled successfully." (`PortalDropdown` isn't imported
anywhere yet, so this just confirms no syntax errors were introduced.)

- [ ] **Step 4: Verify the component's behavior**

This environment has no interactive browser tool. `getBoundingClientRect()`
returns all-zero rects in jsdom by default, which is fine here since these
tests only check portal placement and click behavior, not exact pixel
positions. Write a temporary test file
`src/components/PortalDropdown/PortalDropdown.verify.test.js`:

```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PortalDropdown from './PortalDropdown';

test('opens a menu portaled to document.body, not nested inside the trigger', () => {
  render(<PortalDropdown options={['Option A', 'Option B', 'Option C']} />);

  fireEvent.click(screen.getByRole('button', { name: 'Select...' }));

  const menu = screen.getByRole('listbox');
  expect(menu).toBeInTheDocument();
  expect(document.querySelector('.portal-dropdown').contains(menu)).toBe(false);
  expect(document.body.contains(menu)).toBe(true);
});

test('selects an option rendered inside the portal without the outside-click handler closing it first', () => {
  render(<PortalDropdown options={['Option A', 'Option B', 'Option C']} />);

  fireEvent.click(screen.getByRole('button', { name: 'Select...' }));
  fireEvent.click(screen.getByRole('option', { name: 'Option B' }));

  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Option B' })).toBeInTheDocument();
});

test('closes on outside click', () => {
  render(
    <div>
      <PortalDropdown options={['Option A', 'Option B', 'Option C']} />
      <div data-testid="outside">Outside</div>
    </div>
  );

  fireEvent.click(screen.getByRole('button', { name: 'Select...' }));
  expect(screen.getByRole('listbox')).toBeInTheDocument();

  fireEvent.click(screen.getByTestId('outside'));
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
});

test('closes on scroll when REPOSITION_ON_SCROLL is false (default)', () => {
  render(<PortalDropdown options={['Option A', 'Option B', 'Option C']} />);

  fireEvent.click(screen.getByRole('button', { name: 'Select...' }));
  expect(screen.getByRole('listbox')).toBeInTheDocument();

  fireEvent.scroll(window);
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
});
```

Run: `CI=true npx react-scripts test src/components/PortalDropdown/PortalDropdown.verify.test.js --watchAll=false`
Expected: 4 tests pass.

Then **delete `src/components/PortalDropdown/PortalDropdown.verify.test.js`**
— it is a one-time verification aid, not a permanent deliverable. Confirm
`git status` shows no test file before committing.

- [ ] **Step 5: Commit**

```bash
git add src/components/PortalDropdown/PortalDropdown.js src/components/PortalDropdown/PortalDropdown.scss
git commit -m "Add PortalDropdown component"
```

---

### Task 2: Wire `PortalDropdown` into Subsection Three's list only

**Files:**
- Modify: `src/components/pages/SectionThree.js`

**Interfaces:**
- Consumes: `PortalDropdown` default export from
  `../PortalDropdown/PortalDropdown` (signature from Task 1:
  `<PortalDropdown options={string[]} />`).

- [ ] **Step 1: Use `PortalDropdown` in Subsection Three's list, keep `FlippingDropdown` in Subsection Two's**

In `src/components/pages/SectionThree.js`:

1. Change the import of `Dropdown` to import `PortalDropdown` instead:

```jsx
import PortalDropdown from '../PortalDropdown/PortalDropdown';
```

(Remove the now-unused `import Dropdown from '../Dropdown/Dropdown';` line
— `Dropdown` is no longer referenced anywhere in this file.)

2. In the Subsection Three list block, replace `<Dropdown options={DROPDOWN_OPTIONS} />` with `<PortalDropdown options={DROPDOWN_OPTIONS} />`:

```jsx
    <h2 className="section-three__subsection-heading">Subsection Three</h2>
    <ul className="section-three__scroll-list">
      {LIST_ITEM_NUMBERS.map((n) => (
        <li key={n} className="section-three__scroll-list-item">
          <span className="section-three__scroll-list-item-label">List Item {n}</span>
          <div className="section-three__scroll-list-item-actions">
            <PortalDropdown options={DROPDOWN_OPTIONS} />
            <button type="button" className="section-three__scroll-list-item-button">Go</button>
          </div>
        </li>
      ))}
    </ul>
```

The Subsection Two list block above it keeps using `<FlippingDropdown options={DROPDOWN_OPTIONS} />` unchanged.

- [ ] **Step 2: Verify the app compiles**

Run: `CI=true npm run build`
Expected: "Compiled successfully."

- [ ] **Step 3: Verify Subsection Three uses `PortalDropdown` and Subsection Two still uses `FlippingDropdown`**

Write a temporary test file
`src/components/pages/SectionThree.verify.test.js`:

```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SectionThree from './SectionThree';

test('subsection two uses flipping-dropdown class, subsection three uses portal-dropdown class', () => {
  render(<SectionThree />);

  fireEvent.click(screen.getByRole('tab', { name: 'Tab Two' }));

  const flippingDropdowns = document.querySelectorAll('.flipping-dropdown');
  const portalDropdowns = document.querySelectorAll('.portal-dropdown');
  const plainDropdowns = document.querySelectorAll('.dropdown');

  expect(flippingDropdowns).toHaveLength(20);
  expect(portalDropdowns).toHaveLength(20);
  expect(plainDropdowns).toHaveLength(0);
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
git commit -m "Use PortalDropdown in Subsection Three only"
```

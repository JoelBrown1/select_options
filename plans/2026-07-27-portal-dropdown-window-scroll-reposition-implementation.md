# PortalDropdown Window-Scroll Reposition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `PortalDropdown`'s menu reposition (rather than no-op) when
the window/page scrolls, so it stays visually attached to its trigger
button as the page scrolls — now that `MainContent` no longer has its own
`overflow-y: auto` and the whole page scrolls instead.

**Architecture:** In `PortalDropdown.js`'s `handleScroll` function, the
`event.target === document` branch changes from a no-op `return` to
calling `setMenuPosition(computeMenuPosition(rootRef.current))` before
returning. This is unconditional — it does not depend on
`REPOSITION_ON_SCROLL`, which continues to govern only the separate
scrollable-ancestor-list branch (unchanged).

**Tech Stack:** React 16 (hooks), same conventions as the rest of the app.

## Global Constraints

- Only `src/components/PortalDropdown/PortalDropdown.js` changes.
- The existing debug `console.log` statements in this file (`isOpen
  changed`, `scroll event`, `trigger clicked`, etc.) stay in place —
  do not remove or alter them.
- The `event.target === document` branch must reposition unconditionally
  (not gated by `REPOSITION_ON_SCROLL`).
- The scrollable-ancestor branch (the `REPOSITION_ON_SCROLL` toggle,
  currently `false`) is unchanged.
- `handleResize` is unchanged.
- No new permanent automated test coverage — a throwaway verification
  test is allowed during development but must be deleted before
  committing.

---

### Task 1: Reposition on window-level scroll instead of no-op

**Files:**
- Modify: `src/components/PortalDropdown/PortalDropdown.js`

**Interfaces:**
- No external interface changes — `PortalDropdown`'s props
  (`options: string[]`) and exported default remain identical.

- [ ] **Step 1: Update `handleScroll`'s window-scroll branch**

In `src/components/PortalDropdown/PortalDropdown.js`, the current
`handleScroll` function reads:

```js
    function handleScroll(event) {
      console.log('scroll event', event.target);
      if (event.target === document) {
        console.log('scrolling on the window');
        return;
      }

      if (REPOSITION_ON_SCROLL) {
        setMenuPosition(computeMenuPosition(rootRef.current));
      } else {
        setIsOpen(false);
      }
    }
```

Replace it with:

```js
    function handleScroll(event) {
      console.log('scroll event', event.target);
      if (event.target === document) {
        console.log('scrolling on the window');
        setMenuPosition(computeMenuPosition(rootRef.current));
        return;
      }

      if (REPOSITION_ON_SCROLL) {
        setMenuPosition(computeMenuPosition(rootRef.current));
      } else {
        setIsOpen(false);
      }
    }
```

The only change is adding the `setMenuPosition(computeMenuPosition(rootRef.current));`
line before the `return;` inside the `event.target === document` branch.
Every other line in the file, including all `console.log` calls, stays
exactly as-is.

- [ ] **Step 2: Verify the app compiles**

Run: `CI=true npm run build`
Expected: "Compiled successfully."

- [ ] **Step 3: Verify the new reposition-on-window-scroll behavior**

Write a temporary test file
`src/components/PortalDropdown/PortalDropdownWindowScroll.verify.test.js`:

```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PortalDropdown from './PortalDropdown';

test('window-level scroll repositions the menu and keeps it open', () => {
  render(<PortalDropdown options={['Option A', 'Option B', 'Option C']} />);

  fireEvent.click(screen.getByRole('button', { name: 'Select...' }));
  const menu = screen.getByRole('listbox');
  expect(menu).toBeInTheDocument();

  const initialTop = menu.style.top;

  const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
  HTMLElement.prototype.getBoundingClientRect = function mockRect() {
    if (this.classList.contains('portal-dropdown')) {
      return { bottom: 300, left: 10, width: 120 };
    }
    return { bottom: 0, left: 0, width: 0 };
  };

  fireEvent.scroll(document);

  expect(screen.getByRole('listbox')).toBeInTheDocument();
  expect(menu.style.top).toBe('304px');
  expect(menu.style.top).not.toBe(initialTop);

  HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
});

test('scrollable-ancestor scroll still closes the menu (unchanged)', () => {
  render(
    <div className="scroll-container">
      <PortalDropdown options={['Option A', 'Option B', 'Option C']} />
    </div>
  );

  fireEvent.click(screen.getByRole('button', { name: 'Select...' }));
  expect(screen.getByRole('listbox')).toBeInTheDocument();

  const container = document.querySelector('.scroll-container');
  fireEvent.scroll(container);

  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
});
```

Run: `CI=true npx react-scripts test src/components/PortalDropdown/PortalDropdownWindowScroll.verify.test.js --watchAll=false`
Expected: 2 tests pass.

Then **delete
`src/components/PortalDropdown/PortalDropdownWindowScroll.verify.test.js`**
— it is a one-time verification aid, not a permanent deliverable. Confirm
`git status` shows no test file before committing.

- [ ] **Step 4: Commit**

```bash
git add src/components/PortalDropdown/PortalDropdown.js
git commit -m "Reposition PortalDropdown menu on window-level scroll"
```

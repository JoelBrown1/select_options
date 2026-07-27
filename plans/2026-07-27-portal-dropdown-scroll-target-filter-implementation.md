# PortalDropdown Scroll Target Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Change `PortalDropdown` so that scrolling the trigger's
scrollable ancestor (or any other scrollable element) still closes/
repositions the open menu as it does today, but scrolling the window/
page itself no longer does anything.

**Architecture:** Split the existing single `handleScrollOrResize`
function in `PortalDropdown.js` into two handlers — `handleScroll` (which
early-returns when `event.target === document`, i.e. a window/page-level
scroll) and `handleResize` (unchanged behavior, no target check needed).
Both still branch on the existing `REPOSITION_ON_SCROLL` constant exactly
as before.

**Tech Stack:** React 16 (hooks), same conventions as the rest of the app.

## Global Constraints

- Only `src/components/PortalDropdown/PortalDropdown.js` changes — no
  other file in the repo.
- No change to click-outside behavior, `computeMenuPosition`, the
  `resize` listener's behavior, or the `REPOSITION_ON_SCROLL` constant's
  meaning/value (`false`).
- Window/page-level scroll (`event.target === document`) must be a no-op
  for the scroll handler; any other scroll target keeps today's behavior
  (close by default, reposition if `REPOSITION_ON_SCROLL` were `true`).
- No new permanent automated test coverage — a throwaway verification
  test is allowed during development but must be deleted before
  committing.

---

### Task 1: Filter window-level scroll out of `PortalDropdown`'s scroll handler

**Files:**
- Modify: `src/components/PortalDropdown/PortalDropdown.js`

**Interfaces:**
- No external interface changes — `PortalDropdown`'s props
  (`options: string[]`) and exported default remain identical. This is an
  internal-behavior-only change.

- [ ] **Step 1: Replace the combined scroll/resize handler with two handlers**

In `src/components/PortalDropdown/PortalDropdown.js`, replace this block:

```js
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
```

with:

```js
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    // A window/page-level scroll event's target is `document`; a scroll
    // on an inner scrollable element (e.g. the list ancestor) targets
    // that element instead. Only the latter should close/reposition the
    // menu — window-level scroll is intentionally ignored.
    function handleScroll(event) {
      if (event.target === document) {
        return;
      }

      if (REPOSITION_ON_SCROLL) {
        setMenuPosition(computeMenuPosition(rootRef.current));
      } else {
        setIsOpen(false);
      }
    }

    function handleResize() {
      if (REPOSITION_ON_SCROLL) {
        setMenuPosition(computeMenuPosition(rootRef.current));
      } else {
        setIsOpen(false);
      }
    }

    // capture: true so this also fires for scroll events on the
    // scrollable list ancestor, not just window-level scroll.
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);
```

- [ ] **Step 2: Verify the app compiles**

Run: `CI=true npm run build`
Expected: "Compiled successfully."

- [ ] **Step 3: Verify the new scroll-filtering behavior**

Write a temporary test file
`src/components/PortalDropdown/PortalDropdownScrollFilter.verify.test.js`:

```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PortalDropdown from './PortalDropdown';

test('scrolling a nested scrollable container closes the open menu', () => {
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

test('window/page-level scroll does not close the open menu', () => {
  render(<PortalDropdown options={['Option A', 'Option B', 'Option C']} />);

  fireEvent.click(screen.getByRole('button', { name: 'Select...' }));
  expect(screen.getByRole('listbox')).toBeInTheDocument();

  fireEvent.scroll(document);

  expect(screen.getByRole('listbox')).toBeInTheDocument();
});
```

Run: `CI=true npx react-scripts test src/components/PortalDropdown/PortalDropdownScrollFilter.verify.test.js --watchAll=false`
Expected: 2 tests pass.

Then **delete
`src/components/PortalDropdown/PortalDropdownScrollFilter.verify.test.js`**
— it is a one-time verification aid, not a permanent deliverable. Confirm
`git status` shows no test file before committing.

- [ ] **Step 4: Commit**

```bash
git add src/components/PortalDropdown/PortalDropdown.js
git commit -m "Ignore window-level scroll in PortalDropdown's scroll handler"
```

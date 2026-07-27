# Section Three Tabs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat lorem-ipsum content in `SectionThree` with a 2-tab
system, built on a new reusable `Tabs` component.

**Architecture:** A generic `Tabs` component (`src/components/Tabs/`) takes a
`tabs` prop — an array of `{ label, content }` — and manages the active tab
index with local `useState`. It renders a row of tab-header buttons (with
basic ARIA tab roles) followed by the active tab's content panel.
`SectionThree` is updated to render `<Tabs tabs={[...]} />` with two entries,
each holding a distinct block of placeholder lorem ipsum paragraphs, in place
of its current flat paragraph list.

**Tech Stack:** React 16 (function components, hooks), SCSS (one file per
component, imported directly into the component's `.js` file) — same
conventions as the rest of the app.

## Global Constraints

- Active tab is local component state (`useState`), not URL/route-based — it
  resets on reload or navigating away and back. Spec non-goal: no deep-linking.
- Styling pattern: one `.scss` file per component, imported directly into
  that component's `.js` file. No CSS Modules, no styled-components.
- Match the existing neutral gray palette already used in `Sidebar.scss`
  (`#1f2937` text/active, `#e5e7eb` hover) rather than introducing new colors.
- No new automated test coverage — spec explicitly scopes this as a layout
  scaffold; verification is manual in the browser (final task).
- `Tabs` is introduced generically but only wired into `SectionThree` for now
  — do not touch the other four section pages.

---

### Task 1: Build the reusable `Tabs` component

**Files:**
- Create: `src/components/Tabs/Tabs.js`
- Create: `src/components/Tabs/Tabs.scss`

**Interfaces:**
- Produces: `Tabs` (default export from `src/components/Tabs/Tabs.js`), a
  component accepting a single prop `tabs: Array<{ label: string, content:
  ReactNode }>`. Renders a `role="tablist"` header row of `role="tab"` buttons
  (one per entry, showing `label`, clicking sets that entry active) and a
  `role="tabpanel"` div showing the active entry's `content`. Defaults to the
  first entry (`index 0`) active on mount.

- [ ] **Step 1: Create the `Tabs` component**

```jsx
import React, { useState } from 'react';
import './Tabs.scss';

function Tabs({ tabs }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="tabs">
      <div className="tabs__list" role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            className={
              index === activeIndex
                ? 'tabs__tab tabs__tab--active'
                : 'tabs__tab'
            }
            onClick={() => setActiveIndex(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs__panel" role="tabpanel">
        {tabs[activeIndex].content}
      </div>
    </div>
  );
}

export default Tabs;
```

- [ ] **Step 2: Create the `Tabs` stylesheet**

```scss
.tabs {
  display: flex;
  flex-direction: column;
}

.tabs__list {
  display: flex;
  border-bottom: 1px solid #d1d5db;
}

.tabs__tab {
  padding: 8px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font: inherit;
  color: #1f2937;

  &:hover {
    background-color: #e5e7eb;
  }

  &--active {
    font-weight: 600;
    border-bottom: 2px solid #1f2937;
  }
}

.tabs__panel {
  padding-top: 16px;
}
```

- [ ] **Step 3: Verify the app still compiles**

Run: `CI=true npm run build`
Expected: "Compiled successfully." (`Tabs` isn't imported anywhere yet, so
this just confirms no syntax errors were introduced.)

- [ ] **Step 4: Commit**

```bash
git add src/components/Tabs/Tabs.js src/components/Tabs/Tabs.scss
git commit -m "Add reusable Tabs component"
```

---

### Task 2: Wire `Tabs` into `SectionThree`

**Files:**
- Modify: `src/components/pages/SectionThree.js`

**Interfaces:**
- Consumes: `Tabs` default export from `../Tabs/Tabs` (signature from Task 1:
  `<Tabs tabs={Array<{ label: string, content: ReactNode }>} />`).

- [ ] **Step 1: Replace `SectionThree`'s content with two tabs**

```jsx
import React from 'react';
import Tabs from '../Tabs/Tabs';

const TAB_ONE_CONTENT = (
  <>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
  </>
);

const TAB_TWO_CONTENT = (
  <>
    <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.</p>
    <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>
    <p>Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.</p>
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

- [ ] **Step 3: Manually verify in the browser**

Run: `npm start`, then in the browser:
1. Navigate to `/section-three` (via the sidebar "Section Three" link).
2. Confirm "Tab One" is active by default and shows the Lorem/Duis/Sed ut
   paragraphs.
3. Click "Tab Two". Confirm the content swaps to the Nemo/At vero/Similique
   paragraphs, and "Tab Two" now shows the active styling (bold text,
   underline).
4. Click back to "Tab One". Confirm it swaps back correctly.
5. Navigate away to another section and back to `/section-three`. Confirm
   the tab resets to "Tab One" (local state, not persisted — expected).

Stop the dev server once verified.

- [ ] **Step 4: Commit**

```bash
git add src/components/pages/SectionThree.js
git commit -m "Wire Tabs component into Section Three"
```

# Section Three Tab Two Subsections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand Section Three's "Tab Two" content from 3 flat paragraphs
into 5 headed subsections with enough total text that the page visibly
overflows and scrolls.

**Architecture:** `SectionThree.js`'s existing `TAB_TWO_CONTENT` constant is
replaced with 5 `<h2>` + paragraph groups (3 paragraphs each, 15 total). A
new `SectionThree.scss` is added purely for heading spacing between
subsections. No changes to the `Tabs` component or `Tabs.scss`. Scrolling
continues to rely on `MainContent`'s existing `overflow-y: auto` — no new
scroll container.

**Tech Stack:** React 16 (function components), SCSS (one file per
component, imported directly into the component's `.js` file) — same
conventions as the rest of the app.

## Global Constraints

- Tab One is unchanged — only `TAB_TWO_CONTENT` changes.
- No changes to `src/components/Tabs/Tabs.js` or `Tabs.scss`.
- No new independent scroll container — rely on `MainContent`'s existing
  `overflow-y: auto`.
- Styling pattern: one `.scss` file per component, imported directly into
  that component's `.js` file. No CSS Modules, no styled-components.
- Content is placeholder lorem ipsum — no real content required.
- No new permanent automated test coverage — consistent with the existing
  specs' "layout scaffold" stance. A throwaway verification test is allowed
  during development but must be deleted before committing.

---

### Task 1: Replace Tab Two content with 5 headed subsections

**Files:**
- Modify: `src/components/pages/SectionThree.js`
- Create: `src/components/pages/SectionThree.scss`

**Interfaces:**
- No new exports or props — `SectionThree` remains a no-prop default-export
  function component consumed by `MainContent`'s existing route table
  (unchanged).

- [ ] **Step 1: Replace `TAB_TWO_CONTENT` and add the stylesheet import**

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
    <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
    <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>

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

- [ ] **Step 2: Create the stylesheet**

Create `src/components/pages/SectionThree.scss`:

```scss
.section-three__subsection-heading {
  margin-top: 32px;

  &:first-of-type {
    margin-top: 16px;
  }
}
```

- [ ] **Step 3: Verify the app compiles**

Run: `CI=true npm run build`
Expected: "Compiled successfully."

- [ ] **Step 4: Verify subsection content renders correctly**

This environment has no interactive browser tool, so substitute a
throwaway automated check for a manual click-through. Write a temporary
test file `src/components/pages/SectionThree.verify.test.js`:

```jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SectionThree from './SectionThree';

test('tab two shows 5 subsections with enough content to overflow', () => {
  render(<SectionThree />);

  userEvent.click(screen.getByRole('tab', { name: 'Tab Two' }));

  const headings = screen.getAllByRole('heading', { level: 2 });
  expect(headings.map((h) => h.textContent)).toEqual([
    'Subsection One',
    'Subsection Two',
    'Subsection Three',
    'Subsection Four',
    'Subsection Five',
  ]);

  const paragraphs = screen.getAllByText(/./, { selector: 'p' });
  expect(paragraphs.length).toBe(15);

  const totalLength = paragraphs.reduce(
    (sum, p) => sum + p.textContent.length,
    0
  );
  expect(totalLength).toBeGreaterThan(2000);
});
```

Run: `CI=true npx react-scripts test src/components/pages/SectionThree.verify.test.js --watchAll=false`
Expected: 1 test passes.

Then **delete `src/components/pages/SectionThree.verify.test.js`** — it is
a one-time verification aid, not a permanent deliverable. Confirm
`git status` shows no test file before committing.

The `totalLength > 2000` check is a proxy for "enough content to make the
page scroll" (jsdom, used by this test runner, doesn't compute real layout
metrics like `scrollHeight`, so overflow itself can't be asserted
programmatically). 2000 characters of body text comfortably exceeds what
fits in a typical viewport at the app's font size — the same order of
magnitude as `SectionOne`'s existing content, which is already confirmed to
overflow `MainContent` per the app-shell-layout spec.

- [ ] **Step 5: Commit**

```bash
git add src/components/pages/SectionThree.js src/components/pages/SectionThree.scss
git commit -m "Add 5 subsections to Section Three Tab Two"
```

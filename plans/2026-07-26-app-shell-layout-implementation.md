# App Shell Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Create React App single-page app with a fixed header, a fixed left-hand nav (5 flat links), and a scrollable main content area, routed with React Router v5.

**Architecture:** A nested-flexbox app shell (`App.js`) renders `<Header />` above a flex row containing `<Sidebar />` (fixed width) and `<MainContent />` (`flex: 1`, `overflow-y: auto`). `MainContent` owns the `<Switch>` of 5 routes, one per lorem-ipsum page component. Each component gets its own `.scss` file imported directly into it.

**Tech Stack:** Create React App (`react-scripts`), React 16, `react-router-dom` v5, `sass` (Dart Sass via the `sass` npm package, CRA's supported SCSS pipeline).

## Global Constraints

- React must be pinned to v16 (not CRA's current default of v18) — spec requirement.
- Routing must use `react-router-dom` v5 and update the browser URL per section (bookmarkable, back/forward support).
- 5 nav sections, flat (no nesting/grouping).
- Styling pattern: one `.scss` file per component, imported directly into that component's `.js` file. No CSS Modules, no styled-components.
- Content is placeholder lorem ipsum — no real content required.
- Testing scope is intentionally minimal: keep only the default CRA smoke test (updated to match new app content). No additional automated test coverage is required for this layout scaffold — full behavioral verification (scrolling, fixed positioning, routing) happens via manual browser check in the final task.
- Dropdown menus / expandable nav are explicitly out of scope for this plan.

---

### Task 1: Project Scaffold, React 16 Pin, Router & Sass Install

**Files:**
- Create (via CRA scaffold, moved into project root): `package.json`, `package-lock.json`, `.gitignore`, `README.md`, `public/*`, `src/*`
- Modify: `src/index.js`

**Interfaces:**
- Produces: a working CRA project at the repo root, running React `^16.14.0` / `react-dom@^16.14.0`, with `react-router-dom@^5.3.4` and `sass@^1.77.0` installed as dependencies, and `@testing-library/react@^12.1.5` (React 16-compatible) as a dev dependency. Later tasks import `react-router-dom` exports (`BrowserRouter`, `Switch`, `Route`, `Redirect`, `NavLink`) and write `.scss` files that the CRA/`sass` pipeline compiles.

- [ ] **Step 1: Scaffold the CRA app into a temporary subdirectory**

Run:
```bash
npx create-react-app cra-scaffold-tmp
```

Expected: a new `cra-scaffold-tmp/` directory containing `package.json`, `src/`, `public/`, `node_modules/`, `.gitignore`, `README.md`.

- [ ] **Step 2: Move the scaffolded files into the project root**

The project root already has a `.git` directory and a `specs/` folder — do not overwrite `.git`. Use `rsync` to copy everything except `.git`, then remove the temp directory:

```bash
rsync -a --exclude='.git' cra-scaffold-tmp/ ./
rm -rf cra-scaffold-tmp
```

- [ ] **Step 3: Verify the vanilla scaffold builds and tests pass**

Run: `CI=true npm test`
Expected: PASS — 1 test, "renders learn react link".

Run: `npm run build`
Expected: "Compiled successfully."

- [ ] **Step 4: Pin React to v16 and install a React-16-compatible Testing Library**

Run:
```bash
npm install react@^16.14.0 react-dom@^16.14.0 @testing-library/react@^12.1.5
```

`@testing-library/react@13+` requires `ReactDOM.createRoot` (React 18); v12 uses the legacy `ReactDOM.render` API and works with React 16.

- [ ] **Step 5: Update `src/index.js` to use the legacy `ReactDOM.render` API**

`react-dom@16` has no `react-dom/client` export, so the CRA-18-generated `createRoot` call must be replaced:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
```

- [ ] **Step 6: Re-verify build and test pass on React 16**

Run: `CI=true npm test`
Expected: PASS.

Run: `npm run build`
Expected: "Compiled successfully."

- [ ] **Step 7: Install react-router-dom v5 and sass**

Run:
```bash
npm install react-router-dom@^5.3.4 sass@^1.77.0
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Scaffold CRA app pinned to React 16, add react-router-dom v5 and sass"
```

---

### Task 2: Page Components (5 Lorem Ipsum Sections)

**Files:**
- Create: `src/components/pages/SectionOne.js`
- Create: `src/components/pages/SectionTwo.js`
- Create: `src/components/pages/SectionThree.js`
- Create: `src/components/pages/SectionFour.js`
- Create: `src/components/pages/SectionFive.js`

**Interfaces:**
- Consumes: nothing (pure presentational components, no props).
- Produces: `SectionOne`, `SectionTwo`, `SectionThree`, `SectionFour`, `SectionFive` — each a default-exported React functional component taking no props, rendering an `<h1>` heading and 5 `<p>` paragraphs of lorem ipsum. `MainContent` (Task 5) imports these by path, e.g. `import SectionOne from '../pages/SectionOne';`.

- [ ] **Step 1: Create the 5 page components**

`src/components/pages/SectionOne.js`:
```javascript
import React from 'react';

function SectionOne() {
  return (
    <div>
      <h1>Section One</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
      <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.</p>
      <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>
    </div>
  );
}

export default SectionOne;
```

`src/components/pages/SectionTwo.js`:
```javascript
import React from 'react';

function SectionTwo() {
  return (
    <div>
      <h1>Section Two</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
      <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.</p>
      <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>
    </div>
  );
}

export default SectionTwo;
```

`src/components/pages/SectionThree.js`:
```javascript
import React from 'react';

function SectionThree() {
  return (
    <div>
      <h1>Section Three</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
      <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.</p>
      <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>
    </div>
  );
}

export default SectionThree;
```

`src/components/pages/SectionFour.js`:
```javascript
import React from 'react';

function SectionFour() {
  return (
    <div>
      <h1>Section Four</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
      <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.</p>
      <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>
    </div>
  );
}

export default SectionFour;
```

`src/components/pages/SectionFive.js`:
```javascript
import React from 'react';

function SectionFive() {
  return (
    <div>
      <h1>Section Five</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
      <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.</p>
      <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>
    </div>
  );
}

export default SectionFive;
```

- [ ] **Step 2: Verify the project still builds**

Run: `npm run build`
Expected: "Compiled successfully." (These components aren't wired into the app yet — this step only catches syntax errors. Full behavioral verification happens in Task 6.)

- [ ] **Step 3: Commit**

```bash
git add src/components/pages
git commit -m "Add 5 lorem ipsum page components"
```

---

### Task 3: Header Component

**Files:**
- Create: `src/components/Header/Header.js`
- Create: `src/components/Header/Header.scss`

**Interfaces:**
- Consumes: nothing.
- Produces: `Header` — a default-exported React functional component, no props, rendering `<header className="header">`. App.js (Task 6) imports it as `import Header from './components/Header/Header';`.

- [ ] **Step 1: Create the Header component**

`src/components/Header/Header.js`:
```javascript
import React from 'react';
import './Header.scss';

function Header() {
  return (
    <header className="header">
      <h1 className="header__title">App Shell Demo</h1>
    </header>
  );
}

export default Header;
```

- [ ] **Step 2: Create the Header styles**

`src/components/Header/Header.scss`:
```scss
.header {
  height: 60px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background-color: #1f2937;
  color: #ffffff;
  box-sizing: border-box;
}

.header__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}
```

- [ ] **Step 3: Verify the project still builds**

Run: `npm run build`
Expected: "Compiled successfully."

- [ ] **Step 4: Commit**

```bash
git add src/components/Header
git commit -m "Add Header component"
```

---

### Task 4: Sidebar Component

**Files:**
- Create: `src/components/Sidebar/Sidebar.js`
- Create: `src/components/Sidebar/Sidebar.scss`

**Interfaces:**
- Consumes: `NavLink` from `react-router-dom` (installed in Task 1). Must be rendered inside a `<BrowserRouter>` (provided by App.js in Task 6) to function at runtime.
- Produces: `Sidebar` — a default-exported React functional component, no props, rendering a `<nav className="sidebar">` with 5 `NavLink`s pointing to `/section-one` through `/section-five`. App.js (Task 6) imports it as `import Sidebar from './components/Sidebar/Sidebar';`.

- [ ] **Step 1: Create the Sidebar component**

`src/components/Sidebar/Sidebar.js`:
```javascript
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.scss';

const NAV_ITEMS = [
  { path: '/section-one', label: 'Section One' },
  { path: '/section-two', label: 'Section Two' },
  { path: '/section-three', label: 'Section Three' },
  { path: '/section-four', label: 'Section Four' },
  { path: '/section-five', label: 'Section Five' },
];

function Sidebar() {
  return (
    <nav className="sidebar">
      <ul className="sidebar__list">
        {NAV_ITEMS.map((item) => (
          <li key={item.path} className="sidebar__item">
            <NavLink
              to={item.path}
              className="sidebar__link"
              activeClassName="sidebar__link--active"
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Sidebar;
```

- [ ] **Step 2: Create the Sidebar styles**

`src/components/Sidebar/Sidebar.scss`:
```scss
.sidebar {
  width: 220px;
  flex-shrink: 0;
  overflow: hidden;
  background-color: #f3f4f6;
  box-sizing: border-box;
}

.sidebar__list {
  list-style: none;
  margin: 0;
  padding: 8px 0;
}

.sidebar__item {
  margin: 0;
}

.sidebar__link {
  display: block;
  padding: 12px 16px;
  color: #1f2937;
  text-decoration: none;

  &:hover {
    background-color: #e5e7eb;
  }

  &--active {
    background-color: #d1d5db;
    font-weight: 600;
  }
}
```

- [ ] **Step 3: Verify the project still builds**

Run: `npm run build`
Expected: "Compiled successfully."

- [ ] **Step 4: Commit**

```bash
git add src/components/Sidebar
git commit -m "Add Sidebar component with 5 flat nav links"
```

---

### Task 5: MainContent Component & Routing

**Files:**
- Create: `src/components/MainContent/MainContent.js`
- Create: `src/components/MainContent/MainContent.scss`

**Interfaces:**
- Consumes: `SectionOne`, `SectionTwo`, `SectionThree`, `SectionFour`, `SectionFive` from `../pages/SectionOne` etc. (Task 2, default exports, no props). `Switch`, `Route`, `Redirect` from `react-router-dom` (Task 1). Must be rendered inside a `<BrowserRouter>` (provided by App.js in Task 6).
- Produces: `MainContent` — a default-exported React functional component, no props, rendering `<main className="main-content">` containing a `<Switch>` that routes `/section-one` through `/section-five` to their matching page component, redirects `/` to `/section-one`, and redirects any unmatched path to `/section-one`. App.js (Task 6) imports it as `import MainContent from './components/MainContent/MainContent';`.

- [ ] **Step 1: Create the MainContent component**

`src/components/MainContent/MainContent.js`:
```javascript
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import SectionOne from '../pages/SectionOne';
import SectionTwo from '../pages/SectionTwo';
import SectionThree from '../pages/SectionThree';
import SectionFour from '../pages/SectionFour';
import SectionFive from '../pages/SectionFive';
import './MainContent.scss';

function MainContent() {
  return (
    <main className="main-content">
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/section-one" />} />
        <Route exact path="/section-one" component={SectionOne} />
        <Route exact path="/section-two" component={SectionTwo} />
        <Route exact path="/section-three" component={SectionThree} />
        <Route exact path="/section-four" component={SectionFour} />
        <Route exact path="/section-five" component={SectionFive} />
        <Redirect to="/section-one" />
      </Switch>
    </main>
  );
}

export default MainContent;
```

- [ ] **Step 2: Create the MainContent styles**

`src/components/MainContent/MainContent.scss`:
```scss
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  box-sizing: border-box;
}
```

- [ ] **Step 3: Verify the project still builds**

Run: `npm run build`
Expected: "Compiled successfully."

- [ ] **Step 4: Commit**

```bash
git add src/components/MainContent
git commit -m "Add MainContent component with routing"
```

---

### Task 6: App Shell Integration

**Files:**
- Modify: `src/App.js`
- Create: `src/App.scss`
- Delete: `src/App.css`, `src/logo.svg`
- Modify: `src/App.test.js`

**Interfaces:**
- Consumes: `Header` (Task 3, `./components/Header/Header`), `Sidebar` (Task 4, `./components/Sidebar/Sidebar`), `MainContent` (Task 5, `./components/MainContent/MainContent`), `BrowserRouter` from `react-router-dom` (Task 1).
- Produces: `App` — the root component rendered by `src/index.js` (already wired in Task 1, unchanged here).

- [ ] **Step 1: Remove unused default CRA boilerplate**

```bash
rm src/App.css src/logo.svg
```

- [ ] **Step 2: Write the App shell**

`src/App.js`:
```javascript
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import './App.scss';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />
        <div className="app-shell__body">
          <Sidebar />
          <MainContent />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
```

- [ ] **Step 3: Write the App shell styles**

`src/App.scss`:
```scss
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.app-shell__body {
  display: flex;
  flex: 1;
  min-height: 0;
}
```

`min-height: 0` on `.app-shell__body` overrides flexbox's default `min-height: auto` on flex items — without it, `MainContent`'s `overflow-y: auto` cannot take effect and the whole page scrolls instead of just the content area.

- [ ] **Step 4: Update the smoke test to match the new app content**

The default CRA test asserts a "learn react" link that no longer exists. Replace it with a smoke test asserting the app renders and the default route redirect works:

`src/App.test.js`:
```javascript
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the app shell and redirects to section one', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /section one/i })).toBeInTheDocument();
});
```

- [ ] **Step 5: Run the smoke test**

Run: `CI=true npm test`
Expected: PASS.

- [ ] **Step 6: Run the production build**

Run: `npm run build`
Expected: "Compiled successfully."

- [ ] **Step 7: Manually verify the layout in a browser**

Run: `npm start` (opens `http://localhost:3000`).

Check:
- The header (dark bar, "App Shell Demo") stays pinned at the top when you scroll the main content.
- The sidebar (light gray, 5 links) sits directly under the header and does not move when you scroll the main content.
- The URL starts at `/` and immediately redirects to `/section-one`; "Section One" content is shown and its nav link is highlighted.
- Clicking each of the 5 sidebar links updates the URL (`/section-two`, `/section-three`, etc.), swaps the main content, and highlights the corresponding link.
- Scrolling the main content area (mouse wheel or trackpad over the lorem ipsum text) scrolls only that area — header and sidebar stay fixed.
- Reloading the browser on a non-root route (e.g. `http://localhost:3000/section-three`) still loads correctly (CRA's dev server handles the client-side routing fallback).

Stop the dev server (Ctrl+C) once verified.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Wire App shell: Header, Sidebar, MainContent, and routing"
```

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

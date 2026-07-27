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

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

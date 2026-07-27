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

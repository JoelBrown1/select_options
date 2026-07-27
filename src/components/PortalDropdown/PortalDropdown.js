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
    console.log('isOpen changed', isOpen);
    if (!isOpen) {
      return undefined;
    }

    // A window/page-level scroll event's target is `document`; we
    // unconditionally reposition the menu to keep it attached to its trigger.
    // A scroll on an inner scrollable element (e.g. the list ancestor) targets
    // that element instead and follows the REPOSITION_ON_SCROLL gating: either
    // reposition the menu or close it.
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

  function handleTriggerClick() {
    console.log('trigger clicked');
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

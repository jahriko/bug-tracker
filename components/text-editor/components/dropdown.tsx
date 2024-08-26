'use client';

import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from '@/components/catalyst/dropdown';

const dropDownPadding = 4;

export function DropDownItem({
  children,
  className,
  onClick,
  title,
}: {
  children: React.ReactNode;
  className: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  title?: string;
}) {
  return (
    <DropdownItem className={className} title={title} onClick={onClick}>
      {children}
    </DropdownItem>
  );
}

function DropDownItems({
  children,
  dropDownRef,
  onClose,
}: {
  children: React.ReactNode;
  dropDownRef: React.Ref<HTMLDivElement>;
  onClose: () => void;
}) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (['Escape', 'Tab'].includes(event.key)) {
      event.preventDefault();
      onClose();
    }
  };

  return (
    <DropdownMenu ref={dropDownRef} onKeyDown={handleKeyDown}>
      {children}
    </DropdownMenu>
  );
}

export default function DropDown({
  disabled = false,
  buttonLabel,
  buttonAriaLabel,
  buttonClassName,
  buttonIconClassName,
  children,
  stopCloseOnClickSelf,
}: {
  disabled?: boolean;
  buttonAriaLabel?: string;
  buttonClassName: string;
  buttonIconClassName?: string;
  buttonLabel?: string;
  children: React.ReactNode;
  stopCloseOnClickSelf?: boolean;
}): JSX.Element {
  const dropDownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showDropDown, setShowDropDown] = useState(false);

  const handleClose = useCallback(() => {
    setShowDropDown(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    const button = buttonRef.current;
    const dropDown = dropDownRef.current;

    if (showDropDown && button && dropDown) {
      const { top, left } = button.getBoundingClientRect();
      dropDown.style.top = `${top + button.offsetHeight + dropDownPadding}px`;
      dropDown.style.left = `${Math.min(
        left,
        window.innerWidth - dropDown.offsetWidth - 20,
      )}px`;
    }
  }, [showDropDown]);

  useEffect(() => {
    const button = buttonRef.current;

    if (button && showDropDown) {
      const handle = (event: MouseEvent) => {
        const target = event.target as Node;
        if (stopCloseOnClickSelf && dropDownRef.current?.contains(target)) {
          return;
        }
        if (!button.contains(target)) {
          setShowDropDown(false);
        }
      };
      document.addEventListener('click', handle);

      return () => {
        document.removeEventListener('click', handle);
      };
    }
  }, [showDropDown, stopCloseOnClickSelf]);

  useEffect(() => {
    const handleButtonPositionUpdate = () => {
      if (showDropDown) {
        const button = buttonRef.current;
        const dropDown = dropDownRef.current;
        if (button && dropDown) {
          const { top } = button.getBoundingClientRect();
          const newPosition = top + button.offsetHeight + dropDownPadding;
          if (newPosition !== dropDown.getBoundingClientRect().top) {
            dropDown.style.top = `${newPosition}px`;
          }
        }
      }
    };

    document.addEventListener('scroll', handleButtonPositionUpdate);

    return () => {
      document.removeEventListener('scroll', handleButtonPositionUpdate);
    };
  }, [showDropDown]);

  return (
    <Dropdown>
      <DropdownButton
        ref={buttonRef}
        aria-label={buttonAriaLabel ?? buttonLabel}
        as="button"
        className={buttonClassName}
        disabled={disabled}
        onClick={() => setShowDropDown(!showDropDown)}
      >
        {buttonIconClassName ? <span className={buttonIconClassName} /> : null}
        {buttonLabel ? (
          <span className="text dropdown-button-text">{buttonLabel}</span>
        ) : null}
        <i className="chevron-down" />
      </DropdownButton>

      {showDropDown
        ? createPortal(
            <DropDownItems dropDownRef={dropDownRef} onClose={handleClose}>
              {children}
            </DropDownItems>,
            document.body,
          )
        : null}
    </Dropdown>
  );
}

'use client';

import * as React from 'react';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';

import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from '@/components/catalyst/dropdown';

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <Dropdown>
      <DropdownButton>
        <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </DropdownButton>
      <DropdownMenu aria-label="Switch theme">
        <DropdownItem onClick={() => setTheme('light')}>Light</DropdownItem>
        <DropdownItem onClick={() => setTheme('dark')}>Dark</DropdownItem>
        <DropdownItem onClick={() => setTheme('system')}>System</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

import { UserCircleIcon, UserIcon } from '@heroicons/react/16/solid';
import { redirect } from 'next/navigation';
import React from 'react';
import LogoutButton from '@/app/(platform)/(auth)/_components/logout-button';
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/catalyst/dropdown';
import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from '@/components/catalyst/navbar';
import {
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarItem,
  SidebarSection,
} from '@/components/catalyst/sidebar';
import { StackedLayout } from '@/components/catalyst/stacked-layout';
import { getCurrentUser } from '@/lib/get-current-user';
import { getPrisma } from '@/lib/getPrisma';
import NavbarLinks from './_components/navbar-links';
import SwitchWorkspace from './_components/switch-workspace';

const navItems = [
  { label: 'Issues', url: '/issues' },
  { label: 'Projects', url: '/projects' },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentUser();

  if (!session) {
    redirect('/login');
  }

  const workspaces = await getPrisma(session.userId).workspace.findMany({
    select: {
      id: true,
      name: true,
      url: true,
    },
  });

  return (
    <StackedLayout
      navbar={
        <Navbar>
          <SwitchWorkspace workspaces={workspaces} />
          <NavbarDivider className="max-lg:hidden" />
          <NavbarSection className="max-lg:hidden">
            <NavbarLinks />
          </NavbarSection>
          <NavbarSpacer />
          <NavbarSection>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <UserCircleIcon />
              </DropdownButton>
              <DropdownMenu anchor="bottom end" className="min-w-64">
                <DropdownHeader>
                  <div className="pr-6">
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Signed in as {session.name}
                    </div>
                    <div className="text-sm/7 font-semibold text-zinc-800 dark:text-white">
                      {session.email}
                    </div>
                  </div>
                </DropdownHeader>
                <DropdownItem href="/my-profile">
                  <UserIcon />
                  <DropdownLabel>My profile</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <LogoutButton />
              </DropdownMenu>
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <SwitchWorkspace workspaces={workspaces} />
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              {navItems.map(({ label, url }) => (
                <SidebarItem key={label} href={url}>
                  {label}
                </SidebarItem>
              ))}
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      {children}
    </StackedLayout>
  );
}

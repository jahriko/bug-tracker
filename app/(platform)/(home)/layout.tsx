import { UserCircleIcon, UserIcon } from '@heroicons/react/16/solid';
import { redirect } from 'next/navigation';
import React from 'react';
import LogoutButton from '@/app/(platform)/(auth)/_components/logout-button';
import { Avatar } from '@/components/catalyst/avatar';
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
import { ModeToggle } from '@/components/theme-toggle';
import { getPrisma } from '@/lib/getPrisma';
import { getUserDetails } from '@/lib/supabase/auth';
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
  const { user } = await getUserDetails();

  if (!user) {
    redirect('/login');
  }

  const metadata = user.user_metadata;

  const workspaces = await getPrisma(user.id).workspace.findMany({
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
            {/* <ModeToggle /> */}
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                {metadata.avatarUrl ? (
                  <Avatar className="size-5" src={metadata.avatarUrl} />
                ) : (
                  <UserCircleIcon />
                )}
              </DropdownButton>
              <DropdownMenu anchor="bottom end" className="min-w-64">
                <DropdownHeader>
                  <div className="pr-6">
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Signed in as {user.email}
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

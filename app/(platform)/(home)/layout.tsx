import LogoutButton from "@/app/(platform)/(auth)/_components/logout-button"
// import SwitchWorkspace from "@/components/SwitchWorkspace"
import { SolarBugBoldDuotone } from "@/components/bug-icon"
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "@/components/catalyst/dropdown"
import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from "@/components/catalyst/navbar"
import {
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarItem,
  SidebarSection,
} from "@/components/catalyst/sidebar"
import { StackedLayout } from "@/components/catalyst/stacked-layout"
import { getCurrentUser } from "@/lib/get-current-user"
import prisma from "@/lib/prisma"
import { UserCircleIcon, UserIcon } from "@heroicons/react/16/solid"
import { InboxIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid"
import { enhance } from "@zenstackhq/runtime"
import Link from "next/link"
import React from "react"

const navItems = [
  { label: "Issues", url: "/issues" },
  { label: "Projects", url: "/projects" },
]

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getCurrentUser()
  const db = enhance(prisma, { user: { id: session.userId } })

  const workspaces = await db.workspace.findMany({
    select: {
      id: true,
      name: true,
      url: true,
    },
  })

  return (
    <StackedLayout
      navbar={
        <Navbar>
          <Link
            className="hidden items-center gap-2 text-lg font-semibold md:flex md:text-base"
            href="/"
          >
            <SolarBugBoldDuotone className="size-8" />
          </Link>
          <NavbarDivider className="max-lg:hidden" />
          {/* <SwitchWorkspace workspaces={workspaces} /> */}
          <NavbarSection className="max-lg:hidden">
            {navItems.map(({ label, url }) => (
              <NavbarItem href={url} key={label}>
                {label}
              </NavbarItem>
            ))}
          </NavbarSection>
          <NavbarSpacer />
          <NavbarSection>
            <NavbarItem aria-label="Search" href="/search">
              <MagnifyingGlassIcon />
            </NavbarItem>
            <NavbarItem aria-label="Inbox" href="/inbox">
              <InboxIcon />
            </NavbarItem>
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
                <SidebarItem href={url} key={label}>
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
  )
}

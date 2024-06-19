import BreadcrumbNavigation from "@/components/BreadcrumbNavigation"
import LogoutButton from "@/components/LogoutButton"
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
import { Sidebar, SidebarHeader } from "@/components/catalyst/sidebar"
import { StackedLayout } from "@/components/catalyst/stacked-layout"
import { getSession } from "@/lib/get-current-user"
import { getProjects } from "@/server/data/many/get-projects"
import { getWorkspaces } from "@/server/data/many/get-workspaces"
import { UserCircleIcon, UserIcon } from "@heroicons/react/16/solid"
import Link from "next/link"
import React from "react"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const projects = await getProjects()
  const workspaces = await getWorkspaces()
  const session = await getSession()

  return (
    <>
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
            <BreadcrumbNavigation projects={projects} workspaces={workspaces} />
            <NavbarSpacer />
            <NavbarSection>
              <Dropdown>
                <DropdownButton as={NavbarItem}>
                  <UserCircleIcon />
                  {/* <Avatar
                    square
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  /> */}
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
              {/* <SwitchWorkspace workspaces={workspaces} /> */}
              <div className="-mx-2 flex items-center px-2 py-6">
                <img
                  alt=""
                  className="mr-2 size-8 rounded-sm object-cover"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                />
                <div className="text-left">
                  <p className="text-sm font-medium">{session.name}</p>
                  <p className="text-xs text-gray-400">{session.email}</p>
                </div>
              </div>
            </SidebarHeader>
          </Sidebar>
        }
      >
        {children}
      </StackedLayout>
    </>
  )
}

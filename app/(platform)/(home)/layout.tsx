import React from "react"
import Link from "next/link"
import {
  UserIcon,
  ArrowRightStartOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/16/solid"
import { getProjects } from "@/server/data/many/get-projects"
import { getWorkspaces } from "@/server/data/many/get-workspaces"
import BreadcrumbNavigation from "@/components/BreadcrumbNavigation"
import { SolarBugBoldDuotone } from "@/components/bug-icon"
import { StackedLayout } from "@/components/catalyst/stacked-layout"
import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from "@/components/catalyst/navbar"
import {
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
  DropdownLabel,
  DropdownDivider,
  DropdownHeader,
} from "@/components/catalyst/dropdown"
import { Sidebar, SidebarHeader } from "@/components/catalyst/sidebar"
import { auth } from "@/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const projects = await getProjects()
  const workspaces = await getWorkspaces()
  const session = await auth()

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
                        Signed in as {session?.user.name}
                      </div>
                      <div className="text-sm/7 font-semibold text-zinc-800 dark:text-white">
                        {session?.user.email}
                      </div>
                    </div>
                  </DropdownHeader>
                  <DropdownItem href="/my-profile">
                    <UserIcon />
                    <DropdownLabel>My profile</DropdownLabel>
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem href="/logout">
                    <ArrowRightStartOnRectangleIcon />
                    <DropdownLabel>Sign out</DropdownLabel>
                  </DropdownItem>
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
                  <p className="text-sm font-medium">{session.user.name}</p>
                  <p className="text-xs text-gray-400">{session.user.email}</p>
                </div>
              </div>
            </SidebarHeader>
          </Sidebar>
        }
      >
        {children}
      </StackedLayout>
      {/* <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
            href="/"
          >
            <SolarBugBoldDuotone className="size-8" />
          </Link>
          <BreadcrumbNavigation projects={projects} workspaces={workspaces} />
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="shrink-0 md:hidden"
              size="icon"
              variant="outline"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                className="flex items-center gap-2 text-lg font-semibold"
                href="#"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
              </Link>
              <Link className="hover:text-foreground" href="#">
                Dashboard
              </Link>
              <Link
                className="text-muted-foreground hover:text-foreground"
                href="#"
              >
                Orders
              </Link>
              <Link
                className="text-muted-foreground hover:text-foreground"
                href="#"
              >
                Products
              </Link>
              <Link
                className="text-muted-foreground hover:text-foreground"
                href="#"
              >
                Customers
              </Link>
              <Link
                className="text-muted-foreground hover:text-foreground"
                href="#"
              >
                Analytics
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">

          <div className="ml-auto flex-1 sm:flex-initial">
            <ProfileDropdown />
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="container mx-auto">{children}</div>
      </main> */}
    </>
  )
}

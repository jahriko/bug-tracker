"use client"

import { Avatar } from "@/components/catalyst/avatar"
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "@/components/catalyst/dropdown"
import { NavbarItem, NavbarLabel } from "@/components/catalyst/navbar"
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/16/solid"
import { Workspace } from "@prisma/client"
import { usePathname } from "next/navigation"

export default function SwitchWorkspace({ workspaces }: { workspaces: Workspace[] }) {
  const path = usePathname()
  const getWorkspaceUrl = path.split("/")[1]
  const workspaceUrlToName = workspaces.find(
    (workspace) => workspace.url === getWorkspaceUrl,
  )?.name
  return (
    <Dropdown>
      <DropdownButton as={NavbarItem} className="max-lg:hidden">
        <Avatar
          className="bg-zinc-500 text-white"
          initials={workspaceUrlToName?.substring(0, 2)}
          slot="icon"
        />
        <NavbarLabel>{workspaceUrlToName}</NavbarLabel>
        <ChevronDownIcon />
      </DropdownButton>
      <DropdownMenu anchor="bottom start" className="min-w-80 lg:min-w-64">
        {workspaces.map((workspace) => (
          <DropdownItem href={`/${workspace.url}/issues`} key={workspace.id}>
            <Avatar
              className="bg-zinc-500 text-white"
              initials={workspace.name.substring(0, 2)}
              slot="icon"
            />
            <DropdownLabel>{workspace.name}</DropdownLabel>
          </DropdownItem>
        ))}
        <DropdownDivider />
        <DropdownItem href="/create-workspace">
          <PlusIcon />
          <DropdownLabel>New workspace&hellip;</DropdownLabel>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

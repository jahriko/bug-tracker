'use client';

import {
  ChevronDownIcon,
  Cog6ToothIcon,
  PlusIcon,
} from '@heroicons/react/16/solid';
import { type Workspace } from '@prisma/client';
import { usePathname } from 'next/navigation';
import { Avatar } from '@/components/catalyst/avatar';
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/catalyst/dropdown';
import { NavbarItem, NavbarLabel } from '@/components/catalyst/navbar';

export default function SwitchWorkspace({
  workspaces,
}: {
  workspaces: Workspace[];
}) {
  const path = usePathname();
  const getWorkspaceUrl = path.split('/')[1];
  const workspaceUrlToName = workspaces.find(
    (workspace) => workspace.url === getWorkspaceUrl,
  )?.name;
  // const [isOpen, setIsOpen] = useState(false)

  return (
    <Dropdown>
      <DropdownButton as={NavbarItem} className="max-lg:hidden">
        <Avatar
          square
          className="bg-zinc-900 text-white dark:bg-white dark:text-black"
          initials={workspaceUrlToName?.substring(0, 2) ?? ''}
          slot="icon"
        />
        <NavbarLabel>{workspaceUrlToName}</NavbarLabel>
        <ChevronDownIcon />
      </DropdownButton>
      <DropdownMenu anchor="bottom start" className="min-w-80 lg:min-w-64">
        {workspaces.map((workspace) => (
          <DropdownItem key={workspace.id} href={`/${workspace.url}/issues`}>
            <Avatar
              square
              className="bg-zinc-900 text-white dark:bg-white dark:text-black"
              initials={workspace.name.substring(0, 2)}
              slot="icon"
            />
            <DropdownLabel>{workspace.name}</DropdownLabel>
          </DropdownItem>
        ))}
        <DropdownDivider />
        <DropdownItem href={`/${getWorkspaceUrl}/settings`}>
          <Cog6ToothIcon />
          <DropdownLabel>Workspace Settings</DropdownLabel>
        </DropdownItem>
        <DropdownItem href="/create-workspace/">
          <PlusIcon />
          <DropdownLabel>New workspace&hellip;</DropdownLabel>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

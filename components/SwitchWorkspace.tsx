"use client"
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid"
import { ChevronUpDownIcon, PlusIcon } from "@heroicons/react/24/outline"
import { usePathname } from "next/navigation"
import { Input, InputGroup } from "@/components/catalyst/input"
import { WorkspacesData } from "@/server/data/many/get-workspaces"
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  DropdownDivider,
  DropdownHeading,
  DropdownHeader,
  DropdownLabel,
  DropdownSection,
} from "@/components/catalyst/dropdown"
import { Avatar } from "./catalyst/avatar"

interface SelectWorkspaceProps {
  workspaces: WorkspacesData
}

export default function SwitchWorkspace({ workspaces }: SelectWorkspaceProps) {
  const pathname = usePathname()

  return (
    <>
      <div className="flex items-center gap-x-2">
        <a
          className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700"
          href={`/${pathname.split("/")[1]}`}
        >
          {pathname.split("/")[1]}
        </a>
        <Dropdown>
          <DropdownButton aria-label="More options" className="max-w-6" plain>
            <ChevronUpDownIcon className="h-4 w-4 text-gray-500 hover:text-gray-700" />
          </DropdownButton>
          <DropdownMenu className="min-w-80 lg:min-w-60">
            <DropdownHeader>
              <InputGroup>
                <MagnifyingGlassIcon />
                <Input
                  aria-label="Search"
                  name="search"
                  placeholder="Search workspaces&hellip;"
                />
              </InputGroup>
            </DropdownHeader>
            <DropdownSection>
              <DropdownHeading>My workspaces</DropdownHeading>
              {workspaces.map((workspace: WorkspacesData[number]) => (
                <DropdownItem href={workspace.name} key={workspace.id}>
                  <Avatar
                    initials={workspace.name.substring(0, 2).toUpperCase()}
                    slot="icon"
                  />
                  <DropdownLabel>{workspace.name}</DropdownLabel>
                </DropdownItem>
              ))}
            </DropdownSection>

            <DropdownDivider />
            <DropdownItem href="/create-workspace">
              <PlusIcon />
              <DropdownLabel>New workspace</DropdownLabel>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button className="w-6" size="icon" variant="ghost">
            <ChevronUpDownIcon className="h-4 w-4 text-gray-500 hover:text-gray-700" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="center" className="w-[200px] p-0">
          <Command>
            <CommandInput className="h-9" placeholder="Search workspace" />
            <CommandEmpty>No workspace found.</CommandEmpty>
            <CommandGroup heading="Workspaces">
              {workspaces.map((workspace: WorkspacesData[number]) => (
                <Link href={`/${workspace.name}`} key={workspace.id}>
                  <CommandItem
                    key={workspace.id.toString()}
                    onSelect={(currentValue) => {
                      setValue(currentValue === id ? "" : currentValue)
                      setOpen(false)
                    }}
                    value={workspace.id.toString()}
                  >
                    {workspace.name}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        id === workspace.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                </Link>
              ))}
              <CommandItem>
                <Link
                  className="flex items-center gap-x-1"
                  href="/create-workspace"
                >
                  <PlusCircledIcon className="h-4 w-4" />
                  Create workspace
                </Link>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
          </Command>
        </PopoverContent>
      </Popover> */}
    </>
  )
}

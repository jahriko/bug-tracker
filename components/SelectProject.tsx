"use client"
import { ChevronUpDownIcon, } from "@heroicons/react/24/outline"
import { usePathname } from "next/navigation"
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid"
import { Input, InputGroup } from "@/components/catalyst/input"
import { ProjectsData } from "@/server/data/many/get-projects"
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  DropdownHeading,
  DropdownHeader,
  DropdownLabel,
  DropdownSection,
} from "@/components/catalyst/dropdown"
import { Avatar } from "./catalyst/avatar"

interface SelectProjectProps {
  projects: ProjectsData
}

export default function SwitchProject({ projects }: SelectProjectProps) {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-x-2">
      <a
        className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700"
        href={`${pathname.split("/")[2]}`}
      >
        {decodeURIComponent(pathname.split("/")[2])}
      </a>
      <Dropdown>
        <DropdownButton aria-label="More options" className="max-w-6" plain>
          <ChevronUpDownIcon className="h-4 w-4 text-gray-500 hover:text-gray-700" />
        </DropdownButton>
        <DropdownMenu className="min-w-80 lg:min-w-48">
          <DropdownHeader>
            <InputGroup>
              <MagnifyingGlassIcon />
              <Input
                aria-label="Search"
                name="search"
                placeholder="Search projects&hellip;"
              />
            </InputGroup>
          </DropdownHeader>
          <DropdownSection>
            <DropdownHeading>My projects</DropdownHeading>
            {projects.map((project: ProjectsData[number]) => (
              <DropdownItem href={project.title} key={project.id}>
                <Avatar
                  initials={project.title.substring(0, 2).toUpperCase()}
                  slot="icon"
                />
                <DropdownLabel>{project.title}</DropdownLabel>
              </DropdownItem>
            ))}
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}

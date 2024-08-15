"use client"

import { NavbarItem } from "@/components/catalyst/navbar"
// import { DocumentTextIcon, MapIcon, RectangleStackIcon } from "@heroicons/react/24/outline"
import {
  ChatBubbleBottomCenterTextIcon,
  CubeIcon,
  DocumentTextIcon,
  RectangleStackIcon,
} from "@heroicons/react/16/solid"
import { usePathname } from "next/navigation"

export default function NavbarLinks() {
  const pathname = usePathname()
  const segments = pathname.split("/")
  const workspaceSlug = segments[1] // Assuming workspace slug is the first segment

  return (
    <>
      <NavbarItem current={segments[2] === "issues"} href={`/${workspaceSlug}/issues`} key="issues">
        <CubeIcon className="h-4 w-4" />
        Issues
      </NavbarItem>
      <NavbarItem current={segments[2] === "projects"} href={`/${workspaceSlug}/projects`} key="projects">
        <RectangleStackIcon className="h-4 w-4" />
        Projects
      </NavbarItem>
      <NavbarItem current={segments[2] === "Wiki"} href={`/${workspaceSlug}/wiki`} key="wiki">
        <DocumentTextIcon className="h-4 w-4" />
        Wiki
      </NavbarItem>
      <NavbarItem current={segments[2] === "discussions"} href={`/${workspaceSlug}/discussions`} key="discussions">
        <ChatBubbleBottomCenterTextIcon className="h-4 w-4" />
        Discussions
      </NavbarItem>
    </>
  )
}

"use client"

import { NavbarItem } from "@/components/catalyst/navbar"
import { usePathname } from "next/navigation"

export default function NavbarLinks() {
  const pathname = usePathname()
  const segments = pathname.split("/")
  const workspaceSlug = segments[1] // Assuming workspace slug is the first segment

  return (
    <>
      <NavbarItem current={segments[2] === "issues"} href={`/${workspaceSlug}/issues`} key="issues">
        Issues
      </NavbarItem>
      <NavbarItem current={segments[2] === "projects"} href={`/${workspaceSlug}/projects`} key="projects">
        Projects
      </NavbarItem>
    </>
  )
}

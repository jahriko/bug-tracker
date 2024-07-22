"use client"

import { NavbarItem } from "@/components/catalyst/navbar"
import { usePathname } from "next/navigation"

export default function NavbarLinks() {
  const path = usePathname().split("/")[2]
  return (
    <>
      <NavbarItem current={path === "issues"} href="issues/" key="issues">
        Issues
      </NavbarItem>
      <NavbarItem current={path === "projects"} href="projects/" key="projects">
        Projects
      </NavbarItem>
    </>
  )
}

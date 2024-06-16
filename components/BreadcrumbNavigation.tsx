"use client"
import { ProjectsData } from "@/server/data/many/get-projects"
import { WorkspacesData } from "@/server/data/many/get-workspaces"
import { usePathname } from "next/navigation"
import SwitchProject from "./SelectProject"
import SwitchWorkspace from "./SwitchWorkspace"

interface BreadcrumbNavigationProps {
  workspaces: WorkspacesData
  projects: ProjectsData
}

export default function BreadcrumbNavigation({
  workspaces,
  projects,
}: BreadcrumbNavigationProps) {
  const pathname = usePathname()

  const segments = pathname.split("/")

  return (
    <ol className="flex items-center space-x-4" role="list">
      <li key="workspace">
        <SwitchWorkspace workspaces={workspaces} />
      </li>

      {segments[2] ? (
        <li key="project">
          <div className="flex items-center">
            <svg
              aria-hidden="true"
              className="h-5 w-5 flex-shrink-0 text-gray-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
            </svg>

            <SwitchProject projects={projects} />
          </div>
        </li>
      ) : null}
    </ol>
  )
}

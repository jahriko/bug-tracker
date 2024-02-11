"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ProjectIdAndTitle } from "../../layout"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}
export default function ProjectList({
  projects,
}: {
  projects: ProjectIdAndTitle[]
}) {
  const path = usePathname()

  return (
    <ul className="-mx-2 mt-2 space-y-0.5">
      {projects.map((project: { id: string; title: string }) => (
        <li key={project.id}>
          <Link
            className={classNames(
              path === project.id
                ? "bg-gray-50 text-indigo-600"
                : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
              "group flex items-center gap-x-3 rounded-md p-2 text-sm font-medium leading-4",
            )}
            href={`/projects/${project.id}/issues`}
          >
            <span
              className={classNames(
                path === project.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600",
                "flex size-6  shrink-0 items-center justify-center rounded-full border bg-gray-50 text-[0.625rem] font-medium",
              )}
            >
              {project.title.charAt(0).toUpperCase()}
            </span>
            <span className="truncate capitalize">{project.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

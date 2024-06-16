"use client"

import { InboxIcon, } from "@heroicons/react/24/outline"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  { name: "All Issues", href: "/all-issues", icon: InboxIcon, current: true },
  // {
  //   name: "Projects",
  //   href: "/projects",
  //   icon: PuzzlePieceIcon,
  //   current: false,
  // },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export default function SidebarNavigationLinks() {
  const path = usePathname()
  return (
    <ul className="-mx-2 space-y-1">
      {navigation.map((item) => (
        <li key={item.name}>
          <Link
            className={classNames(
              path === item.href
                ? "bg-gray-50 text-indigo-600"
                : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
              "group flex gap-x-3 rounded-sm p-2 text-sm font-medium",
            )}
            href={item.href}
          >
            <item.icon
              aria-hidden="true"
              className={classNames(
                path === item.href
                  ? "text-indigo-600"
                  : "text-gray-400 group-hover:text-indigo-600",
                "size-5 shrink-0",
              )}
            />
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}

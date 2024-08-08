import { UserCircleIcon, UsersIcon } from "@heroicons/react/24/outline"
import React from "react"

const secondaryNavigation = [
  { name: "General", href: "", icon: UserCircleIcon },
  { name: "Members", href: "members", icon: UsersIcon },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function SettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { workspaceId: string }
}) {
  const { workspaceId } = params
  return (
    <main className="flex flex-1 flex-col pb-2 lg:px-2">
      <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
        <div className="mx-auto max-w-6xl lg:flex">
          <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
            <nav className="flex-none px-4 sm:px-6 lg:px-0">
              <ul className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col" role="list">
                {secondaryNavigation.map((item) => {
                  const isActive = item.href === `/${workspaceId}/settings/${item.href}`
                  return (
                    <li key={item.name}>
                      <a
                        className={classNames(
                          isActive
                            ? "bg-gray-50 text-indigo-600"
                            : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                          "group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm font-semibold leading-6",
                        )}
                        href={`/${workspaceId}/settings/${item.href}`}
                      >
                        <item.icon
                          aria-hidden="true"
                          className={classNames(
                            isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-indigo-600",
                            "h-6 w-6 shrink-0",
                          )}
                        />
                        {item.name}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </aside>

          <div className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
            <div className="mx-auto max-w-6xl space-y-16 sm:space-y-20 lg:mx-0">{children}</div>
          </div>
        </div>
      </div>
    </main>
  )
}

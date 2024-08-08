"use client"

import { Avatar } from "@/components/catalyst/avatar"
import { Button } from "@/components/catalyst/button"
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from "@/components/catalyst/dialog"
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react"
import { UserCircleIcon, UserPlusIcon } from "@heroicons/react/16/solid"
import { Project } from "@prisma/client"
import clsx from "clsx"
import { Fragment, useState } from "react"

export default function TeamSettings({
  projectMembers,
  projectDetails,
  workspaceMembers,
}: {
  projectMembers: {
    user: {
      image: string | null
      id: string
      name: string
      email: string
    }
    role: "ADMIN" | "PROJECT_MANAGER" | "MEMBER"
  }[]
  projectDetails: Project
  workspaceMembers: {
    id: string
    image: string | null
    email: string
    name: string
  }[]
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <p
        className="cursor-pointer text-base font-medium leading-6 text-gray-900 hover:underline"
        onClick={() => {
          setIsOpen(true)
        }}
      >
        {projectDetails.title}
      </p>

      <Dialog onClose={setIsOpen} open={isOpen}>
        <DialogTitle>Team settings</DialogTitle>
        <DialogDescription>
          Manage team members and project settings for {projectDetails.title}. You can view the current team members
          below.
        </DialogDescription>
        <DialogBody>
          <div className="flex items-center gap-x-2">
            <div className="flex-grow">
              <SearchCombobox people={workspaceMembers} />
            </div>
            <Button>
              <UserPlusIcon />
              Add member
            </Button>
          </div>
          <ul className="divide-y divide-gray-100" role="list">
            {projectMembers.map((member) => (
              <li className="flex items-center justify-between gap-x-4 py-5" key={member.user.email}>
                <div className="flex items-center gap-x-4">
                  {member.user.image ? (
                    <img alt="" className="h-12 w-12 flex-none rounded-full bg-gray-50" src={member.user.image} />
                  ) : (
                    <UserIcon className="h-12 w-12 flex-none rounded-full bg-gray-50 p-2 text-gray-400" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-6 text-gray-900">{member.user.name}</p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">{member.user.email}</p>
                  </div>
                </div>
                <span className={clsx(
                  "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                  member.role === "ADMIN" ? "bg-purple-50 text-purple-700 ring-purple-700/10" :
                  member.role === "PROJECT_MANAGER" ? "bg-green-50 text-green-700 ring-green-700/10" :
                  "bg-gray-50 text-gray-600 ring-gray-500/10"
                )}>
                  {member.role}
                </span>
              </li>
            ))}
          </ul>
        </DialogBody>
        <DialogActions>
          <Button
            onClick={() => {
              setIsOpen(false)
            }}
            plain
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

function SearchCombobox({ people }: { people: { id: string; name: string; image: string | null; email: string }[] }) {
  const [query, setQuery] = useState(" ")
  const [selected, setSelected] = useState<(typeof people)[number] | null>(null)

  const filteredPeople =
    query === ""
      ? people
      : people.filter((person) => {
          return person.name.toLowerCase().includes(query.toLowerCase())
        })

  const sharedClasses = clsx(
    // Base
    "flex min-w-0 items-center",
    // Icons
    "[&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:shrink-0 sm:[&>[data-slot=icon]]:size-4",
    "[&>[data-slot=icon]]:text-zinc-500 [&>[data-slot=icon]]:group-data-[focus]/option:text-white [&>[data-slot=icon]]:dark:text-zinc-400",
    "forced-colors:[&>[data-slot=icon]]:text-[CanvasText] forced-colors:[&>[data-slot=icon]]:group-data-[focus]/option:text-[Canvas]",
    // Avatars
    "[&>[data-slot=avatar]]:-mx-0.5 [&>[data-slot=avatar]]:size-6 sm:[&>[data-slot=avatar]]:size-5",
  )

  return (
    <Combobox
      onChange={setSelected}
      onClose={() => {
        setQuery("")
      }}
      value={selected}
    >
      <div className="relative">
        <div className="relative">
          {selected?.image ? (
            <Avatar
              alt={selected.name}
              className="absolute left-3 top-1/2 size-5 -translate-y-1/2"
              src={selected.image}
            />
          ) : (
            <UserCircleIcon className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-zinc-500" />
          )}
          <ComboboxInput
            className={clsx(
              "w-full rounded-lg py-[calc(theme(spacing[2.5])-1px)] pl-10 pr-3 sm:py-[calc(theme(spacing[1.5])-1px)]",
              "min-h-11 sm:min-h-9",
              "text-base/6 text-zinc-950 placeholder:text-zinc-500 dark:text-white sm:text-sm/6",
              "border border-zinc-950/10 focus:border-zinc-950/20 dark:border-white/10 dark:focus:border-white/20",
              "bg-white dark:bg-white/5",
              "focus:outline-none focus:ring-2 focus:ring-blue-500",
            )}
            displayValue={(person: (typeof people)[number] | null) => person?.name ?? ""}
            onChange={(event) => {
              setQuery(event.target.value)
            }}
            placeholder="Search..."
          />
        </div>
      </div>

      <ComboboxOptions
        anchor="bottom start"
        className={clsx(
          // Base styles
          "isolate mt-1.5 w-max min-w-[calc(var(--button-width)+1.75rem)] select-none scroll-py-1 rounded-xl",
          // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
          "outline outline-1 outline-transparent focus:outline-none",
          // Handle scrolling when menu won't fit in viewport
          "overflow-y-scroll overscroll-contain",
          // Popover background
          "bg-white dark:bg-zinc-800/75",
          // Shadows
          "shadow-lg ring-1 ring-zinc-950/10 dark:ring-inset dark:ring-white/10",
        )}
      >
        {filteredPeople.map((person) => (
          <ComboboxOption as={Fragment} key={person.id} value={person}>
            {({ active, selected }) => (
              <div
                className={clsx(
                  // Basic layout
                  "group/option grid cursor-default grid-cols-[theme(spacing.5),1fr] items-baseline gap-x-2 rounded-lg py-2.5 pr-3.5 sm:grid-cols-[theme(spacing.2),1fr] sm:py-1.5 sm:pr-3",
                  // Typography
                  "text-base/6 text-zinc-950 dark:text-white sm:text-sm/6 forced-colors:text-[CanvasText]",
                  // Focus
                  "outline-none data-[focus]:bg-zinc-100 data-[focus]:text-black",
                  // Forced colors mode
                  "forced-color-adjust-none forced-colors:data-[focus]:bg-[Highlight] forced-colors:data-[focus]:text-[HighlightText]",
                  // Disabled
                  "data-[disabled]:opacity-50",
                )}
              >
                <span className={clsx(sharedClasses, "col-start-2 flex items-center gap-x-2")}>
                  <Avatar className="h-4 w-4" src={person.image} />
                  <span className="font-medium">{person.name}</span>
                </span>
              </div>
            )}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  )
}

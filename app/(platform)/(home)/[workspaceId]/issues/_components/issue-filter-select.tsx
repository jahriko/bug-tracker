"use client"

import { Select } from "@/components/catalyst/select"
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react"
import { useRouter, useSearchParams } from "next/navigation"

import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid"
import clsx from "clsx"
import { useState } from "react"

const people = [
  { id: 1, name: "Tom Cook" },
  { id: 2, name: "Wade Cooper" },
  { id: 3, name: "Tanya Fox" },
  { id: 4, name: "Arlene Mccoy" },
  { id: 5, name: "Devon Webb" },
]
function IssueFilterSelect() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const filter = searchParams.get("filter") ?? "all"
  const status = searchParams.get("status") ?? "all"
  const priority = searchParams.get("priority") ?? "all"

  const handleParamChange = (paramName: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value === "all") {
      params.delete(paramName)
    } else {
      params.set(paramName, value)
    }
    params.delete("page")
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex gap-4">
      <Select
        aria-label="Filter issues"
        className="w-48"
        onChange={(e) => {
          handleParamChange("filter", e.target.value)
        }}
        value={filter}
      >
        <option value="all">Issues</option>
        <option value="owned">My issues</option>
      </Select>

      <Select
        aria-label="Filter by status"
        className="w-48"
        onChange={(e) => {
          handleParamChange("status", e.target.value)
        }}
        value={status}
      >
        <option value="all">All Status</option>
        <option value="BACKLOG">Backlog</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
        <option value="CANCELLED">Cancelled</option>
      </Select>

      <Select
        aria-label="Filter by priority"
        className="w-48"
        onChange={(e) => {
          handleParamChange("priority", e.target.value)
        }}
        value={priority}
      >
        <option value="all">All Priority</option>
        <option value="NO_PRIORITY">No priority</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </Select>
    </div>
  )
}

function MultiSelectionFilterOption<T>({ options, label }: { options: T[]; label: string }) {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState(options[1])

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option: T) => {
          return option.name.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <Popover className="relative">
      <PopoverButton className="block text-sm/6 font-semibold text-white/50 focus:outline-none data-[active]:text-white data-[hover]:text-white data-[focus]:outline-1 data-[focus]:outline-white">
        {label}
      </PopoverButton>
      <PopoverPanel
        anchor="bottom"
        className="rounded-xl bg-white/5 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
        transition
      >
        <Combobox
          multiple
          onChange={(value) => {
            setSelected(value)
          }}
          onClose={() => {
            setQuery("")
          }}
          value={selected}
        >
          <div className="relative">
            <ComboboxInput
              className={clsx(
                "w-full rounded-lg border-none bg-white/5 py-1.5 pl-3 pr-8 text-sm/6 text-white",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
              )}
              displayValue={(person) => person?.name}
              onChange={(event) => {
                setQuery(event.target.value)
              }}
            />
            <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
              <ChevronDownIcon className="size-4 fill-white/60 group-data-[hover]:fill-white" />
            </ComboboxButton>
          </div>

          <ComboboxOptions
            anchor="bottom"
            className={clsx(
              "w-[var(--input-width)] rounded-xl border border-white/5 bg-white/5 p-1 [--anchor-gap:var(--spacing-1)] empty:invisible",
              "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0",
            )}
            transition
          >
            {filteredOptions.map((person) => (
              <ComboboxOption
                className="group flex cursor-default select-none items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-white/10"
                key={person.id}
                value={person}
              >
                <CheckIcon className="invisible size-4 fill-white group-data-[selected]:visible" />
                <div className="text-sm/6 text-white">{person.name}</div>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      </PopoverPanel>
    </Popover>
  )
}

export default IssueFilterSelect

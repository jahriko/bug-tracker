import * as Headless from "@headlessui/react"
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react"
import { MagnifyingGlassIcon, PlusIcon, TagIcon } from "@heroicons/react/16/solid"
import clsx from "clsx"
import React, { Fragment, forwardRef } from "react"
import { InputGroup } from "../../../../../components/catalyst/input"

import { Badge } from "@/components/catalyst/badge"

const DefaultIssueLabelButton = forwardRef(function (props, ref) {
  return (
    <button
      className={clsx([
        // Basic layout
        "group relative block w-full",
        // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
        "before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.lg)-1px)] before:bg-white before:shadow",
        // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
        "dark:before:hidden",
        // Hide default focus styles
        "focus:outline-none",
        // Focus ring
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-inset after:ring-transparent after:data-[focus]:ring-2 after:data-[focus]:ring-blue-500",
        // Disabled state
        "data-[disabled]:opacity-50 before:data-[disabled]:bg-zinc-950/5 before:data-[disabled]:shadow-none",
      ])}
      data-slot="control"
      ref={ref}
      {...props}
    />
  )
})

DefaultIssueLabelButton.displayName = "DefaultIssueLabelButton"

const IssueLabelButtonIcon = forwardRef(function (props, ref) {
  return (
    <button
      ref={ref}
      {...props}
      className="rounded-lg p-1.5 text-zinc-700 after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-inset after:ring-transparent hover:bg-zinc-200 hover:text-zinc-950 after:data-[focus]:ring-2 after:data-[focus]:ring-blue-500"
    />
  )
})

IssueLabelButtonIcon.displayName = "IssueLabelButtonIcon"

export interface MultiSelectComboBoxProps<T, V extends boolean | undefined> extends Headless.ComboboxProps<T, V> {
  className?: string
  placeholder?: React.ReactNode
  autoFocus?: boolean
  filteredOptions?: T[]
  query?: string
  "aria-label"?: string
  onQueryChange: (query: string) => void
  children?: React.ReactNode
  renderButtonAsIcon?: boolean
}

export const MultiSelectComboboxOptions = ComboboxOptions

export default function MultiSelectComboBox<T, V extends boolean | undefined>({
  className,
  placeholder,
  autoFocus,
  filteredOptions,
  renderButtonAsIcon,
  query,
  "aria-label": ariaLabel,
  children: options,
  onQueryChange,
  ...props
}: MultiSelectComboBoxProps<T, V>) {
  return (
    <Popover className="relative">
      <PopoverButton
        aria-label={ariaLabel}
        as={renderButtonAsIcon ? IssueLabelButtonIcon : DefaultIssueLabelButton}
        autoFocus={autoFocus}
      >
        {renderButtonAsIcon ? (
          <PlusIcon aria-hidden="true" className="size-4" />
        ) : (
          <span
            className={clsx([
              // Basic layout
              "relative block w-full appearance-none rounded-lg py-[calc(theme(spacing[1.5])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]",
              // Set minimum height for when no value is selected
              "min-h-9",
              // Horizontal padding
              "pl-[calc(theme(spacing[3.5])-1px)] pr-[calc(theme(spacing.4)-1px)] sm:pl-[calc(theme(spacing.3)-1px)]",
              // Typography
              "text-left text-xs/6 text-zinc-950 placeholder:text-zinc-500 dark:text-white forced-colors:text-[CanvasText]",
              // Border
              "border border-zinc-950/10 group-data-[active]:border-zinc-950/20 group-data-[hover]:border-zinc-950/20 dark:border-white/10 dark:group-data-[active]:border-white/20 dark:group-data-[hover]:border-white/20",
              // Background color
              "bg-transparent dark:bg-white/5",
              // Invalid state
              "group-data-[invalid]:border-red-500 group-data-[invalid]:group-data-[hover]:border-red-500 group-data-[invalid]:dark:border-red-600 group-data-[invalid]:data-[hover]:dark:border-red-600",
              // Disabled state
              "group-data-[disabled]:border-zinc-950/20 group-data-[disabled]:opacity-100 group-data-[disabled]:dark:border-white/15 group-data-[disabled]:dark:bg-white/[2.5%] dark:data-[hover]:group-data-[disabled]:border-white/15",
            ])}
          >
            {Array.isArray(props.value) && props.value.length > 0 ? (
              <div className="flex items-center gap-x-2">
                <TagIcon className="flex size-4 items-center" />
                <ul>
                  {props.value.length > 1 ? (
                    <li>
                      <Badge>{props.value.length} labels </Badge>
                    </li>
                  ) : (
                    <>
                      {props.value.map((option) => (
                        <li key={option.id}>
                          <Badge color={option.color}>{option.name}</Badge>
                        </li>
                      ))}
                    </>
                  )}
                </ul>
              </div>
            ) : (
              <span className="block truncate text-zinc-500">{placeholder}</span>
            )}
          </span>
        )}
      </PopoverButton>
      <PopoverPanel
        anchor="bottom start"
        className={clsx(
          // Anchor positioning
          // "[--anchor-offset:-1.625rem] [--anchor-padding:theme(spacing.4)] sm:[--anchor-offset:0rem]",
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
        focus
      >
        <Combobox {...props} as="div">
          <InputGroup>
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
            />
            <ComboboxInput
              as={CustomMultiSelectInput}
              // onBlur={() => {
              //   onQueryChange("")
              // }}
              onChange={(event) => {
                onQueryChange(event.target.value)
              }}
            />
          </InputGroup>
          {options}
        </Combobox>
      </PopoverPanel>
    </Popover>
  )
}

export function MultiSelectComboBoxOption<T>({
  children,
  className,
  ...props
}: { className?: string; children?: React.ReactNode } & Omit<Headless.ComboboxOptionProps<"div", T>, "className">) {
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
    <ComboboxOption as={Fragment} {...props}>
      {({ selected }) => (
        <div
          className={clsx(
            // Basic layout
            "group/option grid cursor-default grid-cols-[theme(spacing.5),1fr] items-baseline gap-x-2 rounded-lg py-2.5 pl-2 pr-3.5 sm:grid-cols-[theme(spacing.4),1fr] sm:py-1.5 sm:pl-1.5 sm:pr-3",
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
          <svg
            aria-hidden="true"
            className={clsx(
              "relative col-start-1 size-5 self-center stroke-current sm:size-4",
              selected ? "inline" : "hidden group-data-[selected]/option:inline",
            )}
            fill="none"
            viewBox="0 0 16 16"
          >
            <path d="M4 8.5l3 3L12 4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
          </svg>
          <span className={clsx(className, sharedClasses, "col-start-2")}>{children}</span>
        </div>
      )}
    </ComboboxOption>
  )
}

const dateTypes = ["date", "datetime-local", "month", "time", "week"]
type DateType = (typeof dateTypes)[number]

const CustomMultiSelectInput = forwardRef(function Input(
  {
    className,
    ...props
  }: {
    className?: string
    type?: "email" | "number" | "password" | "search" | "tel" | "text" | "url" | DateType
  } & Omit<Headless.InputProps, "className">,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  return (
    <span
      className={clsx([
        className,
        // Basic layout
        "relative block w-full border-b",
        // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
        // "before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.lg)-1px)] before:bg-white before:shadow",
        // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
        "dark:before:hidden",
        // Focus ring
        // "after:pointer-events-none after:absolute after:inset-0 after:rounded-none after:ring-inset after:ring-transparent sm:after:focus-within:ring-2 sm:after:focus-within:ring-blue-500",
        // Disabled state
        "has-[[data-disabled]]:opacity-50 before:has-[[data-disabled]]:bg-zinc-950/5 before:has-[[data-disabled]]:shadow-none",
        // Invalid state
        "before:has-[[data-invalid]]:shadow-red-500/10",
      ])}
      data-slot="control"
    >
      <Headless.Input
        ref={ref}
        {...props}
        className={clsx([
          // Date classes
          props.type &&
            dateTypes.includes(props.type) && [
              "[&::-webkit-datetime-edit-fields-wrapper]:p-0",
              "[&::-webkit-date-and-time-value]:min-h-[1.5em]",
              "[&::-webkit-datetime-edit]:inline-flex",
              "[&::-webkit-datetime-edit]:p-0",
              "[&::-webkit-datetime-edit-year-field]:p-0",
              "[&::-webkit-datetime-edit-month-field]:p-0",
              "[&::-webkit-datetime-edit-day-field]:p-0",
              "[&::-webkit-datetime-edit-hour-field]:p-0",
              "[&::-webkit-datetime-edit-minute-field]:p-0",
              "[&::-webkit-datetime-edit-second-field]:p-0",
              "[&::-webkit-datetime-edit-millisecond-field]:p-0",
              "[&::-webkit-datetime-edit-meridiem-field]:p-0",
            ],
          // Basic layout
          "relative block w-full appearance-none rounded-none px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] sm:px-[calc(theme(spacing[3])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]",
          // Typography
          "text-base/6 text-zinc-950 placeholder:text-zinc-500 dark:text-white sm:text-sm/6",
          // Border
          "border-none",
          // "border border-zinc-950/10 data-[hover]:border-zinc-950/20 dark:border-white/10 dark:data-[hover]:border-white/20",
          // Background color
          "bg-transparent dark:bg-white/5",
          // Hide default focus styles
          "focus:outline-none focus:ring-0",
          // Invalid state
          "data-[invalid]:border-red-500 data-[invalid]:data-[hover]:border-red-500 data-[invalid]:dark:border-red-500 data-[invalid]:data-[hover]:dark:border-red-500",
          // Disabled state
          "data-[disabled]:border-zinc-950/20 dark:data-[hover]:data-[disabled]:border-white/15 data-[disabled]:dark:border-white/15 data-[disabled]:dark:bg-white/[2.5%]",
        ])}
      />
    </span>
  )
})

export function MultiSelectComboBoxLabel({ className, ...props }: React.ComponentPropsWithoutRef<"span">) {
  return <span {...props} className={clsx(className, "ml-2.5 truncate first:ml-0 sm:ml-2 sm:first:ml-0")} />
}

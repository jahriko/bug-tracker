"use client"

import * as Headless from "@headlessui/react"
import clsx from "clsx"
import { Fragment } from "react"

export function CustomListbox<T>({
  className,
  placeholder,
  autoFocus = false,
  "aria-label": ariaLabel,
  children: options,
  ...props
}: {
  className?: string
  placeholder?: React.ReactNode
  autoFocus?: boolean
  "aria-label"?: string
  children?: React.ReactNode
} & Omit<Headless.ListboxProps<typeof Fragment, T>, "multiple">) {
  return (
    <Headless.Listbox as="div" {...props} multiple={false}>
      <Headless.ListboxButton
        aria-label={ariaLabel}
        autoFocus={autoFocus}
        className={clsx([
          className,
          // Basic layout
          "group relative block w-full rounded-lg",
          // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
          // "before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.lg)-1px)] before:bg-white before:shadow",
          // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
          // "dark:before:hidden",
          // Hide default focus styles
          "focus:outline-none",
          // Focus ring
          // "focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500",
          // Disabled state
          "data-[disabled]:opacity-50 before:data-[disabled]:bg-zinc-950/5 before:data-[disabled]:shadow-none",
        ])}
        data-slot="control"
      >
        <Headless.ListboxSelectedOption
          as="span"
          className={clsx([
            // Basic layout
            "relative block w-full min-w-40 appearance-none rounded-lg py-[calc(theme(spacing[2.5])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]",
            // Set minimum height for when no value is selected
            "min-h-11 sm:min-h-9",
            // Horizontal padding
            "pl-[calc(theme(spacing[3.5])-1px)] pr-[calc(theme(spacing.7)-1px)] sm:pl-[calc(theme(spacing.1)-1px)]",
            // Typography
            "text-left text-base/6 text-zinc-950 placeholder:text-zinc-500 dark:text-white sm:text-sm/6 forced-colors:text-[CanvasText]",
            // Borderless
            "border-transparent text-zinc-950 group-data-[active]:text-blue-800 group-data-[hover]:text-blue-700 dark:text-white dark:group-data-[hover]:bg-white/10 dark:group-data-[active]:text-blue-800",
            // Background color
            "bg-transparent dark:bg-white/5",
            // Invalid state
            // "group-data-[invalid]:border-red-500 group-data-[invalid]:group-data-[hover]:border-red-500 group-data-[invalid]:dark:border-red-600 group-data-[invalid]:data-[hover]:dark:border-red-600",
            // Disabled state
            "group-data-[disabled]:opacity-50",
          ])}
          options={options}
          placeholder={placeholder ? <span className="block truncate text-zinc-500">{placeholder}</span> : null}
        />
      </Headless.ListboxButton>
      <Headless.ListboxOptions
        anchor="bottom start"
        className={clsx(
          // Anchor positioning
          // "[--anchor-offset:-1.625rem] [--anchor-padding:theme(spacing.4)] sm:[--anchor-offset:-1.375rem]",
          // Base styles
          "isolate mt-1.5 w-max min-w-[calc(var(--button-width)+0.75rem)] select-none scroll-py-1 rounded-xl p-1",
          // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
          "outline outline-1 outline-transparent focus:outline-none",
          // Handle scrolling when menu won't fit in viewport
          "overflow-y-scroll overscroll-contain",
          // Popover background
          "bg-white/75 backdrop-blur-xl dark:bg-zinc-800/75",
          // Shadows
          "shadow-lg ring-1 ring-zinc-950/10 dark:ring-inset dark:ring-white/10",
          // Transitions
          "transition-opacity duration-100 ease-in data-[leave]:pointer-events-none data-[closed]:data-[enter]:opacity-100 data-[closed]:data-[leave]:opacity-0",
        )}
        transition
      >
        {options}
      </Headless.ListboxOptions>
    </Headless.Listbox>
  )
}

export function CustomListboxOption<T>({
  children,
  className,
  ...props
}: { className?: string; children?: React.ReactNode } & Omit<Headless.ListboxOptionProps<"div", T>, "className">) {
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
    <Headless.ListboxOption as={Fragment} {...props}>
      {({ selectedOption }) => {
        if (selectedOption) {
          return <div className={clsx(className, sharedClasses)}>{children}</div>
        }

        return (
          <div
            className={clsx(
              // Basic layout
              "group/option cursor-default items-baseline gap-x-2 rounded-lg py-2.5 pl-2 pr-3.5 sm:py-1.5 sm:pl-1.5 sm:pr-3",
              // Typography
              "text-base/6 text-zinc-950 dark:text-white sm:text-sm/6 forced-colors:text-[CanvasText]",
              // Focus
              "outline-none data-[focus]:bg-blue-500 data-[focus]:text-white",
              // Forced colors mode
              "forced-color-adjust-none forced-colors:data-[focus]:bg-[Highlight] forced-colors:data-[focus]:text-[HighlightText]",
              // Disabled
              "data-[disabled]:opacity-50",
            )}
          >
            <span className={clsx(className, sharedClasses, "col-start-2")}>{children}</span>
          </div>
        )
      }}
    </Headless.ListboxOption>
  )
}

export function CustomListboxLabel({ className, ...props }: React.ComponentPropsWithoutRef<"span">) {
  return <span {...props} className={clsx(className, "ml-2.5 truncate first:ml-0 sm:ml-2 sm:first:ml-0")} />
}

export function ListboxDescription({ className, children, ...props }: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      {...props}
      className={clsx(
        className,
        "flex flex-1 overflow-hidden text-zinc-500 before:w-2 before:min-w-0 before:shrink group-data-[focus]/option:text-white dark:text-zinc-400",
      )}
    >
      <span className="flex-1 truncate">{children}</span>
    </span>
  )
}

"use client"

/* eslint-disable @next/next/no-img-element */
import { Bars3Icon } from "@heroicons/react/24/outline"
import { useSidebar } from "./Sidebar"

export default function MobileHeader() {
  const { setSidebarOpen } = useSidebar()
  return (
    <div className="sticky top-0 z-40 flex items-center gap-x-6 border-b border-gray-200 bg-white p-4">
      <button
        className="-m-2.5 p-2.5 text-gray-700 "
        onClick={() => {
          setSidebarOpen(true)
        }}
        type="button"
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon aria-hidden="true" className="h-6 w-6" />
      </button>
      <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
        Dashboard
      </div>

      <a href="/">
        <span className="sr-only">Your profile</span>
        <img
          alt=""
          className="h-8 w-8 rounded-full bg-gray-50"
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        />
      </a>
    </div>
  )
}
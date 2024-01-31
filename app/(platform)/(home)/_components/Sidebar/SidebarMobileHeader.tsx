"use client"

/* eslint-disable @next/next/no-img-element */
import { Bars3Icon } from "@heroicons/react/24/outline"
import { useSidebar } from "./Sidebar"
import ProfileDropdown from "@/app/(platform)/(home)/_components/Sidebar/SidebarProfileDropdown";

export default function MobileHeader({
  profile,
}: {
  profile: {
    name: string | undefined
    email: string | undefined
    image: string | undefined
  }}) {
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

      <ProfileDropdown profile={profile} />
    </div>
  )
}
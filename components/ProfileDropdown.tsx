/* eslint-disable @next/next/no-img-element */
import { CaretSortIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { auth } from "@/auth"

export default async function ProfileDropdown() {
  const session = await auth()

  if (!session) {
    return (
      <Button asChild variant="default">
        <Link href="/api/auth/signin">Sign in</Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="-mx-2 justify-between px-2 py-6"
          role="combobox"
          variant="ghost"
        >
          <img
            alt=""
            className="mr-2 size-6 rounded-sm"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          />
          <div className="text-left">
            <p className="text-sm font-medium">{session.user.name}</p>
            <p className="text-xs text-gray-400">{session.user.email}</p>
          </div>
          <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/api/auth/signout">Sign out</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

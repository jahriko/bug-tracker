"use client"

import { signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfileDropdown({
  profile,
}: {
  profile: {
    name: string | undefined
    email: string | undefined
    image: string | undefined
  }
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer hover:ring-2 hover:ring-offset-1">
          <AvatarImage src={profile.image ?? undefined} />
          <AvatarFallback>
            {profile.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" forceMount>
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem   >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
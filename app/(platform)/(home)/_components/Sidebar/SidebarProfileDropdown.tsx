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
        <div className="mt-4 flex shrink-0 cursor-pointer items-center">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={profile.image ?? undefined} />
              <AvatarFallback>
                {profile.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{profile.name}</p>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" forceMount>
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

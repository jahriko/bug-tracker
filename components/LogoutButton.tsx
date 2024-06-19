"use client"
import { signOut } from "@/auth"
import { DropdownItem, DropdownLabel } from "./catalyst/dropdown"
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/16/solid"
import { logout } from "@/server/actions/logout"

export default function LogoutButton() {
  return (
    <DropdownItem onClick={() => logout()}>
      <ArrowRightStartOnRectangleIcon />
      <DropdownLabel>Sign out</DropdownLabel>
    </DropdownItem>
  )
}

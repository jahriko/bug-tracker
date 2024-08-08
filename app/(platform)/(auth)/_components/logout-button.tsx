"use client"
import { logout } from "@/app/(platform)/(auth)/_actions/logout"
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/16/solid"
import { DropdownItem, DropdownLabel } from "../../../../components/catalyst/dropdown"

export default function LogoutButton() {
  return (
    <DropdownItem
      onClick={async () => {
        await logout()
      }}
    >
      <ArrowRightStartOnRectangleIcon />
      <DropdownLabel>Sign out</DropdownLabel>
    </DropdownItem>
  )
}

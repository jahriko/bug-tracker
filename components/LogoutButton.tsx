"use client"
import { signOut } from "@/auth"

export default function LogoutButton() {
  return (
    <button className="text-red-500" onClick={() => signOut()}>
      Logout
    </button>
  )
}

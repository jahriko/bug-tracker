import { auth } from "@/auth"
import { Toaster } from "@/components/ui/sonner"
import { SessionProvider } from "next-auth/react"
import React from "react"

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  return (
    <SessionProvider session={session}>
      {children}
      <Toaster />
    </SessionProvider>
  )
}

import React from "react"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/ui/sonner"
import { auth } from "@/auth"

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
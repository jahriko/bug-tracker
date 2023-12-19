import { Toaster } from "@/components/ui/toaster"
import NextAuthSessionProvider from "@/lib/nextauth-provider"
import TanstackProvider from "@/lib/tanstack-provider"

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TanstackProvider>
      <NextAuthSessionProvider>
        {children}
        <Toaster />
      </NextAuthSessionProvider>
    </TanstackProvider>
  )
}

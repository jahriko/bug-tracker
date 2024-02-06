import { Toaster } from "@/components/ui/sonner"
import NextAuthSessionProvider from "@/lib/nextauth-provider"

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <NextAuthSessionProvider>
        {children}
        <Toaster />
      </NextAuthSessionProvider>
  )
}

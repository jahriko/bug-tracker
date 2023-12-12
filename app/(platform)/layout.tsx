import TanstackProvider from "@/lib/tanstack-provider"
import { ClerkProvider } from "@clerk/nextjs"

export default function PlatformLayout({
	children
}: { children: React.ReactNode }) {
	return (
		<ClerkProvider>
			<TanstackProvider>{children}</TanstackProvider>
		</ClerkProvider>
	)
}

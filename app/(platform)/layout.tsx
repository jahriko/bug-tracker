import { ClerkProvider } from "@clerk/nextjs";
import TanstackProvider from "@/lib/tanstack-provider";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
	return (
		<ClerkProvider>
			<TanstackProvider>
				{children}
			</TanstackProvider>
		</ClerkProvider>
	)
}
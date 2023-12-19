import { db } from "@/lib/prisma"
import Sidebar from "./_components/sidebar"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

async function getProjects() {
	return db.project.findMany()
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session || !session.user?.email) {
    redirect("/login")
  }

  const profile = session?.user

			<main className="py-10 lg:pl-64 bg-white">
				<div className="px-4 sm:px-6 lg:px-8">{children}</div>
			</main>
		</>
	)
}

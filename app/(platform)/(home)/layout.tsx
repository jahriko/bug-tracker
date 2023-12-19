import prisma from "@/lib/prisma"
import Sidebar from "./_components/sidebar"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

async function getProjects() {
  return prisma?.project.findMany()
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

  return (
    <>
      <Sidebar projects={await getProjects()} profile={profile} />

      <main className="bg-white py-10 lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </>
  )
}

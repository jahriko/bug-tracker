import { auth } from "@/auth"
import { Prisma } from "@prisma/client"
import { redirect } from "next/navigation"

export async function getSession() {
  try {
    const session = await auth()

    if (!session) {
      console.error("No session found. Redirecting to login.")
      return redirect("/login")
    }

    return session.user
  } catch (error) {
    throw new Error("Error getting current user")
  }
}

export type User = Prisma.PromiseReturnType<typeof getSession>

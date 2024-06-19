import { auth } from "@/auth"
import { Prisma } from "@prisma/client"
import { redirect } from "next/navigation"

export async function getSession() {
  try {
    const session = await auth()

    if (!session) {
      throw new Error("No session found")
      return redirect("/login")
    }

    return session.user

  } catch (error) {
    throw new Error("Error getting current user")
  }
}

export type User = Prisma.PromiseReturnType<typeof getSession>

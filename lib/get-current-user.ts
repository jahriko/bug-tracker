import { auth } from "@/auth"
import { Prisma } from "@prisma/client"

export async function getCurrentUser() {
  try {
    const session = await auth()

    if (!session) {
      throw new Error("No session found")
    }

    return session.user

  } catch (error) {
    throw new Error("Error getting current user")
  }
}

export type User = Prisma.PromiseReturnType<typeof getCurrentUser>

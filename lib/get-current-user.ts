import { auth } from "@/lib/auth"
import { PromiseReturnType } from "@prisma/client"

export async function getCurrentUser() {
  const session = await auth()

  return session?.user
}

export type User = PromiseReturnType<typeof getCurrentUser>
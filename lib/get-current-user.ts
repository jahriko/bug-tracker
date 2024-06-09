import { PromiseReturnType } from "@prisma/client"
import { auth } from "@/auth"

export async function getCurrentUser() {
  const session = await auth()

  return session?.user
}

export type User = PromiseReturnType<typeof getCurrentUser>

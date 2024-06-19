import { auth } from "@/auth"
import { createSafeActionClient } from "next-safe-action"

export const actionClient = createSafeActionClient()

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await auth()

  if (!session?.user.userId) {
    throw new Error("User not found")
  }

  return next({
    ctx: {
      userId: session.user.userId,
    },
  })
})

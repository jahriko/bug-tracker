"use server"
import { signIn } from "@/auth"
import { actionClient } from "@/lib/safe-action"
import { getUserByEmail } from "@/lib/user"
import { AuthError } from "next-auth"
import { z } from "zod"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(50),
})

export const login = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { email, password } }) => {
    try {
      const getUser = await getUserByEmail(email)
      const lastWorkspaceUsed = getUser?.lastWorkspace ?? "create-workspace" 
      // console.log("Last workspace used: ", lastWorkspaceUsed)

      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
      })

      return { success: true }
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Invalid credentials!" }
          default:
            return { error: "Something went wrong." }
        }
      }
      throw error
    }
  })

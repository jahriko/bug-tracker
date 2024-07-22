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
    const getUser = await getUserByEmail(email)

    const lastWorkspaceUsed = getUser?.lastWorkspaceUrl ?? "create-workspace"

    await signIn("credentials", {
      email,
      password,
      redirectTo: `/${lastWorkspaceUsed}/issues`,
    })

    return { success: true }
  }, {
    onError: ({error}) => {
      // if (error instanceof AuthError) {
      //   switch (error.type) {
      //     case "CredentialsSignin":
      //       return "Invalid credentials!"
      //     default:
      //       return error.message
      //   }
      // }
      console.log("serverError:", error.serverError)
      // console.dir(error, {depth: null})
      // return "Something went wrong. Please try again later."
    }
  })

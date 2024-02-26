"use server"
import { z } from "zod"
import { AuthError } from "next-auth"
import { LoginSchema } from "@/types"
import { getUserByEmail } from "@/lib/user"
import { signIn } from "@/auth"

export async function login(
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null,
) {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { email, password } = validatedFields.data

  const existingUser = await getUserByEmail(email)

  if (!existingUser || !existingUser.email || !existingUser.hashedPassword) {
    return { error: "Email does not exist!" }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl ?? "/inbox",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" }
        default:
          return { error: "Something went wrong!" }
      }
    }
    throw error
  }

  return { success: "Login Successful" }
}
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { type AuthConfig } from "@auth/core"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import bcryptjs from "bcryptjs"
import { getUserByEmail } from "@/lib/user"

export const authConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        // Validate the credentials
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (!parsedCredentials.success) {
          console.log("Invalid credentials")
          return null
        }
        const { email, password } = parsedCredentials.data

        // Check if the user exists
        const user = await getUserByEmail(email)

        if (!user) {
          throw new Error("No user found")
        }

        const passwordsMatch = await bcryptjs.compare(
          password,
          user.hashedPassword,
        )

        if (!passwordsMatch) {
          throw new Error("Invalid password")
        }

        return user
      },
    }),
  ],
  secret: process.env.AUTH_SECRET ?? "this is a secret",
} satisfies AuthConfig

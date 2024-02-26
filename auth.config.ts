import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import bcryptjs from "bcryptjs"
import { getUserByEmail } from "@/lib/user"

export const authConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          const user = await getUserByEmail(email)
          if (!user || !user.hashedPassword) return null
          const valid = await bcryptjs.compare(password, user.hashedPassword)

          if (valid) return user
        }

        console.log("Invalid credentials")
        return null
      },
    }),
  ],
} satisfies NextAuthConfig
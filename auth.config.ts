import { getUserByEmail } from "@/lib/user"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcryptjs from "bcryptjs"
import type { DefaultSession, NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import prisma from "./lib/prisma"

declare module "next-auth" {
  interface Session {
    user: {
      userId: string
      lastWorkspace: string
    } & DefaultSession["user"]
  }

  interface User {
    lastWorkspace: string | null
  }
}

// The `JWT` interface can be found in the `next-auth/jwt` submodule
import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    lastWorkspace: string | null
  }
}

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  debug: process.env.NODE_ENV === "development",
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session({ session, token }) {
      if (token.sub && session.user) {
        session.user.userId = token.sub
      }

      if (session.user) {
        session.user.name = token.name ?? null
        session.user.email = token.email ?? ""
        session.user.lastWorkspace = token.lastWorkspace as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name ?? ""
        token.email = user.email ?? ""
        token.lastWorkspace = user.lastWorkspace
      }
      return token
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (!parsedCredentials.success) {
          return null
        }
        const { email, password } = parsedCredentials.data

        const user = await getUserByEmail(email)

        if (!user || !user.hashedPassword) {
          return null
        }

        const passwordsMatch = await bcryptjs.compare(password, user.hashedPassword)

        if (!passwordsMatch) {
          throw new Error("Invalid password")
        }

        return user
      },
    }),
  ],
  secret: process.env.AUTH_SECRET ?? "this is a secret",
} satisfies NextAuthConfig

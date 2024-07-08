import { getUserByEmail } from "@/lib/user"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcryptjs from "bcryptjs"
import type { DefaultSession, NextAuthConfig } from "next-auth"
import type { Adapter } from "next-auth/adapters"
import "next-auth/jwt"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import { ErrorCode } from "./lib/ErrorCode"
import prisma from "./lib/prisma"

declare module "next-auth" {
  interface Session {
    user: {
      userId: string
      lastWorkspaceUrl: string
    } & DefaultSession["user"]
  }

  interface User {
    lastWorkspaceUrl: string | null
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    lastWorkspaceUrl: string | null
  }
}

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
  adapter: PrismaAdapter(prisma) as Adapter,
  callbacks: {
    session({ session, token }) {
      if (token.sub && session.user) {
        session.user.userId = token.sub
      }

      if (session.user) {
        session.user.name = token.name ?? null
        session.user.email = token.email ?? ""
        session.user.lastWorkspaceUrl = token.lastWorkspaceUrl!
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name ?? ""
        token.email = user.email ?? ""
        token.lastWorkspaceUrl = user.lastWorkspaceUrl
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

        if (parsedCredentials.error) {
          console.error(`For some reason credentials are missing.`)
          throw new Error(ErrorCode.InternalServerError)
        }
        const { email, password } = parsedCredentials.data

        const user = await getUserByEmail(email)

        if (!user.hashedPassword) {
          console.error("User not found.")
          throw new Error(ErrorCode.UserNotFound)
        }

        const passwordsMatch = await bcryptjs.compare(password, user.hashedPassword)

        if (!passwordsMatch) {
          throw new Error(ErrorCode.IncorrectPassword)
        }

        return user
      },
    }),
  ],
  secret: process.env.AUTH_SECRET ?? "this is a secret",
} satisfies NextAuthConfig

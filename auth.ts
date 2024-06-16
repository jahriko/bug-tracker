/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
import { PrismaAdapter } from "@auth/prisma-adapter"
import type { DefaultSession } from "next-auth"
import NextAuth from "next-auth"
import { type AuthConfig } from "@auth/core"
import { authConfig } from "@/auth.config"
import prisma from "./lib/prisma"

declare module "next-auth" {
  interface Session {
    user: {
      userId: string | null | undefined
      name: string | null | undefined
      email: string
      lastWorkspace: string
    } & DefaultSession["user"]
  }
}

const getUserById = async (id: string) => {
  try {
    return await prisma.user.findUnique({ where: { id } })
  } catch {
    return null
  }
}

export const config = {
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
        session.user.name = token.name
        session.user.email = token.email
        session.user.lastWorkspace = token.lastWorkspace
      }

      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token

      token.lastWorkspace = existingUser.lastWorkspace
      token.name = existingUser.name
      token.email = existingUser.email

      return token
    },
  },
  ...authConfig,
} satisfies AuthConfig

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config)

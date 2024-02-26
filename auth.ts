/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
import { PrismaAdapter } from "@auth/prisma-adapter"
import type { NextAuthConfig } from "next-auth"
import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"
import prisma from "./lib/prisma"

const getUserById = async (id: string) => {
  try {
    return await prisma.user.findUnique({ where: { id } })
  } catch {
    return null
  }
}

export const config = {
  ...authConfig,
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
    // This is the culprit why the user can't navigate to other pages and stuck in inbox page
    // Lmao this is why you should read the documentation and not rely on tutorials you dumb ass
    // This part of code assumes that /inbox is the only main entry point of the app.
    // Probably be useful in the future.
    // authorized({ auth, request: { nextUrl } }) {
    //   const isLoggedIn = !!auth?.user
    //   const isOnInbox = nextUrl.pathname.startsWith("/inbox")
    //   if (isOnInbox) {
    //     if (isLoggedIn) return true
    //     return false
    //   } else if (isLoggedIn) {
    //     return Response.redirect(new URL("/inbox", nextUrl))
    //   }
    //   return true
    // },
    async jwt({ token }) {
      // if (account) {
      //   token.id = profile?.sub
      // }
      // return token
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token

      token.name = existingUser.name
      token.email = existingUser.email

      return token
    },
    session({ session, token }) {
      if (token.sub && session.user) {
        session.user.userId = token.sub
      }

      if (session.user) {
        session.user.name = token.name
        session.user.email = token.email
      }

      return session
    },
  },
} satisfies NextAuthConfig

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config)
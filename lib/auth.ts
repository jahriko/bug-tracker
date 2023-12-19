import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcrypt"
import { NextAuthOptions } from "next-auth"
import { Adapter } from "next-auth/adapters"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "./prisma"

import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"
import { getServerSession } from "next-auth"

export const authOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "IssueTracker",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "" },
        password: { label: "Password", type: "password", placeholder: "" },
      },
      async authorize(credentials) {
        if (!credentials) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.hashedPassword) {
          throw new Error("Invalid credentials")
        }

        if (
          user &&
          !bcrypt.compareSync(credentials.password, user.hashedPassword)
        ) {
          throw new Error("Invalid credentials")
        }

        return user
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.id = profile?.sub
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.userId = token.sub as string
      }
      return session
    },
  },
} satisfies NextAuthOptions

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions)
}

/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcrypt"
import { NextAuthOptions, getServerSession } from "next-auth"
import { Adapter } from "next-auth/adapters"
import CredentialsProvider from "next-auth/providers/credentials"
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"
import prisma from "./prisma"

export const authOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.NEXTAUTH_SECRET as string,
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

        if (!user?.hashedPassword) {
          console.log("Invalid credentials")
          return null
        }

        const valid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword,
        )

        if (!valid) {
          console.log(`Invalid Credentials`)
          return null
        }

        return user
      },
    }),
  ],
  callbacks: {
    jwt({ token, account, profile }) {
      if (account) {
        token.id = profile?.sub
      }
      return token
    },
    session({ session, token }) {
      if (token.sub) {
        session.user.userId = token.sub
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

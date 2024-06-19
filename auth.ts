/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
import { authConfig } from "@/auth.config"
import NextAuth from "next-auth"

// in the middleware, the session is not extended with custom fields
// https://github.com/nextauthjs/next-auth/issues/9836#issuecomment-1929663381
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig)

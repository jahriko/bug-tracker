import { authConfig } from "@/auth.config"
import { apiAuthPrefix, authRoutes, publicRoutes } from "@/routes"
import NextAuth from "next-auth"

const { auth } = NextAuth(authConfig)

export default auth(async (req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const user = req.auth?.user

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const lastWorkspaceUsed = user?.lastWorkspace
  console.log("lastWorkspaceUsed: ", lastWorkspaceUsed)
  console.log("isLoggedIn: ", isLoggedIn)

  // if (isApiAuthRoute) {
  //   return null
  // }

  // if (isAuthRoute) {
  // if (isLoggedIn) {
  // // return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
  // return Response.redirect(new URL(lastWorkspaceUsed, nextUrl))
  // }
  // return null
  // }

  // if (!isLoggedIn) {
  // return NextResponse.redirect(new URL("/login", nextUrl))
  // return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
  // }

  return null
})

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}

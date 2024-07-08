import { getCurrentUser } from '@/lib/get-current-user';
import { authConfig } from "@/auth.config"
import { apiAuthPrefix, authRoutes, publicRoutes } from "@/routes"
import NextAuth from "next-auth"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const user = req.auth?.user

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const lastWorkspaceUsed = user?.lastWorkspaceUrl

  if (isApiAuthRoute) {
    return
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      // Redirect to create workspace if lastWorkspaceUsed is undefined
      const redirectUrl = !lastWorkspaceUsed
        ? new URL("/create-workspace", nextUrl)
        : new URL(`/${lastWorkspaceUsed}`, nextUrl)

      return Response.redirect(redirectUrl)
    }

    // Allow access to authentication routes for unauthenticated users
    return
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl))
  }

  return
})

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}

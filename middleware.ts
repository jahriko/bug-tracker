import { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/") {
    return Response.redirect(new URL("/inbox", req.url))
  }
}

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}

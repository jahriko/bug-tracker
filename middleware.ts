import { authMiddleware } from "@clerk/nextjs";
import { NextRequest } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({});

export function middleware(req: NextRequest) {
	if (req.nextUrl.pathname === "/") {
		return Response.redirect(new URL("/inbox", req.url));
	}
}

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

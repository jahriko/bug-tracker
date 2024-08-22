import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import { apiAuthPrefix, authRoutes, publicRoutes } from '@/routes';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = Boolean(req.auth);
  const user = req.auth?.user;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const lastWorkspaceUsed = user?.lastWorkspaceUrl;

  // Check if the current path is a workspace root
  const isWorkspaceRoot = /^\/[^\/]+$/.test(nextUrl.pathname);

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      // Redirect to create workspace if lastWorkspaceUsed is undefined
      const redirectUrl = !lastWorkspaceUsed
        ? new URL('/create-workspace', nextUrl)
        : new URL(`/${lastWorkspaceUsed}`, nextUrl);

      return Response.redirect(redirectUrl);
    }

    // Allow access to authentication routes for unauthenticated users
    return;
  }

  if (!isLoggedIn && isPublicRoute) {
    return Response.redirect(new URL('/login', nextUrl));
  }

  // Redirect logged-in users to their last workspace
  if (isLoggedIn && nextUrl.pathname === '/') {
    if (lastWorkspaceUsed) {
      return Response.redirect(new URL(`/${lastWorkspaceUsed}`, nextUrl));
    }
    return Response.redirect(new URL('/create-workspace', nextUrl));
  }

  // Handle workspace root redirect
  if (
    isLoggedIn &&
    isWorkspaceRoot &&
    nextUrl.pathname !== '/create-workspace'
  ) {
    // Check if the current path is the lastWorkspaceUsed
    if (lastWorkspaceUsed && nextUrl.pathname === `/${lastWorkspaceUsed}`) {
      const issuesUrl = new URL(`${nextUrl.pathname}/issues`, nextUrl);
      // Preserve all search params
      issuesUrl.search = nextUrl.search;
      return Response.redirect(issuesUrl);
    }
    // If it's not the lastWorkspaceUsed, don't redirect
    return;
  }

  // If we're on a workspace page (including issues), allow access
  if (isLoggedIn && /^\/[^\/]+\/.*$/.test(nextUrl.pathname)) {
  }
});

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};

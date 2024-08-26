import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateSession } from './lib/supabase/middleware';

export async function middleware(req: NextRequest) {
  // Handle session updates
  const response = await updateSession(req);
  if (response) return response;

  // Initialize variables and Supabase client
  const { nextUrl } = req;
  const res = NextResponse.next();
  const supabase = createClient();

  // Get user data and check login status
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Error handling for user retrieval
  if (error) {
    console.error('Error getting user:', error);
    return res;
  }

  const isLoggedIn = Boolean(user);
  const lastWorkspaceUsed = user?.user_metadata.lastWorkspaceUrl;

  // Allow direct access to workspace pages
  // if (/^\/[^/]+\/.*$/.test(nextUrl.pathname)) return res;

  // Allow direct access to workspace pages and login page
  if (/^\/[^/]+\/.*$/.test(nextUrl.pathname) || nextUrl.pathname === '/login')
    return res;

  // Redirect unauthenticated users to login page
  if (!isLoggedIn) {
    const loginUrl = new URL('/login', nextUrl.origin);
    loginUrl.searchParams.set('redirectTo', nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect workspace root to issues page
  if (/^\/[^/]+$/.test(nextUrl.pathname)) {
    const issuesUrl = new URL(`${nextUrl.pathname}/issues`, nextUrl.origin);
    // Preserve all search params
    issuesUrl.search = nextUrl.search;
    return NextResponse.redirect(issuesUrl);
  }

  // Handle logged-in user redirects
  if (isLoggedIn) {
    // Redirect to last used workspace if available
    if (lastWorkspaceUsed) {
      return NextResponse.redirect(
        new URL(`/${lastWorkspaceUsed}`, nextUrl.origin),
      );
    }

    // Fetch user's workspaces and redirect accordingly
    const { data: workspaces, error: workspacesError } = await supabase
      .from('workspaces')
      .select('url')
      .eq('user_id', user.id)
      .limit(1);

    if (workspacesError) {
      console.error('Error fetching workspaces:', workspacesError);
      return res;
    }

    let redirectUrl;
    if (workspaces && workspaces.length > 0) {
      redirectUrl = new URL(`/${workspaces[0].url}`, nextUrl.origin);
    } else {
      redirectUrl = new URL('/create-workspace', nextUrl.origin);
    }

    return NextResponse.redirect(redirectUrl);
  }

  // Redirect logged-in users on homepage to their last workspace
  if (nextUrl.pathname === '/') {
    if (lastWorkspaceUsed) {
      return NextResponse.redirect(
        new URL(`/${lastWorkspaceUsed}`, nextUrl.origin),
      );
    }
  }

  return res;
}

// Configure middleware matcher
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};

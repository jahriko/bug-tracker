import { createSafeActionClient } from 'next-safe-action';
import { createClient } from '@/lib/supabase/server';

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class PermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PermissionError';
  }
}

export const actionClient = createSafeActionClient({
  handleReturnedServerError(e) {
    if (e instanceof AuthenticationError) {
      return `Authentication error: ${e.message}`;
    }
    if (e instanceof DatabaseError) {
      return `Database error: ${e.message}`;
    }
    if (e instanceof NotFoundError) {
      return `Not found error: ${e.message}`;
    }
    if (e instanceof PermissionError) {
      return `Permission error: ${e.message}`;
    }

    // eslint-disable-next-line no-console -- Allow console.error for unexpected errors in production
    console.error('Unexpected error:', e);
    return 'An unexpected error occurred';
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    throw new AuthenticationError(
      error?.message ?? 'You need to be authenticated to perform this action.',
    );
  }

  return next({
    ctx: {
      userId: user.id,
    },
  });
});

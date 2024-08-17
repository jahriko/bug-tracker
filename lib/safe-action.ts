import { Prisma } from '@prisma/client';
import { AuthError } from 'next-auth';
import { createSafeActionClient } from 'next-safe-action';
import { getCurrentUser } from './get-current-user';

export const actionClient = createSafeActionClient({
  handleReturnedServerError(e) {
    // https://github.com/nextauthjs/next-auth/issues/11074
    if (e instanceof AuthError) {
      switch (e.cause?.err?.message) {
        case 'incorrect-password':
          return 'Invalid email or password.';
        default:
          return 'Something went wrong. Please try again later.';
      }
    }

    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      switch (e.code) {
        case 'P2025':
          return 'Invalid email or password.';
      }
    }

    console.error(e);

    throw e;
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await getCurrentUser();

  if (!session.name || !session.userId) {
    throw new AuthError('You need to be authenticated to perform this action.');
  }

  return next({
    ctx: {
      userId: session.userId,
    },
  });
});

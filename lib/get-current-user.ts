import { auth } from '@/auth';
import { Prisma } from '@prisma/client';
import { cache } from 'react';

export const getCurrentUser = cache(async () => {
  try {
    const session = await auth();

    return session?.user ?? null;
  } catch (error) {
    throw new Error('Failed to get logged user');
  }
});

export type User = Prisma.PromiseReturnType<typeof getCurrentUser>;

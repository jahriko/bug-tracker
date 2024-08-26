import 'server-only';
import { cache } from 'react';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { AuthenticationError, NotFoundError } from '../safe-action';

export async function getSession() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export const getUserDetails = cache(async () => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return { error: new AuthenticationError(error.message), user: null };
  }

  return { error: null, user: data.user };
});

export async function updateLastWorkspaceUrl(
  userId: string,
  lastWorkspaceUrl: string,
) {
  const supabase = createClient();

  // Update Supabase user metadata
  await supabase.auth.updateUser({
    data: { lastWorkspaceUrl },
  });

  // Update Prisma database
  await prisma.user.update({
    where: { id: userId },
    data: { lastWorkspaceUrl },
  });
}

'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { AuthenticationError, actionClient } from '@/lib/safe-action';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({});

export const loginDemo = actionClient.schema(schema).action(async () => {
  const supabase = createClient();

  const demoUser = await prisma.user.findFirst({
    where: {
      workspaceMembers: {
        some: {
          role: 'ADMIN',
        },
      },
    },
    select: {
      id: true,
      email: true,
      lastWorkspaceUrl: true,
    },
  });

  if (!demoUser) {
    return { success: false, error: 'Demo admin user not found.' };
  }

  const lastWorkspaceUrl = demoUser.lastWorkspaceUrl ?? 'create-workspace';

  const { error } = await supabase.auth.signInWithPassword({
    email: demoUser.email,
    password: '12345678',
  });

  if (error) {
    throw new AuthenticationError(error.message);
  }

  return redirect(`/${lastWorkspaceUrl}/issues`);
});

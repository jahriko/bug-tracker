'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import {
  AuthenticationError,
  NotFoundError,
  actionClient,
} from '@/lib/safe-action';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(50),
});

export const loginAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { email, password } }) => {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new AuthenticationError(error.message);
    }

    const user = data.user;

    // Fetch the user from Prisma to get the lastWorkspaceUrl
    const prismaUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { lastWorkspaceUrl: true },
    });

    if (!prismaUser) {
      throw new NotFoundError('User not found in database');
    }

    const lastWorkspaceUrl = prismaUser.lastWorkspaceUrl ?? 'create-workspace';

    // Update Supabase user metadata
    await supabase.auth.updateUser({
      data: { lastWorkspaceUrl },
    });

    revalidatePath('/', 'layout');

    return redirect(`/${lastWorkspaceUrl}/issues`);
  });
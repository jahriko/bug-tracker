'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { actionClient } from '@/lib/safe-action';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(50),
});

export const registerAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { email, password } }) => {
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/', 'layout');

    return { success: true };
  });

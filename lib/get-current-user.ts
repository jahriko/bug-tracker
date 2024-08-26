import { type Prisma } from '@prisma/client';
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

export const getCurrentUser = cache(async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
});

export type User = Prisma.PromiseReturnType<typeof getCurrentUser>;
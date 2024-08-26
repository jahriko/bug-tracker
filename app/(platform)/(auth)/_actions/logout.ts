'use server';

import { redirect } from 'next/navigation';
import { AuthenticationError } from '@/lib/safe-action';
import { createClient } from '@/lib/supabase/server';

export async function logout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new AuthenticationError(error.message);
  }

  redirect('/login');
}

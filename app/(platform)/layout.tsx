import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { auth } from '@/auth';
import { Toaster } from '@/components/ui/sonner';

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      {children}
      <Toaster />
    </SessionProvider>
  );
}

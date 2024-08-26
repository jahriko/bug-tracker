import { notFound, redirect } from 'next/navigation';
import { getPrisma } from '@/lib/getPrisma';
import { getUserDetails } from '@/lib/supabase/auth';

export default async function WorkspaceHomePage({ params }: { params: { workspaceId: string } }) {
  const { user } = await getUserDetails();
  if (!user) {
    return redirect('/login');
  }

  const prisma = getPrisma(user.id);
  const workspace = await prisma.workspace.findUnique({
    where: { url: params.workspaceId },
  });

  if (!workspace) {
    return notFound();
  }

  return redirect(`/${params.workspaceId}/issues`);
}

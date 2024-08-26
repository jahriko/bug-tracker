import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/get-current-user';
import { getPrisma } from '@/lib/getPrisma';
import { getUserDetails } from '@/lib/supabase/auth';
import CreateProjectForm from './create-project-form';

export default async function CreateProjectPage() {
  const { user } = await getUserDetails();

  if (!user) {
    notFound();
  }
  const workspaces = await getPrisma(user.id).workspace.findMany();

  return <CreateProjectForm workspaces={workspaces} />;
}

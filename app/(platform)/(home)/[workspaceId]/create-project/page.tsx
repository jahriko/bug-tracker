import { getCurrentUser } from '@/lib/get-current-user';
import { getPrisma } from '@/lib/getPrisma';
import { notFound } from 'next/navigation';
import CreateProjectForm from './create-project-form';

export default async function CreateProjectPage() {
  const session = await getCurrentUser();

  if (!session) {
    notFound();
  }

  const workspaces = await getPrisma(session.userId).workspace.findMany();

  return <CreateProjectForm workspaces={workspaces} />;
}

import { getCurrentUser } from '@/lib/get-current-user';
import { getPrisma } from '@/lib/getPrisma';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';
import { NewDiscussionForm } from './_components/new-discussion-form';

export default async function NewDiscussionPage({
  params,
  searchParams,
}: {
  params: { workspaceId: string };
  searchParams: { categoryId?: string };
}) {
  const session = await getCurrentUser();
  if (!session?.userId) {
    throw new Error('User not authenticated');
  }

  const prisma = getPrisma(session.userId);

  if (!searchParams.categoryId) {
    redirect(
      `/${params.workspaceId}/discussions/new-discussion/choose-category`,
    );
  }

  const [projects, category] = await Promise.all([
    prisma.project.findMany({
      where: { workspace: { url: params.workspaceId } },
      select: { id: true, title: true },
    }),
    prisma.discussionCategory.findUnique({
      where: { id: Number(searchParams.categoryId) },
      select: { id: true, name: true, emoji: true },
    }),
  ]);

  if (!category) {
    toast.error('Please select a category before creating a discussion');
    redirect(
      `/${params.workspaceId}/discussions/new-discussion/choose-category`,
    );
  }

  return (
    <main className="flex flex-1 flex-col pb-2 lg:px-2">
      <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-2xl font-bold">New Discussion</h1>
          <NewDiscussionForm
            workspaceUrl={params.workspaceId}
            projects={projects}
            category={category}
          />
        </div>
      </div>
    </main>
  );
}

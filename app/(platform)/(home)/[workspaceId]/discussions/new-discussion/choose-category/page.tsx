import { getCurrentUser } from '@/lib/get-current-user';
import { getPrisma } from '@/lib/getPrisma';
import { CategorySelector } from './choose-category';

export default async function ChooseCategoryPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const session = await getCurrentUser();
  if (!session?.userId) {
    throw new Error('User not authenticated');
  }

  const prisma = getPrisma(session.userId);

  const categories = await prisma.discussionCategory.findMany({
    where: { project: { workspace: { url: params.workspaceId } } },
    select: { id: true, name: true, description: true, emoji: true },
  });

  console.log(categories);

  if (categories.length === 0) {
    throw new Error('No categories found for this workspace');
  }

  return (
    <main className="flex flex-1 flex-col pb-2 lg:px-2">
      <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-2xl font-bold">Choose a category</h1>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            Select a category for your new discussion
          </p>
          <CategorySelector
            categories={categories}
            workspaceId={params.workspaceId}
          />
        </div>
      </div>
    </main>
  );
}

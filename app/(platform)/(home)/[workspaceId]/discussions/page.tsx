import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/16/solid';
import { redirect } from 'next/navigation';

import { DiscussionList } from '@/app/(platform)/(home)/[workspaceId]/discussions/_components/discussion-list';
import CategorySelector from '@/app/(platform)/(home)/[workspaceId]/discussions/new-discussion/_components/select-category';
import { Button } from '@/components/catalyst/button';
import { Input, InputGroup } from '@/components/catalyst/input';
import { getCurrentUser } from '@/lib/get-current-user';

import { TablePagination } from '../issues/_components/TablePagination';
import DiscussionFilter from './_components/discussion-filter';
import SearchInput from './_components/search-input';
import { getCategories, getDiscussions } from './_data/discussions';
import { getPaginationData, parseSearchParams } from './helpers';

export default async function Discussions({
  params,
  searchParams,
}: {
  params: { workspaceId: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const { page, pageSize, category, search } = parseSearchParams(searchParams);

  const { discussions, totalDiscussions } = await getDiscussions(
    user.id,
    params.workspaceId,
    page,
    pageSize,
    category,
    search,
  );
  const categories = await getCategories(user.id, params.workspaceId);

  const createPageUrl = (pageNum: number) => {
    const newSearchParams = new URLSearchParams(
      searchParams as Record<string, string>,
    );
    newSearchParams.set('page', pageNum.toString());
    return `/${params.workspaceId}/discussions?${newSearchParams.toString()}`;
  };

  const paginationData = {
    ...getPaginationData(page, totalDiscussions, pageSize),
    createPageUrl,
  };

  return (
    <main className="flex flex-1 flex-col pb-2 lg:px-2">
      <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
        <div className="lg:mx-auto lg:max-w-6xl">
          <div className="flex flex-col justify-between gap-y-2">
            <div className="flex w-full items-center gap-x-2">
              <div className="flex-grow">
                <SearchInput
                  initialSearch={(searchParams.search as string) || ''}
                  workspaceId={params.workspaceId}
                />
              </div>
              <Button href="discussions/new-discussion/choose-category">
                <PlusIcon />
                New Discussion
              </Button>
            </div>
            <DiscussionFilter />
          </div>

          {/* Content area */}
          <div className="mt-6 flex flex-col md:flex-row">
            {/* Categories for desktop */}
            <div className="hidden md:block md:w-[15rem] md:pr-8">
              <div className="mb-3 text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">
                Categories
              </div>
              <CategorySelector
                categories={categories}
                initialCategory={category}
              />
            </div>

            {/* Discussion List and Pagination */}
            <div className="flex-1">
              <DiscussionList
                currentUserId={user.id}
                discussions={discussions}
                workspaceId={params.workspaceId}
              />
              <TablePagination {...paginationData} />

              {/* Categories for mobile */}
              <div className="mt-8 md:hidden">
                <div className="mb-3 text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">
                  Categories
                </div>
                <CategorySelector
                  categories={categories}
                  initialCategory={category}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

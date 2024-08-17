import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/16/solid';
import { redirect } from 'next/navigation';

import DiscussionList from '@/app/(platform)/(home)/[workspaceId]/discussions/_components/discussion-list';
import CategorySelector from '@/app/(platform)/(home)/[workspaceId]/discussions/new-discussion/_components/select-category';
import { Button } from '@/components/catalyst/button';
import { Input, InputGroup } from '@/components/catalyst/input';
import { getCurrentUser } from '@/lib/get-current-user';

import DiscussionFilter from './_components/discussion-filter';
import { getCategories, getDiscussions } from './_data/discussions';

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

  const categoryFilter = searchParams.category as string | undefined;
  const discussions = await getDiscussions(
    user.userId,
    params.workspaceId,
    searchParams,
  );
  const categories = await getCategories(user.userId, params.workspaceId);

  return (
    <main className="flex flex-1 flex-col pb-2 lg:px-2">
      <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
        <div className="lg:mx-auto lg:max-w-6xl">
          <div className="flex flex-col justify-between gap-y-2">
            <div className="flex w-full items-center gap-x-2">
              <div className="flex-grow">
                <InputGroup className="w-full">
                  <MagnifyingGlassIcon />
                  <Input placeholder="Search discussions..." type="search" />
                </InputGroup>
              </div>
              <Button href="discussions/new-discussion/choose-category">
                <PlusIcon />
                New Discussion
              </Button>
            </div>
            <DiscussionFilter />
          </div>
          {/* Left + Middle content */}
          <div className="flex-1 md:flex">
            {/* Left content */}
            <div className="mb-8 w-full md:mb-0 md:w-[15rem]">
              <div>
                <div className="md:py-8">
                  <div className="no-scrollbar -mx-4 flex flex-nowrap overflow-x-scroll px-4 md:block md:space-y-3 md:overflow-auto">
                    <div>
                      <div className="mb-3 text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">
                        Categories
                      </div>
                      <CategorySelector
                        categories={categories}
                        initialCategory={categoryFilter}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle content */}
            <div className="flex-1  ">
              <div className="md:py-8">
                {/* Forum Entries */}
                <DiscussionList
                  currentUserId={user.userId}
                  discussions={discussions}
                  workspaceId={params.workspaceId}
                />

                {/* Pagination */}
                <div className="mt-6 text-right">
                  <nav
                    aria-label="Navigation"
                    className="inline-flex"
                    role="navigation"
                  >
                    <ul className="flex justify-center">
                      <li className="ml-3 first:ml-0">
                        <span className="btn border-slate-200 bg-white text-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-600">
                          &lt;- Previous
                        </span>
                      </li>
                      <li className="ml-3 first:ml-0">
                        <a
                          className="btn border-slate-200 bg-white text-indigo-500 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
                          href="#0"
                        >
                          Next -&gt;
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

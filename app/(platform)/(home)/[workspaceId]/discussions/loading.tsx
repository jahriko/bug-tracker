import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/16/solid';
import { Button } from '@/components/catalyst/button';
import { Skeleton } from '@/components/ui/skeleton';

function DiscussionsLoading() {
  return (
    <main className="flex flex-1 flex-col pb-2 lg:px-2">
      <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
        <div className="lg:mx-auto lg:max-w-6xl">
          <div className="flex flex-col justify-between gap-y-2">
            <div className="flex w-full items-center gap-x-2">
              <div className="flex-grow">
                <Skeleton className="h-10 w-full" />
              </div>
              <Button disabled>
                <PlusIcon />
                New Discussion
              </Button>
            </div>
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Content area */}
          <div className="mt-6 flex flex-col md:flex-row">
            {/* Categories for desktop */}
            <div className="hidden md:block md:w-[15rem] md:pr-8">
              <div className="mb-3 text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">
                Categories
              </div>
              <Skeleton className="h-40 w-full" />
            </div>

            {/* Discussion List and Pagination */}
            <div className="flex-1">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="mb-4 flex animate-pulse flex-col gap-2"
                >
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              ))}
              <Skeleton className="h-10 w-full" />

              {/* Categories for mobile */}
              <div className="mt-8 md:hidden">
                <div className="mb-3 text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">
                  Categories
                </div>
                <Skeleton className="h-40 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DiscussionsLoading;

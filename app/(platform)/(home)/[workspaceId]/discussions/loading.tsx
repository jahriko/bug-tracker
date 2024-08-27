import { PlusIcon } from '@heroicons/react/16/solid';
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
                <PlusIcon className="h-5 w-5" />
                New Discussion
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-16 sm:hidden" />
              <div className="hidden sm:flex sm:items-baseline sm:space-x-8">
                {[...Array(3)].map((_, index) => (
                  <Skeleton key={index} className="h-8 w-20" />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col md:flex-row">
            <div className="hidden md:block md:w-[15rem] md:pr-8">
              <div className="mb-3 text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">
                Categories
              </div>
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="flex-1">
              <div className="flow-root">
                <div className="mt-2 [--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)] -mx-[--gutter] overflow-x-auto whitespace-nowrap">
                  <div className="inline-block min-w-full align-middle sm:px-[--gutter]">
                    <table className="min-w-full text-left text-sm/6">
                      <tbody>
                        {[...Array(10)].map((_, index) => (
                          <tr key={index} className="">
                            <td className="align-top w-16 relative px-4 first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] border-b border-zinc-950/5 dark:border-white/5 py-4 sm:first:pl-1 sm:last:pr-1 align-top">
                              <div className="flex flex-col items-center gap-1">
                                <Skeleton className="h-6 w-6 rounded-full" />
                                <Skeleton className="h-4 w-4" />
                              </div>
                            </td>
                            <td className="relative px-4 first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] border-b border-zinc-950/5 dark:border-white/5 py-4 sm:first:pl-1 sm:last:pr-1 align-top">
                              <div className="flex items-start gap-2">
                                <Skeleton className="h-6 w-6 rounded-lg" />
                                <div className="flex flex-col min-w-0">
                                  <Skeleton className="h-5 w-3/4" />
                                  <div className="mt-1 flex flex-wrap items-center gap-x-1">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-8" />
                                    <Skeleton className="h-4 w-12" />
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="w-20 relative px-4 first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] border-b border-zinc-950/5 dark:border-white/5 py-4 sm:first:pl-1 sm:last:pr-1 align-top">
                              <div className="flex items-center gap-x-1.5">
                                <Skeleton className="h-6 w-6" />
                                <Skeleton className="h-6 w-4" />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <nav aria-label="Page navigation" className="mt-6 flex gap-x-2">
                <Skeleton className="h-10 w-24" />
                <div className="hidden items-baseline gap-x-2 sm:flex">
                  <Skeleton className="h-10 w-10" />
                  <Skeleton className="h-10 w-10" />
                </div>
                <Skeleton className="h-10 w-24 ml-auto" />
              </nav>
              <div className="mt-8 md:hidden">
                <div className="mb-3 text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">
                  Categories
                </div>
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DiscussionsLoading;

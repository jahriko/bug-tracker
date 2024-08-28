import { Divider } from '@/components/catalyst/divider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

export default function IssuePageLoading() {
  return (
    <>
      <ScrollArea className="flex-grow lg:h-[calc(100vh-4rem)]">
        <div className="mx-auto w-full max-w-4xl p-6 lg:p-10">
          <main className="flex-1">
            <div className="px-2 lg:px-0 xl:max-w-full">
              <div className="dark:border-white/10">
                <div>
                  <div className="md:flex md:items-center md:justify-between md:space-x-4 xl:pb-2">
                    <div className="w-full">
                      <Skeleton className="h-10 w-full bg-zinc-200 dark:bg-zinc-700" />
                    </div>
                  </div>

                  <aside className="mt-8 xl:hidden">
                    <h2 className="sr-only">Details</h2>
                    <div className="flex flex-wrap gap-4">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="w-full sm:w-auto">
                          <Skeleton className="h-10 w-32 bg-zinc-200 dark:bg-zinc-700" />
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 border-b border-t border-zinc-200 dark:border-zinc-700 py-6">
                      <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        Labels
                      </h2>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {Array.from({ length: 3 }).map((_, index) => (
                          <Skeleton
                            key={index}
                            className="h-6 w-20 rounded-full bg-zinc-200 dark:bg-zinc-700"
                          />
                        ))}
                      </div>
                      <div className="mt-2">
                        <Skeleton className="h-8 w-24 bg-zinc-200 dark:bg-zinc-700" />
                      </div>
                    </div>
                  </aside>

                  <div className="py-2 xl:pb-0">
                    <h2 className="sr-only">Description</h2>
                    <Skeleton className="h-40 w-full bg-zinc-200 dark:bg-zinc-700" />
                  </div>
                </div>
              </div>
              <section className="mt-8 xl:mt-10">
                <div>
                  <div>
                    <Divider className="pb-4" />
                    <div className="pt-6">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="mb-6 flex items-start space-x-3"
                        >
                          <Skeleton className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-1/4 mb-2 bg-zinc-200 dark:bg-zinc-700" />
                            <Skeleton className="h-16 w-full bg-zinc-200 dark:bg-zinc-700" />
                          </div>
                        </div>
                      ))}
                      <div className="mt-6">
                        <div className="flex space-x-3">
                          <Skeleton className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                          <div className="min-w-0 flex-1">
                            <legend className="sr-only">Comment</legend>
                            <Skeleton className="h-32 w-full bg-zinc-200 dark:bg-zinc-700" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </ScrollArea>

      <div className="hidden w-auto flex-shrink-0 overflow-y-auto rounded-r-lg border-l border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 lg:block">
        <div className="p-6">
          <div className="h-full">
            <div className="flex w-72 flex-col">
              <div className="flex flex-col gap-4">
                {['Status', 'Priority', 'Assigned to', 'Labels', 'Project'].map((label, index) => (
                  <div key={index}>
                    <span className="select-none text-xs font-medium text-zinc-400 dark:text-zinc-500">
                      {label}
                    </span>
                    {label === 'Labels' ? (
                      <div className="flex flex-wrap items-center gap-1 mt-1.5">
                        {Array.from({ length: 3 }).map((_, idx) => (
                          <Skeleton key={idx} className="h-7 w-20 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                        ))}
                        <Skeleton className="h-6 w-6 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                      </div>
                    ) : (
                      <Skeleton className="h-8 w-full mt-1 bg-zinc-200 dark:bg-zinc-700" />
                    )}
                  </div>
                ))}
              </div>

              <Divider className="my-4" />
              <div>
                <Skeleton className="h-8 w-full bg-zinc-200 dark:bg-zinc-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { Divider } from '@/components/catalyst/divider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

export default function IssuePageLoading() {
  return (
    <main className="flex flex-1 flex-col pb-2 lg:px-2">
      <div className="flex flex-1 lg:rounded-lg lg:bg-white lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
        <div className="flex flex-1 flex-col lg:flex-row">
          <ScrollArea className="flex-grow lg:h-[calc(100vh-4rem)]">
            <div className="mx-auto w-full max-w-4xl p-6 lg:p-10">
              <main className="flex-1">
                <div className="px-2 lg:px-0 xl:max-w-full">
                  <div className="dark:border-white/10">
                    <div>
                      <div className="md:flex md:items-center md:justify-between md:space-x-4 xl:pb-2">
                        <div className="w-full">
                          <Skeleton className="h-10 w-full" />
                        </div>
                      </div>

                      <aside className="mt-8 xl:hidden">
                        <h2 className="sr-only">Details</h2>
                        <div className="flex flex-wrap gap-4">
                          {[...Array(4)].map((_, index) => (
                            <div key={index} className="w-full sm:w-auto">
                              <Skeleton className="h-10 w-32" />
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 border-b border-t border-gray-200 py-6">
                          <h2 className="text-sm font-medium text-gray-500">
                            Labels
                          </h2>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {[...Array(3)].map((_, index) => (
                              <Skeleton
                                key={index}
                                className="h-6 w-20 rounded-full"
                              />
                            ))}
                          </div>
                          <div className="mt-2">
                            <Skeleton className="h-8 w-24" />
                          </div>
                        </div>
                      </aside>

                      <div className="py-2 xl:pb-0">
                        <h2 className="sr-only">Description</h2>
                        <Skeleton className="h-40 w-full" />
                      </div>
                    </div>
                  </div>
                  <section className="mt-8 xl:mt-10">
                    <div>
                      <div>
                        <Divider className="pb-4" />
                        <div className="pt-6">
                          {[...Array(3)].map((_, index) => (
                            <div
                              key={index}
                              className="mb-6 flex items-start space-x-3"
                            >
                              <Skeleton className="h-10 w-10 rounded-full" />
                              <div className="flex-1">
                                <Skeleton className="h-4 w-1/4 mb-2" />
                                <Skeleton className="h-16 w-full" />
                              </div>
                            </div>
                          ))}
                          <div className="mt-6">
                            <div className="flex space-x-3">
                              <Skeleton className="h-10 w-10 rounded-full" />
                              <div className="min-w-0 flex-1">
                                <legend className="sr-only" htmlFor="comment">
                                  Comment
                                </legend>
                                <Skeleton className="h-32 w-full" />
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

          <div className="hidden w-auto flex-shrink-0 overflow-y-auto rounded-r-lg border-l border-zinc-200 bg-white dark:border-zinc-700 lg:block">
            <div className="p-6">
              <div className="h-full">
                <div className="flex w-72 flex-col">
                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="select-none text-xs font-medium text-zinc-400">
                        Status
                      </span>
                      <Skeleton className="h-8 w-full mt-1" />
                    </div>
                    <div>
                      <span className="select-none text-xs font-medium text-zinc-400">
                        Priority
                      </span>
                      <Skeleton className="h-8 w-full mt-1" />
                    </div>
                    <div>
                      <span className="select-none text-xs font-medium text-zinc-400">
                        Assigned to
                      </span>
                      <Skeleton className="h-8 w-full mt-1" />
                    </div>
                    <div>
                      <span className="select-none text-xs font-medium text-zinc-400">
                        Labels
                      </span>
                      <div className="flex flex-wrap items-center gap-1 mt-1.5">
                        {[...Array(3)].map((_, index) => (
                          <Skeleton
                            key={index}
                            className="h-7 w-20 rounded-full"
                          />
                        ))}
                        <Skeleton className="h-6 w-6 rounded-full" />
                      </div>
                    </div>
                    <div>
                      <span className="select-none text-xs font-medium text-zinc-400">
                        Project
                      </span>
                      <Skeleton className="h-8 w-full mt-1" />
                    </div>
                  </div>

                  <Divider className="my-4" />
                  <div>
                    <Skeleton className="h-8	 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

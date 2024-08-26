import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';
import { Button } from '@/components/catalyst/button';
import { InputGroup } from '@/components/catalyst/input';
import { Skeleton } from '@/components/ui/skeleton';

function IssuesLoading() {
  return (
    <main className="flex flex-1 flex-col pb-2 lg:px-2">
      <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-x-2">
            <div className="flex-grow">
              <InputGroup className="w-full">
                <MagnifyingGlassIcon />
                <Skeleton className="h-10 w-full" />
              </InputGroup>
            </div>
            <Button disabled>New Issue</Button>
          </div>
          <div className="py-6">
            <main>
              <div>
                {/* IssueTable Skeleton */}
                <div className="mt-8 flow-root">
                  <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                          <tr>
                            {[...Array(5)].map((_, index) => (
                              <th
                                key={index}
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                scope="col"
                              >
                                <Skeleton className="h-5 w-20" />
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {[...Array(5)].map((_, rowIndex) => (
                            <tr key={rowIndex}>
                              {[...Array(5)].map((_, colIndex) => (
                                <td
                                  key={colIndex}
                                  className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0"
                                >
                                  <Skeleton className="h-5 w-full" />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* TablePagination Skeleton */}
                <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <Skeleton className="h-5 w-40" />
                    </div>
                    <div>
                      <nav
                        aria-label="Pagination"
                        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                      >
                        {[...Array(7)].map((_, index) => (
                          <Skeleton key={index} className="h-8 w-8" />
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </main>
  );
}

export default IssuesLoading;

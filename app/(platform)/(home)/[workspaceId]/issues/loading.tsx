import { Skeleton } from '@/components/ui/skeleton';

function IssuesLoading() {
  return (
    <main className="flex flex-1 flex-col pb-2 lg:px-2">
      <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-x-2 mb-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-20" />
          </div>
          <table className="min-w-full text-left text-sm/6">
            <thead className="text-zinc-500 dark:text-zinc-400">
              <tr>
                <td className="w-0 py-4 pr-3">
                  <Skeleton className="h-4 w-4" />
                </td>
                <td className="h-14 py-4">
                  <div className="flex items-center gap-x-6 text-xs text-gray-500">
                    {[...Array(4)].map((_, index) => (
                      <Skeleton key={index} className="h-4 w-8" />
                    ))}
                  </div>
                </td>
              </tr>
            </thead>
            <tbody>
              {[...Array(10)].map((_, rowIndex) => (
                <tr key={rowIndex} className="group">
                  <td className="py-4 pr-3">
                    <Skeleton className="h-4 w-4" />
                  </td>
                  <td className="py-4">
                    <div className="flex items-start gap-x-2">
                      <Skeleton className="h-5 w-5 flex-shrink-0" />
                      <div className="min-w-0 flex-grow">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <Skeleton className="h-5 w-3/4" />
                          {[...Array(3)].map((_, index) => (
                            <Skeleton key={index} className="h-5 w-16" />
                          ))}
                        </div>
                        <div className="mt-1">
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default IssuesLoading;

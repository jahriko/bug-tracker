import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';

export function NoIssuesFound({ search }: { search: string | undefined }) {
  return (
    <div className="mt-8 text-center">
      <div className="flex items-center gap-x-2">
        <MagnifyingGlassIcon className="h-5 w-5 text-zinc-400 dark:text-zinc-600" />
        <span className="text-sm font-medium">
          {search
            ? `No issues found for "${search}"`
            : 'No issues found'}
        </span>
      </div>
      <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
        Try searching for something else or create a new issue.
      </p>
    </div>
  );
}
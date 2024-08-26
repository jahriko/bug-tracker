import { PlusIcon } from '@heroicons/react/16/solid';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/catalyst/button';

export default function WorkspaceNotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center pb-2 lg:px-2 h-full">
      <div className="grow flex items-center justify-center p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10 h-full w-full">
        <div className="lg:mx-auto lg:max-w-6xl text-center">
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-zinc-100 p-3">
              <ExclamationTriangleIcon className="h-8 w-8 text-zinc-500" />
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Workspace not found
            </h1>
            <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
              Sorry, we couldn&apos;t find the workspace you&apos;re looking for.
            </p>
            <Button className="mt-6" color="dark/zinc" href="/create-workspace">
              <PlusIcon />
              Create a new workspace
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function DiscussionPageLoading() {
  return (
    <main className="flex flex-1 flex-col pb-2 lg:px-2">
      <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
        <div className="mx-auto max-w-4xl">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-6">
            <div className="flex flex-col space-y-2">
              <Skeleton className="h-7 w-3/4" /> {/* Title */}
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" /> {/* Avatar */}
                <div className="flex items-center space-x-1">
                  <Skeleton className="h-4 w-24" /> {/* Author name */}
                  <Skeleton className="h-4 w-4" /> {/* Separator */}
                  <Skeleton className="h-4 w-20" /> {/* Time ago */}
                </div>
              </div>
            </div>
            <Skeleton className="h-20 w-full" /> {/* Discussion content */}
            <div className="flex flex-col space-y-4">
              <Skeleton className="h-8 w-24" /> {/* "Replies" heading */}
              <CommentFeedSkeleton />
            </div>
            <CommentEditorSkeleton />
          </div>
        </div>
      </div>
    </main>
  );
}

function CommentFeedSkeleton() {
  return (
    <div className="flow-root">
      <ul className="space-y-6">
        {[...Array(2)].map((_, index) => (
          <CommentItemSkeleton key={index} />
        ))}
      </ul>
    </div>
  );
}

function CommentItemSkeleton() {
  return (
    <li className="relative flex gap-x-4">
      <div className="relative mt-3 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-200">
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
        <div className="flex justify-between gap-x-4">
          <Skeleton className="h-4 w-24" /> {/* Author name */}
          <Skeleton className="h-4 w-16" /> {/* Time ago */}
        </div>
        <Skeleton className="mt-2 h-16 w-full" /> {/* Comment content */}
      </div>
    </li>
  );
}

function CommentEditorSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" /> {/* "Add a comment" text */}
      </CardHeader>
      <CardContent>
        <Skeleton className="h-24 w-full" /> {/* Editor area */}
        <div className="mt-4 flex justify-end">
          <Skeleton className="h-10 w-24" /> {/* Submit button */}
        </div>
      </CardContent>
    </Card>
  );
}

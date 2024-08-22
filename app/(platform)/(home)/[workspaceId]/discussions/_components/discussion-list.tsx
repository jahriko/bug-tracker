'use client';

import {
  ArrowUpCircleIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';
import { ArrowUpCircleIcon as ArrowUpCircleIconSolid } from '@heroicons/react/24/solid';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { useOptimisticAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/catalyst/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { timeAgo } from '@/lib/utils';

import { likeDiscussion } from '../_actions/like';
import { type DiscussionType } from '../_data/discussions';

export function DiscussionList({
  discussions,
  workspaceId,
  currentUserId,
}: {
  discussions: DiscussionType[];
  workspaceId: string;
  currentUserId: string;
}) {
  const { execute, result, optimisticState } = useOptimisticAction(
    likeDiscussion,
    {
      currentState: { discussions },
      updateFn: (state, action) => {
        return {
          discussions: state.discussions.map((discussion) =>
            discussion.id === action.discussionId
              ? {
                  ...discussion,
                  likes: discussion.likes.some(
                    (like) => like.userId === currentUserId,
                  )
                    ? discussion.likes.filter(
                        (like) => like.userId !== currentUserId,
                      )
                    : [...discussion.likes, { userId: currentUserId }],
                  likeCount: discussion.likes.some(
                    (like) => like.userId === currentUserId,
                  )
                    ? discussion.likeCount - 1
                    : discussion.likeCount + 1,
                }
              : discussion,
          ),
        };
      },
    },
  );

  const handleLikeToggle = (discussionId: string) => {
    execute({ discussionId, workspaceUrl: workspaceId });

    if (result.serverError) {
      toast.error(result.serverError);
    }
  };

  return (
    <Table className="mt-2 [--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
      <TableBody>
        {optimisticState.discussions.map((discussion) => (
          <TableRow key={discussion.id}>
            <TableCell className="align-top w-16">
              <div className="flex flex-col items-center gap-1">
                <button
                  className="text-gray-400 hover:text-gray-500"
                  type="button"
                  onClick={() => handleLikeToggle(discussion.id)}
                >
                  {discussion.likes.some(
                    (like) => like.userId === currentUserId,
                  ) ? (
                    <ArrowUpCircleIconSolid
                      aria-hidden="true"
                      className="size-6 text-indigo-500"
                    />
                  ) : (
                    <ArrowUpCircleIcon aria-hidden="true" className="size-6" />
                  )}
                </button>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {discussion.likeCount}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-start gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-lg bg-zinc-100 fill-current text-sm text-emerald-500">
                        {discussion.category.emoji}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{discussion.category.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="flex flex-col min-w-0">
                  <Link
                    className="text-sm text-wrap font-semibold leading-normal text-gray-900 dark:text-gray-100 hover:underline truncate"
                    href={`/${workspaceId}/discussions/${discussion.id}`}
                    prefetch={false}
                  >
                    {discussion.title}
                  </Link>
                  <div className="mt-1 flex flex-wrap items-center gap-x-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                    <span>Started by</span>
                    <span className="underline underline-offset-2 hover:text-zinc-400">
                      {discussion.author.name}
                    </span>
                    <time dateTime={discussion.createdAt.toISOString()}>
                      {timeAgo(
                        DateTime.fromJSDate(new Date(discussion.createdAt)),
                      )}
                    </time>
                    {discussion.category ? (
                      <>
                        <span>in</span>
                        <span>{discussion.category.name}</span>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell className="w-20">
              <div className="flex items-center gap-x-1.5">
                <ChatBubbleLeftIcon
                  aria-hidden="true"
                  className="size-6 text-gray-400"
                />{' '}
                <span className="text-sm leading-6 text-gray-900 dark:text-gray-100">
                  {discussion._count.posts}
                </span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

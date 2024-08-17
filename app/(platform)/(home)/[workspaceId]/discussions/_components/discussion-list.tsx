'use client';

import {
  ArrowUpCircleIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';
import { ArrowUpCircleIcon as ArrowUpCircleIconSolid } from '@heroicons/react/24/solid';
import { DateTime } from 'luxon';
import { useOptimisticAction } from 'next-safe-action/hooks';
import Link from 'next/link';
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

interface Discussion {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  projectId: number;
  authorId: string;
  categoryId: number;
  isResolved: boolean;
  viewCount: number;
  likeCount: number;
  workspaceId: number;
  likes: { userId: string }[];
  author: { name: string };
  category?: { name: string; emoji: string };
  _count: { posts: number };
}

interface DiscussionListProps {
  discussions: Discussion[];
  workspaceId: string;
  currentUserId: string;
}

export default function DiscussionList({
  discussions,
  workspaceId,
  currentUserId,
}: DiscussionListProps) {
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

  const handleLikeToggle = (discussionId: number) => {
    execute({ discussionId, workspaceUrl: workspaceId });

    if (result.serverError) {
      toast.error(result.serverError);
    }
  };

  return (
    <Table>
      <TableBody>
        {optimisticState.discussions.map((discussion) => (
          <TableRow key={discussion.id}>
            <TableCell className="align-top">
              <div className="flex flex-col items-center">
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
                <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {discussion.likeCount}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  {discussion.category ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="flex select-none items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <span className="inline-block text-sm">
                              {discussion.category.emoji}
                            </span>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{discussion.category.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : null}
                  <span className="flex items-center self-stretch text-gray-300 dark:text-gray-600">
                    <span className="h-full w-px bg-current" />
                  </span>
                  <Link
                    className="text-sm text-wrap font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:underline"
                    href={`/${workspaceId}/discussions/${discussion.id}`}
                  >
                    {discussion.title}
                  </Link>
                </div>
                <div className="mt-1 flex items-center gap-x-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                  Started by
                  <span className="underline underline-offset-2 hover:text-zinc-400">
                    {discussion.author.name}
                  </span>
                  {/* <svg className="h-0.5 w-0.5 fill-current" viewBox="0 0 2 2">
                    <circle cx={1} cy={1} r={1} />
                  </svg> */}
                  <time dateTime={discussion.createdAt.toISOString()}>
                    {timeAgo(
                      DateTime.fromJSDate(new Date(discussion.createdAt)),
                    )}
                  </time>
                  <span>in {discussion.category?.name}</span>
                </div>
              </div>
            </TableCell>
            <TableCell className="w-24">
              <div className="flex w-16 gap-x-2.5">
                <ChatBubbleLeftIcon
                  aria-hidden="true"
                  className="h-6 w-6 text-gray-400"
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

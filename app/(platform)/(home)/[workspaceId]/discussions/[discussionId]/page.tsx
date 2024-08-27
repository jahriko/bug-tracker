import { DateTime } from 'luxon';
import { notFound } from 'next/navigation';
import { Avatar } from '@/components/catalyst/avatar';
import { Heading } from '@/components/catalyst/heading';
import { Text } from '@/components/catalyst/text';
import { CommentEditor } from '@/components/text-editor/comment-editor';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getCurrentUser } from '@/lib/get-current-user';
import { getPrisma } from '@/lib/getPrisma';
import { timeAgo } from '@/lib/utils';

export default async function DiscussionPage({
  params,
}: {
  params: { workspaceId: string; discussionId: string };
}) {
  const user = await getCurrentUser();
  if (!user) {
    return notFound();
  }

  const prisma = getPrisma(user.id);
  const discussion = await prisma.discussion.findUnique({
    where: { id: Number(params.discussionId) },
    include: {
      author: true,
      category: true,
      posts: {
        include: {
          author: true,
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!discussion) {
    return notFound();
  }

  const formatRelativeTime = (date: Date) => {
    return DateTime.fromJSDate(date).toRelative();
  };

  function CommentFeed({ posts }: { posts: typeof discussion.posts }) {
    return (
      <div className="flow-root">
        <ul className="space-y-6">
          {posts.map((post) => (
            <CommentItem key={post.id} post={post} />
          ))}
        </ul>
      </div>
    );
  }

  function CommentItem({ post }: { post: (typeof discussion.posts)[number] }) {
    return (
      <li className="relative flex gap-x-4">
        <div className="relative mt-3 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-200">
          <Avatar
            alt={post.author.name}
            className="size-5"
            initials={post.author.name.charAt(0)}
            src={post.author.image}
          />
        </div>
        <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
          <div className="flex justify-between gap-x-4">
            <div className="py-0.5 text-xs leading-5 text-gray-500">
              <span className="font-semibold text-gray-900">
                {post.author.name}
              </span>
            </div>
            <time
              className="flex-none py-0.5 text-xs leading-5 text-gray-500"
              dateTime={post.createdAt.toISOString()}
            >
              {timeAgo(DateTime.fromJSDate(post.createdAt))}
            </time>
          </div>
          <Text className="mt-2">{post.content}</Text>
        </div>
      </li>
    );
  }

  return (
    <main className="flex flex-1 flex-col pb-2 lg:px-2">
      <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
        <div className="mx-auto max-w-4xl">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-6">
            <div className="flex flex-col space-y-2">
              <Heading level={1}>{discussion.title}</Heading>
              <div className="flex items-center space-x-4">
                <Avatar
                  alt={discussion.author.name}
                  className="size-4"
                  initials={discussion.author.name.charAt(0)}
                  src={discussion.author.image}
                />
                <div className="flex items-center space-x-1">
                  <Text>{discussion.author.name}</Text>
                  <span>⋅</span>
                  <Text color="subtle">
                    {timeAgo(DateTime.fromJSDate(discussion.createdAt))}
                  </Text>
                </div>
              </div>
            </div>
            <Text>{discussion.content}</Text>
            <div className="flex flex-col space-y-4">
              <Heading level={3}>Replies</Heading>
              <CommentFeed posts={discussion.posts} />
            </div>
            <CommentEditor
              discussionId={Number(params.discussionId)}
              lastActivity={{
                activityType: 'DiscussionComment',
                activityId: discussion.id,
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

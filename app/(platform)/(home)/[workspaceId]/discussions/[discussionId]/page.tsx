import { DateTime } from 'luxon';
import { notFound } from 'next/navigation';
import { Avatar } from '@/components/catalyst/avatar';
import { Button } from '@/components/catalyst/button';
import { Heading } from '@/components/catalyst/heading';
import { Text } from '@/components/catalyst/text';
import { Textarea } from '@/components/catalyst/textarea';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getCurrentUser } from '@/lib/get-current-user';
import { getPrisma } from '@/lib/getPrisma';

export default async function DiscussionPage({
  params,
}: {
  params: { workspaceId: string; discussionId: string };
}) {
  const user = await getCurrentUser();
  if (!user) {
    return notFound();
  }

  const prisma = getPrisma(user.userId);
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

  return (
    <main className="flex flex-1 flex-col pb-2 lg:px-2">
      <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
        <div className="mx-auto max-w-6xl">
          <div className="container mx-auto px-4 py-8">
            <Heading level={1}>{discussion.title}</Heading>
            <div className="mt-4 flex items-center space-x-4">
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
                  {formatRelativeTime(discussion.createdAt)}
                </Text>
              </div>
            </div>
            <div className="mt-6">
              <Card>
                <CardContent>
                  <Text>{discussion.content}</Text>
                </CardContent>
              </Card>
            </div>
            <div className="mt-8">
              <Heading level={2}>Replies</Heading>
              {discussion.posts.map((post) => (
                <Card key={post.id} className="mt-4">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar
                        alt={post.author.name}
                        className="size-4"
                        initials={post.author.name.charAt(0)}
                        src={post.author.image}
                      />
                      <div>
                        <Text>{post.author.name}</Text>
                        <Text color="subtle">
                          Posted {formatRelativeTime(post.createdAt)}
                        </Text>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Text>{post.content}</Text>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Add a comment</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea placeholder="Type your comment here..." rows={4} />
              </CardContent>
              <CardFooter>
                <Button>Post Comment</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

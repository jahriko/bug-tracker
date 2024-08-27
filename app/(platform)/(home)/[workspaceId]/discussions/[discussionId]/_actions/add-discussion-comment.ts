'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/get-current-user';
import { getPrisma } from '@/lib/getPrisma';
import { authActionClient } from '@/lib/safe-action';

const schema = z.object({
  content: z.string().min(1),
  discussionId: z.number(),
});

export const addDiscussionComment = authActionClient
  .schema(schema)
  .action(async ({ parsedInput: { content, discussionId } }) => {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not found');
    }

    const prisma = getPrisma(user.id);

    const newComment = await prisma.discussionPost.create({
      data: {
        content,
        discussionId,
        authorId: user.id,
      },
      include: {
        author: true,
      },
    });

    revalidatePath(`/${discussionId}`);

    return newComment;
  });

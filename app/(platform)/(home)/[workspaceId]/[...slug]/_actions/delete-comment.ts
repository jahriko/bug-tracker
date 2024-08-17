'use server';
import { getPrisma } from '@/lib/getPrisma';
import { authActionClient } from '@/lib/safe-action';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';

export const deleteComment = authActionClient
  .schema(
    z.object({
      commentId: z.number(),
      activityId: z.number(),
      issueId: z.number(),
    }),
  )
  .action(
    async ({
      parsedInput: { commentId, activityId, issueId },
      ctx: { userId },
    }) => {
      await getPrisma(userId).$transaction(async (tx) => {
        await tx.comment.delete({
          where: {
            id: commentId,
          },
        });

        await tx.commentActivity.delete({
          where: {
            id: activityId,
          },
        });

        revalidateTag(`issue-${issueId}`);
      });
    },
  );

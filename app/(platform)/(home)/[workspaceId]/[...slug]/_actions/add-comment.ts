'use server';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { getPrisma } from '@/lib/getPrisma';
import { authActionClient } from '@/lib/safe-action';

export const addComment = authActionClient
  .schema(
    z.object({
      issueId: z.number(),
      commentBody: z.string(),
      lastActivity: z.object({
        activityType: z.string(),
        activityId: z.number(),
      }),
    }),
  )
  .action(
    async ({
      parsedInput: { issueId, commentBody, lastActivity },
      ctx: { userId },
    }) => {
      await getPrisma(userId).$transaction(async (tx) => {
        const comment = await tx.comment.create({
          data: {
            content: commentBody,
            authorId: userId,
            issueId,
          },
        });

        await tx.commentActivity.create({
          data: {
            commentId: comment.id,
            userId,
            issueId,
          },
        });

        revalidateTag(`issue-${issueId}`);
      });
    },
  );

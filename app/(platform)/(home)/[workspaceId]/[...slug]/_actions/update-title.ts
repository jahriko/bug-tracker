'use server';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { getPrisma } from '@/lib/getPrisma';
import { authActionClient } from '@/lib/safe-action';

const schema = z.object({
  issueId: z.number(),
  title: z.string(),
  lastActivity: z.object({
    activityType: z.string(),
    activityId: z.number(),
  }),
});

export const updateTitle = authActionClient
  .schema(schema)
  .action(
    async ({
      parsedInput: { issueId, title, lastActivity },
      ctx: { userId },
    }) => {
      await getPrisma(userId).$transaction(async (tx) => {
        await tx.issue.update({
          where: {
            id: issueId,
          },
          data: {
            title,
          },
        });

        await tx.titleActivity.upsert({
          where: {
            id:
              lastActivity.activityType === 'TitleActivity'
                ? lastActivity.activityId
                : -1,
          },
          update: {
            body: title,
          },
          create: {
            userId,
            issueId,
            body: title,
          },
        });

        revalidateTag(`issue-${issueId}`);
      });
    },
  );

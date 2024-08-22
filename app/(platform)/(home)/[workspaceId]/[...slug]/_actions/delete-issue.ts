'use server';

import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { getPrisma } from '@/lib/getPrisma';
import { authActionClient } from '@/lib/safe-action';

export const deleteIssue = authActionClient
  .schema(
    z.object({
      issueId: z.number(),
    }),
  )
  .action(async ({ parsedInput: { issueId }, ctx: { userId } }) => {
    await getPrisma(userId).issue.delete({
      where: {
        id: issueId,
      },
    });

    revalidateTag(`issue-${issueId}`);

    return { success: true };
  });

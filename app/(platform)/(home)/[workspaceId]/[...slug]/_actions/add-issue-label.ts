'use server';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { getPrisma } from '@/lib/getPrisma';
import { authActionClient } from '@/lib/safe-action';

export const addIssueLabel = authActionClient
  .schema(
    z.object({
      issueId: z.number(),
      labelId: z.number(),
    }),
  )
  .action(async ({ parsedInput: { issueId, labelId }, ctx: { userId } }) => {
    await getPrisma(userId).$transaction(async (tx) => {
      const issueLabel = await tx.issueLabel.create({
        data: { labelId, issueId },
        select: { label: { select: { name: true, color: true } } },
      });

      await tx.labelActivity.create({
        data: {
          action: 'add',
          issueId,
          labelName: issueLabel.label.name,
          labelColor: issueLabel.label.color,
        },
      });

      revalidateTag(`issue-${issueId}`);
    });
  });

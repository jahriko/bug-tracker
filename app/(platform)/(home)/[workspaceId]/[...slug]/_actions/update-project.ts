/* eslint-disable import/prefer-default-export */
'use server';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { getPrisma } from '@/lib/getPrisma';
import { authActionClient } from '@/lib/safe-action';

const schema = z.object({
  issueId: z.number(),
  projectId: z.number(),
  lastActivity: z.object({
    activityType: z.string(),
    activityId: z.number(),
  }),
});

export const updateProject = authActionClient
  .schema(schema)
  .action(
    async ({
      parsedInput: { issueId, projectId, lastActivity },
      ctx: { userId },
    }) => {
      await getPrisma(userId).$transaction(async (tx) => {
        const updatedIssue = await tx.issue.update({
          where: {
            id: issueId,
          },
          data: {
            projectId,
          },
          include: {
            project: {
              select: {
                title: true,
              },
            },
          },
        });

        // Create a new activity type for project changes
        await tx.issueActivity.create({
          data: {
            issueId,
            userId,
            issueActivity: 'ProjectActivity',
            projectActivity: {
              create: {
                projectName: updatedIssue.project.title,
              },
            },
          },
        });

        revalidateTag(`issue-${issueId}`);
      });
    },
  );

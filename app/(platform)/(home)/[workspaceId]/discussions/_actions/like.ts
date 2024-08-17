'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { getPrisma } from '@/lib/getPrisma';
import { authActionClient } from '@/lib/safe-action';

const schema = z.object({
  discussionId: z.number(),
  workspaceUrl: z.string(),
});

export const likeDiscussion = authActionClient
  .schema(schema)
  .action(
    async ({
      parsedInput: { discussionId, workspaceUrl },
      ctx: { userId },
    }) => {
      const prisma = getPrisma(userId);

      const workspace = await prisma.workspace.findUnique({
        where: { url: workspaceUrl },
      });

      if (!workspace) {
        return { error: 'Workspace not found' };
      }

      try {
        const existingLike = await prisma.discussionLike.findUnique({
          where: {
            discussionId_userId: {
              discussionId,
              userId,
            },
          },
        });

        if (existingLike) {
          // Unlike
          await prisma.discussionLike.delete({
            where: {
              discussionId_userId: {
                discussionId,
                userId,
              },
            },
          });
        } else {
          // Like
          await prisma.discussionLike.create({
            data: {
              userId,
              discussionId,
            },
          });
        }

        // Update the likeCount
        const updatedDiscussion = await prisma.discussion.update({
          where: { id: discussionId },
          data: {
            likeCount: {
              [existingLike ? 'decrement' : 'increment']: 1,
            },
          },
          include: {
            likes: {
              where: {
                userId,
              },
              select: {
                userId: true,
              },
            },
          },
        });

        // Revalidate the discussions page to reflect the changes
        revalidatePath(`/${workspaceUrl}/discussions`);

        return {
          success: true,
          liked: !existingLike,
          discussion: updatedDiscussion,
        };
      } catch (error) {
        console.error('Error in likeDiscussion:', error);
        return { error: 'Failed to process like action' };
      }
    },
  );

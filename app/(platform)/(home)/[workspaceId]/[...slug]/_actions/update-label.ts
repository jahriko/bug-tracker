'use server';
import { getPrisma } from '@/lib/getPrisma';
import { authActionClient } from '@/lib/safe-action';
import { z } from 'zod';

const schema = z.object({
  issueId: z.number(),
  labelsToAdd: z.array(z.number()),
  labelsToRemove: z.array(z.number()),
});

export const updateLabels = authActionClient
  .schema(schema)
  .action(
    async ({
      parsedInput: { issueId, labelsToAdd, labelsToRemove },
      ctx: { userId },
    }) => {
      await getPrisma(userId).issue.update({
        where: {
          id: issueId,
        },
        data: {
          labels: {
            createMany: {
              data: labelsToAdd.map((labelId: number) => ({
                labelId,
              })),
            },

            deleteMany: {
              labelId: {
                in: labelsToRemove,
              },
            },
          },
        },
      });
    },
  );

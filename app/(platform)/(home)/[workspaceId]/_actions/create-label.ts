'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { actionClient } from '@/lib/safe-action';

const schema = z.object({
  id: z.number(), // This is only for optimistic update
  name: z.string(),
  color: z.string(),
});

export const createLabel = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { id, name, color } }) => {
    try {
      await prisma.label.create({
        data: {
          name,
          color,
        },
      });

      // Introduce a delay of 3 seconds
      await new Promise((resolve) => setTimeout(resolve, 3000));

      return {
        success: true,
      };
    } catch (e) {
      console.error('Error creating a label: ', e);
      return {
        error: {
          message: 'Failed to create label',
        },
      };
    } finally {
      revalidatePath('/(platform)/(home)/[workspaceId]/[projectId]', 'page');
    }
  });

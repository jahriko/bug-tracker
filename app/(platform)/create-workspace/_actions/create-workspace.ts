'use server';
import { z } from 'zod';
import { getPrisma } from '@/lib/getPrisma';
import { authActionClient } from '@/lib/safe-action';

const schema = z.object({
  name: z.string().min(2, { message: 'Workspace name is required.' }),
  url: z.string().refine((value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), {
    message: 'Invalid slug format',
  }),
});

export const createWorkspace = authActionClient
  .schema(schema)
  .action(async ({ parsedInput: { name, url }, ctx: { userId } }) => {
    const prisma = getPrisma(userId);

    const result = await prisma.$transaction(async (tx) => {
      // Create workspace
      const workspace = await tx.workspace.create({
        data: {
          name,
          url,
          ownerId: userId,
        },
      });

      // Create project with the same name as the workspace
      const project = await tx.project.create({
        data: {
          title: name,
          identifier: name.substring(0, 3).toUpperCase(),
          workspaceId: workspace.id,
        },
      });

      // Update user's lastWorkspaceUrl
      await tx.user.update({
        where: { id: userId },
        data: { lastWorkspaceUrl: url },
      });

      return { workspace, project };
    });

    return {
      workspaceName: name,
      workspaceUrl: url,
      projectId: result.project.id,
      code: 'success',
    };
  });
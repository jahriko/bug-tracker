import { type Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

export const getWorkspaces = async () => {
  const workspaces = await prisma.workspace.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return workspaces;
};

export type WorkspacesData = Prisma.PromiseReturnType<typeof getWorkspaces>;

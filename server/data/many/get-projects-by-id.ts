import { type Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

export const getProjectsById = async (workspaceId: string) => {
  const workspaceProjects = await prisma.workspace
    .findFirst({
      where: {
        name: workspaceId,
      },
      select: {
        projects: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })
    .then((workspaceProjects) => workspaceProjects?.projects ?? []);

  return workspaceProjects;
};

export type ProjectsIdData = Prisma.PromiseReturnType<typeof getProjectsById>;

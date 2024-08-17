import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

export const getIssuesById = async (projectId: string) => {
  const getProjectIdByName = await prisma.project.findFirst({
    select: {
      id: true,
    },
    where: {
      title: projectId,
    },
  });

  if (!getProjectIdByName) {
    return [];
  }

  const issues = await prisma.issue.findMany({
    where: {
      projectId: getProjectIdByName.id,
    },
    select: {
      id: true,
      createdAt: true,
      title: true,
      status: true,
      user: {
        select: {
          name: true,
        },
      },
      priority: true,
      project: {
        select: {
          id: true,
          title: true,
        },
      },
      issueLabels: {
        select: {
          label: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
      },
    },
  });

  return issues;
};

export type IssuesData = Prisma.PromiseReturnType<typeof getIssuesById>;

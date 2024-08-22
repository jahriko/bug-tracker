import { type Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

export const getIssues = async () => {
  const issues = await prisma.issue.findMany({
    select: {
      id: true,
      createdAt: true,
      title: true,
      status: true,
      label: true,
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

export type IssuesData = Prisma.PromiseReturnType<typeof getIssues>;

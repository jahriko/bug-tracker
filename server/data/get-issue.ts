import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

export const getIssue = async (issueId: number) => {
  const issue = await prisma.issue.findUnique({
    where: {
      id: issueId,
    },
    select: {
      createdAt: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      assignee: {
        select: {
          id: true,
          name: true,
        },
      },
      project: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!issue) {
    throw new Error('Error fetching issue');
  }

  return issue;
};

export type IssueData = Prisma.PromiseReturnType<typeof getIssue>;

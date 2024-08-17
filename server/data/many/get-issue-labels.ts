// eslint-disable-next-line camelcase
import { unstable_cache } from 'next/cache';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

export const getIssueLabels = unstable_cache(
  async (issueId: number) => {
    const issueLabels = await prisma.issueLabel.findMany({
      where: {
        issueId,
      },
      select: {
        label: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    return issueLabels.map((item) => ({
      id: item.label.id,
      name: item.label.name,
      color: item.label.color,
    }));
  },
  ['issue-labels'],
  {
    tags: ['issue-labels'],
  },
);

export type IssueLabelsData = Prisma.PromiseReturnType<typeof getIssueLabels>;

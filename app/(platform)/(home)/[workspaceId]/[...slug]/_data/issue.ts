import { type Prisma } from '@prisma/client';
import { unstable_cache } from 'next/cache';
import { getPrisma } from '@/lib/getPrisma';

interface User {
  userId: string;
}

export const getIssueByProject = async (
  user: User,
  projectId: string,
  id: string,
) => {
  return unstable_cache(
    () => {
      const issue = getPrisma(user.userId).issue.findUnique({
        where: {
          project: {
            identifier: projectId.toUpperCase(),
          },
          id: Number(id),
        },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          assignedUserId: true,
          priority: true,
          owner: {
            select: {
              name: true,
              image: true,
            },
          },
          labels: {
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
          comments: {
            select: {
              id: true,
              content: true,
            },
          },
          createdAt: true,
          project: {
            select: {
              id: true,
              title: true,
              members: {
                select: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      return issue;
    },
    ['issue', id],
    {
      tags: ['issue', `issue-${id}`],
    },
  )();
};

export type IssueType = Prisma.PromiseReturnType<typeof getIssueByProject>;

export async function getActivities(userId, issueId) {
  const issueActivities = await getPrisma(userId).issueActivity.findMany({
    where: {
      issueId: Number(issueId),
    },
    orderBy: {
      createdAt: 'asc',
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  return issueActivities;
}

export type IssueActivityType =
  | Prisma.PromiseReturnType<typeof getActivities>
  | {
      id: string;
      issueActivity: 'GroupedLabelActivity';
      addedLabels: { name: string; color: string }[];
      removedLabels: { name: string; color: string }[];
      user: {
        name: string;
        image: string | null;
      };
      createdAt: Date;
    }[];

import { type Priority, type Prisma, type Status } from '@prisma/client';
import { getPrisma } from '@/lib/getPrisma';
import prisma from '@/lib/prisma';

export async function getIssuesData(
  userId: string,
  projectIds: number[],
  page: number,
  pageSize: number,
  filter?: string,
  status?: Status | 'all',
  priority?: Priority | 'all',
  search?: string,
) {
  const skip = (page - 1) * pageSize;

  const whereClause: Prisma.IssueWhereInput = { projectId: { in: projectIds } };

  if (filter) {
    if (filter === 'owned') {
      whereClause.ownerId = userId;
    } else {
      whereClause.ownerId = filter;
    }
  }

  if (status && status !== 'all') {
    whereClause.status = status;
  }

  if (priority && priority !== 'all') {
    whereClause.priority = priority;
  }

  if (search) {
    whereClause.OR = [{ title: { contains: search, mode: 'insensitive' } }];
  }

  const [issues, totalIssues] = await Promise.all([
    getPrisma(userId).issue.findMany({
      where: whereClause,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        createdAt: true,
        project: { select: { id: true, title: true, identifier: true } },
        owner: { select: { name: true, image: true } },
        title: true,
        status: true,
        assignedUser: { select: { id: true, name: true, image: true } },
        priority: true,
        labels: {
          select: {
            label: { select: { id: true, name: true, color: true } },
          },
        },
      },
    }),
    prisma.issue.count({ where: whereClause }),
  ]);

  return { issues, totalIssues };
}

export type IssueDataType = NonNullable<
  Prisma.PromiseReturnType<typeof getIssuesData>['issues'][number]
>;

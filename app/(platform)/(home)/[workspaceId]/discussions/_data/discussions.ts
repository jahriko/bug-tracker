import { type Prisma } from '@prisma/client';

import { getPrisma } from '@/lib/getPrisma';

export async function getDiscussions(
  userId: string,
  workspaceId: string,
  page: number,
  pageSize: number,
  category?: string,
  search?: string,
) {
  const skip = (page - 1) * pageSize;

  const whereClause: Prisma.DiscussionWhereInput = {
    project: {
      workspace: {
        url: workspaceId,
      },
    },
  };

  if (search) {
    whereClause.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
      { author: { name: { contains: search, mode: 'insensitive' } } },
    ];
  }

  if (category) {
    whereClause.category = {
      name: category,
    };
  }

  const discussions = await getPrisma(userId).discussion.findMany({
    where: whereClause,
    skip,
    take: pageSize,
    select: {
      id: true,
      title: true,
      createdAt: true,
      projectId: true,
      likeCount: true,
      isResolved: true,
      content: true,
      likes: {
        where: {
          userId,
        },
        select: {
          userId: true,
        },
      },
      author: {
        select: {
          name: true,
        },
      },
      category: {
        select: {
          name: true,
          emoji: true,
        },
      },
      _count: {
        select: {
          posts: true,
        },
      },
    },
    orderBy: [{ id: 'desc' }],
  });

  const totalDiscussions = await getPrisma(userId).discussion.count({
    where: whereClause,
  });

  return { discussions, totalDiscussions };
}

export type DiscussionType = Awaited<ReturnType<typeof getDiscussions>>['discussions'][number];

export async function getCategories(userId: string, workspaceId: string) {
  return getPrisma(userId).discussionCategory.findMany({
    where: {
      project: {
        workspace: {
          url: workspaceId,
        },
      },
    },
    select: {
      id: true,
      name: true,
      emoji: true,
    },
  });
}

export type CategoryType = Awaited<ReturnType<typeof getCategories>>[number];
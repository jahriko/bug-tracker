import { type Prisma } from '@prisma/client';

import { getPrisma } from '@/lib/getPrisma';

export async function getDiscussions(
  userId: string,
  workspaceId: string,
  searchParams: Record<string, string | string[] | undefined>,
) {
  const categoryFilter = searchParams.category as string | undefined;
  const page = Number(searchParams.page) || 1;
  const pageSize = 10;
  const project = searchParams.project as string | undefined;
  const search = searchParams.search as string | undefined;
  const skip = (page - 1) * pageSize;

  const whereClause: Prisma.DiscussionWhereInput = {
    project: {
      workspace: {
        url: workspaceId,
      },
    },
  };

  if (search) {
    whereClause.OR = [{ title: { contains: search, mode: 'insensitive' } }];
  }

  if (project) {
    whereClause.project = {
      identifier: project,
    };
  }

  if (categoryFilter) {
    whereClause.category = {
      name: categoryFilter,
    };
  }

  return getPrisma(userId).discussion.findMany({
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
}

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

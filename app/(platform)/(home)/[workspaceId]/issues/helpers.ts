import { type Priority, type Prisma, type Status } from '@prisma/client';

import prisma from '@/lib/prisma';

export async function updateLastWorkspaceUrl(
  session: {
    userId: string;
    lastWorkspaceUrl: string;
  },
  workspaceId: string,
) {
  if (session.lastWorkspaceUrl !== workspaceId) {
    await prisma.user.update({
      where: { id: session.userId },
      data: { lastWorkspaceUrl: workspaceId },
    });
  }
}

export function getPaginationData(
  currentPage: number,
  totalIssues: number,
  pageSize: number,
) {
  const totalPages = Math.ceil(totalIssues / pageSize);

  return {
    currentPage,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    createPageUrl: (pageNum: number) => `?page=${pageNum}`,
  };
}

export function parseSearchParams(searchParams: Record<string, string | string[] | undefined>) {
  return {
    page: Number(searchParams.page) || 1,
    pageSize: 20,
    filter: searchParams.filter as string | undefined,
    status: searchParams.status as Status | undefined,
    priority: searchParams.priority as Priority | undefined,
    search: searchParams.search as string | undefined,
  };
}
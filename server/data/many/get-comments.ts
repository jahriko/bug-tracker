import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

export const getComments = async (issueId: number) => {
  const comments = await prisma.comment.findMany({
    where: {
      issueId,
    },
    select: {
      id: true,
      text: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  return comments;
};

export type IssueLabelsData = Prisma.PromiseReturnType<typeof getComments>;

import { type Prisma } from '@prisma/client';
import { getPrisma } from '@/lib/getPrisma';

export const getProjects = async (userId: string) => {
  return await getPrisma(userId).project.findMany({
    include: {
      _count: {
        select: {
          members: true,
        },
      },
      members: {
        select: {
          user: {
            select: {
              id: true,
              image: true,
              email: true,
              name: true,
            },
          },
        },
      },
      workspace: {
        select: {
          members: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
              role: true,
            },
          },
        },
      },
    },
  });
};

export type Project = NonNullable<Prisma.PromiseReturnType<typeof getProjects>>;

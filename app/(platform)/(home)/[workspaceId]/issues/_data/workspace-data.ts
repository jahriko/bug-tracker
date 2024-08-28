import { type Prisma } from '@prisma/client';
import { getPrisma } from '@/lib/getPrisma';

export async function getWorkspaceData(userId: string, workspaceId: string) {
  return getPrisma(userId).workspace.findUnique({
    where: { url: workspaceId },
    select: {
      projects: {
        select: {
          id: true,
          title: true,
          identifier: true,
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
  });
}

export type WorkspaceData = NonNullable<
  Prisma.PromiseReturnType<typeof getWorkspaceData>
>;

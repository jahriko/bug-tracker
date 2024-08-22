import { type Prisma } from '@prisma/client';
import { getPrisma } from '@/lib/getPrisma';

export async function getWorkspaceData(userId: string, workspaceId: string) {
  return await getPrisma(userId).workspace.findUnique({
    where: { url: workspaceId },
    include: {
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
    },
  });
}

export type WorkspaceDataType = NonNullable<Prisma.PromiseReturnType<
  typeof getWorkspaceData
>>;

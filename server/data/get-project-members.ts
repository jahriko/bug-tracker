import { unstable_cache } from "next/cache"

export const getProjectMembers = async (projectId: number) => {
  return unstable_cache(async () => {
    const members = await getPrisma().projectMember.findMany({
      where: {
        projectId,
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })
    return members
  })
}

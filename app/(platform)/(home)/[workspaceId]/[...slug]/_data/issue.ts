import { getPrisma } from "@/lib/getPrisma"
import { Prisma } from "@prisma/client"
import { unstable_cache } from "next/cache"

interface User {
  userId: string
}

export const getIssueByProject = async (user: User, projectId: string, id: string) => {
  return unstable_cache(
    () => {
      console.log("Calling getIssueByProject function...")
      const issue = getPrisma(user.userId).issue.findUniqueOrThrow({
        where: {
          project: {
            identifier: projectId,
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
          createdAt: true,
          project: {
            select: {
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
      })
      return issue
    },
    ["issue", id],
    {
      tags: ["issue", `issue-${id}`],
    },
  )()
}

export type IssueType = Prisma.PromiseReturnType<typeof getIssueByProject>

export async function getActivities(userId, issueId) {
  const issueActivities = await getPrisma(userId).issueActivity.findMany({
    where: {
      issueId: Number(issueId),
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  })

  return issueActivities
}

export type IssueActivityType = Prisma.PromiseReturnType<typeof getActivities>

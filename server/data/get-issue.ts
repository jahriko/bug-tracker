import { Prisma } from "@prisma/client"
import prisma from "@/lib/prisma"
import { unstable_cache } from "next/cache"

export const getIssue = unstable_cache(
  async (issueId: number) => {
    const issue = await prisma.issue.findUnique({
      where: {
        id: issueId,
      },
      select: {
        title: true,
        description: true,
        status: true,
        priority: true,
        assignee: {
          select: {
            id: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    if (!issue) {
      throw new Error("Error fetching issue")
    }

    return issue
  },
  ["issue"],
  {
    tags: ["issue"],
  },
)

export type IssueData = Prisma.PromiseReturnType<typeof getIssue>
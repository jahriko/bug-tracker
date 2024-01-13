import { Prisma } from "@prisma/client"
import prisma from "@/lib/prisma"

export async function getIssue(issueId: number) {
  const issue = await prisma.issue.findUnique({
    where: {
      id: issueId,
    },
    include: {
      project: {
        select: {
          title: true,
        },
      },
      labels: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
      user: {
        select: {
          name: true,
        },
      },
      assignee: {
        select: {
          // name: true,
          id: true,
        },
      },
      comment: true,
    },
  })

  if (!issue) {
    throw new Error("Error fetching issue")
  }

  return issue
}
export type IssueData = Prisma.PromiseReturnType<typeof getIssue>

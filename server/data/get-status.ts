import { Prisma } from "@prisma/client"
import { unstable_cache } from "next/cache"
import prisma from "@/lib/prisma"

export const getStatus = unstable_cache(
  async (issueId: number) => {
    const issue = await prisma.issue.findFirst({
      where: {
        id: issueId,
      },
      select: {
        status: true,
      },
    })

    return issue?.status
  },
  ["issue-status"],
  {
    tags: ["issue-status"],
  },
)

export type StatusData = Prisma.PromiseReturnType<typeof getStatus>
import { Prisma, PromiseReturnType } from "@prisma/client"
import prisma from "@/lib/prisma"
import { unstable_cache } from "next/cache"

export const getComments = async (issueId: number) => {
  const comments = await prisma.issueComment.findMany({
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
  })

  console.log("fetching comments")

  return comments
}

export type IssueLabelsData = PromiseReturnType<typeof getComments>
import { Prisma } from "@prisma/client"
import prisma from "@/lib/prisma"

const issueLabelInclude = {
  label: {
    select: {
      id: true,
      name: true,
      color: true,
    },
  },
} satisfies Prisma.IssueLabelInclude

export type IssueLabel = Prisma.IssueLabelGetPayload<{
  include: typeof issueLabelInclude
}>

export async function getIssueLabels(issueId: number) {
  const issueLabels = await prisma.issueLabel.findMany({
    where: {
      issueId,
    },
    include: issueLabelInclude,
  })

  return issueLabels
}

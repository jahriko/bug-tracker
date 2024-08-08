"use server"
import { getPrisma } from "@/lib/getPrisma"
import { authActionClient } from "@/lib/safe-action"
import { revalidateTag } from "next/cache"
import { z } from "zod"

export const removeIssueLabel = authActionClient
  .schema(
    z.object({
      issueId: z.number(),
      labelId: z.number(),
    }),
  )
  .action(async ({ parsedInput: { issueId, labelId }, ctx: { userId } }) => {
    await getPrisma(userId).$transaction(async (tx) => {
      const issueLabel = await tx.issueLabel.delete({
        where: {
          issueId_labelId: {
            issueId,
            labelId,
          },
        },
        select: {
          label: {
            select: {
              name: true,
              color: true,
            },
          },
        },
      })

      await tx.labelActivity.create({
        data: {
          action: "remove",
          issueId,
          labelName: issueLabel.label.name,
          labelColor: issueLabel.label.color,
        },
      })

      revalidateTag(`issue-${issueId}`)
    })
  })

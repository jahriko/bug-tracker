"use server"
import { getPrisma } from "@/lib/getPrisma"
import { authActionClient } from "@/lib/safe-action"
import { revalidateTag } from "next/cache"
import { z } from "zod"

const schema = z.object({
  issueId: z.number(),
  status: z.enum(["BACKLOG", "IN_PROGRESS", "DONE", "CANCELLED"]),
  lastActivity: z.object({
    activityType: z.string(),
    activityId: z.number(),
  }),
})

export const updateStatus = authActionClient
  .schema(schema)
  .action(async ({ parsedInput: { issueId, status, lastActivity }, ctx: { userId } }) => {
    await getPrisma(userId).$transaction(async (tx) => {
      await tx.issue.update({
        where: {
          id: issueId,
        },
        data: {
          status: status,
        },
      })

      await tx.statusActivity.upsert({
        where: {
          id:
            lastActivity.activityType === "StatusActivity" ? lastActivity.activityId : -1,
        },
        update: {
          statusName: status,
        },
        create: {
          userId,
          issueId,
          statusName: status,
        },
      })

      revalidateTag(`issue-${issueId}`)
    })
  })

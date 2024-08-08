"use server"
import { getPrisma } from "@/lib/getPrisma"
import { authActionClient } from "@/lib/safe-action"
import { Priority } from "@prisma/client"
import { revalidateTag } from "next/cache"
import { z } from "zod"

const schema = z.object({
  issueId: z.number(),
  priority: z.nativeEnum(Priority),
  lastActivity: z.object({
    activityType: z.string(),
    activityId: z.number(),
  }),
})

export const updatePriority = authActionClient
  .schema(schema)
  .action(async ({ parsedInput: { issueId, priority, lastActivity }, ctx: { userId } }) => {
    await getPrisma(userId).$transaction(async (tx) => {
      await tx.issue.update({
        where: {
          id: issueId,
        },
        data: {
          priority,
        },
      })

      await tx.priorityActivity.upsert({
        where: {
          id: lastActivity.activityType === "PriorityActivity" ? lastActivity.activityId : -1,
        },
        update: {
          priorityName: priority,
        },
        create: {
          userId,
          issueId,
          priorityName: priority,
        },
      })

      revalidateTag(`issue-${issueId}`)
    })
  })

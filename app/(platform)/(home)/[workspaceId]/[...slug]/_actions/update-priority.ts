"use server"
import { getPrisma } from "@/lib/getPrisma"
import { authActionClient } from "@/lib/safe-action"
import { revalidateTag } from "next/cache"
import { z } from "zod"

const schema = z.object({
  issueId: z.number(),
  priority: z.enum(["NO_PRIORITY", "LOW", "MEDIUM", "HIGH"]),
  lastActivity: z.object({
    activityType: z.string(),
    activityId: z.number(),
  }),
})

export const updatePriority = authActionClient
  .schema(schema)
  .action(
    async ({ parsedInput: { issueId, priority, lastActivity }, ctx: { userId } }) => {
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
            id:
              lastActivity.activityType === "PriorityActivity"
                ? lastActivity.activityId
                : -1,
          },
          update: {
            name: priority,
          },
          create: {
            userId,
            issueId,
            name: priority,
          },
        })

        // revalidatePath(`/${issue.project.workspaceId}/${issue.project.id}-${issueId}`)
        revalidateTag(`issue-${issueId}`)
      })
    },
  )

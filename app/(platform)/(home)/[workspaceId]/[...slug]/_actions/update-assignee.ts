"use server"
import { getPrisma } from "@/lib/getPrisma"
import { authActionClient } from "@/lib/safe-action"
import { revalidateTag } from "next/cache"
import { z } from "zod"

export const updateAssignee = authActionClient
  .schema(
    z.object({
      issueId: z.number(),
      assignedUserId: z.string(),
      assignedUsername: z.string(),
      assignedUserImage: z.string(),
      lastActivity: z.object({
        activityType: z.string(),
        activityId: z.number(),
      }),
    }),
  )
  .action(
    async ({
      parsedInput: {
        issueId,
        assignedUserId,
        assignedUsername,
        assignedUserImage,
        lastActivity,
      },
      ctx: { userId },
    }) => {
      await getPrisma(userId).$transaction(async (tx) => {
        await tx.issue.update({
          where: {
            id: issueId,
          },
          data: {
            assignedUserId,
          },
        })

        await tx.assignedActivity.upsert({
          where: {
            id:
              lastActivity.activityType === "AssigneeActivity"
                ? lastActivity.activityId
                : -1,
          },
          update: {
            assignedUsername,
            assignedUserImage,
          },
          create: {
            assignedUsername,
            assignedUserImage,
            userId,
            issueId,
          },
        })
        revalidateTag(`issue-${issueId}`)
      })
    },
  )

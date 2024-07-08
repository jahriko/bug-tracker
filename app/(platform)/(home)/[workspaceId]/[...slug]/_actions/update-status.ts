"use server"
import { getPrisma } from "@/lib/getPrisma"
import { authActionClient } from "@/lib/safe-action"
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
  .action(
    async ({
      parsedInput: { issueId, status, lastActivity },
      ctx: { userId, username },
    }) => {
      await getPrisma(userId).$transaction(async (tx) => {
        await tx.issue.update({
          where: {
            id: issueId,
          },
          data: {
            status: status,
          },
          select: {
            project: {
              select: {
                id: true,
                workspaceId: true,
              },
            },
          },
        })

        await tx.statusActivity.upsert({
          where: {
            id:
              lastActivity.activityType === "StatusActivity"
                ? lastActivity.activityId
                : -1,
          },
          update: {
            name: status,
          },
          create: {
            username,
            userId,
            issueId,
            name: status,
          },
        })
      })
    },
  )

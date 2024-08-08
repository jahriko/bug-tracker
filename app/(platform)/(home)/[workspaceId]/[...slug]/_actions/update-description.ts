"use server"
import { getPrisma } from "@/lib/getPrisma"
import { authActionClient } from "@/lib/safe-action"
import { revalidateTag } from "next/cache"
import { z } from "zod"

const schema = z.object({
  issueId: z.number(),
  description: z.string(),
  lastActivity: z.object({
    activityType: z.string(),
    activityId: z.number(),
  }),
})

export const updateDescription = authActionClient
  .schema(schema)
  .action(
    async ({ parsedInput: { issueId, description, lastActivity }, ctx: { userId } }) => {
      await getPrisma(userId).issue.update({
        where: {
          id: issueId,
        },
        data: {
          description,
        },
      })

      await getPrisma(userId).$transaction(async (tx) => {
        await tx.issue.update({
          where: {
            id: issueId,
          },
          data: {
            description,
          },
        })

        await tx.descriptionActivity.upsert({
          where: {
            id:
              lastActivity.activityType === "DescriptionActivity"
                ? lastActivity.activityId
                : -1,
          },
          update: {
            body: description,
          },
          create: {
            userId,
            issueId,
            body: description,
          },
        })

        console.log("Server action: Description updated!")

        revalidateTag(`issue-${issueId}`)
      })
    },
  )

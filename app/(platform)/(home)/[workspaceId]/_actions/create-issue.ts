"use server"

import { getPrisma } from "@/lib/getPrisma"
import { authActionClient } from "@/lib/safe-action"
import { IssueSchema } from "@/lib/validations"
import { revalidateTag } from "next/cache"

export const createIssue = authActionClient
  .schema(IssueSchema)
  .action(
    async ({
      parsedInput: { title, description, status, priority, assigneeId, labels, projectId },
      ctx: { userId },
    }) => {
      await getPrisma(userId).issue.create({
        data: {
          title,
          description,
          status,
          priority,
          assignedUserId: assigneeId ?? null,
          projectId,
          ownerId: userId,
          ...(labels && labels.length > 0
            ? {
                labels: {
                  create: labels.map((label) => ({ labelId: label.id })),
                },
              }
            : {}),
        },
      })

      revalidateTag("issue-list")

      return { success: true }
    },
  )

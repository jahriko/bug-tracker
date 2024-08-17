"use server"

import { getPrisma } from "@/lib/getPrisma"
import { authActionClient } from "@/lib/safe-action"
import { z } from "zod"

const discussionSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
  content: z.string().min(1, "Content is required"),
  projectId: z.number(),
  categoryId: z.number(),
  workspaceUrl: z.string(),
})

export const createDiscussion = authActionClient
  .schema(discussionSchema)
  .action(async ({ parsedInput: { title, content, projectId, categoryId, workspaceUrl }, ctx }) => {
    const prisma = getPrisma(ctx.userId)

    const getWorkspaceIdByUrl = await prisma.workspace.findUnique({
      where: {
        url: workspaceUrl,
      },
      select: {
        id: true,
      },
    })

    if (!getWorkspaceIdByUrl) {
      return {
        error: "Workspace not found",
      }
    }

    try {
      const newDiscussion = await prisma.discussion.create({
        data: {
          title,
          content,
          projectId,
          categoryId,
          workspaceId: getWorkspaceIdByUrl.id,
          authorId: ctx.userId,
        },
      })

      return {
        id: newDiscussion.id,
        title: newDiscussion.title,
      }
    } catch (error) {
      console.error("Error creating discussion:", error)
      throw new Error("Failed to create discussion. Please try again.")
    }
  })

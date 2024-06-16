"use server"
import { getCurrentUser } from "@/lib/get-current-user"
import prisma from "@/lib/prisma"
import { action } from "@/lib/safe-action"
import { IssueSchema } from "@/lib/validations"
import { revalidateTag } from "next/cache"
import { z } from "zod"

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  status: z.string(),
  priority: z.string().optional(),
  assigneeId: z.string().optional(),
  labels: z
    .array(z.object({ id: z.number(), name: z.string(), color: z.string() }))
    .optional(),
  projectName: z.string(),
})

export const createIssue = action(
  schema,
  async ({
    title,
    description,
    status,
    priority,
    labels,
    projectName,
    assigneeId,
  }) => {
    try {
      const userId = await getCurrentUser().then((user) => user.userId)

      if (!userId) {
        return {
          error: {
            message: "You must be logged in to create an issue",
          },
        }
      }

      const { id: projectId } = await prisma.project.findFirstOrThrow({
        where: {
          title: projectName,
        },
        select: {
          id: true,
        },
      })

      await prisma.issue.create({
        data: {
          title,
          description,
          status,
          priority: priority || "no-priority",
          assigneeId: assigneeId === undefined ? null : assigneeId,
          projectId,
          userId,
          issueLabels: {
            create: (labels || []).map((label) => ({ labelId: label.id })),
          },
        },
      })

      revalidateTag("issue-list")

      return {
        success: true,
      }
    } catch (error: unknown) {
      console.error("Error creating an issue: ", error)
      return {
        error: {
          message: "Something went wrong. Please try again.",
        },
      }
    }
  },
)

export async function deleteIssue(id: number) {
  try {
    await prisma.issue.delete({
      where: {
        id,
      },
    })
  } catch (error) {
    console.error(error)
  }
}

export async function updateIssue(issueId: number, data: IssueSchema) {
  try {
    const { title, status, priority, description, label } = data

    await prisma.issue.update({
      where: {
        id: issueId,
      },
      data: {
        title,
        status,
        priority,
        description,
        label: Array.from(label),
      },
    })
  } catch (error) {
    console.error(error)
  }
}

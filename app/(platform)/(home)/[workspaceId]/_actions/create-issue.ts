"use server"

import { getCurrentUser } from "@/lib/get-current-user"
import { getPrisma } from "@/lib/getPrisma"
import { IssueSchema } from "@/lib/validations"
import { revalidateTag } from "next/cache"

export async function createIssue(data: IssueSchema) {
  const { title, description, status, priority, labels, projectId, assigneeId } =
    IssueSchema.parse(data)

  try {
    const user = await getCurrentUser()

    if (!user) {
      throw new Error("User not authenticated.")
    }

    await getPrisma(user.userId).issue.create({
      data: {
        title,
        description,
        status,
        priority,
        assigneeId: assigneeId ?? null,
        projectId,
        userId: user.userId,
        issueLabels: {
          create: [...labels.map((label) => ({ labelId: label.id }))],
        },
      },
    })

    revalidateTag("issue-list")

    return {
      code: "success",
      message: "Issue created successfully",
    }
  } catch (error: unknown) {
    console.error("Error creating Issue: ", error)
    return {
      code: "error",
      message: "Error creating an issue",
    }
  }
}

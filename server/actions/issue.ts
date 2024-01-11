"use server"
import { revalidateTag } from "next/cache"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/get-current-user"
import { IssueSchema } from "@/lib/validations"

export async function createIssue(data: IssueSchema) {
  const {
    title,
    description,
    status,
    priority,
    labels,
    projectId,
    assigneeId,
  } = IssueSchema.parse(data)

  try {
    const user = await getCurrentUser()

    if (!user) {
      throw new Error("User not authenticated.")
    }

    await prisma.issue.create({
      data: {
        title,
        description,
        status,
        priority,
        assigneeId: assigneeId || null,
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

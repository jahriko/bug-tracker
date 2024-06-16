"use server"
import prisma from "@/lib/prisma"
import { revalidateTag } from "next/cache"

export async function updateIssueProject(issueId: number, projectId: string) {
  try {
    await prisma.issue.update({
      where: {
        id: issueId,
      },
      data: {
        projectId,
      },
    })

    revalidateTag("issue")

    return {
      code: "success",
      message: "Issue created successfully",
    }
  } catch (error) {
    console.error("Error updating project: ", error)
    return {
      code: "error",
      message: "Error updating project",
    }
  }
}

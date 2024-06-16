"use server"

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { revalidateTag } from "next/cache"
import prisma from "@/lib/prisma"

export async function updateAssignee(issueId: number, newAssigneeId: string) {
  try {
    await prisma.issue.update({
      where: { id: issueId },
      data: {
        assigneeId: newAssigneeId,
      },
    })

    revalidateTag("issue")

    return { code: "success", message: "Assignee updated successfully." }
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.error(e)
    }
    return { code: "error", message: "Error updating assignee." }
  }
}

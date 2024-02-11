"use server"

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { revalidateTag } from "next/cache"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/get-current-user"

export async function updatePriority(
  issueId: number,
  newPriority: string,
  oldPriority: string,
) {
  try {
    await prisma.issue.update({
      where: { id: issueId },
      data: {
        priority: newPriority,
      },
    })

    revalidateTag("issue")

    const user = await getCurrentUser()

    await prisma.issueActivity.create({
      data: {
        issueId,
        type: "priority",
        data: {
          old_value: oldPriority,
          new_value: newPriority,
        },
        changedById: user?.userId,
      },
    })

    return { code: "success", message: "Priority updated successfully." }
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.error(e)
    }
    return { code: "error", message: "Error updating priority." }
  }
}
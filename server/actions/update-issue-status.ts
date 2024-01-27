"use server"

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

export async function updateStatus(issueId: number, newStatus: string) {
  try {
    await prisma.issue.update({
      where: { id: issueId },
      data: {
        status: newStatus,
      },
    })

    revalidatePath(`/issues/${issueId}`)

    return { code: "success", message: "Issue updated successfully." }
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.error(e)
    }
    return { code: "error", message: "Error updating status." }
  }
}

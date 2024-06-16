"use server"

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { revalidateTag } from "next/cache"
import prisma from "@/lib/prisma"

export async function deleteIssueLabel(issueId: number, labelId: number) {
  try {
    await prisma.issueLabel.delete({
      where: { issueId_labelId: { issueId, labelId } },
    })

    revalidateTag("issue-labels")
    return { code: "success", message: "" }
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.error(e)
    }
    return { code: "error", message: "Error deleting label." }
  }
}

export async function addIssueLabel(issueId: number, labelId: number) {
  try {
    await prisma.issueLabel.create({
      data: {
        issueId,
        labelId,
      },
    })

    revalidateTag("issue-labels")
    return { code: "success", message: "" }
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.error(e)
    }
    return { code: "error", message: "Error adding label." }
  }
}

export async function updateIssueLabel(
  issueId: number,
  labelId: number,
  labelName: string,
) {
  try {
    await prisma.issueLabel.update({
      where: { issueId_labelId: { issueId, labelId } },
      data: {
        label: {
          update: {
            name: labelName,
          },
        },
      },
    })

    revalidateTag("issue-labels")
    return { code: "success", message: "" }
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.error(e)
    }
    return { code: "error", message: "Error updating label." }
  }
}

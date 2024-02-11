"use server"

import { z } from "zod"
import { revalidateTag } from "next/cache"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/get-current-user"

const FormSchema = z.object({
  comment: z.string(),
})

export async function createComment(
  issueId: number,
  data: z.infer<typeof FormSchema>,
) {
  const user = await getCurrentUser()
  const { comment } = FormSchema.parse(data)

  try {
    await prisma.issueComment.create({
      data: {
        text: comment,
        userId: user?.userId,
        issueId,
      },
    })

    revalidateTag("comments")

    return {
      code: "success",
    }
  } catch (error) {
    console.error(error)
    return {
      code: "error",
    }
  }
}
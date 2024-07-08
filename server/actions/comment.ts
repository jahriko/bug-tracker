"use server"

import { getCurrentUser } from "@/lib/get-current-user"
import prisma from "@/lib/prisma"
import { revalidateTag } from "next/cache"
import { z } from "zod"

const FormSchema = z.object({
  comment: z.string(),
})

export async function createComment(issueId: number, data: z.infer<typeof FormSchema>) {
  const user = await getCurrentUser()
  const { comment } = FormSchema.parse(data)

  try {
    await prisma.comment.create({
      data: {
        text: comment,
        userId: user?.userId,
        issueId,
      },
    })

    // I think it would be better to fake display the comment
    // then revalidate the comments cache when the user
    // navigates to another page.

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

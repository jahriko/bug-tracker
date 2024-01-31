"use server"

import { z } from "zod"
import { revalidatePath} from "next/cache"
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
    await prisma.comment.create({
      data: {
        text: comment,
        userId: user.userId,
        issueId,
      },
    })

    revalidatePath(`/issue/${issueId}`)

    return {
      code: "success",
      message: "Comment created successfully",
    }
  } catch (error) {
    console.log(error)
    return {
      code: "error",
      message: "Error creating comment",
    }
  }
}
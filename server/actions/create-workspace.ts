"use server"
import prisma from "@/lib/prisma"

export async function createWorkspace(workspaceName: string) {
  try {
    const createdWorkspace = await prisma.workspace.create({
      data: {
        name: workspaceName,
      },
    })

    return {
      workspaceId: createdWorkspace.id,
      code: "success",
      message: "Workspace created",
    }
  } catch (error) {
    console.error(error)
    return {
      code: "error",
      message: "Error creating workspace",
    }
  }
}

import { PromiseReturnType } from "@prisma/client"
import prisma from "@/lib/prisma"

export async function getProjects() {
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      title: true,
    },
  })

  return projects
}
export type ProjectsData = Prisma.PromiseReturnType<typeof getProjects>

export type ProjectsData = PromiseReturnType<typeof getProjects>
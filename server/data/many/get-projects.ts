import { Prisma } from "@prisma/client"
import prisma from "@/lib/prisma"

export async function getProjects() {
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      title: true,
      _count: {
        select: { issues: true },
      },
    },
  })

  return projects
}

export type ProjectsData = Prisma.PromiseReturnType<typeof getProjects>

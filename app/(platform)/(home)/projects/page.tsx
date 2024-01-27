import prisma from "@/lib/prisma"
import ProjectList from "./project-list"

function getProjects() {
  return prisma.project.findMany()
}

export default async function Projects() {
  const projects = await getProjects()

  return <ProjectList data={projects} />
}

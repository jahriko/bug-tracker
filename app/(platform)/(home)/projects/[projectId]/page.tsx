import { promises as fs } from "fs"
import path from "path"
import prisma from "@/lib/prisma"
import { z } from "zod"
import { columns } from "../../_components/columns"
import { DataTable } from "../../_components/data-table"
import { taskSchema } from "../../_data/schema"

async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "app/(platform)/(home)/_data/tasks.json"),
  )

  const tasks = JSON.parse(data.toString())

  return z.array(taskSchema).parse(tasks)
}

async function getIssues(projectId: string) {
  return prisma.issue.findMany({
    where: {
      projectId,
    },
  })
}

export default async function ProjectId({
  params,
}: {
  params: { projectId: string }
}) {
  const projectId = params.projectId
  const tasks = await getTasks()
  const issues = await getIssues(projectId)

  return (
    <>
      <div className="py-6">
        <main>
          <div className="mx-auto max-w-full sm:px-6 lg:max-w-[1300px] lg:px-8">
            <DataTable data={issues} columns={columns} projectId={projectId} />
          </div>
        </main>
      </div>
    </>
  )
}

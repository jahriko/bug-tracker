import prisma from "@/lib/prisma"
import { columns } from "@/components/DataTable/columns"
import { DataTable } from "@/components/DataTable/data-table"

async function getIssues(projectId: string) {
  const issues = await prisma.issue.findMany({
    where: {
      projectId,
    },
  })

  return issues
}

export default async function Issues({
  params,
}: {
  params: { projectId: string }
}) {
  const projectId = params.projectId
  const issues = await getIssues(projectId)

  return (
    <div className="py-6">
      <main>
        <DataTable columns={columns} data={issues} />
      </main>
    </div>
  )
}

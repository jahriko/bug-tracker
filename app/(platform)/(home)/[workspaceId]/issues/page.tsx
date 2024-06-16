
import { columns } from "@/components/DataTable/columns"
import { DataTable } from "@/components/DataTable/data-table"
import { Input } from "@/components/ui/input"
import { NewIssueButton } from "@/components/NewIssueButton"
import { getIssues } from "@/server/data/many/get-issues"

export default async function IssuesPage() {
  const issues = await getIssues()

  return (
    <div className="py-6">
      <main className="container">
        <div>
          <div className="flex items-center gap-x-6">
            <Input className="h-8" />
            <NewIssueButton />
          </div>
          <DataTable columns={columns} data={issues} />
        </div>
      </main>
    </div>
  )
}

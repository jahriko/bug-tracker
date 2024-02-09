// eslint-disable-next-line camelcase
import { unstable_cache } from "next/cache"
import prisma from "@/lib/prisma"
import { columns } from "@/components/DataTable/columns"
import { DataTable } from "@/components/DataTable/data-table"

const getCachedIssueList = unstable_cache(async () => {
  const issueList = await prisma.issue.findMany({
    select: {
      id: true,
      title: true,
      status: true,
      label: true,
      priority: true,
      project: {
        select: {
          title: true,
        },
      },
    },
  })
  return issueList
}, ["issue-list"])

export default async function InboxPage() {
  const issueList = await getCachedIssueList()

  return (
    <div className="py-6">
      <main>
        <div>
          <DataTable columns={columns} data={issueList} />
        </div>
      </main>
    </div>
  )
}

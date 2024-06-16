import { Badge, BadgeProps } from "@/components/catalyst/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/catalyst/table"
import prisma from "@/lib/prisma"
import { getIssuesById } from "@/server/data/many/get-issues-by-id"
import { getLabels } from "@/server/data/many/get-labels"
import { getUsers } from "@/server/data/many/get-users"
import { Prisma } from "@prisma/client"
import {
  Ban,
  CheckCircle2,
  CircleDashed,
  CircleDot,
  CircleHelp,
  Loader2,
  PauseCircle,
} from "lucide-react"
import { DateTime } from "luxon"
import { notFound } from "next/navigation"
import NewIssueDialog from "./new-issue-dialog"

export const dynamic = "force-dynamic"

function renderStatus(status: string) {
  switch (status) {
    case "backlog":
      return <CircleDashed className="size-4" />
    case "active":
      return <CircleDot className="size-4" />
    case "in-progress":
      return <Loader2 className="size-4" />
    case "done":
      return <CheckCircle2 className="size-4" />
    case "paused":
      return <PauseCircle className="size-4" />
    case "canceled":
      return <Ban className="size-4" />
    default:
      return <CircleHelp className="size-4 text-zinc-500" />
  }
}

export default async function ProjectPage({
  params,
}: {
  params: { projectId: string }
}) {
  // Check if the project exists
  try {
    await prisma.project.findFirstOrThrow({
      where: {
        title: params.projectId,
      },
    })
  } catch (error) {
    switch (true) {
      case error instanceof Prisma.PrismaClientKnownRequestError:
        notFound()
      default:
        console.error("Unexpected Error: ", error)
    }
  }

  const decodedProjectParams = decodeURIComponent(params.projectId)
  const labels = await getLabels()

  const [issues, assignees] = await Promise.all([
    getIssuesById(decodedProjectParams),
    getUsers(),
  ])

  return (
    <div className="py-6">
      <main className="container">
        <div>
          <div className="flex items-center gap-x-6">
            <NewIssueDialog assignees={assignees} labels={labels} />
          </div>
          <Table>
            <TableBody>
              {issues.map((issue) => (
                <TableRow key={issue.id} href="#">
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-x-2">
                          <div>{renderStatus(issue.status)}</div>
                          <div className="flex gap-x-3">
                            <div className="font-medium">{issue.title}</div>
                            <span className="flex gap-x-1">
                              {issue.issueLabels.map((issueLabel) => (
                                <Badge
                                  color={
                                    (issueLabel.label
                                      .color as BadgeProps["color"]) || "zinc"
                                  }
                                  key={issueLabel.label.id}
                                >
                                  {issueLabel.label.name}
                                </Badge>
                              ))}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-zinc-500">
                          <a href="#" className="hover:text-zinc-700">
                            #{issue.id} opened{" "}
                            {DateTime.fromJSDate(issue.createdAt).toRelative()}{" "}
                            by {issue.user.name}
                          </a>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  )
}

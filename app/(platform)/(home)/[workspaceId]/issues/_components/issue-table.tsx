"use client"

import { Checkbox } from "@/components/catalyst/checkbox"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/catalyst/table"
import { COLORS } from "@/lib/colors"
import { classNames } from "@/lib/utils"
import { ChevronDownIcon } from "@heroicons/react/16/solid"
import { Ban, CheckCircle2, CircleDashed, CircleHelp, Loader2 } from "lucide-react"
import { DateTime } from "luxon"
import Link from "next/link"
import { useCallback, useLayoutEffect, useRef, useState } from "react"

export default function IssueTable({ issues, workspaceId }: { issues: any[]; workspaceId: string }) {
  const checkbox = useRef<HTMLInputElement>(null)
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [selectedIssues, setSelectedIssues] = useState<any[]>([])

  useLayoutEffect(() => {
    const isIndeterminate = selectedIssues.length > 0 && selectedIssues.length < issues.length
    setChecked(selectedIssues.length === issues.length)
    setIndeterminate(isIndeterminate)
    if (checkbox.current) {
      checkbox.current.indeterminate = isIndeterminate
    }
  }, [selectedIssues, issues])

  function toggleAll() {
    setSelectedIssues(checked || indeterminate ? [] : issues)
    setChecked(!checked && !indeterminate)
    setIndeterminate(false)
  }

  const handleBulkAction = (action: string) => {
    // Implement bulk action logic here
    console.log(`Bulk ${action} for issues:`, selectedIssues)
  }

  const toggleIssue = useCallback((issue: any) => {
    setSelectedIssues((prev) => (prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]))
  }, [])

  return (
    <Table className="mt-2 [--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
      <TableHead>
        <TableRow>
          <TableCell>
            <Checkbox checked={checked} indeterminate={indeterminate} onChange={toggleAll} ref={checkbox} />
          </TableCell>
          <TableCell className="h-14">
            {selectedIssues.length > 0 && (
              <div className="flex items-center gap-x-6">
                <button
                  className="flex items-center gap-1 text-xs font-semibold text-gray-900"
                  onClick={() => {
                    handleBulkAction("status")
                  }}
                >
                  Status
                  <ChevronDownIcon className="size-4" />
                </button>
                <button
                  className="flex items-center gap-1 text-xs font-semibold text-gray-900"
                  onClick={() => {
                    handleBulkAction("assign")
                  }}
                >
                  Assign
                  <ChevronDownIcon className="size-4" />
                </button>
                <button
                  className="flex items-center gap-1 text-xs font-semibold text-gray-900"
                  onClick={() => {
                    handleBulkAction("priority")
                  }}
                >
                  Priority
                  <ChevronDownIcon className="size-4" />
                </button>
              </div>
            )}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {issues.map((issue) => (
          <TableRow key={issue.id}>
            <TableCell>
              <Checkbox
                checked={selectedIssues.includes(issue)}
                onChange={() => {
                  toggleIssue(issue)
                }}
              />
            </TableCell>
            <TableCell>
              <div className="flex items-start gap-x-2">
                {/* Dropdown Column */}
                <div className="flex-shrink-0 pt-1">{renderStatus(issue.status)}</div>

                {/* Content Column */}
                <div className="min-w-0 flex-grow">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <Link
                      className="text-wrap font-medium hover:text-blue-700"
                      href={`/${workspaceId}/issue/${issue.project.identifier}-${issue.id}`}
                    >
                      {issue.title}
                    </Link>
                    {issue.labels.map((label) => (
                      <span
                        className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-2xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200"
                        key={label.label.id}
                      >
                        <div
                          className={classNames(
                            COLORS[label.label.color] || "bg-zinc-100",
                            "flex-none rounded-full p-1",
                          )}
                        >
                          <div className="size-2 rounded-full bg-current" />
                        </div>
                        {label.label.name}
                      </span>
                    ))}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">
                    <span className="hover:text-zinc-700">
                      {issue.project.identifier}-{issue.id} opened {DateTime.fromJSDate(issue.createdAt).toRelative()}{" "}
                      by {issue.owner?.name}
                    </span>
                  </div>
                </div>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function renderStatus(status: Status) {
  switch (status) {
    case "BACKLOG":
      return <CircleDashed className="size-[1.10rem] text-zinc-500" />
    case "IN_PROGRESS":
      return <Loader2 className="size-[1.10rem] text-yellow-700" />
    case "DONE":
      return <CheckCircle2 className="size-[1.10rem] text-indigo-700" />
    case "CANCELLED":
      return <Ban className="size-[1.10rem] text-zinc-500" />
    default:
      return <CircleHelp className="size-[1.10rem] text-zinc-500" />
  }
}

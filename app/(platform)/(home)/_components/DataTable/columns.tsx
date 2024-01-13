"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"
import { IssueSchema } from "@/types"
// import { statuses } from "../_data/data"
// import { Task } from "../_data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
]

export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "todo",
    label: "Todo",
    icon: CircleIcon,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: StopwatchIcon,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircledIcon,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: CrossCircledIcon,
  },
]

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
]

interface Issue {
  id: string
  title: string
  status: string
  label: string[]
  project: { title: string }
  projectId: string
}

export const columns: ColumnDef<Issue>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const { title } = row.original.project ?? { title: "" }

      return (
        <>
          <Link
            className="space-x-2"
            href={`/projects/${row.original.projectId}/issues/${row.original.id}`}
          >
            <span className="max-w-3xl cursor-pointer truncate text-sm font-medium hover:text-indigo-600">
              {row.getValue("title")}
            </span>
            <span className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
              {row.original.label.map((label) => (
                <span key={label}>{label}</span>
              ))}
              {/* {row.original.label.charAt(0).toUpperCase() +
                row.original.label.slice(1)} */}
            </span>
          </Link>
          <div className="text-xs text-gray-400">
            {title ? title.substring(0, 4).toUpperCase() + "-" : "#"}
            {row.original.id}
          </div>
        </>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status"),
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon ? (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          ) : null}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
]

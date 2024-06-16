"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { DateTime } from "luxon"
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
// import { statuses } from "../_data/data"
// import { Task } from "../_data/schema"
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline"
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip"
import { convertHexToRGBA, darkenColor } from "@/lib/utils"
import { DataTableRowActions } from "@/components/DataTable/data-table-row-actions"
import { IssuesData } from "@/server/data/many/get-issues"
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

export const columns: ColumnDef<IssuesData[number]>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.original.status,
      )

      if (!status) {
        return null
      }

      const issueLabels = row.original.issueLabels.map((item) => ({
        id: item.label.id,
        name: item.label.name,
        color: item.label.color,
      }))

      return (
        <div className="flex flex-col gap-y-1.5">
          <Link
            className="flex items-center space-x-2"
            href={`/projects/${row.original.project.id}/issues/${row.original.id}`}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <status.icon className="inline-block size-5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent align="center">
                  <span className="text-xs">{status.label}</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="cursor-pointer truncate text-sm font-medium hover:text-indigo-600">
              {row.original.title}
            </span>

            <span className="text-xs text-gray-400">
              {row.original.project.title
                ? row.original.project.title.substring(0, 4).toUpperCase() + "-"
                : "#"}
              {row.original.id}
            </span>
          </Link>

          <div>
            <ul className="flex gap-x-1.5">
              {issueLabels.map((label) => (
                <li key={label.id}>
                  <span
                    className="inline-flex items-center gap-x-1.5 rounded-lg px-1.5 py-0.5 text-xs font-medium text-gray-900 ring-inset"
                    style={{
                      backgroundColor: convertHexToRGBA(label.color, 0.1),
                      color: darkenColor(label.color, 40),
                      boxShadow: `0 0 0 1px ${convertHexToRGBA(
                        label.color,
                        0.3,
                      )}`,
                    }}
                  >
                    <svg
                      aria-hidden="true"
                      className="size-1.5"
                      fill={label.color}
                      viewBox="0 0 6 6"
                    >
                      <circle cx={3} cy={3} r={3} />
                    </svg>
                    {label.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: " ",
    cell: ({ row }) => {
      const reporter = row.original.user
      console.log(row.original.createdAt)

      return (
        <div className="flex flex-col items-end gap-y-1.5 text-xs">
          <div className="flex gap-x-4">
            <div className="flex gap-x-1">
              <ChatBubbleLeftIcon className="size-4 text-gray-300" />5
            </div>
            <div className="flex gap-x-1">
              {/* <TimerIcon className="size-4 text-gray-300" /> */}
              {DateTime.fromJSDate(row.original.createdAt).toFormat("dd LLL")}
            </div>
          </div>
        </div>
      )
    },
    // filterFn: (row, id, value) => {
    //   return value.includes(row.getValue(id))
    // },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
  // {
  //   accessorKey: "status",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Status" />
  //   ),
  //   cell: ({ row }) => {
  //     const status = statuses.find(
  //       (status) => status.value === row.getValue("status"),
  //     )
  //
  //     if (!status) {
  //       return null
  //     }
  //
  //     return (
  //       <div className="flex w-[100px] items-center">
  //         {status.icon ? (
  //           <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
  //         ) : null}
  //         <span>{status.label}</span>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
]

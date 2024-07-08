/* eslint-disable @typescript-eslint/no-misused-promises */
"use client"
import { Avatar } from "@/components/catalyst/avatar"
import { Ban, CircleDot, SignalHigh, SignalLow, SignalMedium } from "lucide-react"
import { useMemo } from "react"
import { updatePriority } from "../_actions/update-priority"
import { updateStatus } from "../_actions/update-status"
import { CustomListbox, CustomListboxOption } from "./custom-listbox"
// https://stackoverflow.com/questions/63466463/how-to-submit-react-form-fields-on-onchange-rather-than-on-submit-using-react-ho

export type Status = "BACKLOG" | "IN_PROGRESS" | "DONE" | "CANCELLED"
export type Priority = "NO_PRIORITY" | "LOW" | "MEDIUM" | "HIGH"
export type Assignee = "eduardo" | "hilary"

interface PropertyProps<T> {
  issueId: number
  value: T
  lastActivity: {
    activityType:
      | "StatusActivity"
      | "PriorityActivity"
      | "TitleActivity"
      | "DescriptionActivity"
      | "AssigneeActivity"
      | "LabelActivity"
      | "CommentActivity"
      | "None"
    activityId: number
  }
}

const handleServerError = (error: Error) => {
  console.error(error)
  // You could add user-facing error handling here, e.g., toast notification
}

export function StatusProperty({ issueId, value }: PropertyProps<Status>) {
  const handleChange = async (status: Status) => {
    try {
      const result = await updateStatus({ issueId, status })
      if (result.serverError) {
        handleServerError(result.serverError)
      }
    } catch (error) {
      handleServerError(error as Error)
    }
  }

  const options = useMemo(
    () => [
      {
        value: "BACKLOG",
        icon: <CircleDot aria-hidden="true" className="size-[1.10rem] text-green-700" />,
        label: "Todo",
      },
      {
        value: "IN_PROGRESS",
        icon: <CircleDot aria-hidden="true" className="size-[1.10rem] text-yellow-700" />,
        label: "In Progress",
      },
      {
        value: "DONE",
        icon: <CircleDot aria-hidden="true" className="size-[1.10rem] text-green-700" />,
        label: "Done",
      },
      {
        value: "CANCELLED",
        icon: <Ban aria-hidden="true" className="size-[1.10rem] text-red-700" />,
        label: "Cancelled",
      },
    ],
    [],
  )

  return (
    <CustomListbox aria-label="Status" onChange={handleChange} value={value}>
      {options.map(({ value, icon, label }) => (
        <CustomListboxOption key={value} value={value}>
          <div className="flex items-center space-x-2">
            {icon}
            <span className="font-medium">{label}</span>
          </div>
        </CustomListboxOption>
      ))}
    </CustomListbox>
  )
}

export function PriorityProperty({
  issueId,
  value,
  lastActivity,
}: PropertyProps<Priority>) {
  const handleChange = async (priority: Priority) => {
    try {
      const result = await updatePriority({
        issueId,
        priority,
        lastActivity,
      })
      if (result.serverError) {
        handleServerError(result?.serverError)
      }
    } catch (error) {
      handleServerError(error as Error)
    }
  }

  const options = useMemo(
    () => [
      {
        value: "NO_PRIORITY",
        icon: <SignalHigh aria-hidden="true" className="size-[1.10rem] text-red-700" />,
        label: "No Priority",
      },
      {
        value: "HIGH",
        icon: <SignalHigh aria-hidden="true" className="size-[1.10rem] text-red-700" />,
        label: "High",
      },
      {
        value: "MEDIUM",
        icon: (
          <SignalMedium aria-hidden="true" className="size-[1.10rem] text-yellow-700" />
        ),
        label: "Medium",
      },
      {
        value: "LOW",
        icon: <SignalLow aria-hidden="true" className="size-[1.10rem] text-green-700" />,
        label: "Low",
      },
    ],
    [],
  )

  return (
    <CustomListbox aria-label="Priority" onChange={handleChange} value={value}>
      {options.map(({ value, icon, label }) => (
        <CustomListboxOption key={value} value={value}>
          <div className="flex items-center space-x-2">
            {icon}
            <span className="font-medium">{label}</span>
          </div>
        </CustomListboxOption>
      ))}
    </CustomListbox>
  )
}

export function AssigneeProperty({ value }: Omit<PropertyProps<Assignee>, "issueId">) {
  const handleChange = async (assigneeId: Assignee) => {
    // Implement assignee change logic here
    console.log("Assignee changed to:", assigneeId)
  }

  const options = useMemo(
    () => [
      {
        value: "eduardo",
        avatar: (
          <Avatar
            aria-hidden="true"
            className="size-5"
            src="https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
          />
        ),
        label: "Eduardo Benz",
      },
      {
        value: "hilary",
        avatar: (
          <Avatar
            aria-hidden="true"
            className="size-5"
            src="https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
          />
        ),
        label: "Hilary Mahy",
      },
    ],
    [],
  )

  return (
    <CustomListbox
      aria-label="Assignee"
      onChange={handleChange}
      value={value || "eduardo"}
    >
      {options.map(({ value, avatar, label }) => (
        <CustomListboxOption key={value} value={value}>
          <div className="flex items-center space-x-2">
            {avatar}
            <span className="font-medium">{label}</span>
          </div>
        </CustomListboxOption>
      ))}
    </CustomListbox>
  )
}

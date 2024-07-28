/* eslint-disable @typescript-eslint/no-misused-promises */
"use client"
import { Avatar } from "@/components/catalyst/avatar"
import Editor from "@/components/lexical_editor/editor"
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown"
import { EditorState } from "lexical"
import {
  Ban,
  CheckCircle2,
  CircleDashed,
  Loader2,
  SignalHigh,
  SignalLow,
  SignalMedium,
} from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { debounce } from "radash"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { updateDescription } from "../_actions/update-description"
import { updatePriority } from "../_actions/update-priority"
import { updateStatus } from "../_actions/update-status"
import { CustomListbox, CustomListboxOption } from "./custom-listbox"
// https://stackoverflow.com/questions/63466463/how-to-submit-react-form-fields-on-onchange-rather-than-on-submit-using-react-ho

export type Status = "BACKLOG" | "IN_PROGRESS" | "DONE" | "CANCELLED"
export type Priority = "NO_PRIORITY" | "LOW" | "MEDIUM" | "HIGH"
export type Assignee = "eduardo" | "hilary"

interface PropertyProps<T> {
  issueId: number
  value: string | null
  lastActivity: {
    activityType:
      | "StatusActivity"
      | "PriorityActivity"
      | "TitleActivity"
      | "DescriptionActivity"
      | "AssignedActivity"
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

export function StatusProperty({ issueId, value, lastActivity }: PropertyProps<Status>) {
  const handleChange = async (status: Status) => {
    try {
      const result = await updateStatus({ issueId, status, lastActivity })
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
        icon: <CircleDashed className="size-[1.10rem] text-zinc-500" />,
        label: "Backlog",
      },
      {
        value: "IN_PROGRESS",
        icon: <Loader2 className="size-[1.10rem] text-yellow-700 hover:text-black" />,
        label: "In Progress",
      },
      {
        value: "DONE",
        icon: (
          <CheckCircle2 className="size-[1.10rem] text-indigo-700 hover:text-black" />
        ),
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

export function DescriptionField({
  issueId,
  value,
  lastActivity,
}: PropertyProps<string>) {
  const [description, setDescription] = useState(value ?? "")
  const debouncedUpdateRef = useRef<ReturnType<typeof debounce>>()
  const { execute, result } = useAction(updateDescription)

  const updateFunc = useCallback(
    (currentDescription: string) => {
      try {
        console.log("Debounce update description: ", currentDescription)
        execute({
          issueId,
          description: currentDescription,
          lastActivity,
        })

        if (result.serverError) {
          console.log("Server error: ", result.serverError)
        }
      } catch (error) {
        handleServerError(error as Error)
      }
    },
    [issueId, lastActivity, result.serverError, execute],
  )

  useEffect(() => {
    debouncedUpdateRef.current = debounce({ delay: 1000 }, updateFunc)
    return () => {
      debouncedUpdateRef.current?.cancel()
    }
  }, [updateFunc])

  const handleChange = useCallback((editorState: EditorState) => {
    editorState.read(() => {
      const newDescription = $convertToMarkdownString(TRANSFORMERS)
      setDescription(newDescription)
      if (debouncedUpdateRef.current) {
        debouncedUpdateRef.current(newDescription)
      }
    })
  }, [])

  return <Editor initialContent={description} onChange={handleChange} />
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

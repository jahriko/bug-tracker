/* eslint-disable @typescript-eslint/no-misused-promises */
"use client"
import { Avatar } from "@/components/catalyst/avatar"
import { Button } from "@/components/catalyst/button"
import { Field } from "@/components/catalyst/fieldset"
import { MdiSignalCellular1, MdiSignalCellular2, MdiSignalCellular3, TablerLineDashed } from "@/components/icons"
import Editor from "@/components/lexical_editor/editor"
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown"
import { EditorState } from "lexical"
import { Ban, CheckCircle2, CircleDashed, Loader2, UserPlus } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { debounce } from "radash"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { addComment } from "../_actions/add-comment"
import { updateAssignee } from "../_actions/update-assignee"
import { updateDescription } from "../_actions/update-description"
import { updatePriority } from "../_actions/update-priority"
import { updateStatus } from "../_actions/update-status"
import { CustomListbox, CustomListboxOption } from "./custom-listbox"
// https://stackoverflow.com/questions/63466463/how-to-submit-react-form-fields-on-onchange-rather-than-on-submit-using-react-ho
import * as Headless from "@headlessui/react"
import { Square3Stack3DIcon } from "@heroicons/react/16/solid"
import { Project } from "@prisma/client"

export type Status = "BACKLOG" | "IN_PROGRESS" | "DONE" | "CANCELLED"
export type Priority = "NO_PRIORITY" | "LOW" | "MEDIUM" | "HIGH"
export interface AssignedUser {
  id: string
  name: string
  image: string | null
}

interface PropertyProps<T> {
  issueId: number
  value?: T | null
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
  const { execute, result } = useAction(updateStatus)
  const handleChange = (status: Status) => {
    try {
      execute({ issueId, status, lastActivity })
      if (result.serverError) {
        console.log("Server error: ", result.serverError)
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
        icon: <CheckCircle2 className="size-[1.10rem] text-indigo-700 hover:text-black" />,
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
    <Field>
      <Headless.Label className="select-none text-xs font-medium text-zinc-400">Status</Headless.Label>
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
    </Field>
  )
}

export function DescriptionField({ issueId, value, lastActivity }: PropertyProps<string>) {
  const [description, setDescription] = useState(value ?? "")
  const debouncedUpdateRef = useRef<ReturnType<typeof debounce>>()
  const { execute, result } = useAction(updateDescription)

  const updateFunc = useCallback(
    (currentDescription: string) => {
      try {
        execute({
          issueId,
          description: currentDescription,
          lastActivity,
        })

        if (result.serverError) {
          console.error("Server error: ", result.serverError)
        }
      } catch (error) {
        handleServerError(error as Error)
      }
    },
    [issueId, lastActivity, result.serverError, execute],
  )

  useEffect(() => {
    debouncedUpdateRef.current = debounce({ delay: 1500 }, updateFunc)
    return () => {
      debouncedUpdateRef.current?.cancel()
    }
  }, [updateFunc])

  const handleChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        const newDescription = $convertToMarkdownString(TRANSFORMERS)
        setDescription(newDescription)
        if (debouncedUpdateRef.current && newDescription !== value) {
          debouncedUpdateRef.current(newDescription)
        }
      })
    },
    [value],
  )

  return <Editor initialContent={description} onChange={handleChange} placeholderText="Describe the issue..." />
}
export function PriorityProperty({ issueId, value, lastActivity }: PropertyProps<Priority>) {
  const { execute, result } = useAction(updatePriority)
  const handleChange = (priority: Priority) => {
    try {
      execute({
        issueId,
        priority,
        lastActivity,
      })

      if (result.serverError) {
        console.error(result.serverError)
      }
    } catch (error) {
      handleServerError(error as Error)
    }
  }

  const options = useMemo(
    () => [
      {
        priorityName: "NO_PRIORITY",
        icon: <TablerLineDashed aria-hidden="true" className="size-[1.10rem] text-zinc-700" />,
        label: "No Priority",
      },
      {
        priorityName: "HIGH",
        icon: <MdiSignalCellular3 aria-hidden="true" className="size-[1.10rem] text-zinc-700" />,
        label: "High",
      },
      {
        priorityName: "MEDIUM",
        icon: <MdiSignalCellular2 aria-hidden="true" className="size-[1.10rem] text-zinc-700" />,
        label: "Medium",
      },
      {
        priorityName: "LOW",
        icon: <MdiSignalCellular1 aria-hidden="true" className="size-[1.10rem] text-zinc-700" />,
        label: "Low",
      },
    ],
    [],
  )

  return (
    <Field>
      <Headless.Label className="select-none text-xs font-medium text-zinc-400">Priority</Headless.Label>
      <CustomListbox
        aria-label="Priority"
        onChange={handleChange}
        {...(value && { value })}
        placeholder={
          <div className="flex items-center gap-x-2">
            <TablerLineDashed className="size-4 flex-shrink-0" />
            Set priority
          </div>
        }
      >
        {options.map(({ priorityName, icon, label }) => (
          <CustomListboxOption key={priorityName} value={priorityName}>
            <div className="flex items-center space-x-2">
              {icon}
              <span className="font-medium">{label}</span>
            </div>
          </CustomListboxOption>
        ))}
      </CustomListbox>
    </Field>
  )
}

export function AssigneeProperty({
  issueId,
  value,
  projectMembers,
  lastActivity,
}: PropertyProps<string> & {
  projectMembers: {
    user: {
      id: string
      name: string
      image: string | null
    }
  }[]
}) {
  const { execute, result } = useAction(updateAssignee)
  const handleChange = ({
    user: { id, name, image },
  }: {
    user: {
      id: string
      name: string
      image: string
    }
  }) => {
    execute({
      issueId,
      assignedUserId: id,
      assignedUsername: name,
      assignedUserImage: image,
      lastActivity,
    })
    if (result.serverError) {
      console.error("Server Error: ", result.serverError)
    }
  }

  const findUserById = (id: string) => {
    return projectMembers.find(({ user }) => user.id === id)
  }

  return (
    <Field>
      <Headless.Label className="select-none text-xs font-medium text-zinc-400">Assigned to</Headless.Label>
      <CustomListbox
        aria-label="AssignedUser"
        onChange={handleChange}
        placeholder={
          <div className="flex items-center gap-x-2">
            <UserPlus className="size-4 flex-shrink-0" />
            Assign
          </div>
        }
        value={value ? findUserById(value) : undefined}
      >
        {projectMembers.map(({ user: { id, name, image } }) => (
          <CustomListboxOption key={id} value={findUserById(id)}>
            <div className="flex items-center space-x-2">
              <Avatar className="size-4" src={image} />
              <span className="font-medium">{name}</span>
            </div>
          </CustomListboxOption>
        ))}
      </CustomListbox>
    </Field>
  )
}

export function AddComment({ issueId, lastActivity }: PropertyProps<string>) {
  const [comment, setComment] = useState("")
  const { execute, result } = useAction(addComment)

  const handleChange = useCallback((editorState: EditorState) => {
    editorState.read(() => {
      const comment = $convertToMarkdownString(TRANSFORMERS)
      setComment(comment)
    })
  }, [])

  return (
    <>
      <Editor onChange={handleChange} placeholderText="Write a comment" type="commentBox" withBorder />
      <div className="mt-6 flex items-center justify-end">
        <Button
          onClick={() => {
            execute({ commentBody: comment, issueId, lastActivity })

            if (result.serverError) {
              console.error("Server error: ", result.serverError)
            }
          }}
        >
          Comment
        </Button>
      </div>
    </>
  )
}

export function ProjectProperty({
  issueId,
  value,
  lastActivity,
  projects,
}: PropertyProps<string> & { projects: Project[] }) {
  // const { execute, result } = useAction(updateProject)
  const handleChange = (project: Project) => {
    console.log(project)
  }
  return (
    <Field>
      <Headless.Label className="select-none text-xs font-medium text-zinc-400">Project</Headless.Label>
      <CustomListbox
        aria-label="Project"
        onChange={handleChange}
        placeholder={
          <div className="flex items-center gap-x-2">
            <Square3Stack3DIcon className="size-4 flex-shrink-0" />
            Project
          </div>
        }
        value={value}
      >
        {projects.map(({ id, title }) => (
          <CustomListboxOption key={id} value={id}>
            <div className="flex items-center space-x-2">
              <span className="font-medium">{title}</span>
            </div>
          </CustomListboxOption>
        ))}
      </CustomListbox>
    </Field>
  )
}

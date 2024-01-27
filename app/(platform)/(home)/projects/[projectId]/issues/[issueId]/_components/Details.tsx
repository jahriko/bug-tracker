"use client"
/* eslint-disable no-nested-ternary */
/* eslint-disable @next/next/no-img-element */
import {
  ArrowUpCircle,
  CheckCircle2,
  Circle,
  HelpCircle,
  LucideIcon,
  MinusCircle,
  SignalLow,
  SignalMedium,
  SignalHigh,
  XCircle,
  Plus,
} from "lucide-react"
import { useEffect, useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { ProjectIdAndTitle, Users } from "@/app/(platform)/(home)/layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UsersData } from "@/server/data/get-users"
import { ProjectsData } from "@/server/data/get-project"
import { updateStatus } from "@/server/actions/update-issue-status"
import { FormField, Form, FormControl, FormItem } from "@/components/ui/form"
import { Issue, IssueLabel } from "../page"

interface Status {
  value: string
  label: string
  icon: LucideIcon
}

const statuses: Status[] = [
  {
    value: "backlog",
    label: "Backlog",
    icon: HelpCircle,
  },
  {
    value: "todo",
    label: "Todo",
    icon: Circle,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: ArrowUpCircle,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircle2,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: XCircle,
  },
]

const StatusSchema = z.object({
  status: z.string(),
})

export function UpdateStatusBox({
  status,
  issueId,
}: {
  status: string | undefined
  issueId: string
}) {
  const { handleSubmit, watch, ...form } = useForm<
    z.infer<typeof StatusSchema>
  >({
    resolver: zodResolver(StatusSchema),
    mode: "onChange",
  })

  const getIssueStatus = statuses.find((s) => s.value === status) ?? null

  async function onSubmit(data: z.infer<typeof StatusSchema>) {
    const { status } = data
    console.log("here: ", status)

    const result = await updateStatus(Number(issueId), status)

    if (result.code === "error") {
      toast("Something went wrong", {
        description: result.message,
      })
    }

    return toast("Changed status", {
      action: {
        label: "Undo",
        onClick: () => {
          console.log("Undo")
        },
      },
    })
  }

  // https://stackoverflow.com/questions/63466463/how-to-submit-react-form-fields-on-onchange-rather-than-on-submit-using-react-ho
  useEffect(() => {
    const subscription = watch(() => handleSubmit(onSubmit)())
    return () => {
      subscription.unsubscribe()
    }
  }, [handleSubmit, watch])

  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Status | null>(getIssueStatus)

  function StatusIcon({ status }: { status: string | undefined }) {
    if (status === "backlog") {
      return <HelpCircle className="mr-2 size-4" />
    } else if (status === "todo") {
      return <Circle className="mr-2 size-4" />
    } else if (status === "in progress") {
      return <ArrowUpCircle className="mr-2 size-4" />
    } else if (status === "done") {
      return <CheckCircle2 className="mr-2 size-4" />
    } else if (status === "canceled") {
      return <XCircle className="mr-2 size-4" />
    }
  }

  return (
    <Form {...form} key="status-update-form">
      <form
        id="updateStatus"
        // key="status-update-form"
        onSubmit={handleSubmit(onSubmit, (errors) => {
          console.log("error form eeeeeeeee")
          console.error(errors)
        })}
      >
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <Popover onOpenChange={setOpen} open={open}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      className="-ml-2.5 w-[10rem] justify-start"
                      variant="ghost"
                    >
                      {selected ? (
                        <>
                          <StatusIcon status={selected.value} />
                          <span className="capitalize">{selected.label}</span>
                        </>
                      ) : status ? (
                        <>
                          <StatusIcon status={status} />
                          <span className="capitalize">{status}</span>
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 size-4" />
                          Add Status
                        </>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-0" side="bottom">
                  <Command>
                    <CommandInput placeholder="Change status" />
                    <CommandList>
                      <CommandGroup>
                        {statuses.map((status) => (
                          <CommandItem
                            key={status.value}
                            onSelect={() => {
                              field.onChange(status.value)
                              setOpen(false)
                            }}
                            value={status.value}
                          >
                            <status.icon
                              className={cn(
                                "mr-2 h-4 w-4",
                                status.value === selected?.value
                                  ? "opacity-100"
                                  : "opacity-40",
                              )}
                            />
                            <span>{status.label}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export function LabelBox({ issueLabels }: { issueLabels: IssueLabel[] }) {
  const getLabels = issueLabels.map((label) => {
    return {
      id: label.label.id,
      name: label.label.name,
      color: label.label.color,
    }
  })

  const renderLabels = getLabels.map((label) => {
    return (
      <Badge className="gap-x-1.5 py-1.5" key={label.id} variant="outline">
        <svg
          aria-hidden="true"
          className="size-2"
          fill={label.color}
          viewBox="0 0 6 6"
        >
          <circle cx={3} cy={3} r={3} />
        </svg>
        {label.name}
      </Badge>
    )
  })

  return renderLabels
}

const priorities = [
  {
    value: "no priority",
    label: "No priority",
    icon: MinusCircle,
  },
  {
    value: "low",
    label: "Low",
    icon: SignalLow,
  },
  {
    value: "medium",
    label: "Medium",
    icon: SignalMedium,
  },
  {
    value: "high",
    label: "High",
    icon: SignalHigh,
  },
]

export function PriorityBox({ priority }: { priority: string }) {
  const [selected, setSelected] = useState<Status | null>({
    value: "no priority",
    label: "No priority",
    icon: MinusCircle,
  })

  function PriorityIcon({ priority }: { priority: string | undefined }) {
    if (priority === "no priority") {
      return <MinusCircle className="mr-2 size-4" />
    } else if (priority === "low") {
      return <SignalLow className="mr-2 size-4" />
    } else if (priority === "medium") {
      return <SignalMedium className="mr-2 size-4" />
    } else if (priority === "high") {
      return <SignalHigh className="mr-2 size-4" />
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="-ml-2.5 w-[10rem] justify-start" variant="ghost">
          <PriorityIcon priority={priority} />
          <span className="capitalize">{priority || "No priority"}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0" side="bottom">
        <Command>
          <CommandInput placeholder="Change priority" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {priorities.map((priority) => (
                <CommandItem
                  key={priority.value}
                  onSelect={(value) => {
                    setSelected(
                      priorities.find((priority) => priority.value === value) ??
                        null,
                    )
                  }}
                  value={priority.value}
                >
                  <priority.icon
                    className={cn(
                      "mr-2 h-4 w-4",
                      priority.value === selected?.value
                        ? "opacity-100"
                        : "opacity-40",
                    )}
                  />
                  <span>{priority.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function AssigneeBox({
  assignees,
  assigneeId,
}: {
  assignees: UsersData
  assigneeId: string | null
}) {
  const [selected, setSelected] = useState<Users | null>(null)

  const hasAssignee =
    assignees.find((assignee) => assignee.id === assigneeId) ?? undefined

  return (
    <Popover>
      <PopoverTrigger asChild>
        {hasAssignee ? (
          <Button className="-ml-2.5 w-[10rem] justify-start" variant="ghost">
            <Avatar className="mr-1.5 h-4 w-4">
              <AvatarImage src={hasAssignee.image ?? undefined} />
              <AvatarFallback className="capitalize">
                {hasAssignee.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {hasAssignee.name}
          </Button>
        ) : selected ? (
          <Button className="-ml-2.5 w-[10rem] justify-start" variant="ghost">
            <Avatar className="mr-1.5 h-4 w-4">
              <AvatarImage src={selected.image ?? undefined} />
              <AvatarFallback className="capitalize">
                {selected.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {selected.name}
          </Button>
        ) : (
          <Button className="-ml-2.5 w-[10rem] justify-start" variant="ghost">
            <Plus className="mr-2 size-4" />
            Add Assignee
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0" side="bottom">
        <Command>
          <CommandInput placeholder="Change assignee" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {assignees.map((assignee) => (
                <CommandItem
                  key={assignee.id}
                  onSelect={(value) => {
                    setSelected(
                      assignees.find((assignee) => assignee.id === value) ??
                        null,
                    )
                  }}
                  value={assignee.id}
                >
                  <Avatar className="mr-1.5 h-4 w-4">
                    <AvatarImage src={assignee.image ?? undefined} />
                    <AvatarFallback className="capitalize">
                      {assignee.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{assignee.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function ProjectBox({
  projects,
  projectId,
}: {
  projects: ProjectsData
  projectId: string
}) {
  const [selected, setSelected] = useState<ProjectsData[number] | null>(null)
  const [open, setOpen] = useState(false)

  const hasProject =
    projects.find((project) => project.id === projectId) ?? undefined

  return (
    <Popover>
      <PopoverTrigger asChild>
        {hasProject ? (
          <Button
            className="-ml-2.5 w-[10rem] justify-start space-x-2"
            variant="ghost"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-gray-50 text-[0.625rem] font-medium uppercase">
              {hasProject.title.charAt(0)}
            </span>
            <span>{hasProject.title}</span>
          </Button>
        ) : selected ? (
          <Button
            className="-ml-2.5 w-[10rem] justify-start space-x-2"
            variant="ghost"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-gray-50 text-[0.625rem] font-medium uppercase">
              {selected.title.charAt(0)}
            </span>
            <span>{selected.title}</span>
          </Button>
        ) : (
          <Button
            className="-ml-2.5 w-[10rem] justify-start space-x-2"
            variant="ghost"
          >
            <Plus className="mr-2 size-4" />
            Add Project
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0" side="bottom">
        <Command>
          <CommandInput placeholder="Change priority..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {projects.map((project) => (
                <CommandItem
                  key={project.id}
                  onSelect={() => {
                    setOpen(false)
                  }}
                  value={project.title}
                >
                  <span className="mr-2 flex size-5 shrink-0 items-center justify-center rounded-lg border bg-gray-50 text-[0.625rem] font-medium uppercase">
                    {projects[0]?.title.charAt(0)}
                  </span>
                  <span className="capitalize">{project.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

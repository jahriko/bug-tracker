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
import { ProjectsData } from "@/server/data/get-projects"
import { updateStatus } from "@/server/actions/update-issue-status"
import { FormField, Form, FormControl, FormItem } from "@/components/ui/form"
import { Issue, IssueLabel } from "../page"



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
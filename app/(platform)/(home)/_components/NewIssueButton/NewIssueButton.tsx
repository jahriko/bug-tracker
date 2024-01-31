"use client"
import { PencilSquareIcon } from "@heroicons/react/24/outline"
import { zodResolver } from "@hookform/resolvers/zod"
// import { Circle as CirclePicker } from "@uiw/react-color"
// import Block from "@uiw/react-color-circle"
// import Circle from "@uiw/react-color-circle"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { addLabelsToIssue, createIssue } from "@/server/actions/issue"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { IssueSchema } from "@/lib/validations"
import {
  Users,
  Labels,
  ProjectIdAndTitle,
} from "@/app/(platform)/(home)/layout"
import TitleBox from "./TitleBox"
import DescriptionBox from "./DescriptionBox"
import PriorityBox from "./PriorityBox"
import StatusBox from "./StatusBox"
import AssigneeBox from "./AssigneeBox"
import LabelBox from "./LabelBox"
import ProjectBox from "./ProjectBox"

export default function NewIssueButton({
  projects,
  users,
  labels,
}: {
  projects: ProjectIdAndTitle[]
  users: Users[]
  labels: Labels[]
}) {
  const [open, setOpen] = useState(false)
  const form = useForm<IssueSchema>({
    resolver: zodResolver(IssueSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "",
      priority: "",
      assigneeId: "",
      labels: [],
      projectId: "",
    },
  })

  async function onSubmit(data: IssueSchema) {
    const result = await createIssue(data)

    if (result.code === "error") {
      return toast("Error creating issue")
    }

    form.reset({
      assigneeId: "",
    })

    return toast("Created Issue")
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button
          asChild
          className="-mx-2 justify-start gap-x-2"
          size="sm"
          variant="outline"
        >
          <PencilSquareIcon
            aria-hidden="true"
            className="-ml-0.5 size-4"
          />
          New Issue
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <Form {...form}>
          <form
            id="createIssue"
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <TitleBox />

            <DescriptionBox />

            <div className="flex space-x-1.5">
              <StatusBox />
              <PriorityBox />
              <LabelBox labels={labels} />
              <AssigneeBox assignees={users} />
              <ProjectBox projects={projects} />
            </div>

            <DialogFooter>
              <Button form="createIssue" type="submit">
                Create Issue
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
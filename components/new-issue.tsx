"use client"
import { PencilSquareIcon } from "@heroicons/react/24/outline"
import { zodResolver } from "@hookform/resolvers/zod"
// import { Circle as CirclePicker } from "@uiw/react-color"
// import Block from "@uiw/react-color-circle"
// import Circle from "@uiw/react-color-circle"
import { useState } from "react"
import { useForm } from "react-hook-form"
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
import { toast } from "./ui/use-toast"
import TitleBox from "./new-issue-titlebox"
import DescriptionBox from "./new-issue-descriptionbox"
import PriorityBox from "./new-issue-prioritybox"
import StatusBox from "./new-issue-statusbox"
import AssigneeBox from "./new-isssue-assigneebox"
import LabelBox from "./new-issue-labelbox"
import ProjectBox from "./new-issue-projectbox"

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
    console.log(data)
    const result = await createIssue(data)

    if (result.code === "error") {
      return toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }

    form.reset({
      assigneeId: "",
    })

    return toast({
      title: "Success",
      description: result.message,
      variant: "default",
    })
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button
          className="-mx-2 justify-start gap-x-2 bg-gray-50 px-2.5 text-sm text-black shadow-sm"
          size="sm"
          type="button"
          variant="outline"
        >
          <PencilSquareIcon aria-hidden="true" className="-ml-0.5 size-5" />
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

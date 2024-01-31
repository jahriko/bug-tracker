"use client"
import React, { useState } from "react"
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { IssueSchema } from "@/lib/validations"
import { Labels, ProjectIdAndTitle, Users } from "@/app/(platform)/(home)/layout";
import { createIssue } from "@/server/actions/issue"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { StatusBox } from "../_components/NewIssueButton/StatusBox"
import { PriorityBox } from "../_components/NewIssueButton/PriorityBox"
import { LabelBox } from "../_components/NewIssueButton/LabelBox"
import { Button } from "@/components/ui/button";
import { AssigneeBox } from "../_components/NewIssueButton/AssigneeBox"
import { ProjectBox } from "../_components/NewIssueButton/ProjectBox"

export default function NewIssueForm({
                                       users,
                                       labels,
  projects,
                                     }: {
  users: Users[]
  projects: ProjectIdAndTitle[]
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
    <div className="mx-auto max-w-[1300px] py-8 xl:py-10 ">

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 xl:grid xl:grid-cols-3">
          <div className="xl:col-span-2 xl:border-r xl:border-gray-200 xl:pr-8">
              <div className="space-y-2">
                <div className="md:flex md:items-center md:justify-between md:space-x-4">
                  <div className="flex-grow space-y-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="py-3 xl:pb-0 xl:pt-2">
                  <h2 className="sr-only">Description</h2>
                  <div className="max-w-none space-y-2">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Description"
                              rows={10}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                  <Button type="submit">Create issue</Button>
              </div>
          </div>
          <aside className="xl:pl-8 xl:col-span-1">
            <div className="space-y-6">
              <div className="flex-row space-y-4 items-center">
                <h2 className="text-sm font-medium text-gray-500">Status</h2>
                <div className="flex items-center space-x-2">
                  <StatusBox />
                </div>
              </div>

              <div className="flex-row space-y-4 items-center ">
                <h2 className="text-sm font-medium text-gray-500">Priority</h2>
                <div className="flex items-center space-x-2">
                  <PriorityBox />
                </div>
              </div>

              <div className="flex-row space-y-4 items-center">
                <h2 className="text-sm font-medium text-gray-500">Assignee</h2>
                <div className="flex items-center space-x-2 ">
                  <AssigneeBox assignees={users} />
                </div>
              </div>

              <div className="flex-row space-y-4 items-center">
                <h2 className="text-sm font-medium text-gray-500">Labels</h2>
                <ul className="flex items-center" role="list">
                   <LabelBox labels={labels} />
                </ul>
              </div>

              <div className="flex-row space-y-4 items-center">
                <h2 className="text-sm font-medium text-gray-500">Project</h2>
                <div className="flex items-center space-x-2 ">
                   <ProjectBox projects={projects} />
                </div>
              </div>
            </div>
          </aside>
        </form>
      </Form>

    </div>
  )
}
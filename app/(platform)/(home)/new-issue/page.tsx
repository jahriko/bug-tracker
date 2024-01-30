"use client"
import React, { useState } from "react"
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { IssueSchema } from "@/lib/validations"
import { Labels, Users } from "@/app/(platform)/(home)/layout"
import { createIssue } from "@/server/actions/issue"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import StatusBox from "@/app/(platform)/(home)/_components/NewIssueButton/StatusBox"

export default function CreateIssue({
  children,
  users,
  labels,
}: {
  children: React.ReactNode
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
    <div className="mx-auto max-w-[1300px] py-8 xl:py-10 ">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 xl:grid xl:grid-cols-3">
        <Form {...form}>
          <div className="xl:col-span-2 xl:border-r xl:border-gray-200 xl:pr-8">
            <div>
              <div className="space-y-2">
                <div className="md:flex md:items-center md:justify-between md:space-x-4">
                  <div className="flex-grow space-y-2">
                    <p className="text-sm font-medium">Issue Title</p>
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} className="px-2" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <aside className="mt-8 xl:hidden">
                  <div className="mt-6 space-y-8 border-b border-t border-gray-200 py-6">
                    <div>
                      <h2 className="text-sm font-medium text-gray-500">
                        Assignees
                      </h2>
                      <ul className="mt-3 space-y-3" role="list">
                        <li className="flex justify-start">
                          <a className="flex items-center space-x-3" href="#">
                            <div className="flex-shrink-0">
                              <img
                                alt=""
                                className="h-5 w-5 rounded-full"
                                src="https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
                              />
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {/* {getIssue.assignee?.name ?? "No assignee"} */}
                              ??????
                            </div>
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h2 className="text-sm font-medium text-gray-500">
                        Labels
                      </h2>
                      <ul className="mt-2 leading-8" role="list">
                        <li className="inline">
                          <a
                            className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5"
                            href="#"
                          >
                            <div className="absolute flex flex-shrink-0 items-center justify-center">
                              <span
                                aria-hidden="true"
                                className="h-1.5 w-1.5 rounded-full bg-rose-500"
                              />
                            </div>
                            <div className="ml-3.5 text-sm font-medium text-gray-900">
                              Bug
                            </div>
                          </a>
                        </li>
                        <li className="inline">
                          <a
                            className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5"
                            href="#"
                          >
                            <div className="absolute flex flex-shrink-0 items-center justify-center">
                              <span
                                aria-hidden="true"
                                className="h-1.5 w-1.5 rounded-full bg-indigo-500"
                              />
                            </div>
                            <div className="ml-3.5 text-sm font-medium text-gray-900">
                              Accessibility
                            </div>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </aside>
                <div className="py-3 xl:pb-0 xl:pt-2">
                  <h2 className="sr-only">Description</h2>
                  <div className="max-w-none space-y-2">
                    <p className="text-sm font-semibold">Description</p>
                    <Textarea className="px-2" rows={10} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <aside className="xl:pl-8">
            <div className="space-y-6">
              <div className="flex items-center sm:grid sm:grid-cols-3">
                <h2 className="text-sm font-medium text-gray-500">Status</h2>
                <div className="flex items-center space-x-2 sm:col-span-2">
                  <StatusBox />
                </div>
              </div>

              <div className="flex items-center sm:grid sm:grid-cols-3">
                <h2 className="text-sm font-medium text-gray-500">Priority</h2>
                <div className="flex items-center space-x-2 sm:col-span-2">
                  {/* <PriorityBox priority={issue.priority} /> */}
                </div>
              </div>

              <div className="flex items-center sm:grid sm:grid-cols-3">
                <h2 className="text-sm font-medium text-gray-500">Assignee</h2>
                <div className="flex items-center space-x-2 sm:col-span-2">
                  {/* <AssigneeBox assigneeId={issue.assigneeId} assignees={users} /> */}
                </div>
              </div>

              <div className="flex items-center sm:grid sm:grid-cols-3">
                <h2 className="text-sm font-medium text-gray-500">Labels</h2>
                <ul className="space-x-3 sm:col-span-2" role="list">
                  {/* <LabelBox issueLabels={issueLabels} /> */}
                </ul>
              </div>

              <div className="flex items-center sm:grid sm:grid-cols-3">
                <h2 className="text-sm font-medium text-gray-500">Project</h2>
                <div className="flex items-center space-x-2 sm:col-span-2">
                  {/* <ProjectBox projectId={issue.projectId} projects={projects} /> */}
                </div>
              </div>
            </div>
          </aside>
        </Form>
      </div>
    </div>
  )
}

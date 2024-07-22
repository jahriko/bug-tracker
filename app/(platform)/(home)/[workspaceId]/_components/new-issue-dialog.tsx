"use client"
import { Avatar } from "@/components/catalyst/avatar"
import { BorderlessInput } from "@/components/catalyst/borderless-input"
import { BorderlessTextarea } from "@/components/catalyst/borderless-textarea"
import { Button } from "@/components/catalyst/button"
import { Dialog, DialogActions, DialogBody } from "@/components/catalyst/dialog"
import { Field } from "@/components/catalyst/fieldset"
import { ListboxLabel } from "@/components/catalyst/listbox"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { IssueSchema } from "@/lib/validations.js"
import { LabelsData } from "@/server/data/many/get-labels"
import { UsersData } from "@/server/data/many/get-users"
import {
  Ban,
  CheckCircle2,
  CircleDashed,
  CircleDot,
  Loader2,
  MinusCircle,
  PauseCircle,
  SignalHigh,
  SignalLow,
  SignalMedium,
  User2,
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { createIssue } from "../_actions/create-issue"
import { CustomListbox, CustomListboxLabel, CustomListboxOption } from "./custom-listbox"
import { LabelSelector } from "./label-selector"

export default function NewIssueDialog({
  assignees,
  labels,
  hasProjects,
}: {
  assignees: UsersData
  labels: LabelsData
  hasProjects: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const projectName = pathname.split("/")[2] || ""
  const router = useRouter()

  const form = useForm<IssueSchema>({
    defaultValues: {
      title: "",
      description: "",
      status: "backlog",
      projectName,
    },
  })

  async function onSubmit(data: IssueSchema) {
    const res = await createIssue(data)

    const { data: resData, validationErrors, serverError } = res

    if (serverError) {
      return toast.error(serverError)
    }

    if (resData?.success) {
      setIsOpen(false)
      form.reset()
      return toast.success("Issue created", {
        description: data.title,
      })
    } else {
      return toast.error(resData?.error.message)
    }
  }

  return (
    <>
      <Button
        color="zinc"
        onClick={(e) => {
          e.preventDefault()
          if (!hasProjects) {
            return toast.info("No Projects Found", {
              description: "Create a project first before creating an issue",
              action: {
                label: "Create Project",
                onClick: () => {
                  router.push(`${pathname}/create-project`)
                },
              },
            })
          }

          setIsOpen(true)
        }}
      >
        New Issue
      </Button>
      <Dialog onClose={setIsOpen} open={isOpen} size="3xl">
        <DialogBody className="!mt-0">
          <Form {...form}>
            <form id="create-issue" onSubmit={form.handleSubmit(onSubmit)}>
              <div data-slot="control">
                <div data-slot="control">
                  <Field>
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <BorderlessInput
                              {...field}
                              aria-label="Issue Title"
                              className="font-medium [&>*]:text-lg"
                              name="title"
                              placeholder="Issue Title"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </Field>
                  <Field>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <BorderlessTextarea
                              {...field}
                              aria-label="Description"
                              name="description"
                              placeholder="Description"
                              resizable={false}
                              rows={3}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </Field>
                </div>
                <div className="flex gap-x-1.5">
                  {/* Status */}
                  <Field className="flex-shrink truncate">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => {
                        const { ref, ...rest } = field
                        return (
                          <FormItem>
                            <FormControl>
                              <CustomListbox
                                {...rest}
                                className="max-w-40"
                                defaultValue="backlog"
                                name="status"
                              >
                                <CustomListboxOption value="backlog">
                                  <CircleDashed className="size-4" />
                                  <ListboxLabel>Todo</ListboxLabel>
                                </CustomListboxOption>
                                <CustomListboxOption value="active">
                                  <CircleDot className="size-4" />
                                  <ListboxLabel>Active</ListboxLabel>
                                </CustomListboxOption>
                                <CustomListboxOption value="paused">
                                  <PauseCircle className="size-4" />
                                  <ListboxLabel>Paused</ListboxLabel>
                                </CustomListboxOption>
                                <CustomListboxOption value="in-progress">
                                  <Loader2 className="size-4" />
                                  <ListboxLabel>In Progress</ListboxLabel>
                                </CustomListboxOption>
                                <CustomListboxOption value="done">
                                  <CheckCircle2 className="size-4" />
                                  <ListboxLabel>Done</ListboxLabel>
                                </CustomListboxOption>
                                <CustomListboxOption value="canceled">
                                  <Ban className="size-4" />
                                  <ListboxLabel>Canceled</ListboxLabel>
                                </CustomListboxOption>
                              </CustomListbox>
                            </FormControl>
                          </FormItem>
                        )
                      }}
                    />
                  </Field>

                  {/* Priority */}
                  <Field className="flex-shrink truncate">
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => {
                        const { ref, ...rest } = field
                        return (
                          <FormItem>
                            <FormControl>
                              <CustomListbox
                                {...rest}
                                name="priority"
                                placeholder={
                                  <div className="flex min-w-0 items-center">
                                    <MinusCircle className="size-4 flex-shrink-0 text-zinc-500" />
                                    <span className="ml-2.5 truncate first:ml-0 sm:ml-2 sm:first:ml-0">
                                      Priority
                                    </span>
                                  </div>
                                }
                              >
                                <CustomListboxOption value="no-priority">
                                  <MinusCircle className="size-4" />
                                  <ListboxLabel>No Priority</ListboxLabel>
                                </CustomListboxOption>
                                <CustomListboxOption value="low">
                                  <SignalLow className="size-4" />
                                  <ListboxLabel>Low</ListboxLabel>
                                </CustomListboxOption>
                                <CustomListboxOption value="medium">
                                  <SignalMedium className="size-4" />
                                  <ListboxLabel>Medium</ListboxLabel>
                                </CustomListboxOption>
                                <CustomListboxOption value="high">
                                  <SignalHigh className="size-4" />
                                  <ListboxLabel>High</ListboxLabel>
                                </CustomListboxOption>
                              </CustomListbox>
                            </FormControl>
                          </FormItem>
                        )
                      }}
                    />
                  </Field>

                  {/* Assignees */}
                  <Field className="flex-shrink truncate">
                    <FormField
                      control={form.control}
                      name="assigneeId"
                      render={({ field }) => {
                        const { ref, ...rest } = field

                        return (
                          <FormItem>
                            <FormControl>
                              <CustomListbox
                                {...rest}
                                name="assignee"
                                placeholder={
                                  <div className="flex items-center gap-x-2">
                                    <User2 className="size-4" />
                                    Assignee
                                  </div>
                                }
                              >
                                {assignees.map((assignee) => (
                                  <CustomListboxOption
                                    key={assignee.id}
                                    value={assignee.id}
                                  >
                                    <Avatar
                                      alt=""
                                      className="bg-purple-500 text-white"
                                      src={assignee.image}
                                    />
                                    <CustomListboxLabel>
                                      {assignee.name}
                                    </CustomListboxLabel>
                                  </CustomListboxOption>
                                ))}
                              </CustomListbox>
                            </FormControl>
                          </FormItem>
                        )
                      }}
                    />
                  </Field>

                  {/* Labels */}
                  <Field className="flex-shrink">
                    <FormField
                      control={form.control}
                      name="labels"
                      render={({ field }) => {
                        const { ref, ...rest } = field
                        return (
                          <FormItem>
                            <FormControl>
                              <LabelSelector {...rest} labels={labels} />
                            </FormControl>
                          </FormItem>
                        )
                      }}
                    />
                  </Field>
                </div>
              </div>
            </form>
          </Form>
        </DialogBody>
        <DialogActions className="!mt-4">
          <Button
            onClick={() => {
              setIsOpen(false)
            }}
            plain
          >
            Cancel
          </Button>
          <Button form="create-issue" type="submit">
            Submit issue
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

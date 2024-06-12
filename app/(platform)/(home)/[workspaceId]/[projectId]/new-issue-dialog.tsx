"use client"
import { Avatar } from "@/components/catalyst/avatar"
import { BorderlessInput } from "@/components/catalyst/borderless-input"
import { BorderlessTextarea } from "@/components/catalyst/borderless-textarea"
import { Button } from "@/components/catalyst/button"
import { Dialog, DialogActions, DialogBody } from "@/components/catalyst/dialog"
import { Field } from "@/components/catalyst/fieldset"
import {
  Listbox,
  ListboxLabel,
  ListboxOption,
} from "@/components/catalyst/listbox"
import MultiSelectComboBox, {
  MultiSelectComboBoxLabel,
  MultiSelectComboBoxOption,
} from "@/components/combobox-multi-select"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { IssueSchema } from "@/lib/validations"
import { createIssue } from "@/server/actions/issue"
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
  Tag,
  User2,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface NewIssueDialogProps {
  assignees: UsersData
  labels: LabelsData
}

export default function NewIssueDialog({
  assignees,
  labels,
}: NewIssueDialogProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const projectName = pathname.split("/")[2] || ""

  const form = useForm<IssueSchema>({
    defaultValues: {
      title: "",
      description: "",
      status: "backlog",
      projectName,
    },
  })

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery)
  }

  const filteredOptions =
    query === ""
      ? labels
      : labels.filter((label) => {
          return label.name.toLowerCase().includes(query.toLowerCase().trim())
        })

  async function onSubmit(data: IssueSchema) {
    const res = await createIssue(data)

    const { data: resData, validationErrors, serverError } = res

    if (validationErrors) {
      const firstError = Object.entries(validationErrors).find(
        ([_, errors]) => errors.length > 0,
      )

      if (firstError) {
        const [key, [errorMessage]] = firstError
        return toast.error(`${errorMessage}`, {
          description: `Enter a ${key} before submitting an issue`,
        })
      }
    }

    if (serverError) {
      return toast.error(serverError)
    }

    if (resData?.success) {
      setIsOpen(false)
      form.reset()
      return toast.success("Issue created", {
        description: `${data.title}`,
      })
    } else {
      return toast.error(resData?.error.message)
    }
  }

  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true)
        }}
        type="button"
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
                              <Listbox
                                {...rest}
                                className="max-w-40"
                                defaultValue="backlog"
                                name="status"
                                placeholder="Status"
                              >
                                <ListboxOption value="backlog">
                                  <CircleDashed className="size-4" />
                                  <ListboxLabel>Backlog</ListboxLabel>
                                </ListboxOption>
                                <ListboxOption value="active">
                                  <CircleDot className="size-4" />
                                  <ListboxLabel>Active</ListboxLabel>
                                </ListboxOption>
                                <ListboxOption value="paused">
                                  <PauseCircle className="size-4" />
                                  <ListboxLabel>Paused</ListboxLabel>
                                </ListboxOption>
                                <ListboxOption value="in-progress">
                                  <Loader2 className="size-4" />
                                  <ListboxLabel>In Progress</ListboxLabel>
                                </ListboxOption>
                                <ListboxOption value="done">
                                  <CheckCircle2 className="size-4" />
                                  <ListboxLabel>Done</ListboxLabel>
                                </ListboxOption>
                                <ListboxOption value="canceled">
                                  <Ban className="size-4" />
                                  <ListboxLabel>Canceled</ListboxLabel>
                                </ListboxOption>
                              </Listbox>
                            </FormControl>
                          </FormItem>
                        )
                      }}
                    />
                  </Field>

                  {/* Priority */}
                  <Field className="min-w-[110px] flex-shrink truncate">
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => {
                        const { ref, ...rest } = field
                        return (
                          <FormItem>
                            <FormControl>
                              <Listbox
                                {...rest}
                                name="priority"
                                placeholder={
                                  <div className="flex items-center gap-x-2">
                                    <MinusCircle className="size-4" />
                                    Priority
                                  </div>
                                }
                              >
                                <ListboxOption value="no-priority">
                                  <MinusCircle className="size-4" />
                                  <ListboxLabel>No Priority</ListboxLabel>
                                </ListboxOption>
                                <ListboxOption value="low">
                                  <SignalLow className="size-4" />
                                  <ListboxLabel>Low</ListboxLabel>
                                </ListboxOption>
                                <ListboxOption value="medium">
                                  <SignalMedium className="size-4" />
                                  <ListboxLabel>Medium</ListboxLabel>
                                </ListboxOption>
                                <ListboxOption value="high">
                                  <SignalHigh className="size-4" />
                                  <ListboxLabel>High</ListboxLabel>
                                </ListboxOption>
                              </Listbox>
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
                              <Listbox
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
                                  <ListboxOption
                                    key={assignee.id}
                                    value={assignee.id}
                                  >
                                    <Avatar
                                      alt=""
                                      src={assignee.image}
                                      // initials={assignee.initial}
                                      className="bg-purple-500 text-white"
                                    />
                                    <ListboxLabel>{assignee.name}</ListboxLabel>
                                  </ListboxOption>
                                ))}
                              </Listbox>
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
                              <MultiSelectComboBox
                                {...rest}
                                name="labels"
                                multiple
                                onQueryChange={handleQueryChange}
                                placeholder={
                                  <div className="flex items-center gap-x-2">
                                    <Tag className="flex size-4 items-center" />
                                    Labels
                                  </div>
                                }
                              >
                                {(query === "" ? labels : filteredOptions).map(
                                  (label) => (
                                    <MultiSelectComboBoxOption
                                      key={label.id}
                                      value={label}
                                    >
                                      <MultiSelectComboBoxLabel>
                                        {label.name}
                                      </MultiSelectComboBoxLabel>
                                    </MultiSelectComboBoxOption>
                                  ),
                                )}
                              </MultiSelectComboBox>
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

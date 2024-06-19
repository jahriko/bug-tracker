"use client"
import { Avatar } from "@/components/catalyst/avatar"
import { BorderlessInput } from "@/components/catalyst/borderless-input"
import { BorderlessTextarea } from "@/components/catalyst/borderless-textarea"
import { Button } from "@/components/catalyst/button"
import { Dialog, DialogActions, DialogBody } from "@/components/catalyst/dialog"
import { Field } from "@/components/catalyst/fieldset"
import { Listbox, ListboxLabel, ListboxOption } from "@/components/catalyst/listbox"
import MultiSelectComboBox, {
  MultiSelectComboBoxLabel,
  MultiSelectComboBoxOption,
  MultiSelectComboboxOptions,
} from "@/components/combobox-multi-select"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { IssueSchema } from "@/lib/validations"
import { createIssue } from "@/server/actions/issue"
import { LabelsData } from "@/server/data/many/get-labels"
import { UsersData } from "@/server/data/many/get-users"
import { PlusIcon } from "@heroicons/react/16/solid"
import { atom } from "jotai"
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
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { createLabel } from "@/app/(platform)/(home)/[workspaceId]/[projectId]/action"
import { BadgeProps, colors } from "@/components/catalyst/badge"
import { Divider } from "@/components/catalyst/divider"
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react"
import { useOptimisticAction } from "next-safe-action/hooks"

interface NewIssueDialogProps {
  assignees: UsersData
  labels: LabelsData
}

export default function NewIssueDialog({ assignees, labels }: NewIssueDialogProps) {
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

  async function onSubmit(data: IssueSchema) {
    const res = await createIssue(data)

    const { data: resData, validationErrors, serverError } = res

    // if (validationErrors) {
    //   const firstError = Object.entries(validationErrors).find(
    //     ([_, errors]) => errors.length > 0,
    //   )

    //   if (firstError) {
    //     const [key, [errorMessage]] = firstError
    //     return toast.error(`${errorMessage}`, {
    //       description: `Enter a ${key} before submitting an issue`,
    //     })
    //   }
    // }

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
                                  <ListboxOption key={assignee.id} value={assignee.id}>
                                    <Avatar
                                      alt=""
                                      src={assignee.image}
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

// `useState` doesn't update the data immediately after creating a label.
// TOOD: Experiment with useState again to see if it's possible to update the data immediately.
export const labelAtom = atom<LabelsData>([])
// I got paranoid and atomized the rest lol
export const queryAtom = atom<string>("")
export const labelDialogAtom = atom<boolean>(false)

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

function LabelSelector({ labels, ...rest }: { labels: LabelsData }) {
  const [query, setQuery] = useState("")
  const [colorQuery, setColorQuery] = useState("")
  const [isCreateLabelDialogOpen, setCreateLabelDialogOpen] = useState(false)

  const { execute, result, optimisticState } = useOptimisticAction(createLabel, {
    currentState: { labels },
    updateFn: (state, newLabel) => ({
      labels: [...state.labels, { ...newLabel, available: true }],
    }),
    onSuccess({ data, input }) {
      console.log("HELLO FROM ONSUCCESS", data, input)
    },
    onError({ error, input }) {
      console.log("OH NO FROM ONERROR", error, input)
    },
    onExecute({ input }) {
      console.log("EXECUTING", input)
      setQuery(" ")
      // JFC, The reason why dialog keeps opening when querying a label
      // that doesn't exist yet is that I haven't properly closed the dialog before creation
      setCreateLabelDialogOpen(false)
      toast.success("Label created", { description: input.name })
    },
  })

  const form = useForm<{ color: string }>({
    defaultValues: {
      color: "",
    },
  })

  const filteredColors = (colorQuery: string): BadgeProps["color"][] => {
    const validColors: BadgeProps["color"][] = Object.keys(colors) as BadgeProps["color"][]

    if (colorQuery === "") {
      return validColors
    }

    return validColors.filter((color) => color && color.toLowerCase().includes(colorQuery.toLowerCase()))
  }

  const filteredLabels =
    query === ""
      ? optimisticState.labels
      : optimisticState.labels.filter((label) => {
          return label.name.toLowerCase().includes(query.toLowerCase().trim())
        })

  async function onSubmit({ color }: { color: string }) {
    execute({ id: Math.random(), name: query, color })

    if (result.serverError) {
      console.error("Error creating label: ", result.serverError)
      return
    }
  }

  const handleMouseDown = (event: any) => {
    event.preventDefault()
  }

  return (
    <MultiSelectComboBox
      {...rest}
      name="labels"
      multiple
      onQueryChange={setQuery}
      placeholder={
        <div className="flex items-center gap-x-2">
          <Tag className="flex size-4 items-center" />
          Labels
        </div>
      }
    >
      <MultiSelectComboboxOptions hold static>
        <div className="p-1">
          {(query === "" ? optimisticState.labels : filteredLabels).map((label) => (
            <MultiSelectComboBoxOption key={label.id} value={label} disabled={label.available}>
              <MultiSelectComboBoxLabel>{label.name}</MultiSelectComboBoxLabel>
            </MultiSelectComboBoxOption>
          ))}

          {filteredLabels.length === 0 && (
            <>
              <Button
                plain
                onMouseDown={handleMouseDown}
                className="relative w-full"
                onClick={() => {
                  setCreateLabelDialogOpen(true)
                }}
              >
                <PlusIcon />

                <span className="font-medium">Create new label</span>
                <span className="font-normal text-zinc-500">{query}</span>
              </Button>

              <Dialog open={isCreateLabelDialogOpen} onClose={() => {}} className="!p-4">
                <DialogBody className="!mt-0">
                  <Form {...form}>
                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => {
                        const { ref, ...rest } = field
                        return (
                          <FormItem>
                            <FormControl>
                              <Combobox {...rest} as="div">
                                <ComboboxInput
                                  autoFocus
                                  className="w-full border-0 px-4 py-2.5 text-gray-900 focus:ring-0 sm:text-sm"
                                  placeholder="Select a color for your label"
                                  onChange={(event) => setColorQuery(event.target.value)}
                                  // Clear query when input gets out of focus
                                  onBlur={() => setColorQuery("")}
                                  as={BorderlessInput}
                                />

                                <Divider />

                                {Object.keys(colors).length > 0 && (
                                  <ComboboxOptions
                                    static
                                    className="-mb-2 max-h-72 scroll-py-6 overflow-y-auto py-2 text-sm text-gray-800"
                                  >
                                    {(colorQuery === ""
                                      ? Object.keys(colors)
                                      : Object.keys(filteredColors(colorQuery))
                                    ).map((color) => (
                                      <ComboboxOption
                                        key={color}
                                        value={color}
                                        onClick={() => {
                                          form.handleSubmit(onSubmit)()
                                        }}
                                        className={({ focus }) =>
                                          classNames(
                                            "flex cursor-default select-none items-center gap-x-3 rounded-md px-4 py-3",
                                            focus ? "bg-gray-100" : "",
                                          )
                                        }
                                      >
                                        <div
                                          className={classNames(
                                            colors[(color as BadgeProps["color"]) || "zinc"],
                                            "flex-none rounded-full p-1",
                                          )}
                                        >
                                          <div className="size-2.5 rounded-full bg-current" />
                                        </div>
                                        {color.charAt(0).toUpperCase() + color.slice(1)}
                                      </ComboboxOption>
                                    ))}
                                  </ComboboxOptions>
                                )}

                                {colorQuery !== "" && filteredColors.length === 0 && (
                                  <div className="px-4 py-14 text-center sm:px-14">
                                    <p className="mt-4 text-sm text-gray-900">No color found.</p>
                                  </div>
                                )}
                              </Combobox>
                            </FormControl>
                          </FormItem>
                        )
                      }}
                    />
                  </Form>
                </DialogBody>
              </Dialog>
            </>
          )}
        </div>
      </MultiSelectComboboxOptions>
    </MultiSelectComboBox>
  )
}

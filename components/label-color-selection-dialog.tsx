import { createLabel } from "@/app/(platform)/(home)/[workspaceId]/[projectId]/action"
import { Dialog, DialogBody } from "@/components/catalyst/dialog"
import * as Headless from "@headlessui/react"
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { BorderlessInput } from "./catalyst/borderless-input"
import { Divider } from "./catalyst/divider"
import { Form, FormControl, FormField, FormItem } from "./ui/form"

import {
  labelAtom,
  labelDialogAtom,
  queryAtom,
} from "@/app/(platform)/(home)/[workspaceId]/[projectId]/new-issue-dialog"
import { useAtom } from "jotai"
import { useOptimisticAction } from "next-safe-action/hooks"
import { BadgeProps, colors } from "./catalyst/badge"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

type CreateNewLabelProps = Omit<Headless.DialogProps, "onClose"> & {
  className?: string
  labelName: string
}

export function LabelColorSelectionDialog({ labelName, ...props }: CreateNewLabelProps) {
  const [colorQuery, setColorQuery] = useState("")
  const [_, setLabelQuery] = useAtom(queryAtom)
  const [isCreateLabelDialogOpen, setCreateLabelDialogOpen] = useAtom(labelDialogAtom)
  const [labelsData, setLabelsData] = useAtom(labelAtom)

  const { execute, result, optimisticState } = useOptimisticAction(createLabel, {
    currentState: { labelsData },
    updateFn: (state, newLabel) => ({
      labelsData: [...state.labelsData, newLabel],
    }),
    onSuccess({ data, input }) {
      console.log("HELLO FROM ONSUCCESS", data, input)
      // JFC, The reason why dialog keeps opening when querying a label
      // that doesn't exist yet is that I haven't properly closed the dialog after creation
            setLabelQuery(" ")
            setCreateLabelDialogOpen(false)
    },
    onError({ error, input }) {
      console.log("OH NO FROM ONERROR", error, input)
    },
    onExecute({ input }) {
      console.log("EXECUTING", input)
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

  async function onSubmit({ color }: { color: string }) {
    execute({ id: Math.random(), name: labelName, color })

    if (result.serverError) {
      console.error("Error creating label: ", result.serverError)
      return
    }
  }

  return (
    <>
      <Dialog open={isCreateLabelDialogOpen} onClose={() => {}} className="!p-4">
        <DialogBody className="!mt-0">
          <Form {...form}>
            <form>
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
                              {(colorQuery === "" ? Object.keys(colors) : Object.keys(filteredColors)).map(
                                (color) => (
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
                                ),
                              )}
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
            </form>
          </Form>
        </DialogBody>
      </Dialog>
    </>
  )
}

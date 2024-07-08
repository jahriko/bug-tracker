"use client"
import MultiSelectComboBox, {
  MultiSelectComboBoxLabel,
  MultiSelectComboBoxOption,
  MultiSelectComboboxOptions,
} from "@/app/(platform)/(home)/[workspaceId]/_components/combobox-multi-select"
import { BadgeProps, colors } from "@/components/catalyst/badge"
import { BorderlessInput } from "@/components/catalyst/borderless-input"
import { Button } from "@/components/catalyst/button"
import { Dialog, DialogBody } from "@/components/catalyst/dialog"
import { Divider } from "@/components/catalyst/divider"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { classNames } from "@/lib/utils"
import { LabelsData } from "@/server/data/many/get-labels"
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react"
import { PlusIcon } from "@heroicons/react/16/solid"
import { Tag } from "lucide-react"
import { useOptimisticAction } from "next-safe-action/hooks"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { createLabel } from "../_actions/create-label"

export function LabelSelector({ labels, ...rest }: { labels: LabelsData }) {
  const [query, setQuery] = useState("")
  const [colorQuery, setColorQuery] = useState("")
  const [isCreateLabelDialogOpen, setCreateLabelDialogOpen] = useState(false)

  const { execute, result, optimisticState } = useOptimisticAction(createLabel, {
    currentState: { labels },
    updateFn: (state, newLabel) => ({
      labels: [...state.labels, { ...newLabel, available: true }],
    }),
    onError({ error, input }) {
      console.log("[Action Error]: ", error, input)
    },
    onExecute({ input }) {
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
    const validColors: BadgeProps["color"][] = Object.keys(
      colors,
    ) as BadgeProps["color"][]

    if (colorQuery === "") {
      return validColors
    }

    return validColors.filter((color) =>
      color?.toLowerCase().includes(colorQuery.toLowerCase()),
    )
  }

  const filteredLabels =
    query === ""
      ? optimisticState.labels
      : optimisticState.labels.filter((label) => {
          return label.name.toLowerCase().includes(query.toLowerCase().trim())
        })

  return (
    <MultiSelectComboBox
      {...rest}
      multiple
      name="labels"
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
            <MultiSelectComboBoxOption
              disabled={label.available}
              key={label.id}
              value={label}
            >
              <MultiSelectComboBoxLabel>{label.name}</MultiSelectComboBoxLabel>
            </MultiSelectComboBoxOption>
          ))}

          {filteredLabels.length === 0 && (
            <>
              <Button
                className="relative w-full"
                onClick={() => {
                  setCreateLabelDialogOpen(true)
                }}
                onMouseDown={(event: any) => event.preventDefault()}
                plain
              >
                <PlusIcon />

                <span className="font-medium">Create new label</span>
                <span className="font-normal text-zinc-500">{query}</span>
              </Button>

              <Dialog className="!p-4" onClose={() => {}} open={isCreateLabelDialogOpen}>
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
                                  as={BorderlessInput}
                                  autoFocus
                                  className="w-full border-0 px-4 py-2.5 text-gray-900 focus:ring-0 sm:text-sm"
                                  placeholder="Select a color for your label"
                                  onChange={(event) => setColorQuery(event.target.value)}
                                  // Clear query when input gets out of focus
                                  onBlur={() => setColorQuery("")}
                                />

                                <Divider />

                                {Object.keys(colors).length > 0 && (
                                  <ComboboxOptions
                                    className="-mb-2 max-h-72 scroll-py-6 overflow-y-auto py-2 text-sm text-gray-800"
                                    static
                                  >
                                    {(colorQuery === ""
                                      ? Object.keys(colors)
                                      : Object.keys(filteredColors(colorQuery))
                                    ).map((color) => (
                                      <ComboboxOption
                                        className={({ focus }) =>
                                          classNames(
                                            "flex cursor-default select-none items-center gap-x-3 rounded-md px-4 py-3",
                                            focus ? "bg-gray-100" : "",
                                          )
                                        }
                                        key={color}
                                        onClick={() => {
                                          form.handleSubmit(
                                            ({ color }: { color: string }) => {
                                              execute({
                                                id: Math.random(),
                                                name: query,
                                                color,
                                              })

                                              if (result.serverError) {
                                                console.error(
                                                  "Error creating label: ",
                                                  result.serverError,
                                                )
                                              }
                                            },
                                          )()
                                        }}
                                        value={color}
                                      >
                                        <div
                                          className={classNames(
                                            colors[
                                              (color as BadgeProps["color"]) || "zinc"
                                            ],
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
                                    <p className="mt-4 text-sm text-gray-900">
                                      No color found.
                                    </p>
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

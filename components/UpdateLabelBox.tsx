"use client"

import * as React from "react"
import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"
import { Labels } from "@/app/(platform)/(home)/layout"
import { IssueLabelsData } from "@/server/data/many/get-issue-labels"
import { toggle } from "radash"
import {
  addIssueLabel,
  deleteIssueLabel,
  updateIssueLabel,
} from "@/server/actions/issue-label"
import { diff } from "radash"
import { useEffect } from "react"
import { toast } from "sonner"

interface IssueLabel {
  id: number
  name: string
  color: string
}

export function UpdateLabelBox({
  issueLabels,
  issueId,
  labels,
}: {
  issueLabels: IssueLabelsData
  issueId: number
  labels: Labels[]
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  // const [selected, setSelected] = React.useState<IssueLabelsData>(issueLabels)
  const [inputValue, setInputValue] = React.useState("")

  const deleteLabel = React.useCallback(async (labelId: number) => {
    const result = await deleteIssueLabel(issueId, labelId)

    if (result.code === "error") {
      console.error(result.message)
    }


  }, [])

  const handleKeyDown = React.useCallback(
    async (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            const result = await deleteIssueLabel(issueId, labelId)
            if (result.code === "error") {
              console.error(result.message)
            }
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur()
        }
      }
    },
    [],
  )
  
  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group text-sm">
        <div className="flex flex-wrap gap-1">
          {issueLabels.map((label) => {
            return (
              <Badge key={label.id} variant="secondary">
                {label.name}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") {
                      const result = await deleteIssueLabel(issueId, label.id)

                      if (result.code === "error") {
                        console.error(result.message)
                      }

                      toast(`Label "${label.name}" removed`)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={async () => {
                    const result = await deleteIssueLabel(issueId, label.id)

                    if (result.code === "error") {
                      console.error(result.message)
                    }

                    toast(`Label "${label.name}" removed`)
                  }}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )
          })}

          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Add label..."
            className="border-none bg-transparent p-0 text-xs placeholder:text-muted-foreground focus:ring-0"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && labels.length > 0 ? (
          <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {labels
                // Remove objects from labels based on issueLabels
                .filter(
                  (item) =>
                    !issueLabels.some(
                      (filterItem) => filterItem.id === item.id,
                    ),
                )
                .map((label) => {
                  return (
                    <CommandItem
                      key={label.name}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onSelect={async (value) => {
                        const result = await addIssueLabel(issueId, label.id)

                        if (result.code === "error") {
                          toast(`Error: ${result.message}`)
                        }

                        toast(`Label "${label.name}" added`)
                      }}
                      className={"cursor-pointer"}
                    >
                      {label.name}
                    </CommandItem>
                  )
                })}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  )
}
"use client"

import { Alert, AlertActions, AlertDescription, AlertTitle } from "@/components/catalyst/alert"
import { Button } from "@/components/catalyst/button"
import { TrashIcon } from "@heroicons/react/16/solid"
import { useAction } from "next-safe-action/hooks"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { deleteIssue } from "../_actions/delete-issue"

export function DeleteIssueButton({ issueId, workspaceId }: { issueId: number; workspaceId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { execute, result } = useAction(deleteIssue, {
    onSuccess: () => {
      setIsOpen(false)
      toast.success("Issue deleted successfully")
      router.push(`/${workspaceId}/issues`)
    },
    onError: (error) => {
      toast.error("Failed to delete issue: ", error)
    },
  })

  const handleDelete = () => {
    execute({ issueId })
  }

  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true)
        }}
        plain
      >
        <TrashIcon className="size-4" />
        Delete issue
      </Button>
      <Alert
        onClose={() => {
          setIsOpen(false)
        }}
        open={isOpen}
      >
        <AlertTitle>Are you sure you want to delete this issue?</AlertTitle>
        <AlertDescription>
          This action cannot be undone. This will permanently delete the issue and all associated data.
        </AlertDescription>
        <AlertActions>
          <Button
            onClick={() => {
              setIsOpen(false)
            }}
            plain
          >
            Cancel
          </Button>
          <Button color="red" disabled={result.isLoading} onClick={handleDelete}>
            <TrashIcon className="size-4" />
            {result.isLoading ? "Deleting..." : "Delete"}
          </Button>
        </AlertActions>
      </Alert>
    </>
  )
}

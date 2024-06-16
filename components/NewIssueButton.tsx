"use client"
import Link from "next/link"
import { PlusIcon } from "@heroicons/react/20/solid"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

function NewIssueButton() {
  const pathname = usePathname()
  const projectUrl = pathname.split("/")[2]
  return (
    <Button
      asChild
      className="-mx-2 justify-start gap-x-2"
      size="sm"
      variant="outline"
    >
      <Link href={`${projectUrl}/new-issue`}>
        <PlusIcon aria-hidden="true" className="-ml-0.5 size-4" />
        New Issue
      </Link>
    </Button>
  )
}

export { NewIssueButton }

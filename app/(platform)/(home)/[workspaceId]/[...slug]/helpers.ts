import { $Enums } from "@prisma/client"
import { RedirectType, notFound, permanentRedirect } from "next/navigation"

export interface User {
  userId: string
}
interface Issue {
  title: string
  id: number
  status: $Enums.Status
  priority: $Enums.Priority
  description: string
  assigneeId: string | null
  createdAt: Date
  owner: {
    name: string
    image: string | null
  } | null
}

const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-/, "")
    .replace(/-$/, "") // Remove dash if it's the last character
}

const titleToSlug = (title: string): string => {
  const uriSlug = slugify(title)
  return encodeURI(uriSlug)
}

const getIssueProjectSlug = (projectId: string, issueId: string): string => {
  return `${projectId}-${issueId}`
}

export function parseIssueCode(issueCode: string): [string, string] {
  const [projectId, issueId] = issueCode.split("-")
  if (!projectId || !issueId) {
    notFound()
  }
  return [projectId, issueId]
}

export function checkAndRedirect(
  currentTitle: string,
  issue: Issue,
  projectId: string,
  issueId: string,
) {
  const issueSlug = titleToSlug(issue.title)
  if (issueSlug !== currentTitle) {
    const redirectUrl = `/issue/${getIssueProjectSlug(projectId, issueId)}/${issueSlug}`
    permanentRedirect(redirectUrl, RedirectType.replace)
  }
}

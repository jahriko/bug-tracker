import { notFound } from "next/navigation"

export interface User {
  userId: string
}

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-/, "")
    .replace(/-$/, "") // Remove dash if it's the last character
}

export function validateSlug(slug: string[]): [string, string, string] {
  if (slug.length !== 3) {
    notFound()
  }
  return slug as [string, string, string]
}

export function parseIssueCode(issueCode: string): [string, string] {
  const [projectId, issueId] = issueCode.split("-")
  if (!projectId || !issueId) {
    return notFound()
  }
  return [projectId, issueId]
}

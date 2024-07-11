/* eslint-disable @next/next/no-img-element */
import { Badge, BadgeProps } from "@/components/catalyst/badge"
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "@/components/catalyst/dropdown"
import { Input, InputGroup } from "@/components/catalyst/input"
import {
  Pagination,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "@/components/catalyst/pagination"
import { Table, TableBody, TableCell, TableRow } from "@/components/catalyst/table"
import { getCurrentUser } from "@/lib/get-current-user"
import { getPrisma } from "@/lib/getPrisma"
import prisma from "@/lib/prisma"
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid"
import {
  Ban,
  CheckCircle2,
  CircleDashed,
  CircleDot,
  CircleHelp,
  Loader2,
  PauseCircle,
} from "lucide-react"
import { DateTime } from "luxon"
import { notFound, redirect } from "next/navigation"
import NewIssueDialog from "../_components/new-issue-dialog"

export default async function IssuePage({
  params,
  searchParams,
}: {
  params: { workspaceId: string }
  searchParams: Record<string, string | string[] | undefined>
}) {
  const session = await getCurrentUser()
  await updateLastWorkspaceUrl(session, params.workspaceId)

  const page = Number(searchParams.page) || 1
  const pageSize = 20

  const workspaceData = await getWorkspaceData(session.userId, params.workspaceId)
  if (!workspaceData) notFound()

  const projectIds = workspaceData.projects.map((p) => p.id)
  const { issues, totalIssues } = await getIssuesData(
    session.userId,
    projectIds,
    page,
    pageSize,
  )
  const projectMembers = workspaceData.projects.flatMap((p) =>
    p.members.map((m) => m.user),
  )

  const labels = await prisma.label.findMany()

  if (totalIssues === 0) return redirect("/create-workspace")

  const paginationData = getPaginationData(page, totalIssues, pageSize)

  return (
    <main className="flex flex-1 flex-col pb-2 lg:px-2">
      <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
        <div className="mx-auto max-w-6xl">
          {/* -- */}

          <div className="py-6">
            <main className="container">
              <div>
                <div className="flex items-center gap-x-2">
                  <div className="flex-grow">
                    <InputGroup className="w-full">
                      <MagnifyingGlassIcon />
                      <Input
                        aria-label="Search"
                        name="search"
                        placeholder="Search&hellip;"
                      />
                    </InputGroup>
                  </div>
                  <NewIssueDialog assignees={projectMembers} labels={labels} />
                </div>
                <IssueTable issues={issues} workspaceId={params.workspaceId} />
                <TablePagination {...paginationData} />
              </div>
            </main>
          </div>

          {/* -- */}
        </div>
      </div>
    </main>
  )
}

function IssueTable({ issues, workspaceId }: { issues: any[]; workspaceId: string }) {
  return (
    <Table>
      <TableBody>
        {issues.map((issue) => (
          <TableRow
            href={`/${workspaceId}/${issue.project.title}/${issue.id}`}
            key={issue.id}
          >
            <TableCell>
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-x-2">
                    <Dropdown>
                      <DropdownButton
                        aria-label="More options"
                        plain
                        className="!rounded-full !p-0 data-[hover]:bg-transparent"
                        // className="h-auto w-0 !text-zinc-500 !data-[hover]:bg-none"
                      >
                        {renderStatus(issue.status)}
                      </DropdownButton>
                      <DropdownMenu anchor="bottom start">
                        <DropdownItem href="/users/1">View</DropdownItem>
                        <DropdownItem href="/users/1/edit">Edit</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    <div className="flex gap-x-3">
                      <div className="font-medium">{issue.title}</div>
                      <span className="flex gap-x-1">
                        {issue.labels.map((label) => (
                          <Badge
                            color={(label.label.color as BadgeProps["color"]) || "zinc"}
                            key={label.label.id}
                          >
                            {label.label.name}
                          </Badge>
                        ))}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-zinc-500">
                    <span className="hover:text-zinc-700">
                      {issue.project.title.slice(0, 3).toUpperCase()}-{issue.id} opened{" "}
                      {DateTime.fromJSDate(issue.createdAt).toRelative()} by{" "}
                      {issue.owner?.name}
                    </span>
                  </div>
                </div>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function TablePagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  createPageUrl,
}: {
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  createPageUrl: (pageNum: number) => string
}) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <Pagination aria-label="Page navigation" className="mt-6">
      <PaginationPrevious
        aria-disabled={!hasPreviousPage}
        className={!hasPreviousPage ? "pointer-events-none opacity-50" : ""}
        href={hasPreviousPage ? createPageUrl(currentPage - 1) : "#"}
      >
        Previous
      </PaginationPrevious>
      <PaginationList>
        {pageNumbers.map((pageNum) => (
          <PaginationPage
            current={currentPage === pageNum}
            href={createPageUrl(pageNum)}
            key={pageNum}
          >
            {pageNum}
          </PaginationPage>
        ))}
      </PaginationList>
      <PaginationNext
        aria-disabled={!hasNextPage}
        className={!hasNextPage ? "pointer-events-none opacity-50" : ""}
        href={hasNextPage ? createPageUrl(currentPage + 1) : "#"}
      >
        Next
      </PaginationNext>
    </Pagination>
  )
}

async function updateLastWorkspaceUrl(
  session: {
    userId: string
    lastWorkspaceUrl: string
  },
  workspaceId: string,
) {
  if (session.lastWorkspaceUrl !== workspaceId) {
    await prisma.user.update({
      where: { id: session.userId },
      data: { lastWorkspaceUrl: workspaceId },
    })
  }
}

async function getWorkspaceData(userId: string, workspaceId: string) {
  return await getPrisma(userId).workspace.findUnique({
    where: { url: workspaceId },
    include: {
      projects: {
        select: {
          id: true,
          title: true,
          members: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      },
    },
  })
}

async function getIssuesData(
  userId: string,
  projectIds: number[],
  page: number,
  pageSize: number,
) {
  const skip = (page - 1) * pageSize

  const [issues, totalIssues] = await Promise.all([
    getPrisma(userId).issue.findMany({
      where: { projectId: { in: projectIds } },
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        project: { select: { id: true, title: true } },
        owner: { select: { name: true, image: true } },
        title: true,
        status: true,
        assignedUser: { select: { id: true, name: true, image: true } },
        priority: true,
        labels: {
          select: {
            label: { select: { id: true, name: true, color: true } },
          },
        },
      },
    }),
    prisma.issue.count({ where: { projectId: { in: projectIds } } }),
  ])

  return { issues, totalIssues }
}

function getPaginationData(currentPage: number, totalIssues: number, pageSize: number) {
  const totalPages = Math.ceil(totalIssues / pageSize)

  return {
    currentPage,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    createPageUrl: (pageNum: number) => `?page=${pageNum}`,
  }
}

function renderStatus(status: string) {
  switch (status) {
    case "backlog":
      return <CircleDashed className="size-[1.10rem] text-zinc-500 hover:text-black" />
    case "open":
      return <CircleDot className="size-[1.10rem] text-green-700 hover:text-black" />
    case "in-progress":
      return <Loader2 className="size-[1.10rem] text-yellow-700 hover:text-black" />
    case "closed":
      return <CheckCircle2 className="size-[1.10rem] text-indigo-700 hover:text-black" />
    case "paused":
      return <PauseCircle className="size-[1.10rem] text-zinc-500 hover:text-black" />
    case "duplicate":
      return <Ban className="size-[1.10rem] text-zinc-500 hover:text-black" />
    default:
      return <CircleHelp className="size-[1.10rem] text-zinc-500" />
  }
}

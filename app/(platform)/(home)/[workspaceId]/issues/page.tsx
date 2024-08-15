/* eslint-disable @next/next/no-img-element */
import { InputGroup } from "@/components/catalyst/input"
import {
  Pagination,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "@/components/catalyst/pagination"
import { getCurrentUser } from "@/lib/get-current-user"
import { getPrisma } from "@/lib/getPrisma"
import prisma from "@/lib/prisma"
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid"
import { Priority, Prisma, Status } from "@prisma/client"
import { notFound } from "next/navigation"
import NewIssueDialog from "../_components/new-issue-dialog"
import IssueTable from "./_components/issue-table"
import SearchInput from "./_components/search-input"

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
  const filter = searchParams.filter as string | undefined
  const status = searchParams.status as Status | undefined
  const priority = searchParams.priority as Priority | undefined
  const search = searchParams.search as string | undefined

  const workspaceData = await getWorkspaceData(session.userId, params.workspaceId)
  if (!workspaceData) notFound()

  const projectIds = workspaceData.projects.map((p) => p.id)
  const { issues, totalIssues } = await getIssuesData(
    session.userId,
    projectIds,
    page,
    pageSize,
    filter,
    status,
    priority,
    search,
  )

  const projectMembers = workspaceData.projects.flatMap((p) => p.members.map((m) => m.user))

  const labels = await prisma.label.findMany()

  const paginationData = getPaginationData(page, totalIssues, pageSize)

  return (
    <main className="flex flex-1 flex-col pb-2 lg:px-2">
      <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
        <div className="mx-auto max-w-6xl">
          {/* -- */}

          <div className="flex items-center gap-x-2">
            <div className="flex-grow">
              <InputGroup className="w-full">
                <MagnifyingGlassIcon />
                <SearchInput initialSearch={search} workspaceId={params.workspaceId} />
              </InputGroup>
            </div>
            <NewIssueDialog
              assignees={projectMembers}
              hasProjects={workspaceData.projects.length > 0}
              labels={labels}
              projects={workspaceData.projects}
            />
          </div>
          <div className="py-6">
            <main>
              <div>
                {/* <div className="mt-2 flex items-center gap-x-2">
                  <IssueFilterSelect
                    labels={labels}
                    projectMembers={projectMembers}
                    projects={workspaceData.projects}
                  />
                </div> */}
                {issues.length > 0 ? (
                  <>
                    <IssueTable issues={issues} workspaceId={params.workspaceId} />
                    <TablePagination {...paginationData} />
                  </>
                ) : (
                  <NoIssuesFound search={search} />
                )}
              </div>
            </main>
          </div>

          {/* -- */}
        </div>
      </div>
    </main>
  )
}

function NoIssuesFound({ search }: { search: string | undefined }) {
  return (
    <div className="mt-8 text-center">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No issues found</h3>
      {search ? (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          No issues match the search term `{search}`. Try a different search or clear the filter.
        </p>
      ) : null}
      {!search && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          There are no issues in this workspace yet. Create a new issue to get started.
        </p>
      )}
    </div>
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
          <PaginationPage current={currentPage === pageNum} href={createPageUrl(pageNum)} key={pageNum}>
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
  filter?: string,
  status?: Status | "all",
  priority?: Priority | "all",
  search?: string,
) {
  const skip = (page - 1) * pageSize

  const whereClause: Prisma.IssueWhereInput = { projectId: { in: projectIds } }

  if (filter) {
    if (filter === "owned") {
      whereClause.ownerId = userId
    } else {
      whereClause.ownerId = filter
    }
  }

  if (status && status !== "all") {
    whereClause.status = status
  }

  if (priority && priority !== "all") {
    whereClause.priority = priority
  }

  if (search) {
    whereClause.OR = [{ title: { contains: search, mode: "insensitive" } }]
  }

  const [issues, totalIssues] = await Promise.all([
    getPrisma(userId).issue.findMany({
      where: whereClause,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        project: { select: { id: true, title: true, identifier: true } },
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
    prisma.issue.count({ where: whereClause }),
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

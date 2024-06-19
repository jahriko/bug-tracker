/* eslint-disable @next/next/no-img-element */
import { auth } from "@/auth"
import CreateProject from "@/components/CreateProject"
import { Heading } from "@/components/catalyst/heading"
import { getSession } from "@/lib/get-current-user"
import prisma from "@/lib/prisma"
import { classNames } from "@/lib/utils"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

async function getWorkspace(workspaceId: string) {
  try {
    const workspace = await prisma.workspace.findFirstOrThrow({
      where: { name: workspaceId },
      select: {
        id: true,
        name: true,
        projects: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })
    return workspace
  } catch (error: unknown) {
    notFound()
  }
}

export default async function WorkspacePage({
  params,
}: {
  params: { workspaceId: string }
}) {
  const session = await getSession()

  const lastWorkspace = session.lastWorkspace

  if (session && lastWorkspace !== params.workspaceId) {
    await prisma.user.update({
      where: { id: session.userId },
      data: { lastWorkspace: params.workspaceId },
    })
  }

  const workspaceCount = await prisma.workspace.count()

  const workspaceData = await getWorkspace(params.workspaceId)

  const getProjectsFromWorkspace = workspaceData.projects

  if (workspaceCount === 0) {
    return redirect("/create-workspace")
  }

  return (
    <div>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
        <Heading>Projects</Heading>
        <div className="flex gap-4">
          <CreateProject />
        </div>
      </div>
      <div className="mt-6 px-4 sm:px-6 lg:px-8">
        <ul
          className="mx-auto mt-10 grid max-w-2xl auto-rows-fr grid-cols-1 gap-6  lg:mx-0 lg:max-w-none lg:grid-cols-4"
          // className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4"
          role="list"
        >
          {getProjectsFromWorkspace.map((project) => (
            <li
              className="relative col-span-1 flex rounded-md shadow-sm"
              key={project.id}
            >
              <div
                className={classNames(
                  "bg-gradient-to-b from-gray-700 via-gray-900 to-black",
                  "flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white",
                )}
              >
                {project.title.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white ">
                <div className="flex-1 truncate px-4 py-2 text-sm">
                  <Link
                    className="font-medium text-gray-900 hover:text-gray-600"
                    href={`${workspaceData.name}/${project.title}`}
                  >
                    {project.title}
                  </Link>
                  <p className="text-gray-500">12 Members</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* eslint-disable no-underscore-dangle */
/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/catalyst/button"
import { Input, InputGroup } from "@/components/catalyst/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getCurrentUser } from "@/lib/get-current-user"
import { getPrisma } from "@/lib/getPrisma"
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/16/solid"
import { ArrowUpIcon } from "@heroicons/react/20/solid"
import { ChatBubbleLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { redirect } from "next/navigation"
import SearchFilter from "./[discussionId]/search-filter"
import DiscussionFilter from "./discussion-filter"

export default async function Discussions({ params }: { params: { workspaceId: string } }) {
  const user = await getCurrentUser()

  console.log(params.workspaceId)

  if (!user) {
    redirect("/login")
  }

  const getDiscussions = await getPrisma(user.userId).discussion.findMany({
    include: {
      author: {
        select: {
          name: true,
        },
      },
      category: {
        select: {
          name: true,
          emoji: true,
        },
      },
      _count: {
        select: {
          posts: true,
        },
      },
    },
  })

  const getCategories = await getPrisma(user.userId).discussionCategory.findMany({
    where: {
      project: {
        workspace: {
          url: params.workspaceId,
        },
      },
    },
  })

  const getProjects = await getPrisma(user.userId).project.findMany({
    where: {
      workspace: {
        url: params.workspaceId,
      },
    },
  })

  const getWorkspaceMembers = await getPrisma(user.userId).workspaceMember.findMany({
    where: {
      workspace: {
        url: params.workspaceId,
      },
    },
    select: {
      user: {
        select: {
          name: true,
          id: true,
          image: true,
          email: true,
        },
      },
    },
  })

  console.log(getProjects)

  return (
    <main className="flex flex-1 flex-col pb-2 lg:px-2">
      <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
        <div className="lg:mx-auto lg:max-w-6xl">
          <div className="flex flex-col justify-between gap-y-2">
            <div className="flex w-full items-center gap-x-2">
              <div className="flex-grow">
                <InputGroup className="w-full">
                  <MagnifyingGlassIcon />
                  <Input placeholder="Search discussions..." type="search" />
                </InputGroup>
              </div>
              <Button>
                <PlusIcon />
                New Discussion
              </Button>
            </div>
            {/* <SearchFilter projects={getProjects} workspaceMembers={getWorkspaceMembers} /> */}
						<DiscussionFilter />
          </div>
          {/* Left + Middle content */}
          <div className="flex-1 md:flex">
            {/* Left content */}
            <div className="mb-8 w-full md:mb-0 md:w-[15rem]">
              <div>
                <div className="md:py-8">
                  <div className="flex items-center justify-between md:block">
                    {/* Button */}
                    <div className="mb-6 xl:hidden">
                      <button className="btn bg-indigo-500 text-white hover:bg-indigo-600 md:w-full">
                        Create Post
                      </button>
                    </div>
                  </div>
                  <div className="no-scrollbar -mx-4 flex flex-nowrap overflow-x-scroll px-4 md:block md:space-y-3 md:overflow-auto">
                    <div>
                      <div className="mb-3 text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">
                        Categories
                      </div>
                      <ul className="flex flex-nowrap md:mr-0 md:block">
                        {getCategories.map((category) => (
                          <li className="mr-0.5 md:mb-0.5 md:mr-0" key={category.id}>
                            <a className="flex items-center gap-x-2 whitespace-nowrap rounded py-2" href="#0">
                              <span className="inline-block flex size-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100 fill-current text-sm text-emerald-500">
                                {category.emoji}
                              </span>
                              <span className="inline-block text-sm font-medium text-slate-600 dark:text-slate-300">
                                {category.name}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle content */}
            <div className="flex-1 md:ml-8 xl:mx-4 2xl:mx-8">
              <div className="md:py-8">
                {/* Forum Entries */}
                <ul className="divide-y divide-gray-100" role="list">
                  {getDiscussions.map((discussion) => (
                    <li
                      className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-5 sm:flex-nowrap"
                      key={discussion.id}
                    >
                      {/* Upvote button */}
                      <div className="mr-4 flex flex-col items-center">
                        <button className="text-gray-400 hover:text-gray-500">
                          <ArrowUpIcon aria-hidden="true" className="h-5 w-5" />
                        </button>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {discussion.likeCount}
                        </span>
                      </div>

                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          {discussion.category ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="flex select-none items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="inline-block text-sm">{discussion.category?.emoji}</span>
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{discussion.category?.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : null}
                          <span className="flex items-center self-stretch text-gray-300 dark:text-gray-600">
                            <span className="h-full w-px bg-current" />
                          </span>
                          <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
                            <Link
                              className="hover:underline"
                              href={`/${params.workspaceId}/discussions/${discussion.id}`}
                            >
                              {discussion.title}
                            </Link>
                          </p>
                        </div>
                        {/* <p className="mt-1 line-clamp-1 text-sm text-gray-600 dark:text-gray-400">
                          {discussion.content}
                        </p> */}
                        <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
                          <p>
                            <Link className="underline underline-offset-2 hover:text-zinc-400" href="#">
                              {discussion.author.name}
                            </Link>
                          </p>
                          <svg className="h-0.5 w-0.5 fill-current" viewBox="0 0 2 2">
                            <circle cx={1} cy={1} r={1} />
                          </svg>
                          <p>
                            <time dateTime={discussion.createdAt.toISOString()}>
                              {discussion.createdAt.toLocaleDateString()}
                            </time>
                          </p>
                        </div>
                      </div>
                      <dl className="flex w-full flex-none justify-between gap-x-8 sm:w-auto">
                        <div className="flex w-16 gap-x-2.5">
                          <dt>
                            <span className="sr-only">Total comments</span>
                            {discussion.isResolved ? (
                              <CheckCircleIcon aria-hidden="true" className="h-6 w-6 text-green-500" />
                            ) : (
                              <ChatBubbleLeftIcon aria-hidden="true" className="h-6 w-6 text-gray-400" />
                            )}
                          </dt>
                          <dd className="text-sm leading-6 text-gray-900 dark:text-gray-100">
                            {discussion._count.posts}
                          </dd>
                        </div>
                      </dl>
                    </li>
                  ))}
                </ul>

                {/* Pagination */}
                <div className="mt-6 text-right">
                  <nav aria-label="Navigation" className="inline-flex" role="navigation">
                    <ul className="flex justify-center">
                      <li className="ml-3 first:ml-0">
                        <span className="btn border-slate-200 bg-white text-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-600">
                          &lt;- Previous
                        </span>
                      </li>
                      <li className="ml-3 first:ml-0">
                        <a
                          className="btn border-slate-200 bg-white text-indigo-500 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
                          href="#0"
                        >
                          Next -&gt;
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

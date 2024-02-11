/* eslint-disable @next/next/no-img-element */
import {
  CalendarIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/16/solid"
import { Separator } from "@/components/ui/separator"
import { getIssue } from "@/server/data/get-issue"
import IssueActivityFeed from "@/components/ActivityFeed"
import IssueComment from "@/components/CommentBox"
import { IssueFields } from "@/components/issue/IssueFields"
import { getCurrentUser } from "@/lib/get-current-user"
import { Textarea } from "@/components/ui/textarea"

export default async function IssueId({
  params,
}: {
  params: { issueId: string }
}) {
  const currentUser = await getCurrentUser()
  const issue = await getIssue(Number(params.issueId))

  return (
    <div className="mx-auto max-w-[1300px] py-8 xl:py-10 ">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 xl:grid xl:grid-cols-3">
        <div className="xl:col-span-2 xl:border-r xl:border-gray-200 xl:pr-8">
          <div>
            <div>
              <div className="md:flex md:items-center md:justify-between md:space-x-4">
                <div>
                  <h1 className="text-xl font-medium text-gray-900">
                    {issue.title}
                  </h1>
                </div>
              </div>
              <aside className="mt-8 xl:hidden">
                <h2 className="sr-only">Details</h2>
                <div className="space-y-5">
                  <div className="flex items-center space-x-2">
                    <ChatBubbleLeftEllipsisIcon
                      aria-hidden="true"
                      className="h-5 w-5 text-gray-400"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      4 comments
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarIcon
                      aria-hidden="true"
                      className="h-5 w-5 text-gray-400"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      Created on <time dateTime="2020-12-02">Dec 2, 2020</time>
                    </span>
                  </div>
                </div>
                <div className="mt-6 space-y-8 border-b border-t border-gray-200 py-6">
                  <div>
                    <h2 className="text-sm font-medium text-gray-500">
                      Assignees
                    </h2>
                    <ul className="mt-3 space-y-3" role="list">
                      <li className="flex justify-start">
                        <a className="flex items-center space-x-3" href="#">
                          <div className="flex-shrink-0">
                            <img
                              alt=""
                              className="h-5 w-5 rounded-full"
                              src="https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
                            />
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {getIssue.assignee?.name ?? "No assignee"}
                          </div>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h2 className="text-sm font-medium text-gray-500">
                      Labels
                    </h2>
                    <ul className="mt-2 leading-8" role="list">
                      <li className="inline">
                        <a
                          className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5"
                          href="#"
                        >
                          <div className="absolute flex flex-shrink-0 items-center justify-center">
                            <span
                              aria-hidden="true"
                              className="h-1.5 w-1.5 rounded-full bg-rose-500"
                            />
                          </div>
                          <div className="ml-3.5 text-sm font-medium text-gray-900">
                            Bug
                          </div>
                        </a>
                      </li>
                      <li className="inline">
                        <a
                          className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5"
                          href="#"
                        >
                          <div className="absolute flex flex-shrink-0 items-center justify-center">
                            <span
                              aria-hidden="true"
                              className="h-1.5 w-1.5 rounded-full bg-indigo-500"
                            />
                          </div>
                          <div className="ml-3.5 text-sm font-medium text-gray-900">
                            Accessibility
                          </div>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </aside>
              <div className="py-3 xl:pb-0 xl:pt-6">
                <h2 className="sr-only">Description</h2>
                <div className="prose max-w-none text-sm lg:prose-sm">
                  {/*{issue.description}*/}
                  <Textarea
                    className="overflow-y-hidden border-none p-0"
                    spellCheck={false}
                  >
                    {issue.description}
                  </Textarea>
                </div>
              </div>
            </div>
          </div>
          <section aria-labelledby="activity-title" className="mt-8 xl:mt-10">
            <div>
              <div className="divide-y divide-gray-200">
                <Separator />
                <div className="pt-6">
                  <div className="flow-root">
                    <IssueActivityFeed />
                  </div>
                  <div className="mt-6">
                    <div className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div className="relative ml-2">
                          <img
                            alt=""
                            className="flex size-6 items-center justify-center rounded-full bg-gray-400 ring-8 ring-white"
                            src={currentUser?.image ?? undefined}
                          />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <IssueComment issueId={params.issueId} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <aside className="xl:pl-8">
          <div className="space-y-6">
            <div className="flex-row items-center space-y-4">
              <h2 className="text-sm font-medium text-gray-500">Status</h2>
              <UpdateStatusBox issueId={params.issueId} status={status} />
            </div>

            <div className="flex-row items-center space-y-4">
              <h2 className="text-sm font-medium text-gray-500">Priority</h2>
              <UpdatePriorityBox priority={priority} issueId={params.issueId} />
            </div>

            <div className="flex-row items-center space-y-4">
              <h2 className="text-sm font-medium text-gray-500">Assignee</h2>
              <UpdateAssigneeBox
                assignees={users}
                assigneeId={issue.assigneeId}
                issueId={params.issueId}
              />
            </div>

            <div className="flex-row items-center space-y-4">
              <h2 className="text-sm font-medium text-gray-500">Labels</h2>
              <UpdateLabelBox issueLabels={issueLabels} issueId={Number(params.issueId)} labels={labels} />
            </div>

            <div className="flex-row items-center space-y-4">
              <h2 className="text-sm font-medium text-gray-500">Project</h2>
              {/*<ProjectBox projectId={issue.projectId} projects={projects} />*/}
              <UpdateProjectBox
                projects={projects}
                projectId={issue.projectId}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
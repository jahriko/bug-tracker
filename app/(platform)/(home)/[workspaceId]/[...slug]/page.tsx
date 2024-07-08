import Editor from "@/components/RichTextEditor/text-editor"
import { Avatar } from "@/components/catalyst/avatar"
import { Badge } from "@/components/catalyst/badge"
import { Button } from "@/components/catalyst/button"
import { Divider } from "@/components/catalyst/divider"
import { Textarea } from "@/components/catalyst/textarea"
import { getCurrentUser } from "@/lib/get-current-user"
import { LockClosedIcon } from "@heroicons/react/24/outline"
import { DateTime } from "luxon"
import { notFound, redirect } from "next/navigation"
import ActivityFeed from "./_components/activity-feed"
import { BorderlessInput } from "./_components/borderless-input"
import {
  AssigneeProperty,
  PriorityProperty,
  StatusProperty,
} from "./_components/issue-details"
import { getActivities, getIssueByProject } from "./_data/issue"
import { checkAndRedirect, parseIssueCode, validateSlug } from "./helpers"

export default async function IssuePage({
  params,
}: {
  params: {
    slug: string[]
  }
}) {
  const { slug } = params

  const session = await getCurrentUser()
  if (!session) {
    redirect("/login")
  }

  const [issueCode, title] = validateSlug(slug)
  const [projectId, issueId] = parseIssueCode(issueCode)

  const issue = await getIssueByProject(session, projectId, issueId)
  if (!issue) {
    notFound()
  }

  // Self-healing magic ✨
  checkAndRedirect(title, issue, projectId, issueId)

  const activities = await getActivities(session.userId, issueId)

  // This is used for server actions to upsert
  // an activity log when a user modifies an issue property
  const lastActivity = activities.at(-1) ?? { issueActivity: "None", id: -1 }
  const lastActivityInfo = {
    activityType: lastActivity.issueActivity,
    activityId: lastActivity.id,
  }

  return (
    <main className="flex-1">
      <div className="py-8 xl:py-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 xl:grid xl:max-w-full xl:grid-cols-4">
          <div className="dark:border-white/10 xl:col-span-3 xl:border-r xl:border-gray-200 xl:pr-8">
            <div>
              <div>
                <div className="md:flex md:items-center md:justify-between md:space-x-4 xl:pb-2">
                  <div>
                    <BorderlessInput
                      className="dark:text-white [&>*]:w-full [&>*]:text-2xl [&>*]:font-semibold"
                      readOnly
                      value={issue.title}
                    />

                    <p className="mt-2 flex items-center gap-x-1.5 text-sm text-gray-500">
                      <Avatar className="size-4" src={issue.owner?.image} />
                      <a
                        className="font-medium text-gray-900 dark:text-gray-100"
                        href="#"
                      >
                        {issue.owner?.name}
                      </a>{" "}
                      created the issue ·{" "}
                      {DateTime.fromJSDate(issue.createdAt).toRelative()}
                    </p>
                  </div>
                </div>

                {/* 2nd Column */}
                <aside className="mt-8 xl:hidden">
                  <h2 className="sr-only">Details</h2>
                  <div className="space-y-5">
                    <div className="flex items-center space-x-2">
                      <LockClosedIcon
                        aria-hidden="true"
                        className="h-5 w-5 text-indigo-500"
                      />
                      <span className="text-sm font-medium text-indigo-700">
                        Duplicate Issue
                      </span>
                    </div>
                  </div>
                  <div className="mt-6 space-y-8 border-b border-t border-gray-200 py-6">
                    <div>
                      <h2 className="text-sm font-medium text-gray-500">Assignees</h2>
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
                              Eduardo Benz
                            </div>
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h2 className="text-sm font-medium text-gray-500">Tags</h2>
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
                          </a>{" "}
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
                          </a>{" "}
                        </li>
                      </ul>
                    </div>
                  </div>
                </aside>
                <div className="py-3 xl:pb-0 xl:pt-6">
                  <h2 className="sr-only">Description</h2>
                  <Editor />
                </div>
              </div>
            </div>
            <section aria-labelledby="activity-title" className="mt-8 xl:mt-10">
              <div>
                <div>
                  <Divider className="pb-4" />
                  <div className="pt-6">
                    {/* Activity feed*/}
                    <ActivityFeed activities={activities} />
                    <div className="mt-6">
                      <div className="flex space-x-3">
                        <div className="min-w-0 flex-1">
                          <form action="#">
                            <div>
                              <label className="sr-only" htmlFor="comment">
                                Comment
                              </label>
                              <Textarea
                                // className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm"
                                defaultValue=""
                                id="comment"
                                name="comment"
                                placeholder="Leave a comment"
                                rows={3}
                              />
                            </div>
                            <div className="mt-6 flex items-center justify-end">
                              <Button type="submit">Comment</Button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <aside className="hidden xl:block xl:pl-8">
            <h2 className="sr-only">Issue Details</h2>
            <div className="space-y-2">
              <div>
                <ul className="mt-1 space-y-1" role="list">
                  <li className="flex justify-start">
                    <StatusProperty
                      issueId={issue.id}
                      lastActivity={lastActivityInfo}
                      value={issue.status}
                    />
                  </li>
                </ul>
              </div>

              <div>
                <ul className="mt-1 space-y-1" role="list">
                  <li className="flex justify-start">
                    <PriorityProperty
                      issueId={issue.id}
                      lastActivity={lastActivityInfo}
                      value={issue.priority}
                    />
                  </li>
                </ul>
              </div>

              <div>
                <ul className="mt-1 space-y-1" role="list">
                  <li className="flex justify-start">
                    <AssigneeProperty
                      lastActivity={lastActivityInfo}
                      projectMembers={issue.project.members}
                      value={issue.assigneeId}
                    />
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6">
              <h2 className="text-xs font-medium text-gray-500">Labels</h2>
              <ul className="mt-2 space-x-1.5 leading-8" role="list">
                <li className="inline">
                  <Badge color="rose">Bug</Badge>
                </li>
                <li className="inline">
                  <Badge color="indigo">Accessibility</Badge>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

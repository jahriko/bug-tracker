/* eslint-disable @next/next/no-img-element */
// import Editor from "@/components/RichTextEditor/text-editor"
import { Avatar } from "@/components/catalyst/avatar"
import { Badge } from "@/components/catalyst/badge"
import { Button } from "@/components/catalyst/button"
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@/components/catalyst/description-list"
import { Divider } from "@/components/catalyst/divider"
import { Textarea } from "@/components/catalyst/textarea"
import { getCurrentUser } from "@/lib/get-current-user"
import { LockClosedIcon } from "@heroicons/react/24/outline"
import { DateTime } from "luxon"
import dynamic from "next/dynamic"
import { RedirectType, notFound, redirect } from "next/navigation"
import {
  ActivityFeed,
  ActivityItem,
  AssignedActivity,
  CommentActivity,
  DescriptionActivity,
  LabelActivity,
  PriorityActivity,
  StatusActivity,
  TitleActivity,
} from "./_components/activity-feed"
import {
  AssigneeProperty,
  PriorityProperty,
  StatusProperty,
} from "./_components/issue-details"
import { getActivities, getIssueByProject } from "./_data/issue"
import { parseIssueCode, slugify } from "./helpers"

const Editor = dynamic(() => import("./_components/editor"), { ssr: false })

export default async function IssuePage({
  params,
}: {
  params: {
    slug: string[]
    workspaceId: string
  }
}) {
  const { slug, workspaceId } = params
  if (slug.length > 3 || slug.length <= 1) {
    return notFound()
  }

  const session = await getCurrentUser()
  if (!session) {
    redirect("/login")
  }

  const [, issueCode, title] = slug
  const [projectId, issueId] = parseIssueCode(issueCode)

  const issue = await getIssueByProject(session, projectId, issueId)
  if (!issue) {
    notFound()
  }

  // Self-healing magic ✨
  const issueSlug = slugify(issue.title)
  if (issueSlug !== title) {
    const redirectUrl = `/${workspaceId}/issue/${projectId}-${issueId}/${issueSlug}`
    redirect(redirectUrl, RedirectType.replace)
  }

  const activities = await getActivities(session.userId, issueId)

  // This is used for server actions to upsert
  // an activity log when a user modifies an issue property
  const lastActivity = activities.at(-1) ?? { issueActivity: "None", id: -1 }
  const lastActivityInfo = {
    activityType: lastActivity.issueActivity,
    activityId: lastActivity.id,
  }

  return (
    <main className="flex flex-1 flex-col pb-2 lg:px-2">
      <div className="flex flex-1 lg:rounded-lg lg:bg-white lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
        <div className="flex flex-1 flex-col lg:flex-row">
          <div className="mx-auto w-full max-w-4xl flex-grow p-6 lg:p-10">
            {/* -- */}
            <main className="flex-1">
              <div className="py-8">
                <div className="px-2 lg:px-0 xl:max-w-full">
                  <div className="dark:border-white/10">
                    <div>
                      <div>
                        <div className="md:flex md:items-center md:justify-between md:space-x-4 xl:pb-2">
                          <div className="w-full">
                            <EditableTitle initialTitle={issue.title} />

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
                            <ActivityFeed activities={activities} issue={issue}>
                              <ActivityItem>
                                <div className="relative flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-200">
                                  <Avatar
                                    alt={issue.owner?.name ?? "User"}
                                    className="size-5"
                                    src={issue.owner?.image ?? ""}
                                  />
                                </div>
                                <div className="flex gap-x-2">
                                  <div className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
                                    <span className="font-medium text-gray-900">{issue.owner?.name}</span> created this
                                    issue{" "}
                                  </div>
                                  <span>⋅</span>
                                  <time
                                    className="flex-none py-0.5 text-xs leading-5 text-gray-500"
                                    dateTime={new Date(issue.createdAt).toISOString()}
                                  >
                                    {timeAgo(DateTime.fromISO(new Date(issue.createdAt).toISOString()))}
                                  </time>
                                </div>
                              </ActivityItem>

                              {activities.map((item, itemIdx) => (
                                <ActivityItem key={item.id} itemIdx={itemIdx}>
                                  {item.issueActivity === "TitleActivity" && <TitleActivity item={item} />}
                                  {item.issueActivity === "DescriptionActivity" && <DescriptionActivity item={item} />}
                                  {item.issueActivity === "StatusActivity" && <StatusActivity item={item} />}
                                  {item.issueActivity === "PriorityActivity" && <PriorityActivity item={item} />}
                                  {item.issueActivity === "AssignedActivity" && <AssignedActivity item={item} />}
                                  {item.issueActivity === "LabelActivity" && <LabelActivity item={item} />}
                                  {item.issueActivity === "CommentActivity" && (
                                    <CommentActivity comments={issue.comments} item={item} />
                                  )}
                                </ActivityItem>
                              ))}
                            </ActivityFeed>
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
                </div>
              </div>
            </main>
            {/* Here */}
          </div>
          {/* Right desktop sidebar */}
          <div className="hidden w-80 flex-shrink-0 overflow-y-auto rounded-r-lg border-l border-zinc-200 bg-white dark:border-zinc-700 lg:block">
            <div className="sticky top-0 p-8">
              <DescriptionList>
                {" "}
                {/* Add vertical gap between rows */}
                <DescriptionTerm className="flex items-center">Status</DescriptionTerm>
                <DescriptionDetails className="flex items-center">
                  <StatusProperty
                    issueId={issue.id}
                    lastActivity={lastActivityInfo}
                    value={issue.status}
                  />
                </DescriptionDetails>
                <DescriptionTerm className="flex items-center">Priority</DescriptionTerm>
                <DescriptionDetails className="flex items-center">
                  <PriorityProperty
                    issueId={issue.id}
                    lastActivity={lastActivityInfo}
                    value={issue.priority}
                  />
                </DescriptionDetails>
                <DescriptionTerm className="flex items-center">
                  Assigned to
                </DescriptionTerm>
                <DescriptionDetails className="flex items-center">
                  <AssigneeProperty
                    lastActivity={lastActivityInfo}
                    projectMembers={issue.project.members}
                    value={issue.assignedUserId}
                  />
                </DescriptionDetails>
              </DescriptionList>

              <div className="border-t border-gray-900/5 py-8">
                <div>
                  <h2 className="text-sm text-gray-500">Labels</h2>
                  <ul className="mt-2 space-x-1.5 leading-8" role="list">
                    <li className="inline">
                      <Badge color="rose">Bug</Badge>
                    </li>
                    <li className="inline">
                      <Badge color="indigo">Accessibility</Badge>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

import dynamic from 'next/dynamic';
import { RedirectType, notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Avatar } from '@/components/catalyst/avatar';
import { Divider } from '@/components/catalyst/divider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { COLORS } from '@/lib/colors';
import { getPrisma } from '@/lib/getPrisma';
import prisma from '@/lib/prisma';
import { getUserDetails } from '@/lib/supabase/auth';
import { classNames } from '@/lib/utils';
import { ActivityFeed } from './_components/activity-feed';
import AddLabelButton from './_components/add-label-button';
import {
  AssigneeProperty,
  DescriptionField,
  PriorityProperty,
  ProjectProperty,
  StatusProperty,
} from './_components/issue-properties';
import {
  type IssueActivityList,
  getActivities,
  getIssueByProject,
} from './_data/issue';
import { slugify } from './helpers';
import {
  type ActivityType,
  type Issue,
  type IssueLabel,
  type IssuePageParams,
  type Label,
  type LastActivity,
} from './types';
import { IssueDesktopSidebar } from './_components/issue-desktop-sidebar';
import Editor from '@/components/lexical_editor/editor';
import { CommentEditor } from '@/components/text-editor/comment-editor';

export default async function IssuePage({
  params,
}: {
  params: {
    slug: string[];
    workspaceId: string;
  };
}) {
  const { slug, workspaceId } = params;

  const { user } = await getUserDetails();
  if (!user) {
    redirect('/login');
  }

  const [, issueCode = '', title = ''] = slug;
  const [projectIdentifier = '', issueId = ''] = issueCode.split('-');

  const issue = await getIssueByProject(user.id, projectIdentifier, issueId);
  if (!issue) {
    notFound();
  }

  const projects = await getPrisma(user.id).project.findMany({
    where: { identifier: projectIdentifier },
  });

  const [labels, activities] = await Promise.all([
    prisma.label.findMany(),
    getActivities(user.id, issueId),
  ]);

  const issueLabels = issue.labels;

  // Self-healing URL
  const issueSlug = slugify(issue.title);
  if (issueSlug !== title) {
    redirect(
      `/${workspaceId}/issue/${projectIdentifier}-${issueId}/${issueSlug}`,
      RedirectType.replace,
    );
  }

  const labelActivities = activities.filter(
    (
      a,
    ): a is Extract<
      IssueActivityList[number],
      { issueActivity: 'LabelActivity' }
    > => a.issueActivity === 'LabelActivity',
  );

  const lastActivity = activities.at(-1) ?? { issueActivity: 'None', id: -1 };
  const lastActivityInfo: LastActivity = {
    activityType: lastActivity.issueActivity as ActivityType,
    activityId: lastActivity.id,
  };

  return (
    <main className="flex flex-1 flex-col pb-2 lg:px-2">
      <div className="flex flex-1 lg:rounded-lg lg:bg-white lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
        <div className="flex flex-1 flex-col lg:flex-row">
          <ScrollArea className="flex-grow lg:h-[calc(100vh-4rem)]">
            <div className="mx-auto w-full max-w-4xl p-6 lg:p-10">
              <main className="flex-1">
                <div className="px-2 lg:px-0 xl:max-w-full">
                  <div className="dark:border-white/10">
                    <div>
                      <div className="md:flex md:items-center md:justify-between md:space-x-4 xl:pb-2">
                        <div className="w-full">
                          <Editor
                            initialContent={issue.title}
                            placeholderText="Enter title"
                            type="title"
                          />
                        </div>
                      </div>

                      <aside className="mt-8 xl:hidden">
                        <h2 className="sr-only">Details</h2>
                        <div className="flex flex-wrap gap-4">
                          <div className="w-full sm:w-auto">
                            <Suspense fallback={<p>Loading</p>}>
                              <StatusProperty
                                issueId={issue.id}
                                lastActivity={lastActivityInfo}
                                value={issue.status}
                              />
                            </Suspense>
                          </div>
                          <div className="w-full sm:w-auto">
                            <Suspense fallback={<p>Loading</p>}>
                              <PriorityProperty
                                issueId={issue.id}
                                lastActivity={lastActivityInfo}
                                value={issue.priority}
                              />
                            </Suspense>
                          </div>
                          <div className="w-full sm:w-auto">
                            <Suspense fallback={<p>Loading</p>}>
                              <AssigneeProperty
                                issueId={issue.id}
                                lastActivity={lastActivityInfo}
                                projectMembers={issue.project.members}
                                value={issue.assignedUserId}
                              />
                            </Suspense>
                          </div>
                          <div className="w-full sm:w-auto">
                            <Suspense fallback={<p>Loading</p>}>
                              <ProjectProperty
                                issueId={issue.id}
                                lastActivity={lastActivityInfo}
                                projects={projects}
                                value={issue.project.id}
                              />
                            </Suspense>
                          </div>
                        </div>
                        <div className="mt-6 border-b border-t border-gray-200 py-6">
                          <h2 className="text-sm font-medium text-gray-500">
                            Labels
                          </h2>
                          <ul className="mt-2 flex flex-wrap gap-2 leading-8">
                            {issueLabels.map((label) => {
                              return (
                                <li key={label.label.id} className="inline">
                                  <span className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-2xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
                                    <div
                                      className={classNames(
                                        COLORS[label.label.color] ??
                                          'bg-zinc-100',
                                        'flex-none rounded-full p-1',
                                      )}
                                    >
                                      <div className="size-2 rounded-full bg-current" />
                                    </div>
                                    {label.label.name}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                          <div className="mt-2">
                            <AddLabelButton
                              activities={labelActivities}
                              issueId={issue.id}
                              issueLabels={issueLabels}
                              labels={labels}
                            />
                          </div>
                        </div>
                      </aside>

                      <div className="py-2 xl:pb-0">
                        <h2 className="sr-only">Description</h2>
                        <DescriptionField
                          issueId={issue.id}
                          lastActivity={lastActivityInfo}
                          value={issue.description}
                        />
                      </div>
                    </div>
                  </div>
                  <section
                    aria-labelledby="activity-title"
                    className="mt-8 xl:mt-10"
                  >
                    <div>
                      <div>
                        <Divider className="pb-4" />
                        <div className="pt-6">
                          <ActivityFeed activities={activities} issue={issue} />
                          <div className="mt-6">
                            <div className="flex space-x-3">
                              <div className="min-w-0 flex-1">
                                <legend className="sr-only" htmlFor="comment">
                                  Comment
                                </legend>
                                <CommentEditor
                                  issueId={issue.id}
                                  lastActivity={lastActivityInfo}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </main>
            </div>
          </ScrollArea>

          <IssueDesktopSidebar
            activities={activities}
            issue={issue}
            issueLabels={issueLabels}
            labels={labels}
            lastActivityInfo={lastActivityInfo}
            projects={projects}
            workspaceId={workspaceId}
          />
        </div>
      </div>
    </main>
  );
}

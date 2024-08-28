import { Divider } from '@/components/catalyst/divider';
import { COLORS } from '@/lib/colors';
import { classNames } from '@/lib/utils';
import { type Project } from '../../projects/_data/project-data';
import { type IssueActivityList, type IssueByProject } from '../_data/issue';
import { type Label, type LastActivity } from '../types';
import AddLabelButton from './add-label-button';
import { DeleteIssueButton } from './delete-issue-button';
import {
  AssigneeProperty,
  PriorityProperty,
  ProjectProperty,
  StatusProperty,
} from './issue-properties';

export function IssueDesktopSidebar({
  issue,
  activities,
  labels,
  issueLabels,
  projects,
  lastActivityInfo,
  workspaceId,
}: {
  issue: IssueByProject;
  activities: IssueActivityList;
  labels: Label[];
  issueLabels: IssueByProject['labels'];
  projects: Project[];
  lastActivityInfo: LastActivity;
  workspaceId: string;
}) {
  const labelActivities = activities.filter(
    (
      a,
    ): a is Extract<
      IssueActivityList[number],
      { issueActivity: 'LabelActivity' }
    > => a.issueActivity === 'LabelActivity',
  );

  return (
    <div className="hidden w-auto flex-shrink-0 overflow-y-auto rounded-r-lg border-l border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 lg:block">
      <div className="p-6">
        <div className="h-full">
          <div className="flex w-72 flex-col">
            <div className="flex flex-col gap-4">
              <StatusProperty
                issueId={issue.id}
                lastActivity={lastActivityInfo}
                value={issue.status}
              />
              <PriorityProperty
                issueId={issue.id}
                lastActivity={lastActivityInfo}
                value={issue.priority}
              />
              <AssigneeProperty
                issueId={issue.id}
                lastActivity={lastActivityInfo}
                projectMembers={issue.project.members}
                value={issue.assignedUserId}
              />
              <div>
                <div className="space-y-2">
                  <span className="select-none text-xs font-medium text-zinc-400 dark:text-zinc-500">
                    Labels
                  </span>
                  <ul className="flex flex-wrap items-center gap-1.5">
                    {issueLabels.map((label) => (
                      <li key={label.label.id} className="inline">
                        <span className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-2xs font-medium text-zinc-900 ring-1 ring-inset ring-zinc-200 dark:text-zinc-100 dark:ring-zinc-700">
                          <div
                            className={classNames(
                              COLORS[label.label.color] ?? 'bg-zinc-100 dark:bg-zinc-800',
                              'flex-none rounded-full p-1',
                            )}
                          >
                            <div className="size-2 rounded-full bg-current" />
                          </div>
                          {label.label.name}
                        </span>
                      </li>
                    ))}
                    <li>
                      <AddLabelButton
                        activities={labelActivities}
                        issueId={issue.id}
                        issueLabels={issueLabels}
                        labels={labels}
                      />
                    </li>
                  </ul>
                </div>
              </div>
              <ProjectProperty
                issueId={issue.id}
                lastActivity={lastActivityInfo}
                projects={projects}
                value={issue.project.id}
              />
            </div>

            <Divider className="my-4" />
            <div>
              <DeleteIssueButton issueId={issue.id} workspaceId={workspaceId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

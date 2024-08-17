'use client';

import { TagIcon, UserCircleIcon } from '@heroicons/react/16/solid';
import {
  CheckCircle2,
  CircleDashed,
  CircleDot,
  Loader2,
  PauseCircle,
  PencilIcon,
} from 'lucide-react';
import { DateTime } from 'luxon';
import dynamic from 'next/dynamic';
import { createContext, useContext, type ReactNode } from 'react';

import { Avatar } from '@/components/catalyst/avatar';
import {
  MdiSignalCellular1,
  MdiSignalCellular2,
  MdiSignalCellular3,
  TablerLineDashed,
} from '@/components/icons';
import { COLORS } from '@/lib/colors';
import { classNames, timeAgo } from '@/lib/utils';

import { type IssueActivityType, type IssueType } from '../_data/issue';

import CommentOptions from './comment-options';

const Editor = dynamic(() => import('@/components/lexical_editor/editor'), {
  ssr: true,
});

interface ActivityFeedContextType {
  issue: IssueType;
  activities: IssueActivityType;
}

type GroupedLabelActivityType = Extract<
  IssueActivityType[number],
  { issueActivity: 'GroupedLabelActivity' }
>;

const ActivityFeedContext = createContext<ActivityFeedContextType | undefined>(
  undefined,
);

function useActivityFeed() {
  const context = useContext(ActivityFeedContext);
  if (!context) {
    throw new Error(
      'ActivityFeed components must be used within an ActivityFeed',
    );
  }
  return context;
}

/**
 * The time threshold (in milliseconds) used to determine if consecutive label activities should be grouped.
 * Label activities by the same user within this time frame will be grouped together.
 */
const GROUP_TIME_THRESHOLD = 1 * 60 * 1000; // 1 minute in milliseconds

type LabelActivityType = Extract<
  IssueActivityType[number],
  { issueActivity: 'LabelActivity' }
>;

const createNewLabelGroup = (
  activity: LabelActivityType,
): GroupedLabelActivityType => ({
  id: `group-${activity.id}`,
  issueActivity: 'GroupedLabelActivity',
  user: activity.user,
  createdAt: activity.createdAt,
  addedLabels: [],
  removedLabels: [],
});

/**
 * Updates a label group with a new label activity.
 * @param currentGroup - The current group to update.
 * @param activity - The new label activity to add to the group.
 * @returns The updated GroupedLabelActivityType object.
 */
const updateLabelGroup = (
  currentGroup: GroupedLabelActivityType,
  activity: LabelActivityType,
): GroupedLabelActivityType => {
  const { labelName, labelColor, action } = activity;

  const [arrayToAddTo, arrayToRemoveFrom] =
    action === 'add'
      ? [currentGroup.addedLabels, currentGroup.removedLabels]
      : [currentGroup.removedLabels, currentGroup.addedLabels];

  // Check if the label exists in the array we're removing from
  const removeIndex = arrayToRemoveFrom.findIndex(
    (label) => label.name === labelName,
  );

  if (removeIndex !== -1) {
    arrayToRemoveFrom.splice(removeIndex, 1);
    return currentGroup;
  }

  // If not found in the removal array, add it to the other array
  if (!arrayToAddTo.some((label) => label.name === labelName)) {
    arrayToAddTo.push({ name: labelName, color: labelColor });
  }

  return currentGroup;
};

/**
 * Determines if a new label group should be started based on specific conditions.
 *
 * This function checks three conditions:
 * 1. If there's no current group (indicating this is the first label activity).
 * 2. If the user of the current activity is different from the user of the current group.
 * 3. If the time difference between the current activity and the previous activity
 *    exceeds the GROUP_TIME_THRESHOLD.
 *
 * @param currentGroup - The current label group, if any.
 * @param prevActivity - The previous activity in the stream, if any.
 * @param activity - The current label activity being processed.
 * @returns A boolean indicating whether a new group should be started (true) or not (false).
 */
const shouldStartNewLabelGroup = (
  currentGroup: GroupedLabelActivityType | null,
  prevActivity: IssueActivityType[number] | undefined,
  activity: LabelActivityType,
): boolean => {
  if (!currentGroup) return true;
  if (activity.user.name !== currentGroup.user.name) return true;
  if (!prevActivity) return false;

  const timeDifference =
    new Date(activity.createdAt).getTime() -
    new Date(prevActivity.createdAt).getTime();
  return timeDifference > GROUP_TIME_THRESHOLD;
};

/**
 * Finalizes a group by adding it to the result array if it contains any labels.
 * @param result - The array to add the finalized group to.
 * @param currentGroup - The current group to finalize.
 */
const finalizeGroup = (
  result: IssueActivityType[number][],
  currentGroup: GroupedLabelActivityType | null,
) => {
  if (currentGroup) {
    if (currentGroup.addedLabels.length > 0) {
      result.push({
        ...currentGroup,
        id: `group-add-${currentGroup.id}`,
        removedLabels: [],
      });
    }
    if (currentGroup.removedLabels.length > 0) {
      result.push({
        ...currentGroup,
        id: `group-remove-${currentGroup.id}`,
        addedLabels: [],
      });
    }
  }
};

const processAndGroupLabelActivities = (activities: IssueActivityType) => {
  const result: IssueActivityType[number][] = [];
  let currentGroup: GroupedLabelActivityType | null = null;

  activities.forEach((activity, index) => {
    if (activity.issueActivity === 'LabelActivity') {
      const previousActivity = activities[index - 1];

      if (shouldStartNewLabelGroup(currentGroup, previousActivity, activity)) {
        finalizeGroup(result, currentGroup);
        currentGroup = createNewLabelGroup(activity);
      }

      currentGroup = updateLabelGroup(currentGroup!, activity);
    } else {
      finalizeGroup(result, currentGroup);
      currentGroup = null;
      result.push(activity);
    }
  });

  finalizeGroup(result, currentGroup);
  return result;
};

const ActivityFeed = ({
  issue,
  activities,
  children,
}: ActivityFeedContextType & { children: ReactNode }) => {
  const processedLabelActivities = processAndGroupLabelActivities(activities);

  return (
    <ActivityFeedContext.Provider
      value={{ issue, activities: processedLabelActivities }}
    >
      <div className="flow-root">
        <ul className="space-y-6">
          <ActivityItem>
            <div className="relative flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-200">
              <Avatar
                alt={issue?.owner?.name ?? 'User'}
                className="size-5"
                src={issue?.owner?.image ?? ''}
              />
            </div>
            <div className="flex gap-x-2">
              <div className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
                <span className="font-medium text-gray-900">
                  {issue?.owner?.name}
                </span>{' '}
                created this issue{' '}
              </div>
              <span>⋅</span>
              <time
                className="flex-none py-0.5 text-xs leading-5 text-gray-500"
                dateTime={new Date(issue?.createdAt).toISOString()}
              >
                {timeAgo(
                  DateTime.fromISO(new Date(issue?.createdAt).toISOString()),
                )}
              </time>
            </div>
          </ActivityItem>
          {processedLabelActivities.map((item, itemIdx) => (
            <ActivityItem key={item.id} itemIdx={itemIdx}>
              {item.issueActivity === 'TitleActivity' && (
                <TitleActivity item={item} />
              )}
              {item.issueActivity === 'DescriptionActivity' && (
                <DescriptionActivity item={item} />
              )}
              {item.issueActivity === 'StatusActivity' && (
                <StatusActivity item={item} />
              )}
              {item.issueActivity === 'PriorityActivity' && (
                <PriorityActivity item={item} />
              )}
              {item.issueActivity === 'AssignedActivity' && (
                <AssignedActivity item={item} />
              )}
              <LabelActivity item={item} />
              {item.issueActivity === 'CommentActivity' && (
                <CommentActivity comments={issue.comments} item={item} />
              )}
            </ActivityItem>
          ))}
        </ul>
      </div>
    </ActivityFeedContext.Provider>
  );
};

const ActivityItem = ({
  children,
  itemIdx,
}: {
  children: ReactNode;
  itemIdx?: number;
}) => {
  const { activities } = useActivityFeed();
  return (
    <li className="relative flex gap-x-4">
      <div
        className={classNames(
          itemIdx === activities.length - 1 ? 'h-6' : '-bottom-6',
          'absolute left-0 top-0 flex w-6 justify-center',
        )}
      >
        <div className="w-px bg-gray-200" />
      </div>
      {children}
    </li>
  );
};

const TitleActivity = ({
  item,
}: {
  item: Extract<IssueActivityType[number], { issueActivity: 'TitleActivity' }>;
}) => {
  return (
    <>
      <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
        <PencilIcon className="size-4 text-gray-500" />
      </div>
      <div className="flex gap-x-1">
        <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
          <span className="font-medium text-gray-900">{item.user.name}</span>{' '}
          changed the title
        </p>
        <span>⋅</span>
        <time
          className="flex-none py-0.5 text-xs leading-5 text-gray-500"
          dateTime={item.createdAt.toISOString()}
        >
          {timeAgo(DateTime.fromISO(item.createdAt.toISOString()))}
        </time>
      </div>
    </>
  );
};

const DescriptionActivity = ({
  item,
}: {
  item: Extract<
    IssueActivityType[number],
    { issueActivity: 'DescriptionActivity' }
  >;
}) => {
  return (
    <>
      <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
        <PencilIcon className="size-4 text-gray-500" />
      </div>
      <div className="flex gap-x-1">
        <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
          <span className="font-medium text-gray-900">{item.user.name}</span>{' '}
          changed the description
        </p>
        <span>⋅</span>
        <time
          className="flex-none py-0.5 text-xs leading-5 text-gray-500"
          dateTime={item.createdAt.toISOString()}
        >
          {timeAgo(DateTime.fromISO(item.createdAt.toISOString()))}
        </time>
      </div>
    </>
  );
};

const StatusActivity = ({
  item,
}: {
  item: Extract<IssueActivityType[number], { issueActivity: 'StatusActivity' }>;
}) => {
  return (
    <>
      <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
        {item.statusName === 'BACKLOG' && (
          <CircleDashed className="size-[1.10rem] text-zinc-500" />
        )}
        {item.statusName === 'OPEN' && (
          <CircleDot className="size-[1.10rem] text-green-700" />
        )}
        {item.statusName === 'IN_PROGRESS' && (
          <Loader2 className="size-[1.10rem] text-yellow-700" />
        )}
        {item.statusName === 'DONE' && (
          <CheckCircle2 className="size-[1.10rem] text-indigo-700" />
        )}
        {item.statusName === 'CANCELLED' && (
          <PauseCircle className="size-[1.10rem] text-zinc-500" />
        )}
      </div>
      <div className="flex gap-x-1">
        <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
          <span className="font-medium text-gray-900">{item.user.name}</span>{' '}
          changed the status to{' '}
          <span className="font-medium text-gray-900">
            {item.statusName
              .toLowerCase()
              .split('_')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </span>
        </p>
        <span>⋅</span>
        <time
          className="flex-none py-0.5 text-xs leading-5 text-gray-500"
          dateTime={item.createdAt.toISOString()}
        >
          {timeAgo(DateTime.fromISO(item.createdAt.toISOString()))}
        </time>
      </div>
    </>
  );
};

const PriorityActivity = ({
  item,
}: {
  item: Extract<
    IssueActivityType[number],
    { issueActivity: 'PriorityActivity' }
  >;
}) => {
  return (
    <>
      <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
        {item.priorityName === 'HIGH' && (
          <MdiSignalCellular3 className="text-gray-500" />
        )}
        {item.priorityName === 'MEDIUM' && (
          <MdiSignalCellular2 className="text-gray-500" />
        )}
        {item.priorityName === 'LOW' && (
          <MdiSignalCellular1 className="text-gray-500" />
        )}
        {item.priorityName === 'NO_PRIORITY' && (
          <TablerLineDashed className="text-gray-500" />
        )}
      </div>
      <div className="flex gap-x-1">
        <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
          <span className="font-medium text-gray-900">{item.user.name}</span>{' '}
          changed the priority to{' '}
          <span className="font-medium text-gray-900">
            {item.priorityName
              .toLowerCase()
              .split('_')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </span>
        </p>
        <span>⋅</span>
        <time
          className="flex-none py-0.5 text-xs leading-5 text-gray-500"
          dateTime={item.createdAt.toISOString()}
        >
          {timeAgo(DateTime.fromISO(item.createdAt.toISOString()))}
        </time>
      </div>
    </>
  );
};

const AssignedActivity = ({
  item,
}: {
  item: Extract<
    IssueActivityType[number],
    { issueActivity: 'AssignedActivity' }
  >;
}) => {
  return (
    <>
      <div className="relative flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-200">
        {item.user.image ? (
          <Avatar
            alt={item.user.name}
            className="size-5"
            src={item.user.image}
          />
        ) : (
          <UserCircleIcon
            aria-hidden="true"
            className="h-4 w-4 text-gray-500"
          />
        )}
      </div>
      <div className="flex gap-x-1">
        <div className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
          <span className="font-medium text-gray-900">{item.user.name}</span>{' '}
          assigned{' '}
          <span className="font-medium text-gray-900">
            {item.assignedUsername}
          </span>{' '}
        </div>
        <span>⋅</span>
        <time
          className="flex-none py-0.5 text-xs leading-5 text-gray-500"
          dateTime={item.createdAt.toISOString()}
        >
          {timeAgo(DateTime.fromISO(item.createdAt.toISOString()))}
        </time>
      </div>
    </>
  );
};

const LabelActivity = ({
  item,
}: {
  item: Extract<
    IssueActivityType[number],
    { issueActivity: 'LabelActivity' | 'GroupedLabelActivity' }
  >;
}) => {
  let addedLabels: { name: string; color: string }[] = [];
  let removedLabels: { name: string; color: string }[] = [];

  if (item.issueActivity === 'GroupedLabelActivity') {
    addedLabels = item.addedLabels;
    removedLabels = item.removedLabels;
  } else if (item.action === 'add') {
    addedLabels = [{ name: item.labelName, color: item.labelColor }];
  } else {
    removedLabels = [{ name: item.labelName, color: item.labelColor }];
  }

  // If there are no changes, don't render anything
  if (addedLabels.length === 0 && removedLabels.length === 0) {
    return null;
  }

  return (
    <>
      <div className="relative flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-200">
        <TagIcon aria-hidden="true" className="h-4 w-4 text-gray-500" />
      </div>
      <div className="flex gap-x-1">
        <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
          <span className="font-medium text-gray-900">{item.user.name}</span>{' '}
          {addedLabels.length > 0 && (
            <>
              added label{addedLabels.length > 1 ? 's' : ''}
              {addedLabels.map((label, index) => (
                <span key={label.name}>
                  {' '}
                  <LabelBadge color={label.color} name={label.name} />
                </span>
              ))}
            </>
          )}
          {addedLabels.length > 0 && removedLabels.length > 0 && ' and '}
          {removedLabels.length > 0 && (
            <>
              removed label{removedLabels.length > 1 ? 's' : ''}
              {removedLabels.map((label, index) => (
                <span key={label.name}>
                  {' '}
                  <LabelBadge color={label.color} name={label.name} />
                </span>
              ))}
            </>
          )}
        </p>
        <span>⋅</span>
        <time
          className="flex-none py-0.5 text-xs leading-5 text-gray-500"
          dateTime={item.createdAt.toISOString()}
        >
          {timeAgo(DateTime.fromISO(item.createdAt.toISOString()))}
        </time>
      </div>
    </>
  );
};

// Helper component for rendering label badges
const LabelBadge = ({ color, name }: { color: string; name: string }) => {
  return (
    <span className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-2xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
      <div
        className={classNames(
          COLORS[color] || 'bg-zinc-100',
          'flex-none rounded-full p-1',
        )}
      >
        <div className="size-2 rounded-full bg-current" />
      </div>
      {name}
    </span>
  );
};

const CommentActivity = ({
  item,
  comments,
}: {
  item: Extract<
    IssueActivityType[number],
    { issueActivity: 'CommentActivity' }
  >;
  comments: { id: number; content: string }[];
}) => {
  return (
    <>
      <div className="relative mt-3 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-200">
        {item.user ? (
          <Avatar
            alt={item.user.name}
            className="size-5"
            src={item.user.image}
          />
        ) : (
          <UserCircleIcon
            aria-hidden="true"
            className="h-4 w-4 text-gray-500"
          />
        )}
      </div>
      <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
        <div className="flex justify-between">
          <div className="flex gap-x-1">
            <div className="py-0.5 text-xs leading-5 text-gray-500">
              <span className="font-semibold text-gray-900">
                {item.user.name}
              </span>
            </div>
            <span>⋅</span>
            <time
              className="flex-none py-0.5 text-xs leading-5 text-gray-500"
              dateTime={item.createdAt.toISOString()}
            >
              {timeAgo(DateTime.fromISO(item.createdAt.toISOString()))}
            </time>
          </div>
          <CommentOptions
            item={item}
            comment={
              comments.find((comment) => comment.id === item.commentId)
                ?.content ?? ''
            }
          />
        </div>
        <Editor
          isEditable={false}
          type="comment"
          initialContent={
            comments.find((comment) => comment.id === item.commentId)
              ?.content ?? ''
          }
        />
      </div>
    </>
  );
};

export {
  ActivityFeed,
  ActivityItem,
  AssignedActivity,
  CommentActivity,
  DescriptionActivity,
  LabelActivity,
  PriorityActivity,
  StatusActivity,
  TitleActivity,
};

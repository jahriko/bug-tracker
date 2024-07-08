import { Badge } from "@/components/catalyst/badge"
import { classNames } from "@/lib/utils"
import { TagIcon, UserCircleIcon } from "@heroicons/react/16/solid"
import { CheckCircleIcon } from "@heroicons/react/20/solid"
import { CircleDot, SignalHigh, SignalLow, SignalMedium } from "lucide-react"
import { Fragment } from "react"

export default async function ActivityFeed({
  activities,
}: {
  activities: {
    user: {
      image: string | null
    }
    issueActivity:
      | "StatusActivity"
      | "PriorityActivity"
      | "TitleActivity"
      | "DescriptionActivity"
      | "AssigneeActivity"
      | "LabelActivity"
      | "CommentActivity"
    id: number
    createdAt: Date
    updatedAt: Date
    username: string
  }[]
}) {
  return (
    <div className="flow-root">
      <ul className="space-y-6" role="list">
        {activities.map((activityItem, activityItemIdx) => (
          <ActivityItem
            isFirst={activityItemIdx === 0}
            isLast={activityItemIdx === activities.length - 1}
            item={activityItem}
            key={activityItem.id}
          />
        ))}
      </ul>
    </div>
  )
}

function ActivityItem({
  item,
  isFirst,
  isLast,
}: {
  item: {
    user: {
      image: string | null
    }
    issueActivity:
      | "StatusActivity"
      | "PriorityActivity"
      | "TitleActivity"
      | "DescriptionActivity"
      | "AssigneeActivity"
      | "LabelActivity"
      | "CommentActivity"
    id: number
    createdAt: Date
    updatedAt: Date
    username: string
  }
  isFirst: boolean
  isLast: boolean
}) {
  return (
    <li className="relative flex gap-x-4">
      <div
        className={classNames(
          isFirst ? "pt-10" : "",
          isLast ? "h-6" : "-bottom-6",
          "absolute left-0 top-0 flex w-6 justify-center",
        )}
      >
        <div className="w-px bg-gray-200" />
      </div>
      {item.issueActivity === "CommentActivity" && (
        <CommentItem isFirst={isFirst} item={item} />
      )}
      {item.issueActivity === "AssigneeActivity" && <AssignmentItem item={item} />}
      {item.issueActivity === "LabelActivity" && <TagsItem item={item} />}
      {item.issueActivity === "StatusActivity" && <StatusItem item={item} />}
    </li>
  )
}

function CommentItem({ item }) {
  return (
    <>
      <img
        alt=""
        className="relative mt-3 h-6 w-6 flex-none rounded-full bg-gray-50"
        src={item.imageUrl}
      />
      <div className="flex-auto rounded-lg bg-gray-50 p-3 ring-1 ring-inset ring-gray-200">
        <div className="flex justify-between gap-x-4">
          <div className="py-0.5 text-xs leading-5 text-gray-500">
            <span className="font-medium text-gray-900">{item.person.name}</span>
          </div>
          <time
            className="flex-none py-0.5 text-xs leading-5 text-gray-500"
            dateTime={item.date}
          >
            {item.date}
          </time>
        </div>
        <p className="prose-sm leading-6 text-gray-900">{item.comment}</p>
      </div>
    </>
  )
}

function AssignmentItem({ item }) {
  return (
    <>
      <div className="relative flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-200">
        <UserCircleIcon aria-hidden="true" className="h-4 w-4 text-gray-500" />
      </div>
      <div className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
        <span className="font-medium text-gray-900">{item.person.name}</span> assigned{" "}
        <span className="font-medium text-gray-900">{item.assigned?.name}</span>{" "}
      </div>
      <time
        className="flex-none py-0.5 text-xs leading-5 text-gray-500"
        dateTime={item.date}
      >
        {item.date}
      </time>
    </>
  )
}

function TagsItem({ item }) {
  return (
    <>
      <div className="relative flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-200">
        <TagIcon aria-hidden="true" className="h-4 w-4 text-gray-500" />
      </div>
      <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
        <span className="font-medium text-gray-900">{item.person.name}</span> added tags{" "}
        <span className="mr-0.5 space-x-1.5">
          {item.tags.map((tag) => (
            <Fragment key={tag.name}>
              <Badge color={tag.color}>{tag.name}</Badge>
            </Fragment>
          ))}
        </span>
      </p>
      <time
        className="flex-none py-0.5 text-xs leading-5 text-gray-500"
        dateTime={item.date}
      >
        {item.date}
      </time>
    </>
  )
}

function StatusItem({ item }) {
  return (
    <>
      <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
        <CheckCircleIcon aria-hidden="true" className="h-6 w-6 text-indigo-600" />
      </div>
      <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
        <span className="font-medium text-gray-900">{item.person.name}</span> changed the
        status to <span className="font-medium text-gray-900">{item.status}</span>
      </p>
      <time
        className="flex-none py-0.5 text-xs leading-5 text-gray-500"
        dateTime={item.date}
      >
        {item.date}
      </time>
    </>
  )
}

function PriorityItem({ item }) {
  return (
    <>
      <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
        <div className="h-6 w-6 text-gray-500">
          {item.priority === "High" && <SignalHigh />}
          {item.priority === "Medium" && <SignalMedium />}
          {item.priority === "Low" && <SignalLow />}
          {item.priority === "None" && <CircleDot />}
        </div>
      </div>
      <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
        <span className="font-medium text-gray-900">{item.person.name}</span> changed the
        priority to <span className="font-medium text-gray-900">{item.priority}</span>
      </p>
      <time
        className="flex-none py-0.5 text-xs leading-5 text-gray-500"
        dateTime={item.date}
      >
        {item.date}
      </time>
    </>
  )
}

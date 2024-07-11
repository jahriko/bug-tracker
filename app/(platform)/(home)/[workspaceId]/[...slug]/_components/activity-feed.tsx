import { Badge } from "@/components/catalyst/badge"
import { classNames } from "@/lib/utils"
import { TagIcon, UserCircleIcon } from "@heroicons/react/16/solid"
import { CheckCircle2, CircleDashed, CircleDot, Loader2, PauseCircle } from "lucide-react"

import { Fragment } from "react"
import { IssueActivityType } from "../_data/issue"

export default function ActivityFeed({ activities }: { activities: IssueActivityType }) {
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
  item: IssueActivityType[number]
  isFirst: boolean
  isLast: boolean
}) {
  return (
    <li className="relative flex gap-x-4">
      <div
        className={classNames(
          isFirst ? "pt-6" : "",
          isLast ? "h-6" : "-bottom-6",
          "absolute left-0 top-0 flex w-6 justify-center",
        )}
      >
        <div className="w-px bg-gray-200" />
      </div>
      {item.issueActivity === "CommentActivity" && (
        <CommentItem isFirst={isFirst} item={item} />
      )}
      {item.issueActivity === "AssignedActivity" && (
        <AssignmentItem isFirst={isFirst} item={item} />
      )}
      {item.issueActivity === "LabelActivity" && (
        <TagsItem isFirst={isFirst} item={item} />
      )}
      {item.issueActivity === "StatusActivity" && (
        <StatusItem isFirst={isFirst} item={item} />
      )}
      {item.issueActivity === "PriorityActivity" && (
        <PriorityItem isFirst={isFirst} item={item} />
      )}
    </li>
  )
}

function CommentItem({ item, isFirst }) {
  return (
    <div className={classNames(isFirst ? "relative mt-3" : "mt-3", "flex-none")}>
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
    </div>
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

function StatusItem({ item, isFirst }) {
  console.log("status is first", isFirst)
  return (
    <>
      <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
        {item.name === "BACKLOG" && (
          <CircleDashed className="size-[1.10rem] text-zinc-500" />
        )}
        {item.name === "OPEN" && <CircleDot className="size-[1.10rem] text-green-700" />}
        {item.name === "IN_PROGRESS" && (
          <Loader2 className="size-[1.10rem] text-yellow-700" />
        )}
        {item.name === "DONE" && (
          <CheckCircle2 className="size-[1.10rem] text-indigo-700" />
        )}
        {item.name === "CANCELLED" && (
          <PauseCircle className="size-[1.10rem] text-zinc-500" />
        )}
      </div>
      <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
        <span className="font-medium text-gray-900">{item.user.name}</span> changed the
        status to <span className="font-medium text-gray-900">{item.name}</span>
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

function PriorityItem({ item, isFirst }) {
  console.log("priority is first", isFirst)
  return (
    <>
      <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
        {item.name === "HIGH" && <MdiSignalCellular3 className="text-gray-500" />}
        {item.name === "MEDIUM" && <MdiSignalCellular2 className="text-gray-500" />}
        {item.name === "LOW" && <MdiSignalCellular1 className="text-gray-500" />}
        {item.name === "NO_PRIORITY" && <TablerLineDashed className="text-gray-500" />}
      </div>
      <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
        <span className="font-medium text-gray-900">{item.user.name}</span> changed the
        priority to <span className="font-medium text-gray-900">{item.name}</span>
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

export function TablerLineDashed(props) {
  return (
    <svg
      height="1em"
      viewBox="0 0 24 24"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5 12h2m10 0h2m-8 0h2"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

export function MdiSignalCellular1(props) {
  return (
    <svg
      height="1em"
      viewBox="0 0 24 24"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M19.5 5.5v13h-2v-13zm-7 5v8h-2v-8zM21 4h-5v16h5zm-7 5H9v11h5zm-7 5H2v6h5z"
        fill="currentColor"
      />
    </svg>
  )
}

export function MdiSignalCellular2(props) {
  return (
    <svg
      height="1em"
      viewBox="0 0 24 24"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M19.5 5.5v13h-2v-13zM21 4h-5v16h5zm-7 5H9v11h5zm-7 5H2v6h5z"
        fill="currentColor"
      />
    </svg>
  )
}

export function MdiSignalCellular3(props) {
  return (
    <svg
      height="1em"
      viewBox="0 0 24 24"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M21 4h-5v16h5zm-7 5H9v11h5zm-7 5H2v6h5z" fill="currentColor" />
    </svg>
  )
}

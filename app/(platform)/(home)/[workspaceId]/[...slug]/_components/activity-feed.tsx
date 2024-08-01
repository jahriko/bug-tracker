"use client"
/* eslint-disable @next/next/no-img-element */
import { Avatar } from "@/components/catalyst/avatar"
import { Badge } from "@/components/catalyst/badge"
import { MdiSignalCellular1, MdiSignalCellular2, MdiSignalCellular3, TablerLineDashed } from "@/components/icons"
import { classNames } from "@/lib/utils"
import { TagIcon, UserCircleIcon } from "@heroicons/react/16/solid"
import { CheckCircle2, CircleDashed, CircleDot, Loader2, PauseCircle, PencilIcon } from "lucide-react"
import { DateTime } from "luxon"
import dynamic from "next/dynamic"
import { Fragment, ReactNode, createContext, useContext } from "react"
import { IssueActivityType, IssueType } from "../_data/issue"
import CommentOptions from "./comment-options"

const Editor = dynamic(() => import("@/components/lexical_editor/editor"), {
  ssr: true,
})

interface ActivityFeedContextType {
  issue: IssueType
  activities: IssueActivityType
}

const ActivityFeedContext = createContext<ActivityFeedContextType | undefined>(undefined)

function useActivityFeed() {
  const context = useContext(ActivityFeedContext)
  if (!context) {
    throw new Error("ActivityFeed components must be used within an ActivityFeed")
  }
  return context
}

function ActivityFeed({ issue, activities, children }: ActivityFeedContextType & { children: ReactNode }) {
  return (
    <ActivityFeedContext.Provider value={{ issue, activities }}>
      <div className="flow-root">
        <ul className="space-y-6" role="list">
          {children}
        </ul>
      </div>
    </ActivityFeedContext.Provider>
  )
}

function ActivityItem({ children, itemIdx }: { children: ReactNode; itemIdx?: number }) {
  const { activities } = useActivityFeed()
  return (
    <li className="relative flex gap-x-4">
      <div
        className={classNames(
          itemIdx === activities.length - 1 ? "h-6" : "-bottom-6",
          "absolute left-0 top-0 flex w-6 justify-center",
        )}
      >
        <div className="w-px bg-gray-200" />
      </div>
      {children}
    </li>
  )
}

function TitleActivity({ item }: { item: Extract<IssueActivityType[number], { issueActivity: "TitleActivity" }> }) {
  return (
    <>
      <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
        <PencilIcon className="size-4 text-gray-500" />
      </div>
      <div className="flex gap-x-1">
        <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
          <span className="font-medium text-gray-900">{item.user.name}</span> changed the title
        </p>
        <span>⋅</span>
        <time className="flex-none py-0.5 text-xs leading-5 text-gray-500" dateTime={item.createdAt.toISOString()}>
          {timeAgo(DateTime.fromISO(item.createdAt.toISOString()))}
        </time>
      </div>
    </>
  )
}

function DescriptionActivity({
  item,
}: {
  item: Extract<IssueActivityType[number], { issueActivity: "DescriptionActivity" }>
}) {
  return (
    <>
      <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
        <PencilIcon className="size-4 text-gray-500" />
      </div>
      <div className="flex gap-x-1">
        <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
          <span className="font-medium text-gray-900">{item.user.name}</span> changed the description
        </p>
        <span>⋅</span>
        <time className="flex-none py-0.5 text-xs leading-5 text-gray-500" dateTime={item.createdAt.toISOString()}>
          {timeAgo(DateTime.fromISO(item.createdAt.toISOString()))}
        </time>
      </div>
    </>
  )
}

function StatusActivity({ item }: { item: Extract<IssueActivityType[number], { issueActivity: "StatusActivity" }> }) {
  return (
    <>
      <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
        {item.statusName === "BACKLOG" && <CircleDashed className="size-[1.10rem] text-zinc-500" />}
        {item.statusName === "OPEN" && <CircleDot className="size-[1.10rem] text-green-700" />}
        {item.statusName === "IN_PROGRESS" && <Loader2 className="size-[1.10rem] text-yellow-700" />}
        {item.statusName === "DONE" && <CheckCircle2 className="size-[1.10rem] text-indigo-700" />}
        {item.statusName === "CANCELLED" && <PauseCircle className="size-[1.10rem] text-zinc-500" />}
      </div>
      <div className="flex gap-x-1">
        <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
          <span className="font-medium text-gray-900">{item.user.name}</span> changed the status to{" "}
          <span className="font-medium text-gray-900">
            {item.statusName
              .toLowerCase()
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </span>
        </p>
        <span>⋅</span>
        <time className="flex-none py-0.5 text-xs leading-5 text-gray-500" dateTime={item.createdAt.toISOString()}>
          {timeAgo(DateTime.fromISO(item.createdAt.toISOString()))}
        </time>
      </div>
    </>
  )
}

function PriorityActivity({
  item,
}: {
  item: Extract<IssueActivityType[number], { issueActivity: "PriorityActivity" }>
}) {
  return (
    <>
      <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
        {item.priorityName === "HIGH" && <MdiSignalCellular3 className="text-gray-500" />}
        {item.priorityName === "MEDIUM" && <MdiSignalCellular2 className="text-gray-500" />}
        {item.priorityName === "LOW" && <MdiSignalCellular1 className="text-gray-500" />}
        {item.priorityName === "NO_PRIORITY" && <TablerLineDashed className="text-gray-500" />}
      </div>
      <div className="flex gap-x-1">
        <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
          <span className="font-medium text-gray-900">{item.user.name}</span> changed the priority to{" "}
          <span className="font-medium text-gray-900">
            {item.priorityName
              .toLowerCase()
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </span>
        </p>
        <span>⋅</span>
        <time className="flex-none py-0.5 text-xs leading-5 text-gray-500" dateTime={item.createdAt.toISOString()}>
          {timeAgo(DateTime.fromISO(item.createdAt.toISOString()))}
        </time>
      </div>
    </>
  )
}

function AssignedActivity({
  item,
}: {
  item: Extract<IssueActivityType[number], { issueActivity: "AssignedActivity" }>
}) {
  return (
    <>
      <div className="relative flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-200">
        {item.user ? (
          <Avatar alt={item.user.name} className="size-5" src={item.user.image} />
        ) : (
          <UserCircleIcon aria-hidden="true" className="h-4 w-4 text-gray-500" />
        )}
      </div>
      <div className="flex gap-x-1">
        <div className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
          <span className="font-medium text-gray-900">{item.user.name}</span> assigned{" "}
          <span className="font-medium text-gray-900">{item.assignedUsername}</span>{" "}
        </div>
        <span>⋅</span>
        <time className="flex-none py-0.5 text-xs leading-5 text-gray-500" dateTime={item.createdAt.toISOString()}>
          {timeAgo(DateTime.fromISO(item.createdAt.toISOString()))}
        </time>
      </div>
    </>
  )
}

function LabelActivity({ item }: { item: IssueActivityType[0] }) {
  return (
    <>
      <div className="relative flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-200">
        <TagIcon aria-hidden="true" className="h-4 w-4 text-gray-500" />
      </div>
      <div className="flex gap-x-1">
        <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
          <span className="font-medium text-gray-900">{item.user.name}</span> added tags{" "}
          <span className="mr-0.5 space-x-1.5">
            {item.labels.map((tag) => (
              <Fragment key={tag.name}>
                <Badge color={tag.color}>{tag.name}</Badge>
              </Fragment>
            ))}
          </span>
        </p>
        <span>⋅</span>
        <time className="flex-none py-0.5 text-xs leading-5 text-gray-500" dateTime={item.createdAt.toISOString()}>
          {timeAgo(DateTime.fromISO(item.createdAt.toISOString()))}
        </time>
      </div>
    </>
  )
}

function CommentActivity({
  item,
  comments,
}: {
  item: Extract<IssueActivityType[number], { issueActivity: "CommentActivity" }>
  comments: { id: number; content: string }[]
}) {
  return (
    <>
      <div className="relative mt-3 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-200">
        {item.user ? (
          <Avatar alt={item.user.name} className="size-5" src={item.user.image} />
        ) : (
          <UserCircleIcon aria-hidden="true" className="h-4 w-4 text-gray-500" />
        )}
      </div>
      <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
        <div className="flex justify-between">
          <div className="flex gap-x-1">
            <div className="py-0.5 text-xs leading-5 text-gray-500">
              <span className="font-semibold text-gray-900">{item.user.name}</span>
            </div>
            <span>⋅</span>
            <time className="flex-none py-0.5 text-xs leading-5 text-gray-500" dateTime={item.createdAt.toISOString()}>
              {timeAgo(DateTime.fromISO(item.createdAt.toISOString()))}
            </time>
          </div>
          <CommentOptions
            comment={comments.find((comment) => comment.id === item.commentId)?.content ?? ""}
            item={item}
          />
        </div>
        <Editor
          initialContent={comments.find((comment) => comment.id === item.commentId)?.content ?? ""}
          isEditable={false}
          type="comment"
        />
      </div>
    </>
  )
}

// export default function ActivityFeed({
//   issue,
//   activities,
//   comments,
// }: {
//   issue: IssueType
//   activities: IssueActivityType
//   comments: {
//     id: number
//     content: string
//   }[]
// }) {
//   return (
//     <>
//       {activities.map((item, activityIdx) => {
//         return (
//           <li className="relative flex gap-x-4" key={item.id}>
//             <div
//               className={classNames(
//                 // isFirst ? "pt-6" : "",
//                 activityIdx === activities.length - 1 ? "h-6" : "-bottom-6",
//                 "absolute left-0 top-0 flex w-6 justify-center",
//               )}
//             >
//               <div className="w-px bg-gray-200" />
//             </div>

//             {item.issueActivity === "CommentActivity" ? (
//               <>
//                 <div className="relative mt-3 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-200">
//                   {item.user ? (
//                     <Avatar alt={item.user.name} className="size-5" src={item.user.image} />
//                   ) : (
//                     <UserCircleIcon aria-hidden="true" className="h-4 w-4 text-gray-500" />
//                   )}
//                 </div>
//                 <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
//                   <div className="flex justify-between">
//                     <div className="flex gap-x-1">
//                       <div className="py-0.5 text-xs leading-5 text-gray-500">
//                         <span className="font-semibold text-gray-900">{item.user.name}</span>
//                       </div>
//                       <span>⋅</span>
//                       <time
//                         className="flex-none py-0.5 text-xs leading-5 text-gray-500"
//                         dateTime={item.createdAt.toISOString()}
//                       >
//                         {timeAgo(DateTime.fromISO(item.createdAt.toISOString()))}
//                       </time>
//                     </div>
//                     <CommentOptions
//                       comment={comments.find((comment) => comment.id === item.commentId)?.content ?? ""}
//                       item={item}
//                     />
//                   </div>
//                   <Editor
//                     initialContent={comments.find((comment) => comment.id === item.commentId)?.content ?? ""}
//                     isEditable={false}
//                     type="comment"
//                   />
//                 </div>
//               </>
//             ) : item.issueActivity === "AssignedActivity" ? (
//               <>
//                 <div className="relative flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-200">
//                   {item.user ? (
//                     <Avatar alt={item.user.name} className="size-5" src={item.user.image} />
//                   ) : (
//                     <UserCircleIcon aria-hidden="true" className="h-4 w-4 text-gray-500" />
//                   )}
//                 </div>
//                 <div className="flex gap-x-1">
//                   <div className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
//                     <span className="font-medium text-gray-900">{item.user.name}</span> assigned{" "}
//                     <span className="font-medium text-gray-900">{item.assignedUsername}</span>{" "}
//                   </div>
//                   <span>⋅</span>
//                   <time
//                     className="flex-none py-0.5 text-xs leading-5 text-gray-500"
//                     dateTime={item.createdAt.toISOString()}
//                   >
//                     {timeAgo(DateTime.fromISO(item.createdAt.toISOString()))}
//                   </time>
//                 </div>
//               </>
//             ) : item.issueActivity === "DescriptionActivity" ? (
//               <>
//                 <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
//                   <PencilIcon className="size-4 text-gray-500" />
//                 </div>
//                 <div className="flex gap-x-1">
//                   <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
//                     <span className="font-medium text-gray-900">{item.user.name}</span> changed the description
//                   </p>
//                   <span>⋅</span>
//                   <time
//                     className="flex-none py-0.5 text-xs leading-5 text-gray-500"
//                     dateTime={item.createdAt.toISOString()}
//                   >
//                     {timeAgo(DateTime.fromISO(item.createdAt.toISOString()))}
//                   </time>
//                 </div>
//               </>
//             ) : item.issueActivity === "PriorityActivity" ? (
//               <>
//                 <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
//                   {item.priorityName === "HIGH" && <MdiSignalCellular3 className="text-gray-500" />}
//                   {item.priorityName === "MEDIUM" && <MdiSignalCellular2 className="text-gray-500" />}
//                   {item.priorityName === "LOW" && <MdiSignalCellular1 className="text-gray-500" />}
//                   {item.priorityName === "NO_PRIORITY" && <TablerLineDashed className="text-gray-500" />}
//                 </div>
//                 <div className="flex gap-x-1">
//                   <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
//                     <span className="font-medium text-gray-900">{item.user.name}</span> changed the priority to{" "}
//                     <span className="font-medium text-gray-900">
//                       {item.priorityName
//                         .toLowerCase()
//                         .split("_")
//                         .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//                         .join(" ")}
//                     </span>
//                   </p>
//                   <span>⋅</span>
//                   <time
//                     className="flex-none py-0.5 text-xs leading-5 text-gray-500"
//                     dateTime={item.createdAt.toISOString()}
//                   >
//                     {timeAgo(DateTime.fromISO(item.createdAt.toISOString()))}
//                   </time>
//                 </div>
//               </>
//             ) : item.issueActivity === "StatusActivity" ? (
//               <>
//                 <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
//                   {item.statusName === "BACKLOG" && <CircleDashed className="size-[1.10rem] text-zinc-500" />}
//                   {item.statusName === "OPEN" && <CircleDot className="size-[1.10rem] text-green-700" />}
//                   {item.statusName === "IN_PROGRESS" && <Loader2 className="size-[1.10rem] text-yellow-700" />}
//                   {item.statusName === "DONE" && <CheckCircle2 className="size-[1.10rem] text-indigo-700" />}
//                   {item.statusName === "CANCELLED" && <PauseCircle className="size-[1.10rem] text-zinc-500" />}
//                 </div>
//                 <div className="flex gap-x-1">
//                   <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
//                     <span className="font-medium text-gray-900">{item.user.name}</span> changed the status to{" "}
//                     <span className="font-medium text-gray-900">
//                       {item.statusName
//                         .toLowerCase()
//                         .split("_")
//                         .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//                         .join(" ")}
//                     </span>
//                   </p>
//                   <span>⋅</span>
//                   <time
//                     className="flex-none py-0.5 text-xs leading-5 text-gray-500"
//                     dateTime={item.createdAt.toISOString()}
//                   >
//                     {timeAgo(DateTime.fromISO(item.createdAt.toISOString()))}
//                   </time>
//                 </div>
//               </>
//             ) : item.issueActivity === "TitleActivity" ? (
//               <>
//                 <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
//                   <PencilIcon className="size-4 text-gray-500" />
//                 </div>
//                 <div className="flex gap-x-1">
//                   <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
//                     <span className="font-medium text-gray-900">{item.user.name}</span> changed the title
//                   </p>
//                   <span>⋅</span>
//                   <time
//                     className="flex-none py-0.5 text-xs leading-5 text-gray-500"
//                     dateTime={item.createdAt.toISOString()}
//                   >
//                     {timeAgo(DateTime.fromISO(item.createdAt.toISOString()))}
//                   </time>
//                 </div>
//               </>
//             ) : item.issueActivity === "LabelActivity" ? (
//               <>
//                 <div className="relative flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-200">
//                   <TagIcon aria-hidden="true" className="h-4 w-4 text-gray-500" />
//                 </div>
//                 <div className="flex gap-x-1">
//                   <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
//                     <span className="font-medium text-gray-900">{item.person.name}</span> added tags{" "}
//                     <span className="mr-0.5 space-x-1.5">
//                       {item.tags.map((tag) => (
//                         <Fragment key={tag.name}>
//                           <Badge color={tag.color}>{tag.name}</Badge>
//                         </Fragment>
//                       ))}
//                     </span>
//                   </p>
//                   <span>⋅</span>
//                   <time
//                     className="flex-none py-0.5 text-xs leading-5 text-gray-500"
//                     dateTime={item.createdAt.toISOString()}
//                   >
//                     {timeAgo(DateTime.fromISO(item.createdAt.toISOString()))}
//                   </time>
//                 </div>
//               </>
//             ) : null}
//           </li>
//         )
//       })}
//     </>
//   )
// }

function timeAgo(dateTime: DateTime) {
  const now = DateTime.now()
  const diffInSeconds = now.diff(dateTime, "seconds").seconds

  if (diffInSeconds < 60) {
    return "just now"
  } else if (diffInSeconds < 120) {
    return "a minute ago"
  } else {
    return dateTime.toRelative(now)
  }
}

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
}
// export default ActivityFeed

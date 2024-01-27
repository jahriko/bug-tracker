/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-nested-ternary */
import {
  TagIcon,
  UserCircleIcon as UserCircleIconMini,
} from "@heroicons/react/16/solid"

const activity = [
  {
    id: 1,
    type: "comment",
    person: { name: "Eduardo Benz", href: "#" },
    imageUrl:
      "https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. ",
    date: "6d ago",
  },
  {
    id: 2,
    type: "assignment",
    person: { name: "Hilary Mahy", href: "#" },
    assigned: { name: "Kristin Watson", href: "#" },
    date: "2d ago",
  },
  {
    id: 3,
    type: "tags",
    person: { name: "Hilary Mahy", href: "#" },
    tags: [
      { name: "Bug", href: "#", color: "bg-rose-500" },
      { name: "Accessibility", href: "#", color: "bg-indigo-500" },
    ],
    date: "6h ago",
  },
  {
    id: 4,
    type: "comment",
    person: { name: "Jason Meyers", href: "#" },
    imageUrl:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. Scelerisque amet elit non sit ut tincidunt condimentum. Nisl ultrices eu venenatis diam.",
    date: "2h ago",
  },
]

interface Comment {
  id: number
  person: { name: string; href: string }
  imageUrl?: string
  comment?: string
  date: string
}

function CommentType(item: Comment) {
  return (
    <>
      <div className="relative ml-2">
        <img
          alt=""
          className="flex size-6 items-center justify-center rounded-full bg-gray-400 ring-8 ring-white"
          src={item.imageUrl}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center space-x-3">
          <div className="text-sm">
            <a className="font-medium text-gray-900" href={item.person.href}>
              {item.person.name}
            </a>
          </div>
          <p className="mt-0.5 text-xs text-gray-500">{item.date}</p>
        </div>
        <div className="mt-2 text-sm text-gray-700 ">
          <p>{item.comment}</p>
        </div>
      </div>
    </>
  )
}

interface Assignment {
  id: number
  person: { name: string; href: string }
  assigned: { name: string; href: string }
  date: string
}

function AssignmentType(item: Assignment) {
  return (
    <>
      <div>
        <div className="relative px-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white">
            <UserCircleIconMini
              aria-hidden="true"
              className="h-5 w-5 text-gray-500"
            />
          </div>
        </div>
      </div>
      <div className="min-w-0 flex-1 py-1.5">
        <div className="text-sm text-gray-500">
          <a className="font-medium text-gray-900" href={item.person.href}>
            {item.person.name}
          </a>{" "}
          assigned{" "}
          <a className="font-medium text-gray-900" href={item.assigned.href}>
            {item.assigned.name}
          </a>{" "}
          <span className="whitespace-nowrap">{item.date}</span>
        </div>
      </div>
    </>
  )
}

interface Tag {
  id: number
  person: { name: string; href: string }
  tags: { name: string; href: string; color: string }[]
  date: string
}

function TagType(item: Tag) {
  return (
    <>
      <div>
        <div className="relative px-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white">
            <TagIcon aria-hidden="true" className="h-5 w-5 text-gray-500" />
          </div>
        </div>
      </div>
      <div className="min-w-0 flex-1 py-0">
        <div className="text-sm leading-8 text-gray-500">
          <span className="mr-0.5">
            <a className="font-medium text-gray-900" href={item.person.href}>
              {item.person.name}
            </a>{" "}
            added tags
          </span>{" "}
          <span className="mr-0.5">
            <span className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
              <svg
                aria-hidden="true"
                className="h-1.5 w-1.5 fill-red-500"
                viewBox="0 0 6 6"
              >
                <circle cx={3} cy={3} r={3} />
              </svg>
              Badge
            </span>
            <span className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
              <svg
                aria-hidden="true"
                className="h-1.5 w-1.5 fill-yellow-500"
                viewBox="0 0 6 6"
              >
                <circle cx={3} cy={3} r={3} />
              </svg>
              Badge
            </span>
          </span>
          <span className="whitespace-nowrap">{item.date}</span>
        </div>
      </div>
    </>
  )
}

export default function IssueActivityFeed() {
  return (
    <ul className="-mb-8" role="list">
      {activity.map((item, itemIdx) => (
        <li key={item.id}>
          <div className="relative pb-8">
            {itemIdx !== activity.length - 1 ? (
              <span
                aria-hidden="true"
                className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
              />
            ) : null}
            <div className="relative flex items-start space-x-3">
              {item.type === "comment" ? (
                <>
                  <div className="relative ml-2">
                    <img
                      alt=""
                      className="flex size-6 items-center justify-center rounded-full bg-gray-400 ring-8 ring-white"
                      src={item.imageUrl}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm">
                        <a
                          className="font-medium text-gray-900"
                          href={item.person.href}
                        >
                          {item.person.name}
                        </a>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {item.date}
                      </p>
                    </div>
                    <div className="mt-2 text-sm text-gray-700 ">
                      <p>{item.comment}</p>
                    </div>
                  </div>
                </>
              ) : item.type === "assignment" ? (
                <>
                  <div>
                    <div className="relative px-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white">
                        <UserCircleIconMini
                          aria-hidden="true"
                          className="h-5 w-5 text-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 py-1.5">
                    <div className="text-sm text-gray-500">
                      <a
                        className="font-medium text-gray-900"
                        href={item.person.href}
                      >
                        {item.person.name}
                      </a>{" "}
                      assigned{" "}
                      <a
                        className="font-medium text-gray-900"
                        href={item.assigned.href}
                      >
                        {item.assigned.name}
                      </a>{" "}
                      <span className="whitespace-nowrap">{item.date}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="relative px-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white">
                        <TagIcon
                          aria-hidden="true"
                          className="h-5 w-5 text-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 py-0">
                    <div className="text-sm leading-8 text-gray-500">
                      <span className="mr-0.5">
                        <a
                          className="font-medium text-gray-900"
                          href={item.person.href}
                        >
                          {item.person.name}
                        </a>{" "}
                        added tags
                      </span>{" "}
                      <span className="mr-0.5">
                        <span className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
                          <svg
                            aria-hidden="true"
                            className="h-1.5 w-1.5 fill-red-500"
                            viewBox="0 0 6 6"
                          >
                            <circle cx={3} cy={3} r={3} />
                          </svg>
                          Badge
                        </span>
                        <span className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
                          <svg
                            aria-hidden="true"
                            className="h-1.5 w-1.5 fill-yellow-500"
                            viewBox="0 0 6 6"
                          >
                            <circle cx={3} cy={3} r={3} />
                          </svg>
                          Badge
                        </span>
                      </span>
                      <span className="whitespace-nowrap">{item.date}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

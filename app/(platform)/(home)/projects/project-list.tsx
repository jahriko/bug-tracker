/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import { CreateProject } from "@/app/(platform)/(home)/_components/NewProject"
import { Separator } from "@/components/ui/separator"

export default function ProjectList({
  data,
}: {
  data: {
    id: string
    title: string
    createdAt: Date
    updatedAt: Date
    projectLeadId: string | null
  }[]
}) {
  return (
    <div>
      <CreateProject />
      <Separator className="my-6" />
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
        {data.map((data) => (
          <li className="relative" key={data.id}>
            <div className="group aspect-h-2 aspect-w-4 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
              <img
                alt=""
                className="pointer-events-none object-cover"
                src="/visax-vw5WjLANvSQ-unsplash.jpg"
              />
            </div>
            <Link href={`/projects/${data.id}`}>
              <p className="mt-2 block truncate text-sm font-medium text-gray-900 hover:text-indigo-700">
                {data.title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

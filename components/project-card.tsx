/* eslint-disable no-underscore-dangle */
"use client"

import { Fragment } from "react"
import { Menu, Transition } from "@headlessui/react"
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid"
import Link from "next/link"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

interface ProjectCardProps {
  id: string
  title: string
  _count: {
    issues: number
  }
  url: string
}

export default function ProjectCard(project: ProjectCardProps) {
  return (
    <Link href={`projects/${project.id}/`}>
      <div className="space-y-4 overflow-hidden rounded-lg bg-gray-50 p-4 outline  outline-1 outline-offset-2 outline-gray-200 transition-all ease-in hover:outline-gray-400">
        <div className="flex items-center gap-x-4">
          {/* <img
          alt={project.title}
          className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
          src={client.imageUrl}
        /> */}
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-purple-600 via-slate-900 to-blue-200 object-cover font-semibold text-white shadow ring-1 ring-gray-900/10">
            {project.title.slice(0, 2).toUpperCase()}
          </div>
          <div className="text-sm font-medium leading-6 text-gray-900">
            {project.title}
          </div>
          <Menu as="div" className="relative ml-auto">
            <Menu.Button className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
              <span className="sr-only">Open options</span>
              <EllipsisHorizontalIcon aria-hidden="true" className="h-5 w-5" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      className={classNames(
                        active ? "bg-gray-50" : "",
                        "block px-3 py-1 text-sm leading-6 text-gray-900",
                      )}
                      href="#"
                    >
                      View<span className="sr-only">, {project.title}</span>
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      className={classNames(
                        active ? "bg-gray-50" : "",
                        "block px-3 py-1 text-sm leading-6 text-gray-900",
                      )}
                      href="#"
                    >
                      Edit<span className="sr-only">, {project.title}</span>
                    </a>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        <dl className="-my-3 text-sm leading-6">
          <div className="flex justify-between gap-x-4 ">
            <div className="isolate flex -space-x-1 overflow-hidden">
              <img
                alt=""
                className="relative z-30 inline-block h-6 w-6 rounded-full ring-2 ring-white"
                src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              />
              <img
                alt=""
                className="relative z-20 inline-block h-6 w-6 rounded-full ring-2 ring-white"
                src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              />
              <img
                alt=""
                className="relative z-10 inline-block h-6 w-6 rounded-full ring-2 ring-white"
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
              />
              <img
                alt=""
                className="relative z-0 inline-block h-6 w-6 rounded-full ring-2 ring-white"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              />
            </div>
            <p className="font-medium text-gray-400">
              {project._count.issues ? `${project._count.issues} issues` : null}
            </p>
          </div>
        </dl>
      </div>
    </Link>
  )
}

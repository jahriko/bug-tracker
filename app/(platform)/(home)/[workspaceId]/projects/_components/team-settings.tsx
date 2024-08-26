/* eslint-disable @next/next/no-img-element */
'use client';

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import {
  UserCircleIcon,
  UserPlusIcon,
} from '@heroicons/react/16/solid';
import clsx from 'clsx';
import { Fragment, useState } from 'react';
import { Avatar } from '@/components/catalyst/avatar';
import { Button } from '@/components/catalyst/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@/components/catalyst/dialog';
import { type Project } from '../_data/project-data';

export default function TeamSettings({
  projectMembers,
  project,
  workspaceMembers,
}: {
  projectMembers: Project[number]['members'];
  project: Project[number];
  workspaceMembers: Project[number]['workspace']['members'];
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Function to get the workspace member role
  const getWorkspaceMemberRole = (userId: string) => {
    const workspaceMember = workspaceMembers.find(
      (member) => member.user.id === userId,
    );
    return workspaceMember?.role ?? 'MEMBER';
  };

  return (
    <>
      <button
        className="cursor-pointer text-base font-medium leading-6 text-gray-900 hover:underline"
        type="button"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {project.title}
      </button>

      <Dialog open={isOpen} size="3xl" onClose={setIsOpen}>
        <DialogTitle>{project.title}</DialogTitle>
        <DialogDescription>
          Project overview and team management for {project.title}.
        </DialogDescription>
        <DialogBody>
          {/* Team Members */}
          <div className="mb-6">
            <h3 className="mb-2 text-lg font-semibold">Team Members</h3>
            <div className="mb-4 flex items-center gap-x-2">
              <div className="flex-grow">
                <SearchCombobox people={workspaceMembers} />
              </div>
              <Button>
                <UserPlusIcon className="mr-2 h-5 w-5" />
                Invite
              </Button>
            </div>
            <ul className="divide-y divide-gray-100">
              {projectMembers.map((member) => {
                const workspaceRole = getWorkspaceMemberRole(member.user.id);
                return (
                  <li
                    key={member.user.email}
                    className="flex items-center justify-between gap-x-4 py-5"
                  >
                    <div className="flex items-center gap-x-4">
                      {member.user.image ? (
                        <img
                          alt="User Avatar"
                          className="h-12 w-12 flex-none rounded-full bg-gray-50"
                          src={member.user.image}
                        />
                      ) : (
                        <UserCircleIcon className="h-12 w-12 flex-none rounded-full bg-gray-50 p-2 text-gray-400" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold leading-6 text-gray-900">
                          {member.user.name}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          {member.user.email}
                        </p>
                      </div>
                    </div>
                    {workspaceRole === 'ADMIN' && (
                      <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                        Admin
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </DialogBody>
        <DialogActions>
          <Button
            plain
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function SearchCombobox({
  people,
}: {
  people: Project[number]['workspace']['members'];
}) {
  const [query, setQuery] = useState(' ');
  const [selected, setSelected] = useState<(typeof people)[number] | null>(
    null,
  );

  const filteredPeople =
    query === ''
      ? people
      : people.filter((person) => {
          return person.user.name.toLowerCase().includes(query.toLowerCase());
        });

  const sharedClasses = clsx(
    // Base
    'flex min-w-0 items-center',
    // Icons
    '[&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:shrink-0 sm:[&>[data-slot=icon]]:size-4',
    '[&>[data-slot=icon]]:text-zinc-500 [&>[data-slot=icon]]:group-data-[focus]/option:text-white [&>[data-slot=icon]]:dark:text-zinc-400',
    'forced-colors:[&>[data-slot=icon]]:text-[CanvasText] forced-colors:[&>[data-slot=icon]]:group-data-[focus]/option:text-[Canvas]',
    // Avatars
    '[&>[data-slot=avatar]]:-mx-0.5 [&>[data-slot=avatar]]:size-6 sm:[&>[data-slot=avatar]]:size-5',
  );

  return (
    <Combobox
      value={selected}
      onChange={setSelected}
      onClose={() => {
        setQuery('');
      }}
    >
      <div className="relative">
        <div className="relative">
          {selected?.user.image ? (
            <Avatar
              alt={selected.user.name}
              className="absolute left-3 top-1/2 size-5 -translate-y-1/2"
              src={selected.user.image}
            />
          ) : (
            <UserCircleIcon className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-zinc-500" />
          )}
          <ComboboxInput
            placeholder="Search..."
            className={clsx(
              'w-full rounded-lg py-[calc(theme(spacing[2.5])-1px)] pl-10 pr-3 sm:py-[calc(theme(spacing[1.5])-1px)]',
              'min-h-11 sm:min-h-9',
              'text-base/6 text-zinc-950 placeholder:text-zinc-500 dark:text-white sm:text-sm/6',
              'border border-zinc-950/10 focus:border-zinc-950/20 dark:border-white/10 dark:focus:border-white/20',
              'bg-white dark:bg-white/5',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
            )}
            displayValue={(person: (typeof people)[number] | null) =>
              person?.user.name ?? ''
            }
            onChange={(event) => {
              setQuery(event.target.value);
            }}
          />
        </div>
      </div>

      <ComboboxOptions
        anchor="bottom start"
        className={clsx(
          // Base styles
          'isolate mt-1.5 w-max min-w-[calc(var(--button-width)+1.75rem)] select-none scroll-py-1 rounded-xl',
          // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
          'outline outline-1 outline-transparent focus:outline-none',
          // Handle scrolling when menu won't fit in viewport
          'overflow-y-scroll overscroll-contain',
          // Popover background
          'bg-white dark:bg-zinc-800/75',
          // Shadows
          'shadow-lg ring-1 ring-zinc-950/10 dark:ring-inset dark:ring-white/10',
        )}
      >
        {filteredPeople.map((person) => (
          <ComboboxOption key={person.user.id} as={Fragment} value={person}>
            {({ active, selected }) => (
              <div
                className={clsx(
                  // Basic layout
                  'group/option grid cursor-default grid-cols-[theme(spacing.5),1fr] items-baseline gap-x-2 rounded-lg py-2.5 pr-3.5 sm:grid-cols-[theme(spacing.2),1fr] sm:py-1.5 sm:pr-3',
                  // Typography
                  'text-base/6 text-zinc-950 dark:text-white sm:text-sm/6 forced-colors:text-[CanvasText]',
                  // Focus
                  'outline-none data-[focus]:bg-zinc-100 data-[focus]:text-black',
                  // Forced colors mode
                  'forced-color-adjust-none forced-colors:data-[focus]:bg-[Highlight] forced-colors:data-[focus]:text-[HighlightText]',
                  // Disabled
                  'data-[disabled]:opacity-50',
                )}
              >
                <span
                  className={clsx(
                    sharedClasses,
                    'col-start-2 flex items-center gap-x-2',
                  )}
                >
                  <Avatar className="h-4 w-4" src={person.user.image} />
                  <span className="font-medium">{person.user.name}</span>
                </span>
              </div>
            )}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  );
}

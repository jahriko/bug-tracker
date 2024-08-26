'use client';
import * as Headless from '@headlessui/react';
import { Square3Stack3DIcon } from '@heroicons/react/16/solid';
import { $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { type EditorState } from 'lexical';
import {
  Ban,
  CheckCircle2,
  CircleDashed,
  Loader2,
  UserPlus,
} from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { debounce } from 'radash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Avatar } from '@/components/catalyst/avatar';
import { Field } from '@/components/catalyst/fieldset';
import { Input } from '@/components/catalyst/input';
import {
  MdiSignalCellular1,
  MdiSignalCellular2,
  MdiSignalCellular3,
  TablerLineDashed,
} from '@/components/icons';
import Editor from '@/components/lexical_editor/editor';
import { updateAssignee } from '../_actions/update-assignee';
import { updateDescription } from '../_actions/update-description';
import { updatePriority } from '../_actions/update-priority';
import { updateProject } from '../_actions/update-project';
import { updateStatus } from '../_actions/update-status';
import { updateTitle } from '../_actions/update-title';
import {
  type AssigneePropertyProps,
  type Priority,
  type ProjectPropertyProps,
  type PropertyProps,
  type Status,
} from '../types';
import { CustomListbox, CustomListboxOption } from './custom-listbox';

const handleServerError = (error: Error) => {
  console.error(error);
  // You could add user-facing error handling here, e.g., toast notification
  toast.error('Something went wrong');
};

function PropertyField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Field>
      <Headless.Label className="select-none text-xs font-medium text-zinc-400">
        {label}
      </Headless.Label>
      {children}
    </Field>
  );
}

const useDebouncedUpdate = (
  updateFunc: (value: string) => void,
  delay = 1000,
) => {
  const debouncedUpdateRef = useRef<ReturnType<typeof debounce>>();

  useEffect(() => {
    debouncedUpdateRef.current = debounce({ delay }, updateFunc);
    return () => {
      debouncedUpdateRef.current?.cancel();
    };
  }, [updateFunc, delay]);

  return debouncedUpdateRef;
};

function CustomListboxField<T extends string | number>({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: T | null | undefined;
  onChange: (value: T) => void;
  options: { value: T; icon: React.ReactNode; label: string }[];
  placeholder: React.ReactNode;
}) {
  return (
    <PropertyField label={label}>
      <CustomListbox
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <CustomListboxOption key={String(option.value)} value={option.value}>
            <div className="flex items-center space-x-2">
              {option.icon}
              <span className="font-medium">{option.label}</span>
            </div>
          </CustomListboxOption>
        ))}
      </CustomListbox>
    </PropertyField>
  );
}

export function StatusProperty({
  issueId,
  value,
  lastActivity,
}: PropertyProps<Status>) {
  const { execute, result } = useAction(updateStatus);
  const handleChange = (status: Status) => {
    try {
      execute({ issueId, status, lastActivity });
      if (result.serverError) {
        console.error('Server error: ', result.serverError);
      }
    } catch (error) {
      handleServerError(error as Error);
    }
  };

  const options = useMemo(
    () => [
      {
        value: 'BACKLOG' as Status,
        icon: <CircleDashed className="size-[1.10rem] text-zinc-500" />,
        label: 'Backlog',
      },
      {
        value: 'IN_PROGRESS' as Status,
        icon: (
          <Loader2 className="size-[1.10rem] text-yellow-700 hover:text-black" />
        ),
        label: 'In Progress',
      },
      {
        value: 'DONE' as Status,
        icon: (
          <CheckCircle2 className="size-[1.10rem] text-indigo-700 hover:text-black" />
        ),
        label: 'Done',
      },
      {
        value: 'CANCELLED' as Status,
        icon: (
          <Ban aria-hidden="true" className="size-[1.10rem] text-red-700" />
        ),
        label: 'Cancelled',
      },
    ],
    [],
  );

  return (
    <CustomListboxField<Status>
      label="Status"
      options={options}
      placeholder={null}
      value={value}
      onChange={handleChange}
    />
  );
}

export function TitleField({
  issueId,
  value,
  lastActivity,
}: PropertyProps<string>) {
  const [title, setTitle] = useState(value ?? '');
  const { execute, result } = useAction(updateTitle);

  const updateFunc = useCallback(
    (currentTitle: string) => {
      try {
        execute({ issueId, title: currentTitle, lastActivity });
        if (result.serverError) {
          console.error('Server error: ', result.serverError);
        }
      } catch (error) {
        handleServerError(error as Error);
      }
    },
    [issueId, lastActivity, result.serverError, execute],
  );

  const debouncedUpdateRef = useDebouncedUpdate(updateFunc);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = event.target.value;
      setTitle(newTitle);
      if (debouncedUpdateRef.current && newTitle !== value) {
        debouncedUpdateRef.current(newTitle);
      }
    },
    [value, debouncedUpdateRef],
  );

  return (
    <PropertyField label="Title">
      <Input
        className="w-full"
        placeholder="Enter issue title"
        type="text"
        value={title}
        onChange={handleChange}
      />
    </PropertyField>
  );
}

export function DescriptionField({
  issueId,
  value,
  lastActivity,
}: PropertyProps<string>) {
  const [description, setDescription] = useState(value ?? '');
  const { execute, result } = useAction(updateDescription);

  const updateFunc = useCallback(
    (currentDescription: string) => {
      try {
        execute({ issueId, description: currentDescription, lastActivity });
        if (result.serverError) {
          console.error('Server error: ', result.serverError);
        }
      } catch (error) {
        handleServerError(error as Error);
      }
    },
    [issueId, lastActivity, result.serverError, execute],
  );

  const debouncedUpdateRef = useDebouncedUpdate(updateFunc, 1500);

  const handleChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        const newDescription = $convertToMarkdownString(TRANSFORMERS);
        setDescription(newDescription);
        if (debouncedUpdateRef.current && newDescription !== value) {
          debouncedUpdateRef.current(newDescription);
        }
      });
    },
    [value, debouncedUpdateRef],
  );

  return (
    <Editor
      initialContent={description}
      placeholderText="Describe the issue..."
      onChange={handleChange}
    />
  );
}

export function PriorityProperty({
  issueId,
  value,
  lastActivity,
}: PropertyProps<Priority>) {
  const { execute, result } = useAction(updatePriority);
  const handleChange = (priority: Priority) => {
    try {
      execute({ issueId, priority, lastActivity });
      if (result.serverError) {
        console.error(result.serverError);
      }
    } catch (error) {
      handleServerError(error as Error);
    }
  };

  const options = useMemo(
    () => [
      {
        value: 'NO_PRIORITY' as Priority,
        icon: (
          <TablerLineDashed
            aria-hidden="true"
            className="size-[1.10rem] text-zinc-700"
          />
        ),
        label: 'No Priority',
      },
      {
        value: 'HIGH' as Priority,
        icon: (
          <MdiSignalCellular3
            aria-hidden="true"
            className="size-[1.10rem] text-zinc-700"
          />
        ),
        label: 'High',
      },
      {
        value: 'MEDIUM' as Priority,
        icon: (
          <MdiSignalCellular2
            aria-hidden="true"
            className="size-[1.10rem] text-zinc-700"
          />
        ),
        label: 'Medium',
      },
      {
        value: 'LOW' as Priority,
        icon: (
          <MdiSignalCellular1
            aria-hidden="true"
            className="size-[1.10rem] text-zinc-700"
          />
        ),
        label: 'Low',
      },
    ],
    [],
  );

  return (
    <CustomListboxField<Priority>
      label="Priority"
      options={options}
      value={value}
      placeholder={
        <div className="flex items-center gap-x-2">
          <TablerLineDashed className="size-4 flex-shrink-0" />
          Set priority
        </div>
      }
      onChange={handleChange}
    />
  );
}

export function AssigneeProperty({
  issueId,
  value,
  projectMembers,
  lastActivity,
}: AssigneePropertyProps) {
  const { execute, result } = useAction(updateAssignee);
  const handleChange = ({
    user: { id, name, image },
  }: {
    user: {
      id: string;
      name: string;
      image: string;
    };
  }) => {
    execute({
      issueId,
      assignedUserId: id,
      assignedUsername: name,
      assignedUserImage: image,
      lastActivity,
    });
    if (result.serverError) {
      console.error('Server Error: ', result.serverError);
    }
  };

  const findUserById = (id: string) => {
    return projectMembers.find(({ user }) => user.id === id);
  };

  return (
    <PropertyField label="Assigned to">
      <CustomListbox
        aria-label="AssignedUser"
        value={value ? findUserById(value) : undefined}
        placeholder={
          <div className="flex items-center gap-x-2">
            <UserPlus className="size-4 flex-shrink-0" />
            Assign
          </div>
        }
        onChange={handleChange}
      >
        {projectMembers.map(({ user: { id, name, image } }) => (
          <CustomListboxOption key={id} value={findUserById(id)}>
            <div className="flex items-center space-x-2">
              <Avatar className="size-4" src={image} />
              <span className="font-medium">{name}</span>
            </div>
          </CustomListboxOption>
        ))}
      </CustomListbox>
    </PropertyField>
  );
}

export function ProjectProperty({
  issueId,
  value,
  lastActivity,
  projects,
}: ProjectPropertyProps) {
  const { execute, result } = useAction(updateProject);
  const handleChange = (projectId: number) => {
    execute({ issueId, projectId, lastActivity });

    if (result.serverError) {
      console.error('Server error: ', result.serverError);
    }
  };

  const findProjectById = (id: number) => {
    return projects.find((project) => project.id === id);
  };

  return (
    <PropertyField label="Project">
      <CustomListbox
        aria-label="Project"
        value={value ? findProjectById(value) : undefined}
        placeholder={
          <div className="flex items-center gap-x-2">
            <Square3Stack3DIcon className="size-4 flex-shrink-0" />
            Project
          </div>
        }
        onChange={handleChange}
      >
        {projects.map((project) => (
          <CustomListboxOption key={project.id} value={project}>
            <div className="flex items-center space-x-2">
              <Avatar className="size-6" initials={project.title.slice(0, 2)} />
              <span className="font-medium">{project.title}</span>
            </div>
          </CustomListboxOption>
        ))}
      </CustomListbox>
    </PropertyField>
  );
}

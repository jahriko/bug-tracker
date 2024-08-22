'use client';
import * as Headless from '@headlessui/react';
import { Square3Stack3DIcon } from '@heroicons/react/16/solid';
import { $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { type Project } from '@prisma/client';
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
import { Avatar } from '@/components/catalyst/avatar';
import { Button } from '@/components/catalyst/button';
import { Field } from '@/components/catalyst/fieldset';
import {
  MdiSignalCellular1,
  MdiSignalCellular2,
  MdiSignalCellular3,
  TablerLineDashed,
} from '@/components/icons';
import Editor from '@/components/lexical_editor/editor';
import { addComment } from '../_actions/add-comment';
import { updateAssignee } from '../_actions/update-assignee';
import { updateDescription } from '../_actions/update-description';
import { updatePriority } from '../_actions/update-priority';
import { updateProject } from '../_actions/update-project';
import { updateStatus } from '../_actions/update-status';
import { updateTitle } from '../_actions/update-title';
import { CustomListbox, CustomListboxOption } from './custom-listbox';
// https://stackoverflow.com/questions/63466463/how-to-submit-react-form-fields-on-onchange-rather-than-on-submit-using-react-ho

export type Status = 'BACKLOG' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
export type Priority = 'NO_PRIORITY' | 'LOW' | 'MEDIUM' | 'HIGH';
export interface AssignedUser {
  id: string;
  name: string;
  image: string | null;
}

interface PropertyProps<T> {
  issueId: number;
  value?: T | null;
  lastActivity: {
    activityType:
      | 'StatusActivity'
      | 'PriorityActivity'
      | 'TitleActivity'
      | 'DescriptionActivity'
      | 'AssignedActivity'
      | 'LabelActivity'
      | 'CommentActivity'
      | 'None';
    activityId: number;
  };
}

const handleServerError = (error: Error) => {
  console.error(error);
  // You could add user-facing error handling here, e.g., toast notification
};

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
        console.log('Server error: ', result.serverError);
      }
    } catch (error) {
      handleServerError(error as Error);
    }
  };

  const options = useMemo(
    () => [
      {
        value: 'BACKLOG',
        icon: <CircleDashed className="size-[1.10rem] text-zinc-500" />,
        label: 'Backlog',
      },
      {
        value: 'IN_PROGRESS',
        icon: (
          <Loader2 className="size-[1.10rem] text-yellow-700 hover:text-black" />
        ),
        label: 'In Progress',
      },
      {
        value: 'DONE',
        icon: (
          <CheckCircle2 className="size-[1.10rem] text-indigo-700 hover:text-black" />
        ),
        label: 'Done',
      },
      {
        value: 'CANCELLED',
        icon: (
          <Ban aria-hidden="true" className="size-[1.10rem] text-red-700" />
        ),
        label: 'Cancelled',
      },
    ],
    [],
  );

  return (
    <Field>
      <Headless.Label className="select-none text-xs font-medium text-zinc-400">
        Status
      </Headless.Label>
      <CustomListbox aria-label="Status" value={value} onChange={handleChange}>
        {options.map(({ value, icon, label }) => (
          <CustomListboxOption key={value} value={value}>
            <div className="flex items-center space-x-2">
              {icon}
              <span className="font-medium">{label}</span>
            </div>
          </CustomListboxOption>
        ))}
      </CustomListbox>
    </Field>
  );
}

export function TitleField({
  issueId,
  value,
  lastActivity,
}: PropertyProps<string>) {
  const [title, setTitle] = useState(value ?? '');
  const debouncedUpdateRef = useRef<ReturnType<typeof debounce>>();
  const { execute, result } = useAction(updateTitle);

  const updateFunc = useCallback(
    (currentTitle: string) => {
      try {
        execute({
          issueId,
          title: currentTitle,
          lastActivity,
        });

        if (result.serverError) {
          console.error('Server error: ', result.serverError);
        }
      } catch (error) {
        handleServerError(error as Error);
      }
    },
    [issueId, lastActivity, result.serverError, execute],
  );

  useEffect(() => {
    debouncedUpdateRef.current = debounce({ delay: 1000 }, updateFunc);
    return () => {
      debouncedUpdateRef.current?.cancel();
    };
  }, [updateFunc]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = event.target.value;
      setTitle(newTitle);
      if (debouncedUpdateRef.current && newTitle !== value) {
        debouncedUpdateRef.current(newTitle);
      }
    },
    [value],
  );

  return (
    <Field>
      <Headless.Label className="select-none text-xs font-medium text-zinc-400">
        Title
      </Headless.Label>
      <Input
        type="text"
        value={title}
        onChange={handleChange}
        placeholder="Enter issue title"
        className="w-full"
      />
    </Field>
  );
}


export function DescriptionField({
  issueId,
  value,
  lastActivity,
}: PropertyProps<string>) {
  const [description, setDescription] = useState(value ?? '');
  const debouncedUpdateRef = useRef<ReturnType<typeof debounce>>();
  const { execute, result } = useAction(updateDescription);

  const updateFunc = useCallback(
    (currentDescription: string) => {
      try {
        execute({
          issueId,
          description: currentDescription,
          lastActivity,
        });

        if (result.serverError) {
          console.error('Server error: ', result.serverError);
        }
      } catch (error) {
        handleServerError(error as Error);
      }
    },
    [issueId, lastActivity, result.serverError, execute],
  );

  useEffect(() => {
    debouncedUpdateRef.current = debounce({ delay: 1500 }, updateFunc);
    return () => {
      debouncedUpdateRef.current?.cancel();
    };
  }, [updateFunc]);

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
    [value],
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
      execute({
        issueId,
        priority,
        lastActivity,
      });

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
        priorityName: 'NO_PRIORITY',
        icon: (
          <TablerLineDashed
            aria-hidden="true"
            className="size-[1.10rem] text-zinc-700"
          />
        ),
        label: 'No Priority',
      },
      {
        priorityName: 'HIGH',
        icon: (
          <MdiSignalCellular3
            aria-hidden="true"
            className="size-[1.10rem] text-zinc-700"
          />
        ),
        label: 'High',
      },
      {
        priorityName: 'MEDIUM',
        icon: (
          <MdiSignalCellular2
            aria-hidden="true"
            className="size-[1.10rem] text-zinc-700"
          />
        ),
        label: 'Medium',
      },
      {
        priorityName: 'LOW',
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
    <Field>
      <Headless.Label className="select-none text-xs font-medium text-zinc-400">
        Priority
      </Headless.Label>
      <CustomListbox
        aria-label="Priority"
        onChange={handleChange}
        {...(value && { value })}
        placeholder={
          <div className="flex items-center gap-x-2">
            <TablerLineDashed className="size-4 flex-shrink-0" />
            Set priority
          </div>
        }
      >
        {options.map(({ priorityName, icon, label }) => (
          <CustomListboxOption key={priorityName} value={priorityName}>
            <div className="flex items-center space-x-2">
              {icon}
              <span className="font-medium">{label}</span>
            </div>
          </CustomListboxOption>
        ))}
      </CustomListbox>
    </Field>
  );
}

export function AssigneeProperty({
  issueId,
  value,
  projectMembers,
  lastActivity,
}: PropertyProps<string> & {
  projectMembers: {
    user: {
      id: string;
      name: string;
      image: string | null;
    };
  }[];
}) {
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
    <Field>
      <Headless.Label className="select-none text-xs font-medium text-zinc-400">
        Assigned to
      </Headless.Label>
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
    </Field>
  );
}

export function AddComment({ issueId, lastActivity }: PropertyProps<string>) {
  const [comment, setComment] = useState('');
  const { execute, result } = useAction(addComment);

  const handleChange = useCallback((editorState: EditorState) => {
    editorState.read(() => {
      const comment = $convertToMarkdownString(TRANSFORMERS);
      setComment(comment);
    });
  }, []);

  return (
    <>
      <Editor
        withBorder
        placeholderText="Write a comment"
        type="commentBox"
        onChange={handleChange}
      />
      <div className="mt-6 flex items-center justify-end">
        <Button
          onClick={() => {
            execute({ commentBody: comment, issueId, lastActivity });

            if (result.serverError) {
              console.error('Server error: ', result.serverError);
            }
          }}
        >
          Comment
        </Button>
      </div>
    </>
  );
}

export function ProjectProperty({
  issueId,
  value,
  lastActivity,
  projects,
}: PropertyProps<number> & { projects: Project[] }) {
  console.log('projects', projects);
  console.log('project of issue', value);
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
    <Field>
      <Headless.Label className="select-none text-xs font-medium text-zinc-400">
        Project
      </Headless.Label>
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
    </Field>
  );
}

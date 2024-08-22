'use client';
import {
  PencilSquareIcon,
  Square3Stack3DIcon,
} from '@heroicons/react/16/solid';
import { $convertToMarkdownString } from '@lexical/markdown';
import { type Project } from '@prisma/client';
import { Ban, CheckCircle2, CircleDashed, Loader2, User2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { flattenValidationErrors } from 'next-safe-action';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { toast } from 'sonner';
import { Avatar } from '@/components/catalyst/avatar';
import { Button } from '@/components/catalyst/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
} from '@/components/catalyst/dialog';
import { Field } from '@/components/catalyst/fieldset';
import { Input } from '@/components/catalyst/input';
import {
  MdiSignalCellular1,
  MdiSignalCellular2,
  MdiSignalCellular3,
  TablerLineDashed,
} from '@/components/icons';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { type IssueSchema } from '@/lib/validations.js';
import { type LabelsData } from '@/server/data/many/get-labels';
import { type UsersData } from '@/server/data/many/get-users';

import { createIssue } from '../../_actions/create-issue';
import {
  CustomListbox,
  CustomListboxLabel,
  CustomListboxOption,
} from '../../_components/custom-listbox';
import { LabelSelector } from '../../_components/label-selector';
import { type WorkspaceDataType } from '../_data/workspace-data';

const Editor = dynamic(() => import('@/components/lexical_editor/editor'), {
  ssr: false,
});

const priorityOptions = [
  {
    value: 'NO_PRIORITY',
    icon: (
      <TablerLineDashed
        aria-hidden="true"
        className="size-[1.10rem] text-gray-700"
      />
    ),
    label: 'No Priority',
  },
  {
    value: 'HIGH',
    icon: (
      <MdiSignalCellular3
        aria-hidden="true"
        className="size-[1.10rem] text-gray-700"
      />
    ),
    label: 'High',
  },
  {
    value: 'MEDIUM',
    icon: (
      <MdiSignalCellular2
        aria-hidden="true"
        className="size-[1.10rem] text-gray-700"
      />
    ),
    label: 'Medium',
  },
  {
    value: 'LOW',
    icon: (
      <MdiSignalCellular1
        aria-hidden="true"
        className="size-[1.10rem] text-gray-700"
      />
    ),
    label: 'Low',
  },
];

const statusOptions = [
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
    icon: <Ban aria-hidden="true" className="size-[1.10rem] text-red-700" />,
    label: 'Cancelled',
  },
];

export default function NewIssueDialog({
  assignees,
  labels,
  hasProjects,
  projects,
}: {
  assignees: UsersData;
  labels: LabelsData;
  hasProjects: boolean;
  projects: WorkspaceDataType['projects'];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm<IssueSchema>({
    defaultValues: {
      title: '',
      description: '',
      status: 'BACKLOG',
      priority: 'NO_PRIORITY',
      labels: [],
    },
  });

  const handleOpenDialog = () => {
    if (!hasProjects) {
      toast.info('No Projects Found', {
        description: 'Create a project first before creating an issue',
        action: {
          label: 'Create Project',
          onClick: () => {
            router.push(`${pathname}/create-project`);
          },
        },
      });
      return;
    }
    setIsOpen(true);
  };

  const onSubmit = async (data: IssueSchema) => {
    const result = await createIssue(data);

    if (!result) {
      toast.error('Something went wrong');
      return;
    }

    if (result.serverError) {
      toast.error(result.serverError);
    }

    if (result.validationErrors) {
      const flattenedErrors = flattenValidationErrors(result.validationErrors);
      if (flattenedErrors.formErrors.length > 0) {
        toast.error(flattenedErrors.formErrors[0]);
      } else if (Object.keys(flattenedErrors.fieldErrors).length > 0) {
        const firstFieldError = Object.values(flattenedErrors.fieldErrors)[0];
        if (Array.isArray(firstFieldError) && firstFieldError.length > 0) {
          toast.error(firstFieldError[0]);
        }
      }
      return;
    }

    if (result.data) {
      setIsOpen(false);
      form.reset();
      toast.success('Issue created', { description: data.title });
    }
  };

  return (
    <>
      <Button onClick={handleOpenDialog}>
        <PencilSquareIcon className="size-4" />
        New Issue
      </Button>
      <Dialog open={isOpen} size="3xl" onClose={setIsOpen}>
        <DialogBody className="!mt-0">
          <Form {...form}>
            <form id="create-issue" onSubmit={form.handleSubmit(onSubmit)}>
              <div data-slot="control">
                <div data-slot="control">
                  <Field>
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              borderless
                              aria-label="Issue Title"
                              className="font-semibold [&>*]:px-0 [&>*]:text-lg [&>*]:leading-none"
                              name="title"
                              placeholder="Issue Title"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </Field>
                  <Field>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => {
                        const { ref, ...rest } = field;
                        return (
                          <FormItem>
                            <FormControl>
                              <Editor
                                {...rest}
                                placeholderText="Describe the issue"
                                onChange={(editorState) => {
                                  editorState.read(() => {
                                    const markdown = $convertToMarkdownString();
                                    field.onChange(markdown);
                                  });
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        );
                      }}
                    />
                  </Field>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {/* Status */}
                  <Field className="flex-shrink truncate">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => {
                        const { ref, ...rest } = field;
                        return (
                          <FormItem>
                            <FormControl>
                              <CustomListbox
                                {...rest}
                                className="max-w-40"
                                defaultValue="BACKLOG"
                                name="status"
                              >
                                {statusOptions.map(({ value, label, icon }) => (
                                  <CustomListboxOption
                                    key={value}
                                    value={value}
                                  >
                                    {icon}
                                    <CustomListboxLabel>
                                      {label}
                                    </CustomListboxLabel>
                                  </CustomListboxOption>
                                ))}
                              </CustomListbox>
                            </FormControl>
                          </FormItem>
                        );
                      }}
                    />
                  </Field>

                  {/* Priority */}
                  <Field className="flex-shrink truncate">
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => {
                        const { ref, ...rest } = field;
                        return (
                          <FormItem>
                            <FormControl>
                              <CustomListbox
                                {...rest}
                                name="priority"
                                placeholder={
                                  <div className="flex min-w-0 items-center gap-x-2">
                                    <TablerLineDashed className="size-4 flex-shrink-0" />
                                    Priority
                                  </div>
                                }
                              >
                                {priorityOptions.map(
                                  ({ value, label, icon }) => (
                                    <CustomListboxOption
                                      key={value}
                                      value={value}
                                    >
                                      {icon}
                                      <CustomListboxLabel>
                                        {label}
                                      </CustomListboxLabel>
                                    </CustomListboxOption>
                                  ),
                                )}
                              </CustomListbox>
                            </FormControl>
                          </FormItem>
                        );
                      }}
                    />
                  </Field>

                  {/* Assignees */}
                  <Field className="flex-shrink truncate">
                    <FormField
                      control={form.control}
                      name="assigneeId"
                      render={({ field }) => {
                        const { ref, ...rest } = field;

                        return (
                          <FormItem>
                            <FormControl>
                              <CustomListbox
                                {...rest}
                                name="assignee"
                                placeholder={
                                  <div className="flex items-center gap-x-2">
                                    <User2 className="size-4 flex-shrink-0" />
                                    Assignee
                                  </div>
                                }
                              >
                                {assignees.map((assignee) => (
                                  <CustomListboxOption
                                    key={assignee.id}
                                    value={assignee.id}
                                  >
                                    <Avatar
                                      className="size-4 text-white"
                                      src={assignee.image}
                                    />
                                    <CustomListboxLabel>
                                      {assignee.name}
                                    </CustomListboxLabel>
                                  </CustomListboxOption>
                                ))}
                              </CustomListbox>
                            </FormControl>
                          </FormItem>
                        );
                      }}
                    />
                  </Field>

                  {/* Labels */}
                  <Field className="flex-shrink">
                    <FormField
                      control={form.control}
                      name="labels"
                      render={({ field }) => {
                        const { ref, ...rest } = field;
                        return (
                          <FormItem>
                            <FormControl>
                              <LabelSelector {...rest} labels={labels} />
                            </FormControl>
                          </FormItem>
                        );
                      }}
                    />
                  </Field>

                  {/* Projects */}
                  <Field className="flex-shrink truncate">
                    <FormField
                      control={form.control}
                      name="projectId"
                      render={({ field }) => {
                        const { ref, ...rest } = field;

                        return (
                          <FormItem>
                            <FormControl>
                              <CustomListbox
                                {...rest}
                                name="projectId"
                                placeholder={
                                  <div className="flex items-center gap-x-2">
                                    <Square3Stack3DIcon className="size-4 flex-shrink-0" />
                                    Project
                                  </div>
                                }
                              >
                                {projects.map((project) => (
                                  <CustomListboxOption
                                    key={project.id}
                                    value={project.id}
                                  >
                                    <Avatar
                                      alt=""
                                      className="bg-purple-500 text-white"
                                      initials={project.title.substring(0, 2)}
                                    />
                                    <CustomListboxLabel>
                                      {project.title}
                                    </CustomListboxLabel>
                                  </CustomListboxOption>
                                ))}
                              </CustomListbox>
                            </FormControl>
                          </FormItem>
                        );
                      }}
                    />
                  </Field>
                </div>
              </div>
            </form>
          </Form>
        </DialogBody>
        <DialogActions className="!mt-4">
          <Button
            plain
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button form="create-issue" type="submit">
            Submit issue
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

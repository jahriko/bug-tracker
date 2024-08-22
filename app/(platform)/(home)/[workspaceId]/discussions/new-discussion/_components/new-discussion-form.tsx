'use client';

import { PencilSquareIcon } from '@heroicons/react/16/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import { type Project } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/catalyst/button';
import {
  Field,
  FieldGroup,
  Fieldset,
  Label,
} from '@/components/catalyst/fieldset';
import { Input } from '@/components/catalyst/input';
import { Select } from '@/components/catalyst/select';
import { Textarea } from '@/components/catalyst/textarea';
import { Icons } from '@/components/icons';
import { createDiscussion } from '../_actions/create-discussion';

const discussionSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less'),
  content: z.string().min(1, 'Body is required'),
  projectId: z.number().min(1, 'Project is required'),
  categoryId: z.number(),
});

type DiscussionFormData = z.infer<typeof discussionSchema>;

interface NewDiscussionFormProps {
  workspaceUrl: string;
  projects: Pick<Project, 'id' | 'title'>[];
  category: {
    id: number;
    name: string;
    emoji: string;
  };
}

export function NewDiscussionForm({
  workspaceUrl,
  projects,
  category,
}: NewDiscussionFormProps) {
  const router = useRouter();
  const form = useForm<DiscussionFormData>({
    resolver: zodResolver(discussionSchema),
    defaultValues: {
      categoryId: category.id,
      projectId: projects.length > 0 ? projects[0].id : undefined,
    },
  });

  const {
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    const firstError = Object.values(errors)[0];
    if (firstError) {
      toast.error(firstError.message);
    }
  }, [errors]);

  const onSubmit = async (data: DiscussionFormData) => {
    const result = await createDiscussion({
      ...data,
      workspaceUrl,
    });

    if (!result) {
      toast.error('Something went wrong');
      return;
    }

    if (result.serverError) {
      toast.error('Server error:', { description: result.serverError });
      return;
    }

    if (result.data) {
      toast.success('Discussion created', { description: result.data.title });
      form.reset();
      router.push(`/${workspaceUrl}/discussions/${result.data.id}`);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Fieldset>
        <FieldGroup>
          <div className="mb-4 flex items-center justify-between rounded-lg bg-zinc-50 p-4 shadow-sm ring-1 ring-inset ring-zinc-900/5">
            <div className="flex items-center gap-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100 fill-current text-sm text-emerald-500">
                {category.emoji}
              </span>
              <span className="inline-block text-sm font-medium text-slate-600 dark:text-slate-300">
                {category.name}
              </span>
            </div>
            <Button
              href={`/${workspaceUrl}/discussions/new-discussion/choose-category`}
            >
              <PencilSquareIcon />
              Change
            </Button>
          </div>

          <Field>
            <Label htmlFor="projectId">Project</Label>
            <Select {...form.register('projectId', { valueAsNumber: true })}>
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </Select>
          </Field>

          <Field>
            <Label htmlFor="title">Title</Label>
            <Input
              {...form.register('title')}
              placeholder="Enter discussion title"
            />
          </Field>

          <Field>
            <Label htmlFor="content">Body</Label>
            <Textarea
              rows={5}
              {...form.register('content')}
              placeholder="Enter discussion content"
            />
          </Field>

          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? (
              <Icons.spinner className="size-4 animate-spin" />
            ) : null}
            Create
          </Button>
        </FieldGroup>
      </Fieldset>
    </form>
  );
}

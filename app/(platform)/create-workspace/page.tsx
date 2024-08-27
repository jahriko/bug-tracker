'use client';
import * as Headless from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/16/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
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
import { Icons } from '@/components/icons';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { createWorkspace } from './_actions/create-workspace';

const schema = z.object({
  name: z.string().min(2, { message: 'Workspace name is required.' }),
  url: z.string().refine((value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), {
    message: 'Invalid slug format',
  }),
});

export default function CreateWorkspacePage() {
  const { execute, result, isExecuting } = useAction(createWorkspace);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      url: '',
    },
  });

  const [isUrlManuallyEdited, setIsUrlManuallyEdited] = useState(false);

  const slugify = (str: string) => {
    return str
      .toLowerCase()
      .replace(/ /g, '-') // Replace space with dash
      .replace(/[^a-z0-9-]/g, '') // no special characters
      .replace(/-{2,}/g, '-') // Prevent more than one dash between letters/numbers
      .replace(/^-/, ''); // Remove dash if it's the first character
  };

  const handleNameChange = (e: any) => {
    const newValue = e.target.value.replace(/^\s+/, ''); // Remove leading spaces
    form.setValue('name', newValue);

    if (!isUrlManuallyEdited) {
      form.setValue('url', slugify(newValue));
    }
  };

  const handleUrlChange = (e: any) => {
    setIsUrlManuallyEdited(true);
    form.setValue('url', slugify(e.target.value));
  };

  const workspaceUrlValue = form.watch('url');

  function onSubmit(data: z.infer<typeof schema>) {
    execute(data);

    if (result.serverError) {
      return toast.error(result.serverError);
    }

    if (result.data) {
      toast.success('Workspace and project created successfully');
      form.reset();
    }
  }

  return (
    <div className="mx-auto flex h-screen max-w-sm items-center">
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(60%_100%_at_top_left,white,transparent)]"
      >
        <defs>
          <pattern
            height={200}
            id="0787a7c5-978c-4f66-83c7-11c213f99cb7"
            patternUnits="userSpaceOnUse"
            width={200}
            x="50%"
            y={-1}
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <rect
          fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)"
          height="100%"
          strokeWidth={0}
          width="100%"
        />
      </svg>
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_bottom_right,white,transparent)]"
      >
        <defs>
          <pattern
            height={200}
            id="0787a7c5-978c-4f66-83c7-11c213f99cb7"
            patternUnits="userSpaceOnUse"
            width={200}
            x="50%"
            y={-1}
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <rect
          fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)"
          height="100%"
          strokeWidth={0}
          width="100%"
        />
      </svg>
      <div>
        <div className="text-center">
          <svg
            aria-hidden="true"
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
          >
            <path
              d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          <h2 className="mt-2 text-base font-semibold leading-6 text-gray-900">
            Create a workspace
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Create a dedicated workspace where your team can collaborate and
            track progress together.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Fieldset>
              <FieldGroup>
                <Field className="mt-8 w-full">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => {
                      return (
                        <FormItem className="w-full">
                          <FormControl>
                            <Headless.Field className="relative">
                              <Label htmlFor="workspace-name">
                                Workspace Name
                              </Label>
                              <Input
                                {...field}
                                id="workspace-name"
                                name="workspace-name"
                                onChange={handleNameChange}
                                onBlur={(e) => {
                                  e.preventDefault();
                                  form.setValue(
                                    'url',
                                    workspaceUrlValue.endsWith('-')
                                      ? workspaceUrlValue.replace(/-+$/, '')
                                      : workspaceUrlValue,
                                  );
                                }}
                              />
                            </Headless.Field>
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                </Field>

                <Field className="mt-8 w-full">
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => {
                      return (
                        <FormItem className="w-full">
                          <FormControl>
                            <Headless.Field className="relative">
                              <Label htmlFor="url">Workspace URL</Label>
                              <Input
                                {...field}
                                id="url"
                                name="url"
                                onChange={handleUrlChange}
                                onBlur={(e) => {
                                  form.setValue(
                                    'url',
                                    e.target.value.replace(/-+$/, ''),
                                  );
                                }}
                              />
                            </Headless.Field>
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                </Field>
              </FieldGroup>
            </Fieldset>

            <Button
              className="mt-8 w-full"
              disabled={isExecuting}
              type="submit"
            >
              <PlusIcon />
              {isExecuting ? (
                <Icons.spinner className="size-4 animate-spin" />
              ) : null}
              Create workspace
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

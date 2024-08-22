'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/catalyst/button';
import { Input } from '@/components/catalyst/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Icons } from '../../../../components/icons';
import { createWorkspace } from '@/app/(platform)/create-workspace/create-workspace';

const schema = z.object({
  name: z.string().min(2, { message: 'Workspace name is required.' }),
});

export function CreateWorkspace() {
  const router = useRouter();
  const { execute, result, isExecuting } = useAction(createWorkspace);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
    },
  });

  async function onSubmit(data: z.infer<typeof schema>) {
    execute(data);

    const { serverError } = result;

    if (serverError) {
      return toast.error(serverError);
    }

    form.reset();

    router.push(`${result.data?.workspaceName}`);

    return toast.success('Workspace created');
  }

  return (
    <div className="mx-auto flex h-screen max-w-lg items-center">
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
          <form
            className="mt-6 flex items-center"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <label className="sr-only" htmlFor="email">
              Email address
            </label>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        id="workspace"
                        name="workspace"
                        placeholder="Workspace name"
                      />
                      <FormMessage />
                    </FormControl>
                  </FormItem>
                );
              }}
            />

            <Button
              className="ml-4 flex-shrink-0 px-3 py-2"
              disabled={isExecuting}
              type="submit"
            >
              {isExecuting ? (
                <Icons.spinner className="size-4 animate-spin" />
              ) : null}
              Create
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

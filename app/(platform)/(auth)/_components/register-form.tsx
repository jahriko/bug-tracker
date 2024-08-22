'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { register } from '@/app/(platform)/(auth)/_actions/register';
import { Button } from '@/components/catalyst/button';
import { Input } from '@/components/catalyst/input';
import { Icons } from '@/components/icons';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RegisterSchema } from '@/lib/validations';

function RegisterForm() {
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: RegisterSchema) => {
    startTransition(() => {
      register(values)
        .then((data) => {
          if (data.error) {
            return toast(data.error);
          }

          if (data.success) {
            return toast(data.success);
          }
        })
        .catch(() => {
          toast('Something went wrong');
        });
    });
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Register account
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form {...form}>
          <form
            className="w-96 space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your email</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Re-enter your password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button className="mt-6 w-full" disabled={isPending} type="submit">
              {isPending ? (
                // eslint-disable-next-line react/jsx-pascal-case
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Sign up
            </Button>
          </form>
          <p className="text-md mt-5 text-center text-gray-600">
            Already have an account?
            <Link className="ml-1 text-blue-500 hover:underline" href="/login">
              Login
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
}

export default RegisterForm;

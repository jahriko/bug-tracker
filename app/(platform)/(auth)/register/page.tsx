'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { registerAction } from '@/app/(platform)/(auth)/_actions/register';
import { Button } from '@/components/catalyst/button';
import {
  Field,
  FieldGroup,
  Fieldset,
  Label,
} from '@/components/catalyst/fieldset';
import { Input } from '@/components/catalyst/input';
import { Text, TextLink } from '@/components/catalyst/text';
import { Icons } from '@/components/icons';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { RegisterSchema } from '@/lib/validations';

export default function RegisterPage() {
  const { execute, result, isExecuting } = useAction(registerAction);
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

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
            onSubmit={form.handleSubmit((values: RegisterSchema) => {
              execute(values);

              const { serverError, data } = result;

              if (data?.error) {
                return toast.error(data.error);
              }

              if (serverError) {
                return toast.error(serverError);
              }
            })}
          >
            <Fieldset>
              <FieldGroup>
                <Field>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Your email</Label>
                        <FormControl>
                          <Input placeholder="johndoe@example.com" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </Field>
                <Field>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Name</Label>
                        <FormControl>
                          <Input placeholder="johndoe" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </Field>
                <Field>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Password</Label>
                        <FormControl>
                          <Input
                            placeholder="Enter your password"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </Field>
                <Field>
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Confirm password</Label>
                        <FormControl>
                          <Input
                            placeholder="Re-enter your password"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </Field>
                <Button
                  className="mt-6 w-full"
                  disabled={isExecuting}
                  type="submit"
                >
                  {isExecuting ? (
                    // eslint-disable-next-line react/jsx-pascal-case
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Sign up
                </Button>
              </FieldGroup>
            </Fieldset>
          </form>
          <Text className="text-md mt-5 text-center text-gray-600">
            Already have an account?
            <TextLink
              className="ml-1 text-blue-500 hover:underline"
              href="/login"
            >
              Login
            </TextLink>
          </Text>
        </Form>
      </div>
    </div>
  );
}

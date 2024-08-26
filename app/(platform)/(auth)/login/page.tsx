/* eslint-disable react/jsx-pascal-case */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import router from 'next/router';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { loginAction } from '@/app/(platform)/(auth)/_actions/login';
import { loginDemo } from '@/app/(platform)/(auth)/_actions/login-demo';
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
import {
  LoginSchema,
  type LoginSchema as LoginSchemaType,
} from '@/lib/validations';

export default function LoginPage() {
  const { execute: executeDemo, isExecuting: isExecutingDemo } =
    useAction(loginDemo);

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { execute: loginExecute, isExecuting } = useAction(loginAction, {
    onError: ({ error }) => {
      if (error.serverError) {
        toast.error(error.serverError);
      } else if (error.validationErrors) {
        // Handle validation errors from the schema
        Object.values(error.validationErrors).forEach((errorObj) => {
          if (Array.isArray(errorObj)) {
            if (errorObj.length > 0) {
              toast.error(errorObj[0]);
            }
          } else if (typeof errorObj === 'object' && errorObj._errors) {
            if (errorObj._errors.length > 0) {
              toast.error(errorObj._errors[0]);
            }
          }
        });
      }
    },
  });

  const onSubmit = form.handleSubmit((values: LoginSchemaType) => {
    loginExecute(values);
  });

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Login to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <Fieldset>
              <FieldGroup>
                <Field>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Field>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              {...field}
                              disabled={isExecuting}
                              placeholder="john.smith@example.com"
                              type="email"
                            />
                          </Field>
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
                        <FormControl>
                          <Field>
                            <Label htmlFor="password">Password</Label>
                            <Input
                              {...field}
                              disabled={isExecuting}
                              type="password"
                            />
                          </Field>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </Field>

                <div>
                  <Button
                    className="w-full"
                    disabled={isExecuting}
                    type="submit"
                  >
                    {isExecuting ? (
                      <Icons.spinner className="size-4 animate-spin" />
                    ) : null}
                    Login
                  </Button>
                </div>
              </FieldGroup>
            </Fieldset>
          </form>
        </Form>
        <div className="mt-4">
          <Button
            outline
            className="w-full"
            disabled={isExecutingDemo}
            onClick={() => {
              executeDemo({});
            }}
          >
            {isExecutingDemo ? (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            ) : null}
            Login as Demo Admin
          </Button>
        </div>
        <Text className="text-md mt-5 text-center text-gray-600">
          Need an account?
          <TextLink
            className="ml-1 text-blue-500 hover:underline"
            href="/register"
          >
            Create one
          </TextLink>
        </Text>
      </div>
    </div>
  );
}
"use client"

import { Button } from "@/components/catalyst/button"
import { Input } from "@/components/catalyst/input"
import { Icons } from "@/components/icons"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { LoginSchema, type LoginSchema as LoginSchemaType } from "@/lib/validations"
import { login } from "@/app/(platform)/(auth)/_actions/login"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Field, FieldGroup, Fieldset } from "../../../../components/catalyst/fieldset"
import { Text, TextLink } from "../../../../components/catalyst/text"

export default function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")
  const { execute, result, isExecuting } = useAction(login)

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              // onSubmit
              (values: LoginSchemaType) => {
                execute(values)

                const { serverError, data } = result

                if (serverError) {
                  toast.error(serverError)
                }
              },
              // onError
              (errors) => {
                const firstError = Object.values(errors)[0]
                if (firstError) {
                  toast.error(firstError.message)
                }
              },
            )}
          >
            <Fieldset>
              <FieldGroup>
                <Field>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <label
                              className="absolute -top-2 left-2 z-10 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                              htmlFor="email"
                            >
                              Email
                            </label>
                            <Input
                              {...field}
                              // className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              disabled={isExecuting}
                              placeholder="john.smith@example.com"
                              type="email"
                            />
                          </div>
                        </FormControl>
                        {/* <FormMessage /> */}
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
                          <div className="relative">
                            <label
                              className="absolute -top-2 left-2 z-10 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                              htmlFor="password"
                            >
                              Password
                            </label>
                            <Input
                              {...field}
                              // className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              disabled={isExecuting}
                              type="password"
                            />
                          </div>
                        </FormControl>
                        {/* <FormMessage /> */}
                      </FormItem>
                    )}
                  />
                </Field>

                {/* <div>
                  <div>
                    <Headless.Field className="relative">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                                <label
                                  htmlFor="workspace-name"
                                  className="absolute -top-2 left-2 z-10 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                                >
                                  Password
                                </label>
                                <Input
                                  {...field}
                                  // className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  disabled={isExecuting}
                                  type="password"
                                />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </Headless.Field>
                  </div>
                </div> */}
                <div>
                  {/* Disable button if it's executing or both fields are empty */}
                  <Button className="w-full" disabled={isExecuting} type="submit">
                    {isExecuting ? (
                      // eslint-disable-next-line react/jsx-pascal-case
                      <Icons.spinner className="size-4 animate-spin" />
                    ) : null}
                    Sign in
                  </Button>
                </div>
              </FieldGroup>
            </Fieldset>
          </form>
        </Form>
        <Text className="text-md mt-5 text-center text-gray-600">
          Need an account?
          <TextLink className="ml-1 text-blue-500 hover:underline" href="/register">
            Create one
          </TextLink>
        </Text>
      </div>
    </div>
  )
}

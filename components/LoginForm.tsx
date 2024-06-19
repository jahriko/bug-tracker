"use client"

import { Button } from "@/components/catalyst/button"
import { Input } from "@/components/catalyst/input"
import { Icons } from "@/components/icons"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { LoginSchema, type LoginSchema as LoginSchemaType } from "@/lib/validations"
import { login } from "@/server/actions/login"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { FieldGroup, Fieldset, Label } from "./catalyst/fieldset"
import { Text, TextLink } from "./catalyst/text"

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
            onSubmit={form.handleSubmit((values: LoginSchemaType) => {
              execute(values)

              const { serverError } = result

              if (serverError) {
                toast.error(serverError)
                return
              }
            })}
          >
            <Fieldset>
              <FieldGroup>
                <div>
                  <Label
                    className="block text-sm font-medium text-gray-900"
                    htmlFor="email"
                  >
                    Email address
                  </Label>
                  <div>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              // className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              disabled={isExecuting}
                              placeholder="john.smith@example.com"
                              type="email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label
                      className="block text-sm font-medium leading-6 text-gray-900"
                      htmlFor="password"
                    >
                      Password
                    </Label>
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
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
                  </div>
                </div>
                <div>
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

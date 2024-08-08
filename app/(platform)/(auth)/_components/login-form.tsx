/* eslint-disable react/jsx-pascal-case */
"use client"

import { login } from "@/app/(platform)/(auth)/_actions/login"
import { loginDemo } from "@/app/(platform)/(auth)/_actions/login-demo"
import { Button } from "@/components/catalyst/button"
import { Input } from "@/components/catalyst/input"
import { Icons } from "@/components/icons"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { LoginSchema, type LoginSchema as LoginSchemaType } from "@/lib/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Field, FieldGroup, Fieldset, Label } from "../../../../components/catalyst/fieldset"
import { Text, TextLink } from "../../../../components/catalyst/text"

export default function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")
  const { execute, result, isExecuting } = useAction(login)
  const { execute: executeDemo, result: resultDemo, isExecuting: isExecutingDemo } = useAction(loginDemo)

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
          Login to your account
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
                          <Field>
                            <Label htmlFor="password">Password</Label>
                            <Input {...field} disabled={isExecuting} type="password" />
                          </Field>
                        </FormControl>
                        {/* <FormMessage /> */}
                      </FormItem>
                    )}
                  />
                </Field>

                <div>
                  {/* Disable button if it's executing or both fields are empty */}
                  <Button className="w-full" disabled={isExecuting} type="submit">
                    {isExecuting ? <Icons.spinner className="size-4 animate-spin" /> : null}
                    Login
                  </Button>
                </div>
              </FieldGroup>
            </Fieldset>
          </form>
        </Form>
        <div className="mt-4">
          <Button
            className="w-full"
            disabled={isExecutingDemo}
            onClick={() => {
              executeDemo({})
            }}
            outline
          >
            {isExecutingDemo ? <Icons.spinner className="mr-2 size-4 animate-spin" /> : null}
            Login as Demo User
          </Button>
        </div>
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

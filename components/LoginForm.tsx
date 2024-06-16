"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  type LoginSchema as LoginSchemaType,
  LoginSchema,
} from "@/lib/validations"
import { login } from "@/server/actions/login"

export default function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")
  const [isPending, startTransition] = useTransition()

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: LoginSchemaType) {
    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data.error) {
            form.reset()
            return toast(data.error)
          }

          if (data.success) {
            form.reset()
            return toast(data.success)
          }
        })
        .catch(() => {
          toast("Something went wrong")
        })
    })
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <Label
                className="block text-sm font-medium leading-6 text-gray-900"
                htmlFor="email"
              >
                Email address
              </Label>
              <div className="mt-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          disabled={isPending}
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
                  className="block text-sm font-medium leading-6  text-gray-900"
                  htmlFor="password"
                >
                  Password
                </Label>
              </div>
              <div className="mt-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          disabled={isPending}
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
              <Button
                className="mt-6 w-full"
                disabled={isPending}
                type="submit"
              >
                {isPending ? (
                  // eslint-disable-next-line react/jsx-pascal-case
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Sign in
              </Button>
            </div>
          </form>
        </Form>
        <p className="text-md mt-5 text-center text-gray-600">
          Need an account?
          <Link className="ml-1 text-blue-500 hover:underline" href="/register">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

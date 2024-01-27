"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { useToast } from "@/components/ui/use-toast"
import { type LoginSchema as LoginSchemaType, LoginSchema } from "@/types"

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()

  async function onSubmit(data: LoginSchema) {
    setIsLoading(true)

    const login = await signIn("credentials", {
      ...data,
      redirect: false,
    })

    setIsLoading(false)

    if (login?.status === 401) {
      return toast({
        title: "Error",
        description: "Invalid email or password",
        variant: "destructive",
      })
    }

    router.push("/inbox")
    return toast({
      title: "Success",
      description: "You have been logged in",
      variant: "default",
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
        <form method="POST" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label
              className="block text-sm font-medium leading-6 text-gray-900"
              htmlFor="email"
            >
              Email address
            </Label>
            <div className="mt-2">
              <Input
                autoComplete="email"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                disabled={isLoading}
                id="email"
                required
                type="email"
                {...register("email")}
              />
              {errors.email ? (
                <p className="px-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              ) : null}
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
              <Input
                autoComplete="current-password"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                disabled={isLoading}
                id="password"
                required
                type="password"
                {...register("password")}
              />
            </div>
          </div>

          <div>
            <Button className="mt-6 w-full" disabled={isLoading} type="submit">
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Sign in
            </Button>
          </div>
        </form>

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

export default LoginForm

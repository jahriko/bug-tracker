"use client"
import { createIssue } from "@/actions/formAction"
import { projectIdAtom } from "@/lib/atoms"
import { IssueSchema, type IssueSchema as IssueSchemaType } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "./ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Textarea } from "./ui/textarea"
import { toast } from "./ui/use-toast"

export default function CreateIssue() {
  const [projectId, _] = useAtom(projectIdAtom)

  const form = useForm<IssueSchemaType>({
    resolver: zodResolver(IssueSchema),
    defaultValues: {
      title: "",
      description: "",
      label: "",
      status: "",
      priority: "",
    },
  })

  const router = useRouter()

  const onSubmit = async (data: IssueSchema) => {
    try {
      await createIssue(projectId, data)
      toast({
        title: "success",
        description: "Issue created successfully",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Cannot create issue",
        variant: "destructive",
      })

      console.log(error)
    }
  }

  return (
    <Sheet>
      <div className="flex space-x-2">
        <SheetTrigger asChild>
          <Button variant="default" size="sm">
            Create Issue
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="sm:max-w-2xl sm:rounded-3xl">
          <div className="mx-auto max-w-full">
            <div className="mx-auto w-full max-w-2xl items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none">
              <div className="-mx-4 w-full space-y-6 py-8 sm:mx-0 sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:pb-4 xl:pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <input type="hidden" name="projectId" value={projectId} />
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => {
                        return (
                          <FormItem className="grid w-full items-center gap-1.5">
                            <FormLabel htmlFor="issue title">
                              Issue Title
                            </FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => {
                        return (
                          <FormItem className="grid w-full items-center gap-1.5">
                            <FormLabel htmlFor="description">
                              Description
                            </FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />

                    <FormField
                      control={form.control}
                      name="label"
                      render={({ field }) => {
                        return (
                          <FormItem className="grid w-full items-center gap-1.5">
                            <FormLabel htmlFor="label">Label</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a label" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem value="bug">Bug</SelectItem>
                                    <SelectItem value="documentation">
                                      Documentation
                                    </SelectItem>
                                    <SelectItem value="feature">
                                      Feature
                                    </SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => {
                        return (
                          <FormItem className="mt-6 grid gap-1.5">
                            <FormLabel htmlFor="status">Status</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem value="in_progress">
                                      In Progress
                                    </SelectItem>
                                    <SelectItem value="done">Done</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />

                    <FormField
                      name="priority"
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <FormItem className="mt-6 grid gap-1.5">
                            <FormLabel htmlFor="priority">Priority</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a priority" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">
                                      Medium
                                    </SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                    <Button type="submit">Submit</Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </SheetContent>
      </div>
    </Sheet>
  )
}

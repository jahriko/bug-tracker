"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { createComment } from "@/server/actions/comment"

const FormSchema = z.object({
  comment: z.string(),
})

export default function IssueComment({ issueId }: { issueId: string }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const result = await createComment(Number(issueId), data)

    if (result.code === "error") {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }

    form.reset()

    return toast({
      title: "Success",
      description: result.message,
      variant: "default",
    })
  }

  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  className="resize-none px-4"
                  placeholder="Write your message here."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button size="sm" type="submit">
          Comment
        </Button>
      </form>
    </Form>
  )
}
